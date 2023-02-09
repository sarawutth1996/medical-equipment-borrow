angular
  .module("app.lend")
  .controller("report_count_itemscontroller", report_count_itemscontroller)
  .controller("BysiteID1Controller", BysiteID1Controller)
  .controller("BysiteID2Controller", BysiteID2Controller)
  .controller("ByastID1Controller", ByastID1Controller)
  .controller("ByastID2Controller", ByastID2Controller);

report_count_itemscontroller.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "alertService",
  "$filter",
];
function report_count_itemscontroller(
  $http,
  $uibModal,
  $rootScope,
  alertService,
  $filter
) {
  const url = "api-url";
  let vm = this;
  vm.siteID1 = siteID1;
  vm.siteID2 = siteID2;
  vm.astID1 = astID1;
  vm.astID2 = astID2;
  vm.clear = clear;
  vm.readPDF = readPDF;
  vm.si_province = true;
  vm.rp = {
    si1: null,
    si2: null,
    ast1: null,
    ast2: null,
    DATE1: null,
    DATE2: null,
    status: null,
  };

  fristLook();
  function fristLook() {
    switch ($rootScope.globals.profile.role) {
      case "ROOT":
        vm.show = true;
        vm.old_rp = {
          si1: null,
          si2: null,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
          status: null,
        };
        break;
      case "CENTER":
        vm.show = true;
        vm.old_rp = {
          si1: null,
          si2: null,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
          status: null,
        };
        break;
      case "PROVINCE":
        vm.show = true;
        vm.si_province = false;
        vm.rp.si1 = $rootScope.globals.profile.site;
        vm.old_rp = {
          si1: vm.rp.si1,
          si2: null,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
          status: null,
        };
        break;
      case "DISTRICT":
        vm.show = false;
        vm.rp.si1 = $rootScope.globals.profile.site;
        vm.rp.si2 = $rootScope.globals.profile.site;
        vm.old_rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
          status: null,
        };
        break;
      case "SUB-DISTRICT":
        vm.show = false;
        vm.rp.si1 = $rootScope.globals.profile.site;
        vm.rp.si2 = $rootScope.globals.profile.site;
        vm.old_rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
          status: null,
        };
        break;
    }
  }

  function readPDF() {
    vm.rp.DATE1 = $filter("date")(vm.loan_date, "dd/MM/yyyy");
    vm.rp.DATE2 = $filter("date")(vm.returned_date, "dd/MM/yyyy");
    let sql_status;
    if (
      vm.rp.status === "" ||
      vm.rp.status === undefined ||
      vm.rp.status === null
    ) {
      sql_status = "DESC";
    } else {
      sql_status = "ASC";
    }

    let req = {
      auth: $rootScope.globals.auth,
      mod: "isRPcnt_borrow",
      it: {
        si1: vm.rp.si1 === "" || vm.rp.si1 === undefined ? null : vm.rp.si1,
        si2: vm.rp.si2 === "" || vm.rp.si2 === undefined ? null : vm.rp.si2,
        ast1: vm.rp.ast1 === "" || vm.rp.ast1 === undefined ? null : vm.rp.ast1,
        ast2: vm.rp.ast2 === "" || vm.rp.ast2 === undefined ? null : vm.rp.ast2,
        status: sql_status,
        date1:
          vm.rp.DATE1 === "" || vm.rp.DATE1 === undefined ? null : vm.rp.DATE1,
        date2:
          vm.rp.DATE2 === "" || vm.rp.DATE2 === undefined ? null : vm.rp.DATE2,
        role: $rootScope.globals.profile.role,
      },
    };

    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.data = response.data.data;
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

  function plan(data) {
    let frame = {
      pageSize: "A4",
      pageOrientation: "portrait", //landscape
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
                text: "รายงานจำนวนยืม",
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

      content: [
        {
          lineHeight: 0.5,
          columns: [{ text: "\n", style: "content", width: "*" }],
        },
        {
          lineHeight: 1.3,
          columns: [
            {
              text: "วันที่ยืม\n",
              style: "content",
              width: 380,
              alignment: "right",
              bold: true,
            },
            {
              text:
                vm.rp.DATE1 == null || vm.rp.DATE1 == undefined
                  ? "-"
                  : vm.rp.DATE1,
              style: "subcontent",
              width: 60,
              alignment: "center",
            },
            {
              text: "ถึง\n",
              style: "content",
              width: 68,
              alignment: "right",
              bold: true,
            },
            {
              text:
                vm.rp.DATE2 == null || vm.rp.DATE2 == undefined
                  ? "-"
                  : vm.rp.DATE2,
              style: "subcontent",
              width: 60,
              alignment: "center",
            },
          ],
        },
      ],
    };

    let framTB = {
      layout: {
        hLineWidth: function (i, node) {
          const mp = [1, 2];
          return mp.includes(i) ? 1 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function (i, node) {
          return "gray";
        },
        hLineStyle: function (i, node) {
          return { dash: { length: 2, space: 1 } };
        },
      },
      table: {
        headerRows: 2,
        widths: [190, 70, "*", 75],
        body: [
          ["", "", "", ""],
          [
            { alignment: "center", bold: true, text: "ชื่อโรงพยาบาล" },
            { alignment: "center", bold: true, text: "รหัสอุปกรณ์" },
            { alignment: "center", bold: true, text: "ชื่ออุปกรณ์" },
            { alignment: "center", bold: true, text: "จำนวนยืม (ครั้ง)" },
          ],
        ],
      },
    };

    frame.content.push(framTB);

    data.forEach(function (row, index) {
      let array = [
        { text: row.SI_DESC, alignment: "left", style: "tablebody" },
        { text: row.RO_ID, alignment: "center", style: "tablebody" },
        { text: row.AST_DESC, alignment: "left", style: "tablebody" },
        { text: row.TOTAL, alignment: "center", style: "tablebody" },
      ];
      framTB.table.body.push(array);
    });

    pdfMake.createPdf(frame).open();
  }

  function clear() {
    vm.rp = angular.copy(vm.old_rp);
    vm.returned_date = undefined;
    vm.loan_date = undefined;
  }

  function siteID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "siteID1.modal",
      controller: "BysiteID1Controller",
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
        vm.rp.si1 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function siteID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "siteID2.modal",
      controller: "BysiteID2Controller",
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
        vm.rp.si2 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: null,
          ast2: null,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function astID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "astID1.modal",
      controller: "ByastID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { si1: vm.rp.si1, si2: vm.rp.si2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.ast1 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  function astID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "astID2.modal",
      controller: "ByastID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { si1: vm.rp.si1, si2: vm.rp.si2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.ast2 = result;
        vm.returned_date = undefined;
        vm.loan_date = undefined;
        vm.rp = {
          si1: vm.rp.si1,
          si2: vm.rp.si2,
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
          DATE1: null,
          DATE2: null,
        };
      },
      function () {}
    );
  }

  vm.loan_calendar = loan_calendar;
  vm.returned_calendar = returned_calendar;
  vm.loan_up = { opened: false };
  vm.returned_up = { opened: false };

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

