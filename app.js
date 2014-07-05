var requirejs = require("requirejs");

requirejs.config({ deps: ["app"]})

requirejs.define("app", ["routes/index", "routes/login", "routes/view", "routes/data"/*server-route:,"routes/<%=nameCamel%>"*/, "models/mongooseHelper"],
    function (indexRoute, loginRoute, viewRoute, dataRoute/*server-route:,<%=nameCamel%>Route*/) {
        /**
         * Module dependencies.
         */

        var express = require("express.io");
        var http = require('http');
        var path = require('path');
        var stylus = require('stylus');
        var util = require('util');
        var busboy = require('connect-busboy');
        var fs = require('fs');

        var packageJson = require("./package.json");
        var app = express();

        app.http().io();
        var httpProxy = require('http-proxy');

        var proxy = httpProxy.createProxyServer();

/*
        http.createServer(function (req, res) {
            try {
                if (/.*res.cloudinary.com.*//*
.test(req.url)) {
                    console.log("Blocked: " + req.url);

                    var filePath = path.join(__dirname, 'public/images/img.jpg');
                    var stat = fs.statSync(filePath);

                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                        'Content-Length': stat.size
                    });

                    fs.createReadStream(filePath).pipe(res);
                }
                else {
                    console.log("Pass-through: " + req.url);
                    proxy.web(req, res, {target: req.url});
                }
            }
            catch (err) {
                console.log(err);
            }
        }).listen(8000);
*/

// all environments
        app.set('port', process.env.PROXY_PORT || 8000);
//        app.set('views', path.join(__dirname, 'views'));
//        app.set('view engine', 'ejs');
//        app.set('packageJson', packageJson);
//        app.use(express.favicon());
//        app.use(express.logger('dev'));
//        app.use(express.json());
//        app.use(busboy({ immediate: false }));
//        app.use(express.cookieParser("YourCookieKey"));
//        app.use(express.session({secret: "YourSessionKey"}));
//        app.use("/" + packageJson.version, stylus.middleware(path.join(__dirname, 'public')));
//        app.use("/" + packageJson.version, express.static(path.join(__dirname, 'public')));
//        app.use("/" + packageJson.version, express.static(path.join(__dirname, 'bower_components')));
//        app.use("/" + packageJson.version, express.static(path.join(__dirname, 'components')));
        app.use(function (req, res, next) {
            req.application = app;
            next();
        });
        app.use(function (req, res, next) {
            function logRequest() {
                console.log(req.method,req.url,res.statusCode,res.proxyState);
            }

            res.once('finish', logRequest);
            res.once('close', logRequest);
            next();
        });
        app.use(app.router);



// development only
        if ("development" == app.get("env")) {
            app.use(express.errorHandler());
        }

        /*
         app.io.route("realtime", {
         "connect": function (req) {
         req.io.join("mainRoom");
         },
         "message": function (req) {
         app.io.sockets.socket(req.io.socket.id).emit("realtime:broadcast", {message: req.data.message});
         }
         });
         */

        app.all("/*", function (req, res,next) {
            try {
                if (/.*res.cloudinary.com.*/.test(req.url)) {
                    res.proxyState="Blocked";

                    var filePath = path.join(__dirname, 'public/images/img.jpg');
                    res.sendfile(filePath);
                }
                else {
                    res.proxyState="Pass-through";
                    proxy.web(req, res, {target: req.url}, function (err) {
                        next(err);
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
//        app.get("/" + packageJson.version + "/view/:name", viewRoute);
//        app.all("/" + packageJson.version + "/data/:action", dataRoute);
//        app.get("/*", indexRoute);
        /*server-route:app.all("set_url_here", <%=nameCamel%>Route);<%='\n\t'%>*/

        app.listen(app.get("port"), function () {
            console.log("Express server listening on port " + app.get("port"));
        });
    });
