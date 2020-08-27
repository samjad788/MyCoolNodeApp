function getParams() {
    var url = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    var result = {};
    url.forEach(function(item) {
        var param = item.split("=");
        result[param[0]] = param[1];
    });
    return result;
}

function showSurvey(resultId) {
    var data = { resultId: resultId }
    $.ajax({
        type: 'get',
        url: "result/getOne",
        data: data,
        success: function(json) {
            survey.survey.data = JSON.parse(json);
            console.log(survey.survey.data);
            survey.isExpanded = true;
        }
    });
}

$(document).ready(function() {
    var surveyName = $('#surveyname').text();
    surveyId = decodeURI(getParams()["id"]);

    var data = { surveyId: surveyId }
    $.ajax({
        type: 'get',
        url: "getSurvey",
        data: data,
        dataType: "text",
        success: function(json) {
            window.survey = new Survey.SurveyWindow(json);
            survey.survey.mode = "display";
            survey.survey.title = surveyName;
            survey.show();
        }
    });
});