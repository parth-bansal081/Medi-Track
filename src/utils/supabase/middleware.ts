import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // --- Role-Based Redirection Logic ---
  const path = request.nextUrl.pathname

  if (user) {
    // If logged in, fetch role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Admin-Portal protection
    if (path.startsWith('/admin-portal') && path !== '/admin-portal/login') {
       if (role !== 'admin') {
         return NextResponse.redirect(new URL('/login', request.url))
       }
    }

    // Role-specific dashboard protection
    if (path.startsWith('/dashboard/patient') && role !== 'patient') {
        return NextResponse.redirect(new URL('/dashboard/' + role, request.url))
    }
    if (path.startsWith('/dashboard/doctor') && role !== 'doctor') {
        return NextResponse.redirect(new URL('/dashboard/' + role, request.url))
    }
    if (path.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/admin-portal/login', request.url))
    }
  } else {
    // Not logged in
    if (path.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (path.startsWith('/admin-portal') && path !== '/admin-portal/login') {
        return NextResponse.redirect(new URL('/admin-portal/login', request.url))
    }
  }

  return response
}
