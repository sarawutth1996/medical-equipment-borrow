angular
  .module('app.utils')
  .factory('alertService', alertService);

alertService.$inject = ['sweetAlert'];
function alertService(sweetAlert) {
  return service = {
    error: error,
    success: success,
    warning: warning,
    info: info,
    confrim: confrim,
    confrim_success: confrim_success,
    confrim_warnning_html: confrim_warnning_html
  };

  ///////////////////////////////////

  function template(typ ,msg){
    return sweetAlert.swal({  
      text: msg,   
      type: typ,   
      confirmButtonText: 'ตกลง',
      allowOutsideClick: false,
    }); 
  }

  function error(msg) {    
    template('error' ,msg); 
  }

  function success(msg) {
    template('success' ,msg); 
  }

  function warning(msg) {
    template('warning' ,msg); 
  }

  function info(msg) {
    template('info' ,msg); 
  }

  function confrim(msg ,callback) {
    sweetAlert.swal({  
      text: msg,   
      type: 'question',   
      confirmButtonText: 'ตกลง',   
      allowOutsideClick: false,
      cancelButtonText: 'ยกเลิก',   
      showCancelButton: true
    }).then((result) => {  
      const value = (result.value) ? true : false;
      callback(value);
    })
  }

  function confrim_success(msg ,callback) {
    sweetAlert.swal({  
      text: msg,   
      type: 'success',   
      confirmButtonText: 'ตกลง',  
      allowOutsideClick: false 
    }).then((result) => {  
      const value = (result.value) ? true : false;
      callback(value);
    })
  }
  
  function confrim_warnning_html(msg ,callback) {
    sweetAlert.swal({  
      html: msg,   
      type: 'warning',   
      confirmButtonText: 'ตกลง',  
      allowOutsideClick: false 
    }).then((result) => {  
      const value = (result.value) ? true : false;
      callback(value);
    })
  }
}