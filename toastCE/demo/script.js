// Code goes here

angular.module("app", ["toastCE"])
  .controller("fred", ["$scope",
  "toastFactory",
  function ($scope, toastFactory) {
      var getNextToast = function () {
          var toasts = [{
              type: "info",
              title: "Hello! ",
              message: "Presses will be tracked! <br/><br/><button type='button' class='btn btn-primary' ng-click='press()'>press</button>",
              timerEnabled: true,
              scope: {
                  press: function () {
                      $scope.pressCount += 1;
                  }
              }
          },
          {
              type: "success",
              title: "Hello again! ",
              message: "This toast will close on timer, but does not show the timer. <br/>These presses will be tracked to! <br/><button type='button' class='btn btn-primary' ng-click='press()'>press</button>",
              timerEnabled: true,
              showTimer: false, 
              scope: {
                  press: function () {
                      $scope.pressCount += 1;
                  }
              }
          },
          {
              type: "warning",
              title: "Hello again! ",
              message: "This warning will not be closed on timer, but can be dissmissed on click!",
              timerEnabled: false,
              closeOnClick: true,
              showCloseButton: false
          },
          {
              type: "success",
              title: "Hello again! ",
              message: "This is what the timer looks like when there's success! ",
              timerEnabled: true,
          },
          {
              type: "warning",
              title: "Hello again! ",
              message: "This is what the timer looks like on a warning! ",
              timerEnabled: true,
          },
          {
              type: "danger",
              title: "Hello again! ",
              message: "This is what the timer looks like when there's danger! ",
              timerEnabled: true,
          }];

          if (!$scope.index) {
              $scope.index = 0;
          }

          var toast = toasts[$scope.index];

          $scope.index = $scope.index + 1 >= toasts.length ? 0 : $scope.index + 1;

          return toast;
      }

      $scope.pressCount = 0;
      $scope.newToast = function () {
          console.log(toastFactory.pop(getNextToast()));
      };
  }]);