# Cinema Reservation Platform — Assignment Brief

## Summary

Build an end-to-end Cinema Reservation Platform with Node.js, Express, and MySQL. The application lets visitors explore the program of films, reserve seats for a screening, and keep track of their reservations. Staff accounts get an additional toolset for curating the catalogue and scheduling screenings.

---

## Technology Stack

- **Server:** Node.js running Express.js (version 5)
- **Client:** plain HTML, CSS, and JavaScript
- **Schema validation:** Joi
- **Persistence:** MySQL accessed through the **Sequelize** ORM (with the `mysql2` driver underneath)
- **Sessions / identity:** JSON Web Tokens (`jsonwebtoken`)
- **Password digest:** MD5 (`md5`) or `crypto-js`
- **Time & dates:** `moment`
- **Reference IDs:** `uuid`
- **Config:** `dotenv`
- **Live reload (dev only):** `nodemon`

---

## Accounts & What They Can Do

### Member (standard account)
- Browse the screening program and the films on offer
- Sign up and sign in
- Pick seats and confirm a reservation
- Review their own reservation history
- See the confirmation for a completed reservation

### Staff (elevated account)
- Everything a member can do, plus:
- Create, update, and remove films
- Schedule screenings (no more than 3 per film per calendar day)
- Inspect every reservation in the system
- Read basic usage statistics (optional)

---

## Required Functionality

### 1. Identity: Sign-up, Sign-in, Authorization

- **Account creation**
  - Registration based on email and password
  - Email shape checked with Joi
  - Password must be at least 6 characters
  - Reject duplicate usernames or emails
  - Persist the MD5 digest of the password, never the plaintext

- **Authentication**
  - Issue a JWT on successful login
  - Keep the token client-side (localStorage or a cookie)
  - Honour token expiry
  - Provide a sign-out path that discards the token

- **Credentials**
  - Allow a signed-in account to change its password

### 2. Catalogue Management

- **Browsing the catalogue**
  - Render every available film, paginated at 10 per page
  - **Title search (key requirement):** locate films by title as the user types
  - Each film exposes: title, genre, runtime, synopsis
  - Surface page indicators plus Previous / Next controls

- **Staff catalogue tools**
  - Register a new film with its full set of attributes
  - Amend the details of an existing film
  - Remove a film, but only when it has zero reservations attached
  - List all films with the same search + pagination affordances

### 3. Audience Reviews (key requirement — exercises JOINs via Sequelize)

Lets members publish opinions about films they have actually seen.

**Member actions:**
- **Post a review**
  - Only permitted for films the member has reserved/attended
  - Free-text body capped at 500 characters
  - A 1–5 star score (you may make this mandatory or optional)
  - Gate: the member must hold at least one confirmed reservation for that film
  - Each review shows the author's name and the date
- **Revise own review**
  - Editable by the author for up to 24 hours after posting
  - Locked once 24 hours have elapsed
  - Use `moment` to compute the elapsed interval
- **Remove own review**
  - The author may remove it at any point
  - Either a soft delete (`status = 'deleted'`) or a hard delete

**Presenting reviews:**
- Show approved reviews on the film's detail view
- Paginate at 10 reviews per page
- Offer ordering by newest, oldest, highest score, or lowest score
- Print the total review count
- Print the film's mean score, derived from all of its reviews
- Each entry shows: author, star score, body text, posting date

**Staff actions:**
- **Review moderation**
  - Approve or decline pending reviews (when moderation is switched on)
  - Strike out unsuitable reviews
  - List all reviews alongside their film (via JOINs)
  - Narrow the list by status (pending / approved / rejected)

**Data rules:**
- One review per member per film — no duplicates (enforce this in your application/Sequelize logic, e.g. check before insert)
- The reviews table needs: id, user_id, film_id, rating, comment_text, status, created_at, updated_at

**Queries you must write (via Sequelize associations / `include`):**
- Reviews joined with their author (JOIN on users)
- Reviews joined with their film (JOIN on films)
- Confirm a member has seen a film (JOIN across bookings and showtimes)

### 4. Screening Schedule

- **Schedule display**
  - Present the dates and times available for each film
  - At most 3 screenings per film per day
  - Indicate whether seats remain

- **Staff scheduling tools**
  - Add screenings on chosen dates
  - Assign one flat ticket price per screening

---

### 5. Choosing Seats & Reserving

- **Interactive seat grid**
  - A visual row/column seating layout
  - Status conveyed by colour:
    - Open (green)
    - Picked (yellow)
    - Taken (red)
  - Allow several seats to be picked at once
  - Every seat costs the same

- **Reservation flow**
  - Check seat availability live
  - Block any attempt to double-book a seat
  - Total the price from the chosen seats
  - Land on a confirmation view
  - Mint a unique reservation reference with `uuid`

- **Reservation limits**
  - No more than 6 seats in a single reservation

### 6. Reservation History & Handling

