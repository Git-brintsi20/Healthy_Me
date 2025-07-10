import { Metadata } from 'next'
import { AdminGuard } from '@/components/auth/admin-guard'
import { AdminSidebar } from '@/components/layout/admin-sidebar'

export const metadata: Metadata = {
  title: 'Admin Panel - HealthyME',
  description: 'Administrative dashboard for HealthyME',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}