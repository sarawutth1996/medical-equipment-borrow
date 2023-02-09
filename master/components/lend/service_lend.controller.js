angular
  .module("app.lend")
  .controller("service_lendController", service_lendController)
  .controller("service_find_astController", service_find_astController)
  .controller("service_lend_addListController", service_lend_addListController)
  .controller(
    "service_returnedItemsController",
    service_returnedItemsController
  )
  .controller("MDselList_AController", MDselList_AController)
  .controller("MDselList_BController", MDselList_BController)
  .controller("MDselList_CController", MDselList_CController)
  .controller("MDselList_itemsController", MDselList_itemsController)
  .controller("SETreturned_uploadController", SETreturned_uploadController)
  .controller("SETuploadController", SETuploadController)
  .controller("MDshowIMGController", MDshowIMGController)
  .controller("find_astMID1Controller", find_astMID1Controller)
  .controller("find_astMID2Controller", find_astMID2Controller)
  .controller("find_provMID1Controller", find_provMID1Controller)
  .controller("find_provMID2Controller", find_provMID2Controller)
  .controller("find_aumpMID1Controller", find_aumpMID1Controller)
  .controller("find_aumpMID2Controller", find_aumpMID2Controller)
  .controller("find_siteID1Controller", find_siteID1Controller)
  .controller("find_siteID2Controller", find_siteID2Controller)
  .controller(
    "service_lend_renew_expController",
    service_lend_renew_expController
  );