- **Member reservation history**
  - Example phrasing: "Tom Ford booked seat 4/5 at 15:30 on 22 Aug 2024"
  - Format dates and times cleanly with `moment`
  - Show film title, screening slot, seats, and total cost
  - **Pagination (key requirement):** 10 reservations per page
  - Page controls (Previous / Next, page numbers)
  - Show the total reservation count

- **Reservation operations**
  - Open a reservation's details
  - Cancel a reservation (optional)

---

### 7. Insights & Reporting (key requirement — exercises JOINs)

This is where you demonstrate complex data access with JOINs through Sequelize associations and `include`.

**Member panel:**
- **My numbers** (for signed-in members)
  - Lifetime spend on reservations
  - Lifetime count of reservations
  - Preferred genre (the genre reserved most often)
  - Most-watched film

**Staff panel — Film insights:**
- **Top films report** (JOIN)
  - Films with their total reservation count
  - Revenue earned per film
  - Mean seats reserved per screening
  - Ordered by popularity (most reserved first)

**Staff panel — Revenue insights:**
- **Revenue by day / week**
  - Revenue totalled per date
  - Reservation count per date
  - A chart or table that shows the trend
  - Filterable by date range

**Staff panel — Member insights:**
- **Top members report** (JOIN)
  - Members with the most reservations
  - Total spend per member
  - Columns: username, reservation count, total spend
  - Only members with 5+ reservations qualify

**Screening performance:**
- **Screening statistics** (several JOINs)
  - Each screening labelled with its film title
  - Seats reserved versus seats available
  - Fill rate (reserved / available × 100)
  - Revenue per screening
  - Ordered by fill rate

---

## Optional Extras

Pick 1–2 of these if time allows:

### A. Film Posters (via image links)
- Store a poster image URL on the film record — no file uploads
- Show posters in the catalogue listing by loading them from their URL
- Fall back to a placeholder when no poster URL is set

### B. Richer Filtering
- Filter films by genre (dropdown)
- Filter by runtime band (short / medium / long)
- Stack filters together with search
- Order by title (A–Z, Z–A) or by date added

### C. Account Profile
- A profile page
- View and edit personal details
- Update email and phone
- Change password with confirmation
- Show account stats (reservation count, total spend)

### D. Confirmation Upgrade
- Detailed view after a successful reservation
- Encode the reservation reference (UUID) as a QR code
- Format date/time with `moment`
- A print-ready ticket
- An option to share reservation details

---

## Database Design

### Tables

1. **users**
   - id — PK, AUTO_INCREMENT
   - username — VARCHAR, UNIQUE
   - email — VARCHAR, UNIQUE
   - password — VARCHAR (MD5 digest)
   - full_name — VARCHAR
   - role — ENUM('user', 'admin')
   - created_at — DATETIME

   Note: JWTs live on the client, not in this table.

2. **films**
   - id — PK, AUTO_INCREMENT
   - title — VARCHAR
   - description — TEXT
   - genre — VARCHAR (e.g. Action, Comedy, Drama, Horror, Sci-Fi)
   - duration — INT (minutes)
   - created_at — DATETIME

3. **showtimes**
   - id — PK, AUTO_INCREMENT
   - film_id — FK → films.id
   - show_date — DATE
   - show_time — TIME
   - price — DECIMAL
   - total_seats — INT (e.g. 50)
   - available_seats — INT
   - created_at — DATETIME

4. **bookings**
   - id — PK, AUTO_INCREMENT
   - user_id — FK → users.id
   - showtime_id — FK → showtimes.id
   - seats — VARCHAR (e.g. "A1,A2,A3")
   - total_price — DECIMAL
   - booking_reference — VARCHAR, UNIQUE (from uuid)
   - booking_date — DATETIME
   - status — ENUM('confirmed', 'cancelled')

5. **comments**
   - id — PK, AUTO_INCREMENT
   - user_id — FK → users.id
   - film_id — FK → films.id
   - rating — INT, 1–5 (NULL allowed or NOT NULL, your choice)
   - comment_text — TEXT (≤ 500 chars)
   - status — ENUM('pending', 'approved', 'rejected', 'deleted')
   - created_at — DATETIME
   - updated_at — DATETIME

### Relationships (the basis for your JOINs)

- One film → many screenings
- One screening → many reservations
- One member → many reservations
- One member → many reviews
- One film → many reviews
- Many reservations → one screening → one film (resolved by JOIN)
- Many reviews → one member (JOIN users for the author name)
- Many reviews → one film (JOIN films for the film details)

---

## Search & Pagination (key requirement)

### Why they matter
1. **Search** lets members reach a film fast, without scrolling the whole catalogue.
2. **Pagination** keeps pages responsive when there are many films or reservations.

### Where they are mandatory

**Pagination required on:**
- The catalogue listing (10 per page)
- Member reservation history (10 per page)
- Staff: full film list (10 per page)
- Staff: full reservation list (20 per page) — optional

