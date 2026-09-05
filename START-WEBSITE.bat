@echo off
title Shri Mahaganapathi Chende Balaga
cd /d "%~dp0backend"
echo.
echo Starting Shri Mahaganapathi Chende Balaga booking server...
echo Keep this window open while using the booking/payment feature.
echo.
if not exist node_modules (
  echo Installing backend packages...
  call npm install
)
node server.js
pause
