var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var engine = require('ejs-locals');
var dbadapter = require("./dbadapter");
var nodemailer = require('nodemailer');
const puppeteer = require('puppeteer')
var xl = require('excel4node');
var fs = require('fs');
var crypt = require('./public/encryption');

var app = express();
app.use(
    session({
        secret: "mysecret",
        resave: true,
        saveUninitialized: true,
        //cookie: { secure: true }
    })
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + "/public");
app.set('layout', 'layout');

var db = new dbadapter();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oasis4ever117@gmail.com',
        pass: 'Spring123@!!!!!!'
    }
});

function getDBAdapter(req) {
    //var db = new dbadapter();
    return db;
}

function sendJsonResult(res, obj) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(obj));
}

app.get("/", function(req, res) {
    if (req.session.loggedin)
        res.redirect("/dashboard");
    else
        res.redirect("/login");
});

app.get("/login", function(req, res) {
    res.render("login", {
        error: '',
        loginForm: {
            username: '',
            password: ''
        }
    });
});

app.post("/login", function(req, res) {
    var loginForm = req.body;
    var errMsg = "";

    db.validateCredential(loginForm, function(valid) {
        if (valid) {


            db.getUserByName(loginForm.username, function(user) {
                req.session.loggedin = true;
                req.session.username = loginForm.username;
                req.session.userid = user.id;
                req.session.isAdmin = user.role == 0 ? true : false;

                if (loginForm.remember)
                    req.session.cookie.originalMaxAge = 30 * 24 * 60 * 60 * 1000
                else
                    req.session.cookie.expires = false
                res.redirect("/dashboard");
            });
        } else {
            errMsg = "Username or Password is incorrect.";
            res.render("login", {
                error: errMsg,
                loginForm: loginForm
            });
        }
    });
});

app.get("/logout", function(req, res) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

app.get("/signup", function(req, res) {
    res.render("signup", {
        error: '',
        signupForm: {
            username: '',
            password: '',
            cpassword: '',
            email: '',
            fname: ''
        }
    });
});

app.post("/signup", function(req, res) {
    var signupForm = req.body;
    var errMsg = "";

    db.validateUser(signupForm, function(valid) {
        if (signupForm.password != signupForm.cpassword)
            errMsg = "Invalid confirm password.";
        else if (!valid)
            errMsg = "User or Email is already used.";

        if (errMsg != "")
            res.render("signup", {
                error: errMsg,
                signupForm: signupForm
            });
        else
            db.registerUser(signupForm, function(id) {
                if (id != null)
                    res.redirect("/login");
                else {
                    errMsg = "Cannot register user";
                    res.render("signup", {
                        error: errMsg,
                        signupForm: signupForm
                    });
                }
            });
    });
});

app.get("/forgetpwd", function(req, res) {
    res.render("forgotpwd", {
        error: ''
    });
});

app.post("/forgetpwd", function(req, res) {
    var forgotPwdForm = req.body;
    var error = "";
    db.getUserByMail(forgotPwdForm.email, function(user) {
        if (user.length == 1) {
            user = user[0];
            var mailOptions = {
                from: 'oasis4ever117@gmail.com',
                to: user.email,
                subject: 'Password Reset',
                text: req.headers.host + '/pwdreset?id=' + user.id + "&token=" + crypt.encrypt(user.id)
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('Failed to send email');
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            error = "Reset link is sent to your mail. Please check it.";
            res.render("forgotpwd", {
                error: error
            });
        } else {
            error = "Your Mail address is not registed.";

            res.render("forgotpwd", {
                error: error
            });
        }
    });
});

app.get("/pwdreset", function(req, res) {
    if (!req.query.id || !req.query.token)
        res.render("error", {});
    else {
        if (req.query.id != crypt.decrypt(req.query.token))
            res.render("error", {});
        else
            res.render("pwdreset", {
                url: req.originalUrl,
                error: ""
            });
    }
});

app.post("/pwdreset", function(req, res) {
    if (!req.query.id || !req.query.token)
        res.render("error", {});
    else {
        if (req.query.id != crypt.decrypt(req.query.token))
            res.render("error", {});
        else {
            var error = "";
            var pwdResetForm = req.body;
            if (pwdResetForm.password != pwdResetForm.cpassword) {
                error = "Invalid confirm password.";
                res.render("pwdreset", {
                    url: req.originalUrl,
                    error: error
                });
            } else {
                db.updateUserPassword(req.query.id, pwdResetForm.password, function(user) {
                    error = "Password has been successfully updated. Please try login."
                    res.render("pwdreset", {
                        url: req.originalUrl,
                        error: error
                    });
                });
            }
        }
    }
});

app.get("/users", isAdmin, function(req, res) {
    db.getAllUser(function(users) {
        db.getUserByID(req.session.userid, function(user) {
            res.render("users", {
                users: users,
                user: user,
                isadmin: req.session.isAdmin
            });
        });
    });
});

app.get("/user/sendcredential", isAdmin, function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        db.getUserByID(req.query.id, function(user) {
            var mailOptions = {
                from: 'oasis4ever117@gmail.com',
                to: user.email,
                subject: 'User Credentials',
                text: "Username : " + user.uname + "\n" + "Password : " + user.pwd
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.redirect("/users");
        });
    }
});

app.get("/user/rolechange", isAdmin, function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        db.changeRole(req.query.id, function(users) {
            res.redirect("/users");
        });
    }
});

app.post("/users/permission", isAdmin, function(req, res) {
    var { method, id } = req.body;
    db.updateUserPermission(method, id, function(user) {
        sendJsonResult(res, {
            user: user
        });
    });
});

app.post("/users/delete", isAdmin, function(req, res) {
    var { id } = req.body;
    db.deleteUser(id, function(user) {
        sendJsonResult(res, {
            user: user
        });
    });
});

