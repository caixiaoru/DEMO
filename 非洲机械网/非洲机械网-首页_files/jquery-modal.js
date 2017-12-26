 function alertModel(target,text){
   		var modalBackdrop="<div class='modal_backdrop'></div>";
    	var _body=$("body");
    	_body.addClass("modal_open").append(modalBackdrop);
    	
    	$(document.getElementById(target)).fadeIn();
    	
    	$("#promptCon").html(text);
    	
   }
$(function(){
    var modalBackdrop="<div class='modal_backdrop'></div>";
    var _body=$("body");

    //open modal
    $('body').on('click','[data-toggle="modal"]',function(){
        var _this=$(this);
        var _target=$(document.getElementById(_this.attr("data-target")));

        _body.addClass("modal_open").append(modalBackdrop);
        _target.fadeIn();

        if(checkScrollbar()){
            _body.css("padding-right",measureScrollbar());
        }
    })

    //close modal
    $(".modal_effect, [data-dismiss='modal']").click(function(){
        closeModal();
    })

    var closeModal=function(){
        _body.removeClass("modal_open").removeAttr("style");
        $(".modal_backdrop").remove();
        $(".modal").hide();
    }

    //get scrollbar width
    var measureScrollbar=function(){
        var scrollDiv=document.createElement("div");
        scrollDiv.className="modal_scrollbar_measure";
        _body.append(scrollDiv);
        var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;
        _body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    }

    //check scrollbar
    var checkScrollbar=function(){
        return document.body.scrollHeight > document.documentElement.clientHeight
    }

})