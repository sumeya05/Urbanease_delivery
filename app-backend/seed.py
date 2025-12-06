from sqlalchemy.orm import sessionmaker
from models import Category, Product, engine

Session = sessionmaker(bind=engine)
session = Session()

# Seed categories
categories = [
    Category(id=1, name="Food"),
    Category(id=2, name="Electronics"),
    Category(id=3, name="Clothes"),
    Category(id=4, name="Books"),
    Category(id=5, name="Furniture"),
]

# Seed products
products = [
    Product(id=1, name="Burger", price=8.0, category_id=1),
    Product(id=2, name="Pizza", price=12.0, category_id=1),
    Product(id=3, name="Laptop", price=900.0, category_id=2),
    Product(id=4, name="T-shirt", price=20.0, category_id=3),
    Product(id=5, name="Novel", price=15.0, category_id=4),
    Product(id=6, name="Sofa", price=300.0, category_id=5),
]

session.add_all(categories)
session.add_all(products)
session.commit()
session.close()

print("Database seeded successfully.")
