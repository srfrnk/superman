require("requirejs").define("routes/getSettings", [], function () {
	return function (req, res,next) {
		res.send(req.application.get("superman").settings);
//		next();
	}
});
