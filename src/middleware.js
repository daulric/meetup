// middleware.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings', "/home"]; // Require Auth
const authRoutes = ['/auth/login', '/auth/signup', '/']; //Doesnt Require Auth

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = await createClient(req);

  const { data: { user } } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  if (user && authRoutes.some(route => route === path)) {
    const url = new URL("/home", req.url);
    return NextResponse.redirect(url);
  }

  if (!user && protectedRoutes.some(route => route === path)) {
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