**Search required on:**
- The catalogue listing (by title)
- Staff film management (search films)

### What your pagination must include
- The current page number
- The total page count
- A Previous control, disabled on page 1
- A Next control, disabled on the last page
- Page-number links (1, 2, 3, 4, 5, …)
- An "X–Y of Z results" indicator

### What your search must include
- A search box at the top of the page
- Search on submit, or live search with a button
- A "No results found" state when nothing matches
- A clear-search control that resets the view
- Search that cooperates with pagination (results are also paginated)

---

## JWT Flow

### How tokens move through the app
1. **Sign-up:** hash the password with MD5, store the member, do not mint a token yet.
2. **Sign-in:** verify email/password; if good, mint a JWT carrying the member's data and return it (body or cookie).
3. **Guarded routes:** the client attaches the token on each request (header or cookie); middleware validates it; valid → proceed, invalid → bounce to sign-in.

### Sample payload
```javascript
{
  id: 1,
  email: "user@example.com",
  role: "user"
}
```

### Where to keep the token
- **Option 1:** localStorage (simpler)
- **Option 2:** HTTP-only cookie (safer)

---

## Engineering Requirements

### Validation & errors
- **Validation**
  - Validate every form input with Joi
  - Check email shape, password length, and required fields
  - Return readable error messages
- **Error handling**
  - A custom 404 page
  - Graceful handling of database failures
  - Clear, helpful messages for the user

### Security
- Use Sequelize (parameterized by default) for all database access to shut out SQL injection
- Store only the MD5 digest of passwords
- Authenticate with `jsonwebtoken`
- Guard routes with JWT middleware that validates the token
- Validate all input with Joi
- Keep secrets (the JWT secret) in `.env`
- Set a token lifetime (e.g. 24 hours)

### Code quality
- Follow the MVC pattern (models, views, controllers)
- Split code across dedicated folders
- Name things meaningfully
- Comment the tricky parts
- Track the project with Git

---

## Suggested Layout

```
cinema-reservation-platform/
├── config/
│   ├── database.js          # Sequelize connection (mysql2 dialect)
│   └── config.js            # other settings
├── controllers/
│   ├── authController.js    # sign-in, sign-up, JWT minting
│   ├── filmController.js    # film CRUD
│   ├── commentController.js # review operations
│   ├── bookingController.js # reservation logic
│   └── adminController.js   # staff operations
├── models/
│   ├── User.js
│   ├── Film.js
│   ├── Comment.js
│   ├── Showtime.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── films.js
│   ├── comments.js
│   ├── bookings.js
│   └── admin.js
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── validation.js        # Joi validation
│   └── errorHandler.js      # error handling
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── utils/
│   ├── helpers.js
│   └── jwt.js               # token mint/verify
├── .env
├── .gitignore
├── package.json
└── app.js
```

---

## What to Hand In

1. **Code**
   - The complete Node.js application
   - A tidy folder structure
   - Comments where they help

2. **Database**
   - A MySQL database with every table
   - Seed data (at least 3 films, a few members, some reservations)

3. **Docs**
   - A README.md covering:
     - Install and run steps
     - Database setup
     - Test credentials for a member and a staff account

---

## Grading

- **Functionality (25%):** every core feature works
- **Data access — JOINs via Sequelize (25%):** insights and reviews built on solid association/`include` queries
- **Search & Pagination (10%):** correctly applied where required
- **Code organization (15%):** clean structure, MVC
- **Database design (15%):** sound tables and relationships
- **Interface (5%):** easy to use and navigate
- **Validation & security (5%):** input validation and password hashing

---

## Setup Walkthrough

1. Install Node.js and MySQL.
2. Make a fresh project folder.
3. `npm init -y` to generate package.json.
4. Install dependencies:
   ```bash
   npm install express sequelize mysql2 joi jsonwebtoken crypto-js md5 moment uuid dotenv morgan http-errors debug lodash
   ```
5. Add nodemon for development:
   ```bash
   npm install --save-dev nodemon
   ```
6. Wire up package.json scripts:
   ```json
   "scripts": {
     "start": "node app.js",
     "dev": "nodemon app.js"
   }
   ```
7. Create `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=cinema_reservation
   JWT_SECRET=your_secret_key_here
   PORT=3000
   ```
8. Create the MySQL database and its tables.
9. Lay out the folders (see the layout above).
10. Start with sign-up / sign-in and JWT.
11. Add features one at a time.
12. Test each feature before the next.
13. Run it: `npm run dev`.

---

## References

- Express.js: https://expressjs.com/
- Joi: https://joi.dev/
- mysql2: https://www.npmjs.com/package/mysql2
- jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
- md5: https://www.npmjs.com/package/md5
- Moment.js: https://momentjs.com/
- uuid: https://www.npmjs.com/package/uuid
- crypto-js: https://www.npmjs.com/package/crypto-js
- Sequelize: https://sequelize.org/

---

**Best of luck building it!** 🎬🍿
