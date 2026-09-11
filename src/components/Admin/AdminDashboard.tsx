import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminDesigns } from './AdminDesigns';
import { AdminInventory } from './AdminInventory';
import { AdminSettings } from './AdminSettings';
import { 
  Package, 
  ShoppingBag, 
  Boxes, 
  DollarSign, 
  Printer, 
  Sparkles, 
  AlertTriangle, 
  Settings, 
  BarChart3,
  Flame,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Palette
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, designTemplates, inventory, settings, setActiveView, adminTab, setAdminTab } = useStore();

  // Key Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeInProduction = orders.filter(o => ['recibido', 'arte_aprobacion', 'sublimando', 'control_calidad'].includes(o.status)).length;
  const criticalStockCount = inventory.filter(i => i.currentStock <= i.minStockAlert).length;
  const deliveredCount = orders.filter(o => o.status === 'entregado').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Taller & Control de Producción
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Gestión centralizada de pedidos en plancha térmica, inventario de insumos y catálogo.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('catalog')}
              className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Ver Tienda Pública
            </button>
            <button
              onClick={() => {
                const prompt = window.prompt("Nueva Orden Rápida: Ingresa nombre del cliente");
                if (prompt) alert(`Iniciando orden manual para ${prompt}`);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Nuevo Pedido</span>
            </button>
          </div>
        </div>

        {/* 4 Sleek Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventas Acumuladas</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {settings.currency}{totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {orders.length} pedidos registrados
            </span>
          </div>

          {/* Active Production Queue */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cola en Plancha</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Printer className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600 tracking-tight">
              {activeInProduction} órdenes
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              En proceso de arte y prensado
            </span>
          </div>

          {/* Inventory Health */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Almacén de Insumos</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                criticalStockCount > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalStockPieces} <span className="text-xs font-normal text-slate-400">unidades</span>
            </div>
            <span className={`text-[11px] font-bold ${criticalStockCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
              {criticalStockCount > 0 ? `⚠️ ${criticalStockCount} insumos en nivel bajo` : 'Stock en niveles óptimos'}
            </span>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entregas Exitosas</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 tracking-tight">
              {deliveredCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {products.length} productos en catálogo
            </span>
          </div>

        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Bar */}
          <div className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                Panel de Control
              </div>

              <div className="space-y-1">
                {[
                  { id: 'orders', label: 'Órdenes Activas', icon: Package, count: orders.length },
                  { id: 'products', label: 'Catálogo General', icon: ShoppingBag, count: products.length },
                  { id: 'designs', label: 'Galería & Diseños', icon: Palette, count: designTemplates.length },
                  { id: 'inventory', label: 'Gestión Inventario', icon: Boxes, count: inventory.length, alert: criticalStockCount > 0 },
                  { id: 'settings', label: 'Configuración Taller', icon: Settings }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminTab(tab.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      {tab.alert && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 min-w-0">
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'designs' && <AdminDesigns />}
            {adminTab === 'inventory' && <AdminInventory />}
            {adminTab === 'settings' && <AdminSettings />}
          </div>
        </div>

      </div>
    </div>
  );
};
