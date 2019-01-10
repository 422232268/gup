var http = require("http");
var url = require("url");
var iconv = require("iconv-lite");
var ws = require("nodejs-websocket");
console.log("开始建立连接...")
var strUrl = "http://hq.sinajs.cn/list=sz000070,sh000010";
var resData = '';
var timer;

var game1 = null,
  game2 = null,
  game1Ready = false,
  game2Ready = false;
var server = ws.createServer(function (conn) {
  conn.on("text", function (str) {
    console.log("收到的信息为:" + str)
    if (str === "game1") {
      game1 = conn;
      game1Ready = true;
      conn.sendText("success");
    }
    if (str === "game2") {
      game2 = conn;
      game2Ready = true;
    }
    if (game2Ready) {
      if (timer) {
        console.log(timer)
        clearInterval(timer)
        console.log('定时器存在')
      }
      timer = setInterval(() => {
        http.get(strUrl, function (res) {
          res.on("data", function (chunk) {
              chunk = iconv.decode(chunk, 'GBK');
              // var spj = chunk.split('=')[1].split(',')[3]
              // var time = chunk.split('=')[1].split(',')[31]
              // console.log(chunk)
              var a = new Date().getTime();
              var b = a.toString()
              game2.sendText(chunk);
              resData = chunk;

            })
            .on("end", function () {
              // console.log(resData.join(""));
            });
        });
        console.log(resData)
        console.log('------------')
      }, 1000);

    }


    conn.sendText(str)
  })
  conn.on("close", function (code, reason) {
    console.log("关闭连接")
  });
  conn.on("error", function (code, reason) {
    console.log("异常关闭")
  });
}).listen(8001)
console.log("WebSocket建立完毕")