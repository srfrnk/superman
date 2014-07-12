define("controllers/main", ["app", "linqjs", "services/settings"], function (app, Enum) {
    return app.controller("main", ["$scope", "$translate", "$translatePartialLoader", "settings"/*,"$socket"*/, function ($scope, $translate, $translatePartialLoader, settings/*,$socket*/) {
        $translatePartialLoader.deletePart("main", true);
        $translatePartialLoader.addPart("main");
        $translate.refresh();

//		$socket.on('realtime:broadcast', function(data) {
//			$scope.messages.push(data);
//		});
//		$socket.emit('realtime:connect', {});

        settings.load().$promise.then(function (data) {
            $scope.settings = {
                rules: Enum.From(data.rules).OrderBy(function (rule) {
                    return rule.priority;
                }).ToArray()
            }
        });

        angular.extend($scope, {
            save: function () {
                var rules = $scope.settings.rules;
                rules.forEach(function (rule, idx) {
                    rule.priority=idx+1;
                });
                settings.save({
                    rules: rules
                });
            },
            add: function () {
                $scope.settings.rules.unshift({
                    priority:0,
                    description:"New Rule",
                    comment:"Put any comment in here...",
                    matcher:"match-all",
                    action:"pass-through",
                    active:false
                });
            },
            delete: function (idx) {
                $scope.settings.rules.splice(idx,1);
            }
//			messages:[],
//			send: function (message) {
//				$socket.emit('realtime:message', {message:message});
//			}
        });
    }]);
});
