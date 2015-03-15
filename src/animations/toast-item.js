angular.module("toastCE").animation(".toast-item", function(){
	var enter = function(elem, done){
		elem.hide().slideToggle("slow", done);
	}, leave = function(elem, done){
		elem.slideToggle("slow", done);
	};

	return {
		enter: enter, 
		leave: leave
	}
});