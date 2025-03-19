# Equevu HR Frontend

This is the frontend application for the Equevu HR system, built with React, TypeScript, and Material-UI.

## Features

- Candidate registration form
- Admin dashboard for candidate management
- Resume upload and download functionality
- Department-based filtering
- Responsive design

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

- `VITE_API_URL`: The URL of the backend API (default: http://localhost:8000/api)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── theme.ts       # Material-UI theme configuration
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 