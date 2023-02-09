angular
  .module('app.router')
  .run(routerRun);

routerRun.$inject = ['$rootScope' ,'$state' ,'$stateParams'];
function routerRun($rootScope ,$state ,$stateParams) {  
	$rootScope.$state = $state;  
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on('$stateChangeSuccess', 
    function (event, toState, toParams, fromState, fromParams) {
      scrollTopMainView();
    }
  );

  // on state not found log to console
  $rootScope.$on('$stateNotFound',
    function (event, unfoundState /*, fromState, fromParams*/ ) {
      console.error('State not found: ' + unfoundState.to + unfoundState.toParams + unfoundState.options);
    });

  // on error log to console
  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
      console.error(error);
    });

  function scrollTopMainView() {
    var main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  };

  $state.defaultErrorHandler(function(error) {
    console.error(error);
  });  
}