var express=require("express");
var router=express.Router();
var mysql=require("./mysq.js");
router.get("/add",function(req,res){
	var fname=req.query.fname;
	mysql.query("insert into finfo (fname) values ('"+fname+"')",function(err,result){
		if(err){
			res.end("err");
		}else{
			if(result.affectedRows>0){
				res.end("ok");
			}else{
				res.end("err");
			}
		}
	});
});
router.get("/select",function(req,res){
	mysql.query("select * from finfo",function(err,result){
		if(err){
			var obj={
				message:"err"
			}
			res.end(JSON.stringify(obj));
		}else{
			res.end(JSON.stringify(result));
		}
	});
});
router.get("/del",function(req,res){
	mysql.query("delete from finfo where fid="+req.query.fid,function(err,result){
		if(err){
			res.end("err");
		}else{
			res.end("ok");
		}
	});
});
router.get("/edit",function(req,res){
	mysql.query("update finfo set fname='"+req.query.fname+"' where fid="+req.query.fid,function(err,result){
		if(err){
			res.end("err");
		}else{
			if(result.affectedRows>0){
				res.end("ok");
			}else{
				res.end("err");
			}
		}
	});
});
router.get("/checkFname",function(req,res){
	mysql.query("select * from finfo where fname='"+req.query.fname+"'",function(err,result){
		if(err){
			res.end("err");
		}else{
			if(result.length>0){
				res.end("err");
			}else{
				res.end("ok");
			}
		}
	});
});
module.exports=router;