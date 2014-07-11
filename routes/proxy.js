require("requirejs").define("routes/proxy", [], function () {
    var path = require('path');

    return function (req, res, next) {
        var proxyInfo = req.application.get("proxy");
        var proxy = proxyInfo.proxy;
        var proxySettings = proxyInfo.proxySettings;
        var ruleMatchers = proxyInfo.ruleMatchers;
        var ruleActions = proxyInfo.ruleActions;

        function matchRule(rule, req) {
            var matcher = ruleMatchers[rule.matcher];
            return  !!matcher && matcher(rule, req,proxyInfo);
        }

        function actOnRule(rule, req, res) {
            var action=ruleActions[rule.action];
            if(!action)
            {
                return "";
            }
            else {
                return action(rule,req,res,proxyInfo);
            }
        }

        try {
            proxySettings.rules.some(function (rule) {
                if (matchRule(rule, req)) {
                    res.proxyState=[actOnRule(rule,req,res),rule.description].join("-");
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        catch (err) {
            next(err);
        }
    }
});
