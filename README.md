# Full Stack Real Estate Marketplace

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application for buying, selling, and renting properties. Features real-time messaging, interactive maps, and a responsive user interface.

## 📋 Project Overview

This is a comprehensive real estate marketplace platform that allows users to:
- **Browse properties** - Search and filter residential properties (apartments, houses, condos, land)
- **List properties** - Create and manage property listings for sale or rent
- **View on maps** - Interactive map visualization using Leaflet to explore properties by location
- **Save favorites** - Bookmark properties for later viewing
- **Real-time chat** - Communicate with other users about properties through Socket.io
- **User profiles** - Create accounts, manage listings, and update profile information
- **Property details** - View comprehensive information including utilities, pet policies, nearby amenities

## 🏗️ Architecture

The project consists of three main services:

### 1. **API Server** (`/api`)
- **Framework:** Express.js
- **Database:** MongoDB with Prisma ORM
- **Authentication:** JWT with bcrypt password hashing
- **Port:** 8800

### 2. **Client Application** (`/client`)
- **Framework:** React 18 with Vite
- **Styling:** SASS/SCSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **Real-time:** Socket.io-client
- **Port:** 5173 (Vite dev server)

**Key Features:**
- Responsive design with mobile-first approach
- Components: Navbar, Card, Chat, Filter, List, Map, SearchBar, Slider, UploadWidget
- Pages: HomePage, ListPage, SinglePage, ProfilePage, LoginPage, RegisterPage, NewPostPage, ProfileUpdatePage
- Rich text editor (React Quill) for property descriptions
- Image upload widget
- Time-relative display using timeago.js

### 3. **Socket Server** (`/socket`)
- **Framework:** Socket.io
- **Purpose:** Real-time messaging and online user tracking
- **Key Functions:**
  - Track online users
  - Handle new connections and disconnections
  - Relay messages between users

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd full-stack-estate
```

2. **Setup API Server**
```bash
cd api
npm install
# Create .env file with:
# DATABASE_URL=your_mongodb_connection_string
# CLIENT_URL=http://localhost:5173
npm run dev
```

3. **Setup Client Application**
```bash
cd ../client
npm install
npm run dev
```

4. **Setup Socket Server (in another terminal)**
```bash
cd ../socket
npm install
npm run dev
```

## 🔧 Tech Stack

### Backend
- **Express.js** - Web framework
- **Prisma** - ORM for MongoDB
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Leaflet + React-Leaflet** - Interactive maps
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client
- **SASS** - Styling preprocessor
- **React Quill** - Rich text editor
- **DOMPurify** - HTML sanitization
- **timeago.js** - Relative timestamps

### Real-time
- **Socket.io** - WebSocket-based real-time communication

## 🔐 Security Features

- **Password Hashing** - Bcrypt for secure password storage
- **JWT Authentication** - Token-based authentication
- **CORS** - Configured for specific origins
- **HTML Sanitization** - DOMPurify to prevent XSS attacks
- **Environment Variables** - Sensitive data via .env

### Client (.env.local)
```
VITE_API_URL=http://localhost:8800/api
```

---

**Note:** This application requires all three services (API, Client, and Socket server) running simultaneously for full functionality.
