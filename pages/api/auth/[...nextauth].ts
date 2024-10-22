import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/auth'; // Update this path
import { getUserByEmail } from '@/lib/db/queries'; // Update this path

// If type declarations are not available, create a custom declaration file
// Create a file named `next-auth.d.ts` in your project (e.g., in a `@types` folder)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error('User not found');
        }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
