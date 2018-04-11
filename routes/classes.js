			var express = require('express');
var router = express.Router();
var mysql=require("./mysq.js");
/* GET home page. */
router.get('/add', function(req, res, next) {
	mysql.query("insert into classes (cname,fid) values ('"+req.query.cname+"',"+req.query.fid+")",function(err,result){
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
router.get("/del",function(req,res){
	mysql.query("delete from classes where cid="+req.query.cid,function(err,result){
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
})
router.get("/select",function(req,res){
	mysql.query("select classes.*,finfo.fname from classes,finfo where classes.fid=finfo.fid",function(err,result){
		if(err){
			res.end(JSON.stringify({message:"err"}));
		}else{
			res.end(JSON.stringify(result));
		}
	});
});
router.get("/edit",function(req,res){
	mysql.query("update classes set cname='"+req.query.cname+"',fid="+req.query.fid+" where cid="+req.query.cid,function(err,result){
		console.log(111);
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
router.get("/checkCname",function(req,res){
	mysql.query("select * from where cname='"+req.query.cname+"'",function(req,res){
		
	});
});
module.exports = router;
