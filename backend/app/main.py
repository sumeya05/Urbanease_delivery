from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import categories, products, orders, delivery
from .database import engine, SessionLocal
from . import models, crud, schemas

# Create database tables
models.Base.metadata.create_all(bind=engine)


# Seed initial data
def seed_data():
    db = SessionLocal()
    try:
        # Check if categories exist
        if not crud.get_categories(db):
            # Create categories
            category1 = crud.create_category(
                db,
                schemas.CategoryCreate(
                    name="Electronics", description="Electronic gadgets and devices"
                ),
            )
            category2 = crud.create_category(
                db,
                schemas.CategoryCreate(
                    name="Clothing", description="Fashion and apparel"
                ),
            )
            category3 = crud.create_category(
                db,
                schemas.CategoryCreate(
                    name="Home & Garden",
                    description="Home improvement and gardening supplies",
                ),
            )

            # Create products
            crud.create_product(
                db,
                schemas.ProductCreate(
                    name="Smartphone",
                    description="Latest smartphone",
                    price=699.99,
                    category_id=category1.id,
                ),
            )
            crud.create_product(
                db,
                schemas.ProductCreate(
                    name="Laptop",
                    description="High-performance laptop",
                    price=1299.99,
                    category_id=category1.id,
                ),
            )
            crud.create_product(
                db,
                schemas.ProductCreate(
                    name="T-Shirt",
                    description="Cotton t-shirt",
                    price=19.99,
                    category_id=category2.id,
                ),
            )
            crud.create_product(
                db,
                schemas.ProductCreate(
                    name="Jeans",
                    description="Denim jeans",
                    price=49.99,
                    category_id=category2.id,
                ),
            )
            crud.create_product(
                db,
                schemas.ProductCreate(
                    name="Garden Hose",
                    description="Durable garden hose",
                    price=29.99,
                    category_id=category3.id,
                ),
            )
    finally:
        db.close()


seed_data()

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
