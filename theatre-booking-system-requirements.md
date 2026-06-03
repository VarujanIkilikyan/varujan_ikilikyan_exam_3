# Theatre Seat Booking System - Project Requirements

## Project Overview

Create a comprehensive Theatre Seat Booking System using Node.js, Express, and MySQL. This full-stack web application should allow users to browse films, book seats, and manage their reservations while providing administrators with tools to manage the theatre's content and schedule.

---

## Core Technologies

- **Backend:** Node.js with Express.js (v5)
- **Frontend:** HTML, CSS, JavaScript
- **Validation:** Joi
- **Database:** MySQL (using mysql2 package)
- **Authentication:** JSON Web Tokens (jsonwebtoken)
- **Password Hashing:** MD5 or crypto-js
- **Date Handling:** moment
- **Unique IDs:** uuid
- **Environment Variables:** dotenv
- **Development:** nodemon (for auto-restart during development)

---

## User Roles & Permissions

### Regular User
- Browse available films and showtimes
- Register and login
- Select and book seats
- View personal booking history
- View booking confirmation

### Administrator
- All user permissions plus:
- Add, edit, and delete films
- Create showtimes (up to 3 per day for each film)
- View all bookings
- View simple statistics (optional)

---

## Core Features (Required)

### 1. User Authentication & Authorization
- **User Registration**
  - Email and password-based registration
  - Email format validation (use Joi)
  - Password strength requirements (min 6 characters)
  - Unique username/email validation
  - Hash passwords using MD5 before storing in database

- **User Login**
  - JWT (JSON Web Token) based authentication
  - Store token in browser localStorage or cookies
  - Token expiration handling
  - Logout functionality (clear token)

- **Password Management**
  - Change password functionality

### 2. Film Management

- **Film Catalog**
  - Display all available films with pagination (10 films per page)
  - **Search functionality (IMPORTANT):** Search films by title in real-time
  - Film details: title, genre, duration, description
  - Show page numbers and navigation (Previous/Next buttons)

- **Admin Film Operations**
  - Add new films with all details
  - Edit existing film information
  - Delete films (only if no bookings exist)
  - View all films with pagination and search

### 3. Film Comments & Reviews (IMPORTANT - Requires JOINs)

This feature allows users to share their opinions about films they've watched.

**User Features:**
- **Add Comment/Review**
  - Users can only comment on films they have booked/watched
  - Comment text (max 500 characters)
  - Rating (1-5 stars) - optional or required
  - Validation: user must have at least one confirmed booking for that film
  - Display username and date with each comment

- **Edit Own Comments**
  - Users can edit their own comments within 24 hours of posting
  - Cannot edit after 24 hours
  - Use moment.js to check time difference

- **Delete Own Comments**
  - Users can delete their own comments anytime
  - Soft delete (status = 'deleted') or hard delete

**Display Comments:**
- Show all approved comments on film details page
- Display with pagination (10 comments per page)
- Sort by: newest first, oldest first, highest rating, lowest rating
- Show total comment count
- Show average rating for the film (calculated from all comments)
- Display: username, rating (stars), comment text, date posted

**Admin Features:**
- **Moderate Comments**
  - Approve or reject pending comments (if moderation enabled)
  - Delete inappropriate comments
  - View all comments with film information (using JOINs)
  - Filter comments by status (pending/approved/rejected)

**Database Requirements:**
- Prevent duplicate comments (one comment per user per film)
- Use UNIQUE constraint on (user_id, film_id)
- Comments table needs: id, user_id, film_id, rating, comment_text, status, created_at, updated_at

**SQL Queries Required:**
- Get comments with user information (JOIN users table)
- Get comments with film information (JOIN films table)
- Calculate average rating per film (GROUP BY film_id)
- Check if user has watched film (JOIN bookings and showtimes)
- Get comment count per film (GROUP BY)

### 4. Showtime Management

- **Showtime Display**
  - Show available dates and times for each film
  - Up to 3 showtimes per film per day
  - Show seat availability status

- **Admin Showtime Operations**
  - Create showtimes for specific dates
  - Set a single ticket price per showtime

---

