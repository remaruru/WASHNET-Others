# WASHNET Laundry Management System

A comprehensive full-stack laundry management system with customer-facing features, employee order management, and admin analytics dashboard.

## 🚀 Features Overview

### 👥 Customer Features (Public Access)

#### 1. **Order Status Search**
- Search for orders by customer name
- View order details including:
  - Order status (Pending, Processing, Ready, Completed, Cancelled)
  - Service types (Wash & Dry, Wash Only, Dry Only, Mixed Services)
  - Items and quantities
  - Total amount
  - Pickup/Delivery dates
  - Delivery method (Pickup or Delivery)
  - Order notes
  - Order creation date

#### 2. **Weather Forecast Integration**
- Real-time weather data for Manila, Philippines using OpenWeatherMap API
- **Current Weather Display:**
  - Temperature (current, feels like, min/max)
  - Weather conditions with icons
  - Humidity percentage
  - Wind speed and direction
  - Atmospheric pressure
  - Visibility
  - Sunrise and sunset times
  
- **5-Day Forecast:**
  - Daily weather predictions
  - Temperature ranges
  - Weather conditions
  - Humidity levels
  
- **Hourly Forecast:**
  - Next 12 hours weather prediction
  - Detailed hourly breakdown
  
- **Best Day for Laundry Recommendation:**
  - Intelligent algorithm suggests the best day for laundry based on:
    - Low humidity (better for drying)
    - Optimal temperature
    - Clear weather conditions

#### 3. **User-Friendly Interface**
- Responsive design
- Clean, modern UI
- Easy navigation
- Demo weather data fallback if API is unavailable

### 👔 Employee Features (Employee Login Required)

#### 1. **Order Management**
- **Create New Orders:**
  - Customer information (name, phone, email)
  - Multiple laundry items with individual service types
  - Service types per item:
    - Wash & Dry (₱100)
    - Wash Only (₱60)
    - Dry Only (₱50)
  - Delivery method selection:
    - Pickup (with pickup date)
    - Delivery (with delivery date)
  - Optional notes
  - Automatic total calculation
  
- **View Orders:**
  - See all orders created by the employee
  - Order status indicators with color coding:
    - 🟡 Pending (Yellow)
    - 🔵 Processing (Blue)
    - 🟢 Ready (Green)
    - 🟢 Completed (Green)
    - 🔴 Cancelled (Red)
  - View order details in modal
  - Order creation timestamp
  - Customer contact information

#### 2. **Order Filtering & Search**
- Filter orders by status
- Search functionality
- Real-time updates

### 👑 Admin Features (Admin Login Required)

#### 1. **Comprehensive Order Management**
- **View All Orders:**
  - See all orders from all employees
  - Advanced filtering:
    - Filter by creation date
    - Filter by specific date range
    - Filter by customer name (search)
    - Filter by status
  
- **Order Status Management:**
  - Update order status (Pending → Processing → Ready → Completed)
  - Cancel orders
  - Edit order details:
    - Customer information
    - Items and quantities
    - Service types
    - Delivery method and dates
    - Notes
    - Total amount

#### 2. **Statistics Dashboard**
- **Real-time Statistics:**
  - Total orders count
  - Pending orders count
  - Processing orders count
  - Ready orders count
  - Completed orders count
  - Total revenue (from completed orders)
  
- **Visual Indicators:**
  - Color-coded status cards
  - Revenue display
  - Quick overview metrics

#### 3. **Advanced Analytics**
- **Service Type Distribution:**
  - Pie chart showing distribution of:
    - Wash & Dry
    - Wash Only
    - Dry Only
    - Mixed Services
  - Percentage breakdown
  
- **Day of Week Analysis:**
  - Bar chart showing order volume by day
  - Identifies busiest days
  - Helps with scheduling
  
- **Revenue by Month:**
  - Line/Bar chart showing revenue trends
  - Last 6 months revenue data
  - Monthly revenue breakdown
  
- **Customer Frequency Analysis:**
  - Top 10 customers by order count
  - Total spending per customer
  - Customer loyalty metrics
  
- **Peak Hours Analysis:**
  - Hourly order distribution
  - Identifies busiest hours
  - Helps with resource planning
  
- **Status Distribution:**
  - Distribution of orders by status
  - Visual representation of workflow

#### 4. **Employee Management**
- **Employee Overview:**
  - List of all employees
  - Employee order counts
  - Employee performance metrics
  - Total orders per employee

#### 5. **Advanced Filtering & Search**
- Filter orders by date
- Filter orders by date range
- Search by customer name
- Filter by status
- Refresh functionality to clear filters