app.get("/dashboard", isAuthorized, function(req, res) {
    db.getUserByID(req.session.userid, function(user) {
        db.getSharedSurveys(function(sharedSurveys) {
            if (req.session.isAdmin) {
                db.getAllSurveysWithFolder(function(surveys) {

                    var surveyWithFolder = [];
                    var surveyWithoutFolder = [];

                    db.getAllFolders(function(folders) {
                        for (let folder of folders) {
                            surveyWithFolder.push({
                                folderid: folder.id,
                                foldername: folder.name,
                                username: folder.uname,
                                data: []
                            });
                        }

                        for (let survey of surveys) {
                            if (survey.foldername == null)
                                surveyWithoutFolder.push(survey);
                            else {
                                var fPos = surveyWithFolder.findIndex(x => x.folderid == survey.folderid)
                                if (fPos > -1)
                                    surveyWithFolder[fPos]["data"].push(survey);
                            }
                        }

                        res.render("dashboard", {
                            user: user,
                            isadmin: req.session.isAdmin,
                            surveyWithFolder: surveyWithFolder,
                            surveyWithoutFolder: surveyWithoutFolder,
                            sharedSurveys: sharedSurveys
                        });
                    });
                });
            } else
                db.getSurveysforUser(req.session.userid, function(surveys) {
                    var surveyWithFolder = [];
                    var surveyWithoutFolder = [];
                    db.getFoldersByID(req.session.userid, function(folders) {
                        for (let folder of folders) {
                            surveyWithFolder.push({
                                folderid: folder.id,
                                foldername: folder.name,
                                data: []
                            });;
                        }
                        for (let survey of surveys) {
                            if (survey.foldername == null)
                                surveyWithoutFolder.push(survey);
                            else {
                                var fPos = surveyWithFolder.findIndex(x => x.folderid == survey.folderid)
                                if (fPos > -1)
                                    surveyWithFolder[fPos]["data"].push(survey);
                            }
                        }

                        res.render("dashboard", {
                            user: user,
                            isadmin: req.session.isAdmin,
                            surveyWithFolder: surveyWithFolder,
                            surveyWithoutFolder: surveyWithoutFolder,
                            sharedSurveys: sharedSurveys
                        });
                    });
                });
        });
    });
});

app.get("/profile", isAuthorized, function(req, res) {
    res.redirect("/profile/general");
});

app.get("/profile/general", isAuthorized, function(req, res) {
    db.getUserByID(req.session.userid, function(user) {
        res.render("profile/general", {
            user: user,
            error: '',
            isadmin: req.session.isAdmin
        });
    });
});

app.post("/profile/general", isAuthorized, function(req, res) {
    var userForm = req.body;
    var errMsg = "";
    db.validateUserByID(userForm, req.session.userid, function(valid) {
        if (!valid) {
            errMsg = "User or Email is already used.";
            db.getUserByID(req.session.userid, function(user) {
                res.render("profile/general", {
                    user: user,
                    error: errMsg,
                    isadmin: req.session.isAdmin
                });
            });
        } else
            db.updateUserInfo(req.session.userid, userForm, function(user) {
                res.render("profile/general", {
                    user: user,
                    error: '',
                    isadmin: req.session.isAdmin
                });
            });
    });
});

app.get("/profile/password", isAuthorized, function(req, res) {
    db.getUserByID(req.session.userid, function(user) {
        res.render("profile/password", {
            error: '',
            isadmin: req.session.isAdmin,
            user: user,
            credentialForm: {
                password: '',
                newpassword: '',
                confirmpassword: ''
            }
        });
    });
});

app.post("/profile/password", isAuthorized, function(req, res) {
    var credentialForm = req.body;
    credentialForm.username = req.session.username;
    var errMsg = "";
    db.validateCredential(credentialForm, function(valid) {
        if (!valid)
            errMsg = "Current Password is wrong.";
        else if (credentialForm.newpassword != credentialForm.confirmpassword)
            errMsg = "Invalid confirm password.";
        if (errMsg != "") {
            db.getUserByID(req.session.userid, function(user) {
                res.render("profile/password", {
                    user: user,
                    credentialForm: credentialForm,
                    error: errMsg,
                    isadmin: req.session.isAdmin
                });
            });
        } else {
            db.updateUserPassword(req.session.userid, credentialForm.newpassword, function(user) {
                res.render("profile/password", {
                    user: user,
                    credentialForm: credentialForm,
                    error: errMsg,
                    isadmin: req.session.isAdmin
                });
            });
        }
    });
});

app.get("/result", isAuthorized, function(req, res) {

    if (!req.query.id)
        res.render("error", {});
    else {
        var postId = req.query.id;

        db.getSurvey(postId, function(survey) {
            var surveyName = survey.name;
            var surveyId = survey.id;
            db.getUserByID(req.session.userid, function(user) {
                var tableHeader = [];
                var tableData = [];
                var json = JSON.parse(survey.json);
                var elementwithoutPage = [];

                if ('pages' in json) {
                    for (let page of json.pages) {
                        elementwithoutPage = elementwithoutPage.concat(page.elements);
                    }

                    var index = 0;
                    while (true) {
                        if (index >= elementwithoutPage.length)
                            break;

                        if (elementwithoutPage[index].type == "panel")
                            if ("elements" in elementwithoutPage[index])
                                elementwithoutPage.splice(index, 1, ...elementwithoutPage[index].elements)
                            else
                                elementwithoutPage.splice(index, 1)
                        index++;
                    }

                    for (let element of elementwithoutPage) {
                        var question = { name: '', title: '', type: '' }
                        question.name = element.name;
                        question.type = element.type;
                        if ('title' in element)
                            question.title = element.title
                        tableHeader.push(question);
                    }
                }

                db.getResults(postId, function(results) {
                    for (let result of results) {
                        jsonresult = JSON.parse(result.json);
                        var rowData = { id: result.id, data: [] };
                        for (let header of tableHeader) {
                            if (header.name in jsonresult) {
                                if (header.type == "file") {
                                    rowData.data.push(jsonresult[header.name][0]["name"]);
                                } else
                                    rowData.data.push(JSON.stringify(jsonresult[header.name]));
                            } else
                                rowData.data.push("");
                        }
                        tableData.push(rowData);
                    }

                    res.render("result", {
                        surveyname: surveyName,
                        surveyId: surveyId,
                        user: user,
                        isadmin: req.session.isAdmin,
                        tableHeader: tableHeader,
                        tableData: tableData
                    });
                });
            });
        });
    }
});

