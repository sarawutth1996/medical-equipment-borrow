angular
  .module("app.lend")
  .controller("report_statuscontroller", report_statuscontroller)
  .controller("selectID1Controller", selectID1Controller)
  .controller("selectID2Controller", selectID2Controller)
  .controller("selectDOC1Controller", selectDOC1Controller)
  .controller("selectDOC2Controller", selectDOC2Controller)
  .controller("siteController", siteController);

report_statuscontroller.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "alertService",
  "$filter",
];

function report_statuscontroller(
  $http,
  $uibModal,
  $rootScope,
  alertService,
  $filter
) {
  const url = "api-url";
  let vm = this;
  let status_mstr = null;
  vm.readPDF = readPDF;
  vm.selectID1 = selectID1;
  vm.selectID2 = selectID2;
  vm.selectDOC1 = selectDOC1;
  vm.selectDOC2 = selectDOC2;
  vm.site = site;
  vm.clear = clear;
  vm.rp = {
    id1: null,
    id2: null,
    doc1: null,
    doc2: null,
    site: null,
    status: null,
    DATE1: null,
    DATE2: null,
    type: null,
  };

  fristLook();

  function fristLook() {
    console.log($rootScope.globals.profile.role);
    switch ($rootScope.globals.profile.role) {
      case "ROOT":
        vm.show = true;
        vm.old_rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: null,
          status: null,
          DATE1: null,
          DATE2: null,
          type: null,
        };
        break;
      case "CENTER":
        vm.show = true;
        vm.old_rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: null,
          status: null,
          DATE1: null,
          DATE2: null,
          type: null,
        };
        break;
      case "PROVINCE":
        vm.rp.site = $rootScope.globals.profile.site;
        vm.show = true;
        vm.old_rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
          type: null,
        };
        break;
      case "DISTRICT":
        vm.rp.site = $rootScope.globals.profile.site;
        vm.old_rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
          type: null,
        };
        break;
      case "SUB-DISTRICT":
        vm.rp.site = $rootScope.globals.profile.site;
        vm.old_rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
          type: null,
        };
        break;
    }
  }

  function clear() {
    vm.rp = angular.copy(vm.old_rp);
    vm.returned_date = undefined;
    vm.loan_date = undefined;
  }

  function readPDF() {
    $rootScope.loading = true;
    vm.rp.DATE1 = $filter("date")(vm.loan_date, "dd/MM/yyyy");
    vm.rp.DATE2 = $filter("date")(vm.returned_date, "dd/MM/yyyy");
    //------------------------------
    if (
      vm.rp.status === "" ||
      vm.rp.status === undefined ||
      vm.rp.status === null
    ) {
      status_mstr = "ALL";
    } else {
      if (vm.rp.status == "ยืม") {
        status_mstr = "BORROW";
      } else if (vm.rp.status == "คืน") {
        status_mstr = "RETURNED";
      }
    }

    if (vm.rp.type === "" || vm.rp.type === undefined || vm.rp.type === null) {
      let req = {
        auth: $rootScope.globals.auth,
        mod: "isRPdetail",
        it: {
          id1: vm.rp.id1 === "" || vm.rp.id1 === undefined ? null : vm.rp.id1,
          id2: vm.rp.id2 === "" || vm.rp.id2 === undefined ? null : vm.rp.id2,
          doc1:
            vm.rp.doc1 === "" || vm.rp.doc1 === undefined ? null : vm.rp.doc1,
          doc2:
            vm.rp.doc2 === "" || vm.rp.doc2 === undefined ? null : vm.rp.doc2,
          status: status_mstr,
          date1:
            vm.rp.DATE1 === "" || vm.rp.DATE1 === undefined
              ? null
              : vm.rp.DATE1,
          date2:
            vm.rp.DATE2 === "" || vm.rp.DATE2 === undefined
              ? null
              : vm.rp.DATE2,
          site: vm.rp.site,
        },
      };
      $http.post(url, req).then(
        function (response) {
          vm.data = response.data;
          if (response.data.status == true) {
            plan(vm.data);
          } else {
            alertService.info("ไม่พบข้อมูลที่ค้นหา");
          }

          $rootScope.loading = false;
        },
        function (response) {
          $rootScope.loading = false;
        }
      );
    } else {
      // ค้นหาเอกสารเฉพาะการยืมครั้งล่าสุด
      let req = {
        auth: $rootScope.globals.auth,
        mod: "isRPlasted",
        it: {
          id1: vm.rp.id1 === "" || vm.rp.id1 === undefined ? null : vm.rp.id1,
          id2: vm.rp.id2 === "" || vm.rp.id2 === undefined ? null : vm.rp.id2,
          doc1:
            vm.rp.doc1 === "" || vm.rp.doc1 === undefined ? null : vm.rp.doc1,
          doc2:
            vm.rp.doc2 === "" || vm.rp.doc2 === undefined ? null : vm.rp.doc2,
          status: status_mstr,
          date1:
            vm.rp.DATE1 === "" || vm.rp.DATE1 === undefined
              ? null
              : vm.rp.DATE1,
          date2:
            vm.rp.DATE2 === "" || vm.rp.DATE2 === undefined
              ? null
              : vm.rp.DATE2,
          site: vm.rp.site,
        },
      };

      $rootScope.loading = true;
      $http.post(url, req).then(
        function (response) {
          vm.data = response.data;
          if (response.data.status == true) {
            plan(vm.data);
          } else {
            alertService.info("ไม่พบข้อมูลที่ค้นหา");
          }

          $rootScope.loading = false;
        },
        function (response) {
          $rootScope.loading = false;
        }
      );
    }
  }

  function selectID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "selectID1.modal",
      controller: "selectID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.rp.site;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.id1 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          id1: vm.rp.id1,
          id2: vm.rp.id2,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function selectID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "selectID2.modal",
      controller: "selectID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.rp.site;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.id2 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          id1: vm.rp.id1,
          id2: vm.rp.id2,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function selectDOC1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "selectDOC1.modal",
      controller: "selectDOC1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return {
            id1: vm.rp.id1,
            id2: vm.rp.id2,
          };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.doc1 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          id1: vm.rp.id1,
          id2: vm.rp.id2,
          doc1: vm.rp.doc1,
          doc2: vm.rp.doc2,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function selectDOC2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "selectDOC2.modal",
      controller: "selectDOC2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return {
            id1: vm.rp.id1,
            id2: vm.rp.id2,
          };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.doc2 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          id1: vm.rp.id1,
          id2: vm.rp.id2,
          doc1: vm.rp.doc1,
          doc2: vm.rp.doc2,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function site() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "site.modal",
      controller: "siteController",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return $rootScope.globals.profile.site;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.site = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          id1: null,
          id2: null,
          doc1: null,
          doc2: null,
          site: vm.rp.site,
          status: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
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
                text: "",
                fontSize: 16,
              },
              {
                text: "รายงานสรุปสถานะใบยืม",
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
    let totalqty = 0;
    let totaldepositi = 0;
    // data.head
    data.header.forEach(function (row, index) {
      let headline = {
        bold: true,
        text: row.site,
        margin: [2, 10, 0, 10],
        decoration: "underline",
      };
      if (index !== 0) {
        headline.pageBreak = "before";
      }
      frame.content.push(headline);

      row.data.forEach(function (rowX, index) {
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
                ? {
                    dash: {
                      length: 2,
                      space: 1,
                    },
                  }
                : null;
            },
          },
          table: {
            headerRows: 2,
            widths: [85, 70, 125, 120, 40, 40, 45, 45, 18, 23, 23, 28, 25, 35],
            body: [
              [
                {
                  colSpan: 5,
                  text: "ชื่อผู้มีสิทธิ์ยืม  " + rowX.CMAD_NAME,
                  bold: true,
                  width: "*",
                },
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ],
              [
                {
                  text: "เลขที่ใบยืม",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "รหัสอุปกรณ์",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "รายละเอียด",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "เลขที่ครุภัณฑ์",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "จำนวน",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "เงินมัดจำ",
                  alignment: "right",
                  bold: true,
                },
                {
                  text: "วันที่ยืม",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "กำหนดคืน",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "ปกติ",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "1-60",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "61-90",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "91-120",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "> 120",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "สถานะ",
                  alignment: "center",
                  bold: true,
                },
              ],
            ],
          },
        };

        let turtle = 0;
        let depositi = 0;
        let qty = 0;
        rowX.item.forEach(function (ro, index) {
          angular.merge(rowX.item[index], {
            RO_TIME_FRAME_1: undefined,
          });
          angular.merge(rowX.item[index], {
            RO_TIME_FRAME_2: undefined,
          });
          angular.merge(rowX.item[index], {
            RO_TIME_FRAME_3: undefined,
          });
          angular.merge(rowX.item[index], {
            RO_TIME_FRAME_4: undefined,
          });
          angular.merge(rowX.item[index], {
            RO_TIME_FRAME_5: undefined,
          });
          if (ro.RO_TIME_FRAME <= 0) {
            ro.RO_TIME_FRAME_1 = 1;
            ro.RO_TIME_FRAME_2 = "-";
            ro.RO_TIME_FRAME_3 = "-";
            ro.RO_TIME_FRAME_4 = "-";
            ro.RO_TIME_FRAME_5 = "-";
          } else if (ro.RO_TIME_FRAME >= 1 && ro.RO_TIME_FRAME <= 60) {
            ro.RO_TIME_FRAME_1 = "-";
            ro.RO_TIME_FRAME_2 = 1;
            ro.RO_TIME_FRAME_3 = "-";
            ro.RO_TIME_FRAME_4 = "-";
            ro.RO_TIME_FRAME_5 = "-";
          } else if (ro.RO_TIME_FRAME >= 61 && ro.RO_TIME_FRAME <= 90) {
            ro.RO_TIME_FRAME_1 = "-";
            ro.RO_TIME_FRAME_2 = "-";
            ro.RO_TIME_FRAME_3 = 1;
            ro.RO_TIME_FRAME_4 = "-";
            ro.RO_TIME_FRAME_5 = "-";
          } else if (ro.RO_TIME_FRAME >= 91 && ro.RO_TIME_FRAME <= 120) {
            ro.RO_TIME_FRAME_1 = "-";
            ro.RO_TIME_FRAME_2 = "-";
            ro.RO_TIME_FRAME_3 = "-";
            ro.RO_TIME_FRAME_4 = 1;
            ro.RO_TIME_FRAME_5 = "-";
          } else if (ro.RO_TIME_FRAME > 120) {
            ro.RO_TIME_FRAME_1 = "-";
            ro.RO_TIME_FRAME_2 = "-";
            ro.RO_TIME_FRAME_3 = "-";
            ro.RO_TIME_FRAME_4 = "-";
            ro.RO_TIME_FRAME_5 = 1;
          }

          let str = [
            {
              text: ro.RO_NBR,
              alignment: "center",
            },
            {
              text: ro.RO_ID,
              alignment: "center",
            },
            {
              text: ro.RO_DESC,
              alignment: "left",
            },
            {
              text: "นม.0132.123.6530-020-0001/3",
              alignment: "center",
              bold: true,
            }, //ro.AST_INV_NBR
            {
              text: ro.RO_UNIT_COUNT,
              alignment: "center",
            },
            {
              text: $filter("number")(ro.RO_DEPOSIT, 2),
              alignment: "right",
            },
            {
              text: rowX.RO_LOAN_DATE,
              alignment: "center",
            },
            {
              text: ro.RO_RETURNED_DATE,
              alignment: "center",
            },
            {
              text: ro.RO_TIME_FRAME_1,
              alignment: "center",
            },
            {
              text: ro.RO_TIME_FRAME_2,
              alignment: "center",
            },
            {
              text: ro.RO_TIME_FRAME_3,
              alignment: "center",
            },
            {
              text: ro.RO_TIME_FRAME_4,
              alignment: "center",
            },
            {
              text: ro.RO_TIME_FRAME_5,
              alignment: "center",
            },
            {
              text: ro.RO_ACTIVE_STAT,
              alignment: "center",
            },
          ];
          TB.table.body.push(str);
          turtle += parseFloat(ro.ast_rt_price);
          depositi += parseFloat(ro.RO_DEPOSIT);
          qty += parseFloat(ro.RO_UNIT_COUNT);
        });

        total += turtle;
        totalqty += qty;
        totaldepositi += depositi;

        TB.table.body.push([
          {
            text: "",
            alignment: "center",
            colSpan: 3,
            border: [false, false, false],
          },
          "",
          "",
          {
            text: "รวม",
            alignment: "center",
          },
          {
            text: $filter("number")(qty),
            alignment: "center",
          },
          {
            text: $filter("number")(depositi, 2),
            alignment: "right",
          },
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        frame.content.push(TB);
      });
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
        widths: ["*", 115, 28, 58, 158, 130],
        body: [
          [
            {
              text: "",
              border: [false, false, false, false],
            },
            {
              text: "รวมทั้งสิ้น",
              alignment: "center",
            },
            {
              text: $filter("number")(totalqty),
              alignment: "right",
            },
            {
              text: $filter("number")(totaldepositi, 2),
              alignment: "right",
            },
            "",
            "",
          ],
          [
            {
              text: "",
              border: [false, false, false, false],
            },
            "",
            "",
            "",
            "",
            "",
          ],
        ],
      },
    });

    pdfMake.createPdf(frame).open();
  }

  //-------------------------------------------------
  //-------------------------------------------------
  vm.loan_calendar = loan_calendar;
  vm.returned_calendar = returned_calendar;
  vm.loan_up = {
    opened: false,
  };
  vm.returned_up = {
    opened: false,
  };

  vm.loan_dateOptions = {
    formatYear: "yy",
    startingDay: 1,
  };

  vm.returned_dateOptions = {
    formatYear: "yy",
    startingDay: 1,
  };

  function loan_calendar() {
    vm.loan_up.opened = true;
  }

  function returned_calendar() {
    vm.returned_up.opened = true;
  }
}

