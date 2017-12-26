/**
 * Created by 杨雪雪 on 2016/10/8.
 */

/* ===================
* jquery.transition.js
* ===================*/
!function ($) {
    'use strict';

//    css transition support
//    ======================
    function transitionEnd() {
        var el = document.createElement('div');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if(el.style[name] !==undefined) {
                return {end: transEndEventNames[name] };
            }
        }

        return false;
    }

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = $(this);
        $el.one('yxTransitionEnd', function () {called = true});
        var callback = function () { if(!called) $el.trigger($.support.transition.end)}

        setTimeout (callback, duration);
        return this;
    }

    $(function () {
        $.support.transition = transitionEnd();

        if(!$.support.transition) return;

        $.event.special.yxTransitionEnd = {
            bindType : $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
            }
        }
    })
}(jQuery);


/* =================
* jquery.carousel.js
* ==================*/
!function($){
    'use strict';

//    carousel class definition
//    =========================
    var Carousel = function (element, options) {
        this.$element       = $(element);
        this.$indicators    = this.$element.find('.carousel-indicators');
        this.options        = options;
        this.paused         = null;
        this.sliding        = null;
        this.interval       = null;
        this.$active        = null;
        this.$items         = null;

        this.options.keyboard && this.$element.on('keydown', $.proxy(this.keydown, this));

        this.options.pause && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    };

    Carousel.TRANSITION_DURATION = 600;

    Carousel.defaults = {
        keyboard: true,
        pause: 'hover',
        wrap: true,
        interval: 5000
    }

    Carousel.prototype = {
        keydown: function (e) {
            if(/input|textarea/i.test(e.target.tagName)) return;

            switch (e.which) {
                case 37 : this.prev(); break;
                case 39 : this.next(); break;
                default : return;
            }

            e.preventDefault();
        },
        pause: function (e) {
            e || (this.paused = true);

            if(this.$element.find('.next, .prev').length && $.support.transition){
                this.$element.trigger($.support.transition.end);
                this.cycle(true);
            }

            this.interval = clearInterval(this.interval);

            return this;
        },
        cycle: function (e) {
            e || (this.paused = false);

            this.interval && clearInterval(this.interval);

            this.options.interval
                && !this.paused
                && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

            return this;
        },
        getItemIndex: function (item) {
            this.$items = item.parent().children('.item');
            return this.$items.index(item || this.$active);
        },
        getItemForDirection: function (direction, active) {
            var activeIndex = this.getItemIndex(active);
            var willWrap = (direction == 'prev' && activeIndex === 0)
                        || (direction == 'next' && activeIndex == (this.$items.length-1));
            if(willWrap && !this.options.wrap) return active;

            var temp = direction == 'prev' ? -1 : 1;
            var itemIndex = (activeIndex + temp) % this.$items.length;
            return this.$items.eq(itemIndex);
        },
        prev: function () {
            if (this.sliding) return;
            return this.slide('prev');
        },
        next: function() {
            if (this.sliding) return;
            return this.slide('next');
        },
        to: function (pos) {
            var that = this;
            var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

            if(pos > (this.$items.length -1) || pos < 0) return;

            if(this.sliding) return this.$element.one('slid', function () {that.to(pos);});
            if(activeIndex == pos) return this.pause().cycle();

            return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
        },
        slide: function (type, next) {
            var $active     = this.$element.find('.item.active');
            var $next       = next || this.getItemForDirection(type, $active);
            var isCycling   = this.interval;
            var direction   = type == 'next' ? 'left' : 'right';
            var that        = this;

            if($next.hasClass('active')) return (this.sliding = false);

            var relatedTarget = $next[0];
            var slideEvent = $.Event('slide', {
                relatedTarget: relatedTarget,
                direction: direction
            });
            this.$element.trigger(slideEvent);
            if(slideEvent.isDefaultPrevented()) return;

            this.sliding = true;

            isCycling && this.pause();

            if(this.$indicators.length) {
                this.$indicators.find('.active').removeClass('active');
                var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
                $nextIndicator && $nextIndicator.addClass('active');
            }

            var slidEvent = $.Event('slid', {
                relatedTarget: relatedTarget,
                direction: direction
            })

            if($.support.transition && this.$element.hasClass('slide')) {
                $next.addClass(type);
                $next[0].offsetWidth;
                $active.addClass(direction);
                $next.addClass(direction);

                $active
                    .one('yxTransitionEnd', function () {
                        $next.removeClass([type, direction].join(' ')).addClass('active');
                        $active.removeClass(['active', direction].join(' '));
                        that.sliding = false;
                        setTimeout(function () {
                            that.$element.trigger(slidEvent);
                        }, 0);
                    })
                    .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
            }else{
                $active.removeClass('active');
                $next.addClass('active');
                this.sliding = false;
                this.$element.trigger(slidEvent);
            }

            isCycling && this.cycle();

            return this;
        }
    }

//    carousel plugin definition
//    ==========================
    function Plugin(option) {
        return this.each(function () {  //返回当前对象，维护链式调用
            var $this   = $(this);
            var data    = $this.data('carousel');
            var options = $.extend({}, Carousel.defaults, $this.data(), typeof option == 'object' && option);
            var action  = typeof option == 'string' ? option : options.slide;

            if(!data) //实现单例模式
                $this.data('carousel', (data = new Carousel(this, options)));
            if (typeof option == 'number') data.to(option);
            else if(action) data[action]();
            else if (options.interval) data.pause().cycle();
        });
    }

    var old = $.fn.carousel;

    $.fn.carousel               = Plugin;
    $.fn.carousel.Constructor   = Carousel;

//    carousel no conflict
//    ====================
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };

