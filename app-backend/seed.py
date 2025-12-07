# server/seed_products.py
from sqlalchemy.orm import sessionmaker
from models import Category, Product, engine

# 1. Connect to the database
Session = sessionmaker(bind=engine)
session = Session()


def seed_data():
    print("🌱 Clearing old data...")
    session.query(Product).delete()
    session.query(Category).delete()
    session.commit()

    print("🌱 Creating Categories...")
    categories = [
        Category(name="Food"),
        Category(name="Electronics"),
        Category(name="Clothes"),
        Category(name="Books"),
        Category(name="Furniture"),
    ]
    session.add_all(categories)
    session.commit()  # commit to generate IDs
    print(f"✅ Added {len(categories)} categories.")

    print("🌱 Creating Products...")
    products = [
        Product(name="Burger", price=8.0, category_id=categories[0].id),
        Product(name="Pizza", price=12.0, category_id=categories[0].id),
        Product(name="Laptop", price=900.0, category_id=categories[1].id),
        Product(name="T-shirt", price=20.0, category_id=categories[2].id),
        Product(name="Novel", price=15.0, category_id=categories[3].id),
        Product(name="Sofa", price=300.0, category_id=categories[4].id),
    ]
    session.add_all(products)
    session.commit()
    print(f"✅ Added {len(products)} products.")

    print("🎉 Database populated successfully!")


if __name__ == "__main__":
    seed_data()
    session.close()
