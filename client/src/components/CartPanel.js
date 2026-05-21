import { PICKUP_TIME_SLOTS } from '../data/pickupTimes';
import './CartPanel.css';

function CartPanel({
  cart,
  subtotal,
  tax,
  total,
  form,
  onFormChange,
  onSubmit,
  isSubmitting,
  error,
}) {
  const isEmpty = cart.length === 0;

  return (
    <aside className="cart-panel">
      <h2>Your Order</h2>

      {isEmpty ? (
        <p className="cart-empty">Your cart is empty. Add items from the menu.</p>
      ) : (
        <>
          <ul className="cart-lines">
            {cart.map((item) => (
              <li key={item.id} className="cart-line">
                <div>
                  <div className="cart-line-name">{item.name}</div>
                  <div className="cart-line-qty">Qty: {item.quantity}</div>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="cart-totals">
            <div>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="message-banner error">{error}</div>}

          <form className="checkout-form" onSubmit={onSubmit}>
            <label htmlFor="customerName">Name *</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              value={form.customerName}
              onChange={onFormChange}
              placeholder="Your name"
            />

            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={onFormChange}
              placeholder="(907) 555-1234"
            />

            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onFormChange}
              placeholder="you@email.com"
            />

            <label htmlFor="pickupTime">Pickup Time *</label>
            <select
              id="pickupTime"
              name="pickupTime"
              required
              value={form.pickupTime}
              onChange={onFormChange}
            >
              <option value="">Select a time</option>
              {PICKUP_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <label htmlFor="specialInstructions">Special Instructions</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={form.specialInstructions}
              onChange={onFormChange}
              placeholder="Extra lime, no onions, etc."
            />

            <button
              type="submit"
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Pickup Order'}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}

export default CartPanel;
