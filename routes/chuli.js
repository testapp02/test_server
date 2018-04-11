module.exports=function(err,result,res) {
	if(err){
		res.end("err");
	}else{
		if(result.affectedRows>0){
			console.log(22);
			res.end("ok");
		}else{
			res.end("err");
		}
	}
}
