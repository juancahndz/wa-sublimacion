import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Download, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  FileText, 
  Image as ImageIcon, 
  DollarSign, 
  Send, 
  Save, 
  PackageCheck,
  Flame,
  QrCode,
  Check
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { 
    updateOrderStatus, 
    updateOrderPaymentStatus, 
    updateOrderDetails, 
    settings, 
    showToast 
  } = useStore();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'recibido');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus || 'pendiente');
  const [timelineNote, setTimelineNote] = useState('');
  const [carrierInput, setCarrierInput] = useState(order?.trackingCarrier || '');
  const [guideInput, setGuideInput] = useState(order?.trackingShippingNumber || '');
  const [internalNotes, setInternalNotes] = useState(order?.internalAdminNotes || '');
  const [showPrintSheet, setShowPrintSheet] = useState(false);

  if (!order) return null;

  const handleUpdateStatus = () => {
    updateOrderStatus(order.id, selectedStatus, timelineNote || undefined);
    setTimelineNote('');
  };

  const handleSaveShippingAndNotes = () => {
    updateOrderDetails(order.id, {
      trackingCarrier: carrierInput,
      trackingShippingNumber: guideInput,
      internalAdminNotes: internalNotes
    });
  };

  const handlePaymentStatusChange = (status: PaymentStatus) => {
    setSelectedPaymentStatus(status);
    updateOrderPaymentStatus(order.id, status);
  };

  const handleContactCustomerWhatsApp = () => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `¡Hola ${order.customer.name}! Te escribimos de ${settings.storeName} respecto a tu pedido de sublimación #${order.trackingCode}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const getSublimationSpecs = (category: string, mockupType: string) => {
    if (mockupType === 'mug' || category === 'tazas') {
      return { temp: '200°C (392°F)', time: '180 segundos', pressure: 'Media-Firme', paper: 'Papel Sublimación Secado Rápido' };
    }
    if (mockupType === 'tshirt' || mockupType === 'hoodie' || category === 'textil') {
      return { temp: '195°C (383°F)', time: '60 segundos', pressure: 'Alta (Firme)', paper: 'Papel A3 / A4 sin teflón directo' };
    }
    if (mockupType === 'bottle' || category === 'botellas_termos') {
      return { temp: '190°C (374°F)', time: '120 segundos', pressure: 'Media cilíndrica', paper: 'Fijar con cinta térmica en extremos' };
    }
    if (mockupType === 'mousepad' || category === 'accesorios_gamer') {
      return { temp: '200°C (392°F)', time: '50 segundos', pressure: 'Alta plana', paper: 'Impresión a sangre 100%' };
    }
    return { temp: '190°C (374°F)', time: '70 segundos', pressure: 'Media', paper: 'Papel estándar con cinta térmica' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black font-mono text-slate-900">
              #{order.trackingCode}
            </span>
            <span className="text-xs text-slate-500">
              ({new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintSheet(!showPrintSheet)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              {showPrintSheet ? 'Ocultar Hoja Taller' : 'Hoja Técnica de Taller'}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Workshop Sheet View */}
        {showPrintSheet ? (
          <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-indigo-900">
                  ORDEN DE PRODUCCIÓN & PLANCHADO TÉRMICO
                </h3>
                <div className="text-xs text-slate-600">
                  {settings.storeName} · Taller de Sublimación · Tel: {settings.whatsappNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-black text-indigo-600">
                  #{order.trackingCode}
                </div>
                <div className="text-[11px] text-slate-500">
                  Fecha: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Customer info for delivery */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Cliente</span>
                <span className="font-bold text-sm text-slate-900">{order.customer.name}</span>
                <div className="text-slate-600">Tel: {order.customer.phone}</div>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Entrega</span>
                <div className="text-slate-800 font-semibold">{order.customer.address}, {order.customer.city}</div>
                {order.customer.notes && (
                  <div className="text-amber-800 text-[11px] mt-1">Nota: "{order.customer.notes}"</div>
                )}
              </div>
            </div>

            {/* Technical items checklist */}
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
                Artículos en Producción & Parámetros Térmicos
              </span>

              <div className="space-y-3">
                {order.items.map((item, idx) => {
                  const specs = getSublimationSpecs(item.product.category, item.product.mockupType);
                  return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{item.product.name} (x{item.quantity})</h5>
                          <div className="text-[11px] text-slate-600">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Estándar'}
                          </div>
                          {item.customDesign?.customText && (
                            <div className="text-xs font-mono text-indigo-700 mt-1">
                              Texto: "{item.customDesign.customText}" (Pos: {item.customDesign.position})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technical Specs Badge */}
                      <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          <span>Temp: {specs.temp} · Tiempo: {specs.time}</span>
                        </div>
                        <div>Presión: {specs.pressure}</div>
                        <div>Área: {item.product.sublimationAreaText}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operator signatures */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center text-xs text-slate-600">
              <div className="border-t border-slate-400 pt-2 mt-6">
                <span>Firma Operador Plancha</span>
              </div>
              <div className="border-t border-slate-400 pt-2 mt-6">
                <span>Control de Calidad / Empaque</span>
              </div>
              <div className="border-t border-slate-400 pt-2 mt-6">
                <span>Despacho / Guía</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Orden
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Customer & Items Breakdown */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Customer Info Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>Cliente: {order.customer.name}</span>
                  <button
                    onClick={handleContactCustomerWhatsApp}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Tel:</strong> {order.customer.phone}</div>
                  <div><strong>Email:</strong> {order.customer.email || 'No provisto'}</div>
                  <div className="col-span-2">
                    <strong>Dirección:</strong> {order.customer.address}, {order.customer.city}
                  </div>
                  {order.customer.notes && (
                    <div className="col-span-2 p-2 bg-amber-50 rounded-lg text-amber-900 border border-amber-200">
                      <strong>Nota del cliente:</strong> "{order.customer.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Design & Artwork Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Artículos & Archivos para Sublimar ({order.items.length})
                </h4>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img 
                            src={item.customDesign?.uploadedImageUrl || item.product.images[0]} 
                            alt="" 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">{item.product.name}</h5>
                            <div className="text-[11px] text-slate-500">
                              Cantidad: <strong>{item.quantity}</strong> | Precio: {settings.currency}{item.totalPrice.toFixed(2)}
                            </div>
                            {Object.keys(item.selectedVariants).length > 0 && (
                              <div className="text-[10px] text-slate-600 mt-0.5">
                                {Object.values(item.selectedVariants).join(' · ')}
                              </div>
                            )}
                          </div>
                        </div>

                        {item.customDesign?.uploadedImageUrl && (
                          <a
                            href={item.customDesign.uploadedImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            download={`arte_${order.trackingCode}_item${idx+1}`}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-200 shrink-0 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar Arte
                          </a>
                        )}
                      </div>

                      {/* Custom Design Details */}
                      {item.customDesign && (
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                          <div><strong>Posición:</strong> {item.customDesign.position}</div>
                          {item.customDesign.customText && (
                            <div>
                              <strong>Texto Personalizado:</strong> <span className="font-mono text-indigo-700">"{item.customDesign.customText}"</span> (Color: {item.customDesign.textColor}, Fuente: {item.customDesign.fontFamily})
                            </div>
                          )}
                          {item.customDesign.specialInstructions && (
                            <div className="text-amber-800">
                              <strong>Instrucción:</strong> {item.customDesign.specialInstructions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Verification */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Estado de Pago:</span>
                  <div className="flex gap-1.5">
                    {(['pendiente', 'comprobante_subido', 'verificado'] as PaymentStatus[]).map(ps => (
                      <button
                        key={ps}
                        onClick={() => handlePaymentStatusChange(ps)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                          order.paymentStatus === ps
                            ? ps === 'verificado' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ps.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {order.paymentProofUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-slate-500">Comprobante adjunto:</span>
                    <a
                      href={order.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Ver Comprobante
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Right: State Management & Timeline Updates */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Status Changer Card */}
              <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 space-y-4">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-indigo-600" />
                  Actualizar Estado de Sublimación
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-indigo-900 block mb-1">
                    Nuevo Estado:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="recibido">1. Pedido Recibido</option>
                    <option value="arte_aprobacion">2. Arte Aprobado / Calibrado</option>
                    <option value="sublimando">3. En Sublimación & Plancha</option>
                    <option value="control_calidad">4. Control de Calidad</option>
                    <option value="listo_despacho">5. Listo para Despacho / Ruta</option>
                    <option value="entregado">6. Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-indigo-900 block mb-1">
                    Nota del Evento (Visible para el Cliente en Tracking):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Impresión transferida a 200°C sin defectos. Empacado con plástico burbuja..."
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Guardar y Notificar Estado
                </button>
              </div>

              {/* Shipping Carrier & Admin Internal Notes */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Despacho & Guía de Envío
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Transportista</label>
                    <input
                      type="text"
                      placeholder="Ej: DHL, FedEx, Mensajero"
                      value={carrierInput}
                      onChange={e => setCarrierInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Número de Guía</label>
                    <input
                      type="text"
                      placeholder="Ej: DHL-871239"
                      value={guideInput}
                      onChange={e => setGuideInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Notas Internas de Taller</label>
                  <textarea
                    rows={2}
                    placeholder="Anotaciones privadas del administrador..."
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <button
                  onClick={handleSaveShippingAndNotes}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Actualizar Datos de Envío
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
