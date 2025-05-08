import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function createClient(req?: NextRequest) {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {

          if (req) {
            const cookieHeader = req.headers.get('cookie') || ''
            return cookieHeader
              .split(';')
              .map(cookie => cookie.trim())
              .filter(Boolean)
              .map(cookie => {
                const [name, ...rest] = cookie.split('=')
                const value = rest.join('=')
                return { name, value }
              })
          }

          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            
          }
        },
      },
    }
  )
}
