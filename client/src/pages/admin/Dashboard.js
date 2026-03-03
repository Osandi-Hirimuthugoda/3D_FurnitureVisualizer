import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Teal/Green Palette matching your screenshots
  const colors = {
    primary: '#2caeba',    // Main Teal
    secondary: '#d9f2f1',  // Soft Mint
    accent: '#47c1b5',     // Light Green-Teal
    text: '#2d3748',       // Dark Slate
    background: '#f4f7f6'  // Light Grey Background
  };

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: colors.background,
      minHeight: '80vh',
      fontFamily: 'inherit'
    },
    topActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    heroCard: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      borderRadius: '15px',
      padding: '30px',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(44, 174, 186, 0.3)',
      transition: 'transform 0.2s'
    },
    recentSection: {
      marginTop: '30px'
    },
    recentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    designCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid #eee'
    },
    cardImageContainer: {
      width: '100%',
      height: '160px',
      backgroundColor: colors.secondary,
      overflow: 'hidden'
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    openButton: {
      width: '100%', 
      backgroundColor: colors.primary, 
      color: 'white', 
      border: 'none', 
      padding: '10px', 
      borderRadius: '6px', 
      marginTop: '12px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  };

  return (
    <div>
      <Navbar userRole="admin" />
      <div style={styles.container}>
        <h1 style={{ color: colors.text, marginBottom: '20px' }}>Dashboard</h1>
        
        {/* Main Action Cards Section */}
        <div style={styles.topActions}>
          <div style={styles.heroCard} onClick={() => navigate('/admin/room-setup')}>
            <span style={{ fontSize: '2rem' }}>+</span>
            <h2>Create New Design</h2>
            <p>Start a new room design project for your customer</p>
          </div>

          <div 
            style={{ ...styles.designCard, padding: '30px', cursor: 'pointer' }} 
            onClick={() => navigate('/admin/portfolio')}
          >
            <div style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '10px' }}>📁</div>
            <h2>View Portfolio</h2>
            <p style={{ color: '#666' }}>Browse and manage all your design projects</p>
          </div>
        </div>

        {/* RECENT DESIGNS SECTION */}
        <div style={styles.recentSection}>
          <h2 style={{ color: colors.text }}>Recent Designs</h2>
          <div style={styles.recentGrid}>
            
            {/* Design Card 1 */}
            <div style={styles.designCard}>
              <div style={styles.cardImageContainer}>
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500" 
                  alt="Modern Living Room" 
                  style={styles.cardImage}
                />
              </div>
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Modern Living Room</h4>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: '0' }}>Customer: Sarah Johnson</p>
                <p style={{ fontSize: '0.8rem', color: '#bbb' }}>Feb 10, 2026</p>
                <button 
                  onClick={() => navigate('/admin/room-setup')}
                  style={styles.openButton}
                >
                  👁 Open
                </button>
              </div>
            </div>

            {/* Design Card 2 */}
            <div style={styles.designCard}>
              <div style={styles.cardImageContainer}>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500" 
                  alt="Minimalist Office" 
                  style={styles.cardImage}
                />
              </div>
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Minimalist Office</h4>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: '0' }}>Customer: Emma Williams</p>
                <p style={{ fontSize: '0.8rem', color: '#bbb' }}>Feb 8, 2026</p>
                <button 
                  onClick={() => navigate('/admin/room-setup')}
                  style={styles.openButton}
                >
                  👁 Open
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;