service_lendController.$inject = [
  "$timeout",
  "$q",
  "$http",
  "$uibModal",
  "alertService",
  "$filter",
  "$rootScope",
  "$scope",
  "$state",
];
function service_lendController(
  $timeout,
  $q,
  $http,
  $uibModal,
  alertService,
  $filter,
  $rootScope,
  $scope,
  $state
) {
  const url = "api-url";
  let vm = this;
  $rootScope.keyNbr = " ";
  vm.selList_A = MDselList_A;
  vm.selList_B = MDselList_B;
  vm.selList_C = MDselList_C;
  vm.selList_items = MDselList_items;
  vm.delItems = delItems;
  vm.reVals = reset;
  vm.showIMG = MDshowIMG;
  vm.ActiveTabs = ActiveTabs;
  vm.Tabs = Tabs;
  vm.loan_calendar = loan_calendar;
  vm.returned_calendar = returned_calendar;
  vm.total = sum;
  vm.clear = clear;
  vm.save = save;

  vm.blurInputDep = blurInputDep;
  vm.loop_calendar = loopIndex_calendar;
  //---------------------
  vm.valvCHK_A = false;
  //---------------------
  vm.disableKEy_step2 = true;
  vm.disableKEy_step3 = true;
  //---------------------
  vm.select_items = [];
  vm.loop_up = [];
  vm.loop_date = [];
  vm.dep = [];
  vm.array_pic = [];
  //---------------------
  vm.dataA = {
    id: "",
    fullname: "",
    Hn: "",
    Ward: "",
    address: "",
    tel: "",
    tel2: "",
    card: "",
  };

  vm.dataB = {
    id: "",
    fullname: "",
    address: "",
    tel: "",
    tel2: "",
    conn: "",
    card: "",
  };

  vm.dataC = {
    id: "",
    fullname: "",
    address: "",
    tel: "",
    tel2: "",
    pos: "",
    attn: "",
    card: "",
  };

  vm.dua_date = {
    loan_date: "",
    returned_date: "",
  };

  let Copy_DataA = {
    id: "",
    fullname: "",
    Hn: "",
    Ward: "",
    address: "",
    tel: "",
    tel2: "",
    card: "",
  };

  let Copy_DataB = {
    id: "",
    fullname: "",
    address: "",
    tel: "",
    tel2: "",
    conn: "",
    card: "",
  };

  let Copy_DataC = {
    id: "",
    fullname: "",
    address: "",
    tel: "",
    tel2: "",
    pos: "",
    attn: "",
    card: "",
  };
  //---------------------

  fristLook();
  function fristLook() {
    // Load Config
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isConfig",
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.config = response.data.SITE[0].SI_DESC;
        if (
          response.data.SITE[0].SI__CHR01 == undefined ||
          response.data.SITE[0].SI__CHR01 == ""
        ) {
          vm.comp_tel = "-";
        } else {
          vm.comp_tel = response.data.SITE[0].SI__CHR01;
        }
        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function renderPDF(url, canvasContainer, options) {
    // Render Preview
    options = options || { scale: 1.4 };

    $("canvas").remove();

    function renderPage(page) {
      var viewport = page.getViewport(options.scale);
      var wrapper = document.createElement("div");
      wrapper.className = "canvas-wrapper";
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      wrapper.appendChild(canvas);

      canvasContainer.appendChild(wrapper);

      page.render(renderContext);
    }

    function renderPages(pdfDoc) {
      for (var num = 1; num <= pdfDoc.numPages; num++)
        pdfDoc.getPage(num).then(renderPage);
    }

    const PDFJS = window["pdfjs-dist/build/pdf"];
    PDFJS.disableWorker = false;
    PDFJS.getDocument(url).then(renderPages);
  }

  function MDselList_A() {
    // เลือกผู้มีสิทธิ์ยืม
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "MDselList_A.modal",
      controller: "MDselList_AController",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: { items: function () {} },
    });

    modal.result.then(
      function (result) {
        let res = result;
        let zone = res.CMAD_CITY == "กรุงเทพมหานคร" ? "Yes" : "No";
        if (zone != "Yes") {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "ตำบล" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != ""
              ? "อำเภอ" + res.CMAD_AMPHUR_NAME + "   "
              : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataA.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        } else {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "แขวง" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != "" ? res.CMAD_AMPHUR_NAME + "   " : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataA.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        }

        vm.dataA.id = res.CMAD_ID;
        vm.dataA.fullname = res.CMAD_TITLE + " " + res.CMAD_NAME;
        vm.dataA.Hn = res.CMAD_HN;
        vm.dataA.Ward = res.CMAD_WARD;
        vm.dataA.tel = res.CMAD_PHONE;
        vm.dataA.tel2 = res.CMAD_PHONE2;
        vm.dataA.card = res.CMAD_CITIZEN;
        vm.dataA.tel =
          vm.dataA.tel == "" || vm.dataA.tel == undefined ? "-" : vm.dataA.tel;
        vm.dataA.tel2 =
          vm.dataA.tel2 == "" || vm.dataA.tel2 == undefined
            ? "-"
            : vm.dataA.tel2;

        //-- Clear
        vm.dataB = angular.copy(Copy_DataB);
        vm.dataC = angular.copy(Copy_DataC);
        vm.select_items = [];
        vm.loop_date = [];
        vm.dep = [];
        vm.returned_date = undefined;

        //-- ActiveTabs
        vm.valvCHK_A = true;
        if (vm.valvCHK_A == true) {
          vm.disableKEy_step2 = false;
        } else {
          vm.disableKEy_step2 = true;
        }
      },
      function () {}
    );
  }

  function MDselList_B() {
    // เลือกผู้ยืม
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "MDselList_B.modal",
      controller: "MDselList_BController",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.dataA.id;
        },
      },
    });

    modal.result.then(
      function (result) {
        let res = result;
        let zone2 = res.CMAD_CITY == "กรุงเทพมหานคร" ? "Yes" : "No";
        if (zone2 != "Yes") {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "ตำบล" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != ""
              ? "อำเภอ" + res.CMAD_AMPHUR_NAME + "   "
              : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataB.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        } else {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "แขวง" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != "" ? res.CMAD_AMPHUR_NAME + "   " : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataB.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        }
        vm.dataB.id = res.CMAD_ID;
        vm.dataB.fullname = res.CMAD_TITLE + " " + res.CMAD_NAME;
        vm.dataB.tel = res.CMAD_PHONE;
        vm.dataB.tel2 = res.CMAD_PHONE2;
        vm.dataB.conn = res.CMAD_RLTS;
        vm.dataB.card = res.CMAD_CITIZEN;
        vm.dataB.conn =
          vm.dataB.conn == "" || vm.dataB.conn == undefined
            ? "-"
            : vm.dataB.conn;
        vm.dataB.tel =
          vm.dataB.tel == "" || vm.dataB.tel == undefined ? "-" : vm.dataB.tel;
        vm.dataB.tel2 =
          vm.dataB.tel2 == "" || vm.dataB.tel2 == undefined
            ? "-"
            : vm.dataB.tel2;
      },
      function () {}
    );
  }

  function MDselList_C() {
    // เลือกผู้รับรอง
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "MDselList_C.modal",
      controller: "MDselList_CController",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.dataA.id;
        },
      },
    });

    modal.result.then(
      function (result) {
        let res = result;
        let zone3 = res.CMAD_CITY == "กรุงเทพมหานคร" ? "Yes" : "No";
        if (zone3 != "Yes") {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "ตำบล" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != ""
              ? "อำเภอ" + res.CMAD_AMPHUR_NAME + "   "
              : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataC.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        } else {
          let pt1_adL1 =
            res.CMAD_ADD_NO != ""
              ? "เลขที่" + " " + res.CMAD_ADD_NO + "   "
              : "";
          let pt1_adL2 =
            res.CMAD_MOO_NO != "" ? "หมู่" + " " + res.CMAD_MOO_NO + "   " : "";
          let pt1_adL3 =
            res.CMAD_MOO_NAME != ""
              ? "หมู่บ้าน" + " " + res.CMAD_MOO_NAME + "   "
              : "";
          let pt1_adL4 =
            res.CMAD_ROOM_NO != ""
              ? "ห้องเลขที่" + " " + res.CMAD_ROOM_NO + "   "
              : "";
          let pt1_adL5 =
            res.CMAD_FLOOR_NAME != ""
              ? "ชั้นที่" + " " + res.CMAD_FLOOR_NAME + "   "
              : "";
          let pt1_adL6 =
            res.CMAD_BUILD_NAME != ""
              ? "อาคาร" + " " + res.CMAD_BUILD_NAME + "   "
              : "";
          let pt1_adL7 =
            res.CMAD_TROK_SOI != ""
              ? "ตรอก/ซอย" + " " + res.CMAD_TROK_SOI + "   "
              : "";
          let pt1_adL8 =
            res.CMAD_STREET != "" ? "ถนน" + " " + res.CMAD_STREET + "   " : "";
          let pt1_adL9 =
            res.CMAD_TUMBOL_NAME != ""
              ? "แขวง" + res.CMAD_TUMBOL_NAME + "   "
              : "";
          let pt1_adL10 =
            res.CMAD_AMPHUR_NAME != "" ? res.CMAD_AMPHUR_NAME + "   " : "";
          let pt1_adL11 =
            res.CMAD_CITY != "" ? "จังหวัด" + res.CMAD_CITY + "   " : "";
          let pt1_adL12 = res.CMAD_ZIP != "" ? res.CMAD_ZIP : "";

          vm.dataC.address =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        }
        vm.dataC.id = res.CMAD_ID;
        vm.dataC.fullname = res.CMAD_TITLE + " " + res.CMAD_NAME;
        vm.dataC.tel = res.CMAD_PHONE;
        vm.dataC.tel2 = res.CMAD_PHONE2;
        vm.dataC.pos = res.CMAD_POS;
        vm.dataC.attn = res.CMAD_ATTN;
        vm.dataC.card = res.CMAD_CITIZEN;
        vm.dataC.pos =
          vm.dataC.pos == "" || vm.dataC.pos == undefined ? "-" : vm.dataC.pos;
        vm.dataC.tel =
          vm.dataC.tel == "" || vm.dataC.tel == undefined ? "-" : vm.dataC.tel;
        vm.dataC.tel2 =
          vm.dataC.tel2 == "" || vm.dataC.tel2 == undefined
            ? "-"
            : vm.dataC.tel2;
        vm.dataC.attn =
          vm.dataC.attn == "" || vm.dataC.attn == undefined
            ? "-"
            : vm.dataC.attn;
      },
      function () {}
    );
  }

  function MDselList_items() {
    // เลือกทรัพย์สิน
    if (vm.loan_date != undefined && vm.returned_date != undefined) {
      let modal = $uibModal.open({
        animation: true,
        templateUrl: "MDselList_items.modal",
        controller: "MDselList_itemsController",
        controllerAs: "vm",
        size: "lg",
        backdropClass: "backdrop",
        resolve: {
          items: function () {},
        },
      });

      modal.result.then(
        function (result) {
          let req = {
            auth: $rootScope.globals.auth,
            mod: "isChkItems",
            it: {
              type: result.AST_TYPE,
              case: vm.dataA.id,
            },
          };

          $http.post(url, req).then(
            function (response) {
              let dateLng = response.data.date;
              if (dateLng.length != 0) {
                let sys_Date = new Date();
                let loanDate = new Date(dateLng[0].DATE);
                if (sys_Date < loanDate) {
                  // ยืมไม่ได้ภายใน 5 ปี หรือ ต้องคืนก่อน
                  let res = result;
                  vm.oldMD_type = [];
                  vm.oldMD_id = [];
                  let newMD_type = result.AST_TYPE;
                  let newMD_id = result.AST_ASSET;
                  for (let i = 0; i < vm.select_items.length; i++) {
                    vm.oldMD_type.push(vm.select_items[i].AST_TYPE);
                    vm.oldMD_id.push(vm.select_items[i].AST_ASSET);
                  }

                  if (
                    vm.oldMD_id.includes(newMD_id) &&
                    vm.oldMD_type.includes(newMD_type)
                  ) {
                    alertService.warning("แจ้งเตือน!! หมวด/รหัสอุปกรณ์ (ซ้ำ)");
                  } else {
                    alertService.warning(
                      "แจ้งเตือน!! ไม่สามารถยืมอุปกรณ์หมวดเดียวกันได้ ภายใน 5 ปี"
                    );
                    vm.select_items.push(res);
                    vm.array_pic.push({ pic: "dist/img/logo/img.png" });
                    vm.loop_up.push({ opened: false });
                    vm.loop_date.push(vm.returned_date);
                    vm.dep.push(0);
                    for (let i = 0; i < vm.select_items.length; i++) {
                      angular.merge(vm.select_items[i], {
                        AST_PIC: vm.array_pic[i].pic,
                      });
                    }
                  }
                } else if (sys_Date > loanDate) {
                  // เลยกำหนด 5 ปีแล้วแต่ ยังไมไ่ด้ "คืน"
                  let res = result;
                  vm.oldMD_type = [];
                  vm.oldMD_id = [];
                  let newMD_type = result.AST_TYPE;
                  let newMD_id = result.AST_ASSET;
                  for (let i = 0; i < vm.select_items.length; i++) {
                    vm.oldMD_type.push(vm.select_items[i].AST_TYPE);
                    vm.oldMD_id.push(vm.select_items[i].AST_ASSET);
                  }

                  if (
                    vm.oldMD_id.includes(newMD_id) &&
                    vm.oldMD_type.includes(newMD_type)
                  ) {
                    alertService.warning("แจ้งเตือน!! หมวด/รหัสอุปกรณ์ (ซ้ำ)");
                  } else {
                    alertService.warning(
                      "แจ้งเตือน!! ไม่สามารถยืมอุปกรณ์หมวดเดียวกันได้ / ผู้ยืม ได้มีการยืมอุปกรณ์หมวดนี้เกิน 5 ปี"
                    );
                    vm.select_items.push(res);
                    vm.array_pic.push({ pic: "dist/img/logo/img.png" });
                    vm.loop_up.push({ opened: false });
                    vm.loop_date.push(vm.returned_date);
                    vm.dep.push(0);
                    for (let i = 0; i < vm.select_items.length; i++) {
                      angular.merge(vm.select_items[i], {
                        AST_PIC: vm.array_pic[i].pic,
                      });
                    }
                  }
                }
              } else {
                vm.oldMD_type = [];
                vm.oldMD_id = [];
                let res = result;
                let newMD_type = result.AST_TYPE;
                let newMD_id = result.AST_ASSET;
                for (let i = 0; i < vm.select_items.length; i++) {
                  vm.oldMD_type.push(vm.select_items[i].AST_TYPE);
                  vm.oldMD_id.push(vm.select_items[i].AST_ASSET);
                }

                if (
                  vm.oldMD_id.includes(newMD_id) &&
                  vm.oldMD_type.includes(newMD_type)
                ) {
                  alertService.warning("แจ้งเตือน!! หมวด/รหัสอุปกรณ์ (ซ้ำ)");
                } else {
                  vm.select_items.push(res);
                  vm.array_pic.push({ pic: "dist/img/logo/img.png" });
                  vm.loop_up.push({ opened: false });
                  vm.loop_date.push(vm.returned_date);
                  vm.dep.push(0);
                  for (let i = 0; i < vm.select_items.length; i++) {
                    angular.merge(vm.select_items[i], {
                      AST_PIC: vm.array_pic[i].pic,
                    });
                  }
                }
              }

              $rootScope.loading = false;
            },
            function (response) {
              $rootScope.loading = false;
            }
          );
        },
        function () {}
      );
    } else {
      alertService.warning(
        "กรุณากรอก วันที่ยืม/กำหนดคืน และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
      );
    }
  }

  function MDshowIMG(pic) {
    if (pic != "dist/img/logo/img.png") {
      let modal = $uibModal.open({
        animation: true,
        templateUrl: "MDshowIMG.modal",
        controller: "MDshowIMGController",
        controllerAs: "vm",
        size: "md",
        backdropClass: "backdrop",
        resolve: {
          items: function () {
            return pic;
          },
        },
      });

      modal.result.then(
        function (result) {},
        function () {}
      );
    }
  }

  function ActiveTabs(key) {
    // เงื่อนไขการเปลี่ยน Tabs
    if (vm.active != 2) {
      if (key == 2) {
        if (vm.valvCHK_A == true) {
          if (vm.active != 3) {
            vm.active = 2;
            vm.lcount = 0;
            vm.disableKEy_step2 = false;
            vm.disableKEy_step3 = true;
          }
        } else {
          alertService.warning("กรุณาเลือกข้อมูลให้ครบ ก่อนไปหน้าถัดไป");
        }
      } else {
        if (key == 1) {
          if (vm.active > 1) {
            vm.active = vm.active - 1;
            vm.lcount = 0;
            vm.disableKEy_step3 = true;
          }
        }
      }
    } else if (key == 1) {
      vm.active = vm.active - 1;
      vm.lcount = 0;
      vm.disableKEy_step3 = true;
    } else if (vm.active == 2) {
      if (vm.loan_date != undefined && vm.returned_date != undefined) {
        if (vm.select_items.length > 0) {
          vm.active = 3;

          for (let i = 0; i < vm.select_items.length; i++) {
            let date_obj = $filter("date")(vm.loop_date[i], "dd/MM/yyyy");
            let str_obj = date_obj;
            let tree_obj = str_obj.split("/");
            let res_obj = Number(tree_obj[2]) + 543;
            let ans_obj = tree_obj[0] + "/" + tree_obj[1] + "/" + res_obj;
            angular.merge(vm.select_items[i], { AST_DATE: ans_obj });
            angular.merge(vm.select_items[i], { AST_DEPOSIT: vm.dep[i] });
          }

          let A_format = $filter("date")(vm.loan_date, "dd/MM/yyyy");
          let B_format = $filter("date")(vm.returned_date, "dd/MM/yyyy");

          let str_A = A_format;
          let tree_A = str_A.split("/");
          let res_A = Number(tree_A[2]) + 543;
          let A = tree_A[0] + "/" + tree_A[1] + "/" + res_A;

          let str_B = B_format;
          let tree_B = str_B.split("/");
          let res_B = Number(tree_B[2]) + 543;
          let B = tree_B[0] + "/" + tree_B[1] + "/" + res_B;

          docDefinition = {
            defaultStyle: {
              font: "angsanaUPC",
              fontSize: 16,
              columnGap: 10,
            },
            pageSize: "A4",
            pageMargins: [50, 25, 50, 50],
            styles: {
              title: { fontSize: 24, alignment: "center" },
              titleSub: { fontSize: 18, alignment: "center" },
              titleDate: { fontSize: 14, alignment: "left", bold: true },
              content: { fontSize: 14, alignment: "left", bold: true },
              subcontent: { fontSize: 14, alignment: "center" },
              list: { fontSize: 14, alignment: "center" },
              tableExample: {
                margin: [0, 0, 0, 0],
              },
              tableHeader: { fontSize: 16, alignment: "center", bold: true },
              tablebody: { fontSize: 14, alignment: "center" },
            },
            content: [
              {
                columns: [
                  { text: "ใบยืมอุปกรณ์\n\n", style: "title", width: "*" },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "หน่วยงาน", style: "content", width: 40 },
                  {
                    text: vm.config,
                    style: "subcontent",
                    width: 323,
                    alignment: "left",
                  },
                  {
                    text: "วันที่ยืม",
                    style: "content",
                    width: 57,
                    alignment: "right",
                  },
                  {
                    text: A,
                    style: "subcontent",
                    width: "auto",
                    alignment: "right",
                  },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "เบอร์โทรศัพท์", style: "content", width: 55 },
                  {
                    text: vm.comp_tel,
                    style: "subcontent",
                    width: 320,
                    alignment: "left",
                  },
                  {
                    text: "กำหนดคืน\n\n",
                    style: "content",
                    width: 45,
                    alignment: "right",
                  },
                  {
                    text: B,
                    style: "subcontent",
                    width: "auto",
                    alignment: "right",
                  },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ผู้มีสิทธิ์ยืม", style: "content", width: "auto" },
                  {
                    text: vm.dataA.fullname,
                    style: "subcontent",
                    width: 125,
                    alignment: "left",
                  },
                  {
                    text: "รหัสบัตรประชาชน",
                    style: "content",
                    width: 75,
                    alignment: "left",
                  },
                  {
                    text: vm.dataA.card,
                    style: "subcontent",
                    width: 100,
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                  {
                    text: vm.dataA.tel,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ที่อยู่", style: "content", width: 40 },
                  {
                    text: vm.dataA.address,
                    width: 321,
                    style: "subcontent",
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                  {
                    text: vm.dataA.tel2,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 2,
                columns: [
                  {
                    text: "Hn",
                    style: "content",
                    width: 40,
                    alignment: "left",
                  },
                  {
                    text: vm.dataA.Hn,
                    style: "subcontent",
                    width: 125,
                    alignment: "left",
                  },
                  { text: "Ward", style: "content", width: "auto" },
                  {
                    text: vm.dataA.Ward,
                    style: "subcontent",
                    width: "*",
                    alignment: "left",
                  },
                ],
              },
            ],
          };

          if (vm.dataB.id != "") {
            let data2 = [
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ผู้ยืม", style: "content", width: 40 },
                  {
                    text: vm.dataB.fullname,
                    style: "subcontent",
                    width: 125,
                    alignment: "left",
                  },
                  {
                    text: "รหัสบัตรประชาชน",
                    style: "content",
                    width: 76,
                    alignment: "left",
                  },
                  {
                    text: vm.dataB.card,
                    style: "subcontent",
                    width: 100,
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                  {
                    text: vm.dataB.tel,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ที่อยู่", style: "content", width: 40 },
                  {
                    text: vm.dataB.address,
                    width: 321,
                    style: "subcontent",
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                  {
                    text: vm.dataB.tel2,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 2,
                columns: [
                  {
                    text: "เกี่ยวข้องกับผู้มีสิทธิ์ยืม",
                    style: "content",
                    width: 90,
                    alignment: "left",
                  },
                  {
                    text: vm.dataB.conn,
                    style: "subcontent",
                    width: "*",
                    alignment: "left",
                  },
                ],
              },
            ];

            docDefinition.content = docDefinition.content.concat(data2);
          }

          if (vm.dataC.id != "") {
            let data3 = [
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ผู้รับรอง", style: "content", width: 40 },
                  {
                    text: vm.dataC.fullname,
                    style: "subcontent",
                    width: 321,
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                  {
                    text: vm.dataC.tel,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 1.2,
                columns: [
                  { text: "ที่อยู่", style: "content", width: 40 },
                  {
                    text: vm.dataC.address,
                    width: 321,
                    style: "subcontent",
                    alignment: "left",
                  },
                  { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                  {
                    text: vm.dataC.tel2,
                    style: "subcontent",
                    width: "auto",
                    alignment: "center",
                  },
                ],
              },
              {
                lineHeight: 2,
                columns: [
                  {
                    text: "ตำแหน่ง",
                    style: "content",
                    width: 40,
                    alignment: "left",
                  },
                  {
                    text: vm.dataC.pos,
                    style: "subcontent",
                    width: 125,
                    alignment: "left",
                  },
                  {
                    text: "สังกัด",
                    style: "content",
                    width: 30,
                    alignment: "left",
                  },
                  {
                    text: vm.dataC.attn,
                    style: "subcontent",
                    width: 260,
                    alignment: "left",
                  },
                ],
              },
            ];

            docDefinition.content = docDefinition.content.concat(data3);
          }
          // Head Table
          docDefinition.content.push({
            lineHeight: 1.5,
            columns: [
              {
                text: "รายการอุปกรณ์ที่ต้องการยืมมีดังนี้",
                style: "content",
                width: "auto",
              },
            ],
          });

          let table = {
            style: "tableExample",
            table: {
              widths: [70, 125, 112, 35, 40, 50],
              headerRows: 1,
              body: [
                [
                  { text: "รหัสอุปกรณ์", style: "tableHeader" },
                  { text: "รายละเอียด", style: "tableHeader" },
                  { text: "เลขที่ครุภัณฑ์", style: "tableHeader" },
                  { text: "จำนวน", style: "tableHeader" },
                  { text: "เงินมัดจำ", style: "tableHeader" },
                  { text: "กำหนดคืน", style: "tableHeader" },
                ],
              ],
            },
            layout: "headerLineOnly",
          };

          let qty = 0;
          let totaldepositi = 0;
          let depositi = 0;
          vm.select_items.forEach(function (row, index) {
            let array = [
              { text: row.AST_ASSET, style: "tablebody" },
              { text: row.AST_DESC, alignment: "left", style: "tablebody" },
              { text: row.AST_INV_NBR, style: "tablebody" },
              { text: 1, style: "tablebody" },
              {
                text: $filter("number")(row.AST_DEPOSIT, 2),
                alignment: "right",
                style: "tablebody",
              },
              { text: row.AST_DATE, style: "tablebody" },
            ];
            table.table.body.push(array);
            depositi += parseFloat(row.AST_DEPOSIT);
          });

          qty += vm.select_items.length;
          totaldepositi += depositi;

          docDefinition.content.push(table);

          docDefinition.content.push({
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
              widths: [266, 75, 23, 54, 46, 0],
              body: [
                [
                  { text: "", border: [false, false, false, false] },
                  { text: "รวม", alignment: "left", style: "tablebody" },
                  {
                    text: $filter("number")(qty),
                    alignment: "center",
                    style: "tablebody",
                  },
                  {
                    text: $filter("number")(totaldepositi, 2),
                    alignment: "right",
                    style: "tablebody",
                  },
                  "",
                  "",
                ],
                [
                  { text: "", border: [false, false, false, false] },
                  "",
                  "",
                  "",
                  "",
                  "",
                ],
              ],
            },
          });

          let footers = [
            {
              absolutePosition: { x: 50, y: 700 },
              lineHeight: 2.0,
              columns: [
                {
                  text: "ผู้มีสิทธิ์ยืมอุปกรณ์............................................(......./......./.......)",
                  style: "content",
                  width: "auto",
                },
                {
                  text: "ผู้ให้ยืมอุปกรณ์.....................................................(......./......./.......)",
                  style: "content",
                  width: "*",
                },
              ],
            },
            {
              absolutePosition: { x: 50, y: 730 },
              lineHeight: 2.0,
              columns: [
                {
                  text: "ผู้รับรอง.............................................................(......./......./.......)",
                  style: "content",
                  width: "auto",
                },
                {
                  text: "ผู้รับเงินมัดจำ.......................................................(......./......./.......)",
                  style: "content",
                  width: "*",
                },
              ],
            },
            {
              absolutePosition: { x: 50, y: 760 },
              lineHeight: 2.0,
              columns: [
                {
                  text: "ผู้คืนอุปกรณ์......................................................(......./......./.......)",
                  style: "content",
                  width: "auto",
                },
                {
                  text: "ผู้รับคืนอุปกรณ์....................................................(......./......./.......)",
                  style: "content",
                  width: "*",
                },
              ],
            },
          ];

          docDefinition.content.push(footers);

          pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
            renderPDF(dataURL, document.getElementById("canvas"));
          });
        } else {
          alertService.warning(
            "กรุณาเลือกรายการอย่างน้อย 1 รายการ ก่อนไปหน้าถัดไป"
          );
        }
      } else if (vm.loan_date == undefined && vm.returned_date == undefined) {
        alertService.warning(
          "กรุณากรอก วันที่ยืม/กำหนดคืน และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
        );
      } else if (vm.returned_date == undefined) {
        alertService.warning(
          "กรุณากรอก กำหนดคืน และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
        );
      } else if (vm.loan_date == undefined) {
        alertService.warning(
          "กรุณากรอก วันที่ยืม และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
        );
      }
    }
  }

  function Tabs(key) {
    if (key == 1) {
      vm.lcount = 0;
      vm.active = 1;
    }
    if (key == 2) {
      vm.lcount = 0;
      if (vm.valvCHK_A == true) {
        vm.disableKEy_step2 = false;
        vm.disableKEy_step3 = true;
        vm.active = 2;
      } else {
        vm.disableKEy_step2 = true;
        alertService.warning("กรุณาเลือกข้อมูลให้ครบ ก่อนไปหน้าถัดไป");
      }
    } else if (key == 3) {
      if (vm.disableKEy_step2 == false) {
        if (vm.loan_date != undefined && vm.returned_date != undefined) {
          if (vm.select_items.length > 0) {
            if (vm.lcount == 0) {
              vm.lcount++;
              vm.disableKEy_step3 = false;
              vm.active = 3;
              for (let i = 0; i < vm.select_items.length; i++) {
                let date_obj = $filter("date")(vm.loop_date[i], "dd/MM/yyyy");
                let str_obj = date_obj;
                let tree_obj = str_obj.split("/");
                let res_obj = Number(tree_obj[2]) + 543;
                let ans_obj = tree_obj[0] + "/" + tree_obj[1] + "/" + res_obj;
                angular.merge(vm.select_items[i], { AST_DATE: ans_obj });
                angular.merge(vm.select_items[i], { AST_DEPOSIT: vm.dep[i] });
              }

              let A_format = $filter("date")(vm.loan_date, "dd/MM/yyyy");
              let B_format = $filter("date")(vm.returned_date, "dd/MM/yyyy");

              let str_A = A_format;
              let tree_A = str_A.split("/");
              let res_A = Number(tree_A[2]) + 543;
              let A = tree_A[0] + "/" + tree_A[1] + "/" + res_A;

              let str_B = B_format;
              let tree_B = str_B.split("/");
              let res_B = Number(tree_B[2]) + 543;
              let B = tree_B[0] + "/" + tree_B[1] + "/" + res_B;

              docDefinition = {
                defaultStyle: {
                  font: "angsanaUPC",
                  fontSize: 16,
                  columnGap: 10,
                },
                pageSize: "A4",
                pageMargins: [40, 25, 50, 50],
                styles: {
                  title: { fontSize: 24, alignment: "center" },
                  titleSub: { fontSize: 18, alignment: "center" },
                  titleDate: { fontSize: 14, alignment: "left", bold: true },
                  content: { fontSize: 14, alignment: "left", bold: true },
                  subcontent: { fontSize: 14, alignment: "center" },
                  list: { fontSize: 14, alignment: "center" },
                  tableExample: {
                    margin: [0, 0, 0, 0],
                  },
                  tableHeader: {
                    fontSize: 16,
                    alignment: "center",
                    bold: true,
                  },
                  tablebody: { fontSize: 14, alignment: "center" },
                },
                content: [
                  {
                    columns: [
                      { text: "ใบยืมอุปกรณ์\n\n", style: "title", width: "*" },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "หน่วยงาน", style: "content", width: 40 },
                      {
                        text: vm.config,
                        style: "subcontent",
                        width: 323,
                        alignment: "left",
                      },
                      {
                        text: "วันที่ยืม",
                        style: "content",
                        width: 57,
                        alignment: "right",
                      },
                      {
                        text: A,
                        style: "subcontent",
                        width: "auto",
                        alignment: "right",
                      },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "เบอร์โทรศัพท์", style: "content", width: 55 },
                      {
                        text: vm.comp_tel,
                        style: "subcontent",
                        width: 320,
                        alignment: "left",
                      },
                      {
                        text: "กำหนดคืน\n\n",
                        style: "content",
                        width: 45,
                        alignment: "right",
                      },
                      {
                        text: B,
                        style: "subcontent",
                        width: "auto",
                        alignment: "right",
                      },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      {
                        text: "ผู้มีสิทธิ์ยืม",
                        style: "content",
                        width: "auto",
                      },
                      {
                        text: vm.dataA.fullname,
                        style: "subcontent",
                        width: 125,
                        alignment: "left",
                      },
                      {
                        text: "รหัสบัตรประชาชน",
                        style: "content",
                        width: 75,
                        alignment: "left",
                      },
                      {
                        text: vm.dataA.card,
                        style: "subcontent",
                        width: 100,
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                      {
                        text: vm.dataA.tel,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "ที่อยู่", style: "content", width: 40 },
                      {
                        text: vm.dataA.address,
                        width: 321,
                        style: "subcontent",
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                      {
                        text: vm.dataA.tel2,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 2,
                    columns: [
                      {
                        text: "Hn",
                        style: "content",
                        width: 40,
                        alignment: "left",
                      },
                      {
                        text: vm.dataA.Hn,
                        style: "subcontent",
                        width: 125,
                        alignment: "left",
                      },
                      { text: "Ward", style: "content", width: "auto" },
                      {
                        text: vm.dataA.Ward,
                        style: "subcontent",
                        width: "*",
                        alignment: "left",
                      },
                    ],
                  },
                ],
              };

              if (vm.dataB.id != "") {
                let data2 = [
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "ผู้ยืม", style: "content", width: 40 },
                      {
                        text: vm.dataB.fullname,
                        style: "subcontent",
                        width: 125,
                        alignment: "left",
                      },
                      {
                        text: "รหัสบัตรประชาชน",
                        style: "content",
                        width: 76,
                        alignment: "left",
                      },
                      {
                        text: vm.dataB.card,
                        style: "subcontent",
                        width: 100,
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                      {
                        text: vm.dataB.tel,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "ที่อยู่", style: "content", width: 40 },
                      {
                        text: vm.dataB.address,
                        width: 321,
                        style: "subcontent",
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                      {
                        text: vm.dataB.tel2,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 2,
                    columns: [
                      {
                        text: "เกี่ยวข้องกับผู้มีสิทธิ์ยืม",
                        style: "content",
                        width: 90,
                        alignment: "left",
                      },
                      {
                        text: vm.dataB.conn,
                        style: "subcontent",
                        width: "*",
                        alignment: "left",
                      },
                    ],
                  },
                ];

                docDefinition.content = docDefinition.content.concat(data2);
              }

              if (vm.dataC.id != "") {
                let data3 = [
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "ผู้รับรอง", style: "content", width: 40 },
                      {
                        text: vm.dataC.fullname,
                        style: "subcontent",
                        width: 321,
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                      {
                        text: vm.dataC.tel,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 1.2,
                    columns: [
                      { text: "ที่อยู่", style: "content", width: 40 },
                      {
                        text: vm.dataC.address,
                        width: 321,
                        style: "subcontent",
                        alignment: "left",
                      },
                      { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                      {
                        text: vm.dataC.tel2,
                        style: "subcontent",
                        width: "auto",
                        alignment: "center",
                      },
                    ],
                  },
                  {
                    lineHeight: 2,
                    columns: [
                      {
                        text: "ตำแหน่ง",
                        style: "content",
                        width: 40,
                        alignment: "left",
                      },
                      {
                        text: vm.dataC.pos,
                        style: "subcontent",
                        width: 125,
                        alignment: "left",
                      },
                      {
                        text: "สังกัด",
                        style: "content",
                        width: 30,
                        alignment: "left",
                      },
                      {
                        text: vm.dataC.attn,
                        style: "subcontent",
                        width: 260,
                        alignment: "left",
                      },
                    ],
                  },
                ];

                docDefinition.content = docDefinition.content.concat(data3);
              }
              // Head Table
              docDefinition.content.push({
                lineHeight: 1.5,
                columns: [
                  {
                    text: "รายการอุปกรณ์ที่ต้องการยืมมีดังนี้",
                    style: "content",
                    width: "auto",
                  },
                ],
              });

              let table = {
                style: "tableExample",
                table: {
                  widths: [70, 125, 112, 35, 40, 50],
                  headerRows: 1,
                  body: [
                    [
                      { text: "รหัสอุปกรณ์", style: "tableHeader" },
                      { text: "รายละเอียด", style: "tableHeader" },
                      { text: "เลขที่ครุภัณฑ์", style: "tableHeader" },
                      { text: "จำนวน", style: "tableHeader" },
                      { text: "เงินมัดจำ", style: "tableHeader" },
                      { text: "กำหนดคืน", style: "tableHeader" },
                    ],
                  ],
                },
                layout: "headerLineOnly",
              };

              let qty = 0;
              let totaldepositi = 0;
              let depositi = 0;

              vm.select_items.forEach(function (row, index) {
                let array = [
                  { text: row.AST_ASSET, style: "tablebody" },
                  { text: row.AST_DESC, alignment: "left", style: "tablebody" },
                  { text: row.AST_INV_NBR, style: "tablebody" },
                  { text: 1, style: "tablebody" },
                  {
                    text: $filter("number")(row.AST_DEPOSIT, 2),
                    alignment: "right",
                    style: "tablebody",
                  },
                  { text: row.AST_DATE, style: "tablebody" },
                ];
                table.table.body.push(array);
                depositi += parseFloat(row.AST_DEPOSIT);
              });

              qty += vm.select_items.length;
              totaldepositi += depositi;

              docDefinition.content.push(table);

              docDefinition.content.push({
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
                  widths: [266, 75, 23, 54, 46, 0],
                  body: [
                    [
                      { text: "", border: [false, false, false, false] },
                      { text: "รวม", alignment: "left", style: "tablebody" },
                      {
                        text: $filter("number")(qty),
                        alignment: "center",
                        style: "tablebody",
                      },
                      {
                        text: $filter("number")(totaldepositi, 2),
                        alignment: "right",
                        style: "tablebody",
                      },
                      "",
                      "",
                    ],
                    [
                      { text: "", border: [false, false, false, false] },
                      "",
                      "",
                      "",
                      "",
                      "",
                    ],
                  ],
                },
              });

              let footers = [
                {
                  absolutePosition: { x: 50, y: 700 },
                  lineHeight: 2.0,
                  columns: [
                    {
                      text: "ผู้มีสิทธิ์ยืมอุปกรณ์............................................(......./......./.......)",
                      style: "content",
                      width: "auto",
                    },
                    {
                      text: "ผู้ให้ยืมอุปกรณ์.....................................................(......./......./.......)",
                      style: "content",
                      width: "*",
                    },
                  ],
                },
                {
                  absolutePosition: { x: 50, y: 730 },
                  lineHeight: 2.0,
                  columns: [
                    {
                      text: "ผู้รับรอง.............................................................(......./......./.......)",
                      style: "content",
                      width: "auto",
                    },
                    {
                      text: "ผู้รับเงินมัดจำ.......................................................(......./......./.......)",
                      style: "content",
                      width: "*",
                    },
                  ],
                },
                {
                  absolutePosition: { x: 50, y: 760 },
                  lineHeight: 2.0,
                  columns: [
                    {
                      text: "ผู้คืนอุปกรณ์......................................................(......./......./.......)",
                      style: "content",
                      width: "auto",
                    },
                    {
                      text: "ผู้รับคืนอุปกรณ์....................................................(......./......./.......)",
                      style: "content",
                      width: "*",
                    },
                  ],
                },
              ];

              docDefinition.content.push(footers);

              pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
                renderPDF(dataURL, document.getElementById("canvas"));
              });
            }
          } else {
            alertService.warning(
              "กรุณาเลือกรายการอย่างน้อย 1 รายการ ก่อนไปหน้าถัดไป"
            );
            vm.active = 2;
          }
        } else if (vm.loan_date == undefined && vm.returned_date == undefined) {
          alertService.warning(
            "กรุณากรอก วันที่ยืม/กำหนดคืน และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
          );
          vm.active = 2;
        } else if (vm.returned_date == undefined) {
          alertService.warning(
            "กรุณากรอก กำหนดคืน และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
          );
          vm.active = 2;
        } else if (vm.loan_date == undefined) {
          alertService.warning(
            "กรุณากรอก วันที่ยืม และตรวจสอบรูปแบบวันที่ให้ถูกต้อง"
          );
          vm.active = 2;
        }
      }
    }
  }

  function clear() {
    // ล้างข้อมูล
    vm.dataA = angular.copy(Copy_DataA);
    vm.dataB = angular.copy(Copy_DataB);
    vm.dataC = angular.copy(Copy_DataC);
    vm.valvCHK_A = false;
    vm.disableKEy_step2 = true;
    vm.disableKEy_step3 = true;
  }

  function delItems(e) {
    // ลบ Items
    vm.select_items.splice(e, 1);
    vm.loop_date.splice(e, 1);
    vm.loop_up.splice(e, 1);
    vm.oldMD_type.splice(e, 1);
    vm.oldMD_id.splice(e, 1);
    vm.dep.splice(e, 1);
    vm.array_pic.splice(e, 1);

    if (vm.select_items.length > 0) {
      vm.disableKEy_step3 = false;
    } else {
      vm.disableKEy_step3 = true;
    }
  }

  function sum() {
    // คำนวณยอดมัดจำ
    vm.sumDep = 0;
    for (let i = 0; i < vm.select_items.length; i++) {
      vm.sumDep += vm.dep[i];
    }
    return { price: vm.sumDep };
  }

  function blurInputDep(e, index) {
    // Blur ช่องมัดจำให้ Default 0
    if (e == undefined) {
      vm.dep[index] = 0;
    }
  }

  function save() {
    // บันทึกข้อมูล
    alertService.confrim("คุณต้องการบันทึกข้อมูล หรือไม่ ? ", function (value) {
      if (value) {
        vm.dua_date.loan_date = $filter("date")(vm.loan_date, "dd/MM/yyyy");
        vm.dua_date.returned_date = $filter("date")(
          vm.returned_date,
          "dd/MM/yyyy"
        );

        vm.set_headers = {
          RO_NBR: $rootScope.keyNbr,
          RO_CASE_ID: vm.dataA.id,
          RO_CASE2_ID: vm.dataB.id,
          RO_CASE3_ID: vm.dataC.id,
          RO_LOAN_DATE: vm.dua_date.loan_date,
          RO_RETURNED_DATE: vm.dua_date.returned_date,
          RO_UNIT: vm.select_items.length,
          RO_TOTAL_DEP: vm.sumDep,
          RO_STATUS: "BORROW",
        };

        for (let i = 0; i < vm.select_items.length; i++) {
          angular.merge(vm.select_items[i], {
            AST_DATE: $filter("date")(vm.loop_date[i], "dd/MM/yyyy"),
          });
          angular.merge(vm.select_items[i], { AST_DEPOSIT: vm.dep[i] });
        }

        let modals = {
          mod: "isSave",
          auth: $rootScope.globals.auth,
          it: vm.set_headers,
          ast: vm.select_items,
        };

        let cancellerLoadpic = $q.defer();
        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 3000);

        $rootScope.loading = true;
        $http.post(url, modals, { timeout: cancellerLoadpic.promise }).then(
          function (response) {
            // $http.post(url, modals).then(function (response) {
            if (response.data.Status == "Ok") {
              vm.alert_error = false;
              let msg = "บันทึกข้อมูลเรียบร้อย";
              alertService.confrim_success(msg, function (e) {
                if (e) {
                  alertService.confrim(
                    "คุณต้องการพิมพ์รายงานหรือไม่ ? ",
                    function (k) {
                      if (k) {
                        print_report(response.data.Runing);
                        $state.go("app.lend.service_lend_addList");
                      } else {
                        $state.go("app.lend.service_lend_addList");
                      }
                    }
                  );
                }
              });
            } else {
              vm.alert_no = response.data.NBR;
              vm.alert_error = true;
              let msg =
                "แจ้งเตือน!! เนื่องจากรายการยืมอุปกรณ์ของท่าน ได้มีการยืมแล้ว กรุณาตรวจสอบและลองใหม่อกครั้ง";
              alertService.warning(msg);
            }
            $rootScope.loading = false;
          },
          function (response) {
            $http.post(url, modals).then(
              function (response) {
                if (response.data.Status == "Ok") {
                  vm.alert_error = false;
                  let msg = "บันทึกข้อมูลเรียบร้อย";
                  alertService.confrim_success(msg, function (e) {
                    if (e) {
                      alertService.confrim(
                        "คุณต้องการพิมพ์รายงานหรือไม่ ? ",
                        function (k) {
                          if (k) {
                            print_report(response.data.Runing);
                            $state.go("app.lend.service_lend_addList");
                          } else {
                            $state.go("app.lend.service_lend_addList");
                          }
                        }
                      );
                    }
                  });
                } else {
                  vm.alert_no = response.data.NBR;
                  vm.alert_error = true;
                  let msg =
                    "แจ้งเตือน!! เนื่องจากรายการยืมอุปกรณ์ของท่าน ได้มีการยืมแล้ว กรุณาตรวจสอบและลองใหม่อกครั้ง";
                  alertService.warning(msg);
                }
                $rootScope.loading = false;
              },
              function (response) {
                alertService.warning("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                $rootScope.loading = false;
              }
            );
          }
        );
      }
    });
  }

  function print_report(nbr) {
    // ปริ้นในขั้นตอนสุดท้าย ก่อนบันทึกข้อมูล
    for (let i = 0; i < vm.select_items.length; i++) {
      let date_obj = $filter("date")(vm.loop_date[i], "dd/MM/yyyy");
      let str_obj = date_obj;
      let tree_obj = str_obj.split("/");
      let res_obj = Number(tree_obj[2]) + 543;
      let ans_obj = tree_obj[0] + "/" + tree_obj[1] + "/" + res_obj;
      angular.merge(vm.select_items[i], { AST_DATE: ans_obj });
      angular.merge(vm.select_items[i], { AST_DEPOSIT: vm.dep[i] });
    }

    let A_format = $filter("date")(vm.loan_date, "dd/MM/yyyy");
    let B_format = $filter("date")(vm.returned_date, "dd/MM/yyyy");

    let str_A = A_format;
    let tree_A = str_A.split("/");
    let res_A = Number(tree_A[2]) + 543;
    let A = tree_A[0] + "/" + tree_A[1] + "/" + res_A;

    let str_B = B_format;
    let tree_B = str_B.split("/");
    let res_B = Number(tree_B[2]) + 543;
    let B = tree_B[0] + "/" + tree_B[1] + "/" + res_B;

    var canvas = document.createElement("canvas");
    JsBarcode(canvas, nbr, {
      format: "CODE128",
      width: 20,
      height: 50,
      displayValue: false,
    });

    docDefinition = {
      defaultStyle: {
        font: "angsanaUPC",
        fontSize: 16,
        columnGap: 10,
      },
      pageSize: "A4",
      pageMargins: [40, 25, 50, 50],
      styles: {
        title: { fontSize: 24, alignment: "center" },
        titleSub: { fontSize: 18, alignment: "center" },
        titleDate: { fontSize: 14, alignment: "left", bold: true },
        content: { fontSize: 14, alignment: "left", bold: true },
        subcontent: { fontSize: 14, alignment: "center" },
        list: { fontSize: 14, alignment: "center" },
        tableExample: {
          margin: [0, 0, 0, 0],
        },
        tableHeader: { fontSize: 16, alignment: "center", bold: true },
        tablebody: { fontSize: 14, alignment: "center" },
      },
      content: [
        {
          columns: [
            {
              text: "ใบยืมอุปกรณ์\n",
              style: "title",
              width: 291,
              alignment: "right",
            },
            { text: "", style: "title", width: 68 },
            {
              image: canvas.toDataURL("image/png"),
              width: 132,
              height: 45,
            },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "หน่วยงาน", style: "content", width: 40 },
            {
              text: vm.config,
              style: "subcontent",
              width: 283,
              alignment: "left",
            },
            {
              text: "เลขที่ใบยืม",
              style: "content",
              width: 77,
              alignment: "right",
            },
            {
              text: nbr,
              style: "subcontent",
              width: "auto",
              alignment: "right",
            },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "เบอร์โทรศัพท์", style: "content", width: 55 },
            {
              text: vm.comp_tel,
              style: "subcontent",
              width: 283,
              alignment: "left",
            },
            {
              text: "วันที่ยืม",
              style: "content",
              width: 62,
              alignment: "right",
            },
            { text: A, style: "subcontent", width: "auto", alignment: "right" },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            {
              text: "กำหนดคืน\n\n",
              style: "content",
              width: 420,
              alignment: "right",
            },
            { text: B, style: "subcontent", width: "auto", alignment: "right" },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "ผู้มีสิทธิ์ยืม", style: "content", width: "auto" },
            {
              text: vm.dataA.fullname,
              style: "subcontent",
              width: 125,
              alignment: "left",
            },
            {
              text: "รหัสบัตรประชาชน",
              style: "content",
              width: 75,
              alignment: "left",
            },
            {
              text: vm.dataA.card,
              style: "subcontent",
              width: 100,
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
            {
              text: vm.dataA.tel,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "ที่อยู่", style: "content", width: 40 },
            {
              text: vm.dataA.address,
              width: 321,
              style: "subcontent",
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
            {
              text: vm.dataA.tel2,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 2,
          columns: [
            { text: "Hn", style: "content", width: 40, alignment: "left" },
            {
              text: vm.dataA.Hn,
              style: "subcontent",
              width: 125,
              alignment: "left",
            },
            { text: "Ward", style: "content", width: "auto" },
            {
              text: vm.dataA.Ward,
              style: "subcontent",
              width: "*",
              alignment: "left",
            },
          ],
        },
      ],
    };

    if (vm.dataB.id != "") {
      let data2 = [
        {
          lineHeight: 1.2,
          columns: [
            { text: "ผู้ยืม", style: "content", width: 40 },
            {
              text: vm.dataB.fullname,
              style: "subcontent",
              width: 125,
              alignment: "left",
            },
            {
              text: "รหัสบัตรประชาชน",
              style: "content",
              width: 76,
              alignment: "left",
            },
            {
              text: vm.dataB.card,
              style: "subcontent",
              width: 100,
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
            {
              text: vm.dataB.tel,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "ที่อยู่", style: "content", width: 40 },
            {
              text: vm.dataB.address,
              width: 321,
              style: "subcontent",
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
            {
              text: vm.dataB.tel2,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 2,
          columns: [
            {
              text: "เกี่ยวข้องกับผู้มีสิทธิ์ยืม",
              style: "content",
              width: 90,
              alignment: "left",
            },
            {
              text: vm.dataB.conn,
              style: "subcontent",
              width: "*",
              alignment: "left",
            },
          ],
        },
      ];

      docDefinition.content = docDefinition.content.concat(data2);
    }

    if (vm.dataC.id != "") {
      let data3 = [
        {
          lineHeight: 1.2,
          columns: [
            { text: "ผู้รับรอง", style: "content", width: 40 },
            {
              text: vm.dataC.fullname,
              style: "subcontent",
              width: 321,
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
            {
              text: vm.dataC.tel,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 1.2,
          columns: [
            { text: "ที่อยู่", style: "content", width: 40 },
            {
              text: vm.dataC.address,
              width: 321,
              style: "subcontent",
              alignment: "left",
            },
            { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
            {
              text: vm.dataC.tel2,
              style: "subcontent",
              width: "auto",
              alignment: "center",
            },
          ],
        },
        {
          lineHeight: 2,
          columns: [
            { text: "ตำแหน่ง", style: "content", width: 40, alignment: "left" },
            {
              text: vm.dataC.pos,
              style: "subcontent",
              width: 125,
              alignment: "left",
            },
            { text: "สังกัด", style: "content", width: 30, alignment: "left" },
            {
              text: vm.dataC.attn,
              style: "subcontent",
              width: 260,
              alignment: "left",
            },
          ],
        },
      ];

      docDefinition.content = docDefinition.content.concat(data3);
    }
    // Head Table
    docDefinition.content.push({
      lineHeight: 1.5,
      columns: [
        {
          text: "รายการอุปกรณ์ที่ต้องการยืมมีดังนี้",
          style: "content",
          width: "auto",
        },
      ],
    });

    let table = {
      style: "tableExample",
      table: {
        widths: [70, 125, 112, 35, 40, 50],
        headerRows: 1,
        body: [
          [
            { text: "รหัสอุปกรณ์", style: "tableHeader" },
            { text: "รายละเอียด", style: "tableHeader" },
            { text: "เลขที่ครุภัณฑ์", style: "tableHeader" },
            { text: "จำนวน", style: "tableHeader" },
            { text: "เงินมัดจำ", style: "tableHeader" },
            { text: "กำหนดคืน", style: "tableHeader" },
          ],
        ],
      },
      layout: "headerLineOnly",
    };

    let qty = 0;
    let totaldepositi = 0;
    let depositi = 0;

    vm.select_items.forEach(function (row, index) {
      let array = [
        { text: row.AST_ASSET, style: "tablebody" },
        { text: row.AST_DESC, alignment: "left", style: "tablebody" },
        { text: row.AST_INV_NBR, style: "tablebody" },
        { text: 1, style: "tablebody" },
        {
          text: $filter("number")(row.AST_DEPOSIT, 2),
          alignment: "right",
          style: "tablebody",
        },
        { text: row.AST_DATE, style: "tablebody" },
      ];
      table.table.body.push(array);
      depositi += parseFloat(row.AST_DEPOSIT);
    });

    qty += vm.select_items.length;
    totaldepositi += depositi;

    docDefinition.content.push(table);

    docDefinition.content.push({
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
        widths: [266, 75, 23, 54, 46, 0],
        body: [
          [
            { text: "", border: [false, false, false, false] },
            { text: "รวม", alignment: "left", style: "tablebody" },
            {
              text: $filter("number")(qty),
              alignment: "center",
              style: "tablebody",
            },
            {
              text: $filter("number")(totaldepositi, 2),
              alignment: "right",
              style: "tablebody",
            },
            "",
            "",
          ],
          [
            { text: "", border: [false, false, false, false] },
            "",
            "",
            "",
            "",
            "",
          ],
        ],
      },
    });

    let footers = [
      {
        absolutePosition: { x: 50, y: 700 },
        lineHeight: 2.0,
        columns: [
          {
            text: "ผู้มีสิทธิ์ยืมอุปกรณ์............................................(......./......./.......)",
            style: "content",
            width: "auto",
          },
          {
            text: "ผู้ให้ยืมอุปกรณ์.....................................................(......./......./.......)",
            style: "content",
            width: "*",
          },
        ],
      },
      {
        absolutePosition: { x: 50, y: 730 },
        lineHeight: 2.0,
        columns: [
          {
            text: "ผู้รับรอง.............................................................(......./......./.......)",
            style: "content",
            width: "auto",
          },
          {
            text: "ผู้รับเงินมัดจำ.......................................................(......./......./.......)",
            style: "content",
            width: "*",
          },
        ],
      },
      {
        absolutePosition: { x: 50, y: 760 },
        lineHeight: 2.0,
        columns: [
          {
            text: "ผู้คืนอุปกรณ์......................................................(......./......./.......)",
            style: "content",
            width: "auto",
          },
          {
            text: "ผู้รับคืนอุปกรณ์....................................................(......./......./.......)",
            style: "content",
            width: "*",
          },
        ],
      },
    ];

    docDefinition.content.push(footers);

    pdfMake.createPdf(docDefinition).open();
  }

  $scope.preview = "dist/img/logo/img.png";
  angular
    .element(document.querySelector("#fileInput"))
    .on("change", handleFileSelect);
  function handleFileSelect(evt) {
    var file = evt.currentTarget.files[0];
    if (file) {
      let modal = $uibModal.open({
        animation: true,
        templateUrl: "SETupload.modal",
        controller: "SETuploadController",
        controllerAs: "vm",
        size: "md",
        backdropClass: "backdrop",
        resolve: {
          items: function () {
            return { evt: evt, index: vm.index, it: vm.it };
          },
        },
      });

      modal.result.then(
        function (result) {
          let newBASE64 = result.base64;
          let indexX = result.index;
          vm.array_pic[indexX].pic = newBASE64;
          for (let i = 0; i < vm.select_items.length; i++) {
            angular.merge(vm.select_items[i], { AST_PIC: vm.array_pic[i].pic });
          }
        },
        function () {}
      );
    }
  }

  function reset(it, index) {
    vm.index = index;
    vm.it = it;
    angular.forEach(
      angular.element("input[type='file']"),
      function (inputElem) {
        angular.element(inputElem).val(null);
      }
    );
  }

  //--------------------- Calen Date -------------------------
  //----------------------------------------------------------

  vm.loan_date = new Date();
  vm.loan_up = { opened: false };
  vm.returned_up = { opened: false };
  vm.loan_dateOptions = {
    formatYear: "yy",
    startingDay: 1,
  };

  vm.loop_dateOptions = {
    formatYear: "yy",
    startingDay: 1,
  };

  vm.returned_dateOptions = {
    formatYear: "yy",
    startingDay: 1,
  };

  function loopIndex_calendar(e) {
    vm.loop_up[e].opened = true;
  }

  function loan_calendar() {
    vm.loan_up.opened = true;
  }

  function returned_calendar() {
    vm.returned_up.opened = true;
  }
}

service_lend_addListController.$inject = [
  "$uibModal",
  "$http",
  "$state",
  "$rootScope",
  "NgTableParams",
  "$filter",
];
function service_lend_addListController(
  $uibModal,
  $http,
  $state,
  $rootScope,
  NgTableParams,
  $filter
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.addList = addList;
  vm.detail = detail_returned;
  vm.renew = renew;
  vm.print_index = print_index;

  fristLook();
  function fristLook() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isMain",
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.List_borrow = response.data.data;
        vm.config = response.data.site[0].SI_DESC;
        if (
          response.data.site[0].SI__CHR01 == undefined ||
          response.data.site[0].SI__CHR01 == ""
        ) {
          vm.comp_tel = "-";
        } else {
          vm.comp_tel = response.data.site[0].SI__CHR01;
        }

        vm.table = new NgTableParams(
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
  }

  function addList() {
    $state.go("app.lend.service_lend");
  }

  function detail_returned(nbr) {
    $state.go("app.lend.service_returnedItems", { nbr: nbr });
  }

  function renew(nbr, state) {
    $state.go("app.lend.service_lend_renew_exp", { nbr: nbr, state: state });
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function print_index(data) {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isPrint",
      it: data,
    };

    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        let zone =
          response.data.data[0].cmad_city == "กรุงเทพมหานคร" ? "Yes" : "No";
        response.data.data[0].cmad_phone =
          response.data.data[0].cmad_phone == ""
            ? "-"
            : response.data.data[0].cmad_phone;
        response.data.data[0].cmad_phone2 =
          response.data.data[0].cmad_phone2 == ""
            ? "-"
            : response.data.data[0].cmad_phone2;
        if (zone != "Yes") {
          let pt1_adL1 =
            response.data.data[0].cmad_add_no != ""
              ? "เลขที่" + " " + response.data.data[0].cmad_add_no + "   "
              : "";
          let pt1_adL2 =
            response.data.data[0].cmad_moo_no != ""
              ? "หมู่" + " " + response.data.data[0].cmad_moo_no + "   "
              : "";
          let pt1_adL3 =
            response.data.data[0].cmad_moo_name != ""
              ? "หมู่บ้าน" + " " + response.data.data[0].cmad_moo_name + "   "
              : "";
          let pt1_adL4 =
            response.data.data[0].cmad_room_no != ""
              ? "ห้องเลขที่" + " " + response.data.data[0].cmad_room_no + "   "
              : "";
          let pt1_adL5 =
            response.data.data[0].cmad_floor_name != ""
              ? "ชั้นที่" + " " + response.data.data[0].cmad_floor_name + "   "
              : "";
          let pt1_adL6 =
            response.data.data[0].cmad_build_name != ""
              ? "อาคาร" + " " + response.data.data[0].cmad_build_name + "   "
              : "";
          let pt1_adL7 =
            response.data.data[0].cmad_trok_soi != ""
              ? "ตรอก/ซอย" + " " + response.data.data[0].cmad_trok_soi + "   "
              : "";
          let pt1_adL8 =
            response.data.data[0].cmad_street != ""
              ? "ถนน" + " " + response.data.data[0].cmad_street + "   "
              : "";
          let pt1_adL9 =
            response.data.data[0].cmad_tumbol_name != ""
              ? "ตำบล" + response.data.data[0].cmad_tumbol_name + "   "
              : "";
          let pt1_adL10 =
            response.data.data[0].cmad_amphur_name != ""
              ? "อำเภอ" + response.data.data[0].cmad_amphur_name + "   "
              : "";
          let pt1_adL11 =
            response.data.data[0].cmad_city != ""
              ? "จังหวัด" + response.data.data[0].cmad_city + "   "
              : "";
          let pt1_adL12 =
            response.data.data[0].cmad_zip != ""
              ? response.data.data[0].cmad_zip
              : "";

          vm.cmad_line =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        } else {
          let pt1_adL1 =
            response.data.data[0].cmad_add_no != ""
              ? "เลขที่" + " " + response.data.data[0].cmad_add_no + "   "
              : "";
          let pt1_adL2 =
            response.data.data[0].cmad_moo_no != ""
              ? "หมู่" + " " + response.data.data[0].cmad_moo_no + "   "
              : "";
          let pt1_adL3 =
            response.data.data[0].cmad_moo_name != ""
              ? "หมู่บ้าน" + " " + response.data.data[0].cmad_moo_name + "   "
              : "";
          let pt1_adL4 =
            response.data.data[0].cmad_room_no != ""
              ? "ห้องเลขที่" + " " + response.data.data[0].cmad_room_no + "   "
              : "";
          let pt1_adL5 =
            response.data.data[0].cmad_floor_name != ""
              ? "ชั้นที่" + " " + response.data.data[0].cmad_floor_name + "   "
              : "";
          let pt1_adL6 =
            response.data.data[0].cmad_build_name != ""
              ? "อาคาร" + " " + response.data.data[0].cmad_build_name + "   "
              : "";
          let pt1_adL7 =
            response.data.data[0].cmad_trok_soi != ""
              ? "ตรอก/ซอย" + " " + response.data.data[0].cmad_trok_soi + "   "
              : "";
          let pt1_adL8 =
            response.data.data[0].cmad_street != ""
              ? "ถนน" + " " + response.data.data[0].cmad_street + "   "
              : "";
          let pt1_adL9 =
            response.data.data[0].cmad_tumbol_name != ""
              ? "แขวง" + response.data.data[0].cmad_tumbol_name + "   "
              : "";
          let pt1_adL10 =
            response.data.data[0].cmad_amphur_name != ""
              ? response.data.data[0].cmad_amphur_name + "   "
              : "";
          let pt1_adL11 =
            response.data.data[0].cmad_city != ""
              ? "จังหวัด" + response.data.data[0].cmad_city + "   "
              : "";
          let pt1_adL12 =
            response.data.data[0].cmad_zip != ""
              ? response.data.data[0].cmad_zip
              : "";

          vm.cmad_line =
            pt1_adL1 +
            pt1_adL2 +
            pt1_adL3 +
            pt1_adL4 +
            pt1_adL5 +
            pt1_adL6 +
            pt1_adL7 +
            pt1_adL8 +
            pt1_adL9 +
            pt1_adL10 +
            pt1_adL11 +
            pt1_adL12;
        }

        if (response.data.data2.length != 0) {
          response.data.data2[0].cmad_phone =
            response.data.data2[0].cmad_phone == ""
              ? "-"
              : response.data.data2[0].cmad_phone;
          response.data.data2[0].cmad_phone2 =
            response.data.data2[0].cmad_phone2 == ""
              ? "-"
              : response.data.data2[0].cmad_phone2;
          response.data.data2[0].CMAD_RELATION =
            response.data.data2[0].CMAD_RELATION == ""
              ? "-"
              : response.data.data2[0].CMAD_RELATION;
          let zone2 =
            response.data.data2[0].cmad_city == "กรุงเทพมหานคร" ? "Yes" : "No";
          if (zone2 != "Yes") {
            let pt2_adL1 =
              response.data.data2[0].cmad_add_no != ""
                ? "เลขที่" + " " + response.data.data2[0].cmad_add_no + "   "
                : "";
            let pt2_adL2 =
              response.data.data2[0].cmad_moo_no != ""
                ? "หมู่" + " " + response.data.data2[0].cmad_moo_no + "   "
                : "";
            let pt2_adL3 =
              response.data.data2[0].cmad_moo_name != ""
                ? "หมู่บ้าน" +
                  " " +
                  response.data.data2[0].cmad_moo_name +
                  "   "
                : "";
            let pt2_adL4 =
              response.data.data2[0].cmad_room_no != ""
                ? "ห้องเลขที่" +
                  " " +
                  response.data.data2[0].cmad_room_no +
                  "   "
                : "";
            let pt2_adL5 =
              response.data.data2[0].cmad_floor_name != ""
                ? "ชั้นที่" +
                  " " +
                  response.data.data2[0].cmad_floor_name +
                  "   "
                : "";
            let pt2_adL6 =
              response.data.data2[0].cmad_build_name != ""
                ? "อาคาร" + " " + response.data.data2[0].cmad_build_name + "   "
                : "";
            let pt2_adL7 =
              response.data.data2[0].cmad_trok_soi != ""
                ? "ตรอก/ซอย" +
                  " " +
                  response.data.data2[0].cmad_trok_soi +
                  "   "
                : "";
            let pt2_adL8 =
              response.data.data2[0].cmad_street != ""
                ? "ถนน" + " " + response.data.data2[0].cmad_street + "   "
                : "";
            let pt2_adL9 =
              response.data.data2[0].cmad_tumbol_name != ""
                ? "ตำบล" + response.data.data2[0].cmad_tumbol_name + "   "
                : "";
            let pt2_adL10 =
              response.data.data2[0].cmad_amphur_name != ""
                ? "อำเภอ" + response.data.data2[0].cmad_amphur_name + "   "
                : "";
            let pt2_adL11 =
              response.data.data2[0].cmad_city != ""
                ? "จังหวัด" + response.data.data2[0].cmad_city + "   "
                : "";
            let pt2_adL12 =
              response.data.data2[0].cmad_zip != ""
                ? response.data.data2[0].cmad_zip
                : "";

            vm.cmad_line2 =
              pt2_adL1 +
              pt2_adL2 +
              pt2_adL3 +
              pt2_adL4 +
              pt2_adL5 +
              pt2_adL6 +
              pt2_adL7 +
              pt2_adL8 +
              pt2_adL9 +
              pt2_adL10 +
              pt2_adL11 +
              pt2_adL12;
          } else {
            let pt2_adL1 =
              response.data.data2[0].cmad_add_no != ""
                ? "เลขที่" + " " + response.data.data2[0].cmad_add_no + "   "
                : "";
            let pt2_adL2 =
              response.data.data2[0].cmad_moo_no != ""
                ? "หมู่" + " " + response.data.data2[0].cmad_moo_no + "   "
                : "";
            let pt2_adL3 =
              response.data.data2[0].cmad_moo_name != ""
                ? "หมู่บ้าน" +
                  " " +
                  response.data.data2[0].cmad_moo_name +
                  "   "
                : "";
            let pt2_adL4 =
              response.data.data2[0].cmad_room_no != ""
                ? "ห้องเลขที่" +
                  " " +
                  response.data.data2[0].cmad_room_no +
                  "   "
                : "";
            let pt2_adL5 =
              response.data.data2[0].cmad_floor_name != ""
                ? "ชั้นที่" +
                  " " +
                  response.data.data2[0].cmad_floor_name +
                  "   "
                : "";
            let pt2_adL6 =
              response.data.data2[0].cmad_build_name != ""
                ? "อาคาร" + " " + response.data.data2[0].cmad_build_name + "   "
                : "";
            let pt2_adL7 =
              response.data.data2[0].cmad_trok_soi != ""
                ? "ตรอก/ซอย" +
                  " " +
                  response.data.data2[0].cmad_trok_soi +
                  "   "
                : "";
            let pt2_adL8 =
              response.data.data2[0].cmad_street != ""
                ? "ถนน" + " " + response.data.data2[0].cmad_street + "   "
                : "";
            let pt2_adL9 =
              response.data.data2[0].cmad_tumbol_name != ""
                ? "แขวง" + response.data.data2[0].cmad_tumbol_name + "   "
                : "";
            let pt2_adL10 =
              response.data.data2[0].cmad_amphur_name != ""
                ? response.data.data2[0].cmad_amphur_name + "   "
                : "";
            let pt2_adL11 =
              response.data.data2[0].cmad_city != ""
                ? "จังหวัด" + response.data.data2[0].cmad_city + "   "
                : "";
            let pt2_adL12 =
              response.data.data2[0].cmad_zip != ""
                ? response.data.data2[0].cmad_zip
                : "";

            vm.cmad_line2 =
              pt2_adL1 +
              pt2_adL2 +
              pt2_adL3 +
              pt2_adL4 +
              pt2_adL5 +
              pt2_adL6 +
              pt2_adL7 +
              pt2_adL8 +
              pt2_adL9 +
              pt2_adL10 +
              pt2_adL11 +
              pt2_adL12;
          }
        }
        if (response.data.data3.length != 0) {
          response.data.data3[0].cmad_phone =
            response.data.data3[0].cmad_phone == ""
              ? "-"
              : response.data.data3[0].cmad_phone;
          response.data.data3[0].cmad_phone2 =
            response.data.data3[0].cmad_phone2 == ""
              ? "-"
              : response.data.data3[0].cmad_phone2;
          response.data.data3[0].cmad_pos =
            response.data.data3[0].cmad_pos == ""
              ? "-"
              : response.data.data3[0].cmad_pos;
          response.data.data3[0].cmad_attn =
            response.data.data3[0].cmad_attn == "" ||
            response.data.data3[0].cmad_attn == undefined
              ? "-"
              : response.data.data3[0].cmad_attn;
          let zone3 =
            response.data.data3[0].cmad_city == "กรุงเทพมหานคร" ? "Yes" : "No";
          if (zone3 != "Yes") {
            let pt3_adL1 =
              response.data.data3[0].cmad_add_no != ""
                ? "เลขที่" + " " + response.data.data3[0].cmad_add_no + "   "
                : "";
            let pt3_adL2 =
              response.data.data3[0].cmad_moo_no != ""
                ? "หมู่" + " " + response.data.data3[0].cmad_moo_no + "   "
                : "";
            let pt3_adL3 =
              response.data.data3[0].cmad_moo_name != ""
                ? "หมู่บ้าน" +
                  " " +
                  response.data.data3[0].cmad_moo_name +
                  "   "
                : "";
            let pt3_adL4 =
              response.data.data3[0].cmad_room_no != ""
                ? "ห้องเลขที่" +
                  " " +
                  response.data.data3[0].cmad_room_no +
                  "   "
                : "";
            let pt3_adL5 =
              response.data.data3[0].cmad_floor_name != ""
                ? "ชั้นที่" +
                  " " +
                  response.data.data3[0].cmad_floor_name +
                  "   "
                : "";
            let pt3_adL6 =
              response.data.data3[0].cmad_build_name != ""
                ? "อาคาร" + " " + response.data.data3[0].cmad_build_name + "   "
                : "";
            let pt3_adL7 =
              response.data.data3[0].cmad_trok_soi != ""
                ? "ตรอก/ซอย" +
                  " " +
                  response.data.data3[0].cmad_trok_soi +
                  "   "
                : "";
            let pt3_adL8 =
              response.data.data3[0].cmad_street != ""
                ? "ถนน" + " " + response.data.data3[0].cmad_street + "   "
                : "";
            let pt3_adL9 =
              response.data.data3[0].cmad_tumbol_name != ""
                ? "ตำบล" + response.data.data3[0].cmad_tumbol_name + "   "
                : "";
            let pt3_adL10 =
              response.data.data3[0].cmad_amphur_name != ""
                ? "อำเภอ" + response.data.data3[0].cmad_amphur_name + "   "
                : "";
            let pt3_adL11 =
              response.data.data3[0].cmad_city != ""
                ? "จังหวัด" + response.data.data3[0].cmad_city + "   "
                : "";
            let pt3_adL12 =
              response.data.data3[0].cmad_zip != ""
                ? response.data.data3[0].cmad_zip
                : "";

            vm.cmad_line3 =
              pt3_adL1 +
              pt3_adL2 +
              pt3_adL3 +
              pt3_adL4 +
              pt3_adL5 +
              pt3_adL6 +
              pt3_adL7 +
              pt3_adL8 +
              pt3_adL9 +
              pt3_adL10 +
              pt3_adL11 +
              pt3_adL12;
          } else {
            let pt3_adL1 =
              response.data.data3[0].cmad_add_no != ""
                ? "เลขที่" + " " + response.data.data3[0].cmad_add_no + "   "
                : "";
            let pt3_adL2 =
              response.data.data3[0].cmad_moo_no != ""
                ? "หมู่" + " " + response.data.data3[0].cmad_moo_no + "   "
                : "";
            let pt3_adL3 =
              response.data.data3[0].cmad_moo_name != ""
                ? "หมู่บ้าน" +
                  " " +
                  response.data.data3[0].cmad_moo_name +
                  "   "
                : "";
            let pt3_adL4 =
              response.data.data3[0].cmad_room_no != ""
                ? "ห้องเลขที่" +
                  " " +
                  response.data.data3[0].cmad_room_no +
                  "   "
                : "";
            let pt3_adL5 =
              response.data.data3[0].cmad_floor_name != ""
                ? "ชั้นที่" +
                  " " +
                  response.data.data3[0].cmad_floor_name +
                  "   "
                : "";
            let pt3_adL6 =
              response.data.data3[0].cmad_build_name != ""
                ? "อาคาร" + " " + response.data.data3[0].cmad_build_name + "   "
                : "";
            let pt3_adL7 =
              response.data.data3[0].cmad_trok_soi != ""
                ? "ตรอก/ซอย" +
                  " " +
                  response.data.data3[0].cmad_trok_soi +
                  "   "
                : "";
            let pt3_adL8 =
              response.data.data3[0].cmad_street != ""
                ? "ถนน" + " " + response.data.data3[0].cmad_street + "   "
                : "";
            let pt3_adL9 =
              response.data.data3[0].cmad_tumbol_name != ""
                ? "แขวง" + response.data.data3[0].cmad_tumbol_name + "   "
                : "";
            let pt3_adL10 =
              response.data.data3[0].cmad_amphur_name != ""
                ? response.data.data3[0].cmad_amphur_name + "   "
                : "";
            let pt3_adL11 =
              response.data.data3[0].cmad_city != ""
                ? "จังหวัด" + response.data.data3[0].cmad_city + "   "
                : "";
            let pt3_adL12 =
              response.data.data3[0].cmad_zip != ""
                ? response.data.data3[0].cmad_zip
                : "";

            vm.cmad_line3 =
              pt3_adL1 +
              pt3_adL2 +
              pt3_adL3 +
              pt3_adL4 +
              pt3_adL5 +
              pt3_adL6 +
              pt3_adL7 +
              pt3_adL8 +
              pt3_adL9 +
              pt3_adL10 +
              pt3_adL11 +
              pt3_adL12;
          }
        }

        var canvas = document.createElement("canvas");
        JsBarcode(canvas, data.RO_NBR, {
          format: "CODE128",
          width: 20,
          height: 50,
          displayValue: false,
        });

        docDefinition = {
          defaultStyle: {
            font: "angsanaUPC",
            fontSize: 16,
            columnGap: 10,
          },
          pageSize: "A4",
          pageMargins: [40, 25, 50, 50],
          styles: {
            title: { fontSize: 24, alignment: "center" },
            titleSub: { fontSize: 18, alignment: "center" },
            titleDate: { fontSize: 14, alignment: "left", bold: true },
            content: { fontSize: 14, alignment: "left", bold: true },
            subcontent: { fontSize: 14, alignment: "center" },
            list: { fontSize: 14, alignment: "center" },
            tableExample: {
              margin: [0, 0, 0, 0],
            },
            tableHeader: { fontSize: 16, alignment: "center", bold: true },
            tablebody: { fontSize: 14, alignment: "center" },
          },
          content: [
            {
              columns: [
                {
                  text: "ใบยืมอุปกรณ์\n",
                  style: "title",
                  width: 291,
                  alignment: "right",
                },
                { text: "", style: "title", width: 68 },
                {
                  image: canvas.toDataURL("image/png"),
                  width: 132,
                  height: 45,
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "หน่วยงาน", style: "content", width: 40 },
                {
                  text: vm.config,
                  style: "subcontent",
                  width: 283,
                  alignment: "left",
                },
                {
                  text: "เลขที่ใบยืม",
                  style: "content",
                  width: 77,
                  alignment: "right",
                },
                {
                  text: data.RO_NBR,
                  style: "subcontent",
                  width: "auto",
                  alignment: "right",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "เบอร์โทรศัพท์", style: "content", width: 55 },
                {
                  text: vm.comp_tel,
                  style: "subcontent",
                  width: 283,
                  alignment: "left",
                },
                {
                  text: "วันที่ยืม",
                  style: "content",
                  width: 62,
                  alignment: "right",
                },
                {
                  text: response.data.data[0].loan,
                  style: "subcontent",
                  width: "auto",
                  alignment: "right",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                {
                  text: "กำหนดคืน\n\n",
                  style: "content",
                  width: 420,
                  alignment: "right",
                },
                {
                  text: response.data.data[0].re,
                  style: "subcontent",
                  width: "auto",
                  alignment: "right",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "ผู้มีสิทธิ์ยืม", style: "content", width: "auto" },
                {
                  text: response.data.data[0].CASE_ID,
                  style: "subcontent",
                  width: 125,
                  alignment: "left",
                },
                {
                  text: "รหัสบัตรประชาชน",
                  style: "content",
                  width: 75,
                  alignment: "left",
                },
                {
                  text: response.data.data[0].cmad_citizen,
                  style: "subcontent",
                  width: 100,
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                {
                  text: response.data.data[0].cmad_phone,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "ที่อยู่", style: "content", width: 40 },
                {
                  text: vm.cmad_line,
                  width: 321,
                  style: "subcontent",
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                {
                  text: response.data.data[0].cmad_phone2,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 2,
              columns: [
                { text: "Hn", style: "content", width: 40, alignment: "left" },
                {
                  text: response.data.data[0].cmad_hn,
                  style: "subcontent",
                  width: 125,
                  alignment: "left",
                },
                { text: "Ward", style: "content", width: "auto" },
                {
                  text: response.data.data[0].cmad_ward,
                  style: "subcontent",
                  width: "*",
                  alignment: "left",
                },
              ],
            },
          ],
        };

        if (response.data.data2.length > 0) {
          let data2 = [
            {
              lineHeight: 1.2,
              columns: [
                { text: "ผู้ยืม", style: "content", width: 40 },
                {
                  text: response.data.data2[0].CASE_ID,
                  style: "subcontent",
                  width: 125,
                  alignment: "left",
                },
                {
                  text: "รหัสบัตรประชาชน",
                  style: "content",
                  width: 76,
                  alignment: "left",
                },
                {
                  text: response.data.data2[0].cmad_citizen,
                  style: "subcontent",
                  width: 100,
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                {
                  text: response.data.data2[0].cmad_phone,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "ที่อยู่", style: "content", width: 40 },
                {
                  text: vm.cmad_line2,
                  width: 321,
                  style: "subcontent",
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                {
                  text: response.data.data2[0].cmad_phone2,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 2,
              columns: [
                {
                  text: "เกี่ยวข้องกับผู้มีสิทธิ์ยืม",
                  style: "content",
                  width: 90,
                  alignment: "left",
                },
                {
                  text: response.data.data2[0].cmad_rlts,
                  style: "subcontent",
                  width: "*",
                  alignment: "left",
                },
              ],
            },
          ];

          docDefinition.content = docDefinition.content.concat(data2);
        }

        if (response.data.data3.length > 0) {
          let data3 = [
            {
              lineHeight: 1.2,
              columns: [
                { text: "ผู้รับรอง", style: "content", width: 40 },
                {
                  text: response.data.data3[0].CASE_ID,
                  style: "subcontent",
                  width: 321,
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 1", style: "content", width: 60 },
                {
                  text: response.data.data3[0].cmad_phone,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 1.2,
              columns: [
                { text: "ที่อยู่", style: "content", width: 40 },
                {
                  text: vm.cmad_line3,
                  width: 321,
                  style: "subcontent",
                  alignment: "left",
                },
                { text: "เบอร์โทรศัพท์ 2", style: "content", width: 60 },
                {
                  text: response.data.data3[0].cmad_phone2,
                  style: "subcontent",
                  width: "auto",
                  alignment: "center",
                },
              ],
            },
            {
              lineHeight: 2,
              columns: [
                {
                  text: "ตำแหน่ง",
                  style: "content",
                  width: 40,
                  alignment: "left",
                },
                {
                  text: response.data.data3[0].cmad_pos,
                  style: "subcontent",
                  width: 125,
                  alignment: "left",
                },
                {
                  text: "สังกัด",
                  style: "content",
                  width: 30,
                  alignment: "left",
                },
                {
                  text: response.data.data3[0].cmad_attn,
                  style: "subcontent",
                  width: 260,
                  alignment: "left",
                },
              ],
            },
          ];

          docDefinition.content = docDefinition.content.concat(data3);
        }

        // Head Table
        docDefinition.content.push({
          lineHeight: 1.5,
          columns: [
            {
              text: "รายการอุปกรณ์ที่ต้องการยืมมีดังนี้",
              style: "content",
              width: "auto",
            },
          ],
        });

        let table = {
          style: "tableExample",
          table: {
            widths: [70, 125, 112, 35, 40, 50],
            headerRows: 1,
            body: [
              [
                { text: "รหัสอุปกรณ์", style: "tableHeader" },
                { text: "รายละเอียด", style: "tableHeader" },
                { text: "เลขที่ครุภัณฑ์", style: "tableHeader" },
                { text: "จำนวน", style: "tableHeader" },
                { text: "เงินมัดจำ", style: "tableHeader" },
                { text: "กำหนดคืน", style: "tableHeader" },
              ],
            ],
          },
          layout: "headerLineOnly",
        };

        let qty = 0;
        let totaldepositi = 0;
        let depositi = 0;
        response.data.data.forEach(function (row, index) {
          // รพ.ภข.6515-003-4407/11-62
          // row.ast_inv_nbr
          let array = [
            { text: row.ro_id, style: "tablebody" },
            { text: row.ro_desc, alignment: "left", style: "tablebody" },
            { text: row.ast_inv_nbr, style: "tablebody" },
            { text: 1, style: "tablebody" },
            {
              text: $filter("number")(row.ro_deposit, 2),
              alignment: "right",
              style: "tablebody",
            },
            { text: row.dateitems, style: "tablebody" },
          ];
          table.table.body.push(array);
          depositi += parseFloat(row.ro_deposit);
        });
        qty += response.data.data.length;
        totaldepositi += depositi;

        docDefinition.content.push(table);

        docDefinition.content.push({
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
            widths: [266, 75, 23, 54, 46, 0],
            body: [
              [
                { text: "", border: [false, false, false, false] },
                { text: "รวม", alignment: "left", style: "tablebody" },
                {
                  text: $filter("number")(qty),
                  alignment: "center",
                  style: "tablebody",
                },
                {
                  text: $filter("number")(totaldepositi, 2),
                  alignment: "right",
                  style: "tablebody",
                },
                "",
                "",
              ],
              [
                { text: "", border: [false, false, false, false] },
                "",
                "",
                "",
                "",
                "",
              ],
            ],
          },
        });

        let footers = [
          {
            absolutePosition: { x: 50, y: 700 },
            lineHeight: 2.0,
            columns: [
              {
                text: "ผู้มีสิทธิ์ยืมอุปกรณ์............................................(......./......./.......)",
                style: "content",
                width: "auto",
              },
              {
                text: "ผู้ให้ยืมอุปกรณ์.....................................................(......./......./.......)",
                style: "content",
                width: "*",
              },
            ],
          },
          {
            absolutePosition: { x: 50, y: 730 },
            lineHeight: 2.0,
            columns: [
              {
                text: "ผู้รับรอง.............................................................(......./......./.......)",
                style: "content",
                width: "auto",
              },
              {
                text: "ผู้รับเงินมัดจำ.......................................................(......./......./.......)",
                style: "content",
                width: "*",
              },
            ],
          },
          {
            absolutePosition: { x: 50, y: 760 },
            lineHeight: 2.0,
            columns: [
              {
                text: "ผู้คืนอุปกรณ์......................................................(......./......./.......)",
                style: "content",
                width: "auto",
              },
              {
                text: "ผู้รับคืนอุปกรณ์....................................................(......./......./.......)",
                style: "content",
                width: "*",
              },
            ],
          },
        ];

        docDefinition.content.push(footers);

        pdfMake.createPdf(docDefinition).open();
        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }
}

service_find_astController.$inject = [
  "$http",
  "$uibModal",
  "$rootScope",
  "NgTableParams",
  "alertService",
];
function service_find_astController(
  $http,
  $uibModal,
  $rootScope,
  NgTableParams,
  alertService
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.astID1 = astMID1;
  vm.astID2 = astMID2;
  vm.provID1 = provMID1;
  vm.provID2 = provMID2;
  vm.aumpID1 = aumpMID1;
  vm.aumpID2 = aumpMID2;
  vm.siteID1 = siteID1;
  vm.siteID2 = siteID2;
  vm.finding = finding;
  vm.clear = clear;
  vm.array_find = [];

  vm.rp = {
    ast1: null,
    ast2: null,
    prov1: null,
    prov2: null,
    aump1: null,
    aump2: null,
    site1: null,
    site2: null,
  };

  vm.old_rp = {
    ast1: null,
    ast2: null,
    prov1: null,
    prov2: null,
    aump1: null,
    aump2: null,
    site1: null,
    site2: null,
  };

  function finding() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isFind_items",
      it: {
        ast1: vm.rp.ast1 == null ? null : vm.rp.ast1,
        ast2: vm.rp.ast2 == null ? null : vm.rp.ast2,
        prov1: vm.rp.prov1 == null ? null : vm.rp.prov1,
        prov2: vm.rp.prov2 == null ? null : vm.rp.prov2,
        aump1: vm.rp.aump1 == null ? null : vm.rp.aump1,
        aump2: vm.rp.aump2 == null ? null : vm.rp.aump2,
        site1: vm.rp.site1 == null ? null : vm.rp.site1,
        site2: vm.rp.site2 == null ? null : vm.rp.site2,
      },
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        if (response.data.status == true) {
          vm.array_find = response.data.data;
          vm.table_find = new NgTableParams(
            {},
            {
              dataset: response.data.data,
            }
          );
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

  function clear() {
    vm.rp = angular.copy(vm.old_rp);
  }

  function astMID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_astMID1.modal",
      controller: "find_astMID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {},
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.ast1 = result;
      },
      function () {}
    );
  }

  function astMID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_astMID2.modal",
      controller: "find_astMID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {},
      },
    });

    modal.result.then(
      function (result) {
        vm.rp.ast2 = result;
      },
      function () {}
    );
  }

  function provMID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_provMID1.modal",
      controller: "find_provMID1Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {},
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }

  function provMID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_provMID2.modal",
      controller: "find_provMID2Controller",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {},
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }

  function aumpMID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_aumpMID1.modal",
      controller: "find_aumpMID1Controller",
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }

  function aumpMID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_aumpMID2.modal",
      controller: "find_aumpMID2Controller",
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }

  function siteID1() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_siteID1.modal",
      controller: "find_siteID1Controller",
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }

  function siteID2() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "find_siteID2.modal",
      controller: "find_siteID2Controller",
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
          ast1: vm.rp.ast1,
          ast2: vm.rp.ast2,
        };
      },
      function () {}
    );
  }
}

service_returnedItemsController.$inject = [
  "$timeout",
  "$q",
  "$http",
  "$uibModal",
  "$state",
  "$rootScope",
  "$stateParams",
  "alertService",
];
function service_returnedItemsController(
  $timeout,
  $q,
  $http,
  $uibModal,
  $state,
  $rootScope,
  $stateParams,
  alertService
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.checkboxAll = checkboxAll;
  vm.checkboxONCE = checkboxONCE;
  vm.returned_item = returned_item;
  vm.reVals_returen = reVals_returen;
  vm.showIMG = MDshowIMG;

  callBack();
  function callBack() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isMDDetail",
      it: $stateParams.nbr,
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.array_picpath = [];
        vm.selected = [];
        vm.saLL = false;
        vm.result = response.data.data[0];
        vm.items = response.data.data;
        vm.path_mstr = response.data.pic_path;
        vm.noNBR = $stateParams.nbr;
        vm.inv_status = vm.result.INV_STATUS;

        for (let i = 0; i < vm.items.length; i++) {
          angular.merge(vm.items[i], { ro_pic_new: "dist/img/logo/img.png" });
          angular.merge(vm.items[i], { ro_pic_old: "dist/img/logo/img.png" });
          if (vm.items[i].ro_active_stat == "BORROW") {
            if (vm.path_mstr.length != 0) {
              for (let x = 0; x < vm.path_mstr.length; x++) {
                // รูป
                if (vm.items[i].ro_id == vm.path_mstr[x].PIC_PART) {
                  if (vm.path_mstr[x].PIC_DESC == "BORROW") {
                    let mess =
                      "http://thbes.net/server/storages/BORROW/" +
                      vm.path_mstr[x].PIC_CONFIG +
                      "/" +
                      vm.path_mstr[x].PIC_STORE;
                    // let mess = "http://192.168.9.254/Borrow/server/storages/BORROW/" + vm.path_mstr[x].PIC_CONFIG + "/" + vm.path_mstr[x].PIC_STORE;
                    angular.merge(vm.items[i], { ro_pic_old: mess });
                  }
                }
              }
            }
            vm.selected[i] = false;
          } else {
            // คืนของแล้ว
            if (vm.path_mstr.length != 0) {
              for (let x = 0; x < vm.path_mstr.length; x++) {
                // รูป
                if (vm.items[i].ro_id == vm.path_mstr[x].PIC_PART) {
                  if (vm.path_mstr[x].PIC_DESC == "BORROW") {
                    let mess =
                      "http://thbes.net/server/storages/BORROW/" +
                      vm.path_mstr[x].PIC_CONFIG +
                      "/" +
                      vm.path_mstr[x].PIC_STORE;
                    // let mess = "http://192.168.9.254/Borrow/server/storages/BORROW/" + vm.path_mstr[x].PIC_CONFIG + "/" + vm.path_mstr[x].PIC_STORE;
                    angular.merge(vm.items[i], { ro_pic_old: mess });
                  } else if (vm.path_mstr[x].PIC_DESC == "RETURNED") {
                    let mess =
                      "http://thbes.net/server/storages/RETURNED/" +
                      vm.path_mstr[x].PIC_CONFIG +
                      "/" +
                      vm.path_mstr[x].PIC_STORE;
                    // let mess = "http://192.168.9.254/Borrow/server/storages/RETURNED/" + vm.path_mstr[x].PIC_CONFIG + "/" + vm.path_mstr[x].PIC_STORE;
                    vm.array_picpath.push(mess);
                    angular.merge(vm.items[i], { ro_pic_new: mess });
                  }
                }
              }
            }
          }
        }

        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function checkboxAll() {
    for (let id in vm.selected) {
      if (vm.selected.hasOwnProperty(id)) {
        vm.selected[id] = vm.saLL;
      }
    }
  }

  function checkboxONCE() {
    for (let id in vm.selected) {
      if (vm.selected.hasOwnProperty(id)) {
        if (!vm.selected[id]) {
          vm.saLL = false;
          return;
        }
      }
    }
    vm.saLL = true;
  }

  function returned_item() {
    alertService.confrim("คุณต้องการคืนอุปกรณ์ หรือไม่ ? ", function (value) {
      if (value) {
        if (vm.selected.includes(true)) {
          vm.dataXx = [];
          for (let i = 0; i < vm.selected.length; i++) {
            if (vm.selected[i] == true) {
              vm.dataXx.push(vm.items[i]);
            }
          }

          vm.cn = 0;
          for (let i = 0; i < vm.items.length; i++) {
            if (vm.items[i].ro_active_stat == "BORROW") {
              vm.cn++;
            }
          }

          let req = {
            auth: $rootScope.globals.auth,
            mod: "isReturned_itemX",
            it: vm.dataXx,
            nbr: vm.noNBR,
            status: vm.cn == vm.dataXx.length ? true : false,
          };

          let cancellerLoadpic = $q.defer();
          $timeout(function () {
            cancellerLoadpic.resolve("user cancelled");
          }, 3000);

          $rootScope.loading = true;
          $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
            function (response) {
              if (response.data.status == "Ok") {
                let msg = "บันทึกข้อมูลเรียบร้อย";
                alertService.confrim_success(msg, function (e) {
                  if (e) {
                    $state.go("app.lend.service_lend_addList");
                  }
                });
              } else {
                callBack();
              }

              $rootScope.loading = false;
            },
            function (response) {
              $http.post(url, req).then(
                function (response) {
                  if (response.data.status == "Ok") {
                    let msg = "บันทึกข้อมูลเรียบร้อย";
                    alertService.confrim_success(msg, function (e) {
                      if (e) {
                        $state.go("app.lend.service_lend_addList");
                      }
                    });
                  } else {
                    callBack();
                  }

                  $rootScope.loading = false;
                },
                function (response) {
                  alertService.warning("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                  $rootScope.loading = false;
                }
              );
            }
          );
        } else {
          alertService.warning("เลือกรายการคืนอุปกรณ์");
        }
      }
    });
  }

  angular
    .element(document.querySelector("#fileInput"))
    .on("change", handleFileSelect);
  function handleFileSelect(evt) {
    var file = evt.currentTarget.files[0];
    if (file) {
      let modal = $uibModal.open({
        animation: true,
        templateUrl: "SETreturned_upload.modal",
        controller: "SETreturned_uploadController",
        controllerAs: "vm",
        size: "md",
        backdropClass: "backdrop",
        resolve: {
          items: function () {
            return { evt: evt, index: vm.indexxX, it: vm.itxX };
          },
        },
      });

      modal.result.then(
        function (result) {
          let newBASE64 = result.base64;
          let indexX = result.index;
          vm.array_picpath[indexX] = newBASE64;
          for (let i = 0; i < vm.items.length; i++) {
            angular.merge(vm.items[i], { ro_pic_new: vm.array_picpath[i] });
          }
        },
        function () {}
      );
    }
  }

  function reVals_returen(it, index) {
    vm.indexxX = index;
    vm.itxX = it;
    angular.forEach(
      angular.element("input[type='file']"),
      function (inputElem) {
        angular.element(inputElem).val(null);
      }
    );
  }

  function MDshowIMG(pic) {
    if (pic != "dist/img/logo/img.png" && pic != undefined) {
      let modal = $uibModal.open({
        animation: true,
        templateUrl: "MDshowIMG.modal",
        controller: "MDshowIMGController",
        controllerAs: "vm",
        size: "md",
        backdropClass: "backdrop",
        resolve: {
          items: function () {
            return pic;
          },
        },
      });

      modal.result.then(
        function (result) {},
        function () {}
      );
    }
  }
}

service_lend_renew_expController.$inject = [
  "alertService",
  "$filter",
  "$stateParams",
  "$rootScope",
  "$http",
  "$scope",
  "$state",
];
function service_lend_renew_expController(
  alertService,
  $filter,
  $stateParams,
  $rootScope,
  $http,
  $scope,
  $state
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.options = [
    { id: "1", text: "3 เดือน", group: "" },
    { id: "2", text: "6 เดือน", group: "" },
    { id: "3", text: "9 เดือน", group: "" },
    { id: "4", text: "12 เดือน", group: "" },
  ];
  $scope.loop_date = [];
  $scope.loop_up = [];
  vm.constDateItem = [];
  vm.renewNBR = $stateParams.nbr;
  vm.state = $stateParams.state;
  vm.returned_calendar = returned_calendar;
  vm.loopIndex_calendar = loopIndex_calendar;
  $scope.returned_up = { opened: false };
  $scope.returned_dateOptions = {
    minDate: new Date(),
    formatYear: "yy",
    startingDay: 1,
  };

  $scope.loop_dateOptions = {
    minDate: new Date(),
    formatYear: "yy",
    startingDay: 1,
  };

  function returned_calendar() {
    $scope.returned_up.opened = true;
  }

  function loopIndex_calendar(e) {
    $scope.loop_up[e].opened = true;
  }

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isDataitemExp",
    state: vm.state,
    it: vm.renewNBR,
  };

  $http.post(url, req).then(
    function (response) {
      vm.inv_status = response.data.data[0].INV_STATUS;
      vm.loan = response.data.data[0].loan;
      vm.items = response.data.data;
      vm.fomatDate = response.data.data[0].re;
      vm.constDate = new Date(vm.fomatDate); // แปลงค่า เก็บไว้ใช้เป็นค่าคงที่
      $scope.returned_date = new Date(vm.fomatDate); // แปลงค่า เปลี่ยนไปตาม selected
      response.data.data[0].ro_count_exp == null ||
      response.data.data[0].ro_count_exp == ""
        ? (vm.countExp = 0)
        : (vm.countExp = response.data.data[0].ro_count_exp);
      for (let i = 0; i < vm.items.length; i++) {
        $scope.loop_up.push({ opened: false });
        vm.constDateItem.push(new Date(vm.items[i].dateitems));
        $scope.loop_date.push(new Date(vm.items[i].dateitems));
      }
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  vm.select_exp = function () {
    $scope.loop_date = [];
    let setDate = $filter("date")(vm.constDate, "yyyy/MM/dd");
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isADDdateExp",
      it: { DATE: setDate, ID: vm.manday },
    };

    $http.post(url, req).then(
      function (response) {
        for (let i = 0; i < vm.items.length; i++) {
          $scope.returned_date = new Date(response.data.DATE);
          $scope.loop_date.push(new Date(response.data.DATE));
        }
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  };

  vm.save = function () {
    if (vm.manday != undefined) {
      alertService.confrim("คุณต้องการต่ออายุอุปกรณ์ หรือไม่ ? ", function (e) {
        if (e) {
          for (let i = 0; i < vm.items.length; i++) {
            angular.merge(vm.items[i], {
              ro_item_exp: $filter("date")($scope.loop_date[i], "dd/MM/yyyy"),
            });
          }
          let paramDate = $filter("date")($scope.returned_date, "dd/MM/yyyy");
          let req = {
            auth: $rootScope.globals.auth,
            mod: "isSaveRenewExp",
            manday: vm.manday,
            nbr: vm.renewNBR,
            DateExp: paramDate,
            it: vm.items,
          };

          $http.post(url, req).then(
            function (response) {
              if (response.data.status == "Ok") {
                let msg = "บันทึกข้อมูลเรียบร้อย";
                alertService.confrim_success(msg, function (e) {
                  if (e) {
                    $state.go("app.lend.service_lend_addList");
                  }
                });
              } else {
                let msg = "ไม่สามารถต่ออายุ เนื่องจากทำรายการคืนแล้ว";
                alertService.warning(msg);
                $state.go("app.lend.service_lend_addList");
              }
            },
            function (response) {
              $rootScope.loading = false;
            }
          );
        }
      });
    } else {
      let msg = "กรุณาเลือกรูปแบบต่ออายุ";
      alertService.warning(msg);
    }
  };
}

MDselList_AController.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "$rootScope",
  "$http",
];
function MDselList_AController(
  $uibModalInstance,
  NgTableParams,
  $rootScope,
  $http
) {
  const url = "server/models/service_lends.php";
  let vm = this;
  vm.applyGlobalSearch_MDA = MDAapplyGlobalSearch;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isData_MDA",
  };
  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_MDA = response.data.data;
      vm.table_A = new NgTableParams(
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

  function MDAapplyGlobalSearch() {
    let term_A = vm.globalSearchTerm_MDA;
    vm.table_A.filter({ $: term_A });
  }

  vm.clickA = function (info) {
    $uibModalInstance.close(info);
  };
}

MDselList_BController.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
  "$rootScope",
  "$http",
];
function MDselList_BController(
  $uibModalInstance,
  NgTableParams,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_MDB = MDBapplyGlobalSearch;
  let req = {
    auth: $rootScope.globals.auth,
    mod: "isData_MDB",
    it: items,
  };
  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_MDB = response.data.data;
      vm.table_B = new NgTableParams(
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

  function MDBapplyGlobalSearch() {
    let term_B = vm.globalSearchTerm_MDB;
    vm.table_B.filter({ $: term_B });
  }

  vm.clickB = function (info) {
    $uibModalInstance.close(info);
  };
}

MDselList_CController.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "items",
  "$rootScope",
  "$http",
];
function MDselList_CController(
  $uibModalInstance,
  NgTableParams,
  items,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_MDC = MDCapplyGlobalSearch;
  let req = {
    auth: $rootScope.globals.auth,
    mod: "isData_MDC",
    it: items,
  };
  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_MDC = response.data.data;
      vm.table_C = new NgTableParams(
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

  function MDCapplyGlobalSearch() {
    let term_C = vm.globalSearchTerm_MDC;
    vm.table_C.filter({ $: term_C });
  }

  vm.clickC = function (info) {
    $uibModalInstance.close(info);
  };
}

MDselList_itemsController.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "$rootScope",
  "$http",
];
function MDselList_itemsController(
  $uibModalInstance,
  NgTableParams,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_MDitems = MDitemsapplyGlobalSearch;
  let req = {
    auth: $rootScope.globals.auth,
    mod: "isData_MDitems",
  };
  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.items_data = response.data.data;
      vm.table_items = new NgTableParams(
        { count: 5 },
        {
          counts: [5, 10, 20, 50, 100],
          dataset: vm.items_data,
        }
      );

      $rootScope.loading = false;
    },
    function (response) {
      $rootScope.loading = false;
    }
  );

  function MDitemsapplyGlobalSearch() {
    let term_items = vm.globalSearchTerm_MDitems;
    vm.table_items.filter({ $: term_items });
  }

  vm.clickitems = function (info) {
    $uibModalInstance.close(info);
  };
}

MDshowIMGController.$inject = ["$uibModalInstance", "items", "$scope"];
function MDshowIMGController($uibModalInstance, items, $scope) {
  let vm = this;
  $scope.Modal_IMG = items;
  vm.showIMG = function () {
    $uibModalInstance.close();
  };
}

SETuploadController.$inject = ["$uibModalInstance", "items", "$scope"];
function SETuploadController($uibModalInstance, items, $scope) {
  let vm = this;
  let fileimg = items.evt.currentTarget.files[0];
  let position = items.index;
  let its = items.it;
  $scope.myImage = "";
  $scope.myCroppedImage = "";

  var reader = new FileReader();
  reader.onload = function (items) {
    $scope.$apply(function ($scope) {
      $scope.myImage = items.target.result;
    });
  };
  reader.readAsDataURL(fileimg);

  vm.selectIMG = function () {
    let sorting = { base64: $scope.myCroppedImage, index: position, it: its };
    $uibModalInstance.close(sorting);
  };
}

SETreturned_uploadController.$inject = ["$uibModalInstance", "items", "$scope"];
function SETreturned_uploadController($uibModalInstance, items, $scope) {
  let vm = this;
  let fileimg = items.evt.currentTarget.files[0];
  let position = items.index;
  let its = items.it;
  $scope.myImage = "";
  $scope.myCroppedImage = "";

  var reader = new FileReader();
  reader.onload = function (items) {
    $scope.$apply(function ($scope) {
      $scope.myImage = items.target.result;
    });
  };
  reader.readAsDataURL(fileimg);

  vm.selectIMG = function () {
    let sorting = { base64: $scope.myCroppedImage, index: position, it: its };
    $uibModalInstance.close(sorting);
  };
}

find_astMID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "$rootScope",
  "$http",
];
function find_astMID1Controller(
  NgTableParams,
  $uibModalInstance,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_ast1 = ast1applyGlobalSearch;
  vm.click_ast1 = ast1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isFind_ast1",
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_ast1 = response.data;
      vm.table_ast1 = new NgTableParams(
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

  function ast1applyGlobalSearch() {
    let term_ast1 = vm.globalSearchTerm_ast1;
    vm.table_ast1.filter({ $: term_ast1 });
  }

  function ast1(info) {
    $uibModalInstance.close(info);
  }
}

find_astMID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "$rootScope",
  "$http",
];
function find_astMID2Controller(
  NgTableParams,
  $uibModalInstance,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_ast2 = ast2applyGlobalSearch;
  vm.click_ast2 = ast2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isFind_ast2",
  };

  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.List_ast2 = response.data;
      vm.table_ast2 = new NgTableParams(
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

  function ast2applyGlobalSearch() {
    let term_ast2 = vm.globalSearchTerm_ast2;
    vm.table_ast2.filter({ $: term_ast2 });
  }

  function ast2(info) {
    $uibModalInstance.close(info);
  }
}

find_provMID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "$rootScope",
  "$http",
];
function find_provMID1Controller(
  NgTableParams,
  $uibModalInstance,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_prov1 = prov1applyGlobalSearch;
  vm.click_prov1 = prov1;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isFind_prov1",
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

find_provMID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "$rootScope",
  "$http",
];
function find_provMID2Controller(
  NgTableParams,
  $uibModalInstance,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch_prov2 = prov2applyGlobalSearch;
  vm.click_prov2 = prov2;

  let req = {
    auth: $rootScope.globals.auth,
    mod: "isFind_prov2",
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

find_aumpMID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function find_aumpMID1Controller(
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
    mod: "isFind_aump1",
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

find_aumpMID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function find_aumpMID2Controller(
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
    mod: "isFind_aump2",
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

find_siteID1Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function find_siteID1Controller(
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
    mod: "isFind_site1",
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

find_siteID2Controller.$inject = [
  "NgTableParams",
  "$uibModalInstance",
  "items",
  "$rootScope",
  "$http",
];
function find_siteID2Controller(
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
    mod: "isFind_site2",
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
