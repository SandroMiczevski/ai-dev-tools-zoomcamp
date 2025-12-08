@echo off
echo Setting up Coding Interview Platform...
echo.

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo   1. Start the backend:  cd backend ^&^& npm run dev
echo   2. Start the frontend: cd frontend ^&^& npm run dev
echo   3. Open http://localhost:3000 in your browser
