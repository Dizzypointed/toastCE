(function () {
    angular.module("toastCE").factory("toastFactory", [
      "$sce",
      "toastConfig",
      "$timeout",
      function ($sce, config, $timeout) {
          var idSeed = 0,
            toasts = [], //[{id: 0, type: 0, title: "Title titlitetitus", message: "Meg, Magan, meggafaona megalitus, gegitantikus grambosola! <br/><br/><button class='btn btn-primary' type='button' ng-click='reconnect()'>Press</button>", position: 0, scope: {reconnect: function(){console.log("reconnect");}}}], 
            getTypeId = function (typeName) {
                var typeId = config.types.indexOf(typeName);
                return typeName && typeId !== -1 ? typeId : 0;
            },
            getPosId = function (positionName) {
                var typeId = config.postitions.indexOf(positionName);
                return positionName && typeId !== -1 ? typeId : 0;
            },
            close = function (id) {
                toasts.splice(toasts.indexOf($.grep(toasts, function (t, i) { return t.id === id; })[0]), 1);
            },
            pop = function (args) {
                var id = idSeed++,
                    timer = args.timer ? args.timer : config.defaultTimer,
                    timerEnabled = angular.isUndefined(args.timerEnabled) ? config.timerEnabled : args.timerEnabled,
                    pauseTimer = function (_toast) {
                        _toast.timerMilliseconds = _toast.timerMilliseconds - ((new Date()).valueOf() - _toast.timerStarted);
                        $timeout.cancel(_toast.timerPromise);
                        _toast.timerStyle["-webkit-animation-play-state"] = "paused";
                        _toast.timerStyle["-moz-animation-play-state"] = "paused";
                        _toast.timerStyle["-ms-animation-play-state"] = "paused";
                        _toast.timerStyle["-o-animation-play-state"] = "paused";
                        _toast.timerStyle["animation-play-state"] = "paused";
                    },
                    startTimer = function (_toast) {
                        _toast.timerPromise = $timeout(function () {
                            close(_toast.id);
                        }, _toast.timerMilliseconds);
                        _toast.timerStarted = (new Date()).valueOf();
                        _toast.timerStyle["-webkit-animation-play-state"] = "running";
                        _toast.timerStyle["-moz-animation-play-state"] = "running";
                        _toast.timerStyle["-ms-animation-play-state"] = "running";
                        _toast.timerStyle["-o-animation-play-state"] = "running";
                        _toast.timerStyle["animation-play-state"] = "running";
                    },
                    toast = {
                        id: id,
                        type: getTypeId(args.type),
                        title: args.title,
                        message: args.message,
                        position: getPosId(args.position),
                        scope: args.scope,
                        timerEnabled: timerEnabled,
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
                        closeOnClick: false
                    };

                toasts.push(toast);

                if (toast.timerEnabled) {
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