app.get("/pdf/result", function(req, res) {
    var surveyId = req.query.id;
    db.getSurvey(surveyId, function(survey) {
        var surveyName = survey.name;
        var tableHeader = [];
        var tableData = [];
        var surveyJson = JSON.parse(survey.json);

        if ("pages" in surveyJson) {
            for (let page of surveyJson.pages) {
                if ("elements" in page) {
                    for (let element of page.elements) {
                        var question = { name: '', title: '', element: {} }
                        question.name = element.name;
                        question.element = element;
                        if ('title' in element)
                            question.title = element.title

                        tableHeader.push(question);
                    }
                }
            }
        }

        db.getResults(surveyId, function(results) {
            for (let result of results) {
                jsonresult = JSON.parse(result.json);
                var rowData = [];
                for (let question of tableHeader) {
                    if (question.name in jsonresult) {
                        if (question.element.type == "file") {
                            rowData.push(jsonresult[question.name][0]["name"]);
                        } else if (question.element.type == "checkbox") {
                            var valArr = [];
                            for (let item of jsonresult[question.name]) {
                                posChoice = question.element.choices.findIndex(x => x.value === item);
                                if (posChoice > -1)
                                    valArr.push(question.element.choices[posChoice].text);
                                else
                                    valArr.push(item);
                            }
                            rowData.push(valArr.join(", "));
                        } else if (question.element.type == "radiogroup" || question.element.type == "dropdown") {
                            posChoice = question.element.choices.findIndex(x => x.value === jsonresult[question.name]);
                            if (posChoice > -1)
                                rowData.push(question.element.choices[posChoice].text);
                            else
                                rowData.push(jsonresult[question.name]);
                        } else if (question.element.type == "boolean") {
                            rowData.push(jsonresult[question.name] ? question.element.labelTrue : question.element.labelFalse);
                        } else if (question.element.type == "matrix") {
                            var matrixData = [];
                            for (const [, row] of question.element.rows.entries()) {
                                var value = "";
                                if (row in jsonresult[question.name])
                                    value = jsonresult[question.name][row];
                                matrixData.push({ row: row, val: value })
                            }
                            rowData.push(matrixData)

                        } else if (question.element.type == "matrixdropdown") {
                            var matrixDropDownData = [];

                            var headerData = [""];
                            for (const [rowIndex, row] of question.element.rows.entries()) {
                                var rData = [row];
                                for (const [colIndex, col] of question.element.columns.entries()) {
                                    if (rowIndex == 0) {
                                        headerData.push(col.name)
                                    }

                                    if (row in jsonresult[question.name]) {
                                        if (col.name in jsonresult[question.name][row])
                                            rData.push(jsonresult[question.name][row][col.name])
                                        else
                                            rData.push("")
                                    } else
                                        rData.push("")
                                }

                                if (rowIndex == 0) {
                                    matrixDropDownData.push(headerData);
                                }
                                matrixDropDownData.push(rData);
                            }

                            rowData.push(matrixDropDownData)
                        } else if (question.element.type == "multipletext") {
                            var multipleTextData = [];
                            for (let [, row] of question.element.items.entries()) {
                                var rowName = 'title' in row ? row.title : row.name;
                                if (row.name in jsonresult[question.name])
                                    value = jsonresult[question.name][row.name];
                                multipleTextData.push({ row: rowName, val: value })
                            }
                            rowData.push(multipleTextData)
                        } else
                            rowData.push(JSON.stringify(jsonresult[question.name]));
                    } else
                        rowData.push("");
                }
                tableData.push(rowData);
            }

            res.render("result_pdf", {
                surveyname: surveyName,
                surveyId: surveyId,
                tableHeader: tableHeader,
                tableData: tableData
            });
        });
    });
});

app.get("/result/export/pdf", function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        var surveyId = req.query.id;
        db.getSurvey(surveyId, function(survey) {
            var surveyName = survey.name;
            var filename = surveyName + "_result.pdf";
            (async() => {
                const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                const page = await browser.newPage()
                var url = req.protocol + '://' + req.get('host') + '/pdf/result?id=' + surveyId;
                await page.goto(url, { waitUntil: 'networkidle2' })
                await page.pdf({
                    path: filename,
                    format: 'A4',
                    printBackground: true,
                    margin: { left: '1cm', top: '1cm', right: '1cm', bottom: '1.5cm' }
                })

                res.download(filename, function(err) {
                    if (err) {
                        // Handle error, but keep in mind the response may be partially-sent
                        // so check res.headersSent
                    } else {
                        fs.unlink(filename, function(err) {
                            if (err) {
                                console.error(err.toString());
                            } else {
                                console.warn(filename + ' deleted');
                            }
                        });
                    }
                })
                browser.close()
            })()
        });
    }
});

