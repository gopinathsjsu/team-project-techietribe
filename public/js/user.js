$(document).ready(function () {
  getInfo();
});

function getInfo() {
  $.ajaxSetup({
    headers: {
      'access-token': window.localStorage.getItem('access-token'),
    },
  });

  $.post('/getInfo/')
    .done(function (data) {
      console.log(data);
      if (!data['isAdmin']) {
        $('#userFullName').text(data['firstName']);
        localStorage.setItem('first_name', data["firstName"]);
        // save customer id in local storage, so that we can access it in any html page.
        localStorage.setItem('customer_id', data['customer_id']);
      } else {
        window.location.href = '/';
      }
    })
    .fail(function (data) {
      console.log('unknown server error!');
      console.log(data);
      window.location.href = '/';
    });
}