BysiteID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function BysiteID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch_siteID1 = siteID1applyGlobalSearch;
  vm.click_siteID1 = siteID1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_siteID1",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_siteID1 = response.data.data;
      vm.table_siteID1 = new NgTableParams(
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

  function siteID1applyGlobalSearch() {
    let term_siteID1 = vm.globalSearchTerm_siteID1;
    vm.table_siteID1.filter({ $: term_siteID1 });
  }

  function siteID1(info) {
    $uibModalInstance.close(info);
  }
}

BysiteID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function BysiteID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch_siteID2 = siteID2applyGlobalSearch;
  vm.click_siteID2 = siteID2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_siteID2",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_siteID2 = response.data.data;
      vm.table_siteID2 = new NgTableParams(
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

  function siteID2applyGlobalSearch() {
    let term_siteID2 = vm.globalSearchTerm_siteID2;
    vm.table_siteID2.filter({ $: term_siteID2 });
  }

  function siteID2(info) {
    $uibModalInstance.close(info);
  }
}

ByastID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function ByastID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch_astID1 = astID1applyGlobalSearch;
  vm.click_astID1 = astID1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_astID1",
    it: {
      si1: items.si1 == null ? null : items.si1,
      si2: items.si2 == null ? null : items.si2,
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_astID1 = response.data.data;
      vm.table_astID1 = new NgTableParams(
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

  function astID1applyGlobalSearch() {
    let term_astID1 = vm.globalSearchTerm_astID1;
    vm.table_astID1.filter({ $: term_astID1 });
  }

  function astID1(info) {
    $uibModalInstance.close(info);
  }
}

ByastID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function ByastID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch_astID2 = astID2applyGlobalSearch;
  vm.click_astID2 = astID2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_astID2",
    it: {
      si1: items.si1 == null ? null : items.si1,
      si2: items.si2 == null ? null : items.si2,
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_astID2 = response.data.data;
      vm.table_astID2 = new NgTableParams(
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

  function astID2applyGlobalSearch() {
    let term_astID2 = vm.globalSearchTerm_astID2;
    vm.table_astID2.filter({ $: term_astID2 });
  }

  function astID2(info) {
    $uibModalInstance.close(info);
  }
}
