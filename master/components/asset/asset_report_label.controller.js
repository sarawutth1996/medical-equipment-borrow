angular
  .module("app.asset")
  .controller("asset_report_labelController", asset_report_labelController)
  .controller(
    "asset_report_labelController_modal_st",
    asset_report_labelController_modal_st
  )
  .controller(
    "asset_report_labelController_modal_ast",
    asset_report_labelController_modal_ast
  );

asset_report_labelController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
];
function asset_report_labelController(
  $http,
  $rootScope,
  $uibModal,
  alertService
) {
  let vm = this;
  const url = "api-url";

  let oModal = {};
  let oData = {
    site: $rootScope.globals.profile.site,
    id: null,
    id2: null,
    pos: null,
    pos2: null,
  };

  vm.clear = clear;
  vm.print = print;
  vm.modal_st = modal_st;
  vm.modal_ast = modal_ast;
  vm.nom = nom;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    const role = $rootScope.globals.profile.role;
    if (role === "ROOT" || role === "CENTER" || role === "PROVINCE") {
      vm.show = true;
    }
    let req = {
      auth: $rootScope.globals.auth,
      mod: "mainL",
    };

    $http.post(url, req).then(
      function (response) {
        oModal = response.data;
        clear();
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
    vm.modal = angular.copy(oModal);
  }

  function print() {
    const req = {
      auth: $rootScope.globals.auth,
      mod: "printL",
      it: {
        site: vm.data.site,
        id: vm.data.id === "" || vm.data.id === undefined ? null : vm.data.id,
        id2:
          vm.data.id2 === "" || vm.data.id2 === undefined ? null : vm.data.id2,
        pos:
          vm.data.pos === "" || vm.data.pos === undefined ? null : vm.data.pos,
        pos2:
          vm.data.pos2 === "" || vm.data.pos2 === undefined
            ? null
            : vm.data.pos2,
      },
    };

    $http.post(url, req).then(
      function (response) {
        if (response.data.status) {
          plan(response.data.data);
        } else {
          alertService.info("ไม่พบข้อมูลที่ค้นหา");
        }

        $rootScope.loading = false;
      },
      function (response) {
        console.error(response);
        $rootScope.loading = false;
      }
    );
  }

  function plan(data) {
    let frame = {
      pageSize: "A4",
      pageMargins: [15, 15],
      defaultStyle: {
        font: "angsanaUPC",
        fontSize: 12,
      },
      content: [],
    };

    data.forEach(function (row, index) {
      let SET = {
        margin: [0, 10],
        columns: [],
      };
      if (index % 8 === 0 && index > 0) {
        SET.pageBreak = "before";
      }

      row.forEach(function (ro, index) {
        let str;
        if (ro === false) {
          str = { margin: [15, 21], text: "", width: 180 };
        } else {
          str = {
            width: 200,
            margin: [12, 5],
            stack: [
              {
                columns: [
                  { qr: ro.ast_asset, fit: 45, width: 47 },
                  `วันที่ซื้อ: ${ro.dat}\n${ro.ast_budget_form}\n${ro.ast_asset}`,
                ],
              },
              { text: ro.ast_desc, margin: [0, 2, 0, 0] },
              "เลขที่ครุภัณฑ์: " + ro.ast_inv_nbr,
            ],
          };
        }

        SET.columns.push(str);
      });

      frame.content.push(SET);
    });

    pdfMake.createPdf(frame).open();
  }

  function modal_st() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_label-st.modal",
      controller: "asset_report_labelController_modal_st",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.st;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.data.id = null;
        vm.data.id2 = null;

        $rootScope.loading = true;
        vm.data.site = result;
        let req = {
          auth: $rootScope.globals.auth,
          mod: "asset",
          it: result,
        };
        $http.post(url, req).then(
          function (response) {
            vm.modal.ast = response.data;
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

  function modal_ast(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_label-ast.modal",
      controller: "asset_report_labelController_modal_ast",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.ast;
        },
      },
    });

    modal.result.then(
      function (result) {
        const yek = key === 1 ? "id" : "id2";
        vm.data[yek] = result;
      },
      function () {}
    );
  }

  function nom(key) {
    const n = key === 1 ? vm.data.pos : vm.data.pos2;
    if (!angular.isNumber(n) || n < 1) {
      if (key === 1) {
        vm.data.pos = null;
      } else {
        vm.data.pos2 = null;
      }
    }
  }
}

asset_report_labelController_modal_st.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_labelController_modal_st(
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

asset_report_labelController_modal_ast.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_labelController_modal_ast(
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
