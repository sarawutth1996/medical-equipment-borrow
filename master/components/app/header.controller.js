angular
	.module('app')
	.controller('HeaderController', HeaderController)

HeaderController.$inject = ['coreService'];
function HeaderController(coreService) {
	let vm = this;

	vm.logout = logout;
	vm.changeCH = changeCH; 

	//////////////////////////////////

	function logout(){
		coreService.clear();
	};

	function changeCH(key){
		vm.channel = key;
	}

}
