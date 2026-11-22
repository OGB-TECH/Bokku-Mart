
/* =========================================
   BOKKU MART - HOME PAGE JAVASCRIPT
   HERO IMAGE SLIDER
========================================= */

// SELECT HTML ELEMENTS

const slider = document.querySelector(".hero-slider");
const slidesContainer = document.querySelector(".hero-slides");
const slides = document.querySelectorAll(".hero-slide");

const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");


// CHECK THAT THE SLIDER EXISTS

if (slider && slidesContainer && slides.length > 0 && prevButton && nextButton) {

    // CREATE A SLIDE COUNTER

    let currentSlide = 0;

    // Get the total number of slides
    const totalSlides = slides.length;

    // FUNCTION TO DISPLAY THE A SLIDE

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    // NEXT BUTTON FUNCTION

    function nextSlide() {

        // Move to the next slide
        currentSlide++;

        // Return to the first slide after the last slide
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }

        // Display the new slide
        showSlide(currentSlide);
    }

    // PREVIOUS BUTTON FUNCTION

    function prevSlide() {

        // Move to the previous slide
        currentSlide--;

        // Move to the last slide if we are at the first slide
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }

        // Display the new slide
        showSlide(currentSlide);
    }

    // ADD EVENT LISTENERS TO THE BUTTONS

    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    // KEYBOARD NAVIGATION

    document.addEventListener("keydown", function (event) {
        
        //Ignore Keyboard navigation when typing in form fields
        if (event.target.closest("input, textarea, select") || event.target.isContentEditable) {
            return;
        }

        if (event.key === "ArrowRight") {
            nextSlide();
        }

        if (event.key === "ArrowLeft") {
            prevSlide();
        }
    });

    // Automatic sliding every 5 seconds
    setInterval(nextSlide, 5000);

    // DISPLAY THE FIRST SLIDE WHEN THE PAGE LOADS

    showSlide(currentSlide);
}