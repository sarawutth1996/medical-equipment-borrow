angular
	.module('app')
	.controller('homeController', homeController)

homeController.$inject = ['$rootScope'];
function homeController($rootScope) {
  let vm = this;
  
  console.info($rootScope)
  // $rootScope.loading = true;
	vm.click = function(){
    $rootScope.loading = ($rootScope.loading === true) ? false : true;
  } 

}
