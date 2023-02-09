angular
  .module("app.asset")
  .controller("typ_assetController", typ_assetController)
  .controller("typ_assetController_modal_edit", typ_assetController_modal_edit);

typ_assetController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function typ_assetController(
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
  };

  vm.clear = clear;
  vm.save = save;
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
  }

  function reload(data) {
    vm.table.settings().dataset = data.data;
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

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function edit(data) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "typ_asset-EDIT.modal",
      controller: "typ_assetController_modal_edit",
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
        let req = {
          auth: $rootScope.globals.auth,
          mod: "edit",
          it: result,
        };

        $http.post("server/models/typ_asset.php", req).then(
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
    alertService.confrim("ลบหมวดอุปกรณ์รหัส: " + data, function (value) {
      if (value) {
        let req = {
          auth: $rootScope.globals.auth,
          mod: "del",
          it: data,
        };

        $rootScope.loading = true;
        $http.post(url, req).then(
          function (response) {
            if (response.data.status === "Okkk") {
              reload(response.data.data);
              let msg = "ลบข้อมูลเรียบร้อย";
              alertService.success(msg);
            } else {
              switch (response.data.status) {
                case "repCls":
                  msg = "ข้อมูลถูกใช้อยู่ในหมู่อุปกรณ์";
                  break;
                case "repAst":
                  msg = "ข้อมูลถูกใช้อยู่ในอุปกรณ์";
                  break;
                case "Err":
                  msg = "ไม่สามารถบันทึกข้อมูลได้";
                  break;
              }
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

typ_assetController_modal_edit.$inject = [
  "$uibModalInstance",
  "items",
  "alertService",
];
function typ_assetController_modal_edit(
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