### 5. Seat Selection & Booking

- **Interactive Seat Map**
  - Visual seat layout (rows and columns)
  - Color-coded seat status:
    - Available (green)
    - Selected (yellow)
    - Booked (red)
  - Multiple seat selection capability
  - All seats have the same price

- **Booking Process**
  - Real-time seat availability check
  - Prevent double-booking
  - Calculate total price based on selected seats
  - Booking confirmation page
  - Generate unique booking reference using uuid package

- **Booking Restrictions**
  - Maximum 6 seats per booking

### 5. Booking History & Management

- **User Booking History**
  - Display format: "Tom Ford booked seat 4/5 at 15:30 on 22 Aug 2024"
  - Use moment.js to format dates and times nicely
  - Show film name, showtime, seats, total price
  - **Pagination (IMPORTANT):** Show 10 bookings per page
  - Page navigation (Previous/Next, page numbers)
  - Show total number of bookings

- **Booking Actions**
  - View booking details
  - Cancel bookings (optional)

---

### 6. Analytics & Reports (IMPORTANT - Requires GROUP BY & JOINs)

This feature demonstrates your SQL skills with complex queries using GROUP BY and JOINs.

**User Dashboard:**
- **My Statistics** (visible to logged-in users)
  - Total money spent on bookings
  - Total number of bookings made
  - Favorite genre (most booked genre)
  - Most watched film

**Admin Dashboard - Film Analytics:**
- **Popular Films Report** (requires JOIN + GROUP BY)
  - List films with total bookings count
  - Show revenue generated per film
  - Display average seats booked per showtime
  - Sort by popularity (most booked first)

**Admin Dashboard - Revenue Analytics:**
- **Daily/Weekly Revenue** (requires GROUP BY with dates)
  - Total revenue by date
  - Total bookings by date
  - Chart or table showing trends
  - Filter by date range

**Admin Dashboard - User Analytics:**
- **Top Users Report** (requires JOIN + GROUP BY)
  - Users with most bookings
  - Total amount spent by each user
  - Show username, total bookings, total spent
  - Minimum 5 bookings to appear in top users

**Showtime Performance:**
- **Showtime Statistics** (requires multiple JOINs + GROUP BY)
  - Each showtime with film name
  - Total seats booked vs total seats
  - Occupancy percentage (booked/total * 100)
  - Revenue per showtime
  - Sort by occupancy rate

---

## Optional Enhancement Features

Choose 1-2 of these features to implement if you have extra time:

### 7. Film Poster Upload

- **Image Upload**
  - Upload film poster images
  - Display posters on film listing page
  - Store images in public/images folder
  - Default placeholder image if no poster

### 8. Advanced Filtering

- **Filter Options**
  - Filter films by genre (dropdown)
  - Filter by duration (short/medium/long)
  - Combine filters with search
  - Sort by title (A-Z, Z-A) or date added

### 9. User Profile Management

- **Profile Page**
  - View and edit personal information
  - Change email and phone number
  - Update password with confirmation
  - View account statistics (total bookings, total spent)

### 10. Booking Confirmation Enhancement

- **Enhanced Confirmation**
  - Show booking details after successful booking
  - Display booking reference (UUID) as QR code
  - Format date/time using moment.js
  - Print-friendly booking ticket
  - Share booking details option

---

## Database Schema Requirements

### Required Tables

1. **users**
   - id (Primary Key, AUTO_INCREMENT)
   - username (VARCHAR, UNIQUE)
   - email (VARCHAR, UNIQUE)
   - password (VARCHAR - hashed with MD5)
   - full_name (VARCHAR)
   - role (ENUM: 'user', 'admin')
   - created_at (DATETIME)

   Note: JWT tokens are NOT stored in database - they are sent to client

