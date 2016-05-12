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
var mongooseOptions = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
};
var mongodbUri = 'mongodb://cmpe280:cmpe280@ds013162.mlab.com:13162/cmpe280';
mongoose.connect(mongodbUri, mongooseOptions);
var conn = mongoose.connection;
var mongooseLogSchema = mongoose.Schema({
    latitude: mongoose.Schema.Types.Number,
    longitude: mongoose.Schema.Types.Number,
    country: mongoose.Schema.Types.String,
    region: mongoose.Schema.Types.String,
    city: mongoose.Schema.Types.String,
    timestamp: mongoose.Schema.Types.Date,
    uri: mongoose.Schema.Types.String
});
io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('channel_to_send_data', {for: 'everyone'});
});
var Tail = require('always-tail2');
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
};
function tailLog() {
    var requestAddress = process.env.FLASK_URL;
    if(requestAddress==undefined)
        requestAddress = "http://127.0.0.1:5000/";
    var ipadd = "Ipadd";
    var logFileLocation = 'logs/access.log'; //Log Location
    /* Keeping Track of new entries in the log
     Continuously running and monitoring
     */
    var watchLogEntries = function () {
        var options = {
            lineSeparator: /[\r]{0,1}\n/,
            fromBeginning: false,
            watchOptions: {},
            follow: true,
            logger: console
        };
        var tail = new Tail(logFileLocation, '\n', options);

        tail.on("line", function (data) {
            processLine(data);
        });

        tail.on("error", function (error) {
            console.log('ERROR: ', error);
        });

        tail.watch();

    };


    var re1 = '.*?';   // Non-greedy match on filler
    //Regex for status
    /*var re42 = '\\d+';  // Uninteresting: int
    var re3 = '.*?';    // Non-greedy match on filler
    var re4 = '\\d+';   // Uninteresting: int
    var re5 = '.*?';    // Non-greedy match on filler
    var re6 = '\\d+';   // Uninteresting: int
    var re7 = '.*?';    // Non-greedy match on filler
    var re8 = '\\d+';   // Uninteresting: int
    var re9 = '.*?';    // Non-greedy match on filler
    var re10 = '\\d+';  // Uninteresting: int
    var re11 = '.*?';   // Non-greedy match on filler
    var re12 = '\\d+';  // Uninteresting: int
    var re13 = '.*?';   // Non-greedy match on filler
    var re14 = '\\d+';  // Uninteresting: int
    var re15 = '.*?';   // Non-greedy match on filler
    var re16 = '\\d+';  // Uninteresting: int
    var re17 = '.*?';   // Non-greedy match on filler
    var re18 = '\\d+';  // Uninteresting: int
    var re19 = '.*?';   // Non-greedy match on filler
    var re20 = '\\d+';  // Uninteresting: int
    var re21 = '.*?';   // Non-greedy match on filler
    var re22 = '\\d+';  // Uninteresting: int
    var re23 = '.*?';   // Non-greedy match on filler
    var re24 = '\\d+';  // Uninteresting: int
    var re25 = '.*?';   // Non-greedy match on filler
    var re26 = '\\d+';  // Uninteresting: int
    var re27 = '.*?';   // Non-greedy match on filler
    var re28 = '\\d+';  // Uninteresting: int
    var re29 = '.*?';   // Non-greedy match on filler
    var re30 = '(\\d+)';    // Integer Number 1*/

   //200,202,204,300,301,302,400,401,404,407,408,500,502,504
    var regStatus='(200|202|204|300|301|302|400|401|404|407|408|500|502|504)';
   // var pStatus = new RegExp(re1 + re42 + re3 + re4 + re5 + re6 + re7 + re8 + re9 + re10 + re11 + re12 + re13 + re14 + re15 + re16 + re17 + re18 + re19 + re20 + re21 + re22 + re23 + re24 + re25 + re26 + re27 + re28 + re29 + re30, ["i"]);
      var pStatus=new RegExp(re1+regStatus,["i"]);		
    var red1 = '((?:(?:[0-2]?\\d{1})|(?:[3][01]{1}))[-:\\/.](?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[-:\\/.](?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3})))(?![\\d])';  // DDMMMYYYY 1
    var red2 = '.*?';   // Non-greedy match on filler
    var red3 = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';    // HourMinuteSec 1
    // DDMMYY 1
    var red4 = '.*?';   // Non-greedy match on filler
    var red5 = '([-+]\\d+)';    // Integer Number 1
    var ts = new RegExp(re1 + red1 + red2 + red3 + red4 + red5, ["i"]);

    //Regex for IPAddress
    var re2 = '((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?![\\d])';  // IPv4 IP Address 1
    var p = new RegExp(re1 + re2, ["i"]);


    //parsing the webpage accesses

    var regPageAccessed = '((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))';   // HTTP URL 1

    var pgAccessed = new RegExp(re1 + regPageAccessed, ["i"]);


    //parse the page
    var regwebPage = '((?:[\\/|\\.]?)(?:[^\\s"]*))'; // Unix Path 1

    var webPage = new RegExp(regwebPage, ["i"]);

//Obtain IP address from the Log line
    var processLine = function (line) {
        if (line === '') {
            return console.log("No readStream");
        }

        //Extracting IPaddress from log Entry
        var txt = line.toString();

        var m = p.exec(txt);
        //check if IP is present
        if (m != null) {
            var ipaddress1 = m[1];
            var ipaddr = ipaddress1.replace(/</, "&lt;");

        }

        var status = getStatus(txt);
        console.log("STATUS  "+status);
        var dateTimeStamp = getDate(txt);
        var webPage = getPageAccessed(txt);
        PostCode(requestAddress, ipadd, ipaddr, status, dateTimeStamp, webPage);
    };

   var getStatus = function (txt) {

        var stats = pStatus.exec(txt);
        if (stats != null) {
            var int1 = stats[1];
            return int1.replace(/</, "&lt;");
        }

    };
    var getDate = function (txt) {


        var timestamp = ts.exec(txt);
        if (timestamp != null) {
            var ddmmmyyyy1 = timestamp[1];
            var ddmmyy1 = timestamp[2];
            var signed_int1 = timestamp[3];
            var timestmp = ddmmmyyyy1.replace(/</, "&lt;") + " " + ddmmyy1.replace(/</, "&lt;") + " " + signed_int1.replace(/</, "&lt;");
            var dtmstmp = new Date(timestmp);
            return dtmstmp;
        }
    };


     var getPageAccessed = function (txt) {


        var pageAccessed = pgAccessed.exec(txt);

        if (pageAccessed != null) {
            var httpurl1 = pageAccessed[1];
            var page = httpurl1.replace(/</, "&lt;");
            page = page.split('/').slice(1).join('/');

            return page
        }
    };

    var PostCode = function (requestAddress, ipadd, ipaddress, status, dateTimeStamp, webPage) {

        var data = querystring.stringify({
            ipadd: ipaddress
        });
        var requestURL = process.env.FLASK_URL;
        if(requestURL==undefined)
            requestURL = 'http://127.0.0.1:5000/iptrace?ipadd=' + ipaddress;
        else
            requestURL = requestURL + 'iptrace?ipadd=' + ipaddress;
        console.log(requestURL);
        reqHttp(requestURL, function (error, response, body) {
            var d = new Date();

            if (error) {
                console.log("Error ");
                console.log(body);
                console.log(error);
            }
            else {
               if (!String.prototype.startsWith) {
                 String.prototype.startsWith = function(searchString, position){
                  position = position || 0;
                     return this.substr(position, searchString.length) === searchString;
                };
                }
                if (!body.startsWith("<!DOCTYPE",0)) {
                    var b = JSON.parse(body);
                    var payload = {
                        latitude: b['latitude'],
                        longitude: b['longitude'],
                        country: b['country'],
                        region: b['region'],
                        city: b['city'],
                        status: status,
                       timestamp: dateTimeStamp,
                        uri: webPage
                    };
                    console.log(payload)
                    var collection_name = "collection_" + d.yyyymmdd();
                    conn.collection(collection_name).insert(payload);
                    console.log("sending new entry")  
                    console.log(payload)  
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/dashboard.html');
});

app.get('/oldData', function(req, res)  {
   res.sendFile(__dirname + "/views/old_data.html");
});

app.get('/liveMap', function(req, res)  {
   res.sendFile(__dirname + "/views/liveMap.html");
});

app.get('/mostVisited', function(req, res)  {
   res.sendFile(__dirname + "/views/mostVisited.html");
});


app.get('/mapOldDta', function(req, res)  {
   res.sendFile(__dirname + "/views/mapOldData.html");
});

app.get('/statusPie', function(req, res)  {
   res.sendFile(__dirname + "/views/statusPie.html");
});

app.get('/aboutUs', function(req, res)  {
   res.sendFile(__dirname + "/views/about_us.html");
});

app.get('/contact', function(req, res)  {
   res.sendFile(__dirname + "/views/locations_new.html");
});

app.get('/hourlyData/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
            {
                $group: {
                    _id: {
                        year: {
                            $substr: ["$timestamp", 0, 4]
                        },
                        month: {
                            $substr: ["$timestamp", 5, 2]
                        },
                        day: {
                            $substr: ["$timestamp", 8, 2]
                        },
                        hour: {
                            $substr: ["$timestamp", 11, 2]
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ],
        function (err, result) {
            if (err) {
                console.log("Error!");
            }
            else {
                res.send(result)
            }
        }
    );
});

app.get('/pieForStatusCode/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
            {
                $group: {
                    _id: {
                        status_code: "$status"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ],
        function (err, result) {
            if (err) {
                console.log("Error!");
            }
            else {
                res.send(result);
            }
        });
});

app.get('/mostVisitedPage/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
        {
            $group: {
                _id: {
                    path: "$uri"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ], function (err, docs) {
        if (err) {
            console.log("Error!");
        }
        else {
            res.send(docs.slice(0, 5));
        }
    })
});


app.get('/mapDataOldData/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
        {
            $group: {
                _id: {
                    lat: "$latitude",
                    lng: "$longitude"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
               // _id: -1
				count :-1
            }
        }
    ], function (err, docs) {
        if (err) {
            console.log("Error!");
        }
        else {
            //res.send(docs); 
			 res.send(docs.slice(0, 5));
        }
    })
});

/**
 * Code for Pie CHART
 */



app.get('/mapDataOldDataPieChart/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
        {
            $group: {
                _id: {
                    status: "$status",
                    //lng: "$longitude"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                 _id: -1
                //count :-1
            }
        }
    ], function (err, docs) {
        if (err) {
            console.log("Error!");
        }
        else {
            res.send(docs);
           // res.send(docs.slice(0, 5));
        }
    })
});


//END : Code for PIE chart

app.get('/groupByCountry/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
        {
            $group: {
                _id: {
                    country:"$country"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ], function (err, docs) {
        if (err) {
            console.log("Error!");
        }
        else {
            res.send(docs);
        }
    })
});

app.get('/pieForStatusCodeGrouped/:customDate', function (req, res) {
    var collection_name = "collection_" + req.params.customDate;
    var collection_model = mongoose.model(collection_name, mongooseLogSchema);
    collection_model.aggregate([
            {
                $group: {
                    _id: {
                        path: "$uri",
                        status_code: "$status"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ],
        function (err, result) {
            if (err) {
                console.log("Error!");
            }
            else {
                res.send(result);
            }
        });
});

app.get('/listAllDates', function (req, res) {
    mongoose.connection.db.listCollections().toArray((function (err, names) {
        if (err) {
            console.log("Mongo Error!");
        }
        else {
            var collections = [];
            for (var i = 0; i < names.length; i++) {
                if (names[i].name.startsWith("collection_")) {
                    var v = names[i].name;
                    v = v.replace("collection_", "");
                    collections.push(new Date(v.substring(0, 4), v.substring(4, 6), v.substring(6, 8)));
                }
            }
            res.send(collections);
        }

    }))
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});


