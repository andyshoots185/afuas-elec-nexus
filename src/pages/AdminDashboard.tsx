import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { SalesManagement } from '@/components/admin/SalesManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { ReviewSection } from '@/components/product/ReviewSection';
import Messages from '@/pages/Messages';
import { Loader2 } from 'lucide-react';
import { NotificationBadge } from '@/components/admin/NotificationBadge';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="border-b bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div className="lg:ml-0 ml-12">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <NotificationBadge />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="sales" element={<SalesManagement />} />
            <Route path="customers" element={<UserManagement />} />
            <Route path="reviews" element={<ReviewSection productId="" />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}