$(function(){
    /*产品分类*/
    $(".cate_list .item").hover(function(){
        var index=$(this).index();
        $(this).addClass("hover").siblings(".item").removeClass("hover");
        $(".panel_list").eq(index).show().siblings(".panel_list").hide();
        $(".cate_panel").show();
    })

    $(".category").mouseleave(function(){
        $(".cate_panel").hide();
        $(".cate_list .item").removeClass("hover")
    })

    $(".category h3").mouseenter(function(){
        $(".cate_panel").hide();
        $(".cate_list .item").removeClass("hover")
    })
    $(".sub_list li").hover(function(){
        $(this).find(".sorted_list").slideDown();
    },function(){
        $(this).find(".sorted_list").hide();
    })

    /*求购信息、产品口碑*/
    $(".scroll_title a").hover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var index=$(this).index();
        $(".scroll_list").eq(index).removeClass("hide").siblings().addClass("hide");
        $(".roll_up_list").css({"top":0});
    })

    /*楼层tab*/
    $(".floor_t .tab_item").hover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var index=$(this).index();
        var _carousel=$(this).parents(".floor").find(".carousel");
        _carousel.eq(index).addClass("active").siblings().removeClass("active");
    })
    $('.floor_t').each(function(){
    	$(this).find('.tab_item:first').addClass('active');
    })

    var showNum=parseInt($(".carousel").attr("data-show"));
    var interval=1000;

    //产品轮播
    $("[data-slide='carousel_down']").click(function(){
        var i=parseInt($(this).parent().attr("data-flag"));
        var _carouselWrap=$(this).parent().find(".carousel_wrap");
        var _carouselList=_carouselWrap.find(".carousel_list");
        var len=_carouselList.find("li").length;

        var pageWidth=_carouselList.find("li").outerWidth();
        if(i>=0){
            $(this).parents(".carousel").find("[data-slide='carousel_up']").removeClass("disabled");
        }
        if(i+showNum==len){
            $(this).addClass("disabled");
            return;
        }
        i++;
        _carouselList.stop().animate({
            left:-i*pageWidth
        },interval);

        $(this).parent().attr("data-flag",i);
    })

    $("[data-slide='carousel_up']").click(function(){
        var i=parseInt($(this).parent().attr("data-flag"));
        var _carouselWrap=$(this).parent().find(".carousel_wrap");
        var _carouselList=_carouselWrap.find(".carousel_list");
        var len=_carouselList.find("li").length;
        var pageWidth=_carouselList.find("li").outerWidth();
        if(i+showNum<=len){
            $(this).parents(".carousel").find("[data-slide='carousel_down']").removeClass("disabled");
        }
        if(i==0){
            $(this).addClass("disabled");
            return;
        }
        i--;
        _carouselList.stop().animate({
            left:-i*pageWidth
        },interval);
        $(this).parent().attr("data-flag",i);
    })

})

