
+function ($) {
    'use strict';

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

// ==== dropdown.js ====
+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.5'

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
            var $this         = $(this)
            var $parent       = getParent($this)
            var relatedTarget = { relatedTarget: this }

            if (!$parent.hasClass('open')) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0)                 index--         // up
        if (e.which == 40 && index < $items.length - 1) index++         // down
        if (!~index)                                    index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown             = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================
    $(document)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);


$(function(){
    //输入框组获取下拉选项
    $("[data-toggle='dropdown']").click(function(){
        var target=$(this).attr("data-target");
        $(document.getElementById(target)).slideToggle();
    });
    $(".input_group .dropdown_menu li").click(function(){
        var val=$(this).html();
        $(this).parents(".input_group").find(".dropdown_res").html(val);
        $(this).parent().hide();
    });

    /*广告轮播*/
    var i=0;
    var timer=null;

    timer=setInterval(bannerSlide,3000);
    $(".slide_nav li").on({
        mouseenter:function(){
            clearInterval(timer);
            $(this).addClass("on").siblings().removeClass("on");
            i=$(this).index();
            $(".slide_content .slide_list").eq(i).addClass("on").siblings().removeClass("on");
        },
        mouseleave:function(){
            timer=setInterval(bannerSlide,3000);
        }
    });

    $(".slide_content").on({
        mouseenter:function(){
            clearInterval(timer);
        },
        mouseleave:function(){
            timer=setInterval(bannerSlide,3000);
        }
    });

    function bannerSlide(){
        if(i>3){
            i=0;
        }
        $(".slide_content .slide_list").eq(i).addClass("on").siblings(".slide_list").removeClass("on");
        $(".slide_nav li").eq(i).addClass("on").siblings("li").removeClass("on");
        i++;
    }

    //tab栏切换
    $("[role='tab']").hover(function(){
        $(this).addClass("tab_active").siblings().removeClass("tab_active");
        var target=$(this).attr("aria-controls");
        $("[aria-labelledby^='tab']").each(function(){
            if($(this).attr("aria-labelledby")==target){
                $(this).addClass("tab_con_active").siblings().removeClass("tab_con_active");
            }
        })
    });

    //全选
    $("[data-toggle=checkbox]").click(function(){
        var target=$(this).attr("data-target")
        if($(this).attr("checked")){
            $("[name="+target+"]").attr("checked",true);
        }else{
            $("[name="+target+"]").attr("checked",false);
        }
    });

    //导航移动端适配
    $("[data-toggle='collapse']").click(function(){
        var _target=$(document.getElementById($(this).attr("data-target")));
        _target.slideToggle();
    });

    $("[data-toggle='sidebar_collapse']").click(function(){
        var _target=$(document.getElementById($(this).attr("data-target")));
        _target.slideToggle();
    });

    //Navbar适配移动端
    navbarMobile();
    window.onresize=function(){
        navbarMobile();
    }

});

//列表向上（间歇）滚动显示
function rollUp(id,pause,speed,delay){
    var _rollBox=$(document.getElementById(id));
    var _rollItem=_rollBox.find("li");
    var height=1;
    var timer=setInterval(move,delay);

    _rollBox.hover(function(){
        clearInterval(timer);
    },function(){
        timer=setInterval(move,delay);
    });

    function move(){
        if(pause){      //间歇性滚动
            height=_rollItem.outerHeight();
            _rollBox.animate({
                "top":-height
            },speed,function(){
                $(this).css({"top":0}).find("li:first").appendTo(this);
            })
        }else{      //连续滚动
            height=_rollBox.position().top;
            var _itemFirst=_rollBox.find("li:first");
            if(height==-_itemFirst.outerHeight()){
                height=0;
                _itemFirst.appendTo(_rollBox);
            }else{
                height--;
            }
            _rollBox.css({"top":height});
        }
    }
}

<!--table全选/取消全选按钮-->
$("#all").click(function(){
    if(this.checked){
        $("#table_list :checkbox").attr("checked", true);
    }else{
        $("#table_list :checkbox").attr("checked", false);
    }
});

//Navbar适配移动端
function navbarMobile(){

    /*获取浏览器宽度*/
    var _screenWidth = document.documentElement.clientWidth;

    if (_screenWidth <= 768) {   //Mobile移动端情况不添加open类
        $('.dropdown-hover').hover(function () {
            $(this).removeClass('open');
        } , function () {
            $(this).removeClass('open');
        });
    }else {    //PC端情况添加open类
        $('.dropdown-hover').hover(function () {
            $(this).addClass('open');
        } , function () {
            $(this).removeClass('open');
        });
    }
}