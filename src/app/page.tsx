'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User, TokenInfo, LoginResponse } from '@/lib/types';

export default function ERPLogin() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('erpTokens');
    if (stored) {
      try {
        setTokens(JSON.parse(stored) as TokenInfo[]);
      } catch {
        console.warn('Invalid erpTokens data in localStorage');
      }
    }
  }, []);

  const handleTokenClick = async (token: string) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/erp/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data: LoginResponse = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setSelectedToken(token);
        setMessage('Session loaded successfully');
      } else {
        setMessage(data.error || 'Invalid token or expired session');
        setUser(null); // Clear user if login failed
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch session details');
      setUser(null); // Clear user if error occurs
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/erp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await res.json();

      if (data.success && data.token && data.user) {
        const newTokenInfo: TokenInfo = { username: credentials.username, token: data.token };
        const updatedTokens = [...tokens, newTokenInfo];
        setTokens(updatedTokens);
        localStorage.setItem('erpTokens', JSON.stringify(updatedTokens));

        setUser(data.user);
        setSelectedToken(data.token);
        setMessage('Login successful');
      } else {
        setMessage(data.error || 'Login failed');
        setUser(null); // Clear user if login failed
      }
    } catch (err) {
      console.error(err);
      setMessage('Error logging in');
      setUser(null); // Clear user if error occurs
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  const deleteToken = (tokenToDelete: string) => {
    const updated = tokens.filter(({ token }) => token !== tokenToDelete);
    setTokens(updated);
    localStorage.setItem('erpTokens', JSON.stringify(updated));
    if (selectedToken === tokenToDelete) {
      setUser(null);
      setSelectedToken(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Button onClick={() => setShowDialog(true)} className="h-12 px-6 text-lg">
        Login with ERP
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ERP Login</DialogTitle>
            <DialogDescription>
              {tokens.length > 0
                ? 'Select an existing session or use new credentials.'
                : 'Enter your ERP credentials'}
            </DialogDescription>
          </DialogHeader>

          {tokens.length > 0 && (
            <div className="space-y-2 mb-4">
              {tokens.map(({ username, token }) => (
                <div key={token} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                    onClick={() => handleTokenClick(token)}
                  >
                    {username}
                  </Button>
                  <button
                    onClick={() => deleteToken(token)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete token"
                    aria-label="Delete token"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <Button onClick={handleLogin} disabled={isLoading} className="w-full">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {message && (
        <div className="mt-4 text-center text-lg font-semibold">
          <p
            className={
              message.startsWith('Login successful') ||
              message.startsWith('Session loaded')
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {message}
          </p>
        </div>
      )}

      {user && (
        <div className="mt-6 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Roll No:</strong> {user.roll}
          </p>
          <p>
            <strong>Branch:</strong> {user.branch}
          </p>
          <p>
            <strong>Section:</strong> {user.section}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
