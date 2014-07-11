require("requirejs").define("models/ruleActions", ["models/mongooseHelper"], function (mongooseHelper) {
    var path = require('path');

    return {
        "static-file": function (rule, req, res,proxyInfo) {
            var filePath = path.join(req.application.get("__dirname"), 'public/images/placeholder-img.jpg');
            res.sendfile(filePath);
            return "Blocked";
        },
        "pass-through": function (rule, req, res,proxyInfo) {
            proxyInfo.proxy.web(req, res, {target: req.url}, function (err) {
                console.log("proxy pass through error:",err);
            });
            return "Pass-Through";
        }
    };
});
