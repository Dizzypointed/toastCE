(function () {
    angular.module("toastCE").directive("toast", [
        "toastFactory",
        "toastConfig",
        function (toastFactory, toastConfig) {
            var link = function ($scope) {
                if(!angular.isDefined($scope.channel)){
                    $scope.channel = "default";
                }

                $scope.toasts = toastFactory.toasts;
                $scope.config = toastConfig;
                $scope.close = function (id) {
                    toastFactory.close(id);
                };
                $scope.pauseTimer = function (toast) {
                    if(toast.timerEnabled){
                        toast.pauseTimer();
                    }
                };
                $scope.playTimer = function (toast) {
                    if(toast.timerEnabled) {
                        toast.startTimer();
                    }
                };

                $scope.positionClasses = angular.isDefined($scope.position) ? $scope.config.positionClasses[$scope.config.positions.indexOf($scope.position)] : $scope.config.positionClasses[$scope.config.defaultPosition];
            };

            return {
                restrict: "E",
                replace: "true",
                scope: {
                    channel: "=",
                    position: "="
                },
                link: link,
                templateUrl: toastConfig.templatePath + "toastTemplate.html"
            };
        }]);
})();