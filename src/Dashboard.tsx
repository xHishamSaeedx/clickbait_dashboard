import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Link, 
  Zap, 
  Activity, 
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { createUrl, deleteUrl, getOnePublic, listUrls, updateUrl, type UrlItem } from './api';

type Item = UrlItem;

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [formUrl, setFormUrl] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleUnauthorized() {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
  }

  function isValidUrl(value: string): boolean {
    if (!value) return false;
    return value.startsWith('http://') || value.startsWith('https://');
  }

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await listUrls();
      setItems(data);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'unauthorized') {
        handleUnauthorized();
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!formUrl.trim()) return;
    setError(null);
    try {
      await createUrl({ url: formUrl.trim(), active: formActive });
      setFormUrl('');
      setFormActive(true);
      setShowAddForm(false);
      await refresh();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'unauthorized') {
        handleUnauthorized();
        return;
      }
      setError(msg);
    }
  }

  function beginEdit(item: Item) {
    setEditingId(item.id);
    setEditUrl(item.url);
    setEditActive(Boolean(item.active));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditUrl('');
    setEditActive(true);
  }

  async function saveEdit(id: string) {
    try {
      await updateUrl(id, { url: editUrl, active: editActive });
      setEditingId(null);
      await refresh();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'unauthorized') {
        handleUnauthorized();
        return;
      }
      setError(msg);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteUrl(id);
      await refresh();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'unauthorized') {
        handleUnauthorized();
        return;
      }
      setError(msg);
    }
  }

  async function onTestRandom() {
    setError(null);
    try {
      const { url } = await getOnePublic();
      setTestResult(url);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const activeCount = items.filter(item => item.active).length;
  const totalCount = items.length;

  return (
    <div className="dashboard-container">
      {/* Header Stats */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="stats-grid">
          <motion.div 
            className="stat-card glass-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="stat-icon">
              <Link size={24} />
            </div>
            <div className="stat-content">
              <h3>{totalCount}</h3>
              <p>Total URLs</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card glass-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="stat-icon active">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <h3>{activeCount}</h3>
              <p>Active URLs</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card glass-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="stat-icon inactive">
              <Pause size={24} />
            </div>
            <div className="stat-content">
              <h3>{totalCount - activeCount}</h3>
              <p>Inactive URLs</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Actions Bar */}
      <motion.div 
        className="actions-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          className="cyber-button primary-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          <span>Add New URL</span>
        </motion.button>

        <motion.button
          className="cyber-button secondary-btn"
          onClick={onTestRandom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={18} />
          <span>Test Random</span>
        </motion.button>

        <motion.button
          className="cyber-button refresh-btn"
          onClick={refresh}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="add-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={onAdd} className="add-form glass-card">
              <h3>Add New URL</h3>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="newUrl" className="form-label">
                    <Link size={16} />
                    <span>URL</span>
                  </label>
                  <input
                    id="newUrl"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="cyber-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="cyber-checkbox">
                    <input 
                      type="checkbox" 
                      checked={formActive} 
                      onChange={(e) => setFormActive(e.target.checked)} 
                    />
                    <span>Active</span>
                  </label>
                </div>
                <motion.button 
                  type="submit" 
                  className="cyber-button"
                  disabled={loading || !isValidUrl(formUrl)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Result */}
      {testResult && (
        <motion.div 
          className="test-result glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="test-result-header">
            <CheckCircle size={20} className="success-icon" />
            <h4>Random URL Result</h4>
          </div>
          <div className="test-result-content">
            <a 
              href={testResult} 
              target="_blank" 
              rel="noopener noreferrer"
              className="test-url"
            >
              {testResult}
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          className="message error"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <XCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* URLs List */}
      <div className="urls-container">
        {loading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loading-spinner" />
            <p>Loading URLs...</p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div 
            className="empty-state glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link size={48} />
            <h3>No URLs Found</h3>
            <p>Add your first URL to get started</p>
          </motion.div>
        ) : (
          <div className="urls-grid">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="url-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {editingId === item.id ? (
                    <div className="edit-form">
                      <input
                        className="cyber-input"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Enter URL"
                      />
                      <div className="edit-actions">
                        <label className="cyber-checkbox">
                          <input 
                            type="checkbox" 
                            checked={editActive} 
                            onChange={(e) => setEditActive(e.target.checked)} 
                          />
                          <span>Active</span>
                        </label>
                        <div className="action-buttons">
                          <motion.button
                            className="cyber-button small-btn"
                            onClick={() => saveEdit(item.id)}
                            disabled={!isValidUrl(editUrl)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle size={14} />
                            <span>Save</span>
                          </motion.button>
                          <motion.button
                            className="cyber-button small-btn secondary"
                            onClick={cancelEdit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <XCircle size={14} />
                            <span>Cancel</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="url-content">
                        <div className="url-info">
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="url-link"
                          >
                            {item.url}
                            <ExternalLink size={14} />
                          </a>
                          <span className={`status-badge ${item.active ? 'active' : 'inactive'}`}>
                            {item.active ? (
                              <>
                                <Activity size={12} />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <Pause size={12} />
                                <span>Inactive</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="url-actions">
                        <motion.button
                          className="cyber-button small-btn"
                          onClick={() => beginEdit(item)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </motion.button>
                        <motion.button
                          className="cyber-button small-btn danger"
                          onClick={() => onDelete(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}


