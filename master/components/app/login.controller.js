angular
  .module("app")
  .controller("loginController", loginController)
  .controller("loginController_modal_si", loginController_modal_si);

loginController.$inject = [
  "$http",
  "$state",
  "coreService",
  "$uibModal",
  "$rootScope",
  "alertService",
];
function loginController(
  $http,
  $state,
  coreService,
  $uibModal,
  $rootScope,
  alertService
) {
  const url = "api-url";
  let vm = this;

  vm.checkValid = checkValid;
  vm.modal_si = modal_si;
  vm.login = login;

  ////////////////////////

  fristLook();
  function fristLook() {
    $rootScope.loading = true;
    let req = { mod: "main" };
    $http.post(url, req).then(
      function (response) {
        vm.modal = response.data;
        $rootScope.loading = false;
      },
      function (response) {
        console.error(response);
        $rootScope.loading = false;
      }
    );
  }

  function checkValid(b1, b2) {
    let cl = "";
    if (b1) {
      switch (!b2) {
        case true:
          cl = "border-valid";
          break;
        case false:
          cl = "border-invalid";
          break;
      }
    }

    return cl;
  }

  function modal_si() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "login-si.modal",
      controller: "loginController_modal_si",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.modal;
        },
      },
    });

    modal.result.then(
      function (result) {
        vm.site = result.si_site;
        vm.mite = result.si_desc;
      },
      function () {}
    );
  }

  function login() {
    let req = {
      mod: "login",
      it: {
        us: vm.user,
        pw: vm.pass,
        st: vm.site,
      },
    };

    $http.post(url, req).then(
      function (response) {
        const stat = response.data.status;
        if (stat === "Okkk" || stat === "warnExp") {
          coreService.set(response.data.keep);

          if (stat === "Okkk") {
            $state.go("app.home");
          } else {
            const msg = `<span style="font-size: 14px;">หมดอายุการใช้งานในอีก <u class="text-red">${response.data.exp}</u> วัน</span>`;
            alertService.confrim_warnning_html(msg, function (value) {
              if (value) {
                $state.go("app.home");
              }
            });
          }
        } else {
          let msg;
          switch (stat) {
            case "falUP":
              msg = "Username, Password หรือสถานที่ไม่ถูกต้อง";
              break;
            case "noACT":
              msg = "User ถูกระงับการใช้งาน";
              break;
            case "expDat":
              msg = "หมดอายุการใช้งาน กรุณาติดต่อผู้ดูแลระบบ";
              break;
          }
          alertService.error(msg);
        }
      },
      function (response) {
        console.error(response);
      }
    );
  }
}

loginController_modal_si.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
];
function loginController_modal_si($uibModalInstance, NgTableParams, items) {
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
