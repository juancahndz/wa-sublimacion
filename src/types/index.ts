export type ProductMockupType = 
  | 'mug' 
  | 'tshirt' 
  | 'hoodie' 
  | 'bottle' 
  | 'cap' 
  | 'mousepad' 
  | 'pillow' 
  | 'keychain' 
  | 'puzzle' 
  | 'phonecase';

export type ProductCategory = string;

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Blanca", "Mágica Negra", "Talla M", "Aluminio Plata"
  type: 'color' | 'size' | 'finish' | 'material';
  value: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  features: string[];
  images: string[];
  mockupType: ProductMockupType;
  linkedInventoryId?: string; // Links to raw sublimation blank
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  isCustomizable: boolean;
  minQuantity: number;
  sublimationAreaText: string; // e.g. "9.5 x 20 cm (Panorámica)"
  rating: number;
  reviewCount: number;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: 'anime' | 'gaming' | 'parejas' | 'empresas' | 'musica' | 'frases' | 'festividades' | 'mascotas';
  tags: string[];
  imageUrl: string;
  compatibleMockups: ProductMockupType[];
  popular?: boolean;
}

export type InventoryCategory = 
  | 'blancos_ceramica' 
  | 'blancos_textil' 
  | 'blancos_aluminio' 
  | 'blancos_polimero' 
  | 'tintas_papel' 
  | 'empaques_cintas';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  minStockAlert: number;
  unitCost: number;
  unit: 'unidades' | 'hojas' | 'ml' | 'rollos' | 'cajas';
  supplier?: string;
  location?: string;
  lastUpdated: string;
  notes?: string;
}

export type OrderStatus = 
  | 'recibido' 
  | 'arte_aprobacion' 
  | 'sublimando' 
  | 'control_calidad' 
  | 'listo_despacho' 
  | 'entregado' 
  | 'cancelado';

export type PaymentStatus = 'pendiente' | 'comprobante_subido' | 'verificado';
export type PaymentMethod = 'transferencia' | 'sinpe_zelle_bizum' | 'efectivo' | 'tarjeta';

export interface CustomDesignData {
  uploadedImageUrl?: string;
  selectedTemplateId?: string;
  customText?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  position: 'frente' | 'espalda' | 'ambos' | 'panoramico';
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  previewMockupUrl?: string;
  specialInstructions?: string;
  printFinish?: 'brillante' | 'mate' | 'metalizado';
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>; // e.g. { color: 'Negro', size: 'L' }
  customDesign?: CustomDesignData;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  note: string;
  photoUrl?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  trackingCode: string; // e.g. "SUBLI-8492"
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;
  timeline: OrderTimelineEvent[];
  estimatedDelivery: string;
  trackingCarrier?: string;
  trackingShippingNumber?: string;
  internalAdminNotes?: string;
}

export interface CategoryOption {
  id: string;
  label: string;
}

export interface HeroFeatureButton {
  id: string;
  label: string;
  description?: string;
  icon?: string; // 'check', 'flame', 'shield', 'truck', 'sparkles', 'clock', 'star', 'heart', 'tag', 'gift'
  actionType?: 'info' | 'catalog' | 'customizer' | 'designs' | 'whatsapp';
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  logoUrl?: string;
  hideHeroBanner?: boolean;
  heroTopBadgeText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPrimaryButtonText?: string;
  heroSecondaryButtonText?: string;
  heroTrustPoint1?: string;
  heroTrustPoint2?: string;
  heroTrustPoint3?: string;
  heroFeatureButtons?: HeroFeatureButton[];
  heroImageUrl?: string;
  heroBadgeTag?: string;
  heroBadgeTitle?: string;
  heroBadgeSubtitle?: string;
  currency: string;
  whatsappNumber: string;
  contactEmail: string;
  address: string;
  catalogTitle?: string;
  catalogSubtitle?: string;
  customCategories?: CategoryOption[];
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    clabeOrIban: string;
  };
  digitalPaymentDetails: {
    type: string; // "SINPE Móvil / Zelle / Bizum / MercadoPago"
    identifier: string;
    instructions: string;
  };
  bannerAnnouncement: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  adminPin?: string;
  adminEmail?: string;
  adminPassword?: string;
}

export type ActiveView = 
  | 'catalog' 
  | 'customizer' 
  | 'designs' 
  | 'cart' 
  | 'admin';
