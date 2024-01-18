import NextAuth from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import axios from "axios";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";


const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProviders({
      name: "Credentials",
      credentials: {
        username: { type: "text", placeholder: "Enter your username" },
        password: { type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        console.log("Authorize callback");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          credentials.password,
          saltRounds
        );

        const jwtToken = sign({ username: credentials.username }, process.env.JWT_SECRET, {
          expiresIn: "3m",
        });

        try {
          const response = await axios.post("http://192.168.2.45:3000/login/", {
            jwtToken,
            ...credentials,
            password : hashedPassword
          });

          console.log("API Response:", response.data);

          
          if(response.status == 201){
              const user = {
                token: response.data.data,
                username: credentials.username,
              };
              return user;
          }else{
            const user = {
                username : 'custom user'
            };
            return user;
          }

        } catch (error) {
          console.error('Error during API call:', error?.response?.data?.error);
          throw new Error('Error during API call');
        }
    },
}),
],
callbacks: {
    async jwt(token, user) {
        if (user) {
        token.user = user;
        // Add other user-related fields as needed
      }
      return token;
    },
    async session(session, token) {
      // console.log(session , 'next one is token' , token , 'next one is user ');
      // session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
