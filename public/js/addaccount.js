$(document).ready(function () {
  verifyTokenInfo();
});

function verifyTokenInfo() {
  $.ajaxSetup({
    headers: {
      'access-token': window.localStorage.getItem('access-token'),
    },
  });
  $.post('/verifyToken/')
    .done(function (data) {
      console.log(data);
    })
    .fail(function (data) {
      console.log('unknown server error!');
      console.log(data);
      window.location.href = '/';
    });
}

function addAccount() {
  $.ajaxSetup({
    headers: {
      'access-token': window.localStorage.getItem('access-token'),
    },
  });
  $.post('/addCustomerAccount/')
    .done(function (data) {
      console.log(data);
    })
    .fail(function (data) {
      console.log('unknown server error!');
      console.log(data);
      window.location.href = '/';
    });
}
