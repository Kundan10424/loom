# MEAN Stack Starter

MongoDB + Express + Angular + Node.js

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
Client runs at `http://localhost:4200`

## Project Structure

```
server/
├── index.js
├── routes/
│   └── users.js
├── controllers/
│   └── users.controller.js
└── models/
    └── User.js

client/                    # Angular app (Angular CLI)
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.component.ts
        ├── app.component.html
        └── app.component.css
```
