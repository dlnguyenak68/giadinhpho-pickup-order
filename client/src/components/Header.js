import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <p className="header-tagline">Pickup Orders</p>
        <div className="logo-block">
          <h1 className="logo-title">GIA ĐÌNH</h1>
          <p className="logo-subtitle">Pho and Vietnamese Cuisine</p>
          <div className="logo-accent-line" aria-hidden="true" />
        </div>
      </div>

      <nav className="site-nav" aria-label="Main">
        <a
          className="nav-link active"
          href="https://www.giadinhpho.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Home
        </a>
        <span className="nav-link secondary active">Order Pickup</span>
      </nav>

      <div className="hero-strip">
        <div>
          <p className="hero-welcome">Order for Pickup</p>
          <p className="hero-text">
            Gia Dinh (pronounced Ya Din) means family. Place your order online and
            we will have it ready when you arrive.
          </p>
        </div>
      </div>

      <div className="restaurant-info">
        <p>
          549 West International Airport Road #A1, Anchorage, Alaska 99518
          <br />
          <a href="tel:+19072222663">(907) 222-2663</a>
          {' · '}
          Mon–Sat 11:00 AM – 9:00 PM · Sunday Closed
        </p>
      </div>
    </header>
  );
}

export default Header;
