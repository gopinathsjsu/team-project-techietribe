$(document).ready(function () {
  });

  function showSignUp(){
    $("#signUpUserDiv").toggle();
    $("#signInUserDiv").toggle();

    resetSignUpFields();
    $("#signInErrMsg").hide();
  }

  function showLogIn(){
    $("#signUpUserDiv").toggle();
    $("#signInUserDiv").toggle();

    $("#signUpMsg").hide();   
    $("#signUpErrMsg").hide(); 
    $("#signInUserName").val("");
    $("#signInPswd").val("");  

  }

  function saveToken(data){
      console.log("saving token");
      localStorage.setItem('access-token', data["accessToken"]); 
      localStorage.setItem('is-admin', data["isAdmin"]); 
  }

  function login() {

    $("#signInErrMsg").hide();

    var userName = $("#signInUserName").val();
    var pswd = $("#signInPswd").val();

    $.post("/signin/", { username: userName, password: pswd })
    .done(function (data) {
        saveToken(data);
        if (data["isAdmin"]){
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/user.html';
        }
    })
    .fail(function (data) {
        console.log("failed to login!")
        $("#signInErrMsg").text("Failed to login!");
        $("#signInErrMsg").show(); 
    });
  }
  
function resetSignUpFields() {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#signUpUserName").val("");
    $("#signUpPwd").val("");
    $("#confirmPwd").val("");

    $("#signUpErrMsg").hide();
    $("#signUpMsg").hide();
}

  function signUp(){

    $("#signUpErrMsg").hide();
    $("#signUpMsg").hide();

    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var userName = $("#signUpUserName").val();
    var pswd = $("#signUpPwd").val();
    var confirmPswd = $("#confirmPwd").val();

    if(pswd !== confirmPswd){
        $("#signUpErrMsg").text("Passwords does not match. Please try again!");
        $("#signUpErrMsg").show(); 
        return;
    }


    $.post("/signup/", { firstname: firstName, lastname: lastName, username: userName, password: pswd })
    .done(function (data) {
        console.log("sign up is successful!");
        $("#signUpMsg").text("Succesfully registered!");
        $("#signUpMsg").show(); 
    })
    .fail(function (data) {
        console.log("failed to signup!")
        $("#signUpErrMsg").text("Failed to signUp!");
        $("#signUpErrMsg").show(); 
    });
  }
