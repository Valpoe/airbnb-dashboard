// // auth.config.ts
// import type { NextAuthConfig } from 'next-auth';

// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnLoginPage = nextUrl.pathname === '/login';
//       if (isOnLoginPage) {
//         return true;
//       } else if (isLoggedIn) {
//         return true;
//       }
//       return false;
//     },
//   },
  

//   providers: [],
// };
