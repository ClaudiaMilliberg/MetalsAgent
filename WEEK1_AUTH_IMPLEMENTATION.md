# Week 1: Authentication Implementation Guide

**Timeline:** 4-6 hours  
**Deliverable:** Users can signup/login and see dashboard  
**Deploy:** End of week to Vercel

---

## 📋 Overview

Week 1 focuses on building authentication and the dashboard foundation. By end of week, users will be able to:
1. Create accounts (signup)
2. Login with email/password
3. See an empty dashboard
4. Subscribe to Pro/Enterprise

---

## 🎯 Tasks (In Order)

### Task 1: Create Auth Types (30 min)

**File:** `frontend/lib/types.ts`

Update to include:

```typescript
// Auth types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Session type
export interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}
```

**Checklist:**
- [ ] Types added to `types.ts`
- [ ] Exports checked
- [ ] No `any` types used

---

### Task 2: Create Auth Utilities (30 min)

**File:** `frontend/lib/auth.ts` (NEW)

```typescript
import { supabase } from './supabase';

// Sign up new user
export async function signupUser(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// Sign in existing user
export async function loginUser(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
```

**Checklist:**
- [ ] File created: `frontend/lib/auth.ts`
- [ ] All functions added
- [ ] Error handling in place
- [ ] Supabase integration works

---

### Task 3: Implement Signup API (2 hours)

**File:** `frontend/app/api/auth/signup/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user profile in database
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          tier: 'free',
        },
      ]);

    if (dbError) {
      // Clean up: delete auth user if DB insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Checklist:**
- [ ] File created: `frontend/app/api/auth/signup/route.ts`
- [ ] Input validation works
- [ ] User created in Supabase Auth
- [ ] User profile created in database
- [ ] Error handling complete
- [ ] Tested with curl:
  ```bash
  curl -X POST http://localhost:3000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```

---

### Task 4: Implement Login API (2 hours)

**File:** `frontend/app/api/auth/login/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last_login timestamp
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    if (updateError) {
      console.warn('Failed to update last_login:', updateError);
    }

    // Get user subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        subscription: subscription || null,
      },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Checklist:**
- [ ] File created: `frontend/app/api/auth/login/route.ts`
- [ ] Input validation works
- [ ] Authentication works
- [ ] Last login timestamp updated
- [ ] Subscription status returned
- [ ] Error handling complete
- [ ] Tested with curl

---

### Task 5: Create Dashboard Page (1 hour)

**File:** `frontend/app/dashboard/page.tsx` (NEW)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/');
        } else {
          setUser(currentUser as unknown as User);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">CommodityBubbles</h1>
            <div className="text-right">
              <p className="text-slate-300">{user.email}</p>
              <button
                onClick={() => window.location.href = '/api/auth/logout'}
                className="text-sm text-blue-400 hover:text-blue-300 mt-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.email?.split('@')[0]}!
          </h2>
          <p className="text-slate-400">
            Real-time commodity signals from your AI trading bot
          </p>
        </div>

        {/* Placeholder: Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Signals</h3>
            <p className="text-4xl font-bold text-blue-400">0</p>
            <p className="text-slate-400 text-sm mt-2">Trading signals received</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Subscriptions</h3>
            <p className="text-xl text-slate-300">Free Tier</p>
            <p className="text-slate-400 text-sm mt-2">Upgrade to Pro for $1/month</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Commodities</h3>
            <p className="text-4xl font-bold text-amber-400">4</p>
            <p className="text-slate-400 text-sm mt-2">Cu, Ni, Zn, Au</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">🎯 Coming Soon</h3>
          <p className="text-slate-400">
            Bubble map visualization, real-time signals, and price charts coming this week
          </p>
        </div>
      </main>
    </div>
  );
}
```

**Checklist:**
- [ ] File created: `frontend/app/dashboard/page.tsx`
- [ ] Auth check implemented
- [ ] Layout styled
- [ ] User info displayed
- [ ] Responsive design works

---

### Task 6: Create Signup Form Component (1 hour)

**File:** `frontend/app/auth/signup/page.tsx` (NEW)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!email || !password || !confirmPassword) {
        throw new Error('All fields required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect to login
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join CommodityBubbles today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 rounded transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] File created: `frontend/app/auth/signup/page.tsx`
- [ ] Form validation works
- [ ] API integration works
- [ ] Error messages display
- [ ] Redirect to login on success

---

### Task 7: Create Login Form Component (1 hour)

**File:** `frontend/app/auth/login/page.tsx` (NEW)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Email and password required');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token (in real app, use httpOnly cookies)
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-slate-400">Welcome back to CommodityBubbles</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 rounded transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] File created: `frontend/app/auth/login/page.tsx`
- [ ] Form validation works
- [ ] API integration works
- [ ] Token storage works
- [ ] Redirect to dashboard on success

---

## 📈 Testing Checklist

### Manual Testing
- [ ] Can signup with new email
- [ ] Signup rejects weak passwords
- [ ] Signup rejects duplicate emails
- [ ] Can login with correct credentials
- [ ] Login rejects wrong password
- [ ] Can see dashboard after login
- [ ] Logout clears session
- [ ] Form validation works on all fields

### API Testing
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🎯 Completion Criteria

- [ ] Users can signup with email/password
- [ ] Users can login and receive auth tokens
- [ ] Dashboard page loads after login
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] All TypeScript types are strict
- [ ] No console errors or warnings
- [ ] Supabase integration working
- [ ] Ready to deploy to Vercel

---

## ⏱️ Time Breakdown

| Task | Time | Status |
|------|------|--------|
| 1. Auth types | 30 min | ⏳ |
| 2. Auth utilities | 30 min | ⏳ |
| 3. Signup API | 2 hours | ⏳ |
| 4. Login API | 2 hours | ⏳ |
| 5. Dashboard | 1 hour | ⏳ |
| 6. Signup form | 1 hour | ⏳ |
| 7. Login form | 1 hour | ⏳ |
| **Total** | **8 hours** | ⏳ |

**Note:** Can be done in 2-3 sessions (4-6 hours condensed if experienced)

---

## 🚀 Next Steps After Week 1

Once auth is working:
1. Deploy to Vercel
2. Test signup/login in production
3. Week 2: Add payment flow + subscription management
4. Week 3: Build bubble map visualization
5. Week 4: Add real-time signal streaming + bot integration

---

Let's build! 🎯
