# Vapour

A full-stack game store platform inspired by Steam. Features game browsing, cart, wishlist, user reviews, game library, friends system, and a PayPal Sandbox payment simulation. Includes dynamic banner-reactive theme changing and full admin/user role systems.

---

## Features

### User
- Browse and search games
- Add games to cart or wishlist
- Favorite games, viewable in your collection
- Edit profile — avatar, bio, and more
- Leave reviews on games you own
- Friends system
- PayPal Sandbox payment simulation *(removed in current build — see note below)*

### Admin
- Manage games, users, and platform content

---

## Screenshots
<h3 align='center'>Home</h3>
<img src='https://i.imgur.com/c9Cvhlt.png' />

<h3 align='center'>View Game</h3>
<img src='https://i.imgur.com/UxfAkah.png' />

<h3 align='center'>Upload Game</h3>
<img src='https://i.imgur.com/ncZ1aQ6.png' />

<h3 align='center'>Update Game</h3>
<img src='https://i.imgur.com/QmBx37B.png' />


<h3 align='center'>Additional</h3>

| Home(Bottom) | Friends |
|--------------|---------|
| <img src='https://i.imgur.com/MK7reHZ.png' /> | <img src='https://i.imgur.com/vcdCF6x.png' /> |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Payments | PayPal SDK *(removed in current build)* |

---

## Setup

### Prerequisites
- Node.js
- A [Railway](https://railway.com) account for MongoDB

### Steps

1. **Install dependencies**
   ```bash
   cd client && npm i
   cd ../server && npm i
   ```

2. **Create `.env` files**

   `client/.env`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT
   ```

   `server/.env`:
   ```
   PORT=YOUR_PORT        # Must match the port in NEXT_PUBLIC_API_URL
   SECRET_KEY=your_secret_key_here
   MONGODB_URI=your_mongodb_connection_url_here
   ```

3. **Get your MongoDB connection URL**
   - Go to [railway.com](https://railway.com)
   - Create a new project → Database → MongoDB
   - Click **Connect** and copy the Connection URL
   - Paste it as the value of `MONGODB_URI` in `server/.env`

4. **Run the app**
   ```bash
   # In one terminal
   cd server && npm start

   # In another terminal
   cd client && npm run dev
   ```

---

## Notes

- PayPal payment has been removed to simplify setup. As a result, the collection screen will only display favorited games — owned games will not populate automatically.
- To test the review system, manually add games to a user's owned list directly through the database.
- To access elevated roles, manually update the user's role in the database: 0 = User, 1 = Dev (can upload games), 2 = Admin.
