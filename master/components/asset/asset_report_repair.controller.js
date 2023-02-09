angular
  .module("app.asset")
  .controller("asset_report_repairController", asset_report_repairController)
  .controller(
    "asset_report_repairController_modal",
    asset_report_repairController_modal
  );

asset_report_repairController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
  "$filter",
];
function asset_report_repairController(
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
    site: null,
    site2: null,
    id: null,
    id2: null,
    typ: null,

    typ2: null,
    dat: null,
    dat2: null,
    usp: null,
    usp2: null,
  };

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
      mod: "mainR",
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
    $rootScope.loading = true;
    const req = {
      auth: $rootScope.globals.auth,
      mod: "printR",
      it: {
        site:
          vm.data.site === "" || vm.data.site === undefined
            ? null
            : vm.data.site,
        site2:
          vm.data.site2 === "" || vm.data.site2 === undefined
            ? null
            : vm.data.site2,
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
        usp:
          vm.data.usp === "" || vm.data.usp === undefined ? null : vm.data.usp,
        usp2:
          vm.data.usp2 === "" || vm.data.usp2 === undefined
            ? null
            : vm.data.usp2,
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
              w: 585,
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
                text: "",
                fontSize: 16,
              },
              {
                text: "รายงานมูลค่าซ่อมอุปกรณ์",
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
          widths: [80, 119, 30, 50, 100, 50, 100],
          body: [
            [
              { text: "ศูนย์  " + row.name, bold: true, colSpan: 7 },
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              { alignment: "center", bold: true, text: "รหัสอุปกรณ์" },
              { alignment: "center", bold: true, text: "รายละเอียด" },
              { alignment: "center", bold: true, text: "ลำดับ" },
              { alignment: "center", bold: true, text: "วันที่ซ่อม" },
              { alignment: "center", bold: true, text: "ผู้ซ่อม" },
              { alignment: "center", bold: true, text: "มูลค่า" },
              { alignment: "center", bold: true, text: "หมายเหตุ" },
            ],
          ],
        },
      };

      row.data.forEach(function (ro, index) {
        TB.table.body.push([
          { alignment: "center", text: ro.name.ast_asset },
          { text: ro.name.ast_desc },
          { alignment: "center", text: "1" },
          { alignment: "center", text: ro.data[0].dat },
          { text: ro.data[0].tr_user1 },
          {
            alignment: "right",
            text: $filter("number")(ro.data[0].tr_price, 2),
          },
          { text: ro.data[0].tr_rmks },
        ]);

        if (ro.data.length > 1) {
          for (i = 1; i < ro.data.length; i++) {
            TB.table.body.push([
              { text: "" },
              { text: "" },
              { alignment: "center", text: i + 1 },
              { alignment: "center", text: ro.data[i].dat },
              { text: ro.data[i].tr_user1 },
              {
                alignment: "right",
                text: $filter("number")(ro.data[i].tr_price, 2),
              },
              { text: ro.data[i].tr_rmks },
            ]);
          }

          TB.table.body.push([
            { text: "", colSpan: 4, border: [true, true, true, true] },
            "",
            "",
            "",
            { alignment: "center", text: "รวม" },
            { alignment: "right", text: $filter("number")(ro.total, 2) },
            "",
          ]);
        }
      });

      TB.table.body.push([
        { text: "", colSpan: 4, border: [false, false, false, false] },
        "",
        "",
        "",
        { alignment: "center", text: "รวมศูนย์" },
        { alignment: "right", text: $filter("number")(row.total, 2) },
        "",
      ]);

      if (index !== 0) TB.pageBreak = "before";
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
        widths: ["*", 100, 50, 100],
        body: [
          [
            { text: "", border: [false, false, false, false] },
            { alignment: "center", text: "รวมทั้งสิ้น" },
            { alignment: "right", text: $filter("number")(data.total, 2) },
            "",
          ],
          [{ text: "", border: [false, false, false, false] }, "", "", ""],
        ],
      },
    });

    pdfMake.createPdf(frame).open();
  }

  function modal_st(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_repair-st.modal",
      controller: "asset_report_repairController_modal",
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
        const yek = key === 1 ? "site" : "site2";
        vm.data[yek] = result;
      },
      function () {}
    );
  }

  function modal_ast(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_repair-ast.modal",
      controller: "asset_report_repairController_modal",
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
      templateUrl: "asset_report_repair-typ.modal",
      controller: "asset_report_repairController_modal",
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

asset_report_repairController_modal.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_repairController_modal(
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
