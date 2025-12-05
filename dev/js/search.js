$(document).ready(function(){
    /**
     * Search
     */

    let data = [];
    $.getJSON('/search.json').done(function(dat) {
        data = dat;
    });

    function Search() {
        var self = this;
        var input = $('#search_input');
        var result = $('.search_result');
        var isForm = $('.search-card').is('form');

        input.focus(function() {
            $('.icon-search').css('color', '#3199DB');
            result.show();
        });

        input.keyup(debounce(this.autoComplete));

        if(isForm) {
            function getQueryVariable(variable){
                // From https://www.runoob.com/w3cnote/js-get-url-param.html
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return decodeURI(pair[1]);}
                }
                return false;
            }
            let q = getQueryVariable('q');
            if(q) {$('#search_input').val(q)}
            $('#search_input').trigger('keyup');
            $('#search_input').focus();
            function ext(e) {
                e.preventDefault();
                if(['127.0.0.1', 'localhost'].includes(location.hostname)){
                    alert("本地网站不支持全文搜索！");
                }
                else {
                    window.open("https://www.bing.com/search?q=site:"+location.hostname+' '+$('#search_input').val(), '_blank');
                }
            }
            $('.search-card').submit(ext);
            $('.icon-search').click(ext);
            $('.icon-search').css('cursor', 'pointer');
        }
        else {
            $(document).click(function(e) {
                if(e.target.id === 'search_input' || e.target.className === 'search_result' || e.target.className === 'search_item') {
                    return;
                }
                $('.icon-search').css('color', '#CAD3DC');
                result.hide();
            });
        }
    }

    Search.prototype.autoComplete = function() {
        var keywords = this.value.toLowerCase();

        if (keywords.length) {
            $('.icon-search').css('color', '#3199DB');
        } else {
            $('.icon-search').css('color', '#CAD3DC');
        }

        if($('.search-card').is('form')) {
            history.replaceState('', '', location.pathname+'?q='+keywords);
        }

        var html = '';
        for (var i in data) {
            var item = data[i];
            var title = item.title;
            var tags = item.tags;
            var url = item.url;

            var k = title + tags;
            if (keywords !== '' && k.toLowerCase().indexOf(keywords) >= 0) {
                html += '<a class="search_item" href="' + item.url + '">' + item.title + '</a>';
            }
        }
        $('.search_result').html(html);
    };

    function debounce(fn, delay) {
        var timer;
        delay = delay || 120;

        return function () {
            var ctx = this;
            var args = arguments;
            var later = function() {
                fn.apply(ctx, args);
            };
            clearTimeout(timer);
            timer = setTimeout(later, delay);
        };
    }

    new Search();
});
