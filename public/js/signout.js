function singOut() {
    $.ajax({
        url: "/signout/",
        type: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": window.localStorage.getItem("access-token"),
        },
        success: function (data) {
          window.location.href = "/";
        },
        error: function (response, msg, error) {
          window.location.href = '/';
        },
      });
  }
  