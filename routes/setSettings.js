require("requirejs").define("routes/setSettings", [], function () {
	return function (req, res,next) {
        var superman=req.application.get("superman");
        var settings=req.body;
        superman.settings=settings;
		res.send("ok");
//		next();
	}
});
