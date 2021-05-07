$(document).ready(function () {
  getInformation();
});

function getInformation() {
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
        $('#userLastName').text(data['lastName']);
        $('#userCustomerId').text(data['customer_id']);

        // save customer id in local storage, so that we can access it in any html page.
        localStorage.setItem('customer_id', data['customer_id']);
        localStorage.setItem('firstName', data['firstName']);
        localStorage.setItem('lastName', data['lastName']);
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
