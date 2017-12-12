var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('./node_modules/reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var argv = require('minimist')(process.argv.slice(2));

var app = express()

var publicDir = path.join(__dirname, 'public')

var counter = 0;
app.engine('.html', require('ejs').__express);
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'html')
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded
app.get('/', function (req, res) {
  res.render(path.join(publicDir, 'kmimakers.html'), {
    visitCounter: counter
  });
})

var server = http.createServer(app)

opt = {"verbose": true, "openBrowser": true}
var reloadServer = reload(app, opt);

function startServer(){
  server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}

function reloadBrowser(){
  counter++;
  console.log("Reload browser, visitor #" + counter);
  reloadServer.reload()
}

startServer();

if(argv.pi == true){

  var Gpio = require('onoff').Gpio,
      buzzer = new Gpio(18, 'out'),
      pir = new Gpio(17, 'in', 'both');

  pir.watch(function(err, value) {
      if (err) exit();
      buzzer.writeSync(value);
      console.log('Intruder detected');
      if(value === 1){
        reloadBrowser();
      }
  });

  console.log('Knowledge Makers Pi Bot deployed successfully!');
  console.log('Guarding the Magic door...');

  function exit() {
      buzzer.unexport();
      pir.unexport();
      process.exit();
  }
} else {
  setInterval(reloadBrowser, 5*1000);
}
