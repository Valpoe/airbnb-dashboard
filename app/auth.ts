// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import bcrypt from 'bcrypt';
// import type { User } from './lib/definitions';

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const userQuery = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//     const user = userQuery.rows[0];
//     return user;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
 
// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(Credentials) {
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(Credentials);
      
//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           const user = await getUser(email);
      
//           if (user) {
//             const passwordsMatch = await bcrypt.compare(password, user.password);
      
//             if (passwordsMatch) {
//               return Promise.resolve(user);
//             }
//             console.log('User logged in successfully.')
//           }
//         }     
//         throw new Error('Invalid credentials.');
//         },
//       }),
//     ],
//   });