import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod"; // Optional if using zod for validation
// import { signInSchema } from "@/lib/zod"; // Define this later if needed

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                console.log("Authorize called with:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                try {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });
                    console.log("User found:", user ? user.email : "null");

                    if (!user || !user.passwordHash) {
                        console.log("User not found or no password hash");
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    console.log("Password match:", passwordsMatch);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT Callback:", { token: !!token, user: !!user });
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session Callback:", { session: !!session, token: !!token });
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
});