selectID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];

function selectID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_SE1 = SE1applyGlobalSearch;
  vm.click_se1 = se1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_SE1",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_SE1 = response.data.data;
      vm.table_SE1 = new NgTableParams(
        {},
        {
          dataset: response.data.data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function SE1applyGlobalSearch() {
    let term_SE1 = vm.globalSearchTerm_SE1;
    vm.table_SE1.filter({
      $: term_SE1,
    });
  }

  function se1(info) {
    $uibModalInstance.close(info);
  }
}

selectID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
  "alertService",
];

function selectID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_SE2 = SE2applyGlobalSearch;
  vm.click_se2 = se2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_SE2",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_SE2 = response.data.data;
      vm.table_SE2 = new NgTableParams(
        {},
        {
          dataset: response.data.data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function SE2applyGlobalSearch() {
    let term_SE2 = vm.globalSearchTerm_SE2;
    vm.table_SE2.filter({
      $: term_SE2,
    });
  }

  function se2(info) {
    $uibModalInstance.close(info);
  }
}

selectDOC1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
  "alertService",
];

function selectDOC1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_DOC1 = DOC1applyGlobalSearch;
  vm.click_doc1 = doc1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_DOC1",
    it: {
      id1: items.id1 == null ? null : items.id1,
      id2: items.id2 == null ? null : items.id2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_DOC1 = response.data.data;
      vm.table_DOC1 = new NgTableParams(
        {},
        {
          dataset: response.data.data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function DOC1applyGlobalSearch() {
    let term_DOC1 = vm.globalSearchTerm_DOC1;
    vm.table_DOC1.filter({
      $: term_DOC1,
    });
  }

  function doc1(info) {
    $uibModalInstance.close(info);
  }
}

selectDOC2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];

function selectDOC2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_DOC2 = DOC2applyGlobalSearch;
  vm.click_doc2 = doc2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_DOC1",
    it: {
      id1: items.id1 == null ? null : items.id1,
      id2: items.id2 == null ? null : items.id2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_DOC2 = response.data.data;
      vm.table_DOC2 = new NgTableParams(
        {},
        {
          dataset: response.data.data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function DOC2applyGlobalSearch() {
    let term_DOC2 = vm.globalSearchTerm_DOC2;
    vm.table_DOC2.filter({
      $: term_DOC2,
    });
  }

  function doc2(info) {
    $uibModalInstance.close(info);
  }
}

siteController.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];

function siteController(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.click_site = site;
  vm.applyGlobalSearch_site = siteapplyGlobalSearch;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRPpermiss",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.table_site = new NgTableParams(
        {},
        {
          dataset: response.data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function siteapplyGlobalSearch() {
    let term_site = vm.globalSearchTerm_site;
    vm.table_site.filter({
      $: term_site,
    });
  }

  function site(info) {
    $uibModalInstance.close(info);
  }
}