//    carousel data-api
//    =================
    var clickHandler = function (e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7

        if(!$target.hasClass('carousel')) return;

        var options = $.extend({}, $target.data(), $this.data());

        var slideIndex = $this.attr('data-slide-to');
        if(slideIndex) options.interval = false;

        Plugin.call($target, options)

        if(slideIndex) {
            $target.data('carousel').to(slideIndex);
        }
        e.preventDefault();
    };

    $(document)
        .on('click', '[data-slide]', clickHandler)
        .on('click', '[data-slide-to]', clickHandler);

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        })
    })
}(jQuery);


/* ===============
* jquery.modal.js
* ===============*/
!function ($) {
    'use strict'

//    modal class definition
//    =====================
    var Modal = function (element, options) {
        this.$element            = $(element);
        this.options             = options;
        this.$body               = $(document.body);
        this.$dialog             = this.$element.find('.modal-dialog');
        this.$backdrop           = null;
        this.isShown             = null;
        this.originalBodyPad     = null;
        this.scrollbarWidth      = 0;
        this.ignoreBackdropClick = false;

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded')
                },this));
        }
    };

    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;

    Modal.defaults = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype = {
        toggle: function (_relatedTarget) {
            return this.isShown ? this.hide() : this.show(_relatedTarget);
        },
        show: function (_relatedTarget) {
            var that = this;
            var e    = $.Event('show', {relatedTarget:_relatedTarget});

            this.$element.trigger(e);

            if (this.isShown || e.isDefaultPrevented()) return;

            this.isShown = true;

            this.checkScrollbar();
            this.setScrollbar();
            this.$body.addClass('modal-open');

            this.escape();
            this.resize();

            this.$element.on('click', '[data-dismiss="modal"]', $.proxy(this.hide, this));

            this.$dialog.on('mousedown', function () {
                that.$element.one('mouseup', function (e) {
                    if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
                })
            });

            this.backdrop(function () {
                var transition = $.support.transition && that.$element.hasClass('fade');

                if(!that.$element.parent().length){
                    that.$element.appendTo(that.$body);
                }

                that.$element.show().scrollTop(0);

                that.adjustDialog();

                if(transition){
                    that.$element[0].offsetWidth    // force reflow
                }

                that.$element.addClass('in');

                that.enforceFocus();

                var e = $.Event('shown' ,{relatedTarget:_relatedTarget});

                transition ?
                    that.$dialog
                        .one('yxTransitionEnd', function () {
                            that.$element.trigger('focus').trigger(e)
                        })
                        .emulateTransitionEnd(Modal.TRANSITION_DURATION):
                    that.$element.trigger('focus').trigger(e)
            })
        },
        hide: function (e) {
            e && e.preventDefault();

            e = $.Event('hide');

            this.$element.trigger(e);

            if(!this.isShown || e.isDefaultPrevented()) return;

            this.isShown = false;

            this.escape();
            this.resize();

            $(document).off('focusin');

            this.$element
                .removeClass('in')
                .off('click')
                .off('mouseup');

            this.$dialog.off('mousedown');

            $.support.transition && this.$element.hasClass('fade') ?
                this.$element
                    .one('yxTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                this.hideModal();
        },
        hideModal: function () {
            var that = this;
            this.$element.hide();
            this.backdrop(function () {
                that.$body.removeClass('modal-open');
                that.resetAdjustments();
                that.resetScrollbar();
                that.$element.trigger('hidden');
            })
        },
        enforceFocus: function () {
            $(document)
                .off('focusin')
                .on('focusin', $.proxy(function (e) {
                    if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                        this.$element.trigger('focus') ;
                    }
                }, this))
        },
        backdrop: function (callback){
            var that = this;
            var animate = this.$element.hasClass('fade') ? 'fade' : '';

            if (this.isShown && this.options.backdrop) {
                var doAnimate = $.support.transition && animate;

                this.$backdrop = $(document.createElement('div'))
                    .addClass('modal-backdrop ' + animate)
                    .appendTo(this.$body);

                this.$element.on('click', $.proxy(function (e) {
                    if (this.ignoreBackdropClick) {
                        this.ignoreBackdropClick = false;
                        return;
                    }
                    if(e.target !== e.currentTarget) return;

                    this.options.backdrop == 'static' ?
                        this.$element[0].focus() :
                        this.hide();
                },this))

                if(doAnimate) this.$backdrop[0].offsetWidth; // force reflow

                this.$backdrop.addClass('in') ;

                if (!callback) return

                doAnimate ?
                    this.$backdrop
                        .one('yxTransitionEnd', callback)
                        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                    callback() ;
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in') ;

                var callbackRemove = function () {
                    that.removeBackdrop();
                    callback && callback() ;
                }

                $.support.transition && this.$element.hasClass('fade') ?
                    this.$backdrop
                        .one('yxTransitionEnd', callbackRemove)
                        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                    callbackRemove() ;
            } else if (callback) {
                callback();
            }
        },
        removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove() ;
            this.$backdrop = null ;
        },
        escape: function () {
            if (this.isShown && this.options.keyboard) {
                this.$element.on('keydown', $.proxy(function (e) {
                    e.which == 27 && this.hide();
                }, this))
            } else if(!this.isShown) {
                this.$element.off('keydown');
            }
        },
        resize: function () {
            if(this.isShown) {
                $(window).on('resize', $.proxy(this.handleUpdate, this));
            }else {
                $(window).off('resize');
            }
        },
        handleUpdate: function () {
            this.adjustDialog() ;
        },
        adjustDialog: function () {
            var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight ;

            this.$element.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            })
        },
        resetAdjustments : function () {
            this.$element.css({
                paddingLeft: '',
                paddingRight: ''
            })
        },
        checkScrollbar: function () {
            var fullWindowWidth = window.innerWidth;
            if (!fullWindowWidth) {     // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
            }

            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
            this.scrollbarWidth = this.measureScrollbar();
        },
        setScrollbar: function () {
            var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
            this.originalBodyPad = document.body.style.paddingRight || '';
            if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
        },
        resetScrollbar: function () {
            this.$body.css('padding-right', this.originalBodyPad);
        },
        measureScrollbar: function () {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            this.$body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            this.$body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        }
    }

