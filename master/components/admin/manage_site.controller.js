angular
  .module("app.admin")
  .controller("manage_siteController", manage_siteController)
  .controller(
    "manage_siteController_modal_site",
    manage_siteController_modal_site
  )
  .controller(
    "manage_siteController_modal_edit",
    manage_siteController_modal_edit
  );

manage_siteController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function manage_siteController(
  $http,
  $uibModal,
  $rootScope,
  NgTableParams,
  alertService
) {
  let vm = this;
  const url = "api-url";
  let modal = {};
  let oData = {
    id: "",
    name: "",
    tel: null,
  };

  let prov = {
    show: true,
    id: "",
    name: "",
  };

  let amp = {
    show: true,
    id: "",
    name: "",
  };

  vm.typ = "sit";
  vm.show = false;
  vm.txt = {
    prov: ["รหัสจังหวัด", "ชื่อจังหวัด"],
    amp: ["รหัสอำเภอ", "ชื่ออำเภอ"],
    sit: ["รหัสศูนย์", "ชื่อศูนย์"],
  };

  vm.clear = clear;
  vm.save = save;
  vm.radChange = radChange;
  vm.modal_prov = modal_prov;
  vm.modal_amp = modal_amp;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.edit = edit;
  vm.del = del;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    let req = {
      auth: $rootScope.globals.auth,
      mod: "main",
    };

    $http.post(url, req).then(
      function (response) {
        modal = response.data.modal;
        clear();

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
    vm.modal = angular.copy(modal);
    vm.data = angular.copy(oData);
    vm.typ = "sit";
    vm.prov = angular.copy(prov);
    vm.amp = angular.copy(amp);
  }

  function reload(data) {
    vm.modal = data.modal;
    vm.table.settings().dataset = data.data;
    vm.table.reload();
  }

  function save() {
    let reqid;
    switch (vm.typ) {
      case "prov":
        reqid = "0" + vm.data.id;
        savesave();
        break;

      case "amp":
        if (vm.prov.id !== "") {
          reqid = vm.prov.id + vm.data.id;
          savesave();
        } else {
          alertService.warning("กรุณาเลือกจังหวัด");
        }
        break;

      case "sit":
        if (vm.prov.id !== "") {
          if (vm.amp.id !== "") {
            reqid = vm.amp.id + vm.data.id;
            savesave();
          } else {
            alertService.warning("กรุณาเลือกอำเภอ");
          }
        } else {
          alertService.warning("กรุณาเลือกจังหวัด");
        }
    }

    function savesave() {
      if (vm.data.id !== "" && vm.data.name !== "") {
        alertService.confrim("บันทึกข้อมูล ?", function (value) {
          if (value) {
            $rootScope.loading = true;
            let req = {
              auth: $rootScope.globals.auth,
              mod: "save",
              it: {
                id: reqid,
                name: vm.data.name,
                tel:
                  vm.data.tel === "" || vm.data.tel === undefined
                    ? null
                    : vm.data.tel,
              },
            };

            $http.post(url, req).then(
              function (response) {
                if (response.data.status === "Okkk") {
                  alertService.success("บันทึกข้อมูลเรียบร้อย");
                  modal = response.data.data.modal;
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
  }

  function radChange() {
    switch (vm.typ) {
      case "prov":
        vm.prov.show = false;
        vm.amp.show = false;
        break;

      case "amp":
        vm.prov.show = true;
        vm.amp.show = false;
        break;

      case "sit":
        vm.prov.show = true;
        vm.amp.show = true;
    }
  }

  function modal_prov() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "manage_site-site.modal",
      controller: "manage_siteController_modal_site",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.prov;
        },
      },
    });

    modal.result.then(
      function (result) {
        $rootScope.loading = true;
        vm.amp.id = "";
        vm.amp.name = "";
        vm.prov.id = result.id;
        vm.prov.name = result.name;

        const req = {
          auth: $rootScope.globals.auth,
          mod: "amp",
          it: result.id,
        };

        $http.post(url, req).then(
          function (response) {
            vm.modal.amp = response.data;
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

  function modal_amp() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "manage_site-site.modal",
      controller: "manage_siteController_modal_site",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.amp;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.amp.id = result.id;
        vm.amp.name = result.name;
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
      templateUrl: "manage_site-EDIT.modal",
      controller: "manage_siteController_modal_edit",
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

        $http.post("server/models/manage_site.php", req).then(
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
    alertService.confrim("ลบสถานที่รหัส: " + data, function (value) {
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

manage_siteController_modal_site.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function manage_siteController_modal_site(
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

manage_siteController_modal_edit.$inject = [
  "$uibModalInstance",
  "items",
  "alertService",
];
function manage_siteController_modal_edit(
  $uibModalInstance,
  items,
  alertService
) {
  let vm = this;
  vm.data = angular.copy(items);

  vm.click = function () {
    alertService.confrim("แก้ไขข้อมูล ?", function (value) {
      if (value) {
        vm.data.tel =
          vm.data.tel === "" || vm.data.tel === undefined ? null : vm.data.tel;
        $uibModalInstance.close(vm.data);
      }
    });
  };
}
