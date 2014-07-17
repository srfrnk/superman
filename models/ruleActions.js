require("requirejs").define("models/ruleActions", ["models/mongooseHelper"], function (mongooseHelper) {
    var path = require('path');

    return {
        "static-file": function (rule, req, res,proxyInfo) {
            var filePath = path.join(req.application.get("__dirname"), rule.filePath);
            res.sendfile(filePath);
            return "Static-File => "+rule.filePath;
        },
        "pass-through": function (rule, req, res,proxyInfo) {
            proxyInfo.proxy.web(req, res, {target: req.url}, function (err) {
                console.log("proxy pass through error:",err);
            });
            return "Pass-Through";
        },
        "proxy": function (rule, req, res,proxyInfo) {
            proxyInfo.proxy.web(req, res, {target: req.target}, function (err) {
                console.log("proxy error:",err);
            });
            return "Proxy => "+rule.target;
        }        
    };
});
