# CampusConnect Admin Dashboard

CampusConnect is a comprehensive Facility Management System and Administrative Dashboard designed to streamline campus operations. This frontend application provides administrative control over users, clubs, study rooms, and sports facilities, alongside detailed analytics and reporting.

## 🚀 Features

- **Role-Based Access Control**: Separate, tailored views for different administrative roles (e.g., Events Admins, Sports Admins).
- **Facility Management**: Full CRUD operations for managing study rooms and sports facilities.
- **User & Club Management**: Centralized dashboards to monitor and manage student users and campus clubs.
- **Analytics Dashboard**: Interactive data visualization widgets (Stats Cards, Attendance Bar Charts, Usage Donut Charts) built with Recharts.
- **Reports & Activity Logs**: Centralized reports viewer and real-time monitoring of admin activity logs.

## 🛠 Tech Stack

This project is built using modern web development standards and follows a structured architectural methodology.

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI Primitives)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for powerful data caching and state synchronization.
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node versions.

### Installation

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   cd CampusConnect-frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:8080` (or the port specified by Vite in your terminal).

### Build for Production

To create an optimized production build, run:
```sh
npm run build
```

## 🏗 Architecture & Best Practices

- **Component Design**: UI components are highly modular and built using `shadcn/ui` and standard Tailwind CSS utilities to maintain the EJUST branding and design specifications.
- **API Integration**: All backend communication is structured through RTK Query API slices, utilizing robust cache invalidation tags to ensure data freshness across the dashboard.
- **Form Handling**: Complex creation and edit forms utilize `react-hook-form` coupled with `zod` schema validation for a seamless and secure administrative experience.

## 🤝 Contributing

When contributing to this repository, please ensure that your changes adhere to the existing folder structure and that new UI elements align with the established design system. Ensure that any new API endpoints are correctly documented and integrated into the RTK Query store.
