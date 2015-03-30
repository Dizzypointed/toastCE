/*! toastCE - v0.1.0*/
(function () {// Source: src/modules/toastCE.js
angular.module("toastCE", ["ngSanitize", "ngAnimate"])
    .config(["$provide",
    function ($provide) {
        $provide.value("toastConfig", {
            types: ["success", "danger", "warning", "info"],
            icons: ["glyphicon-ok-sign", "glyphicon-remove-sign", "glyphicon-exclamation-sign", "glyphicon-info-sign"],
            layoutClassPre: "alert-",
            progressBarClassPre: "progress-bar-",
            positionClasses: [{ top: true, right: true }, { top: true, left: true }, { bottom: true, left: true }, { bottom: true, right: true }, { top: true, full: true }, { bottom: true, full: true }],
            positions: ["top-right", "top-left", "bottom-left", "bottom-right", "top-full", "bottom-full"],
            defaultPosition: 0,
            defaultTimer: 20,
            defaultTimerEnabled: true,
            defaultCloseOnClick: false,
            defaultShowCloseButton: true,
            defaultShowTimer: true,
            defaultShowIcon: true
        });
    }]);
// Source: src/animations/toast-item.js
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
// Source: src/directives/toast.js
angular.module("toastCE").directive("toast", [
        "toastFactory",
        "toastConfig",
        "$templateCache",
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
                template:  "<div class='toast-container' data-ng-class='positionClasses'><ul><li class='toast-item' data-ng-repeat='toast in toasts | filter: {channel: channel}'><div class='alert col-sm-12' data-ng-class='toast.class' data-ng-mouseenter='pauseTimer(toast)' data-ng-mouseleave='playTimer(toast)' data-ng-click='toast.closeOnClick ? close(toast.id) : null' data-ng-style='toast.clickable'><div class='toast-content'><span data-ng-if='toast.showCloseButton'><button type='button' class='close' aria-label='Close' data-ng-click='close(toast.id)'><span aria-hidden='true'>&times;</span></button></span><strong ng-if='toast.title'>{{toast.title}}</strong><toast-message message='toast.message' scope='toast.scope'></toast-message></div><div class='bar-timer progress' data-ng-if='toast.timerEnabled && toast.showTimer'><div class='bar-inner progress-bar' data-ng-class='config.progressBarClassPre + toast.typeName' data-ng-style='toast.timerStyle'></div></div></div></li></ul></div>"
            };
        }]);
// Source: src/directives/toastMessage.js
angular.module("toastCE").directive("toastMessage", [
        "$compile",
        function ($compile) {
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
                template: '<div class="toast-message"></div>',
                scope: scope,
                link: link
            };
        }]);
// Source: src/services/toastFactory.js
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