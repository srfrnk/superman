require("requirejs").define("middleware/proxyLog", [], function () {
    return function (req, res, next) {
        res.proxyState = "";

        function logRequest() {
            console.log(res.proxyState, res.statusCode, req.method, req.url);
        }

        res.once('finish', logRequest);
        res.once('close', logRequest);
        next();
    };
});

