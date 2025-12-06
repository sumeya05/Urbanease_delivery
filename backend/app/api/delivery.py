from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_db
from .. import crud, schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Delivery])
def read_deliveries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    deliveries = crud.get_deliveries(db, skip=skip, limit=limit)
    return deliveries


@router.post("/", response_model=schemas.Delivery)
def create_delivery(delivery: schemas.DeliveryCreate, db: Session = Depends(get_db)):
    return crud.create_delivery(db=db, delivery=delivery)


@router.get("/{delivery_id}", response_model=schemas.Delivery)
def read_delivery(delivery_id: int, db: Session = Depends(get_db)):
    db_delivery = crud.get_delivery(db, delivery_id=delivery_id)
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return db_delivery


@router.get("/order/{order_id}", response_model=schemas.Delivery)
def read_delivery_by_order(order_id: int, db: Session = Depends(get_db)):
    db_delivery = crud.get_delivery_by_order(db, order_id=order_id)
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return db_delivery


@router.put("/{delivery_id}", response_model=schemas.Delivery)
def update_delivery(
    delivery_id: int, delivery: schemas.DeliveryCreate, db: Session = Depends(get_db)
):
    db_delivery = crud.update_delivery(
        db, delivery_id=delivery_id, delivery_update=delivery
    )
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return db_delivery


@router.put("/order/{order_id}", response_model=schemas.Delivery)
def update_delivery_by_order(
    order_id: int, delivery: schemas.DeliveryCreate, db: Session = Depends(get_db)
):
    db_delivery = crud.get_delivery_by_order(db, order_id=order_id)
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    for key, value in delivery.dict().items():
        setattr(db_delivery, key, value)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery
