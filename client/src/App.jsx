
import { useState } from "react";
import AuthModal from "./AuthModal";
import "./App.css";

const cars = [
  {
    id: 1,
    name: "Toyota Hilux 2.8 GD-6 4x4",
    make: "Toyota",
    year: 2023,
    mileage: 45000,
    price: 569000,
    location: "Durban, KZN",
    type: "Buy Now",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900",
  },
  {
    id: 2,
    name: "BMW 320d M Sport",
    make: "BMW",
    year: 2022,
    mileage: 38000,
    price: 410000,
    location: "Johannesburg, GP",
    type: "Auction",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900",
  },
  {
    id: 3,
    name: "Mercedes-Benz C-Class",
    make: "Mercedes-Benz",
    year: 2021,
    mileage: 62000,
    price: 489000,
    location: "Cape Town, WC",
    type: "Buy Now",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900",
  },
  {
    id: 4,
    name: "Volkswagen Golf GTI",
    make: "Volkswagen",
    year: 2020,
    mileage: 55000,
    price: 335000,
    location: "Pretoria, GP",
    type: "Auction",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);

export default function App() {
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("All");
  const [maxPrice, setMaxPrice] = useState("All");
  const [mode, setMode] = useState("All");
  const [favourites, setFavourites] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);const [authOpen, setAuthOpen] = useState(false);

const [currentUser, setCurrentUser] = useState(() => {
  try {
    return JSON.parse(sessionStorage.getItem("autobid_user") || "null");
  } catch {
    return null;
  }
});

function logout() {
  sessionStorage.removeItem("autobid_token");
  sessionStorage.removeItem("autobid_user");
  setCurrentUser(null);
}


  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMake = make === "All" || car.make === make;

    const matchesPrice =
      maxPrice === "All" || car.price <= Number(maxPrice);

    const matchesMode = mode === "All" || car.type === mode;

    return (
      matchesSearch &&
      matchesMake &&
      matchesPrice &&
      matchesMode
    );
  });

  function toggleFavourite(id) {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function comingSoon(feature) {
    alert(
      feature +
        " will be activated when we connect the AutoBid SA backend."
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">◆</span>
          AutoBid<span>SA</span>
          <small>BUY · BID · DRIVE</small>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#vehicles">Buy Cars</a>
          <a href="#auctions">Auctions</a>
          <a href="#membership">Membership</a>
        </nav>

        <div className="nav-actions">
         {currentUser ? (
  <>
    <span className="signed-in-name">
      Hi, {currentUser.name}
    </span>
    <button className="outline-btn" onClick={logout}>
      Log Out
    </button>
  </>
) : (
  <button
    className="outline-btn"
    onClick={() => setAuthOpen(true)}
  >
    Sign In
  </button>
)}
          <a className="gold-btn" href="#membership">
            Join Now
          </a>
          {authOpen && (
  <AuthModal
    onClose={() => setAuthOpen(false)}
    onLogin={setCurrentUser}
  />
)}
        </div>
      </header>

      <section id="home" className="hero">
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              SOUTH AFRICA'S AUTOMOTIVE MARKETPLACE
            </p>

            <h1>
              Quality Vehicles.
              <br />
              Real Bids.
              <br />
              <span>Real Value.</span>
            </h1>

            <p className="hero-description">
              Buy vehicles outright or participate in scheduled
              online auctions. Your next car is waiting.
            </p>

            <div className="hero-buttons">
              <a href="#vehicles" className="gold-btn large">
                Browse Vehicles ↗
              </a>
              <a href="#auctions" className="outline-btn large">
                Explore Auctions
              </a>
            </div>
          </div>

          <aside className="hero-membership">
            <p className="member-label">★ MEMBER ACCESS</p>
            <h2>
              R250 <small>/ month</small>
            </h2>
            <ul>
              <li>✓ Members-only live bidding</li>
              <li>✓ Scheduled vehicle auctions</li>
              <li>✓ Favourite vehicle watchlist</li>
              <li>✓ Auction notifications</li>
            </ul>
            <a href="#membership" className="gold-btn full">
              Become a Member →
            </a>
          </aside>
        </div>
      </section>

      <main>
        <section className="search-panel" aria-label="Vehicle search">
          <div className="search-tabs">
            {["All", "Buy Now", "Auction"].map((item) => (
              <button
                key={item}
                className={mode === item ? "active" : ""}
                onClick={() => setMode(item)}
              >
                {item === "All" ? "All Vehicles" : item}
              </button>
            ))}
          </div>

          <div className="search-fields">
            <label>
              Search
              <input
                type="search"
                placeholder="Search by vehicle name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              Make
              <select
                value={make}
                onChange={(event) => setMake(event.target.value)}
              >
                <option value="All">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Volkswagen">Volkswagen</option>
              </select>
            </label>

            <label>
              Maximum Price
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              >
                <option value="All">Any Price</option>
                <option value="350000">R350,000</option>
                <option value="450000">R450,000</option>
                <option value="500000">R500,000</option>
                <option value="600000">R600,000</option>
              </select>
            </label>

            <a href="#vehicles" className="gold-btn search-action">
              View Results ({filteredCars.length})
            </a>
          </div>
        </section>

        <section className="benefits">
          <div>✦ <span>Curated Listings</span></div>
          <div>⚒ <span>Scheduled Auctions</span></div>
          <div>♢ <span>Member Bidding</span></div>
          <div>◎ <span>Nationwide Marketplace</span></div>
        </section>

        <section className="market-section" id="vehicles">
          <div className="section-title">
            <div>
              <p className="eyebrow">THE AUTOBID COLLECTION</p>
              <h2>Featured Vehicles</h2>
              <p>Explore our demonstration vehicle listings.</p>
            </div>
            <span className="result-count">
              {filteredCars.length} vehicles
            </span>
          </div>

          <div className="market-layout">
            <article className="auction-feature" id="auctions">
              <span className="auction-status">
                ● UPCOMING AUCTION
              </span>
              <h3>Premium Vehicle Auction</h3>
              <p>
                Our upcoming auctions will feature verified members
                competing for selected vehicles.
              </p>

              <div className="countdown-preview">
                <div>
                  <strong>LIVE</strong>
                  <small>BIDDING</small>
                </div>
                <div>
                  <strong>R250</strong>
                  <small>MEMBERSHIP</small>
                </div>
              </div>

              <button
                className="auction-btn"
                onClick={() => comingSoon("Live auctions")}
              >
                Explore Auction Details →
              </button>
              <p className="demo-note">
                Auction scheduling and countdowns will be connected
                to the backend.
              </p>
            </article>

            <div className="vehicle-grid">
              {filteredCars.map((car) => (
                <article className="vehicle-card" key={car.id}>
                  <div className="vehicle-photo">
                    <img src={car.image} alt={car.name} />
                    <span
                      className={
                        car.type === "Auction"
                          ? "vehicle-tag auction-tag"
                          : "vehicle-tag"
                      }
                    >
                      {car.type}
                    </span>

                    <button
                      className="favourite-btn"
                      aria-label={
                        favourites.includes(car.id)
                          ? "Remove favourite"
                          : "Add favourite"
                      }
                      onClick={() => toggleFavourite(car.id)}
                    >
                      {favourites.includes(car.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="vehicle-info">
                    <h3>{car.name}</h3>
                    <p>
                      {car.year} ·{" "}
                      {car.mileage.toLocaleString("en-ZA")} km
                    </p>
                    <strong>{money(car.price)}</strong>

                    <div className="vehicle-bottom">
                      <span>⌖ {car.location}</span>
                      <button onClick={() => setSelectedCar(car)}>
                        View Details →
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {filteredCars.length === 0 && (
                <div className="empty-state">
                  No vehicles match your search. Try another make
                  or price range.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="membership-section" id="membership">
          <div>
            <p className="eyebrow">EXCLUSIVE AUCTION ACCESS</p>
            <h2>
              Don't just watch.
              <br />
              <span>Own the moment.</span>
            </h2>
            <p>
              Become an AutoBid SA member to participate in
              scheduled live auctions once membership payments
              and verification are enabled.
            </p>
          </div>

          <div className="membership-price">
            <span>MONTHLY MEMBERSHIP</span>
            <h3>R250</h3>
            <p>per month</p>
            <button onClick={() => comingSoon("Membership registration")}>
              Join AutoBid SA →
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <strong>
          AutoBid<span>SA</span>
        </strong>
        <p>Buy smarter. Bid confidently. Drive forward.</p>
        <small>© 2026 AutoBid SA · Demonstration platform</small>
      </footer>

      {selectedCar && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCar(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Vehicle details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCar(null)}
            >
              ✕
            </button>
            <img src={selectedCar.image} alt={selectedCar.name} />
            <h2>{selectedCar.name}</h2>
            <p>
              {selectedCar.year} ·{" "}
              {selectedCar.mileage.toLocaleString("en-ZA")} km
            </p>
            <p>{selectedCar.location}</p>
            <h3>{money(selectedCar.price)}</h3>
            <button
              className="gold-btn full"
              onClick={() =>
                comingSoon(
                  selectedCar.type === "Auction"
                    ? "Auction bidding"
                    : "Vehicle purchasing"
                )
              }
            >
              {selectedCar.type === "Auction"
                ? "Join Auction"
                : "Enquire About Vehicle"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
