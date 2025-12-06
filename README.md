# UrbanEase Delivery

A full-stack delivery management system built with FastAPI (backend) and React (frontend).

## Features

- Product catalog with categories
- Shopping cart functionality
- Order placement and tracking
- Admin dashboard for managing deliveries
- Real-time order status updates

## Project Structure

```
urbanease_delivery/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── config.py        # Configuration settings
│   │   └── api/             # API routers
│   ├── alembic/             # Database migrations
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── api/             # API client services
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS styles
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   └── package.json         # Node dependencies
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Setup

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the STUDENT LICENCE.
