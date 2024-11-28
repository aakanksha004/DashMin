# Dashmin Project

**Dashmin** is a Role-Based Access Control (RBAC) responsive dashboard application designed for user, role, and permission management. The project has been built using React for the frontend and Express for the backend, and it is fully deployed on [Render](https://render.com/).

---

## **Live Links**
- **Frontend**: [Dashmin Frontend](https://dashmin-frontend.onrender.com/)
- **Backend**: [Dashmin Backend API](https://dashmin.onrender.com/users)

---

## **Features**
### **Frontend**
- **User Management**:
  - Add,delete & update user details
  - Sort users alphabetically.
  - Filter users by roles.
  - Filter users by their status (active/inactive).
  - Refresh the user list with a single click.
  - Search functionality for quick access to specific users.
- **Dynamic Dashboard**:
  - Interactive charts powered by **Chart.js** and **Recharts**.
  - Overview of key statistics.
- **Navigation**:
  - Dynamic Sidebar with active link highlighting.
  - Toggle functionality to expand or collapse the sidebar.
- **Pages**:
  - User management, role management, and permission assignment.
  - Calendar integration using `react-big-calendar`.
- **Responsive Design**: Adapts to various screen sizes.

### **Backend**
- **Express API** for handling CRUD operations.
- **JSON Server** for mock data with endpoints for users, roles, and permissions.
- RESTful endpoints:
  - `/users`: Manage user data.
  - `/roles`: Manage roles.
  - `/permissions`: Manage permissions.
- **CORS** support for seamless frontend-backend communication.

---

## **Technologies Used**
### **Frontend**
- **React**: UI development
- **React Router DOM**: Routing
- **MUI**: Component library
- **Chart.js** & **Recharts**: Data visualization
- **Tailwind CSS**: Styling
- **React Big Calendar**: Calendar integration


### **Backend**
- **Express.js**: Server framework
- **CORS**: Cross-origin resource sharing

### **Deployment**
- Hosted on **Render**:
  - **Frontend**: [Render](https://render.com/) deployment
  - **Backend**: Render platform

---

## **Installation Instructions**
### **Frontend**
1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

### **Backend**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

---

## **Available Scripts**
### **Frontend**
| Script        | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Starts the development server.           |
| `npm run build` | Builds the app for production.         |
| `npm run test` | Runs the JSON server for mock data.     |
| `npm run eject` | Ejects configuration (use cautiously). |

### **Backend**
| Script        | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Starts the Express server.               |
| `npm run build` | Installs backend dependencies.         |

---

## **Folder Structure**
### **Frontend**
```
/frontend
  ├── /src
  │   ├── /components  # Reusable UI components (Sidebar, Navbar, etc.)
  │   ├── /context     # React Context API for global state
  │   ├── /pages       # Application pages (Dashboard, Users, Roles, etc.)
  │   ├── /styles      # SASS and CSS files
  │   ├── App.js       # Main application component
  │   └── index.js     # Entry point
  └── package.json     # Dependencies and scripts
```

### **Backend**
```
/backend
  ├── index.js          # Main server file
  ├── db.json           # Mock data file
  └── package.json      # Dependencies and scripts
```

---

## **Usage**
1. Navigate to the **frontend** link: [Dashmin Frontend](https://dashmin-frontend.onrender.com/).
2. Use the **Sidebar** to access various pages like:
   - **Dashboard**: Overview of key statistics.
   - **Users**: Manage user profiles with sort, filter, search, and refresh functionality.
   - **Roles**: Define and assign roles.
   - **Permissions**: Configure access levels.
   - **Calendar**: View events and schedules.

---

## **API Endpoints**
### **Base URL**: [https://dashmin.onrender.com](https://dashmin.onrender.com)

| Endpoint       | Description           |
|----------------|-----------------------|
| `/users`       | Fetch or manage users |
| `/roles`       | Fetch or manage roles |
| `/permissions` | Fetch or manage permissions |

---
