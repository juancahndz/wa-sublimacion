import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  ArrowLeft,
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  Package, 
  MapPin, 
  Phone, 
  MessageCircle, 
  FileText, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  CreditCard,
  Upload,
  Check
} from 'lucide-react';

const ORDER_STATUS_STEPS: { key: OrderStatus; label: string; description: string; icon: any }[] = [
  { 
    key: 'recibido', 
    label: 'Pedido Recibido', 
    description: 'Validación de orden y registro en sistema.',
    icon: FileText
  },
  { 
    key: 'arte_aprobacion', 
    label: 'Arte Aprobado', 
    description: 'Calibración de perfil de color CMYK y diseño.',
    icon: Sparkles
  },
  { 
    key: 'sublimando', 
    label: 'En Sublimación', 
    description: 'Estampado térmico en plancha a 200°C.',
    icon: Printer
  },
  { 
    key: 'control_calidad', 
    label: 'Control de Calidad', 
    description: 'Inspección minuciosa y empaque protector.',
    icon: Package
  },
  { 
    key: 'listo_despacho', 
    label: 'En Envío / Ruta', 
    description: 'Guía generada y paquete en camino.',
    icon: Truck
  },
  { 
    key: 'entregado', 
    label: 'Entregado', 
    description: 'Pedido recibido con satisfacción.',
    icon: CheckCircle2
  }
];

