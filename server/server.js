const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());

const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const moment = require('moment');

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); // 2019-06-14 17:30:32
};

const tsFormat = () => (new Date()).toLocaleTimeString(); // 2019-06-14
console.log(timeStampFormat().split(" ", 1));
var logger = winston.createLogger({
    transports: [
      new (winstonDaily)({ // 파일에 기록하는 쪽 설정부분
            name: 'info-file',
            filename: './log/server_%DATE%.log',  //date값을 넣어서 경로를 설정한다.
            datePattern: 'YYYY-MM-DD', //올라가는 date의 포맷
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            format: winston.format.printf(info => `${timeStampFormat()} [ Connect ip : ${info.message} ]`) //기록 포멧 설정
        }),
        new (winston.transports.Console)({ // 콘솔 출력 하는 쪽 설정부분
               name: 'debug-console',
               colorize: true,
               level: 'debug', // debug이상 콘솔 출력
               showLevel: true,
               json: false,
               format: winston.format.printf(info => `${timeStampFormat()} [ Connect ip : ${info.message} ]`) //콘솔 출력 포멧 설정
       })
    ]
  });


const multer = require('multer');
const uploads = multer({dest: './uploads'});
app.use('/image', express.static(__dirname + '/uploads')); // /image에 접근 시 /uploads로 접근이 되도록 설정
const data = fs.readFileSync('./database.json'); //mysql에 대한 정보를 따로 json파일로 만들어 놓고 불러온다.
const conf = JSON.parse(data); //mysql에 대한 데이터를 json 형태로 바꿔준다.
const mysql = require('mysql');

const connection = mysql.createConnection({ //mysql과의 연결을 정의하는 부분
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/category', (req,res) => {

  if(req.query.category){ //카테고리 값이 존재할 때. 카테고리별로 포스트를 보여주는 페이지에서 호출할 때
    const category = req.query.category;//이건 url의 파라미터라서 영어로 정의해 놓음
    let categoryK = ""; //db에는 category 값이 한글로 되어있어서 아래 코드 에서 변수에 해당 카테고리에 맞는 한글이름을 부여한다.
    if(category == "programming"){
      categoryK = "프로그래밍";
    }else if (category == "life") {
      categoryK = "일상";
    }else if (category == "song") {
      categoryK = "노래";
    }else if (category == "ufc") {
      categoryK = "UFC/격투기";
    }else if (category == "english") {
      categoryK = "영어";
    }

    connection.query( //카테고리에 맞는 board테이블의 데이터들을 select 함
      "select * from board where category='"+categoryK+"' order by id desc",
      (err, rows, fields) => {
        res.send(rows);
      }
    );

  }else{ // 카테고리 값이 존재하지 않을 때. 메인페이지에서 카테고리 상관없이 모든 페이지를 보여준다.

    connection.query(
      "select * from board order by id desc",
      (err, rows, fields) => {
        res.send(rows);
      }
    );

  }
});

