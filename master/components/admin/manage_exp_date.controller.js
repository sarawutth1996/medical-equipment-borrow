angular
  .module("app.admin")
  .controller("manage_exp_dateController", manage_exp_dateController)
  .controller(
    "manage_exp_dateController_modal_edit",
    manage_exp_dateController_modal_edit
  );

manage_exp_dateController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
  "$filter",
];
function manage_exp_dateController(
  $http,
  $uibModal,
  $rootScope,
  NgTableParams,
  alertService,
  $filter
) {
  let vm = this;
  const url = "api-url";

  vm.applyGlobalSearch = applyGlobalSearch;
  vm.edit = edit;

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
        vm.table = new NgTableParams(
          {},
          {
            dataset: response.data,
          }
        );
        $rootScope.loading = false;
      },
      function (response) {
        console.error(response);
        $rootScope.loading = false;
      }
    );
  }

  function reload(data) {
    vm.table.settings().dataset = data;
    vm.table.reload();
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function edit(data) {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "manage_exp_date-EDIT.modal",
      controller: "manage_exp_dateController_modal_edit",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return data;
        },
      },
    });

    modal.result.then(
      function (result) {
        $rootScope.loading = true;
        let req = {
          auth: $rootScope.globals.auth,
          mod: "edit",
          it: {
            id: data.id,
            dat: $filter("date")(result, "yyyy/MM/dd"),
          },
        };

        $http.post("server/models/manage_exp_date.php", req).then(
          function (response) {
            if (response.data.status) {
              alertService.success("บันทึกข้อมูลเรียบร้อย");
              reload(response.data.data);
            } else {
              alertService.success("ไม่สามารถบันทึกข้อมูลได้");
            }

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
}

manage_exp_dateController_modal_edit.$inject = [
  "$uibModalInstance",
  "items",
  "alertService",
];
function manage_exp_dateController_modal_edit(
  $uibModalInstance,
  items,
  alertService
) {
  let vm = this;
  vm.data = {
    id: items.id,
    name: items.name,
    dat: items.dat !== null ? new Date(items.dat) : null,
  };

  vm.click = function () {
    alertService.confrim("เปลี่ยงแปลงวันหมดอายุ ?", function (value) {
      if (value) {
        $uibModalInstance.close(vm.data.dat);
      }
    });
  };
}
