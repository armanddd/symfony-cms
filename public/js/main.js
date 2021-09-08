$(function(){
    /*change sidebar collapse button*/
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        if ($('#collapseSign').html() === "&lt;") {
            $('#collapseSign').html("&gt;");
            $('#sidebarCollapse').css('transform', 'translate(2.6em, -2.56em)');
            return false;
        }
        if ($('#collapseSign').html() === "&gt;") {
            $('#collapseSign').html("&lt;");
            $('#sidebarCollapse').css('transform', 'translate(1em, -2.56em)');
            return false;
        }

    });
    /*change sidebar arrow up/down for different pages*/
    $(".dropdown-toggle").on('click', function() {
        if ($('#svgItem').attr('xlink:href') === "#arrowDown") {
            $('#svgItem').attr('xlink:href', '#arrowUp');
            return false;
        }
        if ($('#svgItem').attr('xlink:href') === "#arrowUp") {
            $('#svgItem').attr('xlink:href', '#arrowDown');
            return false;
        }
    });
});



/*COOKIE FUNCTIONS*/
class cookiesManagement {
    static setCookie = (name,value,days, path) => {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/" + path;
    };

    static getCookie = (name) => {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    static eraseCookie = (name) => {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
}
/*COOKIE FUNCTIONS*/

/*IMAGE DISPLAY FOR PAGE CREATOR*/
function readImage(input) {
    console.log();
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            input.nextElementSibling.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
/*IMAGE DISPLAY FOR PAGE CREATOR*/

/*SAVE PAGE FUNCTION */
function pageUpdate(pageId){
    $(".createdImages").each(function (){
        if ($(this).children()[1].getAttribute('src') === "#")
        {
            $(this).remove();
        }else{
            $(this).css("border", "");
        }
    });
    $(".createdParagraphs").each(function (){
        if ($(this).children()[0].value === "")
        {
            $(this).remove();
        }
        else{
            $(this).append($(this).children()[0].value)
            $(this).attr("style", $("#paragraph1").attr("style") + $(".paragraphCreatorInputField").attr("style"));
            $(this).css("border", "");
            $(this).children()[0].remove();
        }
    });
    let html = $("#content").clone().html().replace(/^\s*$(?:\r\n?|\n)/gm, "").replace("<input type=\"file\" onchange=\"readImage(this);\">", ""); //get content div html
    $.ajax({
        url:"/page_update",
        type:'POST',
        data:{"content": html, "pageId": pageId},
        success:function (){
            window.location.href=window.location.href;
        }
    });
}
/*SAVE PAGE FUNCTION */