app.get("/result/export/excel", isAuthorized, function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        var surveyId = req.query.id;
        db.getSurvey(surveyId, function(survey) {
            var surveyName = survey.name;
            var tableHeader = [];
            var surveyJson = JSON.parse(survey.json);
            var maxHeight = 1;

            if ("pages" in surveyJson) {
                for (let page of surveyJson.pages) {
                    if ("elements" in page) {
                        for (let element of page.elements) {
                            var question = { name: '', title: '', width: 1, height: 1, element: {} }
                            question.name = element.name;
                            question.element = element;
                            if ('title' in element)
                                question.title = element.title

                            if (question.element.type == "matrix" || question.element.type == "matrixdropdown") {
                                question.width = element.columns.length + 1;
                                question.height = element.rows.length + 1;
                            } else if (question.element.type == "multipletext") {
                                question.width = 2;
                                question.height = element.items.length;
                            }

                            if (question.height > maxHeight)
                                maxHeight = question.height;
                            tableHeader.push(question);
                        }
                    }
                }
            }
            // Create a new instance of a Workbook class
            var wb = new xl.Workbook();
            // Add Worksheets to the workbook
            var ws = wb.addWorksheet('Sheet 1');
            // Create a reusable style
            var questionHeaderStyle = wb.createStyle({
                font: {
                    color: '#000000',
                    size: 12,
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#D9D9D9',
                    fgColor: '#D9D9D9',
                }
            });

            const matrixBGStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#FFFF00',
                    fgColor: '#FFFF00',
                }
            });

            var startX = 1,
                startY = 1;
            //Add Header to Excel
            ws.cell(startY, startX).string("No").style(questionHeaderStyle);
            startX++;
            for (let question of tableHeader) {
                var text = question.title != "" ? question.title : question.name;
                if (question.width == 1)
                    ws.cell(startY, startX).string(text).style(questionHeaderStyle);
                else
                    ws.cell(startY, startX, startY, startX + question.width - 1, true).string(text).style(questionHeaderStyle);

                startX += question.width;
            }

            startX = 1;
            startY++;

            db.getResults(surveyId, function(results) {
                for (const [index, result] of results.entries()) {
                    ws.cell(startY, startX).number(index + 1);
                    startX++;
                    jsonresult = JSON.parse(result.json);
                    for (let question of tableHeader) {
                        if (question.name in jsonresult) {
                            if (question.element.type == "file") {
                                ws.cell(startY, startX).string(jsonresult[question.name][0]["name"]);
                            } else if (question.element.type == "checkbox") {
                                var valArr = [];
                                for (let item of jsonresult[question.name]) {
                                    posChoice = question.element.choices.findIndex(x => x.value === item);
                                    if (posChoice > -1)
                                        valArr.push(question.element.choices[posChoice].text);
                                    else
                                        valArr.push(item);
                                }
                                ws.cell(startY, startX).string(valArr.join(", "));
                            } else if (question.element.type == "radiogroup" || question.element.type == "dropdown") {

                                posChoice = question.element.choices.findIndex(x => x.value === jsonresult[question.name]);
                                if (posChoice > -1)
                                    ws.cell(startY, startX).string(question.element.choices[posChoice].text);
                                else
                                    ws.cell(startY, startX).string(jsonresult[question.name]);

                            } else if (question.element.type == "boolean") {
                                ws.cell(startY, startX).string(jsonresult[question.name] ? question.element.labelTrue : question.element.labelFalse);
                            } else if (question.element.type == "matrix") {
                                for (const [xIndex, col] of question.element.columns.entries()) {
                                    ws.cell(startY, startX + 1 + xIndex).string(col.toString());
                                }

                                for (const [yIndex, row] of question.element.rows.entries()) {
                                    ws.cell(startY + 1 + yIndex, startX).string(row.toString());
                                }

                                for (let [i, [row, col]] of Object.entries(jsonresult[question.name]).entries()) {
                                    var rowIndex = question.element.rows.indexOf(row);
                                    var colIndex = question.element.columns.indexOf(col);

                                    ws.cell(startY + rowIndex + 1, startX + colIndex + 1).style(matrixBGStyle);
                                }
                            } else if (question.element.type == "matrixdropdown") {
                                for (const [xIndex, col] of question.element.columns.entries()) {
                                    ws.cell(startY, startX + 1 + xIndex).string(col.name.toString());
                                }

                                for (const [yIndex, row] of question.element.rows.entries()) {
                                    ws.cell(startY + 1 + yIndex, startX).string(row.toString());
                                }

                                for (let [, [row, val]] of Object.entries(jsonresult[question.name]).entries()) {
                                    for (let [, [col, value]] of Object.entries(val).entries()) {
                                        var rowIndex = question.element.rows.indexOf(row);
                                        var colIndex = question.element.columns.findIndex(x => x.name === col);
                                        ws.cell(startY + rowIndex + 1, startX + colIndex + 1).string(value.toString());
                                    }
                                }
                            } else if (question.element.type == "multipletext") {
                                for (let [yIndex, row] of question.element.items.entries()) {
                                    ws.cell(startY + yIndex, startX).string(('title' in row ? row.title : row.name).toString());
                                    if (row.name in jsonresult[question.name])
                                        ws.cell(startY + yIndex, startX + 1).string(jsonresult[question.name][row.name]);
                                }
                            } else
                                ws.cell(startY, startX).string(jsonresult[question.name].toString());
                        } else
                            ws.cell(startY, startX).string("");

                        startX += question.width;
                    }

                    startX = 1;
                    startY += maxHeight + 2;
                }
                wb.write(surveyName + '_result.xlsx', res);
            });
        });
    }
});


app.get("/survey-creator", isAuthorized, function(req, res) {
    db.getUserByID(req.session.userid, function(user) {
        res.render("survey-creator", {
            user: user,
            isadmin: req.session.isAdmin
        });
    });
});

app.get("/survey", function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        var surveyId = req.query.id;
        db.getUserByID(req.session.userid, function(user) {
            db.getSurvey(surveyId, function(survey) {
                if (survey.active) {
                    if (survey.multiresponse) {
                        res.render("survey", {
                            user: user,
                            isadmin: req.session.isAdmin
                        });
                    } else {
                        db.getResultsCountForUser(surveyId, req.session.userid, function(result) {
                            cnt = parseInt(result.cnt);
                            if (cnt > 0) {
                                res.redirect("/dashboard");
                            } else {
                                res.render("survey", {
                                    user: user,
                                    isadmin: req.session.isAdmin
                                });
                            }
                        })
                    }
                } else {
                    res.redirect("/dashboard");
                }
            });
        });
    }
});

