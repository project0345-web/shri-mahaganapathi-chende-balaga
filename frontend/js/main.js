const API = "https://shri-mahaganapathi-chende-balaga.onrender.com/api";

const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const themeBtn = document.getElementById("themeBtn");
const langBtn = document.getElementById("langBtn");
const bookingForm = document.getElementById("bookingForm");
const bookingMsg = document.getElementById("bookingMsg");
const bookingSubmit = document.getElementById("bookingSubmit");
const bookingServiceStatus =
    document.getElementById("bookingServiceStatus");


/* =========================
   LOADER
========================= */

function hideLoader() {
    if (loader) {
        loader.classList.add("hidden");
    }
}

window.addEventListener("load", function () {
    setTimeout(hideLoader, 500);
});

setTimeout(hideLoader, 3000);


/* =========================
   MOBILE MENU
========================= */

if (menuBtn && nav) {

    menuBtn.addEventListener("click", function () {
        nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            nav.classList.remove("active");
        });

    });
}


/* =========================
   THEME
========================= */

const savedTheme =
    localStorage.getItem("chendeTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

if (themeBtn) {

    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem(
                "chendeTheme",
                "dark"
            );

        } else {

            localStorage.setItem(
                "chendeTheme",
                "light"
            );

        }

    });

}


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        entry.target.classList.remove(
                            "animate-hidden"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(function (element) {
        element.classList.add("show");
    });

}


/* =========================
   DATE INPUT
========================= */

const dateInput =
    document.querySelector(
        'input[name="event_date"]'
    );

function setMinimumDate() {

    if (!dateInput) {
        return;
    }

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}

setMinimumDate();


/* =========================
   TRANSLATIONS
========================= */