//    modal plugin definition
//    =======================
    var Plugin = function (option , _relatedTarget) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('modal');
            var options = $.extend({}, Modal.defaults, $this.data(), typeof option == 'object' && option);

            if(!data) $this.data('modal', (data = new Modal(this, options)));
            if(typeof option == 'string') data[option](_relatedTarget);
            else if(options.show) data.show(_relatedTarget);
        });
    };

    var old = $.fn.modal;

    $.fn.modal              = Plugin;
    $.fn.modal.Constructor  = Modal;

//    modal no conflict
//    =================
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    }

//    modal data-api
//    =============
    $(document).on('click', '[data-toggle="modal"]', function (e) {
        var $this   = $(this);
        var href    = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/,'')));
        var option  = $target.data('modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return;
            $target.one('hidden', function () {
                $this.is(':visible') && $this.trigger('focus');
            })
        })

        Plugin.call($target, option, this);
    })
}(jQuery);

/*================
* jquery.scrollList.js
* ===============*/
!function($){
    var scrollList=(function(){
        function scrollList(element,options){
            this.element=element;
            this.settings= $.extend({}, $.fn.scrollList.defaults,options);
            this.init();
        }

        scrollList.prototype={
            init:function(){
                var me=this;
                me.selectors    =me.settings.selectors;
                me.scrollInner  =me.element.find(me.selectors.scrollInner);
                me.scrollCon    =me.scrollInner.find(me.selectors.scrollCon);
                me.prev         =me.element.find(me.selectors.prev);
                me.next         =me.element.find(me.selectors.next);
                me.ulFirst      =me.scrollCon.find('ul:first');
                me.width        =me.ulFirst.find('li').outerWidth(true);
                me.pageWidth    =me.settings.pageNum*me.width;
                me.moveTimer    =me.settings.moveTimer;
                me.moveLock     =me.settings.moveLock;
                me.autoPlayObj  =me.settings.autoPlayObj;
                me.moveWay      =me.settings.moveWay;
                me.speed        =me.settings.speed;
                me.space        =me.settings.space;
                me.fill         =me.settings.fill;
                me.comp         =me.settings.comp;
                me.interval     =me.settings.interval;
                me.showNum      =me.settings.showNum;

                me._initEvent();

                //$(window).resize(function () {
                //    me._disabled();
                //})
            },
            _initEvent:function(){
                var me=this;

                //me._disabled();

                me.scrollCon.append(me.ulFirst.clone());
                me.scrollInner.scrollLeft(me.fill>=0?me.fill:me.ulFirst[0].scrollWidth-Math.abs(me.fill));

                //启动、暂停自动轮播
                me.scrollInner.on({
                    mouseover:function(){
                        clearInterval(me.autoPlayObj);
                    },
                    mouseout:function(){
                        me._autoPlay();
                    }
                })
                me._autoPlay();

                me.next.on({
                    mousedown:function(){
                        me._goDown();
                    },
                    mouseup:function(){
                        me._stopDown();
                    }
                })

                me.prev.on({
                    mousedown:function(){
                        me._goUp();
                    },
                    mouseup:function(){
                        me._stopUp();
                    }
                })

            },
            _disabled:function(){
                var me=this;
                if(me.ulFirst.width() <= me.scrollInner.width()){
                    me.prev.addClass('disabled');
                    me.next.addClass('disabled');
                    return;
                }else {
                    me.prev.removeClass('disabled');
                    me.next.removeClass('disabled');
                }
            },
            _goDown:function(){
                var me=this;

                clearInterval(me.moveTimer);
                if(me.moveLock) return;
                clearInterval(me.autoPlayObj);
                me.moveLock=true;
                me.moveWay='right';
                me._scrDown();
                me.moveTimer=setInterval(function(){
                    me._scrDown();
                },me.speed);
            },
            _stopDown:function(){
                var me=this;

                if(me.moveWay=='left') return;
                clearInterval(me.moveTimer);
                if(me.scrollInner.scrollLeft()%me.pageWidth-(me.fill>=0?me.fill:me.fill+1) !=0){
                    me.comp=me.pageWidth-me.scrollInner.scrollLeft()%me.pageWidth+me.fill;
                    me._compScr();
                }else{
                    me.moveLock=false;
                }
                me._autoPlay();
            },
            _scrDown:function(){
                var me=this;

                if(me.scrollInner.scrollLeft()>=me.ulFirst[0].scrollWidth){
                    me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()-me.ulFirst[0].scrollWidth);
                }
                me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()+me.space);
            },
            _autoPlay:function(){
                var me=this;

                clearInterval(me.autoPlayObj);
                me.autoPlayObj=setInterval(function(){
                    me._goDown();
                    me._stopDown();
                },me.interval)
            },
            _compScr:function(){
                var me=this;

                if(me.comp==0){
                    me.moveLock=false;
                    return;
                }

                var num,tempSpeed=me.speed,tempSpace=me.space;
                if(Math.abs(me.comp)<me.pageWidth/2){
                    tempSpace=Math.round(Math.abs(me.comp/me.space));
                    if(tempSpace<1){
                        tempSpace=1;
                    }
                }
                if(me.comp<0){
                    if(me.comp<-tempSpace){
                        me.comp+=tempSpace;
                        num=tempSpace;
                    }else{
                        num=-me.comp;
                        me.comp=0;
                    }
                    me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()-num);
                    setTimeout(function(){
                        me._compScr();
                    },tempSpeed);
                }else{
                    if(me.comp>=tempSpace){
                        me.comp-=tempSpace;
                        num=tempSpace;
                    }else{
                        num=me.comp;
                        me.comp=0;
                    }
                    me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()+num);
                    setTimeout(function(){
                        me._compScr();
                    },tempSpeed);
                }
            },
            _goUp:function () {
                var me=this;

                if(me.moveLock) return;
                clearInterval(me.autoPlayObj);
                me.moveLock=true;
                me.moveWay='left';
                me.moveTimer=setInterval(function(){
                    me._scrUp();
                },me.speed);
            },
            _stopUp:function(){
                var me=this;

                if(me.moveWay=='right') return;
                clearInterval(me.moveTimer);
                if((me.scrollInner.scrollLeft()-me.fill)%me.pageWidth!=0){
                    me.comp=me.fill-(me.scrollInner.scrollLeft()%me.pageWidth);
                    me._compScr();
                }else{
                    me.moveLock=false;
                }
                me._autoPlay;
            },
            _scrUp:function(){
                var me=this;

                if(me.scrollInner.scrollLeft()<=0){
                    me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()+me.ulFirst[0].offsetWidth);
                }
                me.scrollInner.scrollLeft(me.scrollInner.scrollLeft()-me.space);
            }
        }

        return scrollList;
    })();

    $.fn.scrollList=function(options){
        return this.each(function(){    //返回当前对象，维护链式调用
            var _this=$(this),
                instance=_this.data('scrollList');
            if(!instance){  //实现单例模式
                instance=new scrollList(_this,options);
                _this.data('scrollList',instance);
            }
            if($.type(options)==='string') return instance[options]();  //通过配置变量实现方法的调用
        })
    };

    $.fn.scrollList.defaults={
        selectors:{
            scrollInner:'.scroll-inner',
            scrollCon:'.scroll-con',
            prev:'[data-slide="prev"]',
            next:'[data-slide="next"]'
        },
        speed:5,   //移动速度(ms)
        space:10,   //每次移动距离(px)
        pageNum:2,  //翻页个数
        interval:3000,  //翻页间隔时间
        moveLock:false,
        moveWay:'right',
        autoPlayObj:null,
        moveTimer:null,
        fill:0,     //整体移位
        comp:0
    };

    $(window).on('load',function(){
        $('[data-ride="scroll"]').scrollList();
    })

}(jQuery);

