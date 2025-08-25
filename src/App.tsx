import React from 'react';
import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
	const [authed, setAuthed] = useState(!!localStorage.getItem('token'));

	function handleLogout() {
		localStorage.removeItem('token');
		setAuthed(false);
	}

	return (
		<div style={{ padding: 12 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h1>Clickbait Dashboard</h1>
				{authed && (
					<button onClick={handleLogout}>Logout</button>
				)}
			</div>
			{authed ? (
				<Dashboard />
			) : (
				<Login onSuccess={() => setAuthed(true)} />
			)}
		</div>
	);
}


