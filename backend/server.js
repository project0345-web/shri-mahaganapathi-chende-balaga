require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const https = require('https');

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-admin-password';
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-admin-key';
const PORT = process.env.PORT || 5000;

const brevoApiKey = process.env.BREVO_API_KEY || '';
const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || '';
const brevoSenderName =
  process.env.BREVO_SENDER_NAME || 'Shri Mahaganapathi Chende Balaga';

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean);

const emailReady = Boolean(brevoApiKey && brevoSenderEmail);

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({
      error: 'Admin authentication required.'
    });
  }

  next();
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

function normalizePhone(phone) {
  const raw = String(phone || '').trim();

  if (raw.startsWith('+')) {
    return raw.replace(/[^+\d]/g, '');
  }

  const digits = raw.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

function formatDate(date) {
  if (!date) return 'Not provided';

  // Handle MySQL DATE values like 2026-09-15
  const value = String(date).trim().slice(0, 10);

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    console.log('Unexpected event_date value:', date);
    return value || 'Not provided';
  }

  const year = match[1];
  const month = Number(match[2]);
  const day = Number(match[3]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  if (month < 1 || month > 12) {
    return value;
  }

  return `${day} ${months[month - 1]} ${year}`;
}
function formatTime(time) {
  if (!time) return '';

  const [h, m] = String(time)
    .slice(0, 5)
    .split(':')
    .map(Number);

  const d = new Date(2000, 0, 1, h, m);

  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

async function sendBrevoEmail({ to, subject, text, html }) {
  if (!emailReady) {
    return {
      sent: false,
      reason: 'email-not-configured'
    };
  }

  const recipients = Array.isArray(to)
    ? to
        .filter(Boolean)
        .map(email => ({ email }))
    : [{ email: to }];

  if (!recipients.length) {
    return {
      sent: false,
      reason: 'no-recipient'
    };
  }

  const data = JSON.stringify({
    sender: {
      name: brevoSenderName,
      email: brevoSenderEmail
    },
    to: recipients,
    subject,
    textContent: text,
    htmlContent: html || `<p>${String(text).replace(/\n/g, '<br>')}</p>`
  });

  return new Promise(resolve => {
    const request = https.request(
      {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(data)
        }
      },
      response => {
        let body = '';

        response.on('data', chunk => {
          body += chunk;
        });

        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log('Brevo email sent successfully.');
            resolve({
              sent: true,
              response: body
            });
          } else {
            console.error(
              'Brevo email error:',
              response.statusCode,
              body
            );

            resolve({
              sent: false,
              error: `Brevo returned HTTP ${response.statusCode}`
            });
          }
        });
      }
    );

    request.on('error', error => {
      console.error('Brevo request error:', error.message);

      resolve({
        sent: false,
        error: error.message
      });
    });

    request.write(data);
    request.end();
  });
}

