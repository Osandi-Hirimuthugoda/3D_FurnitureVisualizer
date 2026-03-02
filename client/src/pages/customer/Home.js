import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Home = () => {
  return (
    <div>
      <Navbar userRole="customer" />
      <div className="home-container">
        <h1>Welcome to 3D Furniture Visualizer</h1>
        <p>Explore and visualize furniture in 3D</p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
