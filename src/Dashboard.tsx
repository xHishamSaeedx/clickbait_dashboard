import React, { useEffect, useState } from 'react';
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

	return (
		<div style={{ maxWidth: 720, margin: '20px auto' }}>
			<h2>Dashboard</h2>
			<form onSubmit={onAdd} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
				<input
					value={formUrl}
					onChange={(e) => setFormUrl(e.target.value)}
					placeholder="https://example.com"
					style={{ flex: 1 }}
				/>
				<label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
					<span>active</span>
				</label>
				<button type="submit" disabled={loading || !isValidUrl(formUrl)}>Add</button>
				<button type="button" onClick={onTestRandom}>Test Random</button>
			</form>
			{testResult && (
				<div style={{ marginBottom: 12 }}>
					<strong>Random URL:</strong> {testResult}
				</div>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{loading ? (
				<p>Loading…</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{items.map((item) => (
						<li key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
							{editingId === item.id ? (
								<>
									<input
										style={{ flex: 1 }}
										value={editUrl}
										onChange={(e) => setEditUrl(e.target.value)}
									/>
									<label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
										<input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
										<span>active</span>
									</label>
									<button onClick={() => saveEdit(item.id)} disabled={!isValidUrl(editUrl)}>Save</button>
									<button onClick={cancelEdit}>Cancel</button>
								</>
							) : (
								<>
									<span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.url}>{item.url}</span>
									<span>{item.active ? 'active' : 'inactive'}</span>
									<button onClick={() => beginEdit(item)}>Edit</button>
									<button onClick={() => onDelete(item.id)}>Delete</button>
								</>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


