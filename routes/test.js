var express = require('express');
var router = express.Router();
var mysql = require("./mysq");
var chuli = require("./chuli");
var async = require("async");
/* GET home page. */
router.get('/addType', function(req, res) {
	mysql.query("insert into type (typename) values ('"+req.query.typename+"')",function(err,result){
		chuli(err,result,res);
	});
});
router.get("/selectType",function(req,res){
	mysql.query("select * from type",function(err,result){
		if(err){
			res.end(JSON.stringify([]));
		}else{
			res.end(JSON.stringify(result));
		}
	});
});
router.get("/delType",function(req,res){
	mysql.query("delete from type where typeid="+req.query.typeid,function(err,result){
		chuli(err,result,res);
	});
});
router.get("/editType",function(req,res){
	mysql.query("update type set typename='"+req.query.typename+"' where typeid="+req.query.typeid,function(err,result){
		chuli(err,result,res);		
	});
});
router.post("/addTest",function(req,res){
	mysql.query("insert into test (fid,typeid,options,title,result) values (?,?,?,?,?)",[req.body.fid,req.body.typeid,req.body.options,req.body.title,req.body.result],function(err,result){
		chuli(err,result,res);
	});
});
router.get("/selectAll",function(req,res){
	if(req.query.like){
		like=" where (title like '%"+req.query.like+"%' or result like '%"+req.query.like+"%' or options like '%"+req.query.like+"%')";
		fid=req.query.fid?" and (fid="+req.query.fid+")":""
	}else{
		like="";
		fid=req.query.fid?" where (fid="+req.query.fid+")":"";
	}
	if(fid){
		typeid=req.query.typeid?" and (typeid="+req.query.typeid+")":"";		
	}else{
		typeid=req.query.typeid?" where (typeid="+req.query.typeid+")":"";		
	}
	var sql="select * from test"+like+fid+typeid;
	mysql.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.end("1");
		}else{
			res.end(JSON.stringify(Math.ceil(result.length/5)));
		}
	});
});
router.get("/selectTest",function(req,res){
	if(req.query.like){
		like=" where (title like '%"+req.query.like+"%' or result like '%"+req.query.like+"%' or options like '%"+req.query.like+"%')";
		fid=req.query.fid?" and (fid="+req.query.fid+")":""
	}else{
		like="";
		fid=req.query.fid?" where (fid="+req.query.fid+")":"";
	}
	if(fid){
		typeid=req.query.typeid?" and (typeid="+req.query.typeid+")":"";		
	}else{
		typeid=req.query.typeid?" where (typeid="+req.query.typeid+")":"";		
	}
	var page=req.query.page;
	var sql="select * from test"+like+fid+typeid+" limit "+page*5+",5";
	mysql.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.end(JSON.stringify([]));
		}else{
			res.end(JSON.stringify(result));
		}
	})
});
router.get("/delTest",function(req,res){
	mysql.query("delete from test where testid="+req.query.testid,function(err,result){
		chuli(err,result,res);
	})
});
router.get("/selectSignTest",function(req,res){
	async.parallel([function(next){
		var sql="select test.*,finfo.fname,type.typename from test,finfo,type where finfo.fid=test.fid and type.typeid=test.typeid and test.testid="+req.query.testid;
	mysql.query(sql,function(err,result1){
		if(err){
			console.log(err);
			next("err");
		}else{
			next(null,result1);
		}
	});
	},function(next){
		mysql.query("select * from finfo",function(err,result2){
			if(err){
				next(err);
			}else{
				next(null,result2);
			}
		});
	},function(next){
		mysql.query("select * from type",function(err,result3){
			if(err){
				next(err);
			}else{
				next(null,result3);
			}
		});
	}],function(err,results){
		console.log(results);
		if(err){
			res.end(JSON.stringify({message:"err"}));
		}else{
			res.end(JSON.stringify(results));
		}
	});
});
router.post("/editTest",function(req,res){
	mysql.query("update test set title=?,fid=?,typeid=?,result=?,options=? where testid=?",[req.body.title,req.body.fid,req.body.typeid,req.body.result,req.body.options,req.body.testid],function(err,result){
		console.log(err);
		chuli(err,result,res);
	});
});
module.exports = router;