import './OrderConfirmation.css';

function OrderConfirmation({ order, onNewOrder }) {
  return (
    <div className="confirmation-panel">
      <h2>Thank You!</h2>
      <p className="order-id">Order #{order.id}</p>
      <p>
        We received your pickup order, {order.customerName}. We will have it ready
        at <strong>{order.pickupTime}</strong>.
      </p>

      <div className="confirmation-details">
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        {order.email && (
          <p>
            <strong>Email:</strong> {order.email}
          </p>
        )}
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        {order.specialInstructions && (
          <p>
            <strong>Notes:</strong> {order.specialInstructions}
          </p>
        )}
        <p>
          <strong>Pickup at:</strong> 549 W International Airport Rd #A1, Anchorage, AK
        </p>
      </div>

      <button type="button" className="new-order-btn" onClick={onNewOrder}>
        Place Another Order
      </button>
    </div>
  );
}

export default OrderConfirmation;
