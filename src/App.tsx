import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductGrid } from './components/Catalog/ProductGrid';
import { DesignGallery } from './components/Catalog/DesignGallery';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { CartDrawer } from './components/Cart/CartDrawer';
import { NotificationToast } from './components/UI/NotificationToast';

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <NotificationToast />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {(activeView === 'catalog' || activeView === 'customizer') && <ProductGrid />}
        {activeView === 'designs' && <DesignGallery />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
