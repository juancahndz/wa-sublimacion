import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ArrowLeft,
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
  Edit3,
  Mail,
  Eye,
  EyeOff,
  KeyRound
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
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setActiveView('admin');
      setMobileMenuOpen(false);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmail = (settings.adminEmail || 'admin@wasublimacion.com').trim().toLowerCase();
    const validPassword = (settings.adminPassword || 'admin1234').trim();
    const inputEmail = emailInput.trim().toLowerCase();
    const inputPassword = passwordInput.trim();

    const isEmailMatch = inputEmail === validEmail;
    const isPasswordMatch = inputPassword === validPassword;

    if (isEmailMatch && isPasswordMatch) {
      setIsAdminLoggedIn(true);
      setIsAdminAuthModalOpen(false);
      setEmailInput('');
      setPasswordInput('');
      setAuthError('');
      setActiveView('admin');
      setMobileMenuOpen(false);
      showToast("Acceso concedido como Administrador.", 'success');
    } else {
      setAuthError('Correo o contraseña incorrectos.');
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
    <>
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
          
          {/* Brand Logo & Back Button */}
          <div className="flex items-center gap-2">
            {activeView !== 'catalog' && (
              <button
                onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer shadow-2xs group shrink-0"
                title="Regresar al Catálogo Principal"
                id="navbar-back-btn"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-indigo-600" />
                <span className="hidden sm:inline">Atrás</span>
              </button>
            )}

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
            {isAdminLoggedIn ? (
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
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Cerrar sesión de Administrador"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAdminAuthModalOpen(true)}
                id="nav-login-admin-btn"
                className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Acceso de Administrador"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Admin</span>
              </button>
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
          {isAdminLoggedIn ? (
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
          ) : (
            <button
              onClick={() => { setIsAdminAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium flex items-center gap-3"
            >
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>Acceso Administrador</span>
            </button>
          )}
        </div>
      )}
    </header>

    {/* Admin Quick Login Modal - Perfectly centered on screen, never cut off */}
    {isAdminAuthModalOpen && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-auto max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => { setIsAdminAuthModalOpen(false); setAuthError(''); }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Acceso de Administrador</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tus credenciales para gestionar productos, pedidos e inventario.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setAuthError(''); }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password input with toggle */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
                {authError}
              </div>
            )}

            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => { setIsAdminAuthModalOpen(false); setAuthError(''); }}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  );
};
