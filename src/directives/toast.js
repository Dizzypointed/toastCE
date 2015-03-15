(function () {
    angular.module("toastCE").directive("toast", [
        "toastFactory",
        "toastConfig",
        "$templateCache",
        function (toastFactory, toastConfig) {
            var link = function ($scope) {
                $scope.toasts = toastFactory.toasts;
                $scope.config = toastConfig;
                $scope.close = function (id) {
                    toastFactory.close(id);
                };
                $scope.pauseTimer = function (toast) {
                    toast.pauseTimer();
                };
                $scope.playTimer = function (toast) {
                    toast.startTimer();
                };
            };

            return {
                restrict: "E",
                replace: "true",
                scope: {},
                link: link,
                templateUrl:  "src/templates/toastTemplate.html"
            };
        }]);
})();