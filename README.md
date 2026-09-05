


## Email-only notifications

This version removes Twilio and WhatsApp completely. It uses Gmail SMTP through Nodemailer.

### Setup
1. Copy `backend/.env.example` to `backend/.env`.
2. Put your Gmail address in `SMTP_USER` and `SMTP_FROM`.
3. Put a Google 16-character App Password in `SMTP_PASS` (not your normal Gmail password).
4. Put all admin email addresses in `ADMIN_EMAILS`, separated by commas.
5. If your terminal previously showed `self-signed certificate in certificate chain`, keep `SMTP_TLS_REJECT_UNAUTHORIZED=false`. Otherwise, for normal certificate verification, set it to `true`.
6. Restart the server with `node server.js`.
7. Open `http://localhost:5000/api/health` and confirm `notifications.email` is `true`.

Customer emails are sent to the email entered on the booking form. Admin new-booking emails are sent to every address in `ADMIN_EMAILS`. Status changes (pending, confirmed, cancelled, completed) trigger customer email notifications.