2. **films**
   - id (Primary Key, AUTO_INCREMENT)
   - title (VARCHAR)
   - description (TEXT)
   - genre (VARCHAR - e.g., 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi')
   - duration (INT - in minutes)
   - created_at (DATETIME)

3. **showtimes**
   - id (Primary Key, AUTO_INCREMENT)
   - film_id (Foreign Key → films.id)
   - show_date (DATE)
   - show_time (TIME)
   - price (DECIMAL)
   - total_seats (INT - e.g., 50)
   - available_seats (INT)
   - created_at (DATETIME)

4. **bookings**
   - id (Primary Key, AUTO_INCREMENT)
   - user_id (Foreign Key → users.id)
   - showtime_id (Foreign Key → showtimes.id)
   - seats (VARCHAR - e.g., "A1,A2,A3")
   - total_price (DECIMAL)
   - booking_reference (VARCHAR - unique, generated with uuid)
   - booking_date (DATETIME)
   - status (ENUM: 'confirmed', 'cancelled')

5. **comments**
   - id (Primary Key, AUTO_INCREMENT)
   - user_id (Foreign Key → users.id)
   - film_id (Foreign Key → films.id)
   - rating (INT - 1 to 5 stars, optional: NULL allowed or NOT NULL)
   - comment_text (TEXT - max 500 characters)
   - status (ENUM: 'pending', 'approved', 'rejected', 'deleted')
   - created_at (DATETIME)
   - updated_at (DATETIME)
   - UNIQUE KEY unique_user_film (user_id, film_id) - prevents duplicate comments

### Database Relationships (for JOINs)

- **One-to-Many:** One film has many showtimes
- **One-to-Many:** One showtime has many bookings
- **One-to-Many:** One user has many bookings
- **One-to-Many:** One user has many comments
- **One-to-Many:** One film has many comments
- **Many-to-One:** Many bookings belong to one showtime → one film (through JOIN)
- **Many-to-One:** Many comments belong to one user (JOIN users to get username)
- **Many-to-One:** Many comments belong to one film (JOIN films to get film details)

---

## Search & Pagination Implementation (IMPORTANT)

### Why These Features Are Important

1. **Search:** Helps users quickly find films they want to watch without scrolling through all films
2. **Pagination:** Improves performance and user experience when dealing with many records (films, bookings)

### Where to Implement

**REQUIRED Pagination:**
- Film listing page (10 films per page)
- User booking history (10 bookings per page)
- Admin: All films list (10 per page)
- Admin: All bookings list (20 per page) - optional

**REQUIRED Search:**
- Film listing page (search by title)
- Admin film management (search films)

### Pagination Components

Your pagination should include:
- Current page number
- Total pages
- Previous button (disabled on page 1)
- Next button (disabled on last page)
- Page number links (e.g., 1, 2, 3, 4, 5)
- Show "X-Y of Z results" text

### Search Implementation

- Search input field at the top of the page
- Search on form submit OR real-time search (with button)
- Show "No results found" message when search returns empty
- Clear search button to reset
- Search should work WITH pagination (search results also paginated)

---

## JWT Authentication Flow

### How JWT Works in This Project

1. **User Registration:**
   - Hash password with MD5
   - Store user in database
   - Do NOT create token yet

2. **User Login:**
   - Check email/password
   - If valid, create JWT token with user data
   - Send token to client (response or cookie)

3. **Protected Routes:**
   - Client sends token with each request (in header or cookie)
   - Middleware verifies token
   - If valid, allow access; if invalid, redirect to login

### Example JWT Payload:
```javascript
{
  id: 1,
  email: "user@example.com",
  role: "user"
}
```

### Token Storage Options:
- **Option 1:** localStorage (easier for students)
- **Option 2:** HTTP-only cookies (more secure)

---

## Technical Requirements

### Validation & Error Handling

- **Input Validation**
  - Use Joi for all form inputs
  - Validate email format, password length, required fields
  - Show user-friendly error messages

- **Error Handling**
  - Custom error page for 404 (Page Not Found)
  - Handle database errors gracefully
  - Display helpful error messages to users

### Security Best Practices

- Use mysql2 with parameterized queries to prevent SQL injection
- Hash passwords with MD5 before storing in database
- Use JWT (jsonwebtoken) for authentication
- Protect routes with JWT middleware (check token validity)
- Validate all user inputs with Joi
- Store sensitive data (JWT secret) in .env file
- Set JWT expiration time (e.g., 24 hours)

### Code Quality

- Use MVC architecture pattern (Models, Views, Controllers)
- Organize code into separate folders
- Use meaningful variable names
- Add comments for complex logic
- Use Git for version control

---

## Project Structure (Recommended)

```
theatre-booking-system/
├── config/
│   ├── database.js          # MySQL connection using mysql2
│   └── config.js            # Other configurations
├── controllers/
│   ├── authController.js    # Login, register, JWT generation
│   ├── filmController.js    # Film CRUD operations
│   ├── commentController.js # Comment/review operations
│   ├── bookingController.js # Booking logic
│   └── adminController.js   # Admin operations
├── models/
│   ├── User.js              # User database operations
│   ├── Film.js              # Film database operations
│   ├── Comment.js           # Comment database operations
│   ├── Showtime.js          # Showtime database operations
│   └── Booking.js           # Booking database operations
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── films.js             # Film routes
│   ├── comments.js          # Comment/review routes
│   ├── bookings.js          # Booking routes
│   └── admin.js             # Admin routes
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   ├── validation.js        # Joi validation middleware
│   └── errorHandler.js      # Error handling middleware
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── utils/
│   ├── helpers.js           # Helper functions
│   └── jwt.js               # JWT token generation/verification
├── .env                     # Environment variables (DB config, JWT secret)
├── .gitignore
├── package.json
└── app.js                   # Main application file
```

---

## Deliverables

1. **Source Code**
   - Complete Node.js application
   - Well-organized folder structure
   - Comments in code where needed

2. **Database**
   - MySQL database with all tables
   - Sample data (at least 3 films, some users, and bookings)

3. **Documentation**
   - README.md with:
     - How to install and run the project
     - Database setup instructions
     - Test user credentials (user and admin accounts)

---

## Evaluation Criteria

- **Functionality (25%):** All core features working correctly
- **SQL Queries - GROUP BY & JOINs (25%):** Properly implemented analytics and comments with complex SQL queries
- **Search & Pagination (10%):** Properly implemented search and pagination on required pages
- **Code Organization (15%):** Clean folder structure, MVC pattern
- **Database Design (15%):** Proper table structure and relationships
- **User Interface (5%):** Easy to use and navigate
- **Validation & Security (5%):** Input validation and password encryption

---

## Getting Started

1. Install Node.js and MySQL on your computer
2. Create a new project folder
3. Run `npm init -y` to create package.json
4. Install required packages (copy-paste this command):
   ```bash
   npm install express joi mysql2 jsonwebtoken crypto-js md5 moment uuid dotenv morgan http-errors debug lodash
   ```
5. Install nodemon for development:
   ```bash
   npm install --save-dev nodemon
   ```
6. Add script to package.json:
   ```json
   "scripts": {
     "start": "node app.js",
     "dev": "nodemon app.js"
   }
   ```
7. Create .env file with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=theatre_booking
   JWT_SECRET=your_secret_key_here
   PORT=3000
   ```
8. Create MySQL database and tables
9. Set up your folder structure (see Project Structure above)
10. Start with authentication system (login/register with JWT)
11. Build features step by step
12. Test each feature before moving to the next
13. Run project: `npm run dev` (for development)

---

## Support & Resources

- Express.js Documentation: https://expressjs.com/
- Joi Validation: https://joi.dev/
- MySQL2 Documentation: https://www.npmjs.com/package/mysql2
- JWT (jsonwebtoken): https://www.npmjs.com/package/jsonwebtoken
- MD5: https://www.npmjs.com/package/md5
- Moment.js: https://momentjs.com/
- UUID: https://www.npmjs.com/package/uuid
- Crypto-js: https://www.npmjs.com/package/crypto-js

---

## Suggested Timeline

- **Week 1:** Project setup, database design, user registration & login (with JWT)
- **Week 2:** Film listing with **search and pagination**, admin panel for adding films
- **Week 3:** Showtime management, seat booking system, **film comments/reviews feature**
- **Week 4:** Booking history with **pagination**, **analytics/reports with GROUP BY & JOINs**
- **Week 5:** Testing, bug fixes, documentation, optional enhancements

---

**Good luck with your project!** 🎬🍿