import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, Order } from '../../types';
import { 
  X, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Upload, 
  Truck, 
  Sparkles, 
  MessageCircle,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    cartSubtotal, 
    settings, 
    createOrder, 
    setActiveView, 
    showToast 
  } = useStore();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Successful order modal state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Shipping cost logic
  const isFreeShipping = cartSubtotal >= settings.freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : settings.standardShippingCost;
  const totalAmount = Math.max(0, cartSubtotal + shippingCost - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SUBLI10') {
      const disc = cartSubtotal * 0.10;
      setDiscountAmount(disc);
      setCouponApplied(true);
      showToast("¡Cupón SUBLI10 aplicado! 10% de descuento.", 'success');
    } else {
      showToast("Cupón inválido. Prueba con SUBLI10", 'warning');
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPaymentProofUrl(ev.target?.result as string);
        showToast("Comprobante de pago adjuntado.", 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      showToast("Por favor completa los datos obligatorios (Nombre, Teléfono y Dirección).", 'warning');
      return;
    }

    const newOrder = createOrder({
      customer,
      items: cart,
      subtotal: cartSubtotal,
      shippingCost,
      discount: discountAmount,
      totalAmount,
      status: 'recibido',
      paymentStatus: paymentProofUrl ? 'comprobante_subido' : 'pendiente',
      paymentMethod,
      paymentProofUrl: paymentProofUrl || undefined,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    setCompletedOrder(newOrder);
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    showToast("Datos de cuenta copiados al portapapeles.", 'info');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!completedOrder) return;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = completedOrder.items.map(i => `• ${i.quantity}x ${i.product.name} ($${i.totalPrice.toFixed(2)})`).join('\n');
    const msg = encodeURIComponent(
      `¡Hola ${settings.storeName}! 👋\n` +
      `Acabo de realizar el pedido en su página web:\n\n` +
      `🔖 *Código de Pedido:* ${completedOrder.trackingCode}\n` +
      `👤 *Cliente:* ${completedOrder.customer.name}\n` +
      `📞 *Teléfono:* ${completedOrder.customer.phone}\n` +
      `📍 *Entrega:* ${completedOrder.customer.address}, ${completedOrder.customer.city}\n\n` +
      `📦 *Artículos:* \n${itemsList}\n\n` +
      `💰 *Total:* ${settings.currency}${completedOrder.totalAmount.toFixed(2)}\n` +
      `💳 *Método de Pago:* ${completedOrder.paymentMethod}\n\n` +
      `¡Quedo atento a la confirmación del diseño y producción!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* If order is completed, show celebration screen */}
        {completedOrder ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                ¡Pedido Recibido con Éxito!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Gracias por tu Compra, {completedOrder.customer.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tu orden ha sido registrada en el taller y está lista para entrar a diseño y planchado.
              </p>
            </div>

            {/* Tracking Code Ticket */}
            <div className="p-5 bg-indigo-50/80 border border-indigo-200 rounded-2xl max-w-md mx-auto space-y-2">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                Tu Código de Seguimiento
              </span>
              <div className="text-3xl font-black font-mono text-indigo-950 tracking-wider">
                {completedOrder.trackingCode}
              </div>
              <p className="text-[11px] text-slate-600">
                Guarda este código para consultar el estado en vivo desde el menú "Rastrear Pedido".
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleSendWhatsAppConfirmation}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar Comprobante por WhatsApp
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveView('catalog');
                }}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Continuar Comprando
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Regresar / Cancelar"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Regresar</span>
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Finalizar Pedido
                  </h2>
                  <p className="text-xs text-slate-500">
                    Completa tus datos de envío y confirma tu método de pago.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                title="Cerrar / Cancelar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Customer Form */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  1. Datos de Contacto y Envío
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Valeria Morales"
                      value={customer.name}
                      onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: +52 55 1234 5678"
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ciudad / Municipio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Ciudad de México"
                      value={customer.city}
                      onChange={e => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dirección de Entrega Exacta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, número exterior/interior, colonia y referencias..."
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  2. Método de Pago
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'transferencia', label: 'Transferencia', icon: Building2 },
                    { id: 'sinpe_zelle_bizum', label: 'Zelle / Móvil', icon: Smartphone },
                    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                    { id: 'efectivo', label: 'Contra Entrega', icon: Banknote }
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[11px] font-semibold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bank or Digital instructions */}
                {paymentMethod === 'transferencia' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{settings.bankDetails.bankName}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(settings.bankDetails.clabeOrIban || settings.bankDetails.accountNumber)}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedBank ? 'Copiado' : 'Copiar Cuenta'}
                      </button>
                    </div>
                    <div><strong>Titular:</strong> {settings.bankDetails.accountHolder}</div>
                    <div><strong>Cuenta / CLABE:</strong> {settings.bankDetails.accountNumber} ({settings.bankDetails.clabeOrIban})</div>
                  </div>
                )}

                {paymentMethod === 'sinpe_zelle_bizum' && (
                  <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 space-y-1">
                    <div className="font-bold">{settings.digitalPaymentDetails.type}</div>
                    <div className="font-mono text-purple-900 font-bold">{settings.digitalPaymentDetails.identifier}</div>
                    <p className="text-[11px] text-purple-800">{settings.digitalPaymentDetails.instructions}</p>
                  </div>
                )}

                {/* Upload voucher */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Adjuntar Comprobante de Pago (Opcional - Puedes enviarlo luego por WhatsApp):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Coupon Code & Total Summary */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de descuento (ej: SUBLI10)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {couponApplied ? 'Aplicado' : 'Aplicar'}
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{settings.currency}{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de Envío:</span>
                    <span className={shippingCost === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {shippingCost === 0 ? 'Gratis' : `${settings.currency}${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento Promocional:</span>
                      <span>-{settings.currency}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total a Pagar:</span>
                    <span>{settings.currency}{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cancelar / Regresar</span>
                </button>

                <button
                  type="submit"
                  id="submit-order-checkout-btn"
                  className="py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirmar y Registrar Pedido</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
