import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'USEE AI — Marketing Automation Specialist',
  description: 'AI-powered marketing automation dashboard for X (Twitter) content generation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
