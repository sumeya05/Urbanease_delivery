import React, { useState, useEffect } from "react";
import DeliveryList from "../components/admin/DeliveryList";
import OrderStatusUpdater from "../components/admin/OrderStatusUpdater";
import { fetchOrdersByCustomer } from "../api/order.service";
import { updateDeliveryStatus } from "../api/delivery.service";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // For demo purposes, fetch orders for a specific customer or all open orders
    // In a real app, you'd have an admin endpoint to fetch all orders
    const loadOrders = async () => {
      // This is a placeholder - you'd need an admin endpoint to fetch all orders
      const data = await fetchOrdersByCustomer("admin"); // Placeholder
      setOrders(data);
    };
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status, driverName) => {
    await updateDeliveryStatus(orderId, status, driverName);
    // Refresh orders or update local state
    alert("Status updated successfully!");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <DeliveryList orders={orders} />
      {selectedOrder && (
        <OrderStatusUpdater
          orderId={selectedOrder}
          currentStatus={
            orders.find((o) => o.id === selectedOrder)?.status || "Pending"
          }
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      <div>
        <h3>Select Order to Update</h3>
        <select onChange={(e) => setSelectedOrder(parseInt(e.target.value))}>
          <option value="">Select an order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              Order #{order.id} - {order.customer_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdminDashboard;
