require("requirejs").define("routes/proxy", ["linq"], function (Enum) {
    var path = require('path');

    return function (req, res, next) {
        var superman = req.application.get("superman");
        var proxy = superman.proxy;
        var settings = superman.settings;
        var ruleMatchers = superman.ruleMatchers;
        var ruleActions = superman.ruleActions;
        var rules=Enum.from(settings.rules).where(function (rule) {
            return rule.active;
        }).orderBy(function(rule) {
            return rule.priority;
        }).toArray();

        function matchRule(rule, req) {
            var matcher = ruleMatchers[rule.matcher];
            return  !!matcher && matcher(rule, req,superman);
        }

        function actOnRule(rule, req, res) {
            var action=ruleActions[rule.action];
            if(!action)
            {
                return "";
            }
            else {
                return action(rule,req,res,superman);
            }
        }

        try {
            rules.some(function (rule) {
                if (matchRule(rule, req)) {
                    var actionResult = actOnRule(rule, req, res);
                    var proxyState=[];
                    if(!!actionResult)
                    {
                        proxyState.push(actionResult);
                    }
                    if(!!rule.description)
                    {
                        proxyState.push(rule.description);
                    }
                    res.proxyState=proxyState.join(" - ");
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
