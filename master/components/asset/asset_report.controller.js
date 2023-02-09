angular
  .module("app.asset")
  .controller("asset_reportController", asset_reportController)
  .controller(
    "asset_reportController_modal_st",
    asset_reportController_modal_st
  )
  .controller(
    "asset_reportController_modal_ast",
    asset_reportController_modal_ast
  )
  .controller(
    "asset_reportController_modal_typ",
    asset_reportController_modal_typ
  );

asset_reportController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
  "$filter",
];
function asset_reportController(
  $http,
  $rootScope,
  $uibModal,
  alertService,
  $filter
) {
  let vm = this;
  const url = "api-url";

  let oModal = {};
  let oData = {
    site: $rootScope.globals.profile.site,
    id: null,
    id2: null,
    typ: null,
    typ2: null,

    dat: null,
    dat2: null,
    vend: null,
    year: null,
    year2: null,

    stat: "ALL",
  };

  vm.filter = [
    { id: "ALL", name: "ทั้งหมด" },
    { id: "N", name: "ปกติ" },
    { id: "R", name: "ซ่อม" },
    { id: "W", name: "จำหน่าย" },
    { id: "D", name: "ชำรุด" },
  ];
  vm.show = false;

  vm.clear = clear;
  vm.print = print;
  vm.modal_st = modal_st;
  vm.modal_ast = modal_ast;
  vm.modal_typ = modal_typ;

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
      mod: "main",
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
      mod: "print",
      it: {
        site: vm.data.site,
        id: vm.data.id === "" || vm.data.id === undefined ? null : vm.data.id,
        id2:
          vm.data.id2 === "" || vm.data.id2 === undefined ? null : vm.data.id2,
        typ:
          vm.data.typ === "" || vm.data.typ === undefined ? null : vm.data.typ,
        typ2:
          vm.data.typ2 === "" || vm.data.typ2 === undefined
            ? null
            : vm.data.typ2,

        dat: $filter("date")(vm.data.dat, "dd/MM/yyyy"),
        dat2: $filter("date")(vm.data.dat2, "dd/MM/yyyy"),
        vend:
          vm.data.vend === "" || vm.data.vend === undefined
            ? null
            : vm.data.vend,
        year:
          vm.data.year === "" || vm.data.year === undefined
            ? null
            : vm.data.year,
        year2:
          vm.data.year2 === "" || vm.data.year2 === undefined
            ? null
            : vm.data.year2,

        stat: vm.data.stat,
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
      pageOrientation: "landscape",
      pageMargins: [5, 55, 5, 5],
      defaultStyle: {
        font: "angsanaUPC",
        fontSize: 14,
      },
      background: function () {
        return {
          canvas: [
            {
              type: "rect",
              x: 5,
              y: 5,
              w: 832,
              h: 45,
              r: 5,
              color: "#BEBEBE",
            },
          ],
        };
      },
      header: function (currentPage, pageCount) {
        return [
          {
            margin: [10, 5, 10, 0],
            columns: [
              {
                text: data.head,
                fontSize: 16,
              },
              {
                text: "รายงานทะเบียนอุปกรณ์",
                fontSize: 16,
                alignment: "right",
              },
            ],
          },
          {
            margin: [10, 5, 10, 0],
            columns: [
              {
                text:
                  "หน้า " + currentPage.toString() + "/" + pageCount.toString(),
                fontSize: 16,
              },
              {
                text:
                  "พิมพ์วันที่  " + $filter("date")(new Date(), "dd/MM/yyyy"),
                fontSize: 16,
                alignment: "right",
              },
            ],
          },
        ];
      },
      content: [],
    };

    let total = 0;
    let qty = 0;
    data.det.forEach(function (row, index) {
      let TB = {
        layout: {
          hLineWidth: function (i, node) {
            const mp = [
              1,
              2,
              node.table.body.length - 1,
              node.table.body.length,
            ];
            return mp.includes(i) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
          hLineColor: function (i, node) {
            return "gray";
          },
          hLineStyle: function (i, node) {
            return i !== node.table.body.length
              ? { dash: { length: 2, space: 1 } }
              : null;
          },
        },
        table: {
          headerRows: 2,
          widths: [50, 100, "*", 100, 40, 40, 100, 40],
          body: [
            [
              { text: "หมวด  " + row.name, bold: true, colSpan: 8 },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              { text: "วันที่ซื้อ", alignment: "center", bold: true },
              { text: "รหัสอุปกรณ์", alignment: "center", bold: true },
              { text: "รายละเอียด", alignment: "center", bold: true },
              { text: "เอกสารซื้อ", alignment: "center", bold: true },
              { text: "ปี", alignment: "center", bold: true },
              { text: "จำนวน", alignment: "center", bold: true },
              { text: "มูลค่า", alignment: "center", bold: true },
              { text: "สถานะ", alignment: "center", bold: true },
            ],
          ],
        },
      };

      let turtle = 0;
      row.data.forEach(function (ro, index) {
        let str = [
          { text: ro.ast_pur_date, alignment: "center" },
          { text: ro.ast_asset, alignment: "center" },
          { text: ro.ast_desc },
          { text: ro.ast_inv_nbr },
          { text: ro.ast_budget_year, alignment: "center" },
          { text: "1", alignment: "center" },
          { text: $filter("number")(ro.ast_rt_price, 2), alignment: "right" },
          { text: ro.ast_status, alignment: "center" },
        ];
        TB.table.body.push(str);
        turtle += parseFloat(ro.ast_rt_price);
      });

      total += turtle;
      qty += row.data.length;
      TB.table.body.push([
        {
          text: "",
          alignment: "center",
          colSpan: 4,
          border: [false, false, false, false],
        },
        "",
        "",
        "",
        { text: "รวม", alignment: "center" },
        { text: $filter("number")(row.data.length), alignment: "center" },
        { text: $filter("number")(turtle, 2), alignment: "right" },
        "",
      ]);

      frame.content.push(TB);
    });

    frame.content.push({
      layout: {
        hLineWidth: function (i, node) {
          return i === node.table.body.length - 1 ||
            i === node.table.body.length
            ? 1
            : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function (i, node) {
          return "gray";
        },
        paddingBottom: function (i, node) {
          return 0;
        },
      },
      table: {
        widths: ["*", 40, 40, 100, 40],
        body: [
          [
            { text: "", border: [false, false, false, false] },
            { text: "รวมทั้งสิ้น", alignment: "center" },
            { text: $filter("number")(qty), alignment: "center" },
            { text: $filter("number")(total, 2), alignment: "right" },
            "",
          ],
          [{ text: "", border: [false, false, false, false] }, "", "", "", ""],
        ],
      },
    });

    pdfMake.createPdf(frame).open();
  }

  function modal_st() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report-st.modal",
      controller: "asset_reportController_modal_st",
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
      templateUrl: "asset_report-ast.modal",
      controller: "asset_reportController_modal_ast",
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

  function modal_typ(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report-typ.modal",
      controller: "asset_reportController_modal_typ",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.typ;
        },
      },
    });

    modal.result.then(
      function (result) {
        const yek = key === 1 ? "typ" : "typ2";
        vm.data[yek] = result;
      },
      function () {}
    );
  }
}

asset_reportController_modal_st.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_reportController_modal_st(
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

asset_reportController_modal_ast.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_reportController_modal_ast(
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

asset_reportController_modal_typ.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_reportController_modal_typ(
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
