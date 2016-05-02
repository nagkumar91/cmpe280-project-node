var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var reqHttp = require('request');
var mongoose = require('mongoose');
var mongooseOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
var mongodbUri = 'mongodb://cmpe280:cmpe280@ds013162.mlab.com:13162/cmpe280';
mongoose.connect(mongodbUri, mongooseOptions);
var conn = mongoose.connection;
var mongooseLogSchema = mongoose.Schema({
    latitude: mongoose.Schema.Types.Number,
    longitude: mongoose.Schema.Types.Number,
    country: mongoose.Schema.Types.String,
    region: mongoose.Schema.Types.String,
    city: mongoose.Schema.Types.String,
    timestamp: mongoose.Schema.Types.Date
});
io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('channel_to_send_data', { for: 'everyone' });
});
var Tail = require('always-tail2');
Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};
function tailLog(){
    var requestAddress="http://127.0.0.1:5000/";
    var ipadd="Ipadd";
    var logFileLocation='logs/access.log'; //Log Location
    /* Keeping Track of new entries in the log
     Continuously running and monitoring
     */
    var watchLogEntries=function (){
        var options= {
            lineSeparator: /[\r]{0,1}\n/,
            fromBeginning: false,
            watchOptions: {},
            follow: true,
            logger: console
        };
        var tail = new Tail(logFileLocation,'\n',options);

        tail.on("line", function(data) {
            processLine(data);
        });

        tail.on("error", function(error) {
            console.log('ERROR: ', error);
        });

        tail.watch();

    };



//Obtain IP address from the Log line
    var processLine=function(line){
        if(line ===''){
            return console.log("No readStream");
        }

        //Extracting IPaddress from log Entry
        var txt=line.toString();
        var re1='.*?';	// Non-greedy match on filler
        var re2='((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?![\\d])';	// IPv4 IP Address 1
        var p = new RegExp(re1+re2,["i"]);
        var m = p.exec(txt);
        //check if IP is present
        if (m != null)
        {
            var ipaddress1=m[1];
            var ipaddr=ipaddress1.replace(/</,"&lt;");
            //sendIPRequests(ipaddr);
            PostCode(requestAddress,ipadd,ipaddr);
        }

    };

    var PostCode = function(requestAddress,ipadd,ipaddress) {

        var data = querystring.stringify({
            ipadd: ipaddress
        });
        var requestURL=	'http://127.0.0.1:5000/iptrace?ipadd='+ipaddress;
        reqHttp(requestURL, function(error, response, body)   {
            var d = new Date();

            if(error)   {
                console.log("Error ");
                console.log(body);
                console.log(error);
            }
            else    {
                if(!body.startsWith("<!DOCTYPE"))    {
                    var b = JSON.parse(body);
                    var payload = {
                        latitude: b['latitude'],
                        longitude: b['longitude'],
                        country: b['country'],
                        region: b['region'],
                        city: b['city'],
                        status: "200",
                        timestamp: d
                    };
                    var collection_name = "collection_" + d.yyyymmdd();
                    conn.collection(collection_name).insert(payload);
                    io.emit('channel_to_send_data', payload);
                }

            }
        });
    };

    watchLogEntries();

};

tailLog();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/dashboard.html');
});


app.get('/olderData/:customDate', function(req, res)  {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
            { $group : {
                _id: {
                    year :  { $substr : ["$timestamp", 0, 4 ] },
                    month : { $substr : ["$timestamp", 5, 2 ] },
                    day :   { $substr : ["$timestamp", 8, 2 ] },
                    hour :   { $substr : ["$timestamp", 11, 2 ] }
                },
                count: { $sum: 1 }
            }
            },
            { $sort : { _id : -1}}
    ],
        function(err, result){
            if(err) {
                console.log("Error!");
            }
            else    {
                res.send(result)
            }
        }
    );
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});


