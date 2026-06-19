# MERN Stack Starter

MongoDB + Express + React + Node.js

## Getting Started

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Run both server and client together
npm run dev
```

Server runs at `http://localhost:5000`
Client runs at `http://localhost:3000`

## Project Structure

```
server/
├── index.js               # Express entry point
├── routes/
│   └── users.js
├── controllers/
│   └── users.controller.js
└── models/
    └── User.js

client/                    # React app (Create React App)
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.js
    └── App.css
```
