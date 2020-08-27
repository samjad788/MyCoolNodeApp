function changePermission(method, id) {
    var data = { method: method, id: id };
    $.ajax({
        type: 'POST',
        url: "users/permission",
        data: data,
        dataType: "text",
        success: function(result) {
            user = JSON.parse(result).user;
            if (id == user.id) {
                user[method.toString()] ? $("#" + method + "-" + id).removeAttr("disabled", "disabled") : $("#" + method + "-" + id).attr("disabled", "disabled");
            }
        }
    });
}

function deleteUser(id) {
    var data = { id: id };
    $.ajax({
        type: 'POST',
        url: "users/delete",
        data: data,
        dataType: "text",
        success: function(result) {
            user = JSON.parse(result).user;
            if (id == user.id) {
                $("#delete-" + id).remove();
            }
        }
    });
}