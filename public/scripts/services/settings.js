define("services/settings", ["app"], function (app) {
	return app.factory("settings", ["$resource",
		function ($resource) {
			var service = $resource("/superman/:action", {}, {
				load: {
					method: "GET",
					params: { action: "getSettings" }
				},
				save: {
					method: "POST",
					params: { action: "setSettings" }
				}
			});
			return {
                load: function (cb) {
					return service.load(cb);
				},
                save: function (settings,cb) {
					return service.save({},settings,cb);
				}
			};
		}
	]);
});