const translations = {

    en: {

        navHome: "Home",
        navAbout: "About",
        navServices: "Services",
        navTeam: "Team",
        navGallery: "Gallery",
        navBooking: "Booking",
        navStatus: "Check Status",
        navContact: "Contact",
        bookNow: "Book Now",

        heroEyebrow:
            "TRADITION • DEVOTION • RHYTHM",

        heroTitle:
            "Feel the power of the Chende.",

        heroText:
            "Experience the vibrant rhythm of Shri Mahaganapathi Chende Balaga, Mudradi for weddings, bhajans, processions, temple events and auspicious occasions.",

        heroBook:
            "Book Our Balaga",

        heroTeam:
            "Meet the Team",

        statPerformers:
            "Performers",

        statPrograms:
            "Programs",

        statTradition:
            "Tradition",


        labelStory:
            "OUR STORY",

        aboutEyebrow:
            "ROOTED IN TRADITION",

        aboutTitle:
            "A rhythm that brings people together.",

        aboutP1:
            "Shri Mahaganapathi Chende Balaga, Mudradi carries the vibrant tradition of Chende performance into modern celebrations while respecting the spirit and culture behind every beat.",

        aboutP2:
            "From sacred temple occasions to joyful weddings and processions, our team brings disciplined rhythm, energy and a memorable traditional atmosphere.",

        aboutLink:
            "Plan a performance →",


        labelOccasions:
            "OCCASIONS",

        servicesEyebrow:
            "PERFORM WITH US",

        servicesTitle:
            "Made for your special moment.",

        servicesText:
            "Choose a traditional Chende performance that matches the scale and spirit of your occasion.",

        wedding:
            "Weddings",

        weddingText:
            "Grand Chende performances for entrances, processions and wedding celebrations.",

        temple:
            "Temple Events",

        templeText:
            "Traditional performances for temple programs, festivals and auspicious occasions.",

        procession:
            "Processions",

        processionText:
            "High-energy rhythm for processions, community celebrations and public events.",

        bhajan:
            "Bhajans & Culture",

        bhajanText:
            "Rhythm support for bhajans, cultural programs and local celebrations.",


        teamTitle:
            "One team. One rhythm.",

        teamText:
            "Our performers bring discipline, tradition and collective energy. The sound is powerful because the team moves as one.",

        teamBook:
            "Request Booking",


        labelGallery:
            "VISUALS",

        galleryEyebrow:
            "THE SOUND HAS A LOOK",

        galleryTitle:
            "Tradition in every frame.",


        labelBooking:
            "BOOKING",

        bookingEyebrow:
            "MAKE YOUR DATE SPECIAL",

        bookingTitle:
            "Book the Balaga.",

        bookingText:
            "Send your event details and submit a booking request. Our team will contact you to confirm the Chende booking.",


        nameLabel:
            "Full Name",

        phoneLabel:
            "Phone",

        emailLabel:
            "Email",

        eventLabel:
            "Event Type",

        dateLabel:
            "Event Date",

        timeLabel:
            "Start Time",

        locationLabel:
            "Venue / Location",

        messageLabel:
            "Additional Requirements",

        submitBooking:
            "Submit Booking Request",


        quote:
            "Where words end, rhythm begins.",


        labelContact:
            "CONTACT",

        contactEyebrow:
            "LET'S TALK",

        contactTitle:
            "Bring the Chende to your occasion.",

        contactText:
            "Call, WhatsApp or email us for availability and booking details."

    },


    kn: {

        navHome: "ಮುಖಪುಟ",
        navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
        navServices: "ಸೇವೆಗಳು",
        navTeam: "ತಂಡ",
        navGallery: "ಗ್ಯಾಲರಿ",
        navBooking: "ಬುಕಿಂಗ್",
        navStatus: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
        navContact: "ಸಂಪರ್ಕ",
        bookNow: "ಈಗ ಬುಕ್ ಮಾಡಿ",


        heroEyebrow:
            "ಸಂಪ್ರದಾಯ • ಭಕ್ತಿ • ಲಯ",

        heroTitle:
            "ಚೆಂಡೆಯ ಶಕ್ತಿಯನ್ನು ಅನುಭವಿಸಿ.",

        heroText:
            "ಮದುವೆ, ಭಜನೆ, ಮೆರವಣಿಗೆ, ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ, ಮುಡ್ರಾಡಿಯ ಉತ್ಸಾಹಭರಿತ ಲಯವನ್ನು ಅನುಭವಿಸಿ.",

        heroBook:
            "ನಮ್ಮ ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ",

        heroTeam:
            "ತಂಡವನ್ನು ನೋಡಿ",

        statPerformers:
            "ಕಲಾವಿದರು",

        statPrograms:
            "ಕಾರ್ಯಕ್ರಮಗಳು",

        statTradition:
            "ಸಂಪ್ರದಾಯ",


        labelStory:
            "ನಮ್ಮ ಕಥೆ",

        aboutEyebrow:
            "ಸಂಪ್ರದಾಯದಲ್ಲಿ ಬೇರೂರಿದೆ",

        aboutTitle:
            "ಜನರನ್ನು ಒಂದಾಗಿಸುವ ಲಯ.",

        aboutP1:
            "ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ, ಮುಡ್ರಾಡಿ ಪ್ರತಿಯೊಂದು ಲಯದ ಹಿಂದಿರುವ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಂಪ್ರದಾಯವನ್ನು ಗೌರವಿಸುತ್ತಾ ಚೆಂಡೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆಯನ್ನು ಆಧುನಿಕ ಆಚರಣೆಗಳಿಗೆ ತರುತ್ತದೆ.",

        aboutP2:
            "ದೇವಸ್ಥಾನದ ಪವಿತ್ರ ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ಸಂತೋಷದ ಮದುವೆಗಳು ಮತ್ತು ಮೆರವಣಿಗೆಗಳವರೆಗೆ ನಮ್ಮ ತಂಡ ಶಿಸ್ತುಬದ್ಧ ಲಯ, ಉತ್ಸಾಹ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ವಾತಾವರಣವನ್ನು ನೀಡುತ್ತದೆ.",

        aboutLink:
            "ಕಾರ್ಯಕ್ರಮವನ್ನು ಯೋಜಿಸಿ →",


        labelOccasions:
            "ಕಾರ್ಯಕ್ರಮಗಳು",

        servicesEyebrow:
            "ನಮ್ಮೊಂದಿಗೆ ಪ್ರದರ್ಶನ ನೀಡಿ",

        servicesTitle:
            "ನಿಮ್ಮ ವಿಶೇಷ ಸಂದರ್ಭಕ್ಕಾಗಿ.",

        servicesText:
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ಪ್ರಮಾಣ ಮತ್ತು ಉದ್ದೇಶಕ್ಕೆ ಹೊಂದುವ ಸಾಂಪ್ರದಾಯಿಕ ಚೆಂಡೆ ಪ್ರದರ್ಶನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",

        wedding:
            "ಮದುವೆಗಳು",

        weddingText:
            "ಮದುವೆಯ ಪ್ರವೇಶ, ಮೆರವಣಿಗೆ ಮತ್ತು ಸಂಭ್ರಮಕ್ಕಾಗಿ ಅದ್ಧೂರಿ ಚೆಂಡೆ ಪ್ರದರ್ಶನಗಳು.",

        temple:
            "ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು",

        templeText:
            "ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು, ಹಬ್ಬಗಳು ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ಪ್ರದರ್ಶನಗಳು.",

        procession:
            "ಮೆರವಣಿಗೆಗಳು",

        processionText:
            "ಮೆರವಣಿಗೆಗಳು, ಸಮುದಾಯದ ಸಂಭ್ರಮಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗಾಗಿ ಉತ್ಸಾಹಭರಿತ ಲಯ.",

        bhajan:
            "ಭಜನೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ",

        bhajanText:
            "ಭಜನೆಗಳು, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಆಚರಣೆಗಳಿಗೆ ಲಯದ ಸಹಕಾರ.",


        teamTitle:
            "ಒಂದು ತಂಡ. ಒಂದು ಲಯ.",

        teamText:
            "ನಮ್ಮ ಕಲಾವಿದರು ಶಿಸ್ತು, ಸಂಪ್ರದಾಯ ಮತ್ತು ಒಗ್ಗಟ್ಟಿನ ಉತ್ಸಾಹವನ್ನು ತರುತ್ತಾರೆ. ತಂಡವು ಒಂದಾಗಿ ಸಾಗುವುದರಿಂದ ಧ್ವನಿ ಶಕ್ತಿಯುತವಾಗಿರುತ್ತದೆ.",

        teamBook:
            "ಬುಕಿಂಗ್ ವಿನಂತಿಸಿ",


        labelGallery:
            "ಚಿತ್ರಗಳು",

        galleryEyebrow:
            "ಧ್ವನಿಗೂ ಒಂದು ರೂಪವಿದೆ",

        galleryTitle:
            "ಪ್ರತಿಯೊಂದು ಚಿತ್ರದಲ್ಲೂ ಸಂಪ್ರದಾಯ.",


        labelBooking:
            "ಬುಕಿಂಗ್",

        bookingEyebrow:
            "ನಿಮ್ಮ ದಿನವನ್ನು ವಿಶೇಷವಾಗಿಸಿ",

        bookingTitle:
            "ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ.",

        bookingText:
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ವಿವರಗಳನ್ನು ಕಳುಹಿಸಿ ಮತ್ತು ಬುಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ. ಚೆಂಡೆ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲು ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",


        nameLabel:
            "ಪೂರ್ಣ ಹೆಸರು",

        phoneLabel:
            "ದೂರವಾಣಿ",

        emailLabel:
            "ಇಮೇಲ್",

        eventLabel:
            "ಕಾರ್ಯಕ್ರಮದ ವಿಧ",

        dateLabel:
            "ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ",

        timeLabel:
            "ಆರಂಭದ ಸಮಯ",

        locationLabel:
            "ಸ್ಥಳ",

        messageLabel:
            "ಹೆಚ್ಚುವರಿ ಅಗತ್ಯಗಳು",

        submitBooking:
            "ಬುಕಿಂಗ್ ವಿನಂತಿ ಸಲ್ಲಿಸಿ",


        quote:
            "ಮಾತುಗಳು ಮುಗಿದಲ್ಲಿ ಲಯ ಆರಂಭವಾಗುತ್ತದೆ.",


        labelContact:
            "ಸಂಪರ್ಕ",

        contactEyebrow:
            "ಮಾತನಾಡೋಣ",

        contactTitle:
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಚೆಂಡೆಯನ್ನು ತನ್ನಿ.",

        contactText:
            "ಲಭ್ಯತೆ ಮತ್ತು ಬುಕಿಂಗ್ ವಿವರಗಳಿಗಾಗಿ ಕರೆ ಮಾಡಿ, WhatsApp ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ."

    }

};


