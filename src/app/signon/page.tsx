'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type User = {
  name: string;
  roll: string;
  branch: string;
  section: string;
  email: string;
};

type TokenInfo = {
  username: string;
  token: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
};

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
        setShowDialog(false);
        setMessage('Session loaded successfully');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch session details');
    } finally {
      setIsLoading(false);
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
        setShowDialog(false);
        setMessage('Login successful');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowDialog(true)}>Login with ERP</Button>

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
              {tokens.map(({ username, token }, idx) => (
                <Button
                  key={token}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleTokenClick(token)}
                >
                  {username}
                </Button>
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
          <p className={message.startsWith('Login successful') || message.startsWith('Session loaded')
            ? 'text-green-500'
            : 'text-red-500'}>
            {message}
          </p>
        </div>
      )}

      {user && (
        <div className="mt-6 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Roll No:</strong> {user.roll}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>Section:</strong> {user.section}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}
