var pgp = require("pg-promise")( /*options*/ );
//var pgp = require('mysql');

function PostgresDBAdapter() {
    //var db = pgp(process.env.DATABASE_URL || "postgres://vcceyykp:XrwWc-QWGBdBxAsbo9CcUI8IrsjCgYpr@balarama.db.elephantsql.com:5432/vcceyykp");
    //var db = pgp("postgres://postgres:spring123@localhost:5432/survey");

    var db = pgp("postgres://samjad1:password@postgresql-12147-0.cloudclusters.net:12160/survey");
   // var db = pgp(process.env.DATABASE_URL || "postgres://tmolubrxfrybno:d5895edbb23abab523fc18e029651877c21e053e323b428c759409470010b1f2@ec2-52-2-43-242.compute-1.amazonaws.com:5432/d4ek6fen8mc8un?ssl=true");
    // var db = pgp.createConnection({
    //     host: "localhost",
    //     user: "root",
    //     password: "",
    //     database: "survay"
    // });
//   connection.connect(function (error) {
//       if (!!error) {
//           console.log(error);
//       } else {
//           console.log('Connected!:)');
//       }
//   });
//$dbconn = pgp("host=SG-samjad-1001-pgsql-master.servers.mongodirector.com user=sgpostgres password=u5oimnD^jhVp95ry dbname=<your-database-name> port=5432 sslmode=verify-ca sslrootcert=<Path to ca.pem file>");
    function validateCredential(loginForm, callback) {
        db
            .any('SELECT * FROM users WHERE uname = $1 and pwd =$2', [
                loginForm.username,
                loginForm.password
            ])
            .then(function(users) {
                if (users.length == 1)
                    callback(true)
                else
                    callback(false)
            });
    }

    function validateUser(user, callback) {
        db
            .any('SELECT * FROM users WHERE uname = $1 OR email = $2', [
                user.username,
                user.email,
            ])
            .then(function(users) {
                if (users.length == 0)
                    callback(true)
                else
                    callback(false)
            });
    }

    function validateUserByID(user, id, callback) {
        db
            .any('SELECT * FROM users WHERE (uname = $1 OR email = $2) AND id != $3', [
                user.username,
                user.email,
                id
            ])
            .then(function(users) {
                if (users.length == 0)
                    callback(true)
                else
                    callback(false)
            });
    }

    function getUserByMail(mail, callback) {
        db
            .any('SELECT * FROM users WHERE email = $1', [
                mail
            ])
            .then(callback);
    }

    function registerUser(signupForm, callback) {
        db
            .one("INSERT INTO users (uname, pwd, email, fname, role, p_create, p_edit, p_delete) VALUES($1, $2, $3, $4, 1, false, false, false) RETURNING id", [
                signupForm.username,
                signupForm.password,
                signupForm.email,
                signupForm.fname
            ])
            .then(callback);
    }

    function getUserByName(username, callback) {
        db
            .one('SELECT * FROM users WHERE uname = $1', [
                username
            ])
            .then(function(user) {
                callback(user);
            });
    }

    function getUserByID(id, callback) {
        db
            .one('SELECT * FROM users WHERE id = $1', [
                id
            ])
            .then(callback);
    }

    function getAllUser(callback) {
        db
            .any('SELECT * FROM users ORDER BY role,uname ASC')
            .then(function(users) {
                callback(users);
            });
    }

    function updateUserInfo(id, userForm, callback) {
        db
            .one('UPDATE users SET uname = $1, fname=$2, email=$3 WHERE id = $4 RETURNING *', [
                userForm.uname,
                userForm.fname,
                userForm.email,
                id,
            ])
            .then(function(user) {
                callback(user);
            });
    }

    function updateUserPermission(method, id, callback) {
        db
            .one('UPDATE users SET $1~ = NOT $1~ WHERE id = $2 RETURNING *', [
                method,
                id
            ])
            .then(function(user) {
                callback(user);
            });
    }

    function updateUserPassword(id, password, callback) {
        db
            .one('UPDATE users SET pwd=$1  WHERE id = $2 RETURNING *', [
                password,
                id
            ])
            .then(function(user) {
                callback(user);
            });
    }

    function deleteUser(id, callback) {
        db
            .one("DELETE FROM users WHERE id=$1 RETURNING *", [id])
            .then(function(user) {
                callback(user);
            });
    }

    function changeRole(userid, callback) {
        db
            .one('UPDATE users SET role = 1-role  WHERE id = $1 RETURNING *', [
                userid
            ])
            .then(callback);
    }

    function addSurvey(name, userid, callback) {
        db
            .one("INSERT INTO surveys (name, json, userid) VALUES($1, $2, $3) RETURNING *", [
                name,
                "{}",
                userid
            ])
            .then(callback);
    }

    function postResults(userid, postId, json, callback) {
        db
            .one("INSERT INTO results (postid, json, userid) VALUES($1, $2, $3) RETURNING *", [
                postId,
                json,
                userid
            ])
            .then(callback);
    }

    function getResultsforJson(postId, callback) {
        db
            .any("SELECT * FROM results WHERE postid=$1", [postId])
            .then(function(data) {

                /*
                var objects = (data || []).map(function(item) {
                    return item;
                });
                console.log(objects);
                */
                //console.log(JSON.stringify(data));
                var results = (data || []).map(function(item) {
                    return item["json"];
                });

                callback(results);
            });
    }


    function getResults(postId, callback) {
        db
            .any("SELECT * FROM results WHERE postid=$1", [postId])
            .then(function(data) {
                callback(data);
            });
    }

    function getResult(resultid, callback) {
        db
            .one("SELECT * FROM results WHERE id=$1", [resultid])
            .then(function(data) {
                callback(data);
            });
    }

    function getResultsCountForUser(surveyid, userid, callback) {
        db
            .one("SELECT count(id) as cnt FROM results WHERE postid=$1 AND userid = $2", [
                surveyid,
                userid
            ])
            .then(callback);
    }


    function shareSurveyByID(surveyId, callback) {
        db
            .any("UPDATE surveys set share = NOT share WHERE id=$1", [surveyId])
            .then(callback);
    }

    function deleteSurvey(surveyId, callback) {
        db
            .one("DELETE FROM surveys WHERE id=$1 RETURNING *", [surveyId])
            .then(function(data) {
                db.any("DELETE FROM results WHERE postid=$1 RETURNING *", [surveyId])
                    .then(callback);
            });
    }

    function saveSurveyTheme(surveyThemeForm, callback) {
        db
            .one("UPDATE surveys set q_textcolor = $1, q_backcolor = $2, q_font = $3, a_textcolor = $4, a_font = $5, multiresponse = $6, active = $7 WHERE id=$8 RETURNING *", [
                surveyThemeForm.question_textcolor,
                surveyThemeForm.question_backcolor,
                surveyThemeForm.question_font,
                surveyThemeForm.answer_textcolor,
                surveyThemeForm.answer_font,
                surveyThemeForm.multiresponse ? true : false,
                surveyThemeForm.activation ? true : false,
                surveyThemeForm.surveyId,
            ])
            .then(callback);
    }

    function getUserforSurvey(surveyid, callback) {
        db
            .one("SELECT userid from surveys WHERE id = $1", [surveyid])
            .then(callback);
    }

    function getUserforFolder(folderid, callback) {
        db
            .one("SELECT userid from folders WHERE id = $1", [folderid])
            .then(callback);
    }

    function moveToFolder(surveyId, folderid, userid, callback) {
        db
            .any("UPDATE surveys set folderid = $1, userid = $2 WHERE id=$3 RETURNING *", [folderid, userid, surveyId])
            .then(callback);
    }

    function changeName(id, name, callback) {
        db
            .one("UPDATE surveys SET name = $1 WHERE id = $2 RETURNING *", [name, id])
            .then(callback);
    }

    function storeSurvey(id, json, callback) {
        db
            .one("UPDATE surveys SET json = $1 WHERE id = $2 RETURNING *", [json, id])
            .then(callback);
    }

    function getSurveysforUser(userid, callback) {
        db
            .any("select survey.*, ( select count(results.json) from results  where survey.id = results.postid) as responses from (SELECT surveys.*, TO_CHAR(surveys.created_time,'YYYY-MM-DD HH-MI-SS') AS cdate, folders.name as foldername FROM surveys left JOIN folders on surveys.folderid = folders.id  WHERE surveys.userid = $1 ORDER BY created_time desc) as survey", [userid])
            .then(function(result) {
                if (result.length > 0) {
                    callback(result);
                } else {
                    callback([]);
                }
            });
    }

    function getAllSurveys(callback) {
        db
            .any("SELECT s.*, u.uname FROM surveys as s, users as u WHERE s.userid = u.id ORDER BY created_time DESC")
            .then(function(result) {
                if (result.length > 0) {
                    callback(result);
                } else {
                    callback({});
                }
            });
    }

    function getAllSurveysWithFolder(callback) {
        db
            .any("select survey.*, (select count(results.json) from results  where survey.id = results.postid) as responses from (SELECT surveys.*, TO_CHAR(surveys.created_time,'YYYY-MM-DD HH-MI-SS') AS cdate, users.uname, folders.name as foldername FROM surveys inner join users on surveys.userid = users.id left JOIN folders on surveys.folderid = folders.id  ORDER BY created_time desc) as survey")
            .then(function(result) {
                if (result.length > 0) {
                    callback(result);
                } else {
                    callback({});
                }
            });
    }

    function getSharedSurveys(callback) {
        db
            .any("SELECT s.*, u.uname FROM surveys as s, users as u WHERE share=true AND s.userid = u.id ORDER BY created_time DESC")
            .then(function(result) {
                if (result.length > 0) {
                    callback(result);
                } else {
                    callback([]);
                }
            });
    }

    function copySurveyByID(surveyId, userid, callback) {
        db
            .one("INSERT INTO surveys (name, json, userid, q_font, a_font, q_textcolor, q_backcolor, a_textcolor) SELECT name, json, $1, q_font, a_font, q_textcolor, q_backcolor, a_textcolor FROM surveys WHERE id = $2 RETURNING *", [
                userid,
                surveyId
            ])
            .then(callback);
    }

    function getAllSurveysAsJson(callback) {
        db.any("SELECT * FROM surveys ORDER BY created_time, name DESC").then(function(result) {
            var objects = {};
            (result || []).forEach(function(item) {
                objects[item.id] = item;
            });
            if (Object.keys(objects).length > 0) {
                callback(objects);
            } else {
                callback({});
            }
        });
    }

    function createFolder(name, userid, callback) {
        db
            .one("INSERT INTO folders (name, userid) VALUES($1,$2) RETURNING *", [
                name,
                userid
            ])
            .then(callback);
    }

    function getFoldersByID(userid, callback) {
        db
            .any("SELECT * FROM folders WHERE userid=$1 ORDER BY created_time DESC", [
                userid
            ])
            .then(callback);
    }

    function getAllFolders(callback) {
        db
            .any("SELECT folders.*, users.uname FROM folders, users WHERE folders.userid = users.id ORDER BY created_time DESC")
            .then(callback);
    }

    function deleteFolder(folderid, callback) {
        db
            .any("DELETE FROM folders WHERE id=$1; DELETE FROM surveys WHERE folderid = $1;", [folderid])
            .then(callback);
    }

    return {
        addSurvey: addSurvey,
        getAllSurveys: getAllSurveys,
        getAllSurveysWithFolder: getAllSurveysWithFolder,
        getSharedSurveys: getSharedSurveys,
        getSurvey: function(surveyId, callback) {
            getAllSurveysAsJson(function(result) {
                callback(result[surveyId]);
            });
        },
        validateUser: validateUser,
        validateUserByID: validateUserByID,
        getUserByMail: getUserByMail,
        getUserByName: getUserByName,
        getUserByID: getUserByID,
        validateCredential: validateCredential,
        updateUserPassword: updateUserPassword,
        registerUser: registerUser,
        getAllUser: getAllUser,
        updateUserInfo: updateUserInfo,
        updateUserPermission: updateUserPermission,
        deleteUser: deleteUser,
        changeRole: changeRole,
        storeSurvey: storeSurvey,
        getSurveysforUser: getSurveysforUser,
        shareSurveyByID: shareSurveyByID,
        copySurveyByID: copySurveyByID,
        deleteSurvey: deleteSurvey,
        saveSurveyTheme: saveSurveyTheme,
        getUserforSurvey: getUserforSurvey,
        moveToFolder: moveToFolder,
        getUserforFolder: getUserforFolder,
        createFolder: createFolder,
        getFoldersByID: getFoldersByID,
        getAllFolders: getAllFolders,
        deleteFolder: deleteFolder,
        postResults: postResults,
        getResults: getResults,
        getResultsforJson: getResultsforJson,
        getResult: getResult,
        getResultsCountForUser: getResultsCountForUser,
        changeName: changeName
    };
}

module.exports = PostgresDBAdapter;