#!/usr/bin/env python3

from models import Base, engine

# Create all tables
Base.metadata.create_all(engine)
print("Database tables created successfully.")

# Seed the database
import seed

print("Database seeded successfully.")
