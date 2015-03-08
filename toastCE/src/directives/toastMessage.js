(function () {
    angular.module("toastCE").directive("toastMessage", [
        "$compile",
        function ($compile) {
            var scope = {
                message: "=",
                scope: "="
            },
              link = function ($scope, elem) {
                  for (var prop in $scope.scope) {
                      if (prop === "message" || prop === "scope") {
                          console.warn("ToastCE: 'message' and 'scope' are reserved key words and may not be used for the provided scope");
                      }
                      $scope[prop] = $scope.scope[prop];
                  }

                  $compile(elem.append($scope.message))($scope);
              };

            return {
                restrict: "E",
                replace: true,
                template: '<div class="toast-message"></div>',
                scope: scope,
                link: link
            };
        }]);
})();