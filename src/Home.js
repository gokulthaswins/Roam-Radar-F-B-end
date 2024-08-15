import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './Home.css';
import Card from './components/Card';
import TourCard from './components/TourCard';
import Destination from './Destination';
import TourDetail from './TourDetail';
import App from './App';
import Wishlist from './Wishlist'; // Import Wishlist component

const activities = [
  "Adventure",
  "Wildlife",
  "Sightseeing",
  "City Side",
  "Relaxation"
];

const data = [
  { image: './images/italymain.jpg', title: 'Italy', tours: 2, category: 'Adventure' },
  { image: '/images/moracoomain.jpg', title: 'Morocco', tours: 6, category: 'Sightseeing' },
  { image: './images/ukmain.jpg', title: 'United Kingdom', tours: 8, category: 'City Side' },
  { image: './images/singaporemain.jpg', title: 'Singapore', tours: 5, category: 'City Side' },
  { image: './images/hungurymain.jpg', title: 'Hungary', tours: 3, category: 'Forest' },
  { image: './images/southafricamain.jpg', title: 'South Africa', tours: 7, category: 'Sightseeing' },
  { image: './images/greecemain.jpg', title: 'Greece', tours: 2, category: 'Forest' },
  { image: './images/usmain.jpg', title: 'United States', tours: 9, category: 'Adventure' },
];

function Home() {
  // const { state } = useLocation();
  // const { userId } = state;
  // const location = useLocation();
  // const userId = location.state?.userId;
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/tours') // Adjust the URL to match your backend endpoint
      .then(response => response.json())
      .then(data => setTours(data))
      .catch(error => console.error('Error fetching tours:', error));
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'destination') setDestination(value);
    if (name === 'activity') setActivity(value);
    if (name === 'minPrice') setMinPrice(value);
    if (name === 'maxPrice') setMaxPrice(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = tours.filter(tour => {
      const matchesDestination = destination ? tour.location.toLowerCase().includes(destination.toLowerCase()) : true;
      const matchesActivity = activity ? tour.category.toLowerCase().includes(activity.toLowerCase()) : true;
      const matchesMinPrice = minPrice ? tour.price >= parseFloat(minPrice) : true;
      const matchesMaxPrice = maxPrice ? tour.price <= parseFloat(maxPrice) : true;

      return matchesDestination && matchesActivity && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredTours(filtered);
    setIsSearchPerformed(true);
  };

  const handleCancelSearch = () => {
    setDestination('');
    setActivity('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredTours([]);
    setIsSearchPerformed(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <ConditionalNavBar isLoggedIn={isLoggedIn} />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section className="hero">
                    <h1>Let's explore</h1>
                    <h2>Where Would You Like To Go?</h2>
                    <p>Checkout Beautiful Places Around the World</p>
                    <form className="search-bar" onSubmit={handleSearch}>
                      <select className='bar' name="destination" value={destination} onChange={handleInputChange}>
                        <option value="" disabled>Select Destination</option>
                        {Array.from(new Set(tours.map(tour => tour.location))).map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))}
                      </select>
                      <select className='bar' name="activity" value={activity} onChange={handleInputChange}>
                        <option value="" disabled>Select Activity</option>
                        {activities.map((act, index) => (
                          <option key={index} value={act}>{act}</option>
                        ))}
                      </select>
                      <input className='bar'
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={minPrice}
                        min="1"
                        onChange={handleInputChange}
                      />
                      <input className='bar'
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={handleInputChange}
                      />
                      <button className='bar' type="submit">Search</button>
                    </form>
                    <div className="cancelsearchdiv">
                      {isSearchPerformed ? (<button onClick={handleCancelSearch} className="transparent-button">Cancel Search</button>) : (<div></div>)}
                    </div>
                  </section>
                  
                  {isSearchPerformed ? (
                    <section>
                      <h2 className="popular">Search Results</h2>
                      <div className="tour-cards-container">
                        {filteredTours.length > 0 ? (
                          filteredTours.map((tour, index) => (
                            <div key={index}>
                              <Link
                                to={`/tour/${tour.title}`}
                                state={tour}
                                style={{ textDecoration: 'none' }}
                              >
                                <TourCard {...tour} className="tour-cards"/>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <p>No tours found matching the search criteria.</p>
                        )}
                      </div>
                    </section>
                  ) : (
                    <>
                      <section>
                        <h2 className="popular">Go and Explore</h2>
                        <div className="card-container">
                          {data.map((item, index) => (
                            <Card
                              className="card"
                              key={index}
                              image={item.image}
                              title={item.title}
                              tours={item.tours}
                              link={`/destination/${item.title}`}
                            />
                          ))}
                        </div>
                      </section>
                      <hr />
                      <section>
                        <h2 className="popular">Top Tour Spots</h2>
                        <div className="tour-cards-container">
                          {tours.map((tour, index) => (
                            <div key={index}>
                              <Link
                                to={`/tour/${tour.title}`}
                                state={tour}
                                style={{ textDecoration: 'none' }}
                              >
                                <TourCard {...tour} className="tour-cards"/>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </section>  
                    </>
                  )}
                </>
              }
            />
            <Route path="/destination/:country" element={<Destination tours={tours} />} />
            <Route path="/tour/:title" element={<TourDetail />} />
            <Route path="/signin" element={<App />} />
            <Route path="/wishlist" element={<Wishlist />} /> {/* Add wishlist route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const ConditionalNavBar = ({ isLoggedIn }) => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/signin';
  return showNavBar ? (
    <nav className="navbar">
      <div className="logo">Explore Epic</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tours">Tours Page</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li> {/* Update navigation bar */}
      </ul>
      <div className="auth-button">
        {!isLoggedIn && <button className="black-button"><Link to="/signin">Sign In/Login</Link></button>}
        {isLoggedIn && <button className="black-button"><Link to="/signin">Logout</Link></button>}
        {/*} {!isLoggedIn && <button className="black-button"><Link to="/signin">Sign In/Login</Link></button>}*/}
      </div>
    </nav>
  ) : null;
};

export default Home;