### 🔐 Authentication & Security

#### 1. **User Roles**
- **Admin:** Full access to all features
- **Employee:** Can create and view their own orders
- **Customer:** Public access to order search and weather

#### 2. **Authentication System**
- Secure login with email and password
- Token-based authentication (Laravel Sanctum)
- Protected routes based on user roles
- Automatic logout on token expiration

#### 3. **Registration**
- Employee registration with special access code
- Password hashing
- Role assignment (employees only)

## 💰 Pricing Structure

- **Wash & Dry:** ₱100 per item
- **Wash Only:** ₱60 per item
- **Dry Only:** ₱50 per item
- **Mixed Services:** Calculated based on individual items

## 📊 Order Status Workflow

1. **Pending** - Order created, awaiting processing
2. **Processing** - Order is being washed/dried
3. **Ready** - Order is ready for pickup/delivery
4. **Completed** - Order has been picked up/delivered
5. **Cancelled** - Order has been cancelled

## 🔧 Technical Stack

### Backend
- **Framework:** Laravel (PHP)
- **Database:** MySQL (PostgreSQL compatible)
- **Authentication:** Laravel Sanctum
- **API:** RESTful API
- **Server:** Render (Production)

### Frontend
- **Framework:** React.js
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3
- **Deployment:** Vercel (Production)

### External Services
- **Weather API:** OpenWeatherMap
- **Database:** PostgreSQL (Production on Render)

## 📁 Project Structure

```
laundrysBACKUPstlga/
├── laundry-backend/          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── Api/
│   │   │       ├── AnalyticsController.php
│   │   │       ├── AuthController.php
│   │   │       └── OrderController.php
│   │   └── Models/
│   │       ├── Order.php
│   │       └── User.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── Dockerfile
├── laundry-frontend/         # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Analytics.js
│   │   │   ├── CustomerHome.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   └── config/
│   │       └── api.js
│   └── vercel.json
├── render.yaml               # Render deployment config
└── SETUP.md                  # Setup instructions
```

## 🚀 Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Default Credentials
- **Admin Email:** admin@laundry.com
- **Admin Password:** admin123

### Environment Variables

#### Backend (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_OPENWEATHER_API_KEY=your_api_key
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/orders/search` - Search orders by customer name
- `POST /api/register` - Register new employee
- `POST /api/login` - Login user

### Protected Endpoints (Requires Authentication)
- `GET /api/me` - Get current user info
- `POST /api/logout` - Logout user
- `GET /api/orders` - Get orders (filtered by role)
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order
- `GET /api/orders/statistics` - Get order statistics (Admin only)
- `GET /api/orders/employee-overview` - Get employee overview (Admin only)
- `GET /api/analytics` - Get analytics data (Admin only)

## 🎨 Key Features Explained

### Weather Integration
The system integrates with OpenWeatherMap API to provide real-time weather data. This helps customers plan their laundry days based on weather conditions. The system automatically determines the best day for laundry based on humidity, temperature, and weather conditions.

### Order Management
Employees can create orders with multiple items, each with its own service type. The system automatically calculates the total amount based on item quantities and service types. Orders can be tracked through various statuses until completion.

### Analytics Dashboard
The admin dashboard provides comprehensive analytics including:
- Service type distribution
- Revenue trends
- Customer behavior analysis
- Peak hours and days
- Employee performance metrics

### Role-Based Access Control
The system implements strict role-based access control:
- Customers can only search for their orders
- Employees can create and view their own orders
- Admins have full access to all features and data

## 🔄 Deployment

### Production URLs
- **Frontend:** https://laundryfrontter.vercel.app
- **Backend:** https://washnet-backend.onrender.com

### Deployment Platforms
- **Frontend:** Vercel (Automatic deployment from GitHub)
- **Backend:** Render (Docker-based deployment)
- **Database:** PostgreSQL on Render

## 📝 Development Notes

- The system uses PostgreSQL in production but is compatible with MySQL for local development
- All database migrations are PostgreSQL-compatible
- The frontend uses environment variables for API configuration
- Weather API falls back to demo data if the API key is not configured
- All API calls are authenticated using Laravel Sanctum tokens

## 🤝 Contributing

This project was developed by:
- Fritz Arrogante
- Earl Angelo Roldan
- Enzo Benedict Rosales
- Maria Cielo Salazar
- Michael Angelo Torres

## 📄 License

This project is proprietary software.

## 🆘 Support

For issues or questions, please contact the development team.

---

**WASHNET Laundry** - Fresh • Fast • Clean

