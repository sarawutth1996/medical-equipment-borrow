angular
  .module("app.record")
  .controller("report_signup_lendsController", report_signup_lendsController)
  .controller("provMID1Controller", provMID1Controller)
  .controller("provMID2Controller", provMID2Controller)
  .controller("aumpMID1Controller", aumpMID1Controller)
  .controller("aumpMID2Controller", aumpMID2Controller)
  .controller("siteID1Controller", siteID1Controller)
  .controller("siteID2Controller", siteID2Controller)
  .controller("caseID1Controller", caseID1Controller)
  .controller("caseID2Controller", caseID2Controller);

report_signup_lendsController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "alertService",
  "$filter",
];
function report_signup_lendsController(
  $http,
  $uibModal,
  $rootScope,
  alertService,
  $filter
) {
  const url = "api-url";
  let vm = this;
  vm.provID1 = provMID1;
  vm.provID2 = provMID2;
  vm.aumpID1 = aumpMID1;
  vm.aumpID2 = aumpMID2;
  vm.siteID1 = siteID1;
  vm.siteID2 = siteID2;
  vm.caseID1 = caseID1;
  vm.caseID2 = caseID2;

  vm.readPDF = readPDF;
  vm.clear = clear;

  vm.rp = {
    prov1: null,
    prov2: null,
    aump1: null,
    aump2: null,
    site1: null,
    site2: null,
    case1: null,
    case2: null,
  };

  vm.show = {
    prov: false,
    aump: false,
    site: false,
  };

  mainCase();
  function mainCase() {
    switch ($rootScope.globals.profile.role) {
      case "ROOT":
        vm.old_rp = {
          prov1: null,
          prov2: null,
          aump1: null,
          aump2: null,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
        break;
      case "CENTER":
        vm.old_rp = {
          prov1: null,
          prov2: null,
          aump1: null,
          aump2: null,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
        break;
      case "PROVINCE":
        vm.show.prov = true;
        vm.rp.prov1 = $rootScope.globals.profile.site.substr(0, 3);
        vm.rp.prov2 = $rootScope.globals.profile.site.substr(0, 3);
        vm.old_rp = {
          prov1: $rootScope.globals.profile.site.substr(0, 3),
          prov2: $rootScope.globals.profile.site.substr(0, 3),
          aump1: null,
          aump2: null,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
        break;
      case "DISTRICT":
        vm.show.prov = true;
        vm.show.aump = true;
        vm.rp.prov1 = $rootScope.globals.profile.site.substr(0, 3);
        vm.rp.prov2 = $rootScope.globals.profile.site.substr(0, 3);
        vm.rp.aump1 = $rootScope.globals.profile.site.substr(0, 5);
        vm.rp.aump2 = $rootScope.globals.profile.site.substr(0, 5);
        vm.rp.site1 = $rootScope.globals.profile.site;
        vm.rp.site2 = $rootScope.globals.profile.site;
        vm.old_rp = {
          prov1: $rootScope.globals.profile.site.substr(0, 3),
          prov2: $rootScope.globals.profile.site.substr(0, 3),
          aump1: $rootScope.globals.profile.site.substr(0, 5),
          aump2: $rootScope.globals.profile.site.substr(0, 5),
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
        break;
      case "SUB-DISTRICT":
        vm.show.prov = true;
        vm.show.aump = true;
        vm.show.site = true;
        vm.rp.prov1 = $rootScope.globals.profile.site.substr(0, 3);
        vm.rp.prov2 = $rootScope.globals.profile.site.substr(0, 3);
        vm.rp.aump1 = $rootScope.globals.profile.site.substr(0, 5);
        vm.rp.aump2 = $rootScope.globals.profile.site.substr(0, 5);
        vm.rp.site1 = $rootScope.globals.profile.site;
        vm.rp.site2 = $rootScope.globals.profile.site;
        vm.old_rp = {
          prov1: $rootScope.globals.profile.site.substr(0, 3),
          prov2: $rootScope.globals.profile.site.substr(0, 3),
          aump1: $rootScope.globals.profile.site.substr(0, 5),
          aump2: $rootScope.globals.profile.site.substr(0, 5),
          site1: $rootScope.globals.profile.site,
          site2: $rootScope.globals.profile.site,
          case1: null,
          case2: null,
        };
        break;
    }
  }

  function readPDF() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isRPprint",
      it: {
        prov1:
          vm.rp.prov1 === "" || vm.rp.prov1 === undefined ? null : vm.rp.prov1,
        prov2:
          vm.rp.prov2 === "" || vm.rp.prov2 === undefined ? null : vm.rp.prov2,
        aump1:
          vm.rp.aump1 === "" || vm.rp.aump1 === undefined ? null : vm.rp.aump1,
        aump2:
          vm.rp.aump2 === "" || vm.rp.aump2 === undefined ? null : vm.rp.aump2,
        site1:
          vm.rp.site1 === "" || vm.rp.site1 === undefined ? null : vm.rp.site1,
        site2:
          vm.rp.site2 === "" || vm.rp.site2 === undefined ? null : vm.rp.site2,
        case1:
          vm.rp.case1 === "" || vm.rp.case1 === undefined ? null : vm.rp.case1,
        case2:
          vm.rp.case2 === "" || vm.rp.case2 === undefined ? null : vm.rp.case2,
      },
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.dataset = response.data.data;
        if (response.data.status == true) {
          PDFdoc(vm.dataset);
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

  function PDFdoc(data) {
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
                text: "รายงานทะเบียนผู้มีสิทธิ์ยืม",
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
    data.forEach(function (row, index) {
      let headline = {
        bold: true,
        text: "จังหวัด " + row.name,
        margin: [2, 10, 0, 0],
        decoration: "underline",
      };
      if (index !== 0) {
        headline.pageBreak = "before";
      }
      frame.content.push(headline);
      row.data.forEach(function (rowX, indexX) {
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
            widths: [90, 90, 140, 60, 75, 70, 55, 50, "*"],
            body: [
              [
                { colSpan: 5, bold: true, text: rowX.name },
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
                { alignment: "center", bold: true, text: "รหัส" },
                { alignment: "center", bold: true, text: "รหัสบัตรประชาชน" },
                {
                  alignment: "center",
                  bold: true,
                  text: "ชื่อ-นามสกุล (ผู้มีสิทธิ์ยืม)",
                },
                { alignment: "center", bold: true, text: "ที่อยู่" },
                { alignment: "center", bold: true, text: "ตำบล" },
                { alignment: "center", bold: true, text: "อำเภอ" },
                { alignment: "center", bold: true, text: "รหัสไปรษณีย์" },
                { alignment: "center", bold: true, text: "โทรศัพท์" },
                { alignment: "center", bold: true, text: "ชื่อผู้ยืม" },
              ],
            ],
          },
        };
        if (indexX !== 0) {
          framTB.margin = [0, 20, 0, 0];
        }

        rowX.data.forEach(function (rowY, indexY) {
          // จำนวนคน
          let calls = [];
          let phones = [];
          rowY.ref.forEach(function (rowZ, indexZ) {
            // ญาติ
            calls.push(rowZ.name); // ชื่อญาติ
          });

          if (rowY.phone.length == 0) {
            phones.push("-");
          } else {
            rowY.phone.forEach(function (rowZ, indexZ) {
              // ญาติ
              phones.push(rowZ);
            });
          }

          framTB.table.body.push([
            { text: rowY.cmad_id, alignment: "center" },
            { text: rowY.cmad_citizen, alignment: "center" },
            { text: rowY.cmad_title + " " + rowY.cmad_name, alignment: "left" },
            { text: rowY.cmad_add_no, alignment: "center" }, //rowY.cmad_add_no
            { text: rowY.cmad_tumbol_name, alignment: "center" }, //rowY.cmad_tumbol_name
            { text: rowY.cmad_amphur_name, alignment: "center" }, //rowY.cmad_amphur_name
            { text: rowY.cmad_zip, alignment: "center" },
            { stack: phones, alignment: "center" },
            { stack: calls, alignment: "left" },
          ]);
        });

        frame.content.push(framTB);
      });
    });

    pdfMake.createPdf(frame).open();
  }

  function clear() {
    vm.rp = angular.copy(vm.old_rp);
  }

  function provMID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "provMID1.modal",
      controller: "provMID1Controller",
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
        vm.rp.prov1 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: null,
          aump2: null,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function provMID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "provMID2.modal",
      controller: "provMID2Controller",
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
        vm.rp.prov2 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: null,
          aump2: null,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function aumpMID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "aumpMID1.modal",
      controller: "aumpMID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { si1: vm.rp.prov1, si2: vm.rp.prov2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.aump1 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: vm.rp.aump1,
          aump2: vm.rp.aump2,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function aumpMID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "aumpMID2.modal",
      controller: "aumpMID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { si1: vm.rp.prov1, si2: vm.rp.prov2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.aump2 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: vm.rp.aump1,
          aump2: vm.rp.aump2,
          site1: null,
          site2: null,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function siteID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "siteID1.modal",
      controller: "siteID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { aump1: vm.rp.aump1, aump2: vm.rp.aump2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.site1 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: vm.rp.aump1,
          aump2: vm.rp.aump2,
          site1: vm.rp.site1,
          site2: vm.rp.site2,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function siteID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "siteID2.modal",
      controller: "siteID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { aump1: vm.rp.aump1, aump2: vm.rp.aump2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.site2 = result;
        vm.rp = {
          prov1: vm.rp.prov1,
          prov2: vm.rp.prov2,
          aump1: vm.rp.aump1,
          aump2: vm.rp.aump2,
          site1: vm.rp.site1,
          site2: vm.rp.site2,
          case1: null,
          case2: null,
        };
      },
      function () {}
    );
  }

  function caseID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "caseID1.modal",
      controller: "caseID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { site1: vm.rp.site1, site2: vm.rp.site2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.case1 = result;
      },
      function () {}
    );
  }

  function caseID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "caseID2.modal",
      controller: "caseID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return { site1: vm.rp.site1, site2: vm.rp.site2 };
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.case2 = result;
      },
      function () {}
    );
  }
}

