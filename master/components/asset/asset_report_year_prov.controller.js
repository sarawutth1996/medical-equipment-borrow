angular
  .module("app.asset")
  .controller(
    "asset_report_year_provController",
    asset_report_year_provController
  )
  .controller(
    "asset_report_year_provController_modal",
    asset_report_year_provController_modal
  );

asset_report_year_provController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
  "$filter",
];
function asset_report_year_provController(
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
    prov: null,
    prov2: null,
    typ: null,
    typ2: null,
    year: new Date().getFullYear() + 543,
    year2: new Date().getFullYear() + 543,
  };

  vm.show = false;

  vm.clear = clear;
  vm.print = print;
  vm.modal_prov = modal_prov;
  vm.modal_typ = modal_typ;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    switch ($rootScope.globals.profile.role) {
      case "ROOT":
        vm.show = true;
        break;
      case "CENTER":
        vm.show = true;
        break;
      case "PROVINCE":
        vm.show = false;
        oData.prov = $rootScope.globals.profile.site;
        oData.prov2 = $rootScope.globals.profile.site;
        break;
    }

    let req = {
      auth: $rootScope.globals.auth,
      mod: "mainYP",
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
    if (vm.data.year !== "" && vm.data.year2 !== "") {
      $rootScope.loading = true;
      const req = {
        auth: $rootScope.globals.auth,
        mod: "printYP",
        it: {
          prov:
            vm.data.prov === "" || vm.data.prov === undefined
              ? null
              : vm.data.prov,
          prov2:
            vm.data.prov2 === "" || vm.data.prov2 === undefined
              ? null
              : vm.data.prov2,
          typ:
            vm.data.typ === "" || vm.data.typ === undefined
              ? null
              : vm.data.typ,
          typ2:
            vm.data.typ2 === "" || vm.data.typ2 === undefined
              ? null
              : vm.data.typ2,
          year: vm.data.year,
          year2: vm.data.year2,
        },
      };

      $http.post(url, req).then(
        function (response) {
          if (response.data.status) {
            plan(response.data.dataset);
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
    } else {
      alertService.warning("กรุณากรอกปีงบประมาณ");
    }
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
                text: "",
                fontSize: 16,
              },
              {
                text: "รายงานงบประมาณจังหวัดตามปี",
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

    // Set Frame
    let framTB = {
      layout: {
        hLineColor: function (i, node) {
          return "gray";
        },
      },
      table: {
        headerRows: 2,
        widths: [100, "*", 50],
        body: [
          [
            {
              rowSpan: 2,
              alignment: "center",
              bold: true,
              margin: [0, 9, 0, 0],
              text: "จังหวัด",
            },
            {
              rowSpan: 2,
              alignment: "center",
              bold: true,
              margin: [0, 9, 0, 0],
              text: "รายการ",
            },
            {
              colSpan: data.headyear.length + 1,
              alignment: "center",
              bold: true,
              text: "ปีงบประมาณ",
            },
          ],
          ["", ""],
        ],
      },
    };

    data.headyear.forEach(function (row, index) {
      framTB.table.widths.push(50);
      framTB.table.body[0].push("");
      framTB.table.body[1].push({ alignment: "center", bold: true, text: row });
    });
    framTB.table.body[1].push({ alignment: "center", bold: true, text: "รวม" });

    // Table Data
    data.data.forEach(function (row, index) {
      let modFram = angular.copy(framTB);
      if (index !== 0) {
        modFram.pageBreak = "before";
      }

      row.data.forEach(function (rowX, indexX) {
        let setForm = ["", data.headtype[indexX]];
        if (indexX === 0) {
          setForm[0] = { rowSpan: row.data.length + 1, text: row.name };
        }

        if (indexX === row.data.length) {
          setForm[1] = { alignment: "center", text: "รวม" };
        }

        rowX.forEach(function (rowY, indexY) {
          setForm.push({ alignment: "center", text: rowY });
        });

        modFram.table.body.push(setForm);
      });

      let turtle = ["", { text: "รวม", alignment: "center" }];
      row.total.forEach(function (ro, inx) {
        turtle.push({ alignment: "center", text: ro });
      });
      modFram.table.body.push(turtle);

      if (index === data.data.length - 1) {
        let turtle = [
          { text: "", border: [false, false, false, false] },
          { text: "รวมทั้งหมด", alignment: "center" },
        ];
        data.total.forEach(function (row, index) {
          turtle.push({ alignment: "center", text: row });
        });
        modFram.table.body.push(turtle);
      }

      frame.content.push(modFram);
    });

    pdfMake.createPdf(frame).open();
  }

  function modal_prov(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_year_prov-prov.modal",
      controller: "asset_report_year_provController_modal",
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
        const yek = key === 1 ? "prov" : "prov2";
        vm.data[yek] = result;
      },
      function () {}
    );
  }

  function modal_typ(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_year_prov-typ.modal",
      controller: "asset_report_year_provController_modal",
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

asset_report_year_provController_modal.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_year_provController_modal(
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
