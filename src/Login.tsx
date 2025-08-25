import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { login } from './api';

type Props = { onLoggedIn?: () => void; onSuccess?: () => void };

export default function Login({ onLoggedIn, onSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      if (onLoggedIn) {
        onLoggedIn();
      } else if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <motion.div 
        className="login-card glass-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div 
          className="login-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="login-icon"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Shield size={48} />
          </motion.div>
          <h2>Access Control</h2>
          <p className="login-subtitle">Enter your credentials to continue</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={16} />
              <span>Username</span>
            </label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                placeholder="Enter your username"
                required
              />
              <motion.div 
                className="input-glow"
                animate={{ 
                  opacity: username ? [0.5, 1, 0.5] : 0.3 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              <span>Password</span>
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input"
                placeholder="Enter your password"
                required
              />
              <motion.button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
              <motion.div 
                className="input-glow"
                animate={{ 
                  opacity: password ? [0.5, 1, 0.5] : 0.3 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              className="message error"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            type="submit" 
            className="cyber-button login-btn"
            disabled={loading || !username || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Zap size={18} />
                <span>Authenticate</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Security notice */}
        <motion.div 
          className="security-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Shield size={14} />
          <span>Your data is encrypted and secure</span>
        </motion.div>
      </motion.div>
    </div>
  );
}


