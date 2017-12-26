function search(){
	var type=$('#type').text();
	var keyword=$('#keyword').val();
	if(type=="配件"){
		window.location.href='front/searchAction!search?keyword='+keyword+'';
	}else if(type=="整机"){
		window.location.href='front/searchAction!machinesearch?keyword='+keyword+'';
	}else if(type=="店铺"){
		
		window.location.href='front/searchAction!shopSearch?keyword='+keyword+'';
	}
}

