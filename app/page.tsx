import LoginForm from './components/loginForm';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Card } from "@tremor/react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="p-4 md:p-10 flex items-center">
      <Card className="max-w-xs mx-auto" decoration='top' decorationColor='blue'>
            <LoginForm />
      </Card>
        </main>
  );
}

