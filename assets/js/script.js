function menuShow(){
    let menuMobile = document.querySelector('.mobile')
    if (menuMobile.classList.contains('open')){
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "./assets/img/open_menu.svg";
    } else{
        menuMobile.classList.add('open')
        document.querySelector('.icon').src = "./assets/img/close_menu.svg";
    }
}

//Modais

//Modal 1
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
    el.addEventListener("click", () => toggleModal());
});

//Modal 2
const openModalButton2 = document.querySelector("#open-modal2");
const closeModalButton2 = document.querySelector("#close-modal2");
const modal2 = document.querySelector("#modal2");
const fade2 = document.querySelector("#fade2");

const toggleModal2 = () => {
    modal2.classList.toggle("hide");
    fade2.classList.toggle("hide");
};
  
[openModalButton2, closeModalButton2, fade2].forEach((el) => {
    el.addEventListener("click", () => toggleModal2());
});

//Modal 3
const openModalButton3 = document.querySelector("#open-modal3");
const closeModalButton3 = document.querySelector("#close-modal3");
const modal3 = document.querySelector("#modal3");
const fade3 = document.querySelector("#fade3");

const toggleModal3 = () => {
    modal3.classList.toggle("hide");
    fade3.classList.toggle("hide");
};
  
[openModalButton3, closeModalButton3, fade3].forEach((el) => {
    el.addEventListener("click", () => toggleModal3());
});