provMID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function provMID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_prov1 = prov1applyGlobalSearch;
  vm.click_prov1 = prov1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_prov1",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_prov1 = response.data;
      vm.table_prov1 = new NgTableParams(
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

  function prov1applyGlobalSearch() {
    let term_prov1 = vm.globalSearchTerm_prov1;
    vm.table_prov1.filter({ $: term_prov1 });
  }

  function prov1(info) {
    $uibModalInstance.close(info);
  }
}

provMID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function provMID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_prov2 = prov2applyGlobalSearch;
  vm.click_prov2 = prov2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_prov2",
    it: items,
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_prov2 = response.data;
      vm.table_prov2 = new NgTableParams(
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

  function prov2applyGlobalSearch() {
    let term_prov2 = vm.globalSearchTerm_prov2;
    vm.table_prov2.filter({ $: term_prov2 });
  }

  function prov2(info) {
    $uibModalInstance.close(info);
  }
}

aumpMID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function aumpMID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_aump1 = aump1applyGlobalSearch;
  vm.click_aump1 = aump1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_aump1",
    it: {
      si1: items.si1 == null ? null : items.si1,
      si2: items.si2 == null ? null : items.si2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_aump1 = response.data;
      vm.table_aump1 = new NgTableParams(
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

  function aump1applyGlobalSearch() {
    let term_aump1 = vm.globalSearchTerm_aump1;
    vm.table_aump1.filter({ $: term_aump1 });
  }

  function aump1(info) {
    $uibModalInstance.close(info);
  }
}

aumpMID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function aumpMID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_aump2 = aump2applyGlobalSearch;
  vm.click_aump2 = aump2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_aump2",
    it: {
      si1: items.si1 == null ? null : items.si1,
      si2: items.si2 == null ? null : items.si2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_aump2 = response.data;
      vm.table_aump2 = new NgTableParams(
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

  function aump2applyGlobalSearch() {
    let term_aump2 = vm.globalSearchTerm_aump2;
    vm.table_aump2.filter({ $: term_aump2 });
  }

  function aump2(info) {
    $uibModalInstance.close(info);
  }
}

siteID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function siteID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_site1 = site1applyGlobalSearch;
  vm.click_site1 = site1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_site1",
    it: {
      aump1: items.aump1 == null ? null : items.aump1,
      aump2: items.aump2 == null ? null : items.aump2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_site1 = response.data;
      vm.table_site1 = new NgTableParams(
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

  function site1applyGlobalSearch() {
    let term_site1 = vm.globalSearchTerm_site1;
    vm.table_site1.filter({ $: term_site1 });
  }

  function site1(info) {
    $uibModalInstance.close(info);
  }
}

siteID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function siteID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_site2 = site2applyGlobalSearch;
  vm.click_site2 = site2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_site2",
    it: {
      aump1: items.aump1 == null ? null : items.aump1,
      aump2: items.aump2 == null ? null : items.aump2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_site2 = response.data;
      vm.table_site2 = new NgTableParams(
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

  function site2applyGlobalSearch() {
    let term_site2 = vm.globalSearchTerm_site2;
    vm.table_site2.filter({ $: term_site2 });
  }

  function site2(info) {
    $uibModalInstance.close(info);
  }
}

caseID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function caseID1Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_case1 = case1applyGlobalSearch;
  vm.click_case1 = case1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_case1",
    it: {
      case1: items.site1 == null ? null : items.site1,
      case2: items.site2 == null ? null : items.site2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_case1 = response.data;
      vm.table_case1 = new NgTableParams(
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

  function case1applyGlobalSearch() {
    let term_case1 = vm.globalSearchTerm_case1;
    vm.table_case1.filter({ $: term_case1 });
  }

  function case1(info) {
    $uibModalInstance.close(info);
  }
}

caseID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function caseID2Controller(
  NgTableParams,
  $uibModalInstance,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_case2 = case2applyGlobalSearch;
  vm.click_case2 = case2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isRP_case2",
    it: {
      case1: items.site1 == null ? null : items.site1,
      case2: items.site2 == null ? null : items.site2 + "zzzz",
    },
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_case2 = response.data;
      vm.table_case2 = new NgTableParams(
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

  function case2applyGlobalSearch() {
    let term_case2 = vm.globalSearchTerm_case2;
    vm.table_case2.filter({ $: term_case2 });
  }

  function case2(info) {
    $uibModalInstance.close(info);
  }
}
