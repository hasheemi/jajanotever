import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    // Update session
    const response = await updateSession(request)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // Protect dashboard and register routes
    if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is logged in but trying to access login/landing, 
    // we might want to redirect to dashboard eventually, 
    // but let's stick to the requirements first.

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
