angular
	.module('app.core')
	.run(coreRun);

coreRun.$inject = ['$rootScope' ,'$location' ,'$sessionStorage' ,'$http' ,'coreService' ,'$urlRouter'];
function coreRun($rootScope ,$location ,$sessionStorage ,$http ,coreService ,$urlRouter) {
  if($sessionStorage.Borrow) {
    const req = {
      mod: 'check_active',
      it: $sessionStorage.Borrow
    }

    $http.post('server/models/login.php', req).then(function(response){
      if(response.data.status){
        coreService.set(response.data.keep)
        
      } else {					
        coreService.clear();
        $urlRouter.listen();
      }

    }, function(response) {
      console.error(response)
    });  
    

  } else {
    $rootScope.globals = {};
    $urlRouter.listen();
  }
     
  $rootScope.$on('$locationChangeStart', function (event, next, current) {    
    if($rootScope.globals) {
      let restrictedPage = ($location.path() !== '/login');
      let loggedIn = $rootScope.globals.auth; 

      if (restrictedPage && !loggedIn){  
        $location.path('/login');
      }
    } 
  });

}