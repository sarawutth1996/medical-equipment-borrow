angular
  .module("app.admin")
  .controller("manage_userController", manage_userController)
  .controller("manage_userController_modal_si", manage_userController_modal_si);

manage_userController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function manage_userController(
  $http,
  $uibModal,
  $rootScope,
  NgTableParams,
  alertService
) {
  let vm = this;
  const url = "api-url";
  let oData = {
    user: "",
    pass: "",
    fname: "",
    lname: "",
    site: "",
  };

  let site_name = "";

  vm.filter = {
    stat: [
      { id: "ACTIVE", title: "ACTIVE" },
      { id: "INACTIVE", title: "INACTIVE" },
    ],
  };

  vm.clear = clear;
  vm.save = save;
  vm.modal_si = modal_si;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.click = click;
  vm.del = del;
  vm.actClass = actClass;

  ////////////////////////

  fristLook();
  function fristLook() {
    clear();
    $rootScope.loading = true;
    let req = {
      auth: $rootScope.globals.auth,
      mod: "main",
    };

    $http.post(url, req).then(
      function (response) {
        vm.modal = response.data.si;
        vm.table = new NgTableParams({}, { dataset: response.data.table });
        $rootScope.loading = false;
      },
      function (response) {
        console.error(response);
        $rootScope.loading = false;
      }
    );
  }

  function clear() {
    vm.data = angular.copy(oData);
    vm.site_name = angular.copy(site_name);
  }

  function reload(data) {
    vm.table.settings().dataset = data;
    vm.table.reload();
  }

  function save() {
    if (vm.data.user !== "" && vm.data.pass !== "" && vm.data.site !== "") {
      alertService.confrim("บันทึกข้อมูล ?", function (value) {
        if (value) {
          $rootScope.loading = true;
          let req = {
            auth: $rootScope.globals.auth,
            mod: "save",
            it: vm.data,
          };

          $http.post(url, req).then(
            function (response) {
              if (response.data.status === "Ok") {
                alertService.success("บันทึกข้อมูลเรียบร้อย");
                reload(response.data.data);
                clear();
              } else {
                alertService.error("Username และสถานที่ ซ้ำกับในระบบ");
              }
              $rootScope.loading = false;
            },
            function (response) {
              console.error(response);
              $rootScope.loading = false;
            }
          );
        }
      });
    } else {
      alertService.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  }

  function modal_si() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "manage_user-cm.modal",
      controller: "manage_userController_modal_si",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.data.site = result.id;
        vm.site_name = result.name;
      },
      function () {}
    );
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function click(data) {
    alertService.confrim("ต้องการจะเปลี่ยนสถานะ ?", function (value) {
      if (value) {
        let req = {
          auth: $rootScope.globals.auth,
          mod: "switch",
          it: {
            user: data.user_name,
            site: data.user_site,
            act: data.status === "ACTIVE" ? 0 : 1,
          },
        };

        $rootScope.loading = true;
        $http.post(url, req).then(
          function (response) {
            if (response.data.status) {
              data.status = data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
              alertService.success("บันทึกข้อมูลเรียบร้อย");
            } else {
              alertService.error("บันทึกข้อมูลล้มเหลว");
            }
            $rootScope.loading = false;
          },
          function (response) {
            console.error(response);
            $rootScope.loading = false;
          }
        );
      }
    });
  }

  function del(data) {
    alertService.confrim(
      "ต้องการจะลบัญชีผู้ใช้: " + data.name,
      function (value) {
        if (value) {
          let req = {
            auth: $rootScope.globals.auth,
            mod: "del",
            it: {
              user: data.user_name,
              st: data.user_site,
            },
          };

          $rootScope.loading = true;
          $http.post(url, req).then(
            function (response) {
              if (response.data.status === "Okkk") {
                reload(response.data.data);
                alertService.success("ลบข้อมูลเรียบร้อย");
              } else {
                const msg =
                  response.data.status === "rep"
                    ? "ข้อมูลถูกใช้อยู่ในระบบ"
                    : "ไม่สามารถลบข้อมูลได้";
                alertService.error(msg);
              }

              $rootScope.loading = false;
            },
            function (response) {
              console.error(response);
              $rootScope.loading = false;
            }
          );
        }
      }
    );
  }

  function actClass(data) {
    return data === "ACTIVE" ? "btn-success" : "btn-warning";
  }
}

manage_userController_modal_si.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function manage_userController_modal_si(
  $uibModalInstance,
  NgTableParams,
  items
) {
  let vm = this;
  vm.table = new NgTableParams(
    {},
    {
      dataset: items,
    }
  );

  vm.applyGlobalSearch = function () {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  };

  vm.click = function (info) {
    $uibModalInstance.close(info);
  };
}