async function notifyCustomer(booking, status) {
  const result = {
    email: {
      sent: false
    }
  };

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return result;
  }

  if (!booking.email) {
    return {
      email: {
        sent: false,
        reason: 'no-customer-email'
      }
    };
  }

  const subject =
    status === 'confirmed'
      ? 'Chende Booking Confirmed'
      : status === 'cancelled'
      ? 'Chende Booking Cancelled'
      : status === 'completed'
      ? 'Chende Booking Completed'
      : 'Chende Booking Update';

  const statusText = status.toUpperCase();

  const text = `Dear ${booking.customer_name},

Your Chende booking request #${booking.id} has been ${status}.

Event: ${booking.event_type}
Date: ${formatDate(booking.event_date)}
Time: ${formatTime(booking.start_time)}
Location: ${booking.location}
Status: ${statusText}

You can check your booking status using your Booking ID and phone number.

Shri Mahaganapathi Chende Balaga
Mudradi, Karnataka
Phone: 8971474693 / 8277069598 / 9844667599`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;">
      <h2>Shri Mahaganapathi Chende Balaga</h2>

      <p>Dear ${booking.customer_name},</p>

      <p>
        Your Chende booking request
        <strong>#${booking.id}</strong>
        has been <strong>${status}</strong>.
      </p>

      <p><strong>Event:</strong> ${booking.event_type}</p>
      <p><strong>Date:</strong> ${formatDate(booking.event_date)}</p>
      <p><strong>Time:</strong> ${formatTime(booking.start_time)}</p>
      <p><strong>Location:</strong> ${booking.location}</p>
      <p><strong>Status:</strong> ${statusText}</p>

      <p>
        You can check your booking status using your
        Booking ID and phone number.
      </p>

      <hr>

      <p>
        <strong>Shri Mahaganapathi Chende Balaga</strong><br>
        Mudradi, Karnataka<br>
        Phone: 8971474693 / 8277069598 / 9844667599
      </p>
    </div>
  `;

  try {
    result.email = await sendBrevoEmail({
      to: booking.email,
      subject,
      text,
      html
    });
  } catch (e) {
    console.error('Customer email notification failed:', e.message);

    result.email = {
      sent: false,
      error: e.message
    };
  }

  return result;
}

async function notifyAdminNewBooking(booking) {
  const result = {
    email: {
      sent: false
    }
  };

  if (!adminEmails.length) {
    return {
      email: {
        sent: false,
        reason: 'admin-emails-not-configured'
      }
    };
  }

  const subject = `New Chende Booking Request #${booking.id}`;

  const text = `New Chende booking request #${booking.id} has been received.

Customer: ${booking.customer_name}
Phone: ${booking.phone}
Email: ${booking.email || 'Not provided'}
Event: ${booking.event_type}
Date: ${formatDate(booking.event_date)}
Time: ${formatTime(booking.start_time)}
Location: ${booking.location}
Message: ${booking.message || 'None'}
Status: PENDING

Please login to the Chende admin dashboard to review and confirm/cancel the booking.

Shri Mahaganapathi Chende Balaga
Mudradi, Karnataka`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;">
      <h2>New Chende Booking Request</h2>

      <p>
        <strong>Booking ID:</strong> #${booking.id}
      </p>

      <hr>

      <p><strong>Customer:</strong> ${booking.customer_name}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Email:</strong> ${booking.email || 'Not provided'}</p>
      <p><strong>Event:</strong> ${booking.event_type}</p>
      <p><strong>Date:</strong> ${formatDate(booking.event_date)}</p>
      <p><strong>Time:</strong> ${formatTime(booking.start_time)}</p>
      <p><strong>Location:</strong> ${booking.location}</p>
      <p><strong>Message:</strong> ${booking.message || 'None'}</p>
      <p><strong>Status:</strong> PENDING</p>

      <hr>

      <p>
        Please login to the Chende admin dashboard
        to review and confirm/cancel the booking.
      </p>

      <p>
        <strong>Shri Mahaganapathi Chende Balaga</strong><br>
        Mudradi, Karnataka
      </p>
    </div>
  `;

  const failures = [];
  let sent = 0;

  if (!emailReady) {
    return {
      email: {
        sent: false,
        reason: 'email-not-configured'
      }
    };
  }

  for (const email of adminEmails) {
    try {
      const response = await sendBrevoEmail({
        to: email,
        subject,
        text,
        html
      });

      if (response.sent) {
        sent++;
      } else {
        failures.push({
          email,
          error: response.error || response.reason
        });
      }
    } catch (e) {
      console.error(
        `Admin email notification failed for ${email}:`,
        e.message
      );

      failures.push({
        email,
        error: e.message
      });
    }
  }

  result.email = {
    sent: sent > 0,
    count: sent,
    total: adminEmails.length,
    failures
  };

  return result;
}

app.get('/api/health', async (_, res) => {
  try {
    await db.query('SELECT 1');

    res.json({
      ok: true,
      service: 'Chende Booking API',
      database: true,
      notifications: {
        email: emailReady,
        adminEmails: adminEmails.length
      }
    });
  } catch (e) {
    console.error('Database connection error:', e);

    res.status(503).json({
      ok: false,
      service: 'Chende Booking API',
      database: false,
      error: e.message
    });
  }
});

app.post('/api/bookings', async (req, res) => {
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

  if (
    !customer_name ||
    !phone ||
    !event_type ||
    !event_date ||
    !start_time ||
    !location
  ) {
    return res.status(400).json({
      error: 'Please fill all required fields.'
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO bookings
      (customer_name,email,phone,event_type,event_date,start_time,location,message,status)
      VALUES (?,?,?,?,?,?,?,?, 'pending')`,
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

    const [[booking]] = await db.query(
      'SELECT * FROM bookings WHERE id=?',
      [result.insertId]
    );

    const customerNotifications = await notifyCustomer(
      booking,
      'pending'
    );

    const adminNotifications = await notifyAdminNewBooking(
      booking
    );

    res.status(201).json({
      id: result.insertId,
      status: 'pending',
      message: 'Booking request created successfully.',
      notifications: {
        customer: customerNotifications,
        admin: adminNotifications
      }
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: 'Could not create booking.'
    });
  }
});

app.post('/api/bookings/status', async (req, res) => {
  const id = Number(req.body?.id);
  const phone = String(req.body?.phone || '').trim();

  if (!id || !phone) {
    return res.status(400).json({
      error: 'Booking ID and phone number are required.'
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT
        id,
        customer_name,
        event_type,
        event_date,
        start_time,
        location,
        status,
        created_at
      FROM bookings
      WHERE id=? AND phone=?`,
      [id, phone]
    );

    if (!rows.length) {
      return res.status(404).json({
        error:
          'No booking found with that Booking ID and phone number.'
      });
    }

    res.json({
      ok: true,
      booking: rows[0]
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: 'Could not check booking status.'
    });
  }
});

app.post('/api/admin/login', async (req, res) => {
  if (
    !req.body?.password ||
    req.body.password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      error: 'Invalid admin password.'
    });
  }

  res.json({
    ok: true,
    key: ADMIN_KEY
  });
});

app.get('/api/bookings', requireAdmin, async (_, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM bookings ORDER BY created_at DESC'
    );

    res.json(rows);
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: 'Database unavailable'
    });
  }
});

app.patch('/api/bookings/:id/status', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const allowed = [
    'pending',
    'confirmed',
    'cancelled',
    'completed'
  ];

  const status = req.body?.status;

  if (!id || !allowed.includes(status)) {
    return res.status(400).json({
      error: 'Invalid booking status.'
    });
  }

  try {
    const [result] = await db.query(
      'UPDATE bookings SET status=? WHERE id=?',
      [status, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        error: 'Booking not found.'
      });
    }

    const [[booking]] = await db.query(
      'SELECT * FROM bookings WHERE id=?',
      [id]
    );

    const notifications = await notifyCustomer(
      booking,
      status
    );

    res.json({
      ok: true,
      booking,
      notifications
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: 'Could not update booking status.'
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Chende Booking API running on http://localhost:${PORT}`
  );
});