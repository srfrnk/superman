define("states/main", ["app","controllers/main"], function (app) {
	return app.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state("main", {
			url: "/superman",
			templateUrl: __webApp_ResourceRoot+"/templates/main.html",
			controller: "main"
		});
	}]);
});
