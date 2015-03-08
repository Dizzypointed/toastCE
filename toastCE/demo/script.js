// Code goes here

angular.module("app", ["toastCE"])
  .controller("fred", ["$scope",
  "toastFactory",
  function ($scope, toastFactory) {
      var getNextToast = function () {
          var toasts = [
          {
              type: "success",
              title: "Welcome! ",
              message: "This kind of toast is intended to be static, reminding, alerts like \"This item has not been published and is only visible to you\"! This one can be clicked away! ",
              channel: "tt",
              timerEnabled: false,
              closeOnClick: true,
              showCloseButton: false,
              showIcon: false
          },
          {
              type: "info",
              title: "Hello! ",
              message: "This is custom html and a scope supplied to a toast that will track presses! <br/><br/><button type='button' class='btn btn-primary' ng-click='press()'>press</button>",
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
              message: "This is a toast in a different channel! ",
              channel: "bl"
          },
          {
              type: "danger",
              title: "Hello again! ",
              message: "This is a toast in a different channel! ",
              timerEnabled: true,
              channel: "tl"
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
              timerEnabled: true
          },
          {
              type: "warning",
              title: "Hello again! ",
              message: "This is what the timer looks like on a warning! ",
              timerEnabled: true
          },
          {
              type: "danger",
              title: "Hello again! ",
              message: "This is what the timer looks like when there's danger! ",
              timerEnabled: true
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