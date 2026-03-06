# PROJECT BLUEPRINT: GYM NEXT GEN

**Version:** 1.0.0
**Stack:** MERN (MongoDB, Express.js, React.js, Node.js) + Python Microservice (FastAPI/Flask)
**Role:** Act as a Senior Full-Stack MERN Developer, UI/UX Designer, and ML Systems Architect.

## 1. Project Overview

"GYM NEXT GEN" is a state-of-the-art, AI-driven fitness facility management and e-commerce platform. It departs from traditional static brochure websites by integrating a polyglot microservices architecture. The Node.js/Express backend handles standard CRUD operations and authentication, while a separate Python microservice handles Machine Learning (Random Forest & KNN) for hyper-personalized user fitness and dietary recommendations.

## 2. UI/UX Design System

The application must feel premium, energetic, and technologically advanced.

- **Theme:** Modern Dark Mode (Cyberpunk/Fitness aesthetic).
- **Primary Colors:** \* Background: Deep Onyx (`#0F1115`)
  - Surface/Cards: Dark Slate (`#1A1D24`)
  - Primary Accent: Neon Cyan (`#00F2FE`) - _used for primary buttons and active states._
  - Secondary Accent: Toxic Green (`#4FACFE`) - _used for success states and ML outputs._
- **Typography:** 'Inter' for UI elements, 'Oswald' or 'Bebas Neue' for bold, impactful Headers.
- **Animations:** Use `framer-motion` for React. Pages should fade in smoothly. Use micro-interactions on hover (e.g., cards lifting slightly, buttons glowing).
- **Images:** Use high-quality placeholders from Unsplash (keywords: crossfit, futuristic gym, healthy meals, professional trainer).

## 3. Database Schema Overview (MongoDB)

Implement Mongoose models for the following:

1.  **Users:** `_id`, `name`, `email`, `password` (bcrypt hashed), `role` (Enum: 'Admin', 'Coach', 'Customer'), `profileImage`.
2.  **CoachProfiles (Linked to User):** `specialization` (e.g., Strength, Yoga), `bio`, `availableSessions` (Array of Enums: 'Morning', 'Evening', 'Night').
3.  **Products (Gym Store):** `_id`, `name`, `category` (Equipment, Supplement, Apparel), `price`, `stock`, `imageUrl`, `description`.
4.  **Bookings:** `_id`, `customerId`, `coachId`, `sessionPeriod`, `date`, `status` (Pending, Confirmed, Completed).

## 4. User Roles & Workflows

### A. Admin Module

- **Authentication:** Hardcoded seeder for initial login (`Username: Admin`, `Password: Admin123`).
- **Dashboard:** High-level analytics (Total revenue, active members, top-selling store items).
- **CRUD Coaches:** Add, edit, remove coach profiles. Assign their system roles and view their assigned session periods.
- **CRUD Customers:** View all registered members, manage their membership status (Active/Suspended).
- **CRUD Gym Store:** Inventory management. Add new supplements or equipment, update stock levels, and set prices.

### B. Coach Module

- **Authentication:** Secure login via JWT.
- **Profile Management:** View and update their public bio, profile picture, and toggle their `availableSessions` (Morning/Evening/Night).
- **Booking Management:** A dashboard showing pending session requests from customers. Ability to 'Confirm' or 'Decline' bookings.
- **Store Access:** Can browse the Gym Store and purchase items (with an optional coach discount logic).

### C. Customer Module

- **Authentication:** Registration and Login via JWT.
- **Profile View:** Track their current membership status, past store orders, and upcoming confirmed coach sessions.
- **Gym Store (E-commerce):** Browse products, filter by category (Supplements, Equipment), add to cart, and proceed to a simulated checkout.
- **Book a Coach:** Browse the coach directory (filtered by specialization) and request a booking for a specific session period.

## 5. The "NextGen AI Oracle" (Core Feature)

This is the flagship feature of the application for Customers.

- **UI/Layout:** A highly interactive, futuristic multi-step form.
- **Inputs Collected:** Age, Gender, Weight (kg), Height (cm), Fat Percentage.
- **Action:** When the user clicks "Generate My Blueprint", the frontend sends a payload to the Node.js backend, which proxies the request to the Python ML Microservice.
- **Outputs Displayed (The Results Dashboard):**
  1.  **Predicted Workout Type:** (e.g., "Strength & Hypertrophy"). Displayed with a bold icon and description.
  2.  **Nutritional Meal Plan:** A list of 3 highly targeted meals mapped to the user's calculated caloric needs (Output from the KNN model).
  3.  **Recommended Coaches:** The system automatically filters the MongoDB `CoachProfiles` database to show only coaches whose `specialization` matches the predicted workout type. Includes a "Book Now" button next to their names.

## 6. Architecture & Integration Rules

- **Frontend:** React.js (Vite) with TailwindCSS for styling.
- **Backend API:** Node.js + Express.
- **State Management:** Redux Toolkit or React Context API (especially for the Store Cart and User Session).
- **Routing:** React Router DOM. Protect Admin and Coach routes using Higher Order Components (HOC) or layout wrappers checking the JWT role.
- **ML Integration:** The Node.js backend must contain a specific route (e.g., `POST /api/ml/predict`) that utilizes `axios` to send the user's physical data to the external Python Flask API running on a separate port (e.g., `http://localhost:5000/predict`).

## 7. Execution Steps for AI Assistant

1.  Initialize the Node.js backend and configure MongoDB connection.
2.  Create the Mongoose schemas and implement JWT authentication.
3.  Seed the initial Admin account.
4.  Build out the CRUD API endpoints for Users, Coaches, and Store Products.
5.  Initialize the React frontend with Vite and configure TailwindCSS with the specified dark mode theme.
6.  Build the Auth pages (Login/Register).
7.  Develop the separate Dashboards based on User Role routing.
8.  Implement the Gym Store (Product listing, Cart state).
9.  Develop the Coach Booking workflow.
10. Build the "NextGen AI Oracle" page and mock the Python API response until the Python microservice is linked.

## 8. MongoDB Connection String

mongodb+srv://admin_next_gen:Admin123@cluster0.dqd3ser.mongodb.net/?appName=Cluster0

## 9. Cloudinary API Keys

Cloudinary Cloud Name: daydcski4
Cloudinary API Key: 314131769533185
Cloudinary API Secret: YR_pWaXXQuT9bU_FcA7y4Cbi-yY
