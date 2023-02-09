angular
	.module('app.utils')
  .directive('uppercaseOnly', uppercaseOnly)

  uppercaseOnly.$inject = [];
  function uppercaseOnly() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        let capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          let capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            // see where the cursor is before the update so that we can set it back
            let selection = element[0].selectionStart;
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
            // set back the cursor after rendering
            element[0].selectionStart = selection;
            element[0].selectionEnd = selection;
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  }