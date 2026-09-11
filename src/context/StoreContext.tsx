import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  DesignTemplate, 
  InventoryItem, 
  Order, 
  CartItem, 
  StoreSettings, 
  ActiveView, 
  OrderStatus, 
  PaymentStatus, 
  CustomDesignData,
  CategoryOption
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_DESIGN_TEMPLATES, 
  INITIAL_INVENTORY, 
  INITIAL_ORDERS, 
  INITIAL_STORE_SETTINGS 
} from '../data/initialData';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  adminTab: 'orders' | 'products' | 'inventory' | 'designs' | 'settings';
  setAdminTab: (tab: 'orders' | 'products' | 'inventory' | 'designs' | 'settings') => void;
  
  // Products & Designs
  products: Product[];
  designTemplates: DesignTemplate[];
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  selectedProductForCustomizer: Product | null;
  setSelectedProductForCustomizer: (product: Product | null) => void;
  selectedTemplateForCustomizer: DesignTemplate | null;
  setSelectedTemplateForCustomizer: (template: DesignTemplate | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addDesignTemplate: (template: DesignTemplate) => void;
  updateDesignTemplate: (template: DesignTemplate) => void;
  deleteDesignTemplate: (id: string) => void;

  // Inventory Management
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  adjustStock: (id: string, delta: number, note?: string) => void;
  updateInventoryStock: (id: string, delta: number, note?: string) => void;
  lowStockItemsCount: number;

  // Orders Management
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'trackingCode' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, photoUrl?: string) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus, proofUrl?: string) => void;
  updateOrderDetails: (orderId: string, data: Partial<Order>) => void;
  findOrderByTracking: (query: string) => Order | undefined;
  activeTrackingSearchCode: string;
  setActiveTrackingSearchCode: (code: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity: number, selectedVariants: Record<string, string>, customDesign?: CustomDesignData) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
  resetToInitialData: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Action helpers
  startCustomizingProduct: (product: Product, template?: DesignTemplate) => void;
  startTrackingOrder: (code: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'sublicraft_products_v1',
  DESIGNS: 'wasublimacion_designs_v2',
  INVENTORY: 'sublicraft_inventory_v1',
  ORDERS: 'sublicraft_orders_v1',
  CART: 'sublicraft_cart_v1',
  SETTINGS: 'wasublimacion_settings_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Views
  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'inventory' | 'designs' | 'settings'>('orders');

  // Interactive customizer selections
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForCustomizer, setSelectedProductForCustomizer] = useState<Product | null>(null);
  const [selectedTemplateForCustomizer, setSelectedTemplateForCustomizer] = useState<DesignTemplate | null>(null);
  const [activeTrackingSearchCode, setActiveTrackingSearchCode] = useState<string>('');

  // Cart drawer
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistent States with Fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [designTemplates, setDesignTemplates] = useState<DesignTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      return saved ? JSON.parse(saved) : INITIAL_DESIGN_TEMPLATES;
    } catch {
      return INITIAL_DESIGN_TEMPLATES;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.address || parsed.address.includes("Artes Gráficas") || parsed.address.includes("Distrito Creativo")) {
          parsed.address = "Comayagua, Honduras";
        }
        if (!parsed.logoUrl) {
          parsed.logoUrl = "/logo.png";
        }
        if (parsed.storeName === "Sublicraft Pro" || parsed.storeName === "WA Sublimacion") {
          parsed.storeName = "WA Sublimación";
        }
        if (parsed.bannerAnnouncement && parsed.bannerAnnouncement.includes("Envíos gratis en pedidos superiores")) {
          parsed.bannerAnnouncement = "";
        }
        if (!parsed.adminEmail) {
          parsed.adminEmail = "admin@wasublimacion.com";
        }
        if (!parsed.adminPassword) {
          parsed.adminPassword = "admin1234";
        }
        if (!parsed.whatsappNumber || parsed.whatsappNumber.includes("+52 55 8765 4321") || parsed.whatsappNumber === "+504 3250-4860") {
          parsed.whatsappNumber = "+504 3250-4890";
        }
        return parsed;
      }
      return INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn("Storage quota or error saving products", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designTemplates));
    } catch (e) {
      console.warn("Storage quota or error saving designs", e);
    }
  }, [designTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.warn("Storage quota or error saving inventory", e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn("Storage quota or error saving orders", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage quota or error saving cart", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Storage quota or error saving settings", e);
    }
  }, [settings]);

  // Cloud Firestore Sync Helpers
  const syncProductsToCloud = async (items: Product[]) => {
    try {
      await setDoc(doc(db, 'store_data', 'products'), { items });
    } catch (err) {
      console.warn("Firestore products sync note:", err);
    }
  };

  const syncDesignsToCloud = async (items: DesignTemplate[]) => {
    try {
      await setDoc(doc(db, 'store_data', 'designs'), { items });
    } catch (err) {
      console.warn("Firestore designs sync note:", err);
    }
  };

  const syncInventoryToCloud = async (items: InventoryItem[]) => {
    try {
      await setDoc(doc(db, 'store_data', 'inventory'), { items });
    } catch (err) {
      console.warn("Firestore inventory sync note:", err);
    }
  };

  const syncOrdersToCloud = async (items: Order[]) => {
    try {
      await setDoc(doc(db, 'store_data', 'orders'), { items });
    } catch (err) {
      console.warn("Firestore orders sync note:", err);
    }
  };

  const syncSettingsToCloud = async (st: StoreSettings) => {
    try {
      await setDoc(doc(db, 'store_data', 'settings'), { settings: st });
    } catch (err) {
      console.warn("Firestore settings sync note:", err);
    }
  };

  // Real-time Firestore synchronization across all devices
  useEffect(() => {
    const unsubProducts = onSnapshot(doc(db, 'store_data', 'products'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.items) {
        setProducts(docSnap.data().items);
      } else {
        setDoc(doc(db, 'store_data', 'products'), { items: INITIAL_PRODUCTS }).catch(() => {});
      }
    }, (err) => console.warn("Firestore products listener note:", err));

    const unsubDesigns = onSnapshot(doc(db, 'store_data', 'designs'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.items) {
        setDesignTemplates(docSnap.data().items);
      } else {
        setDoc(doc(db, 'store_data', 'designs'), { items: INITIAL_DESIGN_TEMPLATES }).catch(() => {});
      }
    }, (err) => console.warn("Firestore designs listener note:", err));

    const unsubInventory = onSnapshot(doc(db, 'store_data', 'inventory'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.items) {
        setInventory(docSnap.data().items);
      } else {
        setDoc(doc(db, 'store_data', 'inventory'), { items: INITIAL_INVENTORY }).catch(() => {});
      }
    }, (err) => console.warn("Firestore inventory listener note:", err));

    const unsubOrders = onSnapshot(doc(db, 'store_data', 'orders'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.items) {
        setOrders(docSnap.data().items);
      } else {
        setDoc(doc(db, 'store_data', 'orders'), { items: INITIAL_ORDERS }).catch(() => {});
      }
    }, (err) => console.warn("Firestore orders listener note:", err));

    const unsubSettings = onSnapshot(doc(db, 'store_data', 'settings'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.settings) {
        setSettings(docSnap.data().settings);
      } else {
        setDoc(doc(db, 'store_data', 'settings'), { settings: INITIAL_STORE_SETTINGS }).catch(() => {});
      }
    }, (err) => console.warn("Firestore settings listener note:", err));

    return () => {
      unsubProducts();
      unsubDesigns();
      unsubInventory();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sublimation Line / Category formatting helper
  const formatCategoryLabel = (catId: string): string => {
    const iconMap: Record<string, string> = {
      tazas: '☕ Tazas & Cerámica',
      textil: '👕 Camisetas & Hoodies',
      botellas_termos: '🥤 Botellas & Termos',
      accesorios_gamer: '🎮 Mousepads Gamer',
      gorras: '🧢 Gorras Trucker',
      hogar_decoracion: '🛋️ Cojines & Decoración',
      regalos_promocionales: '🧩 Puzzles & Llaveros',
      llaveros: '🔑 Llaveros Metálicos & Polímero',
      stickers: '🏷️ Stickers & Calcomanías',
      termos: '🥤 Termos de Acero Inoxidable',
      cojines: '🛋️ Cojines Personalizados'
    };

    if (iconMap[catId.toLowerCase()]) {
      return iconMap[catId.toLowerCase()];
    }

    const clean = catId.replace(/_/g, ' ');
    const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
    return `✨ ${capitalized}`;
  };

  // Synchronize settings.customCategories automatically with active products in catalog
  useEffect(() => {
    setSettings(prevSettings => {
      const currentCats = prevSettings.customCategories || [];
      const productCategoryIds = new Set(products.map(p => p.category));
      
      // Remove any category (other than 'all') that no longer has any products in the catalog
      const activeCats = currentCats.filter(c => c.id === 'all' || productCategoryIds.has(c.id));
      
      // Ensure 'all' is always at the beginning
      if (!activeCats.some(c => c.id === 'all')) {
        activeCats.unshift({ id: 'all', label: 'Todos los Artículos' });
      }

      // Add any category from products that is missing
      products.forEach(p => {
        if (p.category && !activeCats.some(c => c.id === p.category)) {
          activeCats.push({
            id: p.category,
            label: formatCategoryLabel(p.category)
          });
        }
      });

      if (JSON.stringify(activeCats) !== JSON.stringify(currentCats)) {
        return {
          ...prevSettings,
          customCategories: activeCats
        };
      }
      return prevSettings;
    });
  }, [products]);

  // Products CRUD with Instant Sublimation Line Synchronization
  const addProduct = (product: Product) => {
    const newProducts = [product, ...products];
    setProducts(newProducts);
    syncProductsToCloud(newProducts);

    // Automatically ensure the sublimation line appears in settings.customCategories
    setSettings(prev => {
      const currentCats = prev.customCategories || [];
      const exists = currentCats.some(c => c.id === product.category);
      if (!exists && product.category && product.category !== 'all') {
        const newCat: CategoryOption = {
          id: product.category,
          label: formatCategoryLabel(product.category)
        };
        const updatedCats = [...currentCats, newCat];
        const updatedSettings = { ...prev, customCategories: updatedCats };
        syncSettingsToCloud(updatedSettings);
        return updatedSettings;
      }
      return prev;
    });

    showToast(`Producto "${product.name}" agregado al catálogo exitosamente.`, 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    syncProductsToCloud(updatedProducts);

    if (oldProduct && oldProduct.category !== updatedProduct.category) {
      const oldCatStillHasProducts = updatedProducts.some(p => p.category === oldProduct.category);
      setSettings(prev => {
        let currentCats = prev.customCategories || [];
        if (!oldCatStillHasProducts) {
          currentCats = currentCats.filter(c => c.id === 'all' || c.id !== oldProduct.category);
        }
        const newExists = currentCats.some(c => c.id === updatedProduct.category);
        if (!newExists && updatedProduct.category && updatedProduct.category !== 'all') {
          currentCats = [...currentCats, {
            id: updatedProduct.category,
            label: formatCategoryLabel(updatedProduct.category)
          }];
        }
        const updatedSettings = { ...prev, customCategories: currentCats };
        syncSettingsToCloud(updatedSettings);
        return updatedSettings;
      });
    }

    showToast(`Producto "${updatedProduct.name}" actualizado.`, 'info');
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    syncProductsToCloud(updatedProducts);

    // If no remaining products use this category, automatically remove it from customCategories!
    if (productToDelete) {
      const categoryStillHasProducts = updatedProducts.some(p => p.category === productToDelete.category);
      if (!categoryStillHasProducts) {
        setSettings(prev => {
          const currentCats = prev.customCategories || [];
          const filtered = currentCats.filter(c => c.id === 'all' || c.id !== productToDelete.category);
          const updatedSettings = { ...prev, customCategories: filtered };
          syncSettingsToCloud(updatedSettings);
          return updatedSettings;
        });
      }
    }

    showToast("Producto eliminado del catálogo.", 'warning');
  };

  const addDesignTemplate = (template: DesignTemplate) => {
    const newDesigns = [template, ...designTemplates];
    setDesignTemplates(newDesigns);
    syncDesignsToCloud(newDesigns);
    showToast(`Diseño "${template.title}" publicado en la galería.`, 'success');
  };

  const updateDesignTemplate = (template: DesignTemplate) => {
    const newDesigns = designTemplates.map(t => t.id === template.id ? template : t);
    setDesignTemplates(newDesigns);
    syncDesignsToCloud(newDesigns);
    showToast(`Diseño "${template.title}" actualizado.`, 'info');
  };

  const deleteDesignTemplate = (id: string) => {
    const newDesigns = designTemplates.filter(d => d.id !== id);
    setDesignTemplates(newDesigns);
    syncDesignsToCloud(newDesigns);
    showToast("Diseño retirado de la galería.", 'info');
  };

  // Inventory Management
  const addInventoryItem = (item: InventoryItem) => {
    const newInv = [item, ...inventory];
    setInventory(newInv);
    syncInventoryToCloud(newInv);
    showToast(`Insumo "${item.name}" registrado en el inventario.`, 'success');
  };

  const updateInventoryItem = (item: InventoryItem) => {
    const newInv = inventory.map(i => i.id === item.id ? item : i);
    setInventory(newInv);
    syncInventoryToCloud(newInv);
    showToast(`Insumo "${item.name}" actualizado.`, 'info');
  };

  const deleteInventoryItem = (id: string) => {
    const newInv = inventory.filter(i => i.id !== id);
    setInventory(newInv);
    syncInventoryToCloud(newInv);
    showToast("Insumo eliminado del inventario.", 'warning');
  };

  const adjustStock = (id: string, delta: number, note?: string) => {
    const newInv = inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock + delta);
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString().split('T')[0],
          notes: note ? `${note} (${delta > 0 ? '+' : ''}${delta})` : item.notes
        };
      }
      return item;
    });
    setInventory(newInv);
    syncInventoryToCloud(newInv);
    showToast(`Stock actualizado (${delta > 0 ? '+' : ''}${delta} unidades).`, 'info');
  };

  const lowStockItemsCount = useMemo(() => {
    return inventory.filter(item => item.currentStock <= item.minStockAlert).length;
  }, [inventory]);

  // Cart Actions
  const addToCart = (
    product: Product, 
    quantity: number, 
    selectedVariants: Record<string, string>, 
    customDesign?: CustomDesignData
  ) => {
    let variantExtra = 0;
    Object.entries(selectedVariants).forEach(([_, valName]) => {
      const match = product.variants.find(v => v.name === valName || v.value === valName);
      if (match) variantExtra += match.priceModifier;
    });

    let customExtra = 0;
    if (customDesign?.position === 'ambos') customExtra += 2.50;
    if (customDesign?.position === 'panoramico') customExtra += 1.00;

    const unitPrice = product.basePrice + variantExtra + customExtra;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity,
      selectedVariants,
      customDesign,
      unitPrice,
      totalPrice
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
    showToast(`"${product.name}" añadido al carrito`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast("Artículo removido del carrito", 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Orders Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'trackingCode' | 'createdAt' | 'timeline'>): Order => {
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `SUBLI-${randomCodeNum}`;
    const newId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const initialTimeline: Order['timeline'] = [
      {
        status: 'recibido',
        timestamp: now,
        title: 'Pedido Recibido',
        note: `Pedido generado por ${orderData.customer.name}. Pago mediante ${orderData.paymentMethod}.`
      }
    ];

    const newOrder: Order = {
      ...orderData,
      id: newId,
      trackingCode,
      createdAt: now,
      timeline: initialTimeline
    };

    // Auto reduce inventory for linked blank items
    let updatedInventory = inventory;
    let inventoryModified = false;
    orderData.items.forEach(cartItem => {
      if (cartItem.product.linkedInventoryId) {
        inventoryModified = true;
        updatedInventory = updatedInventory.map(item => {
          if (item.id === cartItem.product.linkedInventoryId) {
            return {
              ...item,
              currentStock: Math.max(0, item.currentStock - cartItem.quantity),
              lastUpdated: new Date().toISOString().split('T')[0],
              notes: `Deducción por pedido ${trackingCode}`
            };
          }
          return item;
        });
      }
    });

    if (inventoryModified) {
      setInventory(updatedInventory);
      syncInventoryToCloud(updatedInventory);
    }

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    syncOrdersToCloud(newOrders);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`¡Pedido creado con éxito! Código: ${trackingCode}`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    newStatus: OrderStatus, 
    note?: string, 
    photoUrl?: string
  ) => {
    const statusTitles: Record<OrderStatus, string> = {
      recibido: 'Pedido Registrado',
      arte_aprobacion: 'Diseño y Arte Aprobado',
      sublimando: 'En Proceso de Sublimación & Estampado',
      control_calidad: 'Control de Calidad y Empaque',
      listo_despacho: 'Listo para Despacho / En Ruta',
      entregado: 'Entregado al Cliente',
      cancelado: 'Pedido Cancelado'
    };

    const statusDefaultNotes: Record<OrderStatus, string> = {
      recibido: 'Pedido confirmado y en cola de producción.',
      arte_aprobacion: 'Arte vectorial y tipografías revisadas y ajustadas a resolución de impresión.',
      sublimando: 'En máquina de termo-transferencia / plancha térmica a 200°C.',
      control_calidad: 'Revisión minuciosa de colores, fijación de tintas y empaque protector.',
      listo_despacho: 'Guía de despacho asignada y paquete listo para entrega.',
      entregado: 'Entregado con satisfacción garantizada.',
      cancelado: 'El pedido fue cancelado y los insumos reincorporados.'
    };

    const newOrders = orders.map(order => {
      if (order.id === orderId) {
        const newEvent = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          title: statusTitles[newStatus],
          note: note || statusDefaultNotes[newStatus],
          photoUrl: photoUrl || undefined,
          updatedBy: 'Taller WA Sublimacion'
        };

        return {
          ...order,
          status: newStatus,
          timeline: [...order.timeline, newEvent]
        };
      }
      return order;
    });

    setOrders(newOrders);
    syncOrdersToCloud(newOrders);
    showToast(`Estado del pedido actualizado a "${statusTitles[newStatus]}".`, 'success');
  };

  const updateOrderPaymentStatus = (orderId: string, status: PaymentStatus, proofUrl?: string) => {
    const newOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          paymentStatus: status,
          paymentProofUrl: proofUrl || ord.paymentProofUrl
        };
      }
      return ord;
    });
    setOrders(newOrders);
    syncOrdersToCloud(newOrders);
    showToast(`Estado de pago actualizado: ${status}.`, 'info');
  };

  const updateOrderDetails = (orderId: string, data: Partial<Order>) => {
    const newOrders = orders.map(ord => ord.id === orderId ? { ...ord, ...data } : ord);
    setOrders(newOrders);
    syncOrdersToCloud(newOrders);
    showToast("Detalles del pedido actualizados.", 'info');
  };

  const findOrderByTracking = (query: string): Order | undefined => {
    if (!query.trim()) return undefined;
    const clean = query.trim().toLowerCase();
    return orders.find(ord => 
      ord.trackingCode.toLowerCase() === clean ||
      ord.customer.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, '')) ||
      ord.customer.email.toLowerCase() === clean
    );
  };

  const startCustomizingProduct = (product: Product, template?: DesignTemplate) => {
    setSelectedProductForDetail(product);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTrackingOrder = (code: string) => {
    setActiveTrackingSearchCode(code);
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    syncSettingsToCloud(updatedSettings);
    showToast("Ajustes de la tienda guardados.", 'success');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setDesignTemplates(INITIAL_DESIGN_TEMPLATES);
    setInventory(INITIAL_INVENTORY);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_STORE_SETTINGS);
    setCart([]);
    syncProductsToCloud(INITIAL_PRODUCTS);
    syncDesignsToCloud(INITIAL_DESIGN_TEMPLATES);
    syncInventoryToCloud(INITIAL_INVENTORY);
    syncOrdersToCloud(INITIAL_ORDERS);
    syncSettingsToCloud(INITIAL_STORE_SETTINGS);
    showToast("Datos de demostración restablecidos a valores originales.", 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        adminTab,
        setAdminTab,
        products,
        designTemplates,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedProductForCustomizer,
        setSelectedProductForCustomizer,
        selectedTemplateForCustomizer,
        setSelectedTemplateForCustomizer,
        addProduct,
        updateProduct,
        deleteProduct,
        addDesignTemplate,
        updateDesignTemplate,
        deleteDesignTemplate,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustStock,
        updateInventoryStock: adjustStock,
        lowStockItemsCount,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderDetails,
        findOrderByTracking,
        activeTrackingSearchCode,
        setActiveTrackingSearchCode,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        settings,
        updateSettings,
        resetToDefaults,
        resetToInitialData: resetToDefaults,
        toasts,
        showToast,
        removeToast,
        startCustomizingProduct,
        startTrackingOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
