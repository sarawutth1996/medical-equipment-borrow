angular
	.module('app')
	.run(sidebarRun);

sidebarRun.$inject = ['$rootScope' ,'$window' ,'$document' ,'$timeout' ,'APP_MEDIAQUERY'];
function sidebarRun($rootScope ,$window ,$document ,$timeout ,APP_MEDIAQUERY) {		
	$rootScope.layout = function(){
		return $rootScope.sidebarVisible ? 'sidebar-visible' : '';
	}

	$rootScope.toggleSidebar = toggleSidebarState;
	$rootScope.closeSidebar = function () {
		toggleSidebarState(false);
	};
	
	$document.on('keyup', function (e) {
		if (e.keyCode == 27) {
			$timeout(function () {
				toggleSidebarState(false);
			});
		}
	});

	if (isMobileScreen()) $timeout(function () {
		toggleSidebarState(false);
	});

	function toggleSidebarState(state) {
		$rootScope.sidebarVisible = angular.isDefined(state) ? state : !$rootScope.sidebarVisible;
	}

	function isMobileScreen() {
		return $window.innerWidth < APP_MEDIAQUERY.desktop;
	}
}