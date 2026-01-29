// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    console.log(`Middleware processing: ${req.nextUrl.pathname}`);
    const cookies = req.cookies.getAll();
    console.log("Cookies:", cookies.map(c => c.name));

    const sessionToken =
        req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token") ||
        req.cookies.get("authjs.session-token"); // Check for authjs cookie too

    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isDecision = req.nextUrl.pathname.startsWith("/decision")

    if ((isDashboard || isDecision) && !sessionToken) {
        console.log("Redirecting to login (no session token)");
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/decision/:path*"],
}