export const OrderTracking: React.FC = () => {
  const { orders, findOrderByTracking, activeTrackingSearchCode, setActiveTrackingSearchCode, updateOrderPaymentStatus, settings, showToast } = useStore();
  const [searchInput, setSearchInput] = useState(activeTrackingSearchCode || '');
  const [foundOrder, setFoundOrder] = useState<Order | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (activeTrackingSearchCode) {
      setSearchInput(activeTrackingSearchCode);
      const res = findOrderByTracking(activeTrackingSearchCode);
      setFoundOrder(res);
      setSearched(true);
    } else if (orders.length > 0) {
      // Default to first order for instant preview
      setFoundOrder(orders[0]);
      setSearchInput(orders[0].trackingCode);
      setSearched(true);
    }
  }, [activeTrackingSearchCode, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const res = findOrderByTracking(searchInput);
    setFoundOrder(res);
    setSearched(true);
  };

  const getStepIndex = (status: OrderStatus) => {
    const idx = ORDER_STATUS_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = foundOrder ? getStepIndex(foundOrder.status) : -1;

  const handleWhatsAppInquiry = () => {
    if (!foundOrder) return;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `¡Hola ${settings.storeName}! 👋\n` +
      `Quisiera consultar sobre el estado de mi pedido de sublimación:\n` +
      `🔖 *Código de rastreo:* ${foundOrder.trackingCode}\n` +
      `👤 *Cliente:* ${foundOrder.customer.name}\n` +
      `📦 *Total:* ${settings.currency}${foundOrder.totalAmount.toFixed(2)}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleUploadPaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && foundOrder) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        updateOrderPaymentStatus(foundOrder.id, 'comprobante_subido', url);
        setFoundOrder(prev => prev ? ({ ...prev, paymentStatus: 'comprobante_subido', paymentProofUrl: url }) : undefined);
        showToast("Comprobante enviado al taller para validación.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer group"
            id="order-tracking-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver al Catálogo</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Seguimiento de Pedidos en Tiempo Real</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Rastrea tu Pedido de Sublimación
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ingresa tu código de seguimiento (ej. <strong>SUBLI-7821</strong>), teléfono o correo para conocer el avance en el taller.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ingresa código (ej. SUBLI-7821), teléfono o correo..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              id="tracking-search-btn"
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              Consultar Estado
            </button>
          </form>

          {/* Quick Demo Tracking Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Códigos activos:</span>
            {orders.slice(0, 4).map(ord => (
              <button
                key={ord.id}
                onClick={() => {
                  setSearchInput(ord.trackingCode);
                  setFoundOrder(ord);
                  setSearched(true);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                #{ord.trackingCode}
              </button>
            ))}
          </div>
        </div>

        {/* Order Details & Stepper */}
        {foundOrder ? (
          <div className="space-y-6">
            
            {/* Status Summary Banner */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold font-mono text-indigo-600">
                      #{foundOrder.trackingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      foundOrder.status === 'entregado'
                        ? 'bg-emerald-100 text-emerald-700'
                        : foundOrder.status === 'sublimando'
                        ? 'bg-orange-100 text-orange-700'
                        : foundOrder.status === 'arte_aprobacion'
                        ? 'bg-indigo-100 text-indigo-700'
                        : foundOrder.status === 'cancelado'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {foundOrder.status === 'recibido' && 'Recibido'}
                      {foundOrder.status === 'arte_aprobacion' && 'Diseñando'}
                      {foundOrder.status === 'sublimando' && 'En Plancha'}
                      {foundOrder.status === 'control_calidad' && 'Control Calidad'}
                      {foundOrder.status === 'listo_despacho' && 'En Despacho'}
                      {foundOrder.status === 'entregado' && 'Entregado'}
                      {foundOrder.status === 'cancelado' && 'Cancelado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Actualizado: {new Date(foundOrder.createdAt).toLocaleDateString()} a las {new Date(foundOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    Imprimir Comprobante
                  </button>

                  <button
                    onClick={handleWhatsAppInquiry}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Consultar con Taller
                  </button>
                </div>
              </div>

              {/* Progress Stepper Visualizer */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Fase del Ciclo de Sublimación en Taller:
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {ORDER_STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx && foundOrder.status !== 'cancelado';
                    const isCurrent = idx === currentStepIdx && foundOrder.status !== 'cancelado';
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-1.5 rounded-md ${
                              isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                            }`}>
                              <StepIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-bold opacity-80">
                              0{idx + 1}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold leading-tight">
                            {step.label}
                          </h4>
                          <p className={`text-[10px] mt-1 leading-snug ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {step.description}
                          </p>
                        </div>

                        {isCompleted && (
                          <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center gap-1 text-[9px] font-semibold">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Completado</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Alert & Voucher Upload if Pending */}
              {foundOrder.paymentStatus !== 'verificado' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                  <div>
                    <span className="font-bold block">
                      Estado del Pago: {foundOrder.paymentStatus === 'comprobante_subido' ? 'Comprobante en revisión por el taller' : 'Pendiente de Pago / Comprobante'}
                    </span>
                    <span className="text-amber-800 text-[11px]">
                      Método seleccionado: <strong>{foundOrder.paymentMethod}</strong>.
                    </span>
                  </div>

                  <div>
                    <label className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{foundOrder.paymentProofUrl ? 'Actualizar Comprobante' : 'Subir Comprobante'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUploadPaymentProof} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Shipping & Delivery Info if applicable */}
              {foundOrder.trackingShippingNumber && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold">Guía de Envío: {foundOrder.trackingShippingNumber}</span>
                      <span className="text-slate-500 block">Transportista: {foundOrder.trackingCarrier || 'Paquetería Express'}</span>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-bold text-xs self-start sm:self-auto border border-indigo-200/60">
                    Entrega estimada: {foundOrder.estimatedDelivery}
                  </span>
                </div>
              )}
            </div>

            {/* Grid 2 Cols: Timeline History | Order Items Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left: Timeline Log */}
              <div className="md:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Bitácora de Actualizaciones
                </h3>

                <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {foundOrder.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                          {event.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {event.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Items Ordered & Customer Info */}
              <div className="md:col-span-6 space-y-6">
                
                {/* Items Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    Artículos en Pedido ({foundOrder.items.length})
                  </h3>

                  <div className="space-y-3 divide-y divide-slate-100">
                    {foundOrder.items.map((item, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3">
                        <img 
                          src={item.customDesign?.uploadedImageUrl || item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Cant: <strong>{item.quantity}</strong> | Precio: {settings.currency}{item.unitPrice.toFixed(2)}
                          </div>
                          {item.customDesign?.customText && (
                            <div className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
                              ✍️ "{item.customDesign.customText}"
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          {settings.currency}{item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span>{settings.currency}{foundOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Envío:</span>
                      <span>{foundOrder.shippingCost === 0 ? 'Gratis' : `${settings.currency}${foundOrder.shippingCost.toFixed(2)}`}</span>
                    </div>
                    {foundOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Descuento:</span>
                        <span>-{settings.currency}{foundOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                      <span>Total:</span>
                      <span className="text-indigo-600">{settings.currency}{foundOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Datos de Entrega:
                  </div>
                  <div><strong>Destinatario:</strong> {foundOrder.customer.name}</div>
                  <div><strong>Dirección:</strong> {foundOrder.customer.address}, {foundOrder.customer.city}</div>
                  <div><strong>Teléfono:</strong> {foundOrder.customer.phone}</div>
                </div>

              </div>

            </div>

          </div>
        ) : searched ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No encontramos ningún pedido con ese código</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Verifica el número de orden o contáctanos directamente por WhatsApp para asistirte de inmediato.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
