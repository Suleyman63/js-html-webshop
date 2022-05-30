const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const btnDiv = document.querySelector("#btn");

function login() {
  loginForm.style.left = "-400px";
  registerForm.style.left = "50px";
  btnDiv.style.left = "110px";
}

function register() {
  loginForm.style.left = "50px";
  registerForm.style.left = "450px";
  btnDiv.style.left = "0px";
}