/*==============
 * jquery.tab.js
 * =============*/
!function ($) {
    'use strict';

//    tab class definition
//    ====================
    var Tab = function (element) {
        this.$element = $(element);
    }

    Tab.TRANSITION_DURATION = 150;

    Tab.prototype = {
        'show': function () {
            var $this   = this.$element;
            var $ul     = $this.closest('ul:not(.dropdown-menu)');
            var selector  = $this.data('target');

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$])/,'');
            }
            var $target = $(selector);

            if ($this.parent('li').hasClass('active')) return;

            var $previous = $ul.find('.active:last a');
            var hideEvent = $.Event('hide', {
                relatedTarget: $this[0]
            });
            var showEvent = $.Event('show', {
                relatedTarget: $previous[0]
            });

            $previous.trigger(hideEvent);
            $this.trigger(showEvent);

            if(showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

            this.activate($this.closest('li'), $ul);
            this.activate($target, $target.parent(), function () {
                $previous.trigger({
                    type:'hidden',
                    relatedTarget: $this[0]
                });
                $this.trigger({
                    type:'shown',
                    relatedTarget: $previous[0]
                });
            })
        },
        'activate': function (element, container, callback) {
            var $active    = container.find('> .active');
            var transition = callback
                && $.support.transition
                && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

            function next() {
                $active
                    .removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', false);

                element
                    .addClass('active')
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true);

                if (transition) {
                    element[0].offsetWidth;
                    element.addClass('in');
                }else{
                    element.removeClass('fade')
                }

                if (element.parent('.dropdown-menu').length){
                    element
                        .closest('li.dropdown')
                        .addClass('active')
                        .end()
                        .find('[data-toggle="tab"]')
                        .attr('aria-expanded', true);
                }

                callback && callback()
            }

            $active.length && transition ?
                $active
                    .one('yxTransitionEnd', next)
                    .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
                next();

            $active.removeClass('in');
        }
    }

