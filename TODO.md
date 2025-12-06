# TODO: Fix Backend-Frontend Connection Issues

## Issues Identified and Fixed

- [x] Missing route for fetching orders by customer name: Added GET /api/orders/customer/{customer_name}
- [x] Missing route for updating delivery by order ID: Added PUT /api/delivery/order/{order_id}

## Next Steps

- [ ] Restart the backend server to apply changes
- [ ] Test API endpoints:
  - Visit http://localhost:8000/docs to verify all routes are present
  - Test GET http://localhost:8000/api/orders/customer/{customerName}
  - Test PUT http://localhost:8000/api/delivery/order/{orderId}
- [ ] Ensure frontend is running on http://localhost:3000
- [ ] Check browser console for any CORS or fetch errors
- [ ] Verify database has seeded data (categories, products, etc.)
