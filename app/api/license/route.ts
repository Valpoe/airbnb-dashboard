import { NextResponse } from 'next/server';

export async function GET() {
  const license = process.env.LC_KEY || '';

  return NextResponse.json({
    license,
    licenseInformation: {
      appTitle: 'Data Dashboard',
      company: 'Housti'
    }
  });
}
