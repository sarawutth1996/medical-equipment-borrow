angular
	.module('app.utils')
  .directive('showPassword', showPassword)

function showPassword() {
  return function(scope, elem, attrs) {
    scope.$watch(attrs.showPassword, function(newValue) {
      const typ = (newValue) ? 'text' : 'password';
      elem.attr("type", typ);
    });
  };
}