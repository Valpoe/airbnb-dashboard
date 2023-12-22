import LoginForm from './components/loginForm';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Card } from "@tremor/react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="flex items-center justify-center md:h-screen">
      <Card className="max-w-xs mx-auto" decoration='top' decorationColor='blue'>
            <LoginForm />
      </Card>
        </main>
  );
}

