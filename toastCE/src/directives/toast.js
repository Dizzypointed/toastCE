(function () {
    angular.module("toastCE").directive("toast", [
        "toastFactory",
        "toastConfig",
        function (toastFactory, config) {
            var link = function ($scope) {
                if (!$scope.channel) {
                    $scope.channel = "default";
                }

                $scope.toasts = toastFactory.toasts;
                $scope.config = config;
                $scope.close = function (id) {
                    toastFactory.close(id);
                };
                $scope.pauseTimer = function (toast) {
                    toast.pauseTimer();
                };
                $scope.playTimer = function (toast) {
                    toast.startTimer();
                };

                $scope.positionClasses = $scope.position ? config.positionClasses[config.positions.indexOf($scope.position)] : config.positionClasses[config.defaultPosition];
            };

            return {
                restrict: "E",
                replace: "true",
                scope: {
                    channel: "=",
                    position: "="
                },
                link: link,
                templateUrl: "../src/templates/toastTemplate.html"
            };
        }]);
})();