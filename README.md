# Urbanease Delivery

A comprehensive delivery management system built with FastAPI backend and React frontend, featuring full CRUD operations for managing categories, products, customers, orders, and order items.

## Features

- **Product Management**: Create, read, update, and delete products with categories
- **Customer Management**: Manage customer information and order history
- **Order Processing**: Handle order creation, status tracking, and item management
- **Category Organization**: Organize products into categories for better management
- **RESTful API**: Complete REST API with FastAPI for all operations
- **Modern Frontend**: React-based UI for easy interaction with the system

## Tech Stack

### Backend

- **FastAPI**: High-performance web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight database for data storage
- **Alembic**: Database migration tool
- **Pydantic**: Data validation and serialization

### Frontend

- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **CSS**: Styling for the user interface

## Project Structure

```
urbanease_delivery/
├── app-backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # SQLAlchemy database models
│   ├── create_db.py            # Database initialization script
│   ├── seed.py                 # Database seeding script
│   ├── Pipfile                 # Python dependencies
│   ├── Pipfile.lock            # Locked Python dependencies
│   ├── alembic.ini             # Alembic configuration
│   ├── urbanease.db            # SQLite database file
│   ├── migration/              # Database migrations
│   │   ├── env.py
│   │   ├── README
│   │   ├── script.py.mako
│   │   └── versions/           # Migration versions
│   └── __pycache__/            # Python cache files
├── app-frontend/
│   ├── index.html              # Main HTML file
│   ├── package.json            # Node.js dependencies
│   ├── package-lock.json       # Locked Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── public/                 # Static assets
│   │   └── vite.svg
│   └── src/                    # Source code
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Main React component
│       ├── App.css             # Main styles
│       ├── index.css           # Global styles
│       └── assets/             # Static assets
│           └── react.svg
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json (for frontend)
├── package-lock.json           # Root package lock
└── README.md                   # This file
└── FILE_STRUCTURE.md           # Detailed file structure documentation
```

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- pipenv (for Python dependency management)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd app-backend
   ```

2. Install Python dependencies:

   ```bash
   pipenv install
   ```

3. Activate the virtual environment:

   ```bash
   pipenv shell
   ```

4. Create and seed the database:

   ```bash
   python create_db.py
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd app-frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Documentation

Once the backend is running, visit `http://127.0.0.1:8000/docs` for interactive API documentation powered by Swagger UI.

### Main Endpoints

#### Categories

- `GET /categories/` - List all categories
- `POST /categories/` - Create a new category
- `PUT /categories/{category_id}` - Update a category
- `DELETE /categories/{category_id}` - Delete a category

#### Products

- `GET /products/` - List all products
- `POST /products/` - Create a new product
- `PUT /products/{product_id}` - Update a product
- `DELETE /products/{product_id}` - Delete a product

#### Customers

- `GET /customers/` - List all customers
- `POST /customers/` - Create a new customer
- `PUT /customers/{customer_id}` - Update a customer
- `DELETE /customers/{customer_id}` - Delete a customer

#### Orders

- `GET /orders/` - List all orders
- `POST /orders/` - Create a new order
- `PUT /orders/{order_id}` - Update an order
- `DELETE /orders/{order_id}` - Delete an order

#### Order Items

- `GET /order_items/` - List all order items
- `POST /order_items/` - Create a new order item
- `PUT /order_items/{order_item_id}` - Update an order item
- `DELETE /order_items/{order_item_id}` - Delete an order item

## Database Schema

The application uses the following database models:

- **Category**: Product categories (id, name)
- **Product**: Items for sale (id, name, description, price, category_id)
- **Customer**: Buyers (id, name, email, phone)
- **Order**: Customer orders (id, customer_id, status, created_at, updated_at)
- **OrderItem**: Items within orders (id, order_id, product_id, quantity)

## Development

### Running Tests

```bash
# Backend tests (if implemented)
cd app-backend
pipenv run pytest

# Frontend tests (if implemented)
cd app-frontend
npm test
```

### Database Migrations

```bash
cd app-backend
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under License.
