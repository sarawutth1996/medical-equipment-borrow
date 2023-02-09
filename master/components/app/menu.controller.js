angular
	.module('app')	
	.controller('MenuController', MenuController)
	.directive('sidebarNav', sidebarNav);

MenuController.$inject = [];
function MenuController() {
	let vm = this;

	vm.menuItem = [
		{
			name: 'ระบบบริหารการยืม',
			items: [
				{
					name: 'ระบบยืม',
					sref: 'app.lend.service_lend_addList',
					icon: 'ion-md-grid',
					pms: ['DISTRICT' ,'SUB-DISTRICT']
				},
					{
					name: 'ค้นหาอุปกรณ์พร้อมใช้',
					sref: 'app.lend.service_find_ast',
					icon: 'ion-md-grid'
				},
				{
					name: 'รายงานสรุปสถานะใบยืม',
					sref: 'app.lend.report_status_lend',
					icon: 'ion-md-paper'
				},
				{
					name: 'รายงานจำนวนยืม',
					sref: 'app.lend.report_count_items',
					icon: 'ion-md-paper'
				}
			]	
		},
    
		{
			name: 'ทะเบียนผู้มีสิทธิ์ยืม',
			items: [
				{
					name: 'ทะเบียนผู้มีสิทธิ์ยืม',
					sref: 'app.record.signup_lends_addList',
					icon: 'ion-md-add-circle-outline',
					pms: ['DISTRICT' ,'SUB-DISTRICT']
				},
				{
					name: 'รายงานทะเบียนผู้มีสิทธิ์ยืม',
					sref: 'app.record.report_signup_lends',
					icon: 'ion-md-paper'
				}
			]	
		},

		{
			name: 'ทะเบียนอุปกรณ์',
			items: [
				{
					name: 'กำหนดหมวดอุปกรณ์',
					sref: 'app.asset.typ_asset',
					icon: 'ion-ios-build'
				},
				{
					name: 'กำหนดหมู่อุปกรณ์',
					sref: 'app.asset.group_asset',
					icon: 'ion-ios-hammer'
				},
				{
					name: 'กำหนดหน่วยนับอุปกรณ์',
					sref: 'app.asset.um_asset',
					icon: 'ion-ios-build'
				},
				{
					name: 'กำหนดอุปกรณ์',
					sref: 'app.asset.asset',
					icon: 'ion-ios-construct',					
					pms: ['DISTRICT' ,'SUB-DISTRICT']
				},
				{
					name: 'คืนสถานะอุปกรณ์',
					sref: 'app.asset.asset_restat',
					icon: 'ion-ios-undo',					
					pms: ['DISTRICT' ,'SUB-DISTRICT']
				},
				{
					name: 'รายงานทะเบียนอุปกรณ์',
					sref: 'app.asset.asset_report',
					icon: 'ion-md-paper'
				},
				{
					name: 'รายงานลาเบลอุปกรณ์',
					sref: 'app.asset.asset_report_label',
					icon: 'ion-md-paper'
				},
				{
					name: 'รายงานงบประมาณตามปี',
					sref: 'app.asset.asset_report_year',
					icon: 'ion-md-paper'
				},
				{
					name: 'รายงานงบประมาณจังหวัดตามปี',
					sref: 'app.asset.asset_report_year_prov',
					icon: 'ion-md-paper',
					pms: ['ROOT' ,'CENTER' ,'PROVINCE']
				},
				{
					name: 'รายงานมูลค่าซ่อมอุปกรณ์',
					sref: 'app.asset.asset_report_repair',
					icon: 'ion-md-paper'
				},
			]	
		},

		{
			name: 'กำหนดสิทธิ์ผู้ใช้งาน',
			pms: ['ROOT'],
			items: [
				{
					name: 'กำหนดสถานที่',
					sref: 'app.admin.manage_site',
					icon: 'ion-md-add-circle'
				},
				{
					name: 'กำหนดวันหมดอายุ',
					sref: 'app.admin.manage_exp_date',
					icon: 'ion-md-add-circle-outline'
				},
				{
					name: 'กำหนดผู้ใช้งาน',
					sref: 'app.admin.manage_user',
					icon: 'ion-md-add-circle'
				},
				{
					name: 'รายงานผู้ใช้ระบบ',
					sref: 'app.admin.admin_report_user',
					icon: 'ion-md-paper'
				}
			]	
		}
	];
}

sidebarNav.$inject = [];
function sidebarNav() {
 	return {
 		restrict: 'EAC',
 		link: link
 	};

 	function link(scope, element) {
 		element.on('click', function (event) {
 			let item = getItemElement(event);
 			// check click is on a tag
 			if (!item) return;

 			let ele = angular.element(item),
 				liparent = ele.parent()[0];

 			let lis = ele.parent().parent().children(); // markup: ul > li > a
 			// remove .active from childs
 			lis.find('li').removeClass('active');
 			// remove .active from siblings ()
 			angular.forEach(lis, function (li) {
 				if (li !== liparent)
 					angular.element(li).removeClass('active');
 			});

 			let next = ele.next();
 			if (next.length && next[0].tagName === 'UL') {
 				ele.parent().toggleClass('active');
 				event.preventDefault();
 			}
 		});
 	}

 	// find the a element in click context
 	// doesn't check deeply, asumens two levels only
 	function getItemElement(event) {
 		let element = event.target;
 		let	parent = element.parentNode;
 		if (element.tagName.toLowerCase() === 'a') return element;
 		if (parent.tagName.toLowerCase() === 'a') return parent;
 		if (parent.parentNode.tagName.toLowerCase() === 'a') return parent.parentNode;
 	}
}

