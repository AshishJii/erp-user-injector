'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User, TokenInfo, LoginResponse, TokenRequestBody, LoginRequestBody, ERPLoginProps } from '@/lib/types';

export default function ERPLogin({ handleProxyToken }: ERPLoginProps) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  // const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // TODO: change to http cookie
    // TODO: seperate proxy server token and actual token
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
    await callServer('/api/erp/auth/token', {token});
  };

  const handleLogin = async () => {
    await callServer('/api/erp/auth/login', credentials);
  };

  const callServer = async (url: string, body: TokenRequestBody | LoginRequestBody) => {
    setIsLoading(true);
    setProgress(10);
    setMessage(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 300);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: LoginResponse = await res.json();

      if (data.status === 'success' && data.data?.token && data.data?.user) {
        const newTokenInfo: TokenInfo = { username: credentials.username, token: data.data.token };
        const existingIndex = tokens.findIndex(t => t.username === credentials.username);
        let updatedTokens;
        if (existingIndex !== -1) {
          // Username exists, replace token
          updatedTokens = [...tokens];
          updatedTokens[existingIndex] = newTokenInfo;
        } else {
          // Username doesn't exist, append new
          updatedTokens = [...tokens, newTokenInfo];
        }
        setTokens(updatedTokens);
        localStorage.setItem('erpTokens', JSON.stringify(updatedTokens));

        setUser(data.data.user);
        // setSelectedToken(data.data.token);
        handleProxyToken(data.data.token); // passed up
        setMessage('Login successful');
      } else if (data.status === 'error'){
        setMessage(data.msg || 'Login failed');
        setUser(null); // Clear user if login failed
      } else {
        // Fallback for edge cases (e.g., unexpected structure)
        setMessage('Invalid response');
        setUser(null);
      }      
    } catch (err) {
      console.error(err);
      setMessage('Error logging in');
      setUser(null); // Clear user if error occurs
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setShowDialog(false);
      }, 300);
    }
  }

  const deleteToken = (tokenToDelete: string) => {
    const updated = tokens.filter(({ token }) => token !== tokenToDelete);
    setTokens(updated);
    localStorage.setItem('erpTokens', JSON.stringify(updated));
    /* if (selectedToken === tokenToDelete) {
      setUser(null);
      setSelectedToken(null);
    } */
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <Button onClick={(e) => {e.preventDefault(); setShowDialog(true)}} className="h-12 px-6 text-lg">
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

            {isLoading && (
              <Progress
              value={progress}
              className="h-2 mt-2 rounded-full bg-muted overflow-hidden 
                        transition-all duration-100 ease-in-out"
            />
            )}
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
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Roll No:</strong> {user.roll}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>Section:</strong> {user.section}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Library Code:</strong> {user.libraryCode}</p>
          <p><strong>Mobile No:</strong> {user.mobile}</p>
          <p><strong>Birth Date:</strong> {user.birthDate}</p>
          <p><strong>Permanent Address:</strong> {user.permanentAddress}</p>
          <p><strong>Local Address:</strong> {user.localAddress}</p>

          {/* <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg shadow-inner">
          <p className="text-sm font-bold text-yellow-800 break-words">
            <strong className="uppercase tracking-wide">Token: </strong>
            <span className="font-mono">{selectedToken}</span>
          </p>
    </div> */}
        </div>
      )}
    </div>
  );
}
