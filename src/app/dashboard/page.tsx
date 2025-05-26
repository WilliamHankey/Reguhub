'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTour } from '@reactour/tour';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useOrganization } from '@/lib/organization';

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

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { organization } = useOrganization();
  const [isTourOpen, setIsTourOpen] = useState(false);

  const { setIsOpen } = useTour();

  useEffect(() => {
    // Check if it's the user's first visit
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      setIsTourOpen(true);
      setIsOpen(true);
      localStorage.setItem('hasSeenDashboardTour', 'true');
    }
  }, [setIsOpen]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div data-tour="welcome" className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card data-tour="organization-info">
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Organization: {organization?.name || 'Not set'}</p>
            <p>Role: {organization?.role || 'Member'}</p>
          </CardContent>
        </Card>

        <Card data-tour="quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button onClick={() => router.push('/safety-index')}>
                Go to Safety Index
              </Button>
              <Button variant="outline" onClick={() => router.push('/reports')}>
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card data-tour="recent-activity">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No recent activity</p>
          </CardContent>
        </Card>
      </div>

      <Button
        className="mt-6"
        variant="outline"
        onClick={() => {
          setIsTourOpen(true);
          setIsOpen(true);
        }}
      >
        Start Tour
      </Button>
    </div>
  );
} 