// import NextAuth from "next-auth"
// import CredentialProviders from "next-auth/providers/credentials";
// import axios from "axios";
// import { sign } from "jsonwebtoken";

// const authOptions = {
//     secret: process.env.AUTH_SECRET,
//     providers: [
//       CredentialProviders({
//         name: "Credentials",
//         credentials: {
//           username: {
//             label: "Username",
//             type: "text",
//             placeholder: "Enter your username",
//           },
//           password: {
//             label: "Password",
//             type: "password",
//             placeholder: "Enter your password",
//           },
//         },
//         async authorize(Credentials) {

//             const jwtToken = sign({user : Credentials.username}, process.env.JWT_SECRET, {
//                 expiresIn: "3m",
//               });

          
//             try {
//                 // Await the API call to complete
//                 const response = await axios.post("http://localhost:4000/login", {
//                   jwtToken,
//                   ...Credentials
//                 });
      
//                 console.log(response.data);
//                 return {
//                     token: response.data.token,
//                     username: response.data.csrftoken,
//                     // Add other fields as needed
//                   };              } catch (error) {
//                 console.error('Error during API call:', error?.response.data.error);
//                 throw new Error('Error during API call');
//               }
//         },
//         session : {
//             jwt : true
//         },
//         callbacks: {
//             async session(session , user) {
//                 // Add the entire response.data to the session
//                 session.user = user;
//                 console.log("Session updated with responseData:", session);
//               return session;
//             },
//           },
//       }),
//     ],

//   };
  

// const handler=NextAuth(authOptions);
// export {handler as GET,handler as POST}

import NextAuth from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import axios from "axios";
import { sign } from "jsonwebtoken";

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

        const jwtToken = sign({ user: credentials.username }, process.env.JWT_SECRET, {
          expiresIn: "3m",
        });

        try {
          const response = await axios.post("http://localhost:4000/login", {
            jwtToken,
            ...credentials,
          });

          console.log("API Response:", response.data);

          
          if(response.status == 200){
              const user = {
                token: response.data.token,
                username: response.data.csrfToken,
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
