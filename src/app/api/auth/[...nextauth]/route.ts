import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import axiosClient from "@/common/util/api/axios-client";
import { LOG_IN_URL } from "@/common/constant/server.constant";
// Define your authentication options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { username, password } = credentials;
          const simplifiedCredentials = { email: username, password };
          // Send simplified credentials to the API
          const apiResponse = await axiosClient.post(LOG_IN_URL, JSON.stringify(simplifiedCredentials));
          const sessionInfo = JSON.stringify(apiResponse?.data);
          const { statusCode } = apiResponse?.data || "";
          cookies().set({
            name: "session-info",
            value: sessionInfo,
            secure: true,
          });

          if (statusCode === 200) {
            return apiResponse.data;
          } else {
            return apiResponse.data;
          }
        } catch (error) {
          cookies().set({
            name: "session-info",
            value: JSON.stringify(error),
            secure: true,
          });
          return error;
        }
      },
    }),
  ],
  callbacks: {
    async session(data) {
      const sessionInfo = cookies().get("session-info");
      return { session: { ...data.session, user: JSON.parse(sessionInfo?.value).data } };
    },
    async signIn({ user }) {
      if (user?.statusCode == 200) {
        return true;
      }
      return false;
    },

    async jwt(data) {
      return data.token;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

// Initialize NextAuth with the provided options
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
