# Hike Planner

A full-stack web application for planning and discovering hiking trails around the world.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, SWR
- **Backend**: Next.js Route Handlers
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies

## Features

- 🔐 User Authentication (Register, Login, Logout)
- 🌍 Country & Region filters
- 📱 Responsive mobile-first design
- 🔄 Infinite scroll with loading skeletons
- ❤️ Save your favorite hikes
- 📊 Hike details page with gallery
- 🔔 Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone and install dependencies:

```bash
npm install
```

2. **Set up environment variables**:

Create a `.env.local` file in the root directory with the following:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hike-planner?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. **Seed the database with sample hikes**:

```bash
npm run seed
```

4. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   ├── me/
│   │   │   │   └── register/
│   │   │   ├── hikes/
│   │   │   │   └── [id]/
│   │   │   └── saved/
│   │   │       └── [id]/
│   │   ├── hike/[id]/
│   │   ├── login/
│   │   ├── register/
│   │   ├── saved/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── HikeCard.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Navbar.tsx
│   │   └── Toast.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib/
│   │   ├── countries.ts
│   │   └── db.ts
│   ├── models/
│   │   ├── Hike.ts
│   │   └── User.ts
│   └── types/
├── scripts/
│   └── seed.ts
└── package.json
```

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Hikes

- `GET /api/hikes` - Get paginated hikes (with country/region filters)
- `GET /api/hikes/:id` - Get hike details

### Saved Hikes

- `GET /api/saved` - Get user's saved hikes
- `POST /api/saved/:id` - Save a hike
- `DELETE /api/saved/:id` - Unsave a hike

## Lighthouse Score Goals

- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 100

## Deployment

- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Vercel (serverless functions)
- **Database**: MongoDB Atlas

## License

MIT
