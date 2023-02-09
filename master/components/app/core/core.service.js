angular
  .module('app.core')
  .factory('coreService', coreService);

coreService.$inject = ['$rootScope', 'PermPermissionStore' ,'$sessionStorage' ,'$location' ,'$urlRouter'];
function coreService($rootScope, PermPermissionStore ,$sessionStorage ,$location ,$urlRouter) {
  let service = {};
  service.set = set;
  service.clear = clear;
  return service;

  ///////////////////////////////////

  function set(data) {    
    $rootScope.globals = data;

    const pms = data.profile.role;
    PermPermissionStore.definePermission(pms,  function() {
      return true;             
    });
    
    if(data.auth){
      $sessionStorage.Borrow = data.auth;
    
    } else {
      $rootScope.globals.auth = $sessionStorage.Borrow;
      $urlRouter.sync();                           
      $urlRouter.listen();
    }
  }

  function clear(){
    $rootScope.globals = {};
		delete $sessionStorage.Borrow;		
    PermPermissionStore.clearStore();		
    $location.path('/login');
  }


}