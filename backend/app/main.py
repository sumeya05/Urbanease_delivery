from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import categories, products, orders, delivery

app = FastAPI(title="UrbanEase Delivery API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(delivery.router, prefix="/api/delivery", tags=["delivery"])

@app.get("/")
def read_root():
    return {"message": "Welcome to UrbanEase Delivery API"}
