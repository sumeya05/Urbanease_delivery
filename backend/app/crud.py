from sqlalchemy.orm import Session
from . import models, schemas


# Categories
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()


# Products
def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


# Orders
def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()


def create_order(db: Session, order: schemas.OrderCreate):
    # Create order
    db_order = models.Order(customer_id=order.customer_id, total_price=0.0)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    total_price = 0.0
    for item in order.items:
        product = get_product(db, item.product_id)
        if product:
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price,
            )
            db.add(db_item)
            total_price += product.price * item.quantity

    # Update total price
    db_order.total_price = total_price
    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def get_orders_by_customer(db: Session, customer_name: str):
    return (
        db.query(models.Order)
        .join(models.Customer)
        .filter(models.Customer.name == customer_name)
        .all()
    )


# Deliveries
def get_deliveries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Delivery).offset(skip).limit(limit).all()


def create_delivery(db: Session, delivery: schemas.DeliveryCreate):
    db_delivery = models.Delivery(**delivery.dict())
    db.add(db_delivery)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery


def get_delivery(db: Session, delivery_id: int):
    return db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()


def get_delivery_by_order(db: Session, order_id: int):
    return (
        db.query(models.Delivery).filter(models.Delivery.order_id == order_id).first()
    )


def update_delivery(
    db: Session, delivery_id: int, delivery_update: schemas.DeliveryCreate
):
    db_delivery = get_delivery(db, delivery_id)
    if db_delivery:
        for key, value in delivery_update.dict().items():
            setattr(db_delivery, key, value)
        db.commit()
        db.refresh(db_delivery)
    return db_delivery


# Customers
def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()


def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_by_name(db: Session, name: str):
    return db.query(models.Customer).filter(models.Customer.name == name).first()
