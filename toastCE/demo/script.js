// Code goes here

angular.module("app", ["toastCE"])
  .controller("fred", ["$scope",
  "toastFactory",
  function ($scope, toastFactory) {
    $scope.pressCount = 0;
    $scope.newToast = function () {
      console.log(toastFactory.pop({type: "info", title: "Hej! ", message: "Grön! <button type='button' class='btn btn-primary' ng-click='press()'>press</button>", timerEnabled: true, scope: {
        press: function () {
          $scope.pressCount += 1;
        }
      }}));
    };
  }]);