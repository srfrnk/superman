var requirejs = require("requirejs");

requirejs.config({ deps: ["app"]});

requirejs.define("app", ["models/ruleMatchers", "models/ruleActions", "routes/index", "routes/login", "routes/view", "routes/data", "routes/proxy", "routes/getSettings", "routes/setSettings"/*server-route:,"routes/<%=nameCamel%>"*/, "middleware/proxyLog"/*server-middleware:,"middleware/<%=nameCamel%>"*/, "models/mongooseHelper"],
    function (ruleMatchers, ruleActions, indexRoute, loginRoute, viewRoute, dataRoute, proxyRoute, getSettingsRoute, setSettingsRoute/*server-route:,<%=nameCamel%>Route*/, proxyLog/*server-middleware:,<%=nameCamel%>*/) {
        /**
         * Module dependencies.
         */

        var express = require("express.io");
        var http = require('http');
        var path = require('path');
        var stylus = require('stylus');
        var util = require('util');
        var busboy = require('connect-busboy');
        var repl = require("repl");

        var packageJson = require("./package.json");

        var app = express();
        app.http().io();

// all environments
        app.set('port', process.env.PORT || 8000);
        app.set('views', path.join(__dirname, 'views'));
        app.set('__dirname', __dirname);
        app.set('view engine', 'ejs');
        app.set('packageJson', packageJson);
        app.use("/superman/", express.favicon());
        app.use("/superman/", express.logger('dev'));
        app.use("/superman/", express.json());
        app.use(busboy({ immediate: false }));
        app.use(express.cookieParser("YourCookieKey"));
        app.use(express.session({secret: "YourSessionKey"}));
        app.use("/superman/" + packageJson.version, stylus.middleware(path.join(__dirname, 'public')));
        app.use("/superman/" + packageJson.version, express.static(path.join(__dirname, 'public')));
        app.use("/superman/" + packageJson.version, express.static(path.join(__dirname, 'bower_components')));
        app.use("/superman/" + packageJson.version, express.static(path.join(__dirname, 'components')));
        app.use(function (req, res, next) {
            req.application = app;
            next();
        });

        app.use(app.router);

        app.use("/", proxyLog);
        /*server-middleware:app.use("/",<%=nameCamel%>);<%='\n\t'%>*/

        var httpProxy = require('http-proxy');
        var proxy = httpProxy.createProxyServer();

        var settingsFile = require("./settings.json");

        app.set("superman", {
            settings: settingsFile,
            proxy: proxy,
            ruleMatchers: ruleMatchers,
            ruleActions: ruleActions
        });


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

        app.get("/superman/" + packageJson.version + "/view/:name", viewRoute);
        app.all("/superman/" + packageJson.version + "/data/:action", dataRoute);
        app.all("/superman/getSettings", getSettingsRoute);
        app.all("/superman/setSettings", setSettingsRoute);
        app.get("/superman", indexRoute);
        app.get("/superman/*", indexRoute);

        app.all("/*", proxyLog, proxyRoute);
        /*server-route:app.all("set_url_here", <%=nameCamel%>Route);<%='\n\t'%>*/

        app.listen(app.get("port"), function () {
            console.log("Express server listening on port " + app.get("port"));

            setTimeout(function () {
                console.log("Superman for the rescue!");
                console.log("Type 'sm' to see my insides.");
                console.log("Type '.exit' to exit.");
                var r = repl.start({
                    prompt: "Superman >> ",
                    input: process.stdin,
                    output: process.stdout
                });

                r.on('exit', function () {
                    console.log("Superman out!");
                    process.exit();
                });

                r.context.sm = app.get("superman");
            }, 1000);
        });
    });
