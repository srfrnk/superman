require("requirejs").define("models/ruleActions", ["models/mongooseHelper"], function (mongooseHelper) {
    var path = require('path');

    return {
        "static-file": function (rule, req, res,proxyInfo) {
            var filePath = path.join(req.application.get("__dirname"), rule.filePath);
            res.setHeader("X-Server","Superman");
            res.sendfile(filePath);
            return "Static-File => "+rule.filePath;
        },
        "pass-through": function (rule, req, res,proxyInfo) {
            proxyInfo.proxy.web(req, res, {target:req.url}, function (err) {
                console.log("proxy pass through error:",req.url,err);
            });
            return "Pass-Through";
        },
        "localhost": function (rule, req, res,proxyInfo) {
            var targetPort = rule.localPort || 80;
            proxyInfo.proxy.web(req, res, {target: "http://localhost:" + targetPort}, function (err) {
                console.log("localhost error:",req.url,err);
            });
            return "Localhost "+targetPort;
        }        
    };
});
