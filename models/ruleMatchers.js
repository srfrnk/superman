require("requirejs").define("models/ruleMatchers", ["models/mongooseHelper"], function (mongooseHelper) {
    return {
        "url-string": function (rule, req,proxyInfo) {
            return new RegExp("^" + rule.url + ".*$").test(req.url);
        },
        "url-regex": function (rule, req,proxyInfo) {
            return new RegExp(rule.url).test(req.url);
        },
        "match-all": function (rule, req,proxyInfo) {
            return true;
        }
    };
});
