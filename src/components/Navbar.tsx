import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Palette, 
  Search, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  Lock, 
  Store, 
  Layers, 
  LogOut,
  Layers3,
  Edit3
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartCount, 
    setIsCartOpen, 
    settings, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn,
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    setAdminTab,
    lowStockItemsCount,
    showToast
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setActiveView('admin');
      setMobileMenuOpen(false);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsAdminLoggedIn(true);
      setIsAdminAuthModalOpen(false);
      setPinInput('');
      setAuthError('');
      setActiveView('admin');
      setMobileMenuOpen(false);
      showToast("Acceso concedido como Administrador.", 'success');
    } else {
      setAuthError('PIN incorrecto. El PIN por defecto es 1234.');
    }
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    if (!isAdminLoggedIn) {
      e.preventDefault();
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setActiveView('catalog');
    showToast("Sesión de administrador cerrada.", 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      {settings.bannerAnnouncement && (
        <div className="bg-slate-900 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-slate-200">{settings.bannerAnnouncement}</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onDoubleClick={handleLogoDoubleClick}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
              id="brand-logo-btn"
              title={isAdminLoggedIn ? "Ir al Catálogo (Admin activo)" : "Doble clic para acceso admin"}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0">
                <img 
                  src={settings.logoUrl || '/logo.png'} 
                  alt={settings.storeName} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                {settings.storeName.startsWith('WA ') ? (
                  <span className="text-lg font-black tracking-tight block leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-pink-500 bg-clip-text text-transparent font-black drop-shadow-xs">W</span>
                    <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 bg-clip-text text-transparent font-black drop-shadow-xs">A</span>
                    {" "}
                    <span className="bg-gradient-to-r from-cyan-500 via-fuchsia-500 via-purple-600 to-amber-500 bg-clip-text text-transparent font-extrabold">
                      {settings.storeName.substring(3)}
                    </span>
                  </span>
                ) : (
                  <span className="text-lg font-black tracking-tight block leading-tight bg-gradient-to-r from-cyan-500 via-pink-500 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                    {settings.storeName}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-slate-500 block leading-none tracking-wide">
                  {settings.slogan}
                </span>
              </div>
            </button>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setActiveView('admin');
                  setAdminTab('settings');
                }}
                className="hidden md:flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                title="Cambiar Logo de la Tienda"
              >
                <Edit3 className="w-3 h-3" />
                <span>Cambiar Logo</span>
              </button>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveView('catalog')}
              id="nav-catalog-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Catálogo General
            </button>

            <button
              onClick={() => setActiveView('designs')}
              id="nav-designs-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'designs'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Galería de Diseños
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Admin Portal Button - Only visible when logged in */}
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={handleAdminClick}
                  id="nav-admin-portal-btn"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeView === 'admin'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  }`}
                  title="Panel de Administración e Inventario"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                    AD
                  </div>
                  <span className="hidden sm:inline">Panel Admin</span>
                  {lowStockItemsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Alertas de inventario" />
                  )}
                </button>

                <button
                  onClick={handleLogoutAdmin}
                  id="nav-logout-btn"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Cerrar sesión de Administrador"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="open-cart-btn"
              className="relative p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg border border-slate-200/80 transition-all flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => { setActiveView('catalog'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-3"
          >
            <Store className="w-5 h-5 text-indigo-600" />
            Catálogo de Productos
          </button>
          <button
            onClick={() => { setActiveView('designs'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-3"
          >
            <Palette className="w-5 h-5 text-purple-600" />
            Galería de Diseños
          </button>
          {isAdminLoggedIn && (
            <button
              onClick={() => { handleAdminClick(); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Panel de Administración</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">Activo</span>
            </button>
          )}
        </div>
      )}

      {/* Admin Quick PIN Modal */}
      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => { setIsAdminAuthModalOpen(false); setAuthError(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Acceso Administrador</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa el PIN de seguridad para gestionar productos, pedidos e inventario.
              </p>
              <div className="mt-2 inline-block bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-md font-mono">
                PIN de demostración: <strong>1234</strong>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN de 4 dígitos"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setAuthError(''); }}
                  className="w-full text-center tracking-widest text-2xl font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-rose-500 font-medium text-center mt-1.5">
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAdminAuthModalOpen(false); setAuthError(''); }}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
