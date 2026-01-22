# MuspyHos - Premium Escort Services Platform

A modern on-demand platform built with Next.js 14, Supabase, and TailwindCSS. This platform connects clients with verified service providers for seamless booking and management.

## Features

### For Clients
- Browse and search verified service providers
- View detailed provider profiles with ratings and reviews
- Book appointments with available providers
- Manage bookings and view booking history
- Real-time booking status updates
- Secure payment processing

### For Providers
- Create and manage professional profiles
- Set availability and hourly rates
- Upload verification documents
- Manage incoming bookings
- Track earnings and booking statistics
- Build reputation through client reviews

## Tech Stack

- Frontend: Next.js 14 (App Router), React 18
- Styling: TailwindCSS with custom gradient themes
- Backend: Supabase (PostgreSQL database, Auth, Storage)
- Icons: Lucide React
- Notifications: React Hot Toast
- State Management: React Context API

## Getting Started

### Prerequisites

- Node.js 18 or higher installed
- npm, yarn, pnpm, or bun package manager
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a .env.local file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the application.

## Database Schema

### Main Tables

- users: User accounts with roles (client, provider)
- provider_profiles: Extended profiles for service providers
- bookings: Appointment bookings between clients and providers
- reviews: Client reviews and ratings for providers

### Security

- Row Level Security (RLS) policies on all tables
- Secure authentication with Supabase Auth
- Role-based access control
- Encrypted sensitive data

## Project Structure
```
app/
├── dashboard/          # Client/Provider dashboards
├── login/              # Authentication pages
├── register/           # Registration pages
└── components/         # Shared components

context/
└── AuthContext.jsx     # Authentication context

lib/
└── supabase.js         # Supabase client configuration
```

## Key Features

- Real-time booking updates
- Provider verification system
- Secure payment processing
- Rating and review system
- Advanced search and filtering
- Responsive design for all devices

## Environment Variables

Required environment variables:

- NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key

## Deployment

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy

Check out the Next.js deployment documentation for more details.

## User Roles

- Client: Can browse providers, make bookings, leave reviews
- Provider: Can create profile, manage bookings, receive payments

## Support

For issues or questions, please contact support or create an issue in the repository.