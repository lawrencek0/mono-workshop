var searchId = $('#search');
var typeaheadClass = $('.typeahead');
var articlesId = $("#articles");

var articles = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=%QUERY&callback=?',
        wildcard: '%QUERY',
        filter: function(articles) {
            return articles[1]
        }
    }
});

searchId.typeahead({
    hint: true,
    highLight: true,
    minLength: 1
}, {
    name: 'articles',
    source: articles.ttAdapter()
}).bind("typeahead:selected", function() {
    wikiSearch();
});

searchId.on('keydown', function(e) {
    if (e.which == 13) {
        wikiSearch();
        typeaheadClass.typeahead('close');
    }
});

$("#submit").on('click', function() {
    wikiSearch();
    typeaheadClass.typeahead('close');
});

$("#close").on('click', function() {
    searchId.val('');
    articlesId.empty();
});

function wikiSearch() {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchId.val() + "&callback=?",
        dataType: "jsonp",
        success: function(response) {
            var search = searchId.val();
            articlesId.empty();
            if (response[1].length == 0) {
                articlesId.append('<p><em>The page <a href="https://en.wikipedia.org/w/index.php?title=' + search + '&action=edit&redlink=1" target="_blank" class="red-text">"' + search + '"</a> does not exist. You can ask for it to be created.</em></p><p>There were no results matching the query.</p><p><ul>Suggestions:<li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li></ul></p>');
            } else {
                for (var i = 0; i < response[1].length; i++) {
                    var results = '<div class="card"><div class="card-content"><span class="card-title grey-text">' + response[1][i] + '</span><p>' + response[2][i] + '</p></div><div class="card-action"><a href="' + response[3][i] + '" target="_blank" class="light-blue-text">Read More</a></div></div>';
                    articlesId.append(results);
                }
            }
        }
    });
}