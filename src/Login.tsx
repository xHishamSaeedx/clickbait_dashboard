import React, { useState } from 'react';
import { login } from './api';

type Props = { onLoggedIn?: () => void; onSuccess?: () => void };

export default function Login({ onLoggedIn, onSuccess }: Props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		<div style={{ maxWidth: 360, margin: '40px auto' }}>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 8 }}>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						style={{ width: '100%' }}
						required
					/>
				</div>
				<div style={{ marginBottom: 8 }}>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={{ width: '100%' }}
						required
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Logging in…' : 'Login'}
				</button>
				{error && (
					<p style={{ color: 'red' }}>{error}</p>
				)}
			</form>
		</div>
	);
}


