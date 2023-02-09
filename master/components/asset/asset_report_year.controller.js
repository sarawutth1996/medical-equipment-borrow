angular
  .module("app.asset")
  .controller("asset_report_yearController", asset_report_yearController)
  .controller(
    "asset_report_yearController_modal_prov",
    asset_report_yearController_modal_prov
  )
  .controller(
    "asset_report_yearController_modal_st",
    asset_report_yearController_modal_st
  )
  .controller(
    "asset_report_yearController_modal_typ",
    asset_report_yearController_modal_typ
  );

asset_report_yearController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
  "$filter",
];
function asset_report_yearController(
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
    site: null,
    site2: null,
    typ: null,
    typ2: null,
    year: new Date().getFullYear() + 543,
    year2: new Date().getFullYear() + 543,
  };

  vm.show = {
    prov: false,
    site: false,
  };

  vm.clear = clear;
  vm.print = print;
  vm.modal_prov = modal_prov;
  vm.modal_st = modal_st;
  vm.modal_typ = modal_typ;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    switch ($rootScope.globals.profile.role) {
      case "ROOT":
        vm.show.prov = true;
        vm.show.site = true;
        break;
      case "CENTER":
        vm.show.prov = true;
        vm.show.site = true;
        break;
      case "PROVINCE":
        vm.show.site = true;
        oData.prov = $rootScope.globals.profile.site;
        oData.prov2 = $rootScope.globals.profile.site;
        break;
      case "DISTRICT":
        oData.prov = $rootScope.globals.profile.site.substr(0, 3);
        oData.prov2 = $rootScope.globals.profile.site.substr(0, 3);
        oData.site = $rootScope.globals.profile.site;
        oData.site2 = $rootScope.globals.profile.site;
        break;
      case "SUB-DISTRICT":
        oData.prov = $rootScope.globals.profile.site.substr(0, 3);
        oData.prov2 = $rootScope.globals.profile.site.substr(0, 3);
        oData.site = $rootScope.globals.profile.site;
        oData.site2 = $rootScope.globals.profile.site;
        break;
    }

    let req = {
      auth: $rootScope.globals.auth,
      mod: "mainY",
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
        mod: "printY",
        it: {
          prov:
            vm.data.prov === "" || vm.data.prov === undefined
              ? null
              : vm.data.prov,
          prov2:
            vm.data.prov2 === "" || vm.data.prov2 === undefined
              ? null
              : vm.data.prov2,
          site:
            vm.data.site === "" || vm.data.site === undefined
              ? null
              : vm.data.site,
          site2:
            vm.data.site2 === "" || vm.data.site2 === undefined
              ? null
              : vm.data.site2,
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
                text: "รายงานงบประมาณตามปี",
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
              text: "ศูนย์",
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
      let headline = {
        text: data.prov[index],
        bold: true,
        margin: [0, 10, 0, 0],
      };
      if (index !== 0) {
        headline.pageBreak = "before";
      }
      frame.content.push(headline);

      let modFram = angular.copy(framTB);
      row.data.forEach(function (rowX, indexX) {
        if (indexX !== 0) {
          let space = [{ colSpan: data.headyear.length + 3, text: "\n" }];
          for (let j = 0; j < data.headyear.length + 2; j++) {
            space.push("");
          }
          modFram.table.body.push(space);
        }

        rowX.forEach(function (rowY, indexY) {
          let setForm = ["", data.headtype[indexY]];
          if (indexY === 0) {
            setForm[0] = { rowSpan: rowX.length, text: row.site[indexX] };
          }

          if (indexY === rowX.length - 1) {
            setForm[1] = { alignment: "center", text: "รวม" };
          }

          rowY.forEach(function (rowZ, indexZ) {
            setForm.push({ alignment: "center", text: rowZ });
          });

          modFram.table.body.push(setForm);
        });
      });

      let turtle = [
        { text: "", border: [false, false, false, false] },
        { text: "รวมจังหวัด", alignment: "center" },
      ];
      row.total.forEach(function (ro, inx) {
        turtle.push({ alignment: "center", text: ro });
      });
      modFram.table.body.push(turtle);

      if (index === data.data.length - 1) {
        let turtle = [
          { text: "", border: [false, false, false, false] },
          { text: "รวมทั้งหมดทั้งสิ้น", alignment: "center" },
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
      templateUrl: "asset_report_year-prov.modal",
      controller: "asset_report_yearController_modal_prov",
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
        vm.data.site = null;
        vm.data.site2 = null;

        if (vm.data.prov !== null && vm.data.prov2 !== null) {
          $rootScope.loading = true;
          let req = {
            auth: $rootScope.globals.auth,
            mod: "siteBET",
            it: {
              A: vm.data.prov,
              B: vm.data.prov2 + "zzzz",
            },
          };

          $http.post(url, req).then(
            function (response) {
              vm.modal.st = response.data;
              $rootScope.loading = false;
            },
            function (response) {
              console.error(response);
              $rootScope.loading = false;
            }
          );
        }
      },
      function () {}
    );
  }

  function modal_st(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_year-st.modal",
      controller: "asset_report_yearController_modal_st",
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

  function modal_typ(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "asset_report_year-typ.modal",
      controller: "asset_report_yearController_modal_typ",
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

asset_report_yearController_modal_prov.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_yearController_modal_prov(
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

asset_report_yearController_modal_st.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_yearController_modal_st(
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

asset_report_yearController_modal_typ.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function asset_report_yearController_modal_typ(
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
