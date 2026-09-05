USE chende_booking;

-- One-time migration from the previous version.
-- Customers now book the Chende Balaga directly: no package/team and no payment fields.
ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_1;
ALTER TABLE bookings
  DROP COLUMN team_id,
  DROP COLUMN payment_status,
  DROP COLUMN payment_id,
  DROP COLUMN amount;
DROP TABLE IF EXISTS teams;
