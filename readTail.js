/*
 *
 @author Sarika Nitin Kale
 *
 */
var expressApp=require('express').Router();
var fs=require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');
var lineReader = require('line-reader');
var sys=require('sys');
var Tail = require('always-tail2');
var request = require("request");
var http=require('http');
var querystring = require('querystring');

module.exports = function(){
    var requestAddress="http://127.0.0.1:5000/";
    var ipadd="Ipadd";
    var logFileLocation='logs/access.log'; //Log Location
    /* Keeping Track of new entries in the log
     Continuously running and monitoring
     */
    var watchLogEntries=function (){
        var options= {lineSeparator: /[\r]{0,1}\n/, fromBeginning: false, watchOptions: {}, follow: true, logger: console}
        tail = new Tail(logFileLocation,'\n',options);

        tail.on("line", function(data) {
            console.log("TAIL--------------------"+data)
            processLine(data);
        });

        tail.on("error", function(error) {
            console.log('ERROR: ', error);
        });

        tail.watch();

    };



    //Accessing the access.log file
    var openFile=function(){
        lineReader.eachLine(logFileLocation, function(line, last) {
            if (last) {
                console.log(line);
                processLine(line);
            }
        });
    }


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
            sendIPRequests(ipaddr);
        }

    }


    /*
     Sends the new IP address to the Flask server
     */
    var sendIPRequests = function (ipaddress){
        PostCode(requestAddress,ipadd,ipaddress);
    };


    var insertParam = function(requestAddress,key, value)
    {
        var requestAddr=requestAddress+"?"+key+"="+value;
        return requestAddr;
    }


    var PostCode = function(requestAddress,ipadd,ipaddress) {

        var data = querystring.stringify({
            ipadd: ipaddress
        });
        console.log(ipaddress);
        var requestURL=	'/iptrace?ipadd='+ipaddress;
        console.log(requestURL);
        var options = {
            host: '127.0.0.1',
            port: 5000,
            method: 'GET',
            path: requestURL,
            headers: {
                'Content-Length': Buffer.byteLength(data)
            }
        };

        var httpreq = http.request(options, function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log("body: " + chunk);
            });

        });
        httpreq.write(data);
        httpreq.end();
    };

    watchLogEntries();

};