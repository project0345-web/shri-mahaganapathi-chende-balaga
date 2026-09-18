document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     CONFIG
  ========================= */

  const API = "https://shri-mahaganapathi-chende-balaga.onrender.com/api";


  /* =========================
     LOADER
  ========================= */

  const loader = document.getElementById("loader");

  if (loader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("hidden");
      }, 500);
    });
  }


  /* =========================
     MOBILE MENU
  ========================= */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });

  }


  /* =========================
     THEME
  ========================= */

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {

    themeToggle.addEventListener("click", function () {

      document.body.classList.toggle("dark");

      const darkMode =
        document.body.classList.contains("dark");

      localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
      );

    });

  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }


  /* =========================
     EVENT DATE
  ========================= */

  const eventDate = document.getElementById("eventDate");

  if (eventDate) {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    eventDate.min =
      `${year}-${month}-${day}`;
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

    if (success) {
      locationStatus.classList.add("success");
    } else {
      locationStatus.classList.remove("success");
    }

  }


  function detectLocation() {

    if (!navigator.geolocation) {

      showLocationMessage(
        "Location detection is not supported by this browser.",
        false
      );

      return;
    }


    detectLocationBtn.disabled = true;

    detectLocationBtn.textContent =
      "📍 Detecting Location...";


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


        /*
         * Create Google Maps URL
         */

        const mapsUrl =
          `https://www.google.com/maps?q=${latitude},${longitude}`;


        /*
         * Put coordinates into location field
         */

        locationInput.value =
          `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;


        /*
         * Save Google Maps URL
         */

        googleMapsLink.value =
          mapsUrl;


        /*
         * Show Google Maps button
         */

        if (openMapLink) {

          openMapLink.href =
            mapsUrl;

        }


        if (locationMapBox) {

          locationMapBox.style.display =
            "block";

        }


        /*
         * Status
         */

        showLocationMessage(
          `Location detected successfully. Accuracy: approximately ${Math.round(accuracy)} metres.`,
          true
        );


        detectLocationBtn.disabled =
          false;

        detectLocationBtn.textContent =
          "✓ Location Detected";


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


        detectLocationBtn.disabled =
          false;

        detectLocationBtn.textContent =
          "📍 Detect My Location";

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
        await fetch(
          `${API}/health`
        );


      if (!response.ok) {
        throw new Error("Service unavailable");
      }


      status.textContent =
        "Secure booking service online";

      status.classList.add("online");


    } catch (error) {

      status.textContent =
        "Booking service is currently unavailable";

      status.classList.remove("online");

    }

  }


  checkBookingService();


  /* =========================
     BOOKING FORM
  ========================= */

  const bookingForm =
    document.getElementById(
      "bookingForm"
    );

  if (!bookingForm) {
    return;
  }


  bookingForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const bookingMsg =
        document.getElementById(
          "bookingMsg"
        );


      const formData =
        new FormData(
          bookingForm
        );


      const data =
        Object.fromEntries(
          formData.entries()
        );


      /* =========================
         VALIDATION
      ========================= */

      if (!data.customer_name.trim()) {

        bookingMsg.textContent =
          "Please enter your full name.";

        return;

      }


      if (!data.phone.trim()) {

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


      if (!data.location.trim()) {

        bookingMsg.textContent =
          "Please detect your location before submitting.";

        return;

      }


      if (!data.google_maps_link.trim()) {

        bookingMsg.textContent =
          "Please detect your location before submitting.";

        return;

      }


      /* =========================
         SUBMIT
      ========================= */

      const submitButton =
        bookingForm.querySelector(
          'button[type="submit"]'
        );


      submitButton.disabled =
        true;

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
          `
            <strong>Booking request submitted successfully.</strong>
            <br>
            Booking ID: ${result.booking_id}
            <br>
            Status: Pending
          `;


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

          detectLocationBtn.disabled =
            false;

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

      }


      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Booking Request ↗";

    }
  );

});