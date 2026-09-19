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
   BREVO EMAIL CONFIG
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
   DATE FORMAT
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


/* =========================
   TIME FORMAT
========================= */

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
   SEND BREVO EMAIL
========================= */

async function sendBrevoEmail({
  to,
  subject,
  htmlContent
}) {

  if (!BREVO_API_KEY) {

    console.error(
      "BREVO_API_KEY is missing."
    );

    return false;

  }

  if (!BREVO_SENDER_EMAIL) {

    console.error(
      "BREVO_SENDER_EMAIL is missing."
    );

    return false;

  }

  if (!to) {

    console.error(
      "Email recipient is missing."
    );

    return false;

  }


  try {

    const recipients =
      Array.isArray(to)
        ? to
            .filter(Boolean)
            .map(email => ({
              email
            }))
        : [
            {
              email: to
            }
          ];


    if (!recipients.length) {

      return false;

    }


    const response =
      await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {

          method: "POST",

          headers: {

            accept:
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
              subject,

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

      return false;

    }


    console.log(
      "Email sent successfully:",
      subject
    );

    return true;


  } catch (error) {

    console.error(
      "Brevo request error:",
      error
    );

    return false;

  }

}


/* =========================
   BOOKING DETAILS HTML
========================= */

function bookingDetailsHTML(booking) {

  return `

    <table
      cellpadding="8"
      cellspacing="0"
      style="
        width:100%;
        border-collapse:collapse;
        font-family:Arial,sans-serif;
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

    </table>

  `;

}


/* =========================
   ADMIN NEW BOOKING EMAIL
========================= */

async function sendAdminBookingEmail(booking) {

  if (!ADMIN_EMAILS.length) {

    console.error(
      "ADMIN_EMAILS is missing."
    );

    return;

  }


  const htmlContent = `

    <div style="
      max-width:650px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      color:#222;
    ">

      <h2>
        New Chende Booking Request
      </h2>

      <p>
        A new booking request has been submitted
        through the Shri Mahaganapathi Chende Balaga website.
      </p>

      <hr>

      ${bookingDetailsHTML(booking)}

      <hr>

      <p>
        <strong>Status:</strong> Pending
      </p>

      <p>
        Please open the admin dashboard to review
        this booking.
      </p>

      <p style="
        color:#777;
        font-size:13px;
      ">
        Shri Mahaganapathi Chende Balaga — Mudradi
      </p>

    </div>

  `;


  await sendBrevoEmail({

    to:
      ADMIN_EMAILS,

    subject:
      `New Chende Booking #${booking.id}`,

    htmlContent:
      htmlContent

  });

}


/* =========================
   CUSTOMER BOOKING RECEIVED
========================= */

async function sendCustomerBookingReceivedEmail(
  booking
) {

  if (!booking.email) {

    console.log(
      "Customer email not provided. Skipping customer email."
    );

    return;

  }


  const htmlContent = `

    <div style="
      max-width:650px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      color:#222;
    ">

      <h2>
        Booking Request Received
      </h2>

      <p>
        Dear ${booking.customer_name},
      </p>

      <p>
        Thank you for submitting your booking request
        to <strong>Shri Mahaganapathi Chende Balaga</strong>.
      </p>

      <p>
        Your request has been received successfully
        and is currently <strong>pending confirmation</strong>.
      </p>

      <hr>

      ${bookingDetailsHTML(booking)}

      <hr>

      <p>
        We will contact you regarding the confirmation
        of your booking.
      </p>

      <p>
        Thank you.
      </p>

      <p>
        <strong>
          Shri Mahaganapathi Chende Balaga
        </strong><br>
        Mudradi
      </p>

    </div>

  `;


  await sendBrevoEmail({

    to:
      booking.email,

    subject:
      `Booking Request Received #${booking.id}`,

    htmlContent:
      htmlContent

  });

}


/* =========================
   CUSTOMER CONFIRMED EMAIL
========================= */

async function sendCustomerConfirmedEmail(
  booking
) {

  if (!booking.email) {

    console.log(
      "Customer email not provided. Skipping confirmation email."
    );

    return;

  }


  const htmlContent = `

    <div style="
      max-width:650px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      color:#222;
    ">

      <h2>
        Booking Confirmed
      </h2>

      <p>
        Dear ${booking.customer_name},
      </p>

      <p>
        Your booking request with
        <strong>Shri Mahaganapathi Chende Balaga</strong>
        has been <strong>confirmed</strong>.
      </p>

      <hr>

      ${bookingDetailsHTML(booking)}

      <hr>

      <p>
        <strong>
          Booking Status: CONFIRMED
        </strong>
      </p>

      <p>
        Thank you for choosing
        Shri Mahaganapathi Chende Balaga.
      </p>

      <p>
        <strong>
          Shri Mahaganapathi Chende Balaga
        </strong><br>
        Mudradi
      </p>

    </div>

  `;


  await sendBrevoEmail({

    to:
      booking.email,

    subject:
      `Booking Confirmed #${booking.id}`,

    htmlContent:
      htmlContent

  });

}


/* =========================
   CUSTOMER CANCELLED EMAIL
========================= */

async function sendCustomerCancelledEmail(
  booking
) {

  if (!booking.email) {

    console.log(
      "Customer email not provided. Skipping cancellation email."
    );

    return;

  }


  const htmlContent = `

    <div style="
      max-width:650px;
      margin:auto;
      padding:20px;
      font-family:Arial,sans-serif;
      color:#222;
    ">

      <h2>
        Booking Cancelled
      </h2>

      <p>
        Dear ${booking.customer_name},
      </p>

      <p>
        We regret to inform you that your booking request
        with <strong>Shri Mahaganapathi Chende Balaga</strong>
        has been <strong>cancelled</strong>.
      </p>

      <hr>

      ${bookingDetailsHTML(booking)}

      <hr>

      <p>
        <strong>
          Booking Status: CANCELLED
        </strong>
      </p>

      <p>
        If you have any questions, please contact
        Shri Mahaganapathi Chende Balaga.
      </p>

      <p>
        <strong>
          Shri Mahaganapathi Chende Balaga
        </strong><br>
        Mudradi
      </p>

    </div>

  `;


  await sendBrevoEmail({

    to:
      booking.email,

    subject:
      `Booking Cancelled #${booking.id}`,

    htmlContent:
      htmlContent

  });

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

        status:
          "ok",

        database:
          true

      });

    } catch (error) {

      console.error(
        "Health check error:",
        error
      );

      res.status(500).json({

        status:
          "error",

        database:
          false

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


      const booking = {

        id:
          bookingId,

        customer_name:
          customer_name,

        email:
          email || null,

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
          message || null,

        status:
          "pending"

      };


      /* =========================
         SEND EMAILS
      ========================= */

      await sendAdminBookingEmail(
        booking
      );

      await sendCustomerBookingReceivedEmail(
        booking
      );


      /* =========================
         RESPONSE
      ========================= */

      res.status(201).json({

        success:
          true,

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

        success:
          false,

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

        success:
          true,

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


      /* =========================
         GET BOOKING BEFORE UPDATE
      ========================= */

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


      if (
        booking.status !== "pending"
      ) {

        return res.status(404).json({

          message:
            "Booking not found or already processed."

        });

      }


      /* =========================
         UPDATE STATUS
      ========================= */

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


      /* =========================
         UPDATED BOOKING
      ========================= */

      booking.status =
        status;


      /* =========================
         CUSTOMER EMAIL
      ========================= */

      if (
        status === "accepted"
      ) {

        await sendCustomerConfirmedEmail(
          booking
        );

      }

      else if (
        status === "rejected"
      ) {

        await sendCustomerCancelledEmail(
          booking
        );

      }


      /* =========================
         RESPONSE
      ========================= */

      res.json({

        success:
          true,

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

        success:
          true,

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