import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Layers3, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Heart,
  Truck,
  RotateCcw,
  Printer,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveView, setSelectedCategory, isAdminLoggedIn, setIsAdminAuthModalOpen } = useStore();

  const handleWhatsAppClick = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`¡Hola ${settings.storeName}! Me gustaría hacer una consulta sobre un pedido de sublimación.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveView('catalog');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions / Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-lg border border-slate-700">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Sublimación Ultra HD</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fijación molecular indeleble de alta durabilidad.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-lg border border-slate-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Personalización Total</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sube tus fotos, logos o diseños de autor en vivo.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 bg-slate-800 text-amber-400 rounded-lg border border-slate-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Garantía de Calidad</h4>
              <p className="text-xs text-slate-400 mt-0.5">Empaque reforzado antigolpes en todo envío.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <img 
                  src={settings.logoUrl || '/logo.png'} 
                  alt={settings.storeName} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                {settings.storeName.startsWith('WA ') ? (
                  <span className="text-base font-black tracking-tight block leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-pink-500 bg-clip-text text-transparent font-black">W</span>
                    <span className="bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 bg-clip-text text-transparent font-black">A</span>
                    {" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent font-extrabold">
                      {settings.storeName.substring(3)}
                    </span>
                  </span>
                ) : (
                  <span className="text-base font-black bg-gradient-to-r from-cyan-400 via-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
                    {settings.storeName}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-medium block">
                  {settings.slogan}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Especialistas en estampados por sublimación industrial y artesanal. Creamos productos personalizados únicos para personas y empresas.
            </p>
            <div className="pt-1">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Atención por WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Navegación</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400 hover:underline"
                >
                  Catálogo de Productos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveView('designs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400 hover:underline"
                >
                  Galería de Plantillas & Diseños
                </button>
              </li>
            </ul>
          </div>

          {/* Sublimation Categories */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Líneas de Sublimación</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {(settings.customCategories || [])
                .filter(cat => cat.id !== 'all')
                .map(cat => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className="hover:text-white transition-colors cursor-pointer text-left text-slate-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>{cat.label}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Contacto</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lun - Sáb: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Diseñado para sublimación</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>

            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setActiveView('admin');
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              id="footer-admin-access-btn"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Acceso exclusivo para el administrador"
            >
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>{isAdminLoggedIn ? '👑 Panel Admin' : '🔒 Administrar Tienda'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
