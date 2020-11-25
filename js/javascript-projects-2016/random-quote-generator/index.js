$("#cover").spin();
var color = "#000";
var quoteText = $("#quote-text");
function insertQuote() {
    $.ajax({
        url: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=famous',
        type: 'GET',
        cache: false,
        data: {},
        dataType: 'json',
        success: function(data) {
            var quote = data.quote;
            var author = data.author;
            $("#tweetSubmit").attr("href", 'https://twitter.com/intent/tweet?text="' + quote + '" -' + author + '&hashtags=quotes,freecodecamp,campers&url=http:' + encodeURIComponent("//codepen.io/LKhadka/full/JXOmdB/"));
            $("#quote").html('<h5 class="header flow-text"><i class="fa fa-quote-left"></i> ' + quote + ' <i class="fa fa-quote-right"></i></h5>');
            $("#author").html('<span class="right">- ' + author + "</span>");
            quoteText.show();
            $("#spin").spin(false);
        },
        beforeSend: function(xhr) {
            quoteText.hide();
            var colors = ['#f44336', '#9c27b0', '#4caf50', '#2196f3', '#ff9800', '#fdd835', '#3f51b5', '##00bcd4', '#e91e63', '#673ab7', '#03a9f4', '#00bcd4', '#009688', '#8bc34a', '#cddc39 ', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];
            color = colors[Math.floor(Math.random() * colors.length)];
            $("#spin").spin({
                color: color
            });
            $("body").css('background-color', color);
            $(".btn").css('background-color', color);
            quoteText.css('color', color);
            xhr.setRequestHeader("X-Mashape-Authorization", "F7K3vA4skxmshgjBSciSTrghaokbp1UrsBOjsnf6yEWgn9wtzr");
        },
        complete: function() {
            $("#cover").spin(false);
            $("#page").css('display', 'block');
        }
    });
}
insertQuote();
$(document).ready(function() {
    $("#new-quote").click(function() {
        insertQuote();
    });
    $("#copyToClipboard").click(function() {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(quoteText.text()).select();
        document.execCommand("copy");
        $temp.remove();
        Materialize.toast('Copied to Clipboard', 3000, 'square');
    });
});