//copy menu for mobile
function copyMenu() {
    //  copy inside .dpt-cat to .departments
    var dptCategory = document.querySelector('.dpt-cat');
    var dptPlace = document.querySelector('.departments');
    dptPlace.innerHTML = dptCategory.innerHTML;
    //copy inside nav to nav
    var mainNav = document.querySelector('.header-nav nav');
    var navPlace = document.querySelector('.off-canvas nav');
    navPlace.innerHTML = mainNav.innerHTML;
    //copy .header-top .wrapper to .thetop-nav
    var topNav = document.querySelector('.header-top .wrapper');
    var topPlace = document.querySelector('.off-canvas .thetop-nav');
    topPlace.innerHTML = topNav.innerHTML;
}
copyMenu();



// slider
const carousel = document.querySelector('.carousel');
const slides = document.querySelector('.carousel-slides');
const slideWidth = carousel.clientWidth;
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;

// Set the initial position of the slides
slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

// Go to the previous slide
prevBtn.addEventListener('click', () => {
    if (currentSlide === 0) {
        currentSlide = slides.children.length - 1;
    } else {
        currentSlide--;
    }
    slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
});

// Go to the next slide
nextBtn.addEventListener('click', () => {
    if (currentSlide === slides.children.length - 1) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
});

// Automatically advance to the next slide every 3 seconds
setInterval(() => {
    if (currentSlide === slides.children.length - 1) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
}, 3000);


//Single Page show dpt menu
const dptButton = document.querySelector('.dpt-cat .dpt-trigger'),
    dptClass = document.querySelector('.site');
dptButton.addEventListener('click', function () {
    dptClass.classList.toggle('showdpt')
})

// image selector
const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();
    });
});

function slideImage() {
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;
    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}
window.addEventListener('resize', slideImage);


function PValidation() {
    var pass = document.getElementById('pass');
    const ip = document.getElementById('invalid-pass');
    if (pass.value == "" || pass.value == null) {
        const ip = document.getElementById('invalid-pass');
        ip.innerHTML = "Password required";
        ip.style.display = "block";
        return false;
    }
    if (pass.value.length < 5) {
        ip.innerHTML = "Password is too short";
        ip.style.display = "block";
        return false;
    }
    if (pass.value.length > 15) {
        ip.innerHTML = "Password is too long";
        ip.style.display = "block";
        return false;
    }
    var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!pass.value.match(pattern)) {
        ip.innerHTML = "Atleast one special character needed";
        ip.style.display = "block";
        return false;
    }
    else {
        ip.style.display = "none";
        return true;
    }
}
function nameValidation() {
    var fname = document.getElementById('name');
    const ifname = document.getElementById('invalid-name');
    if (fname.value == "" || fname.value == null) {
        ifname.innerHTML = "Name required";
        ifname.style.display = "block";
        return false;
    }
    var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (fname.value.match(pattern)) {
        ifname.innerHTML = "No special characters are allowed ";
        ifname.style.display = "block";
        return false;
    }
    else {
        ifname.style.display = "none";
        return true;
    }
}

function CPValidation() {
    var cpname = document.getElementById('cpassword');
    var icpname = document.getElementById('invalid-cp');
    var pass = document.getElementById('pass');
    if (cpname.value == "" || cpname.value == null) {
        icpname.innerHTML = "*Required field ";
        icpname.style.display = "block";
        return false;
    }
    if (pass.value != cpname.value) {
        icpname.innerHTML = "*Password mismatch";
        icpname.style.display = "block";
        return false;
    }
    else {
        icpname.style.display = "none";
        return true;
    }
}

function EmailValidation() {
    var email = document.getElementById('email');
    var iemail = document.getElementById('invalid-email');
    if (email.value == null || email.value == '') {
        iemail.style.display = "block";
        iemail.innerHTML = "Required field";
        return false;
    }
    else {
        iemail.style.display = "none";
        return true;
    }
}