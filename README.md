1] Event Registration & Gallery Website ---------------------------

A full-stack website that enables students to register for upcoming events and allows admins to manage events and winners. It also includes a public gallery showcasing past winners.

2] Functional Flow Summary -----------------------------------------

Public Users land on Home Page, view events and gallery.
Click "Explore Events" → view list of upcoming events.
Click "Register":
If logged in: go to event registration.
If not logged in: redirected to login/signup.
Students log in → can register for events and view dashboard.
Admins log in → access dashboard to:
Create events
Add past winners to gallery
Anyone can view the gallery of past winners.

3] Tech Stack (MERN) ------------------------------------------------

🖥️ Frontend – React.js
React.js – SPA with reusable components.
React Router DOM – Page routing (/events, /login, etc.).
Axios – To communicate with backend API.
Tailwind CSS / Bootstrap – For styling and responsive UI.
JWT – Token stored in localStorage for session management.
🌐 Backend – Node.js + Express
Express.js – RESTful API structure.
bcrypt.js – Secure password hashing.
jsonwebtoken (JWT) – Auth middleware & token issuance.
dotenv – Manage secrets in .env.
🗃️ Database – MongoDB + Mongoose
MongoDB Atlas – Cloud-based NoSQL database.
Mongoose – Schema modeling for:
Users (Admin/Student)
Events
Registrations
Gallery (winners)
🧪 Dev Tools
Postman – API testing.
VS Code – IDE.
Git & GitHub – Version control and collaboration.

4] Setup Instructions -----------------------------------------------

Backend setup:

   1)Clone the repo:
     git clone <repo-url> && cd server
   2)Install dependencies:
     npm install
   3)Create .env file:
     MONGO_URI=your-mongo-url
     JWT_SECRET=your-secret-key
     PORT=5000
   4)Start server:
     npm run dev  

Frontend setup:

   1)Navigate to frontend/:
     cd frontend
   2)Install dependencies:
     npm install
   3)Start React app:
     npm start

5] Demo video link :
     
    
     

