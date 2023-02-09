angular.module("app").controller("settingController", settingController);

settingController.$inject = ["$rootScope", "$http", "alertService"];
function settingController($rootScope, $http, alertService) {
  let vm = this;
  const url = "api-url";
  vm.hide = {
    prof: true,
    pass: false,
  };
  vm.show_password = false;

  const oData = {
    prof: {
      fname: $rootScope.globals.profile.fname,
      lname: $rootScope.globals.profile.lname,
    },
    pass: { old: "", new1: "", new2: "" },
  };
  vm.data = angular.copy(oData);

  vm.clear = clear;
  vm.saveProf = saveProf;
  vm.savePass = savePass;

  //////////////////////////////////

  function clear(key) {
    vm.data[key] = angular.copy(oData[key]);
  }

  function saveProf() {
    const data = vm.data.prof;
    if (data.fname !== "" && data.lname !== "") {
      alertService.confrim("บันทึกข้อมูล ?", function (value) {
        if (value) {
          $rootScope.loading = true;
          let req = {
            auth: $rootScope.globals.auth,
            mod: "prof",
            it: data,
          };

          $http.post(url, req).then(
            function (response) {
              if (response.data.status) {
                $rootScope.globals.profile.fname = vm.data.prof.fname;
                $rootScope.globals.profile.lname = vm.data.prof.lname;
                oData.prof = {
                  fname: $rootScope.globals.profile.fname,
                  lname: $rootScope.globals.profile.lname,
                };
                alertService.success("บันทึกข้อมูลเรียบร้อย");
              } else {
                alertService.error("บันทึกข้อมูลล้มเหลว");
              }
              $rootScope.loading = false;
            },
            function (response) {
              console.error(response);
              $rootScope.loading = false;
            }
          );
        }
      });
    } else {
      alertService.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  }

  function savePass() {
    const data = vm.data.pass;
    if (data.old !== "" && data.new1 !== "" && data.new1 !== "") {
      if (data.new1 === data.new2) {
        alertService.confrim("บันทึกข้อมูล ?", function (value) {
          if (value) {
            $rootScope.loading = true;
            const req = {
              auth: $rootScope.globals.auth,
              mod: "chPW",
              it: {
                old: data.old,
                new: data.new1,
              },
            };

            $http.post(url, req).then(
              function (response) {
                if (response.data.status === "Yaa") {
                  clear("pass");
                  alertService.success("เปลี่ยนรหัสผ่านเรียบร้อย");
                } else {
                  const msg =
                    response.data.status === "noPW"
                      ? "รหัสผ่านเดิมไม่ถูกต้อง"
                      : "บันทึกข้อมูลล้มเหลว";
                  alertService.error(msg);
                }
                $rootScope.loading = false;
              },
              function (response) {
                console.error(response);
                $rootScope.loading = false;
              }
            );
          }
        });
      } else {
        alertService.warning("รหัสใหม่ไม่เหมือนกัน");
      }
    } else {
      alertService.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  }
}