app.get("/run", function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        var surveyId = req.query.id;
        db.getSurvey(surveyId, function(survey) {
            if (survey.active) {
                res.render("surveyrun", {

                });
            } else {
                res.redirect("/dashboard");
            }
        });
    }
});

app.get("/survey/settings", isAuthorized, function(req, res) {
    if (!req.query.id)
        res.render("error", {});
    else {
        var surveyId = req.query.id;

        db.getUserByID(req.session.userid, function(user) {
            db.getSurvey(surveyId, function(survey) {
                res.render("surveysettings", {
                    user: user,
                    isadmin: req.session.isAdmin,
                    survey: survey,
                    error: ''
                });
            });
        });
    }
});

app.post("/survey/getTheme", function(req, res) {
    var { surveyId } = req.body;
    db.getSurvey(surveyId, function(survey) {
        sendJsonResult(res, survey);
    });
});

app.post("/survey/settings", isAuthorized, function(req, res) {
    var surveyThemeForm = req.body;
    db.getUserByID(req.session.userid, function(user) {
        db.saveSurveyTheme(surveyThemeForm, function(survey) {
            res.render("surveysettings", {
                user: user,
                isadmin: req.session.isAdmin,
                survey: survey,
                error: ''
            });
        });
    });
});

app.post("/survey/folder", isAuthorized, function(req, res) {
    var { surveyId, folderId } = req.body;
    db.getUserforFolder(folderId, function(folder_user) {
        db.moveToFolder(surveyId, folderId, folder_user.userid, function() {
            sendJsonResult(res, {});
        });
    });
});

app.get("/share", isAuthorized, function(req, res) {
    var surveyId = req.query["id"];
    db.shareSurveyByID(surveyId, function() {
        res.redirect("/dashboard");
    });
});

app.get("/copy", isAuthorized, function(req, res) {
    var surveyId = req.query["id"];
    db.copySurveyByID(surveyId, req.session.userid, function() {
        res.redirect("/dashboard");
    });
});

