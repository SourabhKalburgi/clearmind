import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/decision")

    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", req.url)
        return Response.redirect(loginUrl)
    }
})

export const config = {
    matcher: ["/dashboard/:path*", "/decision/:path*"],
    runtime: 'nodejs',
}
