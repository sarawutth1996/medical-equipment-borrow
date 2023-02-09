angular
  .module("app.record")
  .controller("signup_lendsController", signup_lendsController)
  .controller("signup_lends_addListController", signup_lends_addListController)
  .controller("List_patientController", List_patientController);

signup_lendsController.$inject = [
  "$uibModal",
  "$http",
  "$rootScope",
  "alertService",
  "$filter",
  "$stateParams",
  "$timeout",
  "$state",
  "$scope",
];
function signup_lendsController(
  $uibModal,
  $http,
  $rootScope,
  alertService,
  $filter,
  $stateParams,
  $timeout,
  $state,
  $scope
) {
  const url = "api-url";
  let vm = this;
  vm.id = " ";
  vm.Box = [];
  vm.BHList = [];
  vm.pushPROV = prov;
  vm.pushAUMP = aump;
  vm.pushDIST = dist;
  vm.clear = clear;
  vm.save = save;
  vm.delItems = delItems;
  vm.radio = radio;
  vm.calendar = calendar;
  vm.modal_list = modal_list;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.isBoolean = false;
  vm.data = {
    hpt: "",
    hn: "",
    ward: "",
    disease: "",
    type: "",
    fullname: "",
    title: "",
    date: "",
    citizen: "",
    addressNo: "",
    villNo: "",
    villName: "",
    room: "",
    floor: "",
    building: "",
    troksoi: "",
    road: "",
    province: "",
    province_code: "",
    county: "",
    county_code: "",
    district: "",
    district_code: "",
    zipcode: "",
    tel1: "",
    tel2: "",
    fax: "",
    pos: "",
    division: "",
    site: $rootScope.globals.profile.site,
  };

  let oData = {
    hn: "",
    ward: "",
    disease: "",
    type: "",
    fullname: "",
    title: "",
    date: "",
    citizen: "",
    addressNo: "",
    villNo: "",
    villName: "",
    room: "",
    floor: "",
    building: "",
    troksoi: "",
    road: "",
    province: "",
    province_code: "",
    county: "",
    county_code: "",
    district: "",
    district_code: "",
    zipcode: "",
    tel1: "",
    tel2: "",
    fax: "",
    pos: "",
    division: "",
    site: $rootScope.globals.profile.site,
  };

  $scope.options = [
    { id: "1", text: "คุณ", group: "" },
    { id: "2", text: "คุณหญิง", group: "" },
    { id: "3", text: "คุณหญิง พ.อ.หญิง", group: "" },
    { id: "4", text: "จ.ต.", group: "" },
    { id: "5", text: "จ.ต.หญิง", group: "" },
    { id: "6", text: "จ.ท.", group: "" },
    { id: "7", text: "จ.ท.หญิง", group: "" },
    { id: "8", text: "จ.ส.", group: "" },
    { id: "9", text: "จ.ส.หญิง", group: "" },
    { id: "10", text: "จ.ส.ต.", group: "" },
    { id: "11", text: "จ.ส.ต.หญิง", group: "" },
    { id: "12", text: "จ.ส.ท.", group: "" },
    { id: "13", text: "จ.ส.ท.หญิง", group: "" },
    { id: "14", text: "จ.ส.อ.", group: "" },
    { id: "15", text: "จ.ส.อ. ม.ร.ว.", group: "" },
    { id: "16", text: "จ.ส.อ. ม.ล.", group: "" },
    { id: "17", text: "จ.ส.อ.หญิง", group: "" },
    { id: "18", text: "จ.อ.", group: "" },
    { id: "19", text: "จ.อ.หญิง", group: "" },
    { id: "20", text: "จ.อ.หญิง ม.ล.หญิง", group: "" },
    { id: "21", text: "ด.ช.", group: "" },
    { id: "22", text: "ด.ญ.", group: "" },
    { id: "23", text: "ด.ต.", group: "" },
    { id: "24", text: "ด.ต. ม.ล.", group: "" },
    { id: "25", text: "ด.ต.หญิง", group: "" },
    { id: "26", text: "ด.หญิง", group: "" },
    { id: "27", text: "ดร.", group: "" },
    { id: "28", text: "ท.ญ.", group: "" },
    { id: "29", text: "ท.ญ. หม่อม", group: "" },
    { id: "30", text: "ท.พ.", group: "" },
    { id: "31", text: "ท่านผู้หญิง", group: "" },
    { id: "32", text: "ท่านผู้หญิง ม.ร.ว.หญิง", group: "" },
    { id: "33", text: "น.ต.", group: "" },
    { id: "34", text: "น.ต. ดร.", group: "" },
    { id: "35", text: "น.ต. น.พ.", group: "" },
    { id: "36", text: "น.ต. ม.จ.", group: "" },
    { id: "37", text: "น.ต. ม.ล.", group: "" },
    { id: "38", text: "น.ต.หญิง", group: "" },
    { id: "39", text: "น.ต.หญิง พ.ญ.", group: "" },
    { id: "40", text: "น.ต.หญิง ม.ล.หญิง", group: "" },
    { id: "41", text: "น.ท.", group: "" },
    { id: "42", text: "น.ท. น.พ.", group: "" },
    { id: "43", text: "น.ท. ม.ล.", group: "" },
    { id: "44", text: "น.ท. หลวง", group: "" },
    { id: "45", text: "น.ท.หญิง", group: "" },
    { id: "46", text: "น.ท.หญิง พ.ญ.", group: "" },
    { id: "47", text: "น.ท.หญิง ม.ล.หญิง", group: "" },
    { id: "48", text: "น.พ.", group: "" },
    { id: "49", text: "น.พ. พ.ต.อ.", group: "" },
    { id: "50", text: "น.พ. ม.ร.ว.", group: "" },
    { id: "51", text: "น.พ. ม.ล.", group: "" },
    { id: "52", text: "น.พ. ร.ท.", group: "" },
    { id: "53", text: "น.อ.", group: "" },
    { id: "54", text: "น.อ. ดร.", group: "" },
    { id: "55", text: "น.อ. น.พ.", group: "" },
    { id: "56", text: "น.อ. ม.จ.", group: "" },
    { id: "57", text: "น.อ. ม.ร.ว.", group: "" },
    { id: "58", text: "น.อ. ม.ล.", group: "" },
    { id: "59", text: "น.อ. ร.ต.", group: "" },
    { id: "60", text: "น.อ. หลวง", group: "" },
    { id: "61", text: "น.อ.(พิเศษ)", group: "" },
    { id: "62", text: "น.อ.(พิเศษ)หญิง", group: "" },
    { id: "63", text: "น.อ.หญิง", group: "" },
    { id: "64", text: "น.อ.หญิง พ.ญ.", group: "" },
    { id: "65", text: "น.อ.หญิง ม.ล.หญิง", group: "" },
    { id: "66", text: "นจอ.", group: "" },
    { id: "67", text: "นนร.", group: "" },
    { id: "68", text: "นนอ.", group: "" },
    { id: "69", text: "นพต.", group: "" },
    { id: "70", text: "นรจ.", group: "" },
    { id: "71", text: "นรต.", group: "" },
    { id: "72", text: "นักเรียนนายสิบ", group: "" },
    { id: "73", text: "นาย", group: "" },
    { id: "74", text: "นาง", group: "" },
    { id: "75", text: "นางสาว", group: "" },
    { id: "76", text: "ผศ.", group: "" },
    { id: "77", text: "ผศ. ดร.", group: "" },
    { id: "78", text: "ผศ. ท.ญ.", group: "" },
    { id: "79", text: "ผศ. ท.พ.", group: "" },
    { id: "80", text: "ผศ. ร.อ.หญิง", group: "" },
    { id: "81", text: "พ.จ.ต.", group: "" },
    { id: "82", text: "พ.จ.ต.หญิง", group: "" },
    { id: "83", text: "พ.จ.ท.", group: "" },
    { id: "84", text: "พ.จ.ท.หญิง", group: "" },
    { id: "85", text: "พ.จ.อ.", group: "" },
    { id: "86", text: "พ.จ.อ. ม.ล.", group: "" },
    { id: "87", text: "พ.จ.อ.หญิง", group: "" },
    { id: "88", text: "พ.จ.อ.หญิง ม.ล.หญิง", group: "" },
    { id: "89", text: "พ.ญ.", group: "" },
    { id: "90", text: "พ.ญ. คุณหญิง", group: "" },
    { id: "91", text: "พ.ญ. ม.ล.หญิง", group: "" },
    { id: "92", text: "พ.ต.", group: "" },
    { id: "93", text: "พ.ต. น.พ.", group: "" },
    { id: "94", text: "พ.ต. พ.ญ.", group: "" },
    { id: "95", text: "พ.ต. ม.จ.", group: "" },
    { id: "96", text: "พ.ต. ม.ร.ว.", group: "" },
    { id: "97", text: "พ.ต. ม.ล.", group: "" },
    { id: "98", text: "พ.ต. หลวง", group: "" },
    { id: "99", text: "พ.ต.ต.", group: "" },
    { id: "100", text: "พ.ต.ต. น.พ.", group: "" },
    { id: "101", text: "พ.ต.ต. ม.ล.", group: "" },
    { id: "102", text: "พ.ต.ต.หญิง", group: "" },
    { id: "103", text: "พ.ต.ต.หญิง พ.ญ.", group: "" },
    { id: "104", text: "พ.ต.ท.", group: "" },
    { id: "105", text: "พ.ต.ท. ดร.", group: "" },
    { id: "106", text: "พ.ต.ท. น.พ.", group: "" },
    { id: "107", text: "พ.ต.ท. ม.ร.ว.", group: "" },
    { id: "108", text: "พ.ต.ท. ม.ล.", group: "" },
    { id: "109", text: "พ.ต.ท.หญิง", group: "" },
    { id: "110", text: "พ.ต.หญิง", group: "" },
    { id: "111", text: "พ.ต.อ.", group: "" },
    { id: "112", text: "พ.ต.อ. น.พ.", group: "" },
    { id: "113", text: "พ.ต.อ. ม.จ.", group: "" },
    { id: "114", text: "พ.ต.อ. ม.ร.ว.", group: "" },
    { id: "115", text: "พ.ต.อ. ม.ล.", group: "" },
    { id: "116", text: "พ.ต.อ.(พิเศษ)", group: "" },
    { id: "117", text: "พ.ต.อ.(พิเศษ)หญิง", group: "" },
    { id: "118", text: "พ.ต.อ.หญิง", group: "" },
    { id: "119", text: "พ.ต.อ.หญิง พ.ญ.", group: "" },
    { id: "120", text: "พ.ต.อ.หญิง ม.ร.ว.หญิง", group: "" },
    { id: "121", text: "พ.ท.", group: "" },
    { id: "122", text: "พ.ท. น.พ.", group: "" },
    { id: "123", text: "พ.ท. ม.จ.", group: "" },
    { id: "124", text: "พ.ท. ม.ร.ว.", group: "" },
    { id: "125", text: "พ.ท. ม.ล.", group: "" },
    { id: "126", text: "พ.ท. หลวง", group: "" },
    { id: "127", text: "พ.ท.หญิง", group: "" },
    { id: "128", text: "พ.ท.หญิง คุณหญิง", group: "" },
    { id: "129", text: "พ.อ.", group: "" },
    { id: "130", text: "พ.อ. ขุน", group: "" },
    { id: "131", text: "พ.อ. ดร.", group: "" },
    { id: "132", text: "พ.อ. น.พ.", group: "" },
    { id: "133", text: "พ.อ. พ.ญ.", group: "" },
    { id: "134", text: "พ.อ. ม.จ.", group: "" },
    { id: "135", text: "พ.อ. ม.ร.ว.", group: "" },
    { id: "136", text: "พ.อ. ม.ล.", group: "" },
    { id: "137", text: "พ.อ. หลวง", group: "" },
    { id: "138", text: "พ.อ.(พิเศษ)", group: "" },
    { id: "139", text: "พ.อ.(พิเศษ)ม.ร.ว.", group: "" },
    { id: "140", text: "พ.อ.(พิเศษ)หญิง", group: "" },
    { id: "141", text: "พ.อ.ต.", group: "" },
    { id: "142", text: "พ.อ.ต.หญิง", group: "" },
    { id: "143", text: "พ.อ.ท.", group: "" },
    { id: "144", text: "พ.อ.ท.หญิง", group: "" },
    { id: "145", text: "พ.อ.หญิง", group: "" },
    { id: "146", text: "พ.อ.หญิง คุณหญิง", group: "" },
    { id: "147", text: "พ.อ.หญิง ท.ญ.", group: "" },
    { id: "148", text: "พ.อ.หญิง พ.ญ.", group: "" },
    { id: "149", text: "พ.อ.หญิง ม.ล.หญิง", group: "" },
    { id: "150", text: "พ.อ.อ.", group: "" },
    { id: "151", text: "พ.อ.อ. ม.ร.ว.", group: "" },
    { id: "152", text: "พ.อ.อ. ม.ล.", group: "" },
    { id: "153", text: "พ.อ.อ.หญิง", group: "" },
    { id: "154", text: "พลฯ", group: "" },
    { id: "155", text: "พลฯ พิเศษ", group: "" },
    { id: "156", text: "พลฯ พิเศษหญิง", group: "" },
    { id: "157", text: "พลฯ สมัคร", group: "" },
    { id: "158", text: "พลฯ สมัครหญิง", group: "" },
    { id: "159", text: "พลฯ สำรอง", group: "" },
    { id: "160", text: "พลฯ สำรองพิเศษ", group: "" },
    { id: "161", text: "พลฯ สำรองพิเศษหญิง", group: "" },
    { id: "162", text: "พลฯ สำรองหญิง", group: "" },
    { id: "163", text: "พล.ต.", group: "" },
    { id: "164", text: "พล.ต. น.พ.", group: "" },
    { id: "165", text: "พล.ต. ม.จ.", group: "" },
    { id: "166", text: "พล.ต. ม.ร.ว.", group: "" },
    { id: "167", text: "พล.ต. ม.ล.", group: "" },
    { id: "168", text: "พล.ต.ต.", group: "" },
    { id: "169", text: "พล.ต.ต. น.พ.", group: "" },
    { id: "170", text: "พล.ต.ต. ม.ร.ว.", group: "" },
    { id: "171", text: "พล.ต.ต. หลวง", group: "" },
    { id: "172", text: "พล.ต.ต.หญิง", group: "" },
    { id: "173", text: "พล.ต.ท.", group: "" },
    { id: "174", text: "พล.ต.ท. หลวง", group: "" },
    { id: "175", text: "พล.ต.หญิง", group: "" },
    { id: "176", text: "พล.ต.อ.", group: "" },
    { id: "177", text: "พล.ท.", group: "" },
    { id: "178", text: "พล.ท. น.พ.", group: "" },
    { id: "179", text: "พล.ท. ม.จ.", group: "" },
    { id: "180", text: "พล.ท. ม.ร.ว.", group: "" },
    { id: "181", text: "พล.ท. ม.ล.", group: "" },
    { id: "182", text: "พล.ท. หลวง", group: "" },
    { id: "183", text: "พล.ร.ต.", group: "" },
    { id: "184", text: "พล.ร.ต. ม.จ.", group: "" },
    { id: "185", text: "พล.ร.ต. ม.ร.ว.", group: "" },
    { id: "186", text: "พล.ร.ต. ม.ล.", group: "" },
    { id: "187", text: "พล.ร.ต. หลวง", group: "" },
    { id: "188", text: "พล.ร.ต.หญิง", group: "" },
    { id: "189", text: "พล.ร.ท.", group: "" },
    { id: "190", text: "พล.ร.ท. หลวง", group: "" },
    { id: "191", text: "พล.ร.อ.", group: "" },
    { id: "192", text: "พล.ร.อ. ม.จ.", group: "" },
    { id: "193", text: "พล.ร.อ. ม.ร.ว.", group: "" },
    { id: "194", text: "พล.ร.อ. หลวง", group: "" },
    { id: "195", text: "พล.อ.", group: "" },
    { id: "196", text: "พล.อ. ม.ล.", group: "" },
    { id: "197", text: "พล.อ. หลวง", group: "" },
    { id: "198", text: "พล.อ.ต.", group: "" },
    { id: "199", text: "พล.อ.ต. น.พ.", group: "" },
    { id: "200", text: "พล.อ.ต. ม.ร.ว.", group: "" },
    { id: "201", text: "พล.อ.ต. ม.ล.", group: "" },
    { id: "202", text: "พล.อ.ต.หญิง", group: "" },
    { id: "203", text: "พล.อ.ท.", group: "" },
    { id: "204", text: "พล.อ.ท. ม.ร.ว.", group: "" },
    { id: "205", text: "พล.อ.ท. ม.ล.", group: "" },
    { id: "206", text: "พล.อ.อ.", group: "" },
    { id: "207", text: "พล.อ.อ. ม.ร.ว.", group: "" },
    { id: "208", text: "พลฯหญิง", group: "" },
    { id: "209", text: "ม.ร.ว.", group: "" },
    { id: "210", text: "ม.ร.ว.หญิง", group: "" },
    { id: "211", text: "ม.ล.", group: "" },
    { id: "212", text: "ม.ล.หญิง", group: "" },
    { id: "213", text: "ร.ต.", group: "" },
    { id: "214", text: "ร.ต. น.พ.", group: "" },
    { id: "215", text: "ร.ต. ม.ร.ว.", group: "" },
    { id: "216", text: "ร.ต. ม.ล.", group: "" },
    { id: "217", text: "ร.ต.ต.", group: "" },
    { id: "218", text: "ร.ต.ต. ม.ล.", group: "" },
    { id: "219", text: "ร.ต.ต.หญิง", group: "" },
    { id: "220", text: "ร.ต.ต.หญิง พ.ญ.", group: "" },
    { id: "221", text: "ร.ต.ท.", group: "" },
    { id: "222", text: "ร.ต.ท.หญิง", group: "" },
    { id: "223", text: "ร.ต.หญิง", group: "" },
    { id: "224", text: "ร.ต.หญิง พ.ญ.", group: "" },
    { id: "225", text: "ร.ต.หญิง ม.ล.หญิง", group: "" },
    { id: "226", text: "ร.ต.อ.", group: "" },
    { id: "227", text: "ร.ต.อ. ดร.", group: "" },
    { id: "228", text: "ร.ต.อ. น.พ.", group: "" },
    { id: "229", text: "ร.ต.อ. ม.ร.ว.", group: "" },
    { id: "230", text: "ร.ต.อ. ม.ล.", group: "" },
    { id: "231", text: "ร.ต.อ.หญิง", group: "" },
    { id: "232", text: "ร.ท.", group: "" },
    { id: "233", text: "ร.ท. ดร.", group: "" },
    { id: "234", text: "ร.ท. น.พ.", group: "" },
    { id: "235", text: "ร.ท. ม.จ.", group: "" },
    { id: "236", text: "ร.ท. ม.ล.", group: "" },
    { id: "237", text: "ร.ท.หญิง", group: "" },
    { id: "238", text: "ร.ท.หญิง ม.ล.", group: "" },
    { id: "239", text: "ร.อ.", group: "" },
    { id: "240", text: "ร.อ. ดร.", group: "" },
    { id: "241", text: "ร.อ. น.พ.", group: "" },
    { id: "242", text: "ร.อ. ม.ร.ว.", group: "" },
    { id: "243", text: "ร.อ. ม.ล.", group: "" },
    { id: "244", text: "ร.อ. หลวง", group: "" },
    { id: "245", text: "ร.อ.หญิง", group: "" },
    { id: "246", text: "ร.อ.หญิง พ.ญ.", group: "" },
    { id: "247", text: "ร.อ.หญิง ม.ร.ว.หญิง", group: "" },
    { id: "248", text: "ร.อ.หญิง ม.ล.หญิง", group: "" },
    { id: "249", text: "รศ.", group: "" },
    { id: "250", text: "รศ. ดร.", group: "" },
    { id: "251", text: "รศ. น.พ.", group: "" },
    { id: "252", text: "รศ. พ.จ.อ.", group: "" },
    { id: "253", text: "รศ. พ.ญ.", group: "" },
    { id: "254", text: "รศ. ว่าที่ ร.ต.", group: "" },
    { id: "255", text: "ว่าที่ น.ต.", group: "" },
    { id: "256", text: "ว่าที่ น.ต.หญิง", group: "" },
    { id: "257", text: "ว่าที่ น.ท.", group: "" },
    { id: "258", text: "ว่าที่ น.ท.หญิง", group: "" },
    { id: "259", text: "ว่าที่ น.อ.", group: "" },
    { id: "260", text: "ว่าที่ น.อ.หญิง", group: "" },
    { id: "261", text: "ว่าที่ พ.ต.", group: "" },
    { id: "262", text: "ว่าที่ พ.ต.ต.", group: "" },
    { id: "263", text: "ว่าที่ พ.ต.ต.หญิง", group: "" },
    { id: "264", text: "ว่าที่ พ.ต.ท.", group: "" },
    { id: "265", text: "ว่าที่ พ.ต.ท.หญิง", group: "" },
    { id: "266", text: "ว่าที่ พ.ต.หญิง", group: "" },
    { id: "267", text: "ว่าที่ พ.ต.อ.", group: "" },
    { id: "268", text: "ว่าที่ พ.ต.อ.หญิง", group: "" },
    { id: "269", text: "ว่าที่ พ.ท.", group: "" },
    { id: "270", text: "ว่าที่ พ.ท.หญิง", group: "" },
    { id: "271", text: "ว่าที่ พ.อ.", group: "" },
    { id: "272", text: "ว่าที่ พ.อ.หญิง", group: "" },
    { id: "273", text: "ว่าที่ ร.ต.", group: "" },
    { id: "274", text: "ว่าที่ ร.ต. น.พ.", group: "" },
    { id: "275", text: "ว่าที่ ร.ต.ต.", group: "" },
    { id: "276", text: "ว่าที่ ร.ต.ต.หญิง", group: "" },
    { id: "277", text: "ว่าที่ ร.ต.ท.", group: "" },
    { id: "278", text: "ว่าที่ ร.ต.ท.หญิง", group: "" },
    { id: "279", text: "ว่าที่ ร.ต.หญิง", group: "" },
    { id: "280", text: "ว่าที่ ร.ต.อ.", group: "" },
    { id: "281", text: "ว่าที่ ร.ต.อ.หญิง", group: "" },
    { id: "282", text: "ว่าที่ ร.ท.", group: "" },
    { id: "283", text: "ว่าที่ ร.ท.หญิง", group: "" },
    { id: "284", text: "ว่าที่ ร.อ.", group: "" },
    { id: "285", text: "ว่าที่ ร.อ. น.พ.", group: "" },
    { id: "286", text: "ว่าที่ ร.อ.หญิง", group: "" },
    { id: "287", text: "ศ.", group: "" },
    { id: "288", text: "ศ. ดร.", group: "" },
    { id: "289", text: "ศ. น.พ.", group: "" },
    { id: "290", text: "ศ. ร.ต.", group: "" },
    { id: "291", text: "ส.ต.", group: "" },
    { id: "292", text: "ส.ต.ต.", group: "" },
    { id: "293", text: "ส.ต.ต.หญิง", group: "" },
    { id: "294", text: "ส.ต.ท.", group: "" },
    { id: "295", text: "ส.ต.ท. ม.ล.", group: "" },
    { id: "296", text: "ส.ต.ท.หญิง", group: "" },
    { id: "297", text: "ส.ต.หญิง", group: "" },
    { id: "298", text: "ส.ต.อ.", group: "" },
    { id: "299", text: "ส.ต.อ. ม.ล.", group: "" },
    { id: "300", text: "ส.ต.อ.หญิง", group: "" },
    { id: "301", text: "ส.ท.", group: "" },
    { id: "302", text: "ส.ท. ม.ล.", group: "" },
    { id: "303", text: "ส.ท.หญิง", group: "" },
    { id: "304", text: "ส.อ.", group: "" },
    { id: "305", text: "ส.อ. ม.ร.ว.", group: "" },
    { id: "306", text: "ส.อ. ม.ล.", group: "" },
    { id: "307", text: "ส.อ.หญิง", group: "" },
    { id: "308", text: "หม่อม", group: "" },
    { id: "309", text: "อส.ทพ.", group: "" },
    { id: "310", text: "อส.หญิง", group: "" },
    { id: "311", text: "พระ", group: "" },
    { id: "312", text: "แม่ชี", group: "" },
    { id: "313", text: "สามเณร", group: "" },
  ];

  //------------------------------------ SET PARAMS -------------------------------
  //-------------------------------------------------------------------------------
  $timeout(function () {
    if ($stateParams.id == 1) {
      vm.AddList = true;
      vm.EdiList = false;
    } else if ($stateParams.id == 2) {
      let req = {
        auth: $rootScope.globals.auth,
        mod: "isEdit",
        it: $stateParams.key,
      };
      $rootScope.loading = true;
      $http.post(url, req).then(
        function (response) {
          let data = response.data.data[0];
          if (data.CMAD_TYPE == "ผู้มีสิทธิ์ยืม") {
            vm.show = "ผู้มีสิทธิ์ยืม";
            vm.is_patient = false;
            vm.is_Guarantor = false;
            vm.is_endorser = true;
            vm.btnDis_end = false;
            vm.btnDis_Guarantor = true;
            vm.btnDis_pat = true;
          } else if (data.CMAD_TYPE == "ผู้ยืม") {
            vm.show = "ผู้ยืม";
            vm.is_patient = true;
            vm.is_endorser = false;
            vm.is_Guarantor = false;
            vm.btnDis_end = true;
            vm.btnDis_pat = false;
            vm.btnDis_Guarantor = true;
          } else if (data.CMAD_TYPE == "ผู้รับรอง") {
            vm.show = "ผู้รับรอง";
            vm.is_patient = false;
            vm.is_endorser = false;
            vm.is_Guarantor = true;
            vm.btnDis_end = true;
            vm.btnDis_pat = true;
            vm.btnDis_Guarantor = false;
          }
          vm.date = new Date(data.CMAD_BIRTHDAY);
          vm.id = data.CMAD_ID;
          vm.data = {
            title: data.CMAD_TITLE,
            hpt: data.CMAD_HOSPITAL,
            hn: data.CMAD_HN,
            ward: data.CMAD_WARD,
            disease: data.CMAD_DISEASE,
            type: data.CMAD_TYPE,
            fullname: data.CMAD_NAME,
            date: "",
            citizen: data.CMAD_CITIZEN,
            addressNo: data.CMAD_ADD_NO,
            villNo: data.CMAD_MOO_NO,
            villName: data.CMAD_MOO_NAME,
            room: data.CMAD_ROOM_NO,
            floor: data.CMAD_FLOOR_NAME,
            building: data.CMAD_BUILD_NAME,
            troksoi: data.CMAD_TROK_SOI,
            road: data.CMAD_STREET,
            province: data.CMAD_CITY,
            county: data.CMAD_AMPHUR_NAME,
            district: data.CMAD_TUMBOL_NAME,
            zipcode: data.CMAD_ZIP,
            tel1: data.CMAD_PHONE,
            tel2: data.CMAD_PHONE2,
            fax: data.CMAD_FAX,
            site: data.CMAD_ADDR,
            pos: data.CMAD_POS,
            province_code: data.CMAD_CITY_CODE,
            county_code: data.CMAD_AMPHUR_CODE,
            district_code: data.CMAD_TUMBOL_CODE,
            division: data.CMAD_ATTN,
          };

          vm.md_prov = response.data.mix_prov;
          vm.md_aump = response.data.mix_aump;
          vm.md_dist = response.data.mix_dist;

          //

          for (let i = 0; i < response.data.rlts.length; i++) {
            vm.Box.push(response.data.rlts[i].CMAD_REF);
            vm.BHList.push(response.data.rlts[i]);
          }

          vm.AddList = false;
          vm.EdiList = true;
          $rootScope.loading = false;
        },
        function (response) {
          $rootScope.loading = false;
        }
      );
    }
  }, 100);

  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------

  fristLook();
  function fristLook() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isConfig",
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.data.hpt = response.data.si[0].SI_DESC;
        oData.hpt = response.data.si[0].SI_DESC;
        vm.prov = response.data.prov;
        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function prov(e) {
    vm.data.province = e.PRO_PROVINCE_DESC;
    vm.data.province_code = e.PRO_PROVINCE_CODE;

    let req = {
      auth: $rootScope.globals.auth,
      mod: "isAump",
      it: e.PRO_PROVINCE_CODE,
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.aump = response.data.filter_aump;
        vm.md_aump = undefined;
        vm.md_dist = undefined;
        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function aump(e) {
    vm.data.county = e.PRO_AUMPHUR_DESC;
    vm.data.county_code = e.PRO_AUMPHUR_CODE;

    let req = {
      auth: $rootScope.globals.auth,
      mod: "isDist",
      it: e.PRO_AUMPHUR_CODE,
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.dist = response.data.filter_dist;
        vm.md_dist = undefined;
        $rootScope.loading = false;
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function dist(e) {
    vm.data.district = e.PRO_TUMBOL_DESC;
    vm.data.district_code = e.PRO_TUMBOL_CODE;
  }

  function radio(type) {
    vm.is_endorser = type == 1 ? true : false;
    vm.is_patient = type == 2 ? true : false;
    vm.is_Guarantor = type == 3 ? true : false;
    if (type == 1) {
      vm.data.type = "ผู้มีสิทธิ์ยืม";
      vm.data.pos = "";
      vm.data.division = "";
      vm.BHList = [];
      vm.Box = [];
    } else if (type == 2) {
      vm.data.type = "ผู้ยืม";
      vm.data.pos = "";
      vm.data.hn = "";
      vm.data.ward = "";
      vm.data.disease = "";
      vm.data.division = "";
    } else if (type == 3) {
      vm.data.type = "ผู้รับรอง";
      vm.data.pos = "";
      vm.data.hn = "";
      vm.data.ward = "";
      vm.data.disease = "";
      vm.BHList = [];
      vm.Box = [];
    }
  }

  function modal_list() {
    let modal = $uibModal.open({
      animation: true,
      templateUrl: "List_patient.modal",
      controller: "List_patientController",
      controllerAs: "vm",
      size: "lg",
      backdropClass: "backdrop",
      resolve: {
        items: function () {
          return vm.data.site;
        },
      },
    });

    modal.result.then(
      function (result) {
        if (vm.Box.length == 0) {
          vm.Box.push(result.CMAD_REF);
          vm.BHList.push(result);
        } else {
          if (vm.Box.includes(result.CMAD_REF)) {
            alertService.warning("ผู้มีสิทธิ์ยืม (ซ้ำ) ในรายการ");
          } else {
            vm.Box.push(result.CMAD_REF);
            vm.BHList.push(result);
          }
        }
      },
      function () {}
    );
  }

  function save(e) {
    if (e !== undefined) {
      if (e == "ผู้มีสิทธิ์ยืม") {
        // เลือกผู้ช่วย ต้องกรอกข้อมูลพิเศษให้ครบถ้วน
        if (vm.data.hpt !== "") {
          if (vm.data.title !== null) {
            if (vm.data.fullname !== "") {
              if (vm.date !== undefined) {
                if (vm.data.citizen !== "") {
                  if (vm.data.hn !== "") {
                    if (vm.data.ward !== "") {
                      if (vm.data.disease !== "") {
                        vm.isBoolean = true;
                      } else {
                        vm.isBoolean = false;
                        document.getElementById("disease").focus();
                        alertService.warning("กรุณากรอก โรค");
                      }
                    } else {
                      vm.isBoolean = false;
                      document.getElementById("ward").focus();
                      alertService.warning("กรุณากรอก วอร์ด");
                    }
                  } else {
                    vm.isBoolean = false;
                    document.getElementById("hn").focus();
                    alertService.warning(
                      "กรุณากรอก HN / เลขประจำตัวผู้มีสิทธิ์ยืม"
                    );
                  }
                } else {
                  $timeout(function () {
                    document.getElementById("citizen").focus();
                    alertService.warning(
                      "โปรดตรวจสอบหมายเลขบัตรประชาชน 13 หลัก"
                    );
                  }, 1);
                }
              } else {
                $timeout(function () {
                  document.getElementById("HBD").focus();
                  alertService.warning(
                    "โปรดตรวจสอบวันที่ รูปแบบ(วัน/เดือน/ปี)"
                  );
                }, 1);
              }
            } else {
              document.getElementById("fullname").focus();
              alertService.warning("กรุณากรอก ชื่อ-นามสกุล");
            }
          } else {
            document.getElementById("title").focus();
            alertService.warning("กรุณาเลือก คำนำหน้า");
          }
        } else {
          document.getElementById("hpt").focus();
          alertService.warning("กรุณากรอก ชื่อโรงพยาบาล");
        }
      } else if (e == "ผู้ยืม") {
        if (vm.data.title !== null) {
          if (vm.data.fullname !== "") {
            if (vm.date !== undefined) {
              if (vm.data.citizen !== "") {
                if (vm.BHList.length !== 0) {
                  vm.isBoolean = true;
                } else {
                  alertService.warning("กรุณาเลือกผู้มีสิทธิ์ยืม");
                }
              } else {
                $timeout(function () {
                  document.getElementById("citizen").focus();
                  alertService.warning("โปรดตรวจสอบหมายเลขบัตรประชาชน 13 หลัก");
                }, 1);
              }
            } else {
              $timeout(function () {
                document.getElementById("HBD").focus();
                alertService.warning("โปรดตรวจสอบวันที่ รูปแบบ(วัน/เดือน/ปี)");
              }, 1);
            }
          } else {
            document.getElementById("fullname").focus();
            alertService.warning("กรุณากรอก ชื่อ-นามสกุล");
          }
        } else {
          document.getElementById("title").focus();
          alertService.warning("กรุณาเลือก คำนำหน้า");
        }
      } else if (e == "ผู้รับรอง") {
        if (vm.data.pos !== "") {
          if (vm.data.title !== null) {
            if (vm.data.fullname !== "") {
              if (vm.date !== undefined) {
                vm.isBoolean = true;
              } else {
                $timeout(function () {
                  document.getElementById("HBD").focus();
                  alertService.warning(
                    "โปรดตรวจสอบวันที่ รูปแบบ(วัน/เดือน/ปี)"
                  );
                }, 1);
              }
            } else {
              document.getElementById("fullname").focus();
              alertService.warning("กรุณากรอก ชื่อ-นามสกุล");
            }
          } else {
            document.getElementById("title").focus();
            alertService.warning("กรุณาเลือก คำนำหน้า");
          }
        } else {
          document.getElementById("pos").focus();
          alertService.warning("กรุณากรอก ตำแหน่ง");
        }
      }

      if (vm.isBoolean == true) {
        // กรอกข้อมูลพิเศษครบถ้วน ถึงเข้า if นี้ได้
        if (vm.data.addressNo !== "") {
          if (vm.md_prov !== undefined) {
            if (vm.md_aump !== undefined) {
              if (vm.md_dist !== undefined) {
                if (vm.data.zipcode !== "" && vm.data.zipcode.length == 5) {
                  vm.data.date = $filter("date")(vm.date, "dd/MM/yyyy");
                  alertService.confrim(
                    "คุณต้องการบันทึกข้อมูล หรือไม่?",
                    function (value) {
                      if (value) {
                        for (let i = 0; i < vm.BHList.length; i++) {
                          if (vm.BHList[i]["CMAD_RLTS"] == undefined) {
                            vm.BHList[i]["CMAD_RLTS"] = "-";
                          }
                        }

                        let isChkUp = { addr: vm.data.site, id: vm.id };
                        let isSave = {
                          mod: "isSave",
                          it: vm.data,
                          ck: isChkUp,
                          relation: vm.BHList,
                          auth: $rootScope.globals.auth,
                        };

                        $http.post(url, isSave).then(
                          function (response) {
                            if (response.data.Status == "Error") {
                              alertService.warning("รหัสบัตรประชาชน (ซ้ำ)");
                            } else {
                              let isStatus = response.data.Status;
                              const msg =
                                isStatus === "A"
                                  ? "บันทึกข้อมูลเรียบร้อย"
                                  : "อัพเดทข้อมูลเรียบร้อย";

                              alertService.confrim_success(
                                msg,
                                function (value) {
                                  if (value) {
                                    $state.go(
                                      "app.record.signup_lends_addList"
                                    );
                                    clear();
                                  }
                                }
                              );
                              $rootScope.loading = false;
                            }
                          },
                          function (response) {
                            $rootScope.loading = false;
                          }
                        );
                      }
                    }
                  );
                } else {
                  document.getElementById("zipcode").focus();
                  alertService.warning("กรุณากรอก รหัสไปรษณีย์ให้ครบ 5 หลัก");
                }
              } else {
                // document.getElementById("district").focus();
                alertService.warning("กรุณาเลือก แขวง/ตำบล");
              }
            } else {
              // document.getElementById("county").focus();
              alertService.warning("กรุณาเลือก เขต/อำเภอ");
            }
          } else {
            // document.getElementById("province").focus();
            alertService.warning("กรุณาเลือก จังหวัด");
          }
        } else {
          document.getElementById("addressNo").focus();
          alertService.warning("กรุณากรอก บ้านเลขที่");
        }
      }
    } else {
      alertService.warning("กรุณาเลือกประเภทผู้ยืม");
    }
  }

  function delItems(id, e) {
    // ลบ Items
    let isCheckitem_del = {
      mod: "isCheckitem_del",
      it: {
        case1: id.CMAD_REF,
        case2: id.CMAD_ID == undefined ? "isNew" : id.CMAD_ID,
      },
      auth: $rootScope.globals.auth,
    };

    $http.post(url, isCheckitem_del).then(
      function (response) {
        if (response.data.status === "Okkk") {
          vm.BHList.splice(e, 1);
          vm.Box.splice(e, 1);
        } else {
          alertService.error("ไม่สามารถลบข้อมูลได้");
        }
      },
      function (response) {
        $rootScope.loading = false;
      }
    );
  }

  function clear() {
    vm.data = angular.copy(oData);
    vm.show = undefined;
    vm.date = undefined;
    vm.id = " ";
    vm.isBoolean = false;
    vm.is_endorser = false;
    vm.is_patient = false;
    vm.is_Guarantor = false;
    vm.btnDis_end = false;
    vm.btnDis_pat = false;
    vm.btnDis_Guarantor = false;
    vm.md_prov = undefined;
    vm.md_aump = undefined;
    vm.md_dist = undefined;
    vm.Box = [];
    vm.BHList = [];
  }

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  //-----------------------------------SET CALENDAR--------------------------------
  //-------------------------------------------------------------------------------

  vm.dateOptions = {
    // maxDate: new Date(fmDate[0], Number(fmDate[1]) - 1, fmDate[2]),
    formatYear: "yy",
    startingDay: 1,
  };

  vm.calen_up = {
    opened: false,
  };

  function calendar() {
    vm.calen_up.opened = true;
  }

  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
}

signup_lends_addListController.$inject = [
  "$http",
  "$rootScope",
  "NgTableParams",
  "alertService",
  "$state",
];
function signup_lends_addListController(
  $http,
  $rootScope,
  NgTableParams,
  alertService,
  $state
) {
  const url = "api-url";
  let vm = this;
  vm.applyGlobalSearch = applyGlobalSearch;
  vm.del = del;
  vm.edit = edit;
  vm.addList = addList;

  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------

  fristLook();
  function fristLook() {
    let req = {
      auth: $rootScope.globals.auth,
      mod: "isMain",
    };
    $rootScope.loading = true;
    $http.post(url, req).then(
      function (response) {
        vm.record = response.data.data;
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

  function applyGlobalSearch() {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  }

  function del(ID, ADDR) {
    alertService.confrim(
      "คุณต้องการ ลบประวัติผู้ยืม หรือไม่ ? ",
      function (value) {
        let setValue = { id: ID, addr: ADDR };
        if (value) {
          let req = {
            auth: $rootScope.globals.auth,
            mod: "isDel",
            it: setValue,
          };

          $rootScope.loading = true;
          $http.post(url, req).then(
            function (response) {
              if (response.data.status === "Okkk") {
                alertService.success("ลบข้อมูลเรียบร้อย");
                fristLook();
              } else {
                alertService.error("ไม่สามารถลบข้อมูลได้");
              }
              $rootScope.loading = false;
            },
            function (response) {
              $rootScope.loading = false;
            }
          );
        }
      }
    );
  }

  function addList() {
    $state.go("app.record.signup_lends", {
      id: "1",
      key: "",
    });
  }

  function edit(key) {
    $state.go("app.record.signup_lends", {
      id: "2",
      key: key,
    });
  }

  //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
}

List_patientController.$inject = [
  "$uibModalInstance",
  "NgTableParams",
  "$rootScope",
  "$http",
];
function List_patientController(
  $uibModalInstance,
  NgTableParams,
  $rootScope,
  $http
) {
  const url = "api-url";
  let vm = this;
  let req = {
    auth: $rootScope.globals.auth,
    mod: "isSelectList",
  };
  $rootScope.loading = true;
  $http.post(url, req).then(
    function (response) {
      vm.oList = response.data.data;
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

  vm.applyGlobalSearch = function () {
    let term = vm.globalSearchTerm;
    vm.table.filter({ $: term });
  };

  vm.click = function (info, index) {
    angular.merge(info, { CMAD_RLTS: undefined });
    angular.merge(info, { CMAD_ID: undefined });
    $uibModalInstance.close(info);
  };
}