let currentLanguage =
    localStorage.getItem("chendeLanguage") || "en";


/* =========================
   LANGUAGE
========================= */

function updateLanguage() {

    const languageData =
        translations[currentLanguage];

    document
        .querySelectorAll("[data-i18n]")
        .forEach(function (element) {

            const key =
                element.getAttribute("data-i18n");

            if (languageData[key]) {

                element.textContent =
                    languageData[key];

            }

        });


    document.body.classList.toggle(
        "kn",
        currentLanguage === "kn"
    );


    if (langBtn) {

        langBtn.textContent =
            currentLanguage === "en"
                ? "ಕನ್ನಡ"
                : "English";

    }

}


if (langBtn) {

    langBtn.addEventListener(
        "click",
        function () {

            currentLanguage =
                currentLanguage === "en"
                    ? "kn"
                    : "en";

            localStorage.setItem(
                "chendeLanguage",
                currentLanguage
            );

            updateLanguage();

        }
    );

}

updateLanguage();


/* =========================
   BOOKING SERVICE STATUS
========================= */

async function checkBookingService() {

    if (!bookingServiceStatus) {
        return;
    }

    const statusText =
        bookingServiceStatus.querySelector(
            "span:last-child"
        );

    try {

        const response =
            await fetch(`${API}/health`);

        if (!response.ok) {
            throw new Error(
                "Service unavailable"
            );
        }

        bookingServiceStatus.classList.add(
            "online"
        );

        if (statusText) {

            statusText.textContent =
                "Booking service is available";

        }

    } catch (error) {

        bookingServiceStatus.classList.remove(
            "online"
        );

        if (statusText) {

            statusText.textContent =
                "Booking service is currently unavailable";

        }

    }

}

