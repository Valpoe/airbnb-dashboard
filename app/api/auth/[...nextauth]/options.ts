import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { User } from '../../../lib/definitions'
import { sql } from '@vercel/postgres'
import bcrypt from 'bcrypt'
import { z } from 'zod'

async function getUser(email: string): Promise<User | undefined> {
    try {
        const userQuery = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        const user = userQuery.rows[0];
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const options: NextAuthConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Email:",
                    type: "email",
                    placeholder: "your-cool-username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const user = await getUser(username);

                    if (user) {
                        const passwordsMatch = await bcrypt.compare(password, user.password);

                        if (passwordsMatch) {
                            return Promise.resolve(user);
                        }
                        console.log('User logged in successfully.')
                    }
                }
                throw new Error('Invalid credentials.');
            }
        })
    ],
}