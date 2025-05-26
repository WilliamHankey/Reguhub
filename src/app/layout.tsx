'use client';

import { Inter } from 'next/font/google';
import { TourProvider } from '@reactour/tour';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { OrganizationProvider } from '@/lib/organization';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const tourSteps = [
  {
    selector: '[data-tour="welcome"]',
    content: 'Welcome to your Dashboard! Here you can manage your organization and access key features.',
  },
  {
    selector: '[data-tour="organization-info"]',
    content: 'View and manage your organization details here.',
  },
  {
    selector: '[data-tour="quick-actions"]',
    content: 'Quick access to common actions like creating new folders or viewing reports.',
  },
  {
    selector: '[data-tour="recent-activity"]',
    content: 'Stay updated with recent activities in your organization.',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OrganizationProvider>
            <TourProvider
              steps={tourSteps}
              styles={{
                popover: (base: Record<string, any>) => ({
                  ...base,
                  borderRadius: '8px',
                  padding: '20px',
                }),
              }}
            >
              {children}
            </TourProvider>
            <Toaster />
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 