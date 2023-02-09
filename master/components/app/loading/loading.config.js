angular
	.module('app.loading')
  .config(loadingbarConfig);
  
loadingbarConfig.$inject = ['cfpLoadingBarProvider'];
function loadingbarConfig(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = false;
	cfpLoadingBarProvider.latencyThreshold = 500;
}