# Scoutland: Sports Scouting Platform

Scoutland is a modern, web-based platform designed to simplify and enhance the sports scouting process. This application enables scouts, coaches, and sports organizations to evaluate, track, and manage player talent effectively.

## Technologies

This project is built with a modern stack optimized for performance and developer experience:

- **Next.js**: React framework for server-side rendering, routing, and building full-stack web applications.
- **TypeScript**: Typed superset of JavaScript that adds static types to ensure robustness and fewer runtime errors.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and styling.
- **Prisma ORM**: Next-generation Node.js and TypeScript ORM for interacting with the database.

## Project Structure

- `src/app/`: Next.js App Router files and pages.
- `src/components/`: Reusable React components.
- `src/hooks/`: Custom React hooks.
- `src/lib/`: Utility functions and shared libraries.
- `prisma/`: Prisma schema and database configuration.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment Notes (GitHub Pages vs. Vercel)

**Note on GitHub Pages:** GitHub Pages is a static file hosting service. Since this application uses Prisma and a Next.js API route for form submissions (requiring a Node.js runtime and a database), it **cannot** be deployed to GitHub Pages without removing the backend features. Attempting to host it on GitHub Pages will result in missing backend logic, build errors, or a blank screen due to routing/asset prefix issues on subpaths.

**Recommended Hosting:** To host this full-stack application (with the SQLite database and API routes), we highly recommend deploying to a platform that supports Next.js full-stack features such as **Vercel** or **Railway**.
