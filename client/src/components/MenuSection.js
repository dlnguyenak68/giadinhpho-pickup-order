import { useEffect, useState } from 'react';
import './MenuSection.css';

function MenuSection({
  categories,
  items,
  isLoading,
  error,
  cart,
  onAddItem,
  onUpdateQuantity,
}) {
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const filteredItems = items.filter((item) => item.category === activeCategory);

  function getQuantity(itemId) {
    const line = cart.find((c) => c.id === itemId);
    return line ? line.quantity : 0;
  }

  if (isLoading) {
    return (
      <section>
        <h2 className="section-title">Pick Your Favorite Dishes</h2>
        <p className="menu-status">Loading menu...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="section-title">Pick Your Favorite Dishes</h2>
        <div className="message-banner error">{error}</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="section-title">Pick Your Favorite Dishes</h2>
      <p className="section-subtitle">
        Discover more from our menu — order online for pickup at our kitchen.
      </p>

      <div className="category-tabs" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="menu-list">
        {filteredItems.map((item) => {
          const quantity = getQuantity(item.id);
          return (
            <article key={item.id} className="menu-card">
              <div>
                <div className="menu-card-header">
                  <h3>{item.name}</h3>
                  {item.popular && <span className="popular-badge">Popular</span>}
                </div>
                <p className="menu-description">{item.description}</p>
              </div>
              <div className="menu-actions">
                <span className="menu-price">${item.price.toFixed(2)}</span>
                {quantity === 0 ? (
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => onAddItem(item)}
                  >
                    Add
                  </button>
                ) : (
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name}`}
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MenuSection;
