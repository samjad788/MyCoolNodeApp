$('#question_textcolor').ColorPicker({
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
            $(".sv_q_title").css("color", "#" + hex);
        },
        onBeforeShow: function() {
            $(this).ColorPickerSetColor(this.value);
        }
    })
    .bind('keyup', function() {
        $(this).ColorPickerSetColor(this.value);
    });

$('#question_backcolor').ColorPicker({
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
            $(".sv_q_title").css("background", "#" + hex);
        },
        onBeforeShow: function() {
            $(this).ColorPickerSetColor(this.value);
        }
    })
    .bind('keyup', function() {
        $(this).ColorPickerSetColor(this.value);
    });

$('#answer_textcolor').ColorPicker({
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();

            $("fieldset table").css("color", "#" + hex);
        },
        onBeforeShow: function() {
            $(this).ColorPickerSetColor(this.value);
        }
    })
    .bind('keyup', function() {
        $(this).ColorPickerSetColor(this.value);
    });

$('#question_font')
    .fontselect()
    .on('change', function() {
        $('#question_font').val(this.value)
        var font = parseFont(this.value)
        $('.sv_q_title').css({ fontFamily: "'" + font[0] + "'", fontWeight: font[1] });
    });

$('#answer_font')
    .fontselect()
    .on('change', function() {
        $('#answer_font').val(this.value)
        var font = parseFont(this.value)
        $('fieldset table').css({ fontFamily: "'" + font[0] + "'", fontWeight: font[1] });
    });

$(document).ready(function() {
    $(".sv_q_title").css("color", "#" + $('#question_textcolor').val());
    $(".sv_q_title").css("background", "#" + $('#question_backcolor').val());
    $("fieldset table").css("color", "#" + $('#answer_textcolor').val());

    var q_font = parseFont($('#question_font').val())
    $('.sv_q_title').css({ fontFamily: "'" + q_font[0] + "'", fontWeight: q_font[1] });
    var a_font = parseFont($('#answer_font').val())
    $('fieldset table').css({ fontFamily: "'" + a_font[0] + "'", fontWeight: a_font[1] });
});

function parseFont(font) {
    font = font.replace(/\+/g, ' ');

    // Split font into family and weight
    font = font.split(':');

    var fontFamily = font[0];
    var fontWeight = font[1] || 400;

    return [fontFamily, fontWeight];
}