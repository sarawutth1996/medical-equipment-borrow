angular
  .module("app.asset")
  .controller("assetController", assetController)
  .controller(
    "assetController_modal_changeStat",
    assetController_modal_changeStat
  )
  .controller("assetController_modal_edit", assetController_modal_edit);

assetController.$inject = [
  "$http",
  "$rootScope",
  "NgTableParams",
  "alertService",
  "$uibModal",
  "$filter",
];
function assetController(
  $http,
  $rootScope,
  NgTableParams,
  alertService,
  $uibModal,
  $filter
) {
  let vm = this;
  const url = "api-url";
  let oData = [];
  let modalData = [];
  vm.filter = [
    { id: "ปกติ", title: "ปกติ" },
    { id: "ซ่อม", title: "ซ่อม" },
    { id: "จำหน่าย", title: "จำหน่าย" },
    { id: "ชำรุด", title: "ชำรุด" },
  ];

  vm.applyGlobalSearch = applyGlobalSearch;
  vm.showButton = showButton;
  vm.change_status = change_status;
  vm.edit = edit;
  vm.del = del;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    let req = {
      auth: $rootScope.globals.auth,
      mod: "allMight",
    };

    $http.post(url, req).then(
      function (response) {
        oData = response.data.data;
        modalData = response.data.um;
        vm.table = new NgTableParams(
          {},
          {
            dataset: dataset(oData),
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

  function dataset(data) {
    return data.map(function (data) {
      return {
        id: data.id,
        ast_desc: data.ast_desc,
        typ_desc: data.typ_desc,
        cls_desc: data.cls_desc,
        ast_status: data.ast_status,
      };
    });
  }

  function reload(data) {
    oData = data;
    vm.table.settings().dataset = dataset(oData);
    vm.table.reload();
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function showButton(data) {
    return data === "ปกติ" || data === "ซ่อม" ? false : true;
  }

  function change_status(key) {
    const data = oData.find(({ id }) => id === key);
    const dataset = {
      id: data.id,
      stat: data.stat === "R" ? "RW" : data.stat,
    };

    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset-changeStat.modal",
      controller: "assetController_modal_changeStat",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return dataset;
        },
      },
    });

    modal.result.then(
      function (result) {
        $rootScope.loading = true;
        let req = {
          auth: $rootScope.globals.auth,
          mod: "change_status",
          it: result,
        };
        const ddd = result.dat === null ? new Date() : result.dat;
        req.it.dat = $filter("date")(ddd, "yyyy/MM/dd");
        req.it.um = data.ast_um;
        if (req.it.stat === "D") {
          req.it.rep = null;
          req.it.price = null;
        }

        $http.post("server/models/asset.php", req).then(
          function (response) {
            if (response.data.status === "Okkk") {
              alertService.success("เปลี่ยนสถานะเรียบร้อย");
              reload(response.data.data);
            } else {
              alertService.success("ไม่สามารถเปลี่ยนแปลงสถานะได้");
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

  function edit(key) {
    const data = oData.find(({ id }) => id === key);
    const dataset = {
      modal: modalData,
      mData: {
        typ_desc: data.typ_desc,
        cls_desc: data.cls_desc,
      },
      data: {
        id: data.id,
        ast_desc: data.ast_desc,
        ast_um: data.ast_um,
        ast_inv_nbr: data.ast_inv_nbr,
        ast_pur_date:
          data.ast_pur_date !== null ? new Date(data.ast_pur_date) : null,
        ast_po_nbr: data.ast_po_nbr,
        ast_vend: data.ast_vend,
        ast_rt_price: data.ast_rt_price,
        ast_budget_year: data.ast_budget_year,
        ast_budget_from: data.ast_budget_from,
        ast_rmks: data.ast_rmks,
      },
    };

    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset-EDIT.modal",
      controller: "assetController_modal_edit",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return dataset;
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
        req.it.ast_pur_date = $filter("date")(
          req.it.ast_pur_date,
          "yyyy/MM/dd"
        );
        req.it.ast_rmks =
          req.it.ast_budget_from !== "อื่นๆ" ? null : req.it.ast_rmks;

        $http.post("server/models/asset.php", req).then(
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
    alertService.confrim("ลบอุปกรณ์รหัส: " + data, function (value) {
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
    });
  }
}

assetController_modal_changeStat.$inject = [
  "$uibModalInstance",
  "alertService",
  "items",
];
function assetController_modal_changeStat(
  $uibModalInstance,
  alertService,
  items
) {
  let vm = this;
  vm.sData = [
    { id: "N", name: "เลือก" },
    { id: "R", name: "ซ่อม" },
    { id: "W", name: "จำหน่าย" },
    { id: "D", name: "ชำรุด" },
  ];

  vm.data = {
    id: items.id,
    stat: items.stat,
    dat: null,
    price: 0,
    rep: null,
    rmk: null,
  };

  vm.change = function () {
    vm.txt = vm.data.stat === "R" ? "ผู้ซ่อม" : "ผู้ซื้อ";
  };

  vm.show = function (key) {
    let ret;
    switch (key) {
      case "stat":
        ret = vm.data.stat === "RW";
        break;
      case "detail":
        ret = vm.data.stat === "R" || vm.data.stat === "W";
        break;
      default:
        ret = false;
    }
    return ret;
  };

  vm.click = function () {
    if (vm.data.stat !== "N") {
      alertService.confrim("เปลี่ยนแปลงสถานะ ?", function (value) {
        if (value) {
          $uibModalInstance.close(vm.data);
        }
      });
    } else {
      alertService.error("กรุณาเลือกสถานะ");
    }
  };
}

assetController_modal_edit.$inject = [
  "$uibModalInstance",
  "alertService",
  "items",
];
function assetController_modal_edit($uibModalInstance, alertService, items) {
  let vm = this;
  vm.modal = angular.copy(items.modal);
  vm.mData = angular.copy(items.mData);
  vm.data = angular.copy(items.data);

  vm.click = function () {
    alertService.confrim("แก้ไขข้อมูล", function (value) {
      if (value) {
        $uibModalInstance.close(vm.data);
      }
    });
  };
}