app.get("/mail", isAuthorized, function(req, res) {
    var surveyid = req.query["id"];
    db.getUserByID(req.session.userid, function(user) {
        var mailOptions = {
            from: 'oasis4ever117@gmail.com',
            to: user.email,
            subject: 'Survey Link',
            text: req.headers.host + '/run?id=' + surveyid.toString()
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.redirect("/dashboard");
    });
});

app.get("/report", isAuthorized, function(req, res) {
    var surveyId = req.query.id;
    db.getSurvey(surveyId, function(survey) {
        var surveyName = survey.name;
        surveyJson = JSON.parse(survey.json);
        db.getResultsforJson(surveyId, function(results) {
            var reportData = [];
            try {
                if ("pages" in surveyJson) {
                    for (let page of surveyJson.pages) {
                        if ("elements" in page) {
                            for (let element of page.elements) {
                                elementData = {};
                                if ('title' in element)
                                    elementData["title"] = element.title;
                                else
                                    elementData["title"] = element.name;
                                elementData["name"] = element.name;
                                elementData["type"] = element.type;

                                if (element.type == 'rating') {
                                    elementData["choices"] = [];

                                    var rateValues = [];
                                    if ('rateValues' in element) {
                                        for (let item of element.rateValues) {
                                            if (typeof item === 'number') {
                                                elementData["choices"].push(item)
                                                rateValues.push({
                                                    "value": item,
                                                    "text": item.toString()
                                                });
                                            } else {
                                                elementData["choices"].push(item.text)
                                                rateValues.push(item);
                                            }
                                        }
                                    } else {
                                        elementData["choices"] = [1, 2, 3, 4, 5];
                                        rateValues = [{
                                            "value": 1,
                                            "text": "1"
                                        }, {
                                            "value": 2,
                                            "text": "2"
                                        }, {
                                            "value": 3,
                                            "text": "3"
                                        }, {
                                            "value": 4,
                                            "text": "4"
                                        }, {
                                            "value": 5,
                                            "text": "5"
                                        }, ]
                                    }

                                    elementData["count"] = Array(elementData["choices"].length).fill(0);
                                    elementData["percent"] = [];
                                    var totalCnt = 0;

                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            var posChoice = -1;
                                            posChoice = rateValues.findIndex(x => x.value === result[element.name]);
                                            if (posChoice != -1) {
                                                elementData["count"][posChoice] += 1;
                                                totalCnt += 1;
                                            }
                                        }
                                    }
                                    elementData["total"] = totalCnt;
                                    for (let cnt of elementData["count"]) {
                                        elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    reportData.push(elementData);
                                } else if (element.type == 'boolean') {
                                    elementData["choices"] = [element.labelTrue, element.labelFalse];
                                    elementData["count"] = Array(2).fill(0);
                                    elementData["percent"] = [];
                                    var totalCnt = 0;
                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            if (result[element.name])
                                                elementData["count"][0] += 1
                                            else
                                                elementData["count"][1] += 1
                                            totalCnt += 1;
                                        }
                                    }
                                    elementData["total"] = totalCnt;
                                    for (let cnt of elementData["count"]) {
                                        elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    reportData.push(elementData);
                                } else if (element.type == 'imagepicker') {
                                    elementData["choices"] = element.choices.map(a => a.value);
                                    elementData["count"] = Array(element.choices.length).fill(0);
                                    elementData["percent"] = [];
                                    var totalCnt = 0;
                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            var posChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                            if (posChoice != -1) {
                                                elementData["count"][posChoice] += 1;
                                                totalCnt += 1;
                                            }
                                        }
                                    }
                                    elementData["total"] = totalCnt;
                                    for (let cnt of elementData["count"]) {
                                        elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    reportData.push(elementData);
                                } else if (element.type == 'radiogroup' || element.type == 'dropdown') {
                                    elementData["choices"] = [];
                                    for (let item of element.choices) {
                                        if (typeof item === 'string') {
                                            elementData["choices"].push(item)
                                        } else {
                                            elementData["choices"].push(item.text)
                                        }
                                    }

                                    elementData["count"] = Array(element.choices.length).fill(0);
                                    elementData["percent"] = [];
                                    var totalCnt = 0;
                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            var posStrChoice = element.choices.indexOf(result[element.name]);
                                            var posArrChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                            var posChoice = posStrChoice != -1 ? posStrChoice : posArrChoice;
                                            if (posChoice != -1) {
                                                elementData["count"][posChoice] += 1;
                                                totalCnt += 1;
                                            }
                                        }
                                    }
                                    elementData["total"] = totalCnt;
                                    for (let cnt of elementData["count"]) {
                                        elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    reportData.push(elementData);
                                } else if (element.type == 'matrix') {
                                    elementData['choices'] = element.columns;
                                    elementData["rows"] = [];
                                    for (let row of element.rows) {
                                        var totalCnt = 0;
                                        rowData = {};
                                        rowData["title"] = row;
                                        rowData["count"] = Array(element.columns.length).fill(0);
                                        rowData["name"] = uuidv4();
                                        rowData["percent"] = [];
                                        for (let result of results) {
                                            result = JSON.parse(result);
                                            if (element.name in result) {
                                                if (row in result[element.name]) {
                                                    var posChoice = element.columns.indexOf(result[element.name][row]);
                                                    if (posChoice != -1) {
                                                        rowData["count"][posChoice] += 1;
                                                        totalCnt += 1;
                                                    }
                                                }
                                            }
                                        }
                                        for (let cnt of rowData["count"]) {
                                            rowData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                        }
                                        rowData["total"] = totalCnt;
                                        elementData["rows"].push(rowData);
                                    }
                                    reportData.push(elementData);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
            db.getUserByID(req.session.userid, function(user) {
                res.render("report", {
                    reportdata: reportData,
                    surveyname: surveyName,
                    surveyId: surveyId,
                    user: user,
                    isadmin: req.session.isAdmin
                });
            });

        });
    });
});

app.get("/report/export/pdf", isAuthorized, function(req, res) {
    var surveyId = req.query.id;
    db.getSurvey(surveyId, function(survey) {
        var surveyName = survey.name;
        var filename = surveyName + "_report.pdf";
        (async() => {
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            var url = req.protocol + '://' + req.get('host') + '/pdf/report?id=' + surveyId;
            await page.goto(url, { waitUntil: 'networkidle2' })
            await page.pdf({
                path: filename,
                format: 'A4',
                printBackground: true,
                margin: { left: '1cm', top: '1cm', right: '1cm', bottom: '1.5cm' }
            })

            res.download(filename, function(err) {
                if (err) {
                    // Handle error, but keep in mind the response may be partially-sent
                    // so check res.headersSent
                } else {
                    fs.unlink(filename, function(err) {
                        if (err) {
                            console.error(err.toString());
                        } else {
                            console.warn(filename + ' deleted');
                        }
                    });
                }
            })
            browser.close()
        })()
    });
});

app.get("/pdf/report", function(req, res) {
    var surveyId = req.query.id;
    db.getSurvey(surveyId, function(survey) {
        var surveyName = survey.name;
        var surveyJson = JSON.parse(survey.json);
        var reportData = [];
        db.getResultsforJson(surveyId, function(results) {
            if ("pages" in surveyJson) {
                for (let page of surveyJson.pages) {
                    if ("elements" in page) {
                        for (let element of page.elements) {
                            elementData = {};
                            if ('title' in element)
                                elementData["title"] = element.title;
                            else
                                elementData["title"] = element.name;
                            elementData["name"] = element.name;
                            elementData["type"] = element.type;

                            if (element.type == 'rating') {
                                elementData["choices"] = [];

                                var rateValues = [];
                                if ('rateValues' in element) {
                                    for (let item of element.rateValues) {
                                        if (typeof item === 'number') {
                                            elementData["choices"].push(item)
                                            rateValues.push({
                                                "value": item,
                                                "text": item.toString()
                                            });
                                        } else {
                                            elementData["choices"].push(item.text)
                                            rateValues.push(item);
                                        }
                                    }
                                } else {
                                    elementData["choices"] = [1, 2, 3, 4, 5];
                                    rateValues = [{
                                        "value": 1,
                                        "text": "1"
                                    }, {
                                        "value": 2,
                                        "text": "2"
                                    }, {
                                        "value": 3,
                                        "text": "3"
                                    }, {
                                        "value": 4,
                                        "text": "4"
                                    }, {
                                        "value": 5,
                                        "text": "5"
                                    }, ]
                                }

                                elementData["count"] = Array(elementData["choices"].length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;

                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posChoice = -1;
                                        posChoice = rateValues.findIndex(x => x.value === result[element.name]);
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }

                                reportData.push(elementData);
                            } else if (element.type == 'boolean') {
                                elementData["choices"] = [element.labelTrue, element.labelFalse];
                                elementData["count"] = Array(2).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        if (result[element.name])
                                            elementData["count"][0] += 1
                                        else
                                            elementData["count"][1] += 1
                                        totalCnt += 1;
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }
                                reportData.push(elementData);
                            } else if (element.type == 'imagepicker') {
                                elementData["choices"] = element.choices.map(a => a.value);
                                elementData["count"] = Array(element.choices.length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }
                                reportData.push(elementData);
                            } else if (element.type == 'radiogroup' || element.type == 'dropdown') {
                                elementData["choices"] = [];
                                for (let item of element.choices) {
                                    if (typeof item === 'string') {
                                        elementData["choices"].push(item)
                                    } else {
                                        elementData["choices"].push(item.text)
                                    }
                                }

                                elementData["count"] = Array(element.choices.length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posStrChoice = element.choices.indexOf(result[element.name]);
                                        var posArrChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                        var posChoice = posStrChoice != -1 ? posStrChoice : posArrChoice;
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }
                                reportData.push(elementData);
                            } else if (element.type == 'matrix') {
                                elementData['choices'] = element.columns;
                                elementData["rows"] = [];
                                for (let row of element.rows) {
                                    var totalCnt = 0;
                                    rowData = {};
                                    rowData["title"] = row;
                                    rowData["count"] = Array(element.columns.length).fill(0);
                                    rowData["name"] = uuidv4();
                                    rowData["percent"] = [];
                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            if (row in result[element.name]) {
                                                var posChoice = element.columns.indexOf(result[element.name][row]);
                                                if (posChoice != -1) {
                                                    rowData["count"][posChoice] += 1;
                                                    totalCnt += 1;
                                                }
                                            }
                                        }
                                    }
                                    for (let cnt of rowData["count"]) {
                                        rowData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    rowData["total"] = totalCnt;
                                    elementData["rows"].push(rowData);
                                }
                                reportData.push(elementData);
                            } else {
                                reportData.push(elementData);
                            }
                        }
                    }
                }
            }

            res.render("report_pdf", {
                reportdata: reportData,
                surveyname: surveyName,
                surveyId: surveyId
            });
        });
    });
});

app.get("/report/export/excel", isAuthorized, function(req, res) {
    var surveyId = req.query.id;
    db.getSurvey(surveyId, function(survey) {
        var surveyName = survey.name;
        var surveyJson = JSON.parse(survey.json);
        var startX = 1,
            startY = 1;
        // Create a new instance of a Workbook class
        var wb = new xl.Workbook();
        // Add Worksheets to the workbook
        var ws = wb.addWorksheet('Sheet 1');
        // Create a reusable style
        var questionTitleStyle = wb.createStyle({
            font: {
                color: '#000000',
                size: 14,
            },
            alignment: {
                horizontal: 'center',
            },
        });

        var questionHeaderStyle = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
            },
            alignment: {
                horizontal: 'center',
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#D9D9D9',
                fgColor: '#D9D9D9',
            }
        });

        db.getResultsforJson(surveyId, function(results) {
            if ("pages" in surveyJson) {
                for (let page of surveyJson.pages) {
                    if ("elements" in page) {
                        for (let element of page.elements) {
                            elementData = {};
                            if ('title' in element)
                                elementData["title"] = element.title;
                            else
                                elementData["title"] = element.name;
                            elementData["name"] = element.name;
                            elementData["type"] = element.type;

                            if (element.type == 'rating') {
                                elementData["choices"] = [];

                                var rateValues = [];
                                if ('rateValues' in element) {
                                    for (let item of element.rateValues) {
                                        if (typeof item === 'number') {
                                            elementData["choices"].push(item)
                                            rateValues.push({
                                                "value": item,
                                                "text": item.toString()
                                            });
                                        } else {
                                            elementData["choices"].push(item.text)
                                            rateValues.push(item);
                                        }
                                    }
                                } else {
                                    elementData["choices"] = [1, 2, 3, 4, 5];
                                    rateValues = [{
                                        "value": 1,
                                        "text": "1"
                                    }, {
                                        "value": 2,
                                        "text": "2"
                                    }, {
                                        "value": 3,
                                        "text": "3"
                                    }, {
                                        "value": 4,
                                        "text": "4"
                                    }, {
                                        "value": 5,
                                        "text": "5"
                                    }, ]
                                }

                                elementData["count"] = Array(elementData["choices"].length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;

                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posChoice = -1;
                                        posChoice = rateValues.findIndex(x => x.value === result[element.name]);
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }
                            } else if (element.type == 'boolean') {
                                elementData["choices"] = [element.labelTrue, element.labelFalse];
                                elementData["count"] = Array(2).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        if (result[element.name])
                                            elementData["count"][0] += 1
                                        else
                                            elementData["count"][1] += 1
                                        totalCnt += 1;
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }

                            } else if (element.type == 'imagepicker') {
                                elementData["choices"] = element.choices.map(a => a.value);
                                elementData["count"] = Array(element.choices.length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }

                            } else if (element.type == 'radiogroup' || element.type == 'dropdown') {
                                elementData["choices"] = [];
                                for (let item of element.choices) {
                                    if (typeof item === 'string') {
                                        elementData["choices"].push(item)
                                    } else {
                                        elementData["choices"].push(item.text)
                                    }
                                }

                                elementData["count"] = Array(element.choices.length).fill(0);
                                elementData["percent"] = [];
                                var totalCnt = 0;
                                for (let result of results) {
                                    result = JSON.parse(result);
                                    if (element.name in result) {
                                        var posStrChoice = element.choices.indexOf(result[element.name]);
                                        var posArrChoice = element.choices.findIndex(x => x.value === result[element.name]);
                                        var posChoice = posStrChoice != -1 ? posStrChoice : posArrChoice;
                                        if (posChoice != -1) {
                                            elementData["count"][posChoice] += 1;
                                            totalCnt += 1;
                                        }
                                    }
                                }
                                elementData["total"] = totalCnt;
                                for (let cnt of elementData["count"]) {
                                    elementData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                }
                            } else if (element.type == 'matrix') {
                                elementData['choices'] = element.columns;
                                elementData["rows"] = [];
                                for (let row of element.rows) {
                                    var totalCnt = 0;
                                    rowData = {};
                                    rowData["title"] = row;
                                    rowData["count"] = Array(element.columns.length).fill(0);
                                    rowData["name"] = uuidv4();
                                    rowData["percent"] = [];
                                    for (let result of results) {
                                        result = JSON.parse(result);
                                        if (element.name in result) {
                                            if (row in result[element.name]) {
                                                var posChoice = element.columns.indexOf(result[element.name][row]);
                                                if (posChoice != -1) {
                                                    rowData["count"][posChoice] += 1;
                                                    totalCnt += 1;
                                                }
                                            }
                                        }
                                    }
                                    for (let cnt of rowData["count"]) {
                                        rowData["percent"].push((totalCnt > 0 ? cnt * 100 / totalCnt : 0).toFixed(2));
                                    }
                                    rowData["total"] = totalCnt;
                                    elementData["rows"].push(rowData);
                                }
                            }

                            switch (elementData.type) {
                                case 'rating':
                                case 'boolean':
                                case 'imagepicker':
                                case 'radiogroup':
                                case 'dropdown':
                                    ws.cell(startY, 1, startY, 3, true).string(elementData["title"].toString()).style(questionTitleStyle);
                                    startY++;

                                    ws.cell(startY, 1).string("Answer Choices").style(questionHeaderStyle);
                                    ws.cell(startY, 2, startY, 3, true).string("Responses").style(questionHeaderStyle);
                                    startY++;
                                    for (let [index, choice] of elementData['choices'].entries()) {
                                        ws.cell(startY, startX).string(choice.toString()).style(questionHeaderStyle);
                                        ws.cell(startY, startX + 1).number(elementData.count[index]);
                                        ws.cell(startY, startX + 2).string(elementData.percent[index].toString() + "%");
                                        startY++;
                                    }
                                    break;
                                case 'matrix':
                                    ws.cell(startY, 1, startY, elementData['choices'].length * 2 + 1, true).string(elementData["title"].toString()).style(questionTitleStyle);
                                    startY++;

                                    ws.cell(startY, 1).string("").style(questionHeaderStyle);
                                    for (let [index, choice] of elementData.choices.entries())
                                        ws.cell(startY, index * 2 + 2, startY, index * 2 + 3, true).string(choice.toString()).style(questionHeaderStyle);

                                    startY++;
                                    for (let row of elementData.rows) {
                                        ws.cell(startY, 1).string(row.title.toString()).style(questionHeaderStyle);
                                        for (let [index, ] of elementData.choices.entries()) {
                                            ws.cell(startY, 2 + index * 2).string(row.percent[index].toString() + "%");
                                            ws.cell(startY, 3 + index * 2).number(row.count[index]);
                                        }
                                        startY++;
                                    }
                                    break;
                                default:
                                    ws.cell(startY, 1, startY, 3, true).string(elementData["title"].toString()).style(questionTitleStyle);
                                    startY++;
                                    break;

                            }


                            startY += 3;
                        }
                    }
                }
            }
            wb.write(surveyName + '_report.xlsx', res);
        });
    });
});


