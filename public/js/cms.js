let createdItemMarginLeft = 0;
let createdItemMarginTop = 0;

$(function () {
    let paragraphCounter = 1;
    let imageCounter = 1;
    //create svg element from page creator while mousedown
    $("#pageCreatorElements > svg:nth-child(1)").on("mousedown", function (e) {
        $('body').prepend('<svg id="draggedParagraphItem" style=\'position:absolute;margin-top:' + e.pageY + 'px;margin-left:' + e.pageX + 'px;width: auto;height: auto\'><use xlink:href="#paragraphCreator" /></svg>');
        //drag svg element while mouse move
        $(document).on("mousemove", function (e) {
            $("#draggedParagraphItem").css({
                'margin-left': e.pageX + 'px',
                'margin-top': e.pageY + 'px'
            });
            //checks if page creator element(svg) dropped inside page content
            if (parseInt($("#draggedParagraphItem").css("margin-left")) > $("#content").position().left) {
                // console.log("dropped inside");
                createdItemMarginLeft = e.pageX - $("#sidebar").width() - $("#pageCreator").width() - parseInt($("#content").css("padding"));
                createdItemMarginTop = e.pageY;
                $("#draggedParagraphItem").replaceWith('<div id="draggedParagraphItem" class="createdParagraphs" onclick="cookiesManagement.setCookie(\'lastSelectedParagraph\', $(this).attr(\'id\'), 1, \'cms/\' + $(location).attr(\'href\').substring($(location).attr(\'href\').lastIndexOf(\'/\') + 1))" style=\'position:absolute;margin-top:' + e.pageY + 'px;margin-left:' + e.pageX + 'px;width: 400px;height: 200px;border: 1px solid black\'>' +
                    '<textarea type="text" class="paragraphCreatorInputField"></textarea>' +
                    '</div>');
            }
        });
    });

    $("#pageCreatorElements > svg:nth-child(2)").on("mousedown", function (e) {
        $('body').prepend('<svg id="draggedImageItem" style=\'position:absolute;margin-top:' + e.pageY + 'px;margin-left:' + e.pageX + 'px;width: auto;height: auto\'><use xlink:href="#imageCreator" /></svg>');
        //drag svg element while mouse move
        $(document).on("mousemove", function (e) {
            $("#draggedImageItem").css({
                'margin-left': e.pageX + 'px',
                'margin-top': e.pageY + 'px'
            });

            //checks if page creator element(svg) dropped inside page content
            if (parseInt($("#draggedImageItem").css("margin-left")) > $("#content").position().left) {
                // console.log("dropped inside");
                createdItemMarginLeft = e.pageX - $("#sidebar").width() - $("#pageCreator").width() - parseInt($("#content").css("padding"));
                createdItemMarginTop = e.pageY;
                $("#draggedImageItem").replaceWith('<div id="draggedImageItem" class="createdImages" onclick="cookiesManagement.setCookie(\'lastSelectedParagraph\', $(this).attr(\'id\'), 1, \'cms/\' + $(location).attr(\'href\').substring($(location).attr(\'href\').lastIndexOf(\'/\') + 1))" style=\'position:absolute;margin-top:' + e.pageY + 'px;margin-left:' + e.pageX + 'px;width: 400px;height: 200px;border: 1px solid black\'>' +
                    '<input type=\'file\' onchange="readImage(this);" />' +
                    '<img id="draggedImage" src="#" />' +
                    '</div>');
            }
        });
    });

    $("#pageCreatorElements > svg:nth-child(3)").click(function () {
        alert("coming soon");
    });

    //remove mousemove events(svg dragging) on mouse up and changes id of dropped element
    $("*").on("mouseup", function () {
        $(document).unbind();

        if (parseInt($("#draggedParagraphItem").css("margin-left")) > $("#content").position().left) {
            $("#draggedParagraphItem").attr("id", "paragraph" + paragraphCounter.toString());
            $("#paragraph" + paragraphCounter).css('margin-left', createdItemMarginLeft + "px");
            $("#paragraph" + paragraphCounter).css('margin-top', createdItemMarginTop - parseInt($("#content").css("padding")) + "px");
            $("#paragraph" + paragraphCounter).appendTo("#content");
            paragraphCounter++;
        } else {
            $("#draggedParagraphItem").remove();
        }

        if (parseInt($("#draggedImageItem").css("margin-left")) > $("#content").position().left) {
            $("#draggedImageItem").attr("id", "image" + imageCounter.toString());
            $("#image" + imageCounter).css('margin-left', createdItemMarginLeft + "px");
            $("#image" + imageCounter).css('margin-top', createdItemMarginTop - parseInt($("#content").css("padding")) + "px");
            $("#image" + imageCounter).appendTo("#content");
            imageCounter++;
        } else {
            $("#draggedImageItem").remove();
        }

    });

    //EVENT LISTENERS FOR PAGE CREATOR TOOL
    /*WIDTH/HEIGHT EVENT LISTENERS*/
    $("#pageCreatorElementWidth").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).width($("#pageCreatorElementWidth").val());
    });
    $("#pageCreatorElementHeight").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).height($("#pageCreatorElementHeight").val());
    });

    /*MARGIN EVENT LISTENERS*/
    $("#pageCreatorElementMarginLeft").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("margin-left", parseInt($("#pageCreatorElementMarginLeft").val()));
    });
    $("#pageCreatorElementMarginTop").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("margin-top", parseInt($("#pageCreatorElementMarginTop").val()));
    });

    /*PADDING EVENT LISTENERS*/
    $("#pageCreatorElementPaddingLeft").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("padding-left", parseInt($("#pageCreatorElementPaddingLeft").val()));
    });
    $("#pageCreatorElementPaddingTop").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("padding-top", parseInt($("#pageCreatorElementPaddingTop").val()));
    });
    $("#pageCreatorElementPaddingRight").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("padding-right", parseInt($("#pageCreatorElementPaddingRight").val()));
    });
    $("#pageCreatorElementPaddingBottom").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("padding-bottom", parseInt($("#pageCreatorElementPaddingBottom").val()));
    });

    /*TEXT-ALIGN EVENT LISTENERS*/
    $("#pageCreatorElementAlignLeft").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("text-align", "left");
    });
    $("#pageCreatorElementAlignCenter").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("text-align", "center");
    });
    $("#pageCreatorElementAlignRight").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("text-align", "right");
    });

    /*FONT-SIZE EVENT LISTENER*/
    $("#pageCreatorElementTextFontSize").on("change", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph")).css("font-size", parseInt($("#pageCreatorElementTextFontSize").val()));
    });

    /*BOLD/ITALIC/UNDERLINE EVENT LISTENERS*/
    $("#pageCreatorElementBald").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("font-weight", "bold");
    });
    $("#pageCreatorElementItalic").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("font-style", "italic");
    });
    $("#pageCreatorElementUnderline").on("click", function (event) {
        $("#" + cookiesManagement.getCookie("lastSelectedParagraph") + "> textarea").css("text-decoration", "underline");
    });

});