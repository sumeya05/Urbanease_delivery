from pydantic import BaseModel
from typing import List
from typing import Optional, List
from datetime import datetime


# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


# Customer schemas
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: str


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True


# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Delivery schemas
class DeliveryBase(BaseModel):
    order_id: int
    driver_name: Optional[str] = None
    status: str


class DeliveryCreate(DeliveryBase):
    pass


class Delivery(DeliveryBase):
    id: int
    assigned_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True
