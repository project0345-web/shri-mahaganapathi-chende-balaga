require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

const PORT =
  process.env.PORT || 5000;


/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: "*"
  })
);

app.use(
  express.json()
);


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

  password:
    process.env.DB_PASSWORD,

  database:
    process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false
  }

});


/* =========================
   HELPERS
========================= */

function formatDate(date) {

  if (!date) {
    return "";
  }

  const d =
    new Date(date);

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
         INSERT
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

      const [
        rows
      ] =
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


      const [
        rows
      ] =
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


      const [
        result
      ] =
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