app.post("/folder/create", isAuthorized, function(req, res) {
    var folderForm = req.body;
    db.createFolder(folderForm.foldername, req.session.userid, function(result) {
        res.redirect("/dashboard");
    });
});

app.post("/folder/get", isAuthorized, function(req, res) {
    if (req.session.isAdmin)
        db.getAllFolders(function(folders) {
            sendJsonResult(res, {
                folders: folders
            });
        });
    else
        db.getFoldersByID(req.session.userid, function(folders) {
            sendJsonResult(res, {
                folders: folders
            });
        });
});

app.post("/folder/delete", isAuthorized, function(req, res) {
    var { folder } = req.body;
    db.deleteFolder(folder, function(result) {
        sendJsonResult(res, {});
    });
});

app.get("/getActive", function(req, res) {
    if (req.session.isAdmin) {
        db.getAllSurveys(function(result) {
            sendJsonResult(res, result);
        });
    } else
        db.getSurveysforUser(req.session.userid, function(result) {
            sendJsonResult(res, result);
        });
});

app.get("/getSurvey", function(req, res) {
    var db = getDBAdapter(req);
    var surveyId = req.query["surveyId"];
    db.getSurvey(surveyId, function(result) {
        sendJsonResult(res, JSON.parse(result.json));
    });
});

app.get("/changeName", function(req, res) {
    var id = req.query["id"];
    var name = req.query["name"];
    db.changeName(id, name, function(result) {
        sendJsonResult(res, result);
    });
});

app.get("/create", function(req, res) {
    var name = req.query["name"];
    db.addSurvey(name, req.session.userid, function(result) {
        res.redirect('/dashboard');
    });
});

app.post("/changeJson", function(req, res) {
    var id = req.body.Id;
    var json = req.body.Json;
    db.storeSurvey(id, json, function(result) {
        sendJsonResult(res, result.json);
    });
});

app.post("/post", function(req, res) {
    var db = getDBAdapter(req);
    var postId = req.body.postId;
    var surveyResult = req.body.surveyResult;
    db.postResults(req.session.userid, postId, surveyResult, function(result) {
        sendJsonResult(res, result.json);
    });
});

app.get("/delete", function(req, res) {
    var surveyId = req.query["id"];
    db.deleteSurvey(surveyId, function(result) {
        res.redirect('/dashboard');
    });
});

app.get("/results", function(req, res) {
    var postId = req.query["postId"];
    db.getResultsforJson(postId, function(result) {
        sendJsonResult(res, result);
    });
});

app.get("/result/getOne", function(req, res) {
    var resultid = req.query["resultId"];
    db.getResult(resultid, function(result) {
        sendJsonResult(res, result.json);
    });
});


app.get('*', function(req, res) {
    res.render("error", {});
});

function isAuthorized(req, res, next) {
    if (req.session.loggedin)
        next();
    else
        res.redirect("/login")
}

function isAdmin(req, res, next) {
    if (req.session.loggedin && req.session.isAdmin)
        next();
    else
        res.redirect("/login")
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening!");
});