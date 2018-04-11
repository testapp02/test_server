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
	mysql.query("insert into te (tname,tpass,cid,fid) values ('"+req.query.tname+"','"+csmima+"',"+req.query.cid+","+req.query.fid+")",function(err,result){
		chuli(err,result,res);
	});
});
router.get("/del",function(req,res){
	mysql.query("delete from te where tid="+req.query.tid,function(err,result){
		chuli(err,result,res);
	});
});
router.get("/update",function(req,res){
	mysql.query("update te set tname='"+req.query.tname+"',cid="+req.query.cid+",fid="+req.query.fid+" where tid="+req.query.tid,function(err,result){
		chuli(err,result,res);
	});
});
router.get("/selectAll",function(req,res){
	var info=req.query.like;
	var like=info?" and (te.sname like '%"+info+"%' or classes.cname like '%"+info+"%' or finfo.fname like '%"+info+"%')":"";
	var sql="select te.*,classes.cname,finfo.fname from te,classes,finfo where (te.cid=classes.cid and te.fid=finfo.fid)"+like;
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
	var like=info?" and (te.tname like '%"+info+"%' or classes.cname like '%"+info+"%' or finfo.fname like '%"+info+"%')":"";
		var sql="select te.*,classes.cname,finfo.fname from te,classes,finfo where (te.cid=classes.cid and te.fid=finfo.fid)"+like+" limit "+req.query.page*10+",10";
		mysql.query(sql,function(err,result){
			if(err){
				res.end(JSON.stringify({message:"err"}));
			}else{
				res.end(JSON.stringify(result));
			}
		});
});
router.get("/reset",function(req,res){
	mysql.query("update te set tpass='"+csmima+"' where tid="+req.query.tid,function(err,result){
		chuli(err,result,res);
	});
});
router.post('/addMore', upload.single('addMore'), function (req, res, next) {
	async.parallel([function(next){
		mysql.query("select * from classes",function(err,result){
			if(err){
				next("err");
			}else{
				var obj1={};
				result.forEach(function(val){
					obj1[val.cname]=val.cid;
				});
				next(null,obj1);
			}
		});
	},function(next){
		mysql.query("select * from finfo",function(err,result){
			if(err){
				next("err")
			}else{
				var obj2={};
				result.forEach(function(val){
					obj2[val.fname]=val.fid;
				});
				next(null,obj2);
			}
		});
	}],function(err,results){
		if(err){
			res.end("err");
		}else{
			var datas=xlsx.parse(req.file.path);
			var arr=[]
			datas.forEach(function(val){
				val.data.forEach(function(val1,index){
					if(index==0){
						return;
					}
					var arr1=[val1[0],csmima,results[1][val1[2]],results[0][val1[1]]];
					arr.push(arr1);
				});
			});
			mysql.query("insert into te (tname,tpass,fid,cid) values ?",[arr],function(err,result){
				console.log(err);
				chuli(err,result,res);
			});
		}
	});
})
router.post("/delMore",function(req,res){
	var datas=JSON.parse(req.body.datas);
	var sql="delete from te where tid in (";
	for(var i in datas){
		sql=sql+i+",";
	}
	sql=sql.slice(0,sql.length-1)+")";
	mysql.query(sql,function(err,result){
		chuli(err,result,res);
	});
});
module.exports=router;
