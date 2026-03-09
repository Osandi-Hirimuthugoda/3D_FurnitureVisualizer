# 3D Furniture Visualizer

A full-stack MERN application for visualizing and designing room layouts with 3D furniture.

## Features

- 🏠 Room Setup with multiple shapes (Rectangle, Square, L-Shape, U-Shape)
- 📐 2D Layout Editor with drag-and-drop furniture placement
- 🎨 Appearance customization
- 🛋️ Product browsing and management
- 🛒 Shopping cart functionality
- 📦 Order management (Admin)
- 👤 User authentication (Admin/Customer roles)
- 💼 Portfolio and Settings pages

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Styling**: CSS3 with animations

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Osandi-Hirimuthugoda/3D_FurnitureVisualizer.git
cd 3D_FurnitureVisualizer
```

### Step 2: Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 3: Environment Variables

Create a `.env` file in the `server` folder:

```env
PORT=5001
MONGODB_URI=mongodb+srv://dbuser:DbuserPassword@cluster0.0xwfuyc.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 4: Seed Admin User

Create the default admin account:

```bash
cd server
npm run seed:admin
```

This will create an admin user with:
- Email: `admin@furniture.com`
- Password: `Admin@123`

### Step 5: Run the Application

#### Start Backend Server
```bash
cd server
npm start
```
Server will run on: http://localhost:5001

#### Start Frontend (in a new terminal)
```bash
cd client
npm start
```
Frontend will run on: http://localhost:3000

## Usage

### Login Credentials

#### Admin Login:
- Email: `admin@furniture.com`
- Password: `Admin@123`

#### Customer Signup/Login:
- Customers can create a new account using the signup form
- After signup, they can login with their credentials

### Features by Role

#### Customer Features:
- Browse products
- Add items to cart
- Create room designs
- View portfolio
- Manage settings

#### Admin Features:
- All customer features
- Manage products (Add/Edit/Delete)
- Manage orders
- View all customer orders

## Project Structure

```
3D_FurnitureVisualizer/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── App.js
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── server.js
├── .gitignore
└── README.md
```

## Available Scripts

### Frontend (client/)
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

### Backend (server/)
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run seed:admin` - Create admin user in database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Osandi Hirimuthugoda - [GitHub](https://github.com/Osandi-Hirimuthugoda)

Project Link: [https://github.com/Osandi-Hirimuthugoda/3D_FurnitureVisualizer](https://github.com/Osandi-Hirimuthugoda/3D_FurnitureVisualizer)