//포스트들의 데이터를 클라이언트로 넘겨주는 부분. 클라이언트가 /post에 접속하면 호출된다.
app.get('/api/post', (req,res) => {
  connection.query(
    "select * from board where id = '"+req.query.bno+"'",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

//포스트의 id인 bno값을 query로 넘겨받고 해당 포스트의 comment를 select를 통해 불러와서 넘겨주는 부분
app.get('/api/comment', (req,res) => {
  connection.query(
    "select * from comment where bno = '"+req.query.bno+"'",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

//Right 컴포넌트에서 최근댓글을 보여주기 위해 데이터를 받아오는 부분
app.get('/api/comment/recent', (req,res) => {
  connection.query(
    "select * from comment order by id desc limit 10",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

//Right 컴포넌트에서 최근포스트들을 보여주기 위해 데이터를 받아오는 부분
app.get('/api/post/recent', (req,res) => {
  connection.query(
    "select * from board order by id desc limit 6",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

//Right 컴포넌트에서 가장 많이 본 포스트들을 보여주기 위해 데이터를 받아오는 부분
app.get('/api/post/most', (req,res) => {
  connection.query(
    "select * from board order by hit desc limit 6",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post('/api/save', uploads.single('image'), (req,res) => { //포스트를 저장하는 부분
  let sql = 'insert into board  (category, title, content, date, img) values (?, ?, ?, ?, ?)';
  let image= null;
  if(req.file){ //파일이 있는경우
    image = '/image/' + req.file.filename; //이미지의 path를 정의
    console.log(image);
  }
  let category = req.body.category;
  let title = req.body.title;
  let content = req.body.content;
  let date = req.body.date;
  let params = [category, title, content, date, image]; //쿼리로 날려주기 위해 값들을 배열화 함
  connection.query(sql, params,
    (err,rows,fields) => {
      if(!err){
        console.log(params);
      }else{
        console.log('에러 : ' + err);
      }
      //res.send("악악z");
    });
});

//에디터에 이미지를 첨부하면 호출됨
app.post('/api/editorimage', uploads.single('image'), (req,res) => {
  let image = '/image/' + req.file.filename; //이미지의 path를 정의
  res.send(image);
});

app.post('/api/save/comment', (req,res) => { //댓글을 저장하는 부분
  let sql = 'insert into comment (bno, content, nickname, pw, date) values (?, ?, ?, ?, ?)';
  let bno = req.body.bno;
  let content = req.body.content;
  let nickname = req.body.nickName;
  let pw = req.body.pw;
  let date = req.body.date;
  let params = [bno, content, nickname, pw, date]; //받아온 값들을 params 배열에 담는다.
  connection.query(sql, params,
    (err,rows,fields) => {
      if(!err){
        console.log(params);
      }else{
        console.log('에러 : ' + err); //에러시 출력
      }
      //res.send(rows);
    });
});

app.post('/api/modify/comment', (req,res) => { //댓글을 저장하는 부분
  let sql = 'UPDATE comment SET content = ? WHERE id = ?';
  let content = req.body.content;
  let id = req.body.id;
  let params = [content, id]; //받아온 값들을 params 배열에 담는다.
  connection.query(sql, params,
    (err,rows,fields) => {
      if(!err){
        console.log(params);
      }else{
        console.log('에러 : ' + err); //에러시 출력
      }
      res.send("seccess");
    });
});

app.post('/api/delete/comment', (req,res) => { //댓글을 저장하는 부분
console.log("id : " + req.body.id)
  let sql = 'DELETE from comment WHERE id = ?';
  let id = req.body.id;
  let params = [id]; //받아온 값들을 params 배열에 담는다.
  connection.query(sql, params,
    (err,rows,fields) => {
      if(!err){
        console.log(params);
      }else{
        console.log(sql);
        console.log('에러 : ' + err); //에러시 출력
      }
      res.send("seccess");
    });
});

//접속자 ip 파일 중 오늘날짜 파일을 가져와서 넘겨준다.
app.get('/api/ip', (req,res) => {
  fs.readFile('./log/server_'+timeStampFormat().split(" ", 1)+'.log', 'utf8', function(err, data){
    //console.log(data);
    res.send(data);
  });
});

app.post('/api/setCookie', (req,res) => {
  if(req.cookies.recentPost == req.body.bno){
    //아무일도 없음
    res.send("seccess");
  }else{
    res.cookie('recentPost', req.body.bno, {
      maxAge: 10000
    });

    let sql = 'UPDATE board SET hit = hit + 1 WHERE id = ?';
    let id = req.body.bno;
    let params = [id]; //받아온 값들을 params 배열에 담는다.
    connection.query(sql, params,
      (err,rows,fields) => {
        if(!err){
          console.log(params);
        }else{
          console.log('에러 : ' + err); //에러시 출력
        }
        res.send("seccess");
      });
  }
  /*console.log("드을어어오옴")
  const cookieName = 'read' + req.body.bno;
  console.log(req.cookies.cookieName + "얍얍")
  if(req.cookies.cookieName !== undefined){
    console.log("쿠키 이미 있음");
  }else{
    console.log("쿠키 만들었음");
    res.cookie('read' + req.body.bno, 2, {
    maxAge: 5000
    });
  }*/
});


//그래프를 그릴 데이터를 얻는 곳이다. 날짜를 query값으로 받아서 6일전부터 오늘까지 총 7일간 데이터를 받아서 수치화시킨 데이터를 넘겨준다.
app.get('/api/ip/data', (req,res) => {
  var dataArray = []; //우선 json을 담을 배열을 선언한다.
    const func1 = ()=>{
      //req.query.date는 클라이언트쪽에서 넘겨준 날짜이다. 그로부터 6일전 파일부터 읽는다. 아래는 6일전 ip파일을 읽는 콜백함수
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-6,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){//데이터가 있으면 (아무도 접속안해서 data가 없는 경우도 있기 때문)
          //데이터의 개수는 줄바꿈(\n)단위로 잘라서 배열을 만든 후 그 length를 가져오는 방식으로 구했다.
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-6,"days").format("YYYY-MM-DD"));
          //x는 날짜, y는 이 날짜의 접속 수
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-6,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{ //만약 데이터가 없는경우 접속 수에 0을 넣어준다 (당연한 소리)
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-6,"days").format("YYYY-MM-DD"), y : 0});
        }
        func2(); //6일전 데이터를 dataArray에 넣었으므로 5일 전 데이터를 넣는 함수를 실행시킨다.
      });
    };

    const func2 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-5,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-5,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-5,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-5,"days").format("YYYY-MM-DD"), y : 0});
        }
          func3();
      });
    };

    const func3 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-4,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-4,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-4,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-4,"days").format("YYYY-MM-DD"), y : 0});
        }
        func4();
      });
    };

    const func4 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-3,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-3,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-3,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-3,"days").format("YYYY-MM-DD"), y : 0});
        }
        func5();
      });
    };

    const func5 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-2,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-2,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-2,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-2,"days").format("YYYY-MM-DD"), y : 0});
        }
        func6();
      });
    };

    const func6 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(-1,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(-1,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-1,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(-1,"days").format("YYYY-MM-DD"), y : 0});
        }
        func7();
      });
    };

    const func7 = ()=>{
      fs.readFile('./log/server_'+moment(req.query.date, "YYYY-MM-DD").add(0,"days").format("YYYY-MM-DD")+'.log', 'utf8', function(err, data){
        if(data){
          console.log(data.split('\n').length + ", " + moment(req.query.date, "YYYY-MM-DD").add(0,"days").format("YYYY-MM-DD"));
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(0,"days").format("YYYY-MM-DD"), y : (data.split('\n').length-1)});
        }else{
          console.log("0");
          dataArray.push({x : moment(req.query.date, "YYYY-MM-DD").add(0,"days").format("YYYY-MM-DD"), y : 0});
        }
        console.log("---------------------")
        res.send(dataArray); //7일분 데이터를 모두 담았으므로 dataArray를 클라이언트 쪽으로 보내준다. 데이터를 받은 클라이언트는 데이터를 이용해서 그래프를 그린다.
      });
    };

    func1(); //func1을 실행시켜서 func7까지 순서대로 실행하게 한다.
});

//메인페이지에 접속했을 때 호출 된다.
app.post('/api/connect', (req,res) => {
  console.log("connect!!");
  var ip = req.headers['x-forwarded-for']; //헤더의 속성 값(ip)을 변수에 담고
  logger.info(ip); //오늘날짜 파일에 값을 추가한다.
});

app.listen(port, () => console.log(`Listening on port ${port}`));