checkBookingService();


/* =========================
   BOOKING FORM
========================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (bookingSubmit) {

                bookingSubmit.disabled = true;

                bookingSubmit.textContent =
                    "Submitting...";

            }


            if (bookingMsg) {

                bookingMsg.textContent = "";

                bookingMsg.className = "";

            }


            const formData =
                new FormData(bookingForm);


            const data = {

                customer_name:
                    String(
                        formData.get(
                            "customer_name"
                        ) || ""
                    ).trim(),

                phone:
                    String(
                        formData.get(
                            "phone"
                        ) || ""
                    ).trim(),

                email:
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    ).trim(),

                event_type:
                    String(
                        formData.get(
                            "event_type"
                        ) || ""
                    ).trim(),

                event_date:
                    String(
                        formData.get(
                            "event_date"
                        ) || ""
                    ).trim(),

                start_time:
                    String(
                        formData.get(
                            "start_time"
                        ) || ""
                    ).trim(),

                location:
                    String(
                        formData.get(
                            "location"
                        ) || ""
                    ).trim(),

                message:
                    String(
                        formData.get(
                            "message"
                        ) || ""
                    ).trim()

            };


            /* =========================
               VALIDATION
            ========================= */

            if (!data.customer_name) {

                showBookingMessage(
                    "Please enter your name.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            if (!data.phone) {

                showBookingMessage(
                    "Please enter your phone number.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            if (!data.event_type) {

                showBookingMessage(
                    "Please select an event type.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            if (!data.event_date) {

                showBookingMessage(
                    "Please select the event date.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            if (!data.start_time) {

                showBookingMessage(
                    "Please select the start time.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            if (!data.location) {

                showBookingMessage(
                    "Please enter the venue or location.",
                    "error"
                );

                resetBookingButton();

                return;
            }


            /* =========================
               SEND BOOKING
            ========================= */

            try {

                const response =
                    await fetch(
                        `${API}/bookings`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                let result = {};

                try {

                    result =
                        await response.json();

                } catch (error) {

                    result = {};

                }


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to submit booking."
                    );

                }


                const bookingId =
                    result.booking_id ||
                    result.id ||
                    result.bookingId ||
                    "";


                let successMessage =
                    "Booking request submitted successfully.";


                if (bookingId) {

                    successMessage +=
                        ` Booking ID: ${bookingId}`;

                }


                showBookingMessage(
                    successMessage,
                    "success"
                );


                bookingForm.reset();

                setMinimumDate();

                checkBookingService();


            } catch (error) {

                showBookingMessage(
                    error.message ||
                    "Something went wrong. Please try again.",
                    "error"
                );

            }


            resetBookingButton();

        }
    );

}


/* =========================
   BOOKING MESSAGE
========================= */

function showBookingMessage(
    message,
    type
) {

    if (!bookingMsg) {
        return;
    }

    bookingMsg.textContent =
        message;

    bookingMsg.className =
        type;

}


/* =========================
   RESET BOOKING BUTTON
========================= */

function resetBookingButton() {

    if (!bookingSubmit) {
        return;
    }

    bookingSubmit.disabled =
        false;

    bookingSubmit.textContent =
        currentLanguage === "kn"
            ? "ಬುಕಿಂಗ್ ವಿನಂತಿ ಸಲ್ಲಿಸಿ"
            : "Submit Booking Request ↗";
}