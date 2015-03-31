(function () {
    angular.module("toastCE").directive("toastMessage", [
        "$compile",
        "toastConfig",
        function ($compile, toastConfig) {
            var scope = {
                    message: "=",
                    scope: "="
                },
                link = function ($scope, elem) {
                    for (var prop in $scope.scope) {
                        if (!(prop === "message" || prop === "scope")) {
                            $scope[prop] = $scope.scope[prop];
                        } else {
                            console.warn("ToastCE: 'message' and 'scope' are reserved key words and may not be used for the provided scope");
                        }
                    }

                    $compile(elem.append($scope.message))($scope);
                };

            return {
                restrict: "E",
                replace: true,
                templateUrl:  toastConfig.templatePath + 'toastMessageTemplate.html',
                scope: scope,
                link: link
            };
        }]);
})();