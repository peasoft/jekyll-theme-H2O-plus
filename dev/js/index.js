$(document).ready(function(){
    var nav = $('.g-nav');

    /**
     * Responsive Navigation
     */
    $('#menu-toggle').on('click', function(e) {
        var duration = 200;
        nav.slideToggle(duration);
        $(document).on('click', function() {
            nav.slideUp(duration);
        });
        e.stopPropagation();
    });

    nav.on('click', function(e) {
        e.stopPropagation();
    });

    /*
    *  Header Bar
    */
    if($(window).width() > 695) {
        var header = $('.g-header');
        var headerHeight = header.outerHeight();
        var logo = $('.g-logo');
        var navText = nav.find('a');
        var themeStyle = $('.g-banner').attr('data-theme');
        var scFlag = $(document).scrollTop();

        $(document).scroll(function() {
            var scrollTop = $(this).scrollTop();
            var navClassName = 'nav-' + themeStyle;

            if (scrollTop > headerHeight) {
                if(scrollTop > 3 * headerHeight) {
                    header.addClass('headerUp');
                }
                header.addClass('header1');
                header.removeClass('header2');
                logo.css({
                    'background': 'url(/assets/icons/logo_' + themeStyle + '.svg) no-repeat center',
                    'background-size': '100% 100%'
                });
                navText.css('color', '#666');
                nav.addClass(navClassName);
            } else {
                header.removeClass('headerUp');
                header.addClass('header2');
                header.removeClass('header1');
                logo.css({
                    'background': 'url(/assets/icons/logo.svg) no-repeat center',
                    'background-size': '100% 100%'
                });
                navText.css('color', '#fff');
                nav.removeClass(navClassName);
            }

            // scroll action
            if (scFlag > scrollTop) {
                header.addClass('headerDown');
            } else {
                header.removeClass('headerDown');
            }
            scFlag = scrollTop;
        });
    }

    /*
    * Post Cover Resize
    */
    function postCover(img, container) {
        var imgWidth = img.width();
        var containerWidth = container.width();
        var imgHeight = img.height();
        var containerHeight = container.height();

        if (imgHeight < containerHeight) {
            img.css({
                'width': 'auto',
                'height': '100%'
            });
            imgWidth = img.width(),
            containerWidth = container.width();
            var marginLeft = (imgWidth - containerWidth) / 2;
            img.css('margin-left', '-' + marginLeft + 'px');
        } else {
            var marginTop = (containerHeight - imgHeight) / 2;
            img.css('margin-top', marginTop + 'px');
        }

        img.fadeIn();
    }

    /**
     * The Post Navigator
     */
    $('.read-next-item section').each(function() {
        var n = $(this).height();
        var rn = $('.read-next-item').height();
        $(this).css('margin-top', (rn - n) / 4 + 'px');
        $(this).fadeIn();
    });

    $('.read-next-item img').each(function(){
        postCover($(this), $('.read-next-item'));
    });

    /**
     * Pagination
     */
    function pagination() {
        var total = parseInt($('#total_pages').val());
        var current = parseInt($('#current_pages').val());
        var baseUrl = $('#base_url').val();
        var limit = 3;

        var link_html = '';

        for (var i = current - limit; i < current; i++) {
            if (i > 0 && i !== 1) {
                link_html += '<a href="' + baseUrl + 'page' + i + '" class="page-link page-num">' + i + '</a>';
            } else if (i === 1) {
                link_html += '<a href="' + baseUrl + '" class="page-link page-num">' + i + '</a>';
            }
        }

        link_html += '<span class="page-link page-num active">' + current + '</span>';

        for (var j = current + 1; j <= current + limit; j++) {
            if (j <= total) {
                link_html += '<a href="' + baseUrl + 'page' + j + '" class="page-link page-num">' + j + '</a>';
            }
        }

        $('#page-link-container').html(link_html);
    }
    pagination();

    /**
     * Search
     */
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

        $.getJSON('../../search.json').done(function(data) {
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
        });
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

    /**
     * Night mode
     */
    function nightMode() {
        // From https://juejin.cn/post/7080567228029992996
        var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        function change(evt) {
            $('body').addClass('no-transition');
            if (evt.matches){
                $('body').addClass('night-mode');
            }
            else {
                $('body').removeClass('night-mode');
            }
            setTimeout(()=>{$('body').removeClass('no-transition')}, 100);
        }
        darkModeQuery.addEventListener('change', change);
        change(darkModeQuery);
    }

    // if ($('#nm-switch').val() === 'true') {
    //     forceNightMode();
    // }
    nightMode();

    /**
     * Copy and copyright
     */
    try {
        var copyrightRaw = $('#copyright').html();
        $('#copyright').html($('#copyright').html().replaceAll('<br>', '\n'));
        var copyright = '\n\n' + $('#copyright').text() + "原文：";
        $('#copyright').html(copyrightRaw);
    } catch (error) {}

    function setClipboardData(str) {
        str += copyright + location.href;
        $('.post-content').on('copy', function(e) {
            var data = window.clipboardData || e.originalEvent.clipboardData;
            data.setData('text/plain', str);
            e.preventDefault();
        });
    }
    $('.post-content').on('mouseup', function(e) {
        var txt = window.getSelection();
        if (txt.toString().length >= 30) {
            setClipboardData(txt);
        }
    });

});
