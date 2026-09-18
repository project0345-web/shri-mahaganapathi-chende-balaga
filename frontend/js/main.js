document.addEventListener("DOMContentLoaded", function () {

    const API = "https://shri-mahaganapathi-chende-balaga.onrender.com/api";

    /* =========================
       LOADER
    ========================= */

    const loader = document.getElementById("loader");

    function hideLoader() {
        if (loader) {
            loader.classList.add("hidden");
        }
    }

    window.addEventListener("load", function () {
        setTimeout(hideLoader, 500);
    });

    /* Fallback so the website never remains stuck */
    setTimeout(hideLoader, 3000);


    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", function () {
            nav.classList.toggle("active");
            menuBtn.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("active");
                menuBtn.classList.remove("active");
            });
        });
    }


    /* =========================
       THEME
    ========================= */

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", function () {

            document.body.classList.toggle("dark");

            const isDark =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "theme",
                isDark ? "dark" : "light"
            );

            themeBtn.textContent = isDark ? "☀" : "☼";
        });
    }


    /* =========================
       REVEAL ANIMATIONS
    ========================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(entry.target);
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
            element.classList.add("visible");
        });

    }


    /* =========================
       EVENT DATE
    ========================= */

    const eventDate =
        document.querySelector('input[name="event_date"]');

    if (eventDate) {

        const today = new Date();

        const year = today.getFullYear();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

        eventDate.min =
            `${year}-${month}-${day}`;
    }


    /* =========================
       LANGUAGE
    ========================= */

    const langBtn =
        document.getElementById("langBtn");

    let kannada = false;

    const translations = {

        navHome: ["Home", "ಮುಖಪುಟ"],
        navAbout: ["About", "ನಮ್ಮ ಬಗ್ಗೆ"],
        navServices: ["Services", "ಸೇವೆಗಳು"],
        navTeam: ["Team", "ತಂಡ"],
        navGallery: ["Gallery", "ಗ್ಯಾಲರಿ"],
        navBooking: ["Booking", "ಬುಕಿಂಗ್"],
        navStatus: ["Check Status", "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ"],
        navContact: ["Contact", "ಸಂಪರ್ಕ"],
        bookNow: ["Book Now", "ಈಗ ಬುಕ್ ಮಾಡಿ"],

        heroEyebrow: [
            "TRADITION • DEVOTION • RHYTHM",
            "ಸಂಪ್ರದಾಯ • ಭಕ್ತಿ • ಲಯ"
        ],

        heroTitle: [
            "Feel the power of the Chende.",
            "ಚೆಂಡೆಯ ಶಕ್ತಿಯನ್ನು ಅನುಭವಿಸಿ."
        ],

        heroText: [
            "Experience the vibrant rhythm of Shri Mahaganapathi Chende Balaga, Mudradi for weddings, bhajans, processions, temple events and auspicious occasions.",
            "ಮದುವೆಗಳು, ಭಜನೆಗಳು, ಮೆರವಣಿಗೆಗಳು, ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ ಮುನಿಯಾಲಿನ ಅದ್ಭುತ ಲಯವನ್ನು ಅನುಭವಿಸಿ."
        ],

        heroBook: [
            "Book Our Balaga ↗",
            "ನಮ್ಮ ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ ↗"
        ],

        heroTeam: [
            "Meet the Team",
            "ತಂಡವನ್ನು ಭೇಟಿ ಮಾಡಿ"
        ],

        statPerformers: ["Performers", "ಕಲಾವಿದರು"],
        statPrograms: ["Programs", "ಕಾರ್ಯಕ್ರಮಗಳು"],
        statTradition: ["Tradition", "ಸಂಪ್ರದಾಯ"],

        labelStory: ["OUR STORY", "ನಮ್ಮ ಕಥೆ"],
        aboutEyebrow: ["ROOTED IN TRADITION", "ಸಂಪ್ರದಾಯದಲ್ಲಿ ಬೇರೂರಿದೆ"],
        aboutTitle: [
            "A rhythm that brings people together.",
            "ಜನರನ್ನು ಒಗ್ಗೂಡಿಸುವ ಲಯ."
        ],

        aboutP1: [
            "Shri Mahaganapathi Chende Balaga, Mudradi carries the vibrant tradition of Chende performance into modern celebrations while respecting the spirit and culture behind every beat.",
            "ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ, ಮುನಿಯಾಲು ಪ್ರತಿಯೊಂದು ಲಯದ ಹಿಂದಿರುವ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಂಪ್ರದಾಯವನ್ನು ಗೌರವಿಸುತ್ತಾ ಚೆಂಡೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆಯನ್ನು ಇಂದಿನ ಆಚರಣೆಗಳಿಗೆ ತರುತ್ತದೆ."
        ],

        aboutP2: [
            "From sacred temple occasions to joyful weddings and processions, our team brings disciplined rhythm, energy and a memorable traditional atmosphere.",
            "ದೇವಸ್ಥಾನದ ಪವಿತ್ರ ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ಮದುವೆಗಳು ಮತ್ತು ಮೆರವಣಿಗೆಗಳವರೆಗೆ ನಮ್ಮ ತಂಡ ಶಿಸ್ತುಬದ್ಧ ಲಯ, ಉತ್ಸಾಹ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ವಾತಾವರಣವನ್ನು ನೀಡುತ್ತದೆ."
        ],

        aboutLink: [
            "Plan a performance →",
            "ಕಾರ್ಯಕ್ರಮವನ್ನು ಯೋಜಿಸಿ →"
        ],

        labelOccasions: ["OCCASIONS", "ಸಂದರ್ಭಗಳು"],
        servicesEyebrow: ["PERFORM WITH US", "ನಮ್ಮೊಂದಿಗೆ ಕಾರ್ಯಕ್ರಮ ನೀಡಿ"],
        servicesTitle: [
            "Made for your special moment.",
            "ನಿಮ್ಮ ವಿಶೇಷ ಕ್ಷಣಕ್ಕಾಗಿ."
        ],

        servicesText: [
            "Choose a traditional Chende performance that matches the scale and spirit of your occasion.",
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ಸ್ವರೂಪ ಮತ್ತು ಉತ್ಸಾಹಕ್ಕೆ ಹೊಂದುವ ಸಾಂಪ್ರದಾಯಿಕ ಚೆಂಡೆ ಕಾರ್ಯಕ್ರಮವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
        ],

        wedding: ["Weddings", "ಮದುವೆಗಳು"],
        temple: ["Temple Events", "ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು"],
        procession: ["Processions", "ಮೆರವಣಿಗೆಗಳು"],
        bhajan: ["Bhajans & Culture", "ಭಜನೆಗಳು ಮತ್ತು ಸಂಸ್ಕೃತಿ"],

        weddingText: [
            "Grand Chende performances for entrances, processions and wedding celebrations.",
            "ಮದುವೆಯ ಪ್ರವೇಶ, ಮೆರವಣಿಗೆ ಮತ್ತು ಸಂಭ್ರಮಕ್ಕಾಗಿ ಅದ್ಧೂರಿ ಚೆಂಡೆ ಕಾರ್ಯಕ್ರಮಗಳು."
        ],

        templeText: [
            "Traditional performances for temple programs, festivals and auspicious occasions.",
            "ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು, ಹಬ್ಬಗಳು ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ಕಾರ್ಯಕ್ರಮಗಳು."
        ],

        processionText: [
            "High-energy rhythm for processions, community celebrations and public events.",
            "ಮೆರವಣಿಗೆಗಳು, ಸಮುದಾಯದ ಆಚರಣೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗಾಗಿ ಉತ್ಸಾಹಭರಿತ ಲಯ."
        ],

        bhajanText: [
            "Rhythm support for bhajans, cultural programs and local celebrations.",
            "ಭಜನೆಗಳು, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಆಚರಣೆಗಳಿಗೆ ಲಯದ ಸಹಕಾರ."
        ],

        teamTitle: [
            "One team. One rhythm.",
            "ಒಂದು ತಂಡ. ಒಂದು ಲಯ."
        ],

        teamText: [
            "Our performers bring discipline, tradition and collective energy. The sound is powerful because the team moves as one.",
            "ನಮ್ಮ ಕಲಾವಿದರು ಶಿಸ್ತು, ಸಂಪ್ರದಾಯ ಮತ್ತು ಸಾಮೂಹಿಕ ಶಕ್ತಿಯನ್ನು ತರುತ್ತಾರೆ. ತಂಡವು ಒಂದಾಗಿ ಸಾಗುವುದರಿಂದ ಧ್ವನಿ ಇನ್ನಷ್ಟು ಶಕ್ತಿಯುತವಾಗಿರುತ್ತದೆ."
        ],

        teamBook: [
            "Request Booking ↗",
            "ಬುಕಿಂಗ್ ವಿನಂತಿಸಿ ↗"
        ],

        labelGallery: ["VISUALS", "ಚಿತ್ರಗಳು"],
        galleryEyebrow: ["THE SOUND HAS A LOOK", "ಲಯಕ್ಕೂ ಒಂದು ರೂಪವಿದೆ"],
        galleryTitle: [
            "Tradition in every frame.",
            "ಪ್ರತಿಯೊಂದು ಚಿತ್ರದಲ್ಲೂ ಸಂಪ್ರದಾಯ."
        ],

        labelBooking: ["BOOKING", "ಬುಕಿಂಗ್"],
        bookingEyebrow: ["MAKE YOUR DATE SPECIAL", "ನಿಮ್ಮ ದಿನವನ್ನು ವಿಶೇಷವಾಗಿಸಿ"],
        bookingTitle: [
            "Book the Balaga.",
            "ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ."
        ],

        bookingText: [
            "Send your event details and submit a booking request. Our team will contact you to confirm the Chende booking.",
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ವಿವರಗಳನ್ನು ಕಳುಹಿಸಿ. ಚೆಂಡೆ ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಲು ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ."
        ],

        nameLabel: ["Full Name", "ಪೂರ್ಣ ಹೆಸರು"],
        phoneLabel: ["Phone", "ದೂರವಾಣಿ"],
        emailLabel: ["Email", "ಇಮೇಲ್"],
        eventLabel: ["Event Type", "ಕಾರ್ಯಕ್ರಮದ ಪ್ರಕಾರ"],
        dateLabel: ["Event Date", "ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ"],
        timeLabel: ["Start Time", "ಪ್ರಾರಂಭದ ಸಮಯ"],
        locationLabel: ["Venue / Location", "ಸ್ಥಳ"],
        messageLabel: ["Additional Requirements", "ಹೆಚ್ಚುವರಿ ಅವಶ್ಯಕತೆಗಳು"],

        submitBooking: [
            "Submit Booking Request ↗",
            "ಬುಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ ↗"
        ],

        quote: [
            "Where words end, rhythm begins.",
            "ಮಾತುಗಳು ಕೊನೆಗೊಳ್ಳುವಲ್ಲಿ ಲಯ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ."
        ],

        labelContact: ["CONTACT", "ಸಂಪರ್ಕ"],
        contactEyebrow: ["LET'S TALK", "ಮಾತನಾಡೋಣ"],
        contactTitle: [
            "Bring the Chende to your occasion.",
            "ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಚೆಂಡೆಯನ್ನು ತನ್ನಿ."
        ],

        contactText: [
            "Call, WhatsApp or email us for availability and booking details.",
            "ಲಭ್ಯತೆ ಮತ್ತು ಬುಕಿಂಗ್ ವಿವರಗಳಿಗಾಗಿ ಕರೆ ಮಾಡಿ, WhatsApp ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ."
        ]
    };


    function updateLanguage() {

        document
            .querySelectorAll("[data-i18n]")
            .forEach(function (element) {

                const key =
                    element.getAttribute("data-i18n");

                if (!translations[key]) {
                    return;
                }

                element.textContent =
                    translations[key][kannada ? 1 : 0];
            });

        if (langBtn) {
            langBtn.textContent =
                kannada ? "English" : "ಕನ್ನಡ";
        }
    }


    if (langBtn) {

        langBtn.addEventListener("click", function () {

            kannada = !kannada;

            updateLanguage();

        });
    }


    /* =========================
       LOCATION DETECTION
    ========================= */

    const detectLocationBtn =
        document.getElementById("detectLocationBtn");

    const locationInput =
        document.getElementById("location");

    const locationStatus =
        document.getElementById("locationStatus");

    const googleMapsLink =
        document.getElementById("googleMapsLink");

    const openMapLink =
        document.getElementById("openMapLink");

    const locationMapBox =
        document.getElementById("locationMapBox");


    function showLocationMessage(message, success) {

        if (!locationStatus) {
            return;
        }

        locationStatus.textContent = message;

        locationStatus.classList.toggle(
            "success",
            success
        );
    }


    function detectLocation() {

        if (!navigator.geolocation) {

            showLocationMessage(
                "Location detection is not supported by this browser.",
                false
            );

            return;
        }

        if (detectLocationBtn) {

            detectLocationBtn.disabled = true;

            detectLocationBtn.textContent =
                "📍 Detecting Location...";
        }

        showLocationMessage(
            "Please allow location access when your browser asks.",
            false
        );


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;

                const mapsUrl =
                    `https://www.google.com/maps?q=${latitude},${longitude}`;


                if (locationInput) {

                    locationInput.value =
                        `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
                }


                if (googleMapsLink) {

                    googleMapsLink.value =
                        mapsUrl;
                }


                if (openMapLink) {

                    openMapLink.href =
                        mapsUrl;

                    openMapLink.style.display =
                        "inline-flex";
                }


                if (locationMapBox) {

                    locationMapBox.style.display =
                        "block";
                }


                showLocationMessage(
                    `Location detected successfully. Accuracy: approximately ${Math.round(accuracy)} metres.`,
                    true
                );


                if (detectLocationBtn) {

                    detectLocationBtn.disabled = false;

                    detectLocationBtn.textContent =
                        "✓ Location Detected";
                }

            },

            function (error) {

                let message =
                    "Unable to detect your location.";

                if (error.code === 1) {

                    message =
                        "Location permission was denied. Please allow location access in your browser.";

                } else if (error.code === 2) {

                    message =
                        "Your location could not be determined. Please try again.";

                } else if (error.code === 3) {

                    message =
                        "Location detection timed out. Please try again.";
                }


                showLocationMessage(
                    message,
                    false
                );


                if (detectLocationBtn) {

                    detectLocationBtn.disabled = false;

                    detectLocationBtn.textContent =
                        "📍 Detect My Location";
                }

            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }


    if (detectLocationBtn) {

        detectLocationBtn.addEventListener(
            "click",
            detectLocation
        );
    }


    /* =========================
       BOOKING SERVICE CHECK
    ========================= */

    async function checkBookingService() {

        const status =
            document.getElementById(
                "bookingServiceStatus"
            );

        if (!status) {
            return;
        }

        try {

            const response =
                await fetch(`${API}/health`);

            if (!response.ok) {
                throw new Error();
            }

            status.innerHTML =
                '<span class="dot"></span><span>Secure booking service online</span>';

            status.classList.add("online");

        } catch (error) {

            status.innerHTML =
                '<span class="dot"></span><span>Booking service is currently unavailable</span>';

            status.classList.remove("online");
        }
    }

    checkBookingService();


    /* =========================
       BOOKING FORM
    ========================= */

    const bookingForm =
        document.getElementById("bookingForm");

    if (!bookingForm) {
        return;
    }


    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const bookingMsg =
                document.getElementById("bookingMsg");

            const formData =
                new FormData(bookingForm);

            const data =
                Object.fromEntries(formData.entries());


            /* VALIDATION */

            if (!data.customer_name ||
                !data.customer_name.trim()) {

                bookingMsg.textContent =
                    "Please enter your full name.";

                return;
            }


            if (!data.phone ||
                !data.phone.trim()) {

                bookingMsg.textContent =
                    "Please enter your phone number.";

                return;
            }


            if (!data.event_type) {

                bookingMsg.textContent =
                    "Please select an event type.";

                return;
            }


            if (!data.event_date) {

                bookingMsg.textContent =
                    "Please select the event date.";

                return;
            }


            if (!data.start_time) {

                bookingMsg.textContent =
                    "Please select the start time.";

                return;
            }


            if (!data.location ||
                !data.location.trim()) {

                bookingMsg.textContent =
                    "Please detect your location before submitting.";

                return;
            }


            /* Google Maps link is required only when
               the automatic location field exists */

            if (
                googleMapsLink &&
                !data.google_maps_link
            ) {

                bookingMsg.textContent =
                    "Please detect your location before submitting.";

                return;
            }


            const submitButton =
                bookingForm.querySelector(
                    'button[type="submit"]'
                );

            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";

            bookingMsg.textContent =
                "Submitting your booking request...";


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


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Booking failed."
                    );
                }


                bookingMsg.innerHTML =
                    `<strong>Booking request submitted successfully.</strong>
                     <br>
                     Booking ID: ${result.booking_id}
                     <br>
                     Status: Pending`;


                bookingMsg.classList.add(
                    "success"
                );


                bookingForm.reset();


                if (locationMapBox) {

                    locationMapBox.style.display =
                        "none";
                }


                if (locationStatus) {

                    locationStatus.textContent =
                        'Click "Detect My Location" and allow location access.';
                }


                if (detectLocationBtn) {

                    detectLocationBtn.disabled = false;

                    detectLocationBtn.textContent =
                        "📍 Detect My Location";
                }


            } catch (error) {

                bookingMsg.textContent =
                    error.message ||
                    "Something went wrong. Please try again.";

                bookingMsg.classList.remove(
                    "success"
                );

            } finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Booking Request ↗";
            }

        }
    );

});