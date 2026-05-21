import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartPanel from './components/CartPanel';
import OrderConfirmation from './components/OrderConfirmation';
import Footer from './components/Footer';

const TAX_RATE = 0.05;
const EMPTY_FORM = {
  customerName: '',
  phone: '',
  email: '',
  pickupTime: '',
  specialInstructions: '',
};

function App() {
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to load menu');
        }
        const data = await response.json();
        setMenu(data);
      } catch {
        setMenuError('Could not load menu. Make sure the backend is running.');
      } finally {
        setMenuLoading(false);
      }
    }

    loadMenu();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  function handleAddItem(menuItem) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  }

  function handleUpdateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Please add at least one item to your order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.errors
          ? data.errors.join(' ')
          : data.error || 'Could not place order. Please try again.';
        setError(message);
        return;
      }

      setConfirmedOrder(data);
      setCart([]);
      setForm(EMPTY_FORM);
    } catch {
      setError('Unable to reach the server. Make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewOrder() {
    setConfirmedOrder(null);
    setError('');
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {confirmedOrder ? (
          <OrderConfirmation order={confirmedOrder} onNewOrder={handleNewOrder} />
        ) : (
          <div className="page-grid">
            <MenuSection
              categories={menu.categories}
              items={menu.items}
              isLoading={menuLoading}
              error={menuError}
              cart={cart}
              onAddItem={handleAddItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
            <CartPanel
              cart={cart}
              subtotal={subtotal}
              tax={tax}
              total={total}
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
