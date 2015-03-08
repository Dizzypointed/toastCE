(function () {
    angular.module("toastCE").factory("toastFactory", [
      "$sce",
      "toastConfig",
      "$timeout",
      function ($sce, config, $timeout) {
          var idSeed = 0,
            toasts = [], //[{id: 0, type: 0, title: "Title titlitetitus", message: "Meg, Magan, meggafaona megalitus, gegitantikus grambosola! <br/><br/><button class='btn btn-primary' type='button' ng-click='reconnect()'>Press</button>", position: 0, scope: {reconnect: function(){console.log("reconnect");}}}], 
            close = function (id) {
                toasts.splice(toasts.indexOf($.grep(toasts, function (t, i) { return t.id === id; })[0]), 1);
            },
            pop = function (args) {
                var id = idSeed++,
                    typeName = (function(typeName) {
                        var typeId = config.types.indexOf(typeName);
                        return typeId !== -1 ? typeName : config.types[0];
                    })(args.type), 
                    typeId = config.types.indexOf(typeName),
                    closeOnClick = angular.isDefined(args.closeOnClick) ? args.closeOnClick : false,
                    showCloseButton = angular.isDefined(args.showCloseButton) ? args.showCloseButton : true,
                    showTimer = angular.isDefined(args.showTimer) ? args.showTimer : true,
                    timer = args.timer ? args.timer : config.defaultTimer,
                    timerEnabled = angular.isDefined(args.timerEnabled) ? args.timerEnabled : config.timerEnabled,
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
                        title: args.title,
                        message: args.message,
                        scope: args.scope,
                        closeOnClick: closeOnClick,
                        clickable: closeOnClick ? { "cursor": "hand" } : "",
                        showCloseButton: showCloseButton,
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
                        },
                        pauseTimer: function () {
                            pauseTimer(this);
                        },
                        startTimer: function () {
                            startTimer(this);
                        },
                        class: (function () {
                            var cls = {};
                            cls[config.layoutClasses[typeId]] = true;

                            if (closeOnClick) {
                                cls["clickable"] = true;
                            }

                            return cls;
                        })()
                    };

                toasts.push(toast);

                if (toast.timerEnabled) {
                    console.log(toast);
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