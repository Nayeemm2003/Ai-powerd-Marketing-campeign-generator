// navbar scroll tracker

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  if (window.scrollY < lastScrollY) {
    // Scrolling UP
    navbar.classList.remove("hide");
    navbar.classList.add("show");
  } else {
    // Scrolling DOWN
    navbar.classList.remove("show");
    navbar.classList.add("hide");
  }

  lastScrollY = window.scrollY;
});

let menuSlide = document.querySelector("#slide-menu");
let show = document.querySelector(".show");
let clicked = false;
menuSlide.addEventListener("click", () => {
  if (clicked) {
    show.style.transform = "translateX(0)";
  } else {
    show.style.transform = "translateX(-20vw)";
  }
  clicked = !clicked;
});

// login form and sign up form script

let login = document.querySelector(".login");
let loginList = document.querySelector("#loginList");
let logBtnClicked = false;

login.addEventListener("click", () => {
  if (logBtnClicked) {
    loginList.style.transform = "scale(0)";
  } else {
    loginList.style.transform = "scale(1)";
  }
  logBtnClicked = !logBtnClicked;
});

let openForm = document.querySelector("#openForm");
let loginForm = document.querySelector(".loginForm");
let welcomeLogin = document.querySelector(".welcome-login");
let signUpForm = document.querySelector(".signUpForm");
let logIn = document.querySelector("#log-in");

// close welcome login form pop

let closeWelcomeLoginForm = document.querySelector("#closeWelcomeLoginForm");
let welcomeLoginPopUp = document.querySelector(".welcome-login");
closeWelcomeLoginForm.addEventListener("click", () => {
  welcomeLoginPopUp.style.transform = "scale(0)";
});

logIn.addEventListener("click", () => {
  welcomeLogin.style.transform = "scale(0)";
  signUpForm.style.transform = "scale(0)";
  loginForm.style.transform = "scale(1)";
});
let stayLoggedOut = document.querySelector("#stayLoggedOut");
stayLoggedOut.addEventListener("click", () => {
  welcomeLogin.style.transform = "scale(0)";
});
openForm.addEventListener("click", () => {
  welcomeLogin.style.transform = "scale(1)";
});

let closeForm = document.querySelector("#closeForm");
closeForm.addEventListener("click", () => {
  loginForm.style.transform = "scale(0)";
});

let closeForm2 = document.querySelector("#closeForm2");
closeForm2.addEventListener("click", () => {
  signUpForm.style.transform = "scale(0)";
});

let signUpbtn = document.querySelector("#sign-up");
signUpbtn.addEventListener("click", () => {
  welcomeLogin.style.transform = "scale(0)";
  signUpForm.style.transform = "scale(1)";
});

let LogInbtn = document.querySelector("#LogIn");
LogInbtn.addEventListener("click", () => {
  welcomeLogin.style.transform = "scale(0)";
  signUpForm.style.transform = "scale(0)";
  loginForm.style.transform = "scale(1)";
});

let signUpbtn2 = document.querySelector("#signUp");
signUpbtn2.addEventListener("click", () => {
  signUpForm.style.transform = "scale(1)";
  loginForm.style.transform = "scale(0)";
});
