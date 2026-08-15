import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/src/store/provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  // logo: ,
  title: 'LearnAI – AI-Powered Learning Platform',
  description: 'Search topics, take quizzes, build streaks and learn smarter with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
        <StoreProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontSize: '13px',
                borderRadius: '10px',
                padding: '10px 14px',
              },
              success: {
                iconTheme: { primary: '#7c3aed', secondary: '#fff' },
                style: {
                  background: '#f5f3ff',
                  color: '#4c1d95',
                  border: '1px solid #ddd6fe',
                },
              },
              error: {
                style: {
                  background: '#fff1f2',
                  color: '#881337',
                  border: '1px solid #fecdd3',
                },
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
