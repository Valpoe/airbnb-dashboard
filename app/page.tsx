import { sql } from '@vercel/postgres';
import { Card, Title, Text } from '@tremor/react';
import Search from './search';
import UsersTable from './table';
import { User } from './lib/definitions';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {

  const search = searchParams.q || '';  // Use an empty string if searchParams.q is falsy
  let result;

  if (search.trim() === '') {
    // If search term is empty, select all users
    result = await sql`
      SELECT id, name, username, email 
      FROM users;
    `;
  } else {
    // If search term is not empty, use ILIKE to filter by name
    result = await sql`
      SELECT id, name, username, email 
      FROM users 
      WHERE name ILIKE ${'%' + search + '%'};
    `;
  }

  console.log("Result: ", result);
  const users = result.rows as User[];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A list of users retrieved from a Postgres database.</Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </main>
  );
}

