import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Zap, Shield } from 'lucide-react';
import Login from './Login';
import Dashboard from './Dashboard';

// Animated background particles component
const AnimatedParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="particles">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthed(false);
  }

  return (
    <div className="app-container">
      <AnimatedParticles />
      
      <motion.div 
        className="app-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.header 
          className="app-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="header-content">
            <div className="logo-section">
              <motion.div 
                className="logo-icon"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Zap size={32} />
              </motion.div>
              <h1>Clickbait Dashboard</h1>
            </div>
            
            {authed && (
              <motion.button 
                className="cyber-button logout-btn"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {authed ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Dashboard />
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Login onSuccess={() => setAuthed(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          className="app-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="footer-content">
            <div className="security-badge">
              <Shield size={16} />
              <span>Secure Connection</span>
            </div>
            <div className="version-info">
              <span>v2.0.0</span>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}


