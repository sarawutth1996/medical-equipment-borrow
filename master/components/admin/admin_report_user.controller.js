angular
  .module("app.admin")
  .controller("admin_report_userController", admin_report_userController)
  .controller(
    "admin_report_userController_modal_prov",
    admin_report_userController_modal_prov
  )
  .controller(
    "admin_report_userController_modal_us",
    admin_report_userController_modal_us
  );

admin_report_userController.$inject = [
  "$http",
  "$rootScope",
  "$uibModal",
  "alertService",
  "$filter",
];
function admin_report_userController(
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
    us: null,
    us2: null,
  };

  vm.clear = clear;
  vm.print = print;
  vm.modal_prov = modal_prov;
  vm.modal_us = modal_us;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
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
    $rootScope.loading = true;
    const req = {
      auth: $rootScope.globals.auth,
      mod: "print",
      it: {
        prov:
          vm.data.prov === "" || vm.data.prov === undefined
            ? null
            : vm.data.prov,
        prov2:
          vm.data.prov2 === "" || vm.data.prov2 === undefined
            ? null
            : vm.data.prov2,
        us: vm.data.us === "" || vm.data.us === undefined ? null : vm.data.us,
        us2:
          vm.data.us2 === "" || vm.data.us2 === undefined ? null : vm.data.us2,
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
                text: "รายงานผู้ใช้ระบบ",
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

    data.data.forEach(function (row, index) {
      let headline = {
        bold: true,
        text: `จังหวัด ${row.name}  (หมดอายุ: ${row.exp_date})`,
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
              // return (i !== node.table.body.length) ? {dash: { length: 2, space: 1 }} : null;
              return { dash: { length: 2, space: 1 } };
            },
          },
          table: {
            headerRows: 2,
            widths: [30, 80, 80, "*", 60],
            body: [
              [{ colSpan: 5, bold: true, text: rowX.name }, "", "", "", ""],
              [
                { alignment: "center", bold: true, text: "ลำดับที่" },
                { alignment: "center", bold: true, text: "Username" },
                { alignment: "center", bold: true, text: "Password" },
                { alignment: "center", bold: true, text: "ชื่อ-นามสกุล" },
                { alignment: "center", bold: true, text: "วันที่ลงทะเบียน" },
              ],
            ],
          },
        };

        if (indexX !== 0) {
          framTB.margin = [0, 20, 0, 0];
        }

        rowX.data.forEach(function (rowY, indexY) {
          framTB.table.body.push([
            { alignment: "center", text: indexY + 1 },
            { text: rowY.user_name },
            { text: rowY.user_pass },
            { text: rowY.fullname },
            { alignment: "center", text: rowY.cdet },
          ]);
        });

        frame.content.push(framTB);
      });
    });

    pdfMake.createPdf(frame).open();
  }

  function modal_prov(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "admin_report_user-prov.modal",
      controller: "admin_report_userController_modal_prov",
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
        vm.data.us = null;
        vm.data.us2 = null;

        if (vm.data.prov !== null && vm.data.prov2 !== null) {
          $rootScope.loading = true;
          let req = {
            auth: $rootScope.globals.auth,
            mod: "userBET",
            it: {
              prov: vm.data.prov,
              prov2: vm.data.prov2 + "zzzz",
            },
          };

          $http.post(url, req).then(
            function (response) {
              vm.modal.us = response.data;
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

  function modal_us(key) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "admin_report_user-us.modal",
      controller: "admin_report_userController_modal_us",
      controllerAs: "vm",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal.us;
        },
      },
    });

    modal.result.then(
      function (result) {
        const yek = key === 1 ? "us" : "us2";
        vm.data[yek] = result;
      },
      function () {}
    );
  }
}

admin_report_userController_modal_prov.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function admin_report_userController_modal_prov(
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

admin_report_userController_modal_us.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function admin_report_userController_modal_us(
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
