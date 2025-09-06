# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup
- **Authentication**: Google OAuth and email/password login with Supabase Auth
- **User-Scoped Data**: Each user sees only their own job applications
- **Kanban Board**: Drag-and-drop interface for managing job application stages
- **Table View**: Sortable and filterable table view of applications
- **Real-time Updates**: Powered by Supabase for instant data synchronization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Supabase account

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. **Database Setup**: Run the SQL schema in your Supabase SQL editor:
```sql
-- For new installations, run supabase_schema.sql
-- For existing installations, run migration_script.sql first
```

3. **Authentication Setup**:
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable Google OAuth provider
   - Add your domain to the allowed redirect URLs
   - Configure email templates as needed

4. **Google OAuth Setup**:
   - Create a Google Cloud Console project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add the credentials to your Supabase Auth settings

## 🛠️ Running the Application

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (AuthContext)
│   ├── lib/           # Services and utilities
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new

## Authentication Flow

1. **Login/Signup**: Users can sign in with Google or email/password
2. **Route Protection**: All application routes require authentication
3. **User Scoping**: Jobs and data are automatically scoped to the logged-in user
4. **Logout**: Users can sign out from the header menu

## Database Migration

If you have existing data, use the migration script:

1. Run `migration_script.sql` in your Supabase SQL editor
2. Update existing jobs to assign them to users:
```sql
UPDATE jobs SET user_id = 'your_user_id_here' WHERE user_id IS NULL;
ALTER TABLE jobs ALTER COLUMN user_id SET NOT NULL;
```

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