//    tab plugin definition
//    =====================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('tab');

            if (!data) $this.data('tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.tab;

    $.fn.tab             = Plugin;
    $.fn.tab.Constructor = Tab;

//    tab no conflict
//    ===============
    $.fn.tab.noConflict = function () {
        $.fn.tab = old;
        return this;
    }

//    tab data-api
//    ============
    var clickHandler = function (e) {
        e.preventDefault();
        Plugin.call($(this), 'show');
    }

    $(document)
        .on('click', '[data-toggle="tab"]', clickHandler);
}(jQuery);

/*====================
* jquery.imageZoom.js
* ===================*/
(function($){
    var defaults = {
        cursorcolor:'255,255,255',
        opacity:0.5,
        cursor:'crosshair',
        zindex:2147483647,
        zoomviewsize:[500,400],
        zoomviewposition:'right',
        zoomviewmargin:20,
        zoomviewborder:'1px solid #eee',
        magnification:1.925
    };

    var imagezoomCursor,imagezoomView,settings,imageWidth,imageHeight,offset;
    var methods = {
        init : function(options){
            $this = $(this),
                imagezoomCursor = $('.imagezoom-cursor'),
                imagezoomView = $('.imagezoom-view'),
                $(document).on('mouseenter',$this.selector,function(e){
                    var data = $(this).data();
                    settings = $.extend({},defaults,options,data),
                        offset = $(this).offset(),
                        imageWidth = $(this).width(),
                        imageHeight = $(this).height(),
                        cursorSize = [(settings.zoomviewsize[0]/settings.magnification),(settings.zoomviewsize[1]/settings.magnification)];
                    if(data.imagezoom == true){
                        imageSrc = $(this).attr('src');
                    }else{
                        imageSrc = $(this).get(0).getAttribute('data-imagezoom');
                    }

                    var posX = e.pageX,posY = e.pageY,zoomViewPositionX;
                    $('body').prepend('<div class="imagezoom-cursor">&nbsp;</div><div class="imagezoom-view"><img src="'+imageSrc+'"></div>');

                    if(settings.zoomviewposition == 'right'){
                        zoomViewPositionX = (offset.left+imageWidth+settings.zoomviewmargin);
                    }else{
                        zoomViewPositionX = (offset.left-imageWidth-settings.zoomviewmargin);
                    }

                    $(imagezoomView.selector).css({
                        'position':'absolute',
                        'left': zoomViewPositionX,
                        'top': offset.top,
                        'width': cursorSize[0]*settings.magnification,
                        'height': cursorSize[1]*settings.magnification,
                        'background':'#000',
                        'z-index':2147483647,
                        'overflow':'hidden',
                        'border': settings.zoomviewborder
                    });

                    $(imagezoomView.selector).children('img').css({
                        'position':'absolute',
                        'width': imageWidth*settings.magnification,
                        'height': imageHeight*settings.magnification
                    });

                    $(imagezoomCursor.selector).css({
                        'position':'absolute',
                        'width':cursorSize[0],
                        'height':cursorSize[1],
                        'background-color':'rgb('+settings.cursorcolor+')',
                        'z-index':settings.zindex,
                        'opacity':settings.opacity,
                        'cursor':settings.cursor
                    });
                    $(imagezoomCursor.selector).css({'top':posY-(cursorSize[1]/2),'left':posX});
                    $(document).on('mousemove',document.body,methods.cursorPos);
                });
        },
        cursorPos:function(e){
            var posX = e.pageX,posY = e.pageY;
            if(posY < offset.top || posX < offset.left || posY > (offset.top+imageHeight) || posX > (offset.left+imageWidth)){
                $(imagezoomCursor.selector).remove();
                $(imagezoomView.selector).remove();
                return;
            }

            if(posX-(cursorSize[0]/2) < offset.left){
                posX = offset.left+(cursorSize[0]/2);
            }else if(posX+(cursorSize[0]/2) > offset.left+imageWidth){
                posX = (offset.left+imageWidth)-(cursorSize[0]/2);
            }

            if(posY-(cursorSize[1]/2) < offset.top){
                posY = offset.top+(cursorSize[1]/2);
            }else if(posY+(cursorSize[1]/2) > offset.top+imageHeight){
                posY = (offset.top+imageHeight)-(cursorSize[1]/2);
            }

            $(imagezoomCursor.selector).css({'top':posY-(cursorSize[1]/2),'left':posX-(cursorSize[0]/2)});
            $(imagezoomView.selector).children('img').css({'top':((offset.top-posY)+(cursorSize[1]/2))*settings.magnification,'left':((offset.left-posX)+(cursorSize[0]/2))*settings.magnification});

            $(imagezoomCursor.selector).mouseleave(function(){
                $(this).remove();
            });
        }
    };

    $.fn.imageZoom = function(method){
        if(methods[method]){
            return methods[method].apply( this, Array.prototype.slice.call(arguments,1));
        }else if( typeof method === 'object' || ! method ) {
            return methods.init.apply(this,arguments);
        }else{
            $.error(method);
        }
    }

    $(document).ready(function(){
        $('[data-imagezoom]').imageZoom();
    });
})(jQuery);