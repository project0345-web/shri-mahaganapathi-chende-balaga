require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: "*"
  })
);

app.use(express.json());


/* =========================
   DATABASE
========================= */

const pool = mysql.createPool({

  host: process.env.DB_HOST,

  port:
    process.env.DB_PORT
      ? Number(process.env.DB_PORT)
      : 3306,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false
  }

});


/* =========================
   EMAIL CONFIGURATION
========================= */

const BREVO_API_KEY =
  process.env.BREVO_API_KEY;

const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL;

const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME ||
  "SHRI MAHAGANAPATHI CHENDE MUDRADI";

const ADMIN_EMAILS =
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim())
    .filter(Boolean);


/* =========================
   HELPERS
========================= */

function formatDate(date) {

  if (!date) {
    return "";
  }

  const d = new Date(date);

  return d.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


function formatTime(time) {

  if (!time) {
    return "";
  }

  const parts =
    String(time).split(":");

  let hour =
    Number(parts[0]);

  const minute =
    parts[1] || "00";

  const period =
    hour >= 12
      ? "PM"
      : "AM";

  hour =
    hour % 12 || 12;

  return `${hour}:${minute} ${period}`;

}


/* =========================
   SEND ADMIN EMAIL
========================= */

async function sendAdminBookingEmail(booking) {

  if (!BREVO_API_KEY) {

    console.error(
      "BREVO_API_KEY is missing."
    );

    return;

  }

  if (!BREVO_SENDER_EMAIL) {

    console.error(
      "BREVO_SENDER_EMAIL is missing."
    );

    return;

  }

  if (!ADMIN_EMAILS.length) {

    console.error(
      "ADMIN_EMAILS is missing."
    );

    return;

  }


  const recipients =
    ADMIN_EMAILS.map(email => ({
      email: email
    }));


  const htmlContent = `

    <div style="
      font-family: Arial, sans-serif;
      max-width: 650px;
      margin: auto;
      padding: 20px;
      color: #222;
    ">

      <h2 style="
        margin-bottom: 5px;
      ">
        New Chende Booking Request
      </h2>

      <p>
        A new booking request has been submitted
        through the Shri Mahaganapathi Chende Balaga website.
      </p>

      <hr>

      <h3>Booking Details</h3>

      <table
        cellpadding="8"
        cellspacing="0"
        style="
          width: 100%;
          border-collapse: collapse;
        "
      >

        <tr>
          <td><strong>Booking ID</strong></td>
          <td>${booking.id}</td>
        </tr>

        <tr>
          <td><strong>Name</strong></td>
          <td>${booking.customer_name}</td>
        </tr>

        <tr>
          <td><strong>Phone</strong></td>
          <td>${booking.phone}</td>
        </tr>

        <tr>
          <td><strong>Email</strong></td>
          <td>${booking.email || "Not provided"}</td>
        </tr>

        <tr>
          <td><strong>Event Type</strong></td>
          <td>${booking.event_type}</td>
        </tr>

        <tr>
          <td><strong>Event Date</strong></td>
          <td>${formatDate(booking.event_date)}</td>
        </tr>

        <tr>
          <td><strong>Start Time</strong></td>
          <td>${formatTime(booking.start_time)}</td>
        </tr>

        <tr>
          <td><strong>Venue / Location</strong></td>
          <td>${booking.location}</td>
        </tr>

        <tr>
          <td><strong>Additional Requirements</strong></td>
          <td>${booking.message || "None"}</td>
        </tr>

        <tr>
          <td><strong>Status</strong></td>
          <td>Pending</td>
        </tr>

      </table>

      <hr>

      <p>
        Please open the admin dashboard to review this booking.
      </p>

      <p style="
        color: #777;
        font-size: 13px;
      ">
        Shri Mahaganapathi Chende Balaga — Mudradi
      </p>

    </div>

  `;


  try {

    const response =
      await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {

          method: "POST",

          headers: {

            "accept":
              "application/json",

            "api-key":
              BREVO_API_KEY,

            "content-type":
              "application/json"

          },

          body: JSON.stringify({

            sender: {

              name:
                BREVO_SENDER_NAME,

              email:
                BREVO_SENDER_EMAIL

            },

            to:
              recipients,

            subject:
              `New Chende Booking #${booking.id}`,

            htmlContent:
              htmlContent

          })

        }
      );


    const responseText =
      await response.text();


    if (!response.ok) {

      console.error(
        "Brevo email error:",
        response.status,
        responseText
      );

      return;

    }


    console.log(
      "Admin booking email sent successfully."
    );


  } catch (error) {

    console.error(
      "Brevo request error:",
      error
    );

  }

}


/* =========================
   HEALTH
========================= */

app.get(
  "/api/health",
  async function (req, res) {

    try {

      await pool.query(
        "SELECT 1"
      );

      res.json({

        status: "ok",

        database: true

      });

    } catch (error) {

      console.error(
        "Health check error:",
        error
      );

      res.status(500).json({

        status: "error",

        database: false

      });

    }

  }
);


/* =========================
   CREATE BOOKING
========================= */

app.post(
  "/api/bookings",
  async function (req, res) {

    try {

      const {

        customer_name,

        email,

        phone,

        event_type,

        event_date,

        start_time,

        location,

        message

      } = req.body;


      /* =========================
         VALIDATION
      ========================= */

      if (

        !customer_name ||

        !phone ||

        !event_type ||

        !event_date ||

        !start_time ||

        !location

      ) {

        return res.status(400).json({

          message:
            "Please complete all required booking fields."

        });

      }


      /* =========================
         INSERT BOOKING
      ========================= */

      const [result] =
        await pool.execute(

          `
          INSERT INTO bookings
          (
            customer_name,
            email,
            phone,
            event_type,
            event_date,
            start_time,
            location,
            message,
            status
          )
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
          `,

          [

            customer_name,

            email || null,

            phone,

            event_type,

            event_date,

            start_time,

            location,

            message || null

          ]

        );


      const bookingId =
        result.insertId;


      /* =========================
         SEND ADMIN EMAIL
      ========================= */

      await sendAdminBookingEmail({

        id:
          bookingId,

        customer_name:
          customer_name,

        email:
          email,

        phone:
          phone,

        event_type:
          event_type,

        event_date:
          event_date,

        start_time:
          start_time,

        location:
          location,

        message:
          message

      });


      /* =========================
         RESPONSE
      ========================= */

      res.status(201).json({

        success: true,

        booking_id:
          bookingId,

        status:
          "pending",

        message:
          "Booking request submitted successfully."

      });


    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Unable to submit booking request."

      });

    }

  }
);


/* =========================
   GET BOOKINGS
========================= */

app.get(
  "/api/bookings",
  async function (req, res) {

    try {

      const [rows] =
        await pool.query(

          `
          SELECT *
          FROM bookings
          ORDER BY id DESC
          `

        );


      res.json(rows);


    } catch (error) {

      console.error(
        "Get bookings error:",
        error
      );

      res.status(500).json({

        message:
          "Unable to load bookings."

      });

    }

  }
);


/* =========================
   BOOKING STATUS
========================= */

app.post(
  "/api/bookings/status",
  async function (req, res) {

    try {

      const {
        id
      } = req.body;


      if (!id) {

        return res.status(400).json({

          message:
            "Booking ID is required."

        });

      }


      const [rows] =
        await pool.execute(

          `
          SELECT
            id,
            customer_name,
            phone,
            email,
            event_type,
            event_date,
            start_time,
            location,
            message,
            status,
            created_at
          FROM bookings
          WHERE id = ?
          `,

          [id]

        );


      if (!rows.length) {

        return res.status(404).json({

          message:
            "Booking not found."

        });

      }


      const booking =
        rows[0];


      res.json({

        success: true,

        booking: {

          id:
            booking.id,

          customer_name:
            booking.customer_name,

          phone:
            booking.phone,

          email:
            booking.email,

          event_type:
            booking.event_type,

          event_date:
            formatDate(
              booking.event_date
            ),

          start_time:
            formatTime(
              booking.start_time
            ),

          location:
            booking.location,

          message:
            booking.message,

          status:
            booking.status,

          created_at:
            booking.created_at

        }

      });


    } catch (error) {

      console.error(
        "Booking status error:",
        error
      );

      res.status(500).json({

        message:
          "Unable to load booking."

      });

    }

  }
);


/* =========================
   UPDATE BOOKING STATUS
========================= */

app.patch(
  "/api/bookings/:id/status",
  async function (req, res) {

    try {

      const id =
        req.params.id;

      const {
        status
      } = req.body;


      if (

        status !== "accepted" &&

        status !== "rejected"

      ) {

        return res.status(400).json({

          message:
            "Status must be accepted or rejected."

        });

      }


      const [result] =
        await pool.execute(

          `
          UPDATE bookings
          SET status = ?
          WHERE id = ?
          AND status = 'pending'
          `,

          [

            status,

            id

          ]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          message:
            "Booking not found or already processed."

        });

      }


      res.json({

        success: true,

        message:
          `Booking ${status}.`

      });


    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      res.status(500).json({

        message:
          "Unable to update booking status."

      });

    }

  }
);


/* =========================
   CLEAR BOOKINGS
========================= */

app.delete(
  "/api/bookings",
  async function (req, res) {

    try {

      await pool.query(
        "DELETE FROM bookings"
      );


      res.json({

        success: true,

        message:
          "All bookings deleted."

      });


    } catch (error) {

      console.error(
        "Clear bookings error:",
        error
      );

      res.status(500).json({

        message:
          "Unable to delete bookings."

      });

    }

  }
);


/* =========================
   ROOT
========================= */

app.get(
  "/",
  function (req, res) {

    res.send(
      "Shri Mahaganapathi Chende Balaga API is running."
    );

  }
);


/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  function () {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);