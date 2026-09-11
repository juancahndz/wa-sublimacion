import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckoutModal } from './CheckoutModal';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Layers
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    settings,
    setActiveView 
  } = useStore();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Tu Carrito ({cart.length})
                </h2>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-3 bg-indigo-50/80 border-b border-indigo-100 text-xs">
              {remainingForFreeShipping > 0 ? (
                <p className="text-indigo-900 font-medium">
                  Agrega <strong>{settings.currency}{remainingForFreeShipping.toFixed(2)}</strong> más para obtener <strong>¡Envío Gratis!</strong>
                </p>
              ) : (
                <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> ¡Felicidades! Tienes Envío Gratis desbloqueado.
                </p>
              )}
              <div className="w-full h-1.5 bg-indigo-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                      <img 
                        src={item.customDesign?.uploadedImageUrl || item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {item.customDesign?.selectedTemplateId ? (
                        <span className="absolute bottom-1 right-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                          🎨 Diseño
                        </span>
                      ) : (
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                          📸 Foto
                        </span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Variants */}
                      {Object.keys(item.selectedVariants).length > 0 && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {Object.values(item.selectedVariants).join(' · ')}
                        </div>
                      )}

                      {/* Custom text preview */}
                      {item.customDesign?.customText && (
                        <div className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-sm inline-block mt-1 font-medium truncate max-w-full">
                          ✍️ "{item.customDesign.customText}"
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 bg-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-black text-slate-900">
                          {settings.currency}{item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Tu carrito está vacío</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Explora el catálogo o personaliza una taza, camiseta o mousepad para empezar.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('catalog');
                    }}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Ver Catálogo
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Subtotal Estimado:</span>
                  <span className="text-xl font-black text-slate-900">
                    {settings.currency}{cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  id="checkout-drawer-btn"
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceder al Pago / Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
};
