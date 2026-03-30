@echo off
title Aspire CMS - Admin Server
color 0A
echo.
echo  =========================================
echo   Aspire CMS Admin Panel - Local Server
echo  =========================================
echo.
echo  Starting server on http://localhost:8080
echo  Admin Login: http://localhost:8080/admin pages/login.html
echo.
echo  Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
npx --yes serve . -p 8080 --no-clipboard
pause
