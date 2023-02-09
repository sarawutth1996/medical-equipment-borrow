angular
  .module('app.router')
  .config(routerConfig)

routerConfig.$inject = ['$stateProvider' ,'$urlRouterProvider' ,'$locationProvider' ,'$permissionProvider'];
function routerConfig($stateProvider ,$urlRouterProvider ,$locationProvider ,$permissionProvider) {
  $locationProvider.hashPrefix('');    
  $urlRouterProvider.otherwise('/v0.1/home');
  $urlRouterProvider.deferIntercept();
  $permissionProvider.suppressUndefinedPermissionWarning(true);

  const basePath = 'app/';
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: basePath + 'login.html',
      controller: 'loginController as vm'
    })
    .state('error', {
      url: '/error',
      templateUrl: basePath + 'error.html'
    })
    .state('app', {
      url: '/v0.3',
      abstract: true,
      templateUrl: basePath + 'core.layout.html'
    })
    .state('app.setting', {
      url: '/setting',
      templateUrl: basePath + 'setting.html',      
      controller: 'settingController as vm'
    })
    .state('app.home', {
      url: '/home',
      templateUrl: basePath + 'home.html',
      controller: 'homeController as vm'
    })	
    .state('app.version', {
      url: '/version',
      templateUrl: basePath + 'version.html'
    })
    
    
    // LenD
    .state('app.lend', {      
      abstract: true,
      url: '/lend'      
    })
    .state('app.lend.service_lend', {
      url: '/service_lend',
      templateUrl: basePath + 'lend/service_lend.html',
      controller: 'service_lendController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.lend.service_lend_addList', {
      url: '/service_lend_addList',
      templateUrl: basePath + 'lend/service_lend_addList.html',
      controller: 'service_lend_addListController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
	  .state('app.lend.service_find_ast', {
      url: '/service_find_ast',
      templateUrl: basePath + 'lend/service_find_ast.html',
      controller: 'service_find_astController as vm'
    })
	  .state('app.lend.service_returnedItems', {
      url: '/service_returnedItems/:nbr',
      templateUrl: basePath + 'lend/service_returnedItems.html',
      controller: 'service_returnedItemsController as vm'
    })
    .state('app.lend.service_lend_renew_exp', {
      url: '/service_lend_renew_exp/:nbr/:state',
      templateUrl: basePath + 'lend/service_lend_renew_exp.html',
      controller: 'service_lend_renew_expController as vm'
    })
    .state('app.lend.report_status_lend', {
      url: '/report_status_lend',
      templateUrl: basePath + 'lend/report_status_lend.html',
      controller: 'report_statuscontroller as vm'
    })
	  .state('app.lend.report_count_items', {
      url: '/report_count_items',
      templateUrl: basePath + 'lend/report_count_items.html',
      controller: 'report_count_itemscontroller as vm'
    })
    
    // RECORD
    .state('app.record', {      
      abstract: true,
      url: '/record'
    })
    .state('app.record.signup_lends', {
      url: '/signup_lends/:id/:key',
      templateUrl: basePath + 'record/signup_lends.html',
      controller: 'signup_lendsController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.record.signup_lends_addList', {
      url: '/signup_lends_addList',
      templateUrl: basePath + 'record/signup_lends_addList.html',
      controller: 'signup_lends_addListController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.record.report_signup_lends', {
      url: '/report_signup_lends',
      templateUrl: basePath + 'record/report_signup_lends.html',
      controller: 'report_signup_lendsController as vm'
    })

    // ASSET
    .state('app.asset', {      
      abstract: true,
      url: '/asset'
    })
    .state('app.asset.typ_asset', {
      url: '/typ_asset',
      templateUrl: basePath + 'asset/typ_asset.html',
      controller: 'typ_assetController as vm'
    })
    .state('app.asset.group_asset', {
      url: '/group_asset',
      templateUrl: basePath + 'asset/group_asset.html',
      controller: 'group_assetController as vm'
    })
    .state('app.asset.um_asset', {
      url: '/um_asset',
      templateUrl: basePath + 'asset/um_asset.html',
      controller: 'um_assetController as vm'
    })
    .state('app.asset.asset', {
      url: '/asset',
      templateUrl: basePath + 'asset/asset.html',
      controller: 'assetController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.asset.asset_add', {
      url: '/asset_add',
      templateUrl: basePath + 'asset/asset_add.html',
      controller: 'asset_addController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.asset.asset_restat', {
      url: '/asset_restat',
      templateUrl: basePath + 'asset/asset_restat.html',
      controller: 'asset_restatController as vm',
      data: {
				permissions: {
					only: ['DISTRICT' ,'SUB-DISTRICT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.asset.asset_report', {
      url: '/asset_report',
      templateUrl: basePath + 'asset/asset_report.html',
      controller: 'asset_reportController as vm'
    })
    .state('app.asset.asset_report_label', {
      url: '/asset_report_label',
      templateUrl: basePath + 'asset/asset_report_label.html',
      controller: 'asset_report_labelController as vm'
    })
    .state('app.asset.asset_report_year', {
      url: '/asset_report_year',
      templateUrl: basePath + 'asset/asset_report_year.html',
      controller: 'asset_report_yearController as vm'
    })  
    .state('app.asset.asset_report_year_prov', {
      url: '/asset_report_year_prov',
      templateUrl: basePath + 'asset/asset_report_year_prov.html',
      controller: 'asset_report_year_provController as vm',
      data: {
				permissions: {
					only: ['ROOT' ,'CENTER' ,'PROVINCE'],
					redirectTo: 'home'
				}
			}
    })  
    .state('app.asset.asset_report_repair', {
      url: '/asset_report_repair',
      templateUrl: basePath + 'asset/asset_report_repair.html',
      controller: 'asset_report_repairController as vm'
    })    

    // ADMIN
    .state('app.admin', {      
      abstract: true,
      url: '/admin',
      data: {
				permissions: {
					only: ['ROOT'],
					redirectTo: 'home'
				}
			}
    })
    .state('app.admin.manage_site', {
      url: '/manage_site',
      templateUrl: basePath + 'admin/manage_site.html',
      controller: 'manage_siteController as vm'
    })
    .state('app.admin.manage_user', {
      url: '/manage_user',
      templateUrl: basePath + 'admin/manage_user.html',
      controller: 'manage_userController as vm'
    })
    .state('app.admin.manage_exp_date', {
      url: '/manage_exp_date',
      templateUrl: basePath + 'admin/manage_exp_date.html',
      controller: 'manage_exp_dateController as vm'
    })
    .state('app.admin.admin_report_user', {
      url: '/admin_report_user',
      templateUrl: basePath + 'admin/admin_report_user.html',
      controller: 'admin_report_userController as vm'
    })

}