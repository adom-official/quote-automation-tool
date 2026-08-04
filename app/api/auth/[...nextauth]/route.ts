import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Danh sách email được cấp phép truy cập hệ thống (Whitelist)
const ALLOWED_EMAILS = [
  "haivminh@gmail.com",
  "creative.adom@gmail.com",
  "admin@adom.com",
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_google_client_secret",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@adom.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@adom.com" && credentials?.password === "adom123") {
          return { id: "1", name: "Admin ADOM", email: "admin@adom.com", role: "admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const emailLower = user.email.toLowerCase().trim();
      const isAllowed = ALLOWED_EMAILS.includes(emailLower);
      if (!isAllowed) {
        // Chặn người dùng không có trong whitelist
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
});

export { handler as GET, handler as POST };
