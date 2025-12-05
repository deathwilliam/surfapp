# 🏄‍♂️ Surf App - El Salvador

A full-stack surf instructor booking platform connecting students with certified surf instructors across El Salvador's world-class surf beaches.

## 🌊 Features

- **User Authentication** - Secure login/registration with role-based access (Student, Instructor, Admin)
- **Instructor Profiles** - Detailed profiles with certifications, experience, and ratings
- **Beach Locations** - Dynamic beach cards with real images and difficulty ratings
- **Booking System** - Real-time availability and booking management
- **Messaging** - In-app messaging between students and instructors
- **Reviews & Ratings** - Student feedback system for instructors
- **Admin Dashboard** - Location management, user verification, and analytics
- **Email Notifications** - Automated emails for bookings and status updates

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Email:** [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Resend API key (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deathwilliam/surfapp.git
   cd surfapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/surfapp"
   
   # NextAuth
   AUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Resend (Email)
   RESEND_API_KEY="your-resend-api-key"
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User** - Base user model with role (STUDENT, INSTRUCTOR, ADMIN)
- **InstructorProfile** - Extended profile for instructors
- **Location** - Surf beach locations across El Salvador
- **InstructorAvailability** - Instructor schedule and availability
- **Booking** - Booking records with status tracking
- **Review** - Student reviews for instructors
- **Message** - In-app messaging system
- **Payment** - Payment records and transactions

## 🌐 Deployment

The application is deployed on Vercel at: **https://surfapp-two.vercel.app/**

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your Vercel project settings:
- `DATABASE_URL` - Your production PostgreSQL connection string
- `AUTH_SECRET` - Generate a secure random string
- `NEXTAUTH_URL` - Your production URL
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Your verified sender email

## 🏖️ Featured Beaches

The platform features El Salvador's top surf destinations:

- **El Tunco** - Intermediate | Beach Break
- **El Sunzal** - Intermediate | Point Break
- **Punta Roca** - Expert | Point Break
- **La Libertad** - All Levels | Beach Break
- **El Zonte** - Intermediate | Beach Break
- **Las Flores** - Intermediate | Point Break
- **Punta Mango** - Expert | Point Break
- **K59** - Intermediate | Beach Break
- **Mizata** - Expert | Point Break

## 👥 User Roles

### Student
- Browse and search instructors
- Book surf lessons
- Leave reviews and ratings
- Message instructors
- Manage bookings

### Instructor
- Create and manage profile
- Set availability schedule
- Accept/decline bookings
- Message students
- View earnings and statistics

### Admin
- Manage locations (CRUD)
- Verify instructor certifications
- View platform analytics
- Manage users

## 📧 Email Notifications

Automated emails are sent for:
- Welcome emails (new users)
- Booking confirmations
- Booking status updates (confirmed, cancelled, completed)
- Instructor verification

## 🔐 Authentication

The app uses NextAuth.js v5 with credentials provider. Passwords are hashed using bcrypt.

Default test accounts (after seeding):
- **Admin:** admin@surfapp.com / admin123
- **Instructor:** juan.perez@example.com / password123
- **Student:** carlos.martinez@example.com / password123

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI/UX Features

- Ocean-themed gradients (primary → secondary → accent)
- Dynamic beach background images
- Difficulty badges with color coding
- Smooth animations and transitions
- Dark mode support (via next-themes)

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the repository owner.

---

**Built with ❤️ for El Salvador's Surf City** 🇸🇻
