var ctx=""
function getctx(ctx){
	this.ctx=ctx
	check();
}

/*在线客服*/
function check(){
	$.ajax({ 
		type:"post", 
		url:ctx+'front/ordinaryUserAction!onlineService', 
		success:function(msg){
			data=eval(msg);
			$('#onlineService').attr('href','tencent://message/?uin='+data[0].online+'&Site='+data[0].online+'&Menu=yes');
			$('#topAd').attr('src',ctx+''+data[0].topAd+'');
			$('#topUrl').attr('href',''+data[0].topUrl+'');
			
		}
	})
}