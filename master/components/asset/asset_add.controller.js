angular
  .module("app.asset")
  .controller("asset_addController", asset_addController);

asset_addController.$inject = [
  "$http",
  "$rootScope",
  "alertService",
  "$filter",
];
function asset_addController($http, $rootScope, alertService, $filter) {
  let vm = this;
  const url = "api-url";
  let oData = {
    ast_type: "",
    ast_class: "",
    ast_um: "",
    ast_desc: "",
    ast_inv_nbr: null,

    ast_pur_date: null,
    ast_po_nbr: null,
    ast_vend: null,
    ast_rt_price: 0,
    ast_budget_year: null,

    ast_budget_from: "กองทุนฟื้นฟู",
    ast_rmks: null,
  };

  vm.qty = 1;
  let mCls = [];
  vm.mData = {
    site: $rootScope.globals.profile.site,
  };
  vm.cls = [];

  vm.clear = clear;
  vm.save = save;
  vm.select_typ = select_typ;
  vm.select_cls = select_cls;
  vm.nom = nom;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    clear();
    let req = {
      auth: $rootScope.globals.auth,
      mod: "main",
    };

    $http.post(url, req).then(
      function (response) {
        vm.modal = response.data.modal;
        mCls = response.data.modal.cls;
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
    vm.qty = 1;
    vm.cls = [];
  }

  function save() {
    alertService.confrim("บันทึกข้อมูล ?", function (value) {
      if (value) {
        $rootScope.loading = true;
        let req = {
          auth: $rootScope.globals.auth,
          mod: "save",
          it: vm.data,
          qty: vm.qty,
        };
        req.it.ast_pur_date = $filter("date")(
          req.it.ast_pur_date,
          "yyyy/MM/dd"
        );
        if (req.it.ast_budget_from !== "อื่นๆ") {
          req.it.ast_rmks = null;
        }

        $http.post(url, req).then(
          function (response) {
            if (response.data.status === "Okkk") {
              alertService.success(
                "สร้างอุปกรณ์รหัส " + response.data.msg + " เรียบร้อย"
              );
              clear();
            } else {
              let msg = "";
              switch (response.data.status) {
                case "noTyp":
                  msg = "ไม่พบหน่วยนับ";
                  break;
                case "noCls":
                  msg = "ไม่พบหมู่อุปกรณ์";
                  break;
                case "noUM":
                  msg = "ไม่พบหมวดอุปกรณ์";
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

  function select_typ(model) {
    vm.modal.cls = mCls.filter(function (data) {
      return data.addr === model;
    });

    vm.cls = vm.modal.cls[0];
    vm.data.ast_class = vm.modal.cls[0].id;
  }

  function select_cls(model) {
    vm.data.ast_class = model.id;
  }

  function nom() {
    if (!angular.isNumber(vm.qty) || vm.qty < 1) {
      vm.qty = 1;
    }
  }
}
