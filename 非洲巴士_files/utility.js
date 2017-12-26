/**
 * Created by 杨雪雪 on 2016/9/27.
 */
$(function(){
    //topBar nav tab
    //==============
    $('.extra').hover(function(){
        $(this).addClass('open');
    },function(){
        $(this).removeClass('open');
    });

    //sub nav
    //=======
    $('#subnav').mouseenter(function () {
        $('#navSort').addClass('open');
        $('.float-layer-text').animate({
            'width':'750px'
        },'fast',function(){
            $('.float-layer-img').animate({
                'width':'200px'
            },'fast')
        })
    });
    $('#subnav>li').on({
        'mouseenter': function () {
            var index=$(this).index();
            $(this).addClass('current').siblings('li').removeClass('current');

            $('.sub-con').eq(index).show().siblings().hide();
            $('.sub-img').eq(index).show().siblings().hide();

        }
    });
    $('.nav-sort-con').mouseleave(function(){
        $('#navSort').removeClass('open');
        $('#subnav>li').removeClass('current');
        $('.float-layer-text').css('width','0');
        $('.float-layer-img').css('width','0');
    });

    //dropdown
    //========
    $('.dropdown').hover(function(){
        $(this).find('.dropdown-menu').stop().slideDown('fast');
    },function(){
        $(this).find('.dropdown-menu').stop().slideUp();
    });
    $('.dropdown-menu>li>a').click(function(){
        var _dropdown=$(this).parents('.dropdown');
        _dropdown.find('.dropdown-selected').text($(this).text());
        _dropdown.find('.dropdown-menu').hide();
    });

    //input-group:focus
    //=================
    $('.input-group .form-control').focus(function () {
        $(this).parents('.input-group').addClass('has-focus');
    }).blur(function () {
        $(this).parents('.input-group').removeClass('has-focus');
    });


    //tab caret
    //===============
    $(document).on('click', '[data-toggle="tab"]', function () {
        var $parentsDiv = $(this).parents('.tab-caret');

        if(!$parentsDiv.length) return;

        var $caret      = $parentsDiv.find('.tab-active-caret');

        if(!$caret) return;

        var divX = $parentsDiv.offset().left;
        var thisX = $(this).offset().left;
        var thisWidth = $(this).width();
        var caretWidth = $caret[0].offsetWidth;
        var positionX = Math.floor((thisX-divX)+(thisWidth-caretWidth)/2);
        $caret.animate({
            'left':positionX
        },200);
    });

    //photos thumb
    //============
    $(document)
        .on('click', '.photos-thumb img', function () {
            var $this = $(this),
                $parent = $this.parent(),
                $viewer = $this.parents('.photos-thumb').next('.photo-viewer'),
                $viewerImg = $viewer.find('img');

            var img = new Image();
            img.src = $this.attr('src');
            var imgW = img.width,
                imgH = img.height,
                showW = 400,
                showH = 400;

            if (imgW > imgH) showH = 300;
            else if (imgW < imgH) showW = 300;

            $parent.toggleClass('current')
                .siblings('li').removeClass('current');

            if ($parent.hasClass('current')) {
                $viewer
                    .show()
                    .animate({
                        width:showW,
                        height:showH
                    });
                $viewerImg
                    .attr('src',img.src)
                    .css({
                        width:showW,
                        height:showH
                    });
            } else {
                $viewer.hide()
                    .css({
                        width:0,
                        height: 0
                    })
            }
        })
        .on('click', '.photo-viewer img', function () {
            $(this).parent()
                .hide()
                .css({
                    width: 0,
                    height: 0
                });
            $(this).parent().prev('.photos-thumb').find('li').removeClass('current');
        });


    //goods tab
    //=========
    $('.gs-tab>li').click(function(){
        var index = $(this).index();
        if(index == 1){
            $('#gs-detail').addClass('only-reviews');
        } else {
            $('#gs-detail').removeClass('only-reviews');
        }

    });

    //异步获取筛选结果
    //========
    $('[data-ride="filter-tab"] li').click(function () {
        $(this).addClass('active')
            .siblings('li').removeClass('active');
    });

    //filter bar
    //==========
    $('.filter-bar li,.brand-filter li').click(function () {
        var $fa = $(this).find('.fa');
        if ($(this).hasClass('active')) {
            $fa.hasClass('fa-arrow-down')
                ? $fa.removeClass('fa-arrow-down').addClass('fa-arrow-up')
                : $fa.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
    });

    //收藏商品
    //=======
    $(document).on('click', '[data-key="favorite"]', function () {
        $(this).toggleClass('has-favorite');

        $(this).hasClass('has-favorite')
            ? $(this).html('<i class="fa fa-star"></i> 已收藏</a>')
            : $(this).html('<i class="fa fa-star-o"></i> 收藏</a>');
    });
    $('[data-key="favorite"]').each(function () {
        $(this).hasClass('has-favorite')
            ? $(this).html('<i class="fa fa-star"></i> 已收藏</a>')
            : $(this).html('<i class="fa fa-star-o"></i> 收藏</a>');
    });

    $(window).scroll(function () {
        /*==== search follow ====*/
        try{
            $('#navbar').offset().top + $('#navbar').height() <= $(document).scrollTop() ?
                $('#search-follow').addClass('fixed') :
                $('#search-follow').removeClass('fixed') ;
        }catch(e){}

    });

    //"收藏"点击事件
    //============
    $(document).on('click', '[data-ride="favorite"]', function () {
        $(this).toggleClass('favorited');
    });

    //设置品牌故事展示高度
    $(window).load(function(){
        if($('.story-list').length) {
            $('.story-list').each(function () {
                $(this).parents('.brand-story').height($(this).height());
            })
        }
    });

    //类别筛选--显示/隐藏更多
    $('.widget-items').each(function(){
        var itemHeigt=$(this).height();
        var parentHeight=$(this).parent().height();
        var $more = $(this).parents('.widget-features').find('.dpl-more');

        itemHeigt > parentHeight
            ? $more.removeClass('hidden')
            : $more.addClass('hidden')
    });
    $(window).resize(function () {
        $('.widget-items').each(function(){
            var itemHeigt=$(this).height();
            var parentHeight=$(this).parent().height();
            var $more = $(this).parents('.widget-features').find('.dpl-more');

            itemHeigt > parentHeight
                ? $more.removeClass('hidden')
                : $more.addClass('hidden')
        })
    });
    //类别筛选--点击事件
    var widgetInitHeight = $('.widget-features').height();
    $(document)
        .on('click', '.dpl-multi', function () {    //“多选”按钮点击事件
            var $this = $(this);
            var $features = $this.parents('.widget-features');
            var $items = $features.find('.widget-items');

            $features.addClass('widget-multi');

            var newHeight = $items.innerHeight();

            if (newHeight > widgetInitHeight) {
                $features.animate({
                    'height' : newHeight
                },300);
            }

        })
        .on('click', '.widget-items .checkbox-inline', function () {
            var $features = $(this).parents('.widget-features');
            var index = $features.index();
            var $widgetTxt = $(this).find('.widget-txt');
            var $widgetTxtAttr = $features.find('.widget-title>label');
            var txt = $widgetTxt.html();
            var txtAttr = $widgetTxtAttr.html();
            var $dplMore = $features.find('.dpl-more');

            if ($features.hasClass('widget-multi')) {
                //多选状态点击类目事件
                $(this).toggleClass('widget-checked');

            } else {
                //单选状态点击类目事件
                $('.widget-result').append('<li data-target="'+index+'"><span class="widget-txt">'+txtAttr+'：'+txt+'</span> <i class="fa fa-close"></i></li>');
                $features.hide().css('height',widgetInitHeight);

                $dplMore.removeClass('dpl-hide').find('.widget-txt').html('更多');
            }
        })
        .on('click', '.dpl-define', function () {   //确定按钮点击效果
            var $features = $(this).parents('.widget-features');
            var index = $features.index();
            var $labels = $features.find('.checkbox-inline');
            var $dplMore = $(this).siblings('.dpl-more');
            var txtSum = '';

            var $widgetTxtAttr = $features.find('.widget-title>label');
            var txtAttr = $widgetTxtAttr.html();

            $labels.each(function () {
                if ($(this).hasClass('widget-checked')) {
                    var curTxt = $(this).find('.widget-txt').html();
                    txtSum+=(curTxt+'，');
                }
            });
            if (txtSum) {
                $('.widget-result').append('<li data-target="'+index+'"><span class="widget-txt">'+txtAttr+'：'+txtSum.substring(0,txtSum.length-1)+'</span> <i class="fa fa-close"></i></li>');
                $features.hide();
            }

            $features.css('height',widgetInitHeight).removeClass('widget-multi');
            $dplMore.removeClass('dpl-hide').find('.widget-txt').html('更多');
            $labels.removeClass('widget-checked');
        })
        .on('click', '.widget-result>li', function () {     //取消所选类目
            $(this).remove();
            var index = $(this).attr('data-target');
            $('.widget-features').eq(index).show();
        })
        .on('click', '.dpl-more', function () {     //更多按钮点击效果
            var $txt = $(this).find('.widget-txt');
            var $features = $(this).parents('.widget-features');
            var $items = $features.find('.widget-items');
            var newHeight = $items.innerHeight();

            $(this).toggleClass('dpl-hide');

            if ($(this).hasClass('dpl-hide')) {
                $txt.html('隐藏');
                $features.animate({'height':newHeight},300);
            } else {
                $txt.html('更多');
                $features.animate({'height':widgetInitHeight},300);
            }
        })
        .on('click', '.dpl-cancel', function () {   //取消按钮点击事件
            var $features = $(this).parents('.widget-features');
            var $labels = $features.find('.checkbox-inline');

            $features
                .animate({'height' : widgetInitHeight},300)
                .removeClass('widget-multi');

            $labels.removeClass('widget-checked');
        });

    // 左侧导航
    // ======
    $('.sidebar-menu .accordion-toggle').on('click', function() {

        if (!$(this).parents('.sub-nav').length) {
            $('.accordion-toggle.menu-open').next('ul.sub-nav').slideUp('fast', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
            })
        } else {
            var _activeMenu = $(this).next('ul.sub-nav');
            var _siblingMenu = $(this).parent().siblings('li').chlidren('.accordion-toggle.menu-open').next('ul.sub-nav');

            _activeMenu.slideUp('fast', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
            });
            _siblingMenu.slideUp('fast', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
            });
        }

        if (!$(this).hasClass('menu-open')) {
            $(this).next('ul.sub-nav').slideDown('fast', function() {
                $(this).attr('style','').prev().addClass('menu-open');
            })
        }
    });

    //checkbox: select all
    $('[data-toggle="checkbox"]').click(function() {
        var target = $(this).attr('data-target');
        var result = this.checked;
        $('[name='+target+']').each(function() {
            if(!$(this).attr('disabled')) {
                this.checked = result;
            }
        })
    });

    //scroll width
    $('.shop-scroll').each(function(){
        var totalW = $(this).parent().width();
        var liWidth = $(this).find('li').outerWidth(true);
        $(this).css({
            width: (parseInt(totalW/liWidth)*liWidth)
        })
    });
    $(window).resize(function(){
        $('.shop-scroll').each(function(){
            var totalW = $(this).parent().width();
            var liWidth = $(this).find('li').outerWidth(true);
            $(this).css({
                width: (parseInt(totalW/liWidth)*liWidth)
            })
        });
    });

    // least one modal or confirm modal
    var leastOneHtml = '<div class="modal fade alert-modal" id="leastOneModal" role="dialog"aria-labelledby="leastOneLabel" aria-hidden="true"> ' +
        '<div class="modal-dialog"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> ' + '<button type="button" class="close" data-dismiss="modal"> ' + '<span aria-hidden="true">&times;</span> ' + '</button> ' + '<h4 class="modal-title" id="leastOneLabel">提示</h4> ' + '</div> ' +
        '<div class="modal-body text-center"> <span class="result-txt">请至少选择一项！</span> </div> ' +
        '</div> </div> </div>';

    var confirmHtml = '<div class="modal fade confirm-modal" id="confirmModal" role="dialog" aria-labelledby="confirmLabel" aria-hidden="true"> ' +
        '<div class="modal-dialog"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="confirmLabel">提示</h4> </div> ' +
        '<div class="modal-body text-center"> <span class="result-txt"></span> </div> ' +
        '<div class="modal-footer text-center"> <button type="button" class="btn btn-info">确定</button> <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> </div> ' +
        '</div> </div> </div>';

    if($('[data-toggle="leastOne"]').length){
        $('body').append(confirmHtml);
        $('body').append(leastOneHtml);
    }
    $('[data-toggle="leastOne"]').click(function() {
        var target = $(this).attr('data-target');

        if (getCheckedSum(target)) {
            $('#confirmModal').modal('show');
            var txt = $(this).attr('data-txt');
            $('.result-txt').html(txt)
        } else {
            $('#leastOneModal').modal('show');
        }
    });

    $('[data-toggle="confirm"]').click(function() {
        $('#confirmModal').modal('show');
        var txt = $(this).attr('data-txt');
        $('.result-txt').html(txt);
    });


    //修改密码页面，输入框错误提醒，边框变红效果
    // ========================================
    $(".modifyPwd-con .form-control").blur(function(){
        if($(this).hasClass("n-invalid")){
            $(this).addClass('modifyPwd-error');
        }else{
            $(this).removeClass('modifyPwd-error');
        }
    });

    //买家档案页面，输入框错误提醒，边框变红效果
    // =========================================
    $(".buyer-file-con .form-control").blur(function(){
        if($(this).hasClass("n-invalid")){
            $(this).addClass('modifyPwd-error');
        }else{
            $(this).removeClass('modifyPwd-error');
        }
    });

    //买家档案页面，点击编辑后效果
    // ===========================
    $(".buyer-file-con .submit").click(function(){
        $(".buyer-file-con #tel").show().parent().find('span').hide();
        $(".buyer-file-con #address").show().parent().find('span').hide();
    });
    $(".buyer-file-con #tel").hide();
    $(".buyer-file-con #address").hide();


    //首页入口页面，悬浮微信公众号效果
    // ===============================
    $('.to-top-weChat').parent().hover(function(){
        $('.weChat-publicNum').addClass('entrance-show');
        $(this).addClass("fa9008");
        $('.weChat-publicNum img').animate({
            'width':'138px'
        },'slower')
    },function(){
        $('.weChat-publicNum').removeClass('entrance-show');
        $(this).removeClass("fa9008");
    });

    //开通店铺页面，主营商品三级联动
    // =============================
    $('#menu ul li').hover(function(){
        $(this).addClass("menu-current").siblings("#menu ul li").removeClass("menu-current");
        if($(this).hasClass("menu-current")){
            $(this).children("a").css("color","#ffffff");
        }
    },function(){
        $(this).removeClass("menu-current");
        $(this).children("a").css("color","#555");
    });

    //卖家中心-上传商品，商品信息，数量区间input文本框加减操作
    // =======================================================
    $(document).on('click','.num-section .fa-caret-up', function(){//增加商品数量
        var currentNum = $(this).parent().find("input").val();
        var initialNum=1;
        //alert(currentNum);
        if(currentNum==""){
            currentNum=initialNum;
            $(this).parent().find("input").val(currentNum);
        }else{
            currentNum=++currentNum;
            $(this).parent().find("input").val(currentNum);
        }
    });

    $(document).on('click','.num-section .fa-caret-down', function(){//减少商品数量
        var currentNum = $(this).parent().find("input").val();
        var initialNum=1;
        if(currentNum==""){
            currentNum=initialNum;
            $(this).parent().find("input").val(currentNum);
        }else if(currentNum==initialNum){
            $(this).parent().find("input").val(initialNum);
        }else{
            currentNum=--currentNum;
            $(this).parent().find("input").val(currentNum);
        }
    });

    //调试index-entrance兼容性
    //========================
    $(".boxT").mouseover(function(){
        $(this).find(".overlay").prop(" display","block");
    });

    //register、register-company 注册页面
    //===================================
    $(document).on('click','.ui-protocol .btn-primary', function(){      //点击模态框里同意协议，勾选我已同意
        $(".reg-main .form-agreen").find("input").prop("checked","checked");
        $(".reg-main .submit").prop("disabled",false);
    });

    $(document).on('click','.reg-main .submit', function(){        //没有勾选我已同意，注册不能成功
        if(!$(".reg-main .form-agreen").find("input").is(':checked')){
            $(this).prop("type","button");
            $(this).prop("disabled",true);
            $(".reg-main .form-agreen a").click();
        }else{
            $(this).prop("type","submit");
            $(this).prop("disabled",false);
        }
    });

    $(document).on('click','.reg-main .form-agreen input', function(){    //勾选我已同意，注册按钮可以点击
        if(!$(this).is(':checked')){
            $(".reg-main .submit").prop("disabled",true);
        }else{
            $(".reg-main .submit").prop("disabled",false);
        }
    });

    //收藏夹批量管理，取消管理，全选，删除
    //====================================
    $("#collectGoods .batch-manage").click(function() {      //批量管理
        $(this).parents(".favorite-choose").addClass("managed");
        $(this).parents("#collectGoods").find(".fa-content").addClass("managed");
    });

    $("#collectShops .batch-manage").click(function() {
        $(this).parents(".favorite-choose").addClass("managed");
        $(this).parents("#collectShops").find(".fa-shop").addClass("managed");
    });

    $(document).on('click', '.goods-overlay', function () {   //批量管理被选中、不选中样式切换
        $(this).toggleClass("active");
    });

    $(document).on('click', '.shop-overlay', function () {
        $(this).toggleClass("active");
    });

    $(document).on('click', '#collectGoods .cancel-manage', function () {   //取消批量管理
        $(this).parents(".favorite-choose").removeClass("managed");
        $(this).parents(".favorite-choose").find(".checkbox-inline").removeClass('widget-checked');
        $(this).parents("#collectGoods").find(".fa-content").removeClass('managed');
        $("#collectGoods").find(".fa-content .goods-overlay").removeClass("active");
    });

    $(document).on('click', '#collectShops .cancel-manage', function () {
        $(this).parents(".favorite-choose").removeClass("managed");
        $(this).parents(".favorite-choose").find(".checkbox-inline").removeClass('widget-checked');
        $(this).parents("#collectShops").find(".fa-shop").removeClass('managed');
        $("#collectShops").find(".fa-shop .shop-overlay").removeClass("active");
    });

    $(document).on('click', '#collectGoods .check-all', function () {    //批量管理全选
        var isSelected = $(this).find(".checkbox-inline").hasClass('widget-checked');
        if(!isSelected){
            $(this).find(".checkbox-inline").addClass('widget-checked');
            $(this).parents("#collectGoods").find(".fa-content").addClass('checkedAll');
            $("#collectGoods").find(".fa-content .goods-overlay").addClass("active");
        }else{
            $(this).find(".checkbox-inline").removeClass('widget-checked');
            $(this).parents("#collectGoods").find(".fa-content").removeClass('checkedAll');
            $("#collectGoods").find(".fa-content .goods-overlay").removeClass("active");
        }
    });

    $(document).on('click', '#collectShops .check-all', function () {
        var isSelected = $(this).find(".checkbox-inline").hasClass('widget-checked');
        if(!isSelected){
            $(this).find(".checkbox-inline").addClass('widget-checked');
            $(this).parents("#collectShops").find(".fa-shop").addClass('checkedAll');
            $("#collectShops").find(".fa-shop .shop-overlay").addClass("active");
        }else{
            $(this).find(".checkbox-inline").removeClass('widget-checked');
            $(this).parents("#collectShops").find(".fa-shop").removeClass('checkedAll');
            $("#collectShops").find(".fa-shop .shop-overlay").removeClass("active");
        }
    });

    $(".delete-all-goods").click(function(){     //批量管理删除模态框
        var isSelected = $("#collectGoods .goods-overlay").hasClass("active");
        if(isSelected){
            $(this).prop("href","#batch-delete");
        }else{
            $(this).prop("href","#batch-delete-tip");
        }
    });

    $(".delete-all-shop").click(function(){
        var isSelected = $("#collectShops .shop-overlay").hasClass("active");
        if(isSelected){
            $(this).prop("href","#batch-delete-shop");
        }else{
            $(this).prop("href","#batch-delete-tip");
        }
    });

    $(".favorite-tab-left li").click(function(){   //搜索tab-pane切换
        $(this).addClass("active").siblings().removeClass("active");
    });


    //采购计划单
    //==========
    $(document).on('focus', '.textarea-edit .item-desc', function () {  //鼠标焦点移入物料描述文本域
        $(this).addClass("edit");
    });

    $(document).on('blur', '.textarea-edit .item-desc', function () {  //鼠标焦点移出物料描述文本域
        $(this).removeClass("edit");
    });

    $(document).on('click', '.purchase-plan .tip-close', function () {
        $(this).parents(".go-line-tips").animate({'height':0 ,'padding-top':0,'padding-bottom':0},300)
    });

    $(document).on('click', '.purchase-plan .wait-close', function () {
        $(this).parents(".go-line-tips").animate({'height':0 ,'padding-top':0,'padding-bottom':0},300)
    });




});

//获取name值相同多选框已选中的个数
function getCheckedSum(name) {
    var sum = 0;
    $('[type="checkbox"][name='+name+']').each(function() {
        if(this.checked) sum++;
    });
    return sum
}
