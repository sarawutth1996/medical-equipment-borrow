angular
  .module("app.asset")
  .controller("group_assetController", group_assetController)
  .controller(
    "group_assetController_modal_typ",
    group_assetController_modal_typ
  )
  .controller(
    "group_assetController_modal_edit",
    group_assetController_modal_edit
  );

group_assetController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function group_assetController(
  $http,
  $uibModal,
  $rootScope,
  NgTableParams,
  alertService
) {
  let vm = this;
  const url = "api-url";
  let oData = {
    id: "",
    name: "",
    typ_id: "",
  };

  let Mname = "";

  vm.clear = clear;
  vm.save = save;
  vm.modal_typ = modal_typ;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.edit = edit;
  vm.del = del;

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
        vm.modal = response.data.typ;
        vm.table = new NgTableParams(
          {},
          {
            dataset: response.data.data,
          }
        );
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
    vm.Mname = angular.copy(Mname);
  }

  function reload(data) {
    vm.table.settings().dataset = data;
    vm.table.reload();
  }

  function save() {
    if (vm.data.id !== "" && vm.data.name !== "") {
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
              if (response.data.status === "Okkk") {
                alertService.success("บันทึกข้อมูลเรียบร้อย");
                reload(response.data.data);
                clear();
              } else {
                const msg =
                  response.data.status === "rep"
                    ? "ข้อมูลถูกใช้อยู่ในระบบ"
                    : "ไม่สามารถบันทึกข้อมูลได้";
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
      });
    } else {
      alertService.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  }

  function modal_typ() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "group_asset-typ.modal",
      controller: "group_assetController_modal_typ",
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
        vm.data.typ_id = result.id;
        vm.Mname = result.name;
      },
      function () {}
    );
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function edit(data) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "group_asset-EDIT.modal",
      controller: "group_assetController_modal_edit",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return data;
        },
      },
    });

    modal.result.then(
      function (result) {
        $rootScope.loading = true;
        delete result.typ_name;
        let req = {
          auth: $rootScope.globals.auth,
          mod: "edit",
          it: result,
        };

        $http.post("server/models/group_asset.php", req).then(
          function (response) {
            if (response.data.status) {
              alertService.success("แก้ไขข้อมูลเรียบร้อย");
              reload(response.data.data);
            } else {
              alertService.success("ไม่สามารถแก้ไขข้อมูลได้");
            }

            $rootScope.loading = false;
          },
          function (response) {
            console.error(response);
            $rootScope.loading = false;
          }
        );
      },
      function () {}
    );
  }

  function del(data) {
    alertService.confrim("ลบหมู่อุปกรณ์: " + data.name, function (value) {
      if (value) {
        let req = {
          auth: $rootScope.globals.auth,
          mod: "del",
          it: {
            typ: data.typ_id,
            cls: data.id,
          },
        };

        $rootScope.loading = true;
        $http.post(url, req).then(
          function (response) {
            if (response.data.status === "Okkk") {
              reload(response.data.data);
              let msg = "ลบข้อมูลเรียบร้อย";
              alertService.success(msg);
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
    });
  }
}

group_assetController_modal_typ.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function group_assetController_modal_typ(
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

group_assetController_modal_edit.$inject = [
  "$uibModalInstance",
  "items",
  "alertService",
];
function group_assetController_modal_edit(
  $uibModalInstance,
  items,
  alertService
) {
  let vm = this;
  vm.data = angular.copy(items);

  vm.click = function () {
    alertService.confrim("แก้ไขข้อมูล ?", function (value) {
      if (value) {
        $uibModalInstance.close(vm.data);
      }
    });
  };
}
