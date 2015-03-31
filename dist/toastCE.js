/*! toastCE - v0.1.0*/
(function () {// Source: src/core/modules/toastCE.js
angular.module("toastCE", ["ngSanitize", "ngAnimate"]);
// Source: src/core/animations/toast-item.js
angular.module("toastCE").animation(".toast-item", function(){
	var enter = function(elem, done){
		elem.hide().slideToggle("slow", done);
	}, leave = function(elem, done){
		elem.slideToggle("slow", done);
	};

	return {
		enter: enter, 
		leave: leave
	};
});
// Source: src/core/directives/toast.js
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
// Source: src/core/directives/toastMessage.js
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
// Source: src/core/services/toastFactory.js
angular.module("toastCE").factory("toastFactory", [
      "$sce",
      "toastConfig",
      "$timeout",
      function ($sce, config, $timeout) {
          var idSeed = 0,
            toasts = [], //[{id: 0, type: 0, title: "Title titlitetitus", message: "Meg, Magan, meggafaona megalitus, gegitantikus grambosola! <br/><br/><button class='btn btn-primary' type='button' ng-click='reconnect()'>Press</button>", position: 0, scope: {reconnect: function(){console.log("reconnect");}}}], 
            close = function (id) {
                var _toast = toasts.indexOf($.grep(toasts, function (t) {
                    return t.id === id;
                })[0]);
                if(_toast.timerPromise){
                    $timeout.cancel(_toast.timerPromise);
                }
                toasts.splice(_toast, 1);
            },
            pop = function (args) {
                var id = idSeed++,
                    typeName = (function(typeName) {
                        var typeId = config.types.indexOf(typeName);
                        return typeId !== -1 ? typeName : config.types[0];
                    })(args.type), 
                    typeId = config.types.indexOf(typeName),
                    channel = args.channel ? args.channel : "default", 
                    closeOnClick = angular.isDefined(args.closeOnClick) ? args.closeOnClick : config.defaultCloseOnClick,
                    showIcon = angular.isDefined(args.showIcon) ? args.showIcon : config.defaultShowIcon,
                    showCloseButton = angular.isDefined(args.showCloseButton) ? args.showCloseButton : config.defaultShowCloseButton,
                    showTimer = angular.isDefined(args.showTimer) ? args.showTimer : config.defaultShowTimer,
                    timer = args.timer ? args.timer : config.defaultTimer,
                    timerEnabled = angular.isDefined(args.timerEnabled) ? args.timerEnabled : config.defaultTimerEnabled,
                    pauseTimer = function (_toast) {
                        if (_toast.timerEnabled) {
                            _toast.timerMilliseconds = _toast.timerMilliseconds - ((new Date()).valueOf() - _toast.timerStarted);
                            $timeout.cancel(_toast.timerPromise);
                            _toast.timerStyle["-webkit-animation-play-state"] = "paused";
                            _toast.timerStyle["-moz-animation-play-state"] = "paused";
                            _toast.timerStyle["-ms-animation-play-state"] = "paused";
                            _toast.timerStyle["-o-animation-play-state"] = "paused";
                            _toast.timerStyle["animation-play-state"] = "paused";
                        }
                    },
                    startTimer = function (_toast) {
                        if (_toast.timerEnabled) {
                            _toast.timerPromise = $timeout(function () {
                                close(_toast.id);
                            }, _toast.timerMilliseconds);
                            _toast.timerStarted = (new Date()).valueOf();
                            _toast.timerStyle["-webkit-animation-play-state"] = "running";
                            _toast.timerStyle["-moz-animation-play-state"] = "running";
                            _toast.timerStyle["-ms-animation-play-state"] = "running";
                            _toast.timerStyle["-o-animation-play-state"] = "running";
                            _toast.timerStyle["animation-play-state"] = "running";
                            //pauseTimer(_toast);
                        }
                    },
                    toast = {
                        id: id,
                        typeName: typeName,
                        type: typeId,
                        channel: channel, 
                        title: args.title,
                        message: args.message,
                        scope: args.scope,
                        closeOnClick: closeOnClick,
                        clickable: closeOnClick ? { "cursor": "hand" } : "",
                        showCloseButton: showCloseButton,
                        class: (function () {
                            var cls = {};
                            cls[config.layoutClassPre + typeName] = true;

                            if (closeOnClick) {
                                cls["ce-clickable"] = true;
                            }

                            if (showIcon) {
                                cls["visible-icon"] = true;
                            }

                            return cls;
                        })(),
                        timerEnabled: timerEnabled,
                        showTimer: showTimer, 
                        timer: timer,
                        timerMilliseconds: timer * 1000,
                        timerStarted: (new Date()).valueOf(),
                        timerStyle: {
                            "-webkit-animation-duration": timer + "s",
                            "-moz-animation-duration": timer + "s",
                            "-ms-animation-duration": timer + "s",
                            "-o-animation-duration": timer + "s",
                            "animation-duration": timer + "s"
                        }
                    };

                toasts.push(toast);

                if (toast.timerEnabled) {
                    toast.pauseTimer = function () {
                        pauseTimer(this);
                    };
                    toast.startTimer = function () {
                        startTimer(this);
                    };
                    startTimer(toast);
                }

                return id;
            };

          return {
              pop: pop,
              toasts: toasts,
              close: close
          };
      }]);
})();