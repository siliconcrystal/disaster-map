import { TaskFullDetailModal } from '@/components/task/TaskFullDetailModal';
import type { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Noto_Sans_Mono, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

// 主字體 Noto Sans TC
const notoSans = Noto_Sans_TC({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '700'], // 可選字重
});

// 等寬字體 Noto Mono
const notoMono = Noto_Sans_Mono({
  variable: '--font-noto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Disaster Relief Map',
  description: 'A modern disaster relief map and task coordination system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoMono.variable} antialiased`}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <TaskFullDetailModal />
        </NextThemesProvider>
      </body>
    </html>
  );
}
