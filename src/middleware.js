// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';


const protectedRoutes = ['/dashboard', '/profile', '/settings', "/home"]; // Require Auth
const authRoutes = ['/auth/login', '/auth/signup', "/"]; //Doesnt Require Auth

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  if (session && authRoutes.some(route => route === path)) {
    const url = new URL("/home", req.url);
    return NextResponse.redirect(url);
  }

  if (!session && protectedRoutes.some(route => route === path)) {
    const url = new URL("/auth/login", req.url);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
    matcher: [
      // Protected routes
      '/home',
      '/',
      // Auth routes
      '/auth/:path*',
    ],
};