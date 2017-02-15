/**
 * Created by zhe-he.
 */
const fs = require('fs');
const express=require('express');
const bodyParser=require('body-parser');
const multerLib=require('multer');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
// var multer=multerLib({dest:'upload'});

var app=express();
var port = process.argv[2]?process.argv[2].replace('--',''):3332;
app.listen(port);

//使用中间件
app.use(bodyParser.urlencoded({extended:false}));
// app.use(multer.any());
app.use(cookieParser());
app.use(cookieSession({
    name:'test-session',
    keys:['dev','test'],
    maxAge:20*60*1000
}));

// 接口
// get post file cookie session
// console.log(req.query,req.body,req.files,req.cookies,req.session);

//静态资源
app.use(express.static(`${__dirname}/www`));

var child_process = require('child_process');
var cmd;
if (process.platform === 'win32') {
	cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
} else if (process.platform === 'linux') {
	cmd = 'xdg-open';
} else if (process.platform === 'darwin') {
	cmd = 'open';
}
child_process.exec(`${cmd} "http:\/\/localhost:${port}"`);