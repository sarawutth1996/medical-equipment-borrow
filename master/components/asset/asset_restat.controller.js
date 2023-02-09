angular
  .module("app.asset")
  .controller("asset_restatController", asset_restatController);

asset_restatController.$inject = [
  "$http",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function asset_restatController(
  $http,
  $rootScope,
  NgTableParams,
  alertService
) {
  let vm = this;
  const url = "api-url";
  vm.filter = [
    { id: "จำหน่าย", title: "จำหน่าย" },
    { id: "ชำรุด", title: "ชำรุด" },
  ];

  vm.applyGlobalSearch = applyGlobalSearch;
  vm.restat = restat;

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

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function restat(data) {
    alertService.confrim(
      "ต้องการคืนสถานะอุปกรณ์: " + data.id,
      function (value) {
        if (value) {
          let req = {
            auth: $rootScope.globals.auth,
            mod: "restat",
            it: {
              id: data.id,
              stat: data.ast_status === "จำหน่าย" ? "W" : "R",
            },
          };

          $rootScope.loading = true;
          $http.post(url, req).then(
            function (response) {
              if (response.data.status) {
                const dt = vm.table.settings().dataset.filter(function (val) {
                  return val.id !== data.id;
                });
                vm.table.settings().dataset = dt;
                vm.table.reload();
                alertService.success("คืนสถานะเรียบร้อย");
              } else {
                alertService.error("คืนสถานะล้มเหลว");
              }
              $rootScope.loading = false;
            },
            function (response) {
              console.error(response);
              $rootScope.loading = false;
            }
          );
        }
      }
    );
  }
}
