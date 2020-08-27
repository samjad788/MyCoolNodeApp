function deleteSurvey(id) {
    if (confirm("Are you sure?")) {
        window.location = "/delete?id=" + id;
    }
}

function createSurvey() {
    var name = 'NewSurvey' + Date.now()
    window.location = "/create?name=" + name;
}

function moveFolder(surveyid) {
    $.ajax({
        type: 'POST',
        url: "folder/get",
        success: function(result) {
            $("#select_folder_table > tbody").html("");
            for (let folder of result.folders) {
                var user = folder.hasOwnProperty('uname') ? "/ " + folder.uname : "";
                var tr = "<tr onclick=\"selectFolder('" + surveyid.toString() + "','" + folder.id + "')\">" + "<td><span class='glyphicon glyphicon-folder-open'></span> &nbsp;" + folder.name + user + "</td></tr>";
                $('#select_folder_table > tbody:last-child').append(tr);
            }
            $("#folderModal").modal("show");
        }
    });
}

function surveyLink(surveyid) {
    var url = window.location.origin + "/run?id=" + surveyid;
    $("#survey_link").text(url);
    $("#linkModal").modal("show");
}

function selectFolder(surveyid, folderid) {
    var data = { surveyId: surveyid, folderId: folderid };
    $.ajax({
        type: 'POST',
        url: "survey/folder",
        data: data,
        dataType: "text",
        success: function(result) {
            $("#folderModal").modal("hide");
            location.reload();
        }
    });
}

function deleteFolder(folderid) {
    if (confirm("Are you sure?")) {
        var data = { folder: folderid };
        $.ajax({
            type: 'POST',
            url: "folder/delete",
            data: data,
            dataType: "text",
            success: function(result) {
                location.reload();
            }
        });
    }
}