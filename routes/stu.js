var express=require("express");
var router=express.Router();
var mysql=require("./mysq.js");
var md5=require("./md5");
var csmima=md5("123456");
var chuli=require("./chuli.js");
var multer  = require('multer');
var xlsx = require('node-xlsx');
var async=require("async");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+"-"+file.originalname)
  }
})

var upload = multer({ storage: storage });
router.get("/addSingle",function(req,res){
	mysql.query("insert into stuinfo (sname,spass,cid) values ('"+req.query.sname+"','"+csmima+"',"+req.query.cid+")",function(err,result){
		chuli(err,result,res);
	});
});
router.get("/del",function(req,res){
	mysql.query("delete from stuinfo where sid="+req.query.sid,function(err,result){
		chuli(err,result,res);
	});
});
router.get("/update",function(req,res){
	mysql.query("update stuinfo set sname='"+req.query.sname+"',cid="+req.query.cid+" where sid="+req.query.sid,function(err,result){
		chuli(err,result,res);
	});
});
router.get("/selectAll",function(req,res){
	var info=req.query.like;
	var like=info?" and (stuinfo.sname like '%"+info+"%' or classes.cname like '%"+info+"%' or finfo.fname like '%"+info+"%')":"";
	var sql="select stuinfo.*,classes.cname,finfo.fname from stuinfo,classes,finfo where (stuinfo.cid=classes.cid and classes.fid=finfo.fid)"+like;
	mysql.query(sql,function(err,result){
		if(err){
			res.end("1");
		}else{
			res.end(Math.ceil((result.length/10)).toString());
		}
	});
});
router.get("/select",function(req,res){
	var info=req.query.like;
	var like=info?" and (stuinfo.sname like '%"+info+"%' or classes.cname like '%"+info+"%' or finfo.fname like '%"+info+"%')":"";
		var sql="select stuinfo.*,classes.cname,finfo.fname from stuinfo,classes,finfo where (stuinfo.cid=classes.cid and classes.fid=finfo.fid)"+like+" limit "+req.query.page*10+",10";
		mysql.query(sql,function(err,result){
			if(err){
				res.end(JSON.stringify({message:"err"}));
			}else{
				res.end(JSON.stringify(result));
			}
		});
});
router.get("/reset",function(req,res){
	mysql.query("update stuinfo set spass='"+csmima+"' where sid="+req.query.sid,function(err,result){
		chuli(err,result,res);
	});
});
router.post('/addMore', upload.single('addMore'), function (req, res, next) {
	async.waterfall([function(next){
		mysql.query("select * from classes",function(err,result){
			if(!err){
				var obj={};
				result.forEach(function(val,index){
					obj[val.cname]=val.cid;
				});
				next(null,obj);
			}else{
				res.end("err");
			}
		});
	},function(obj,next){
		var datas=xlsx.parse(req.file.path);
		var sql="insert into stuinfo (sname,spass,cid) values";
		datas.forEach(function(val,index){
			val.data.forEach(function(val1,index){
				if(index==0){
					return;
				}
				sql+=" ('"+val1[0]+"','"+csmima+"',"+obj[val1[1]]+"),";
			});
		});
		mysql.query(sql.slice(0,sql.length-1),function(err,result){
			next(null,err,result);
		});
	}],function(err,a,b){
		if(err){
			res.end("err");
		}else{
			chuli(a,b,res);
		}
	});
})
router.post("/delMore",function(req,res){
	var datas=JSON.parse(req.body.datas);
	var sql="delete from stuinfo where sid in (";
	for(var i in datas){
		sql=sql+i+",";
	}
	sql=sql.slice(0,sql.length-1)+")";
	mysql.query(sql,function(err,result){
		chuli(err,result,res);
	});
});
module.exports=router;
