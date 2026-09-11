import { Product, DesignTemplate, InventoryItem, Order, StoreSettings } from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "WA Sublimación",
  slogan: "Personalización & Sublimación de Alta Definición",
  logoUrl: "/logo.png",
  heroImageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  heroBadgeTag: "HD",
  heroBadgeTitle: "Sublimación Térmica",
  heroBadgeSubtitle: "200°C / Presión Uniforme",
  currency: "$",
  whatsappNumber: "+52 55 8765 4321",
  contactEmail: "contacto@wasublimacion.com",
  address: "Comayagua, Honduras",
  catalogTitle: "Catálogo de Productos en Existencia",
  catalogSubtitle: "Explora los artículos disponibles en stock con estampados listos para envío.",
  customCategories: [
    { id: 'all', label: 'Todos los Artículos' },
    { id: 'tazas', label: '☕ Tazas & Cerámica' },
    { id: 'textil', label: '👕 Camisetas & Hoodies' },
    { id: 'botellas_termos', label: '🥤 Botellas & Termos' },
    { id: 'accesorios_gamer', label: '🎮 Mousepads Gamer' },
    { id: 'gorras', label: '🧢 Gorras Trucker' },
    { id: 'hogar_decoracion', label: '🛋️ Cojines & Decoración' },
    { id: 'regalos_promocionales', label: '🧩 Puzzles & Llaveros' }
  ],
  bankDetails: {
    bankName: "Banco Nacional / Transferencia SPEI",
    accountNumber: "9876-5432-1098-7654",
    accountHolder: "WA Sublimacion",
    clabeOrIban: "012345678901234567"
  },
  digitalPaymentDetails: {
    type: "Zelle / SINPE Móvil / Mercado Pago / Bizum",
    identifier: "pagos@wasublimacion.com / +52 55 8765 4321",
    instructions: "Envía el comprobante con tu número de pedido de referencia para procesar de inmediato."
  },
  bannerAnnouncement: "",
  freeShippingThreshold: 50,
  standardShippingCost: 4.5,
  adminPin: "1234",
  adminEmail: "admin@wasublimacion.com",
  adminPassword: "admin1234"
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-mug-classic",
    name: "Taza de Cerámica AAA 11oz (Ultra Blanca)",
    slug: "taza-ceramica-11oz",
    category: "tazas",
    basePrice: 6.50,
    description: "Taza de cerámica premium con recubrimiento de polímero grado AAA para colores ultra brillantes y vivos. Apta para microondas y lavavajillas. Acabado brillante libre de porosidades.",
    features: [
      "Capacidad: 11 oz (325 ml)",
      "Recubrimiento de polímero importado AAA",
      "Resistente a más de 3000 lavados",
      "Estampado panorámico o doble cara",
      "Incluye caja protectora individual"
    ],
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "mug",
    linkedInventoryId: "inv-mug-white-11oz",
    variants: [
      { id: "v-mug-white", name: "Blanca Clásica", type: "color", value: "#FFFFFF", priceModifier: 0 },
      { id: "v-mug-inside-red", name: "Interior Rojo", type: "color", value: "#DC2626", priceModifier: 0.8 },
      { id: "v-mug-inside-black", name: "Interior Negro", type: "color", value: "#1E293B", priceModifier: 0.8 },
      { id: "v-mug-inside-blue", name: "Interior Azul Royal", type: "color", value: "#2563EB", priceModifier: 0.8 }
    ],
    tags: ["taza", "ceramica", "cafe", "regalo", "oficina"],
    featured: true,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "9.5 x 20 cm (Panorámico 360°)",
    rating: 4.9,
    reviewCount: 142
  },
  {
    id: "prod-mug-magic",
    name: "Taza Mágica Termosensible 11oz (Negra Mate)",
    slug: "taza-magica-termosensible",
    category: "tazas",
    basePrice: 9.50,
    description: "¡Efecto sorpresa garantizado! La taza luce de color negro oscuro mate en frío. Al verter líquido caliente (café, té, agua), el recubrimiento se vuelve transparente y revela tu diseño personalizado en alta definición.",
    features: [
      "Efecto térmico reversible instantáneo",
      "Color negro mate en reposo",
      "Capacidad: 11 oz (325 ml)",
      "Excelente regalo para aniversarios y sorpresas"
    ],
    images: [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "mug",
    linkedInventoryId: "inv-mug-magic-11oz",
    variants: [
      { id: "v-magic-matte", name: "Negro Mate", type: "finish", value: "#18181B", priceModifier: 0 },
      { id: "v-magic-glossy", name: "Negro Brillante", type: "finish", value: "#09090B", priceModifier: 0.5 }
    ],
    tags: ["taza magica", "termosensible", "sorpresa", "regalos"],
    featured: true,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "9.5 x 20 cm",
    rating: 5.0,
    reviewCount: 98
  },
  {
    id: "prod-tshirt-tacto-algodon",
    name: "Camiseta Poliéster Premium Tacto Algodón 180g",
    slug: "camiseta-tacto-algodon",
    category: "textil",
    basePrice: 14.00,
    description: "Camiseta de tejido spun poliéster con acabado extra suave y tacto idéntico al algodón peinado. La tinta de sublimación penetra directamente en las fibras, sin textura plástica, no se cuartea, no se decolora y es 100% transpirable.",
    features: [
      "Gramaje: 180 gr/m² (no trasluce)",
      "Tacto Algodón ultra suave",
      "Corte Unisex moderno / Cuello redondo reforzado",
      "Estampado sin relieve al tacto (cero acartonado)",
      "Apto para lavado a máquina continuo"
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "tshirt",
    linkedInventoryId: "inv-tshirt-white-m",
    variants: [
      { id: "v-ts-s", name: "Talla S", type: "size", value: "S", priceModifier: 0 },
      { id: "v-ts-m", name: "Talla M", type: "size", value: "M", priceModifier: 0 },
      { id: "v-ts-l", name: "Talla L", type: "size", value: "L", priceModifier: 0 },
      { id: "v-ts-xl", name: "Talla XL", type: "size", value: "XL", priceModifier: 1.5 },
      { id: "v-ts-xxl", name: "Talla XXL", type: "size", value: "XXL", priceModifier: 2.5 },
      { id: "v-ts-col-white", name: "Blanco Puro", type: "color", value: "#FFFFFF", priceModifier: 0 },
      { id: "v-ts-col-grey", name: "Gris Jaspe Claro", type: "color", value: "#E2E8F0", priceModifier: 1.0 }
    ],
    tags: ["camiseta", "playera", "ropa", "gamer", "anime", "eventos"],
    featured: true,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "Frente A3 (28 x 40 cm) o A4",
    rating: 4.8,
    reviewCount: 215
  },
  {
    id: "prod-hoodie-sublimable",
    name: "Sudadera / Hoodie Térmico con Capucha",
    slug: "hoodie-termico-sublimable",
    category: "textil",
    basePrice: 28.50,
    description: "Buzo hoodie confeccionado en tela térmica de doble faz (interior fleece afelpado y exterior de microfibra para sublimación HD). Cordones ajustables y bolsillo canguro amplio.",
    features: [
      "Interior afelpado abrigador",
      "Exterior liso de alta definición para estampado",
      "Bolsillo tipo canguro frontal",
      "Puños y pretina de rib elástico"
    ],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "hoodie",
    linkedInventoryId: "inv-hoodie-white-l",
    variants: [
      { id: "v-hd-s", name: "Talla S", type: "size", value: "S", priceModifier: 0 },
      { id: "v-hd-m", name: "Talla M", type: "size", value: "M", priceModifier: 0 },
      { id: "v-hd-l", name: "Talla L", type: "size", value: "L", priceModifier: 0 },
      { id: "v-hd-xl", name: "Talla XL", type: "size", value: "XL", priceModifier: 2.0 },
      { id: "v-hd-white", name: "Blanco Hielo", type: "color", value: "#FFFFFF", priceModifier: 0 },
      { id: "v-hd-pastel", name: "Rosa Pastel", type: "color", value: "#FCE7F3", priceModifier: 1.5 }
    ],
    tags: ["hoodie", "sudadera", "invierno", "urban", "streetwear"],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "Frente A3 o Espalda Completa",
    rating: 4.9,
    reviewCount: 76
  },
  {
    id: "prod-bottle-alu-600",
    name: "Botella Deportiva de Aluminio 600ml con Mosquetón",
    slug: "botella-deportiva-aluminio-600ml",
    category: "botellas_termos",
    basePrice: 11.50,
    description: "Botella cantimplora ecológica de aluminio ultraligero con barniz polimerizado para sublimación en colores vibrantes. Tapa a rosca con boquilla deportiva antiderrames y mosquetón para colgar en mochilas.",
    features: [
      "Capacidad: 600 ml",
      "Material: Aluminio anodizado grado alimentario (BPA Free)",
      "Incluye mosquetón metálico de sujeción",
      "Tapa doble (rosca hermética y pico deportivo)"
    ],
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "bottle",
    linkedInventoryId: "inv-bottle-alu-white",
    variants: [
      { id: "v-bot-white", name: "Blanca Esmaltada", type: "color", value: "#FFFFFF", priceModifier: 0 },
      { id: "v-bot-silver", name: "Plata Metalizada", type: "finish", value: "#CBD5E1", priceModifier: 0.5 }
    ],
    tags: ["botella", "termo", "deporte", "gym", "ciclismo", "personalizado"],
    featured: true,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "14 x 22 cm (Cilíndrica)",
    rating: 4.9,
    reviewCount: 112
  },
  {
    id: "prod-cap-trucker",
    name: "Gorra Trucker con Frente Blanco Acolchado",
    slug: "gorra-trucker-sublimable",
    category: "gorras",
    basePrice: 7.00,
    description: "Gorra clásica estilo trucker con frente de esponja de poliéster blanco para sublimación de alta nitidez y malla trasera transpirable. Cierre snapback ajustable de plástico.",
    features: [
      "Frente blanco de poliéster 100% sublimable",
      "Malla trasera de ventilación",
      "Visera curva con costuras de refuerzo",
      "Broche snapback ajustable universal"
    ],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "cap",
    linkedInventoryId: "inv-cap-trucker-black",
    variants: [
      { id: "v-cap-black", name: "Malla Negra / Frente Blanco", type: "color", value: "#000000", priceModifier: 0 },
      { id: "v-cap-red", name: "Malla Roja / Frente Blanco", type: "color", value: "#DC2626", priceModifier: 0 },
      { id: "v-cap-blue", name: "Malla Azul Marino / Frente Blanco", type: "color", value: "#1E3A8A", priceModifier: 0 }
    ],
    tags: ["gorra", "trucker", "verano", "accesorios", "marcas"],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "6.5 x 12 cm (Frente curvado)",
    rating: 4.7,
    reviewCount: 64
  },
  {
    id: "prod-mousepad-gamer-xxl",
    name: "Mousepad Gamer Profesional XXL (80x30cm) y Standard",
    slug: "mousepad-gamer-sublimado",
    category: "accesorios_gamer",
    basePrice: 8.50,
    description: "Tapete para mouse con superficie de tela micro-texturizada Speed/Control optimizada para sensores ópticos. Base de goma natural antideslizante de 3mm de grosor y bordes reforzados.",
    features: [
      "Superficie de tela microfibra de deslizamiento suave",
      "Base de caucho vulcanizado antideslizante",
      "Resistente a salpicaduras y fácil limpieza",
      "Impresión a sangre completa sin bordes blancos"
    ],
    images: [
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "mousepad",
    linkedInventoryId: "inv-mousepad-std",
    variants: [
      { id: "v-mp-std", name: "Standard (22 x 18 cm)", type: "size", value: "22x18cm", priceModifier: 0 },
      { id: "v-mp-round", name: "Circular (20 cm Ø)", type: "size", value: "20cm", priceModifier: 0.5 },
      { id: "v-mp-xxl", name: "Desk Mat XXL (80 x 30 cm)", type: "size", value: "80x30cm", priceModifier: 11.0 }
    ],
    tags: ["mousepad", "gamer", "setup", "pc", "anime", "oficina"],
    featured: true,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "Área total 100% de impresión",
    rating: 5.0,
    reviewCount: 189
  },
  {
    id: "prod-pillow-deco",
    name: "Cojín Decorativo Cuadrado 40x40cm con Relleno",
    slug: "cojin-decorativo-sublimado",
    category: "hogar_decoracion",
    basePrice: 12.00,
    description: "Funda de cojín en tela poliéster satinada o lino sublimable con cremallera invisible. Incluye relleno de fibra siliconada antialérgica de alto rebote. Ideal para fotos familiares, mascotas y dedicatorias.",
    features: [
      "Medida: 40 x 40 cm",
      "Cremallera invisible inferior para fácil lavado",
      "Incluye relleno de vellón siliconado mullido",
      "Estampado nítido a todo color en ambas caras opcional"
    ],
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "pillow",
    linkedInventoryId: "inv-pillow-blank-40",
    variants: [
      { id: "v-pil-satin", name: "Satín Suave Brillante", type: "finish", value: "Satin", priceModifier: 0 },
      { id: "v-pil-lino", name: "Tacto Lino Rústico", type: "finish", value: "Lino", priceModifier: 1.5 }
    ],
    tags: ["cojin", "almohada", "hogar", "parejas", "mascotas", "decoracion"],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "38 x 38 cm",
    rating: 4.8,
    reviewCount: 53
  },
  {
    id: "prod-puzzle-a4",
    name: "Rompecabezas Sublimable A4 (120 piezas con base)",
    slug: "rompecabezas-sublimable-a4",
    category: "regalos_promocionales",
    basePrice: 7.50,
    description: "Rompecabezas de cartón prensado rígido con acabado aperlado brillante. Perfecto para propuestas de matrimonio, anuncios de embarazo, recuerdos de cumpleaños y collages fotográficos.",
    features: [
      "120 piezas troqueladas con precisión",
      "Tamaño A4 (20 x 29 cm)",
      "Incluye base rígida de apoyo y bolsita de organza",
      "Acabado satinado de alto contraste"
    ],
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "puzzle",
    linkedInventoryId: "inv-puzzle-a4",
    variants: [
      { id: "v-puz-a4", name: "Formato A4 (120 pzs)", type: "size", value: "A4", priceModifier: 0 },
      { id: "v-puz-heart", name: "Forma de Corazón (75 pzs)", type: "size", value: "Heart", priceModifier: 1.0 }
    ],
    tags: ["rompecabezas", "puzzle", "fotos", "amor", "aniversario"],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "A4 Completo (20 x 29 cm)",
    rating: 4.9,
    reviewCount: 47
  },
  {
    id: "prod-keychain-polymer",
    name: "Llavero de Polímero Doble Cara con Aro Metálico",
    slug: "llavero-polimero-doble-cara",
    category: "regalos_promocionales",
    basePrice: 3.50,
    description: "Llavero de polímero de alta resistencia irrompible con acabado brillante ultra nítido. Estampado a full color por ambos lados. Descuentos por volumen para eventos corporativos y recuerdos.",
    features: [
      "Material: Polímero indeformable de 4mm",
      "Estampado en ambas caras incluido",
      "Herraje de argolla sin fin niquelada",
      "Empaque individual sellado"
    ],
    images: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80"
    ],
    mockupType: "keychain",
    linkedInventoryId: "inv-keychain-poly",
    variants: [
      { id: "v-key-rect", name: "Rectangular (4x6 cm)", type: "material", value: "Rectangular", priceModifier: 0 },
      { id: "v-key-round", name: "Circular (5 cm Ø)", type: "material", value: "Circular", priceModifier: 0 },
      { id: "v-key-heart", name: "Corazón (5x5 cm)", type: "material", value: "Corazon", priceModifier: 0.3 }
    ],
    tags: ["llavero", "souvenir", "corporativo", "merchandising"],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: "Ambas caras completas",
    rating: 4.6,
    reviewCount: 38
  }
];

export const INITIAL_DESIGN_TEMPLATES: DesignTemplate[] = [
  // --- TAZAS ESPECÍFICAS & MULTI ---
  {
    id: "des-coffee-first",
    title: "Primero Café, Luego Tu Opinión",
    category: "frases",
    tags: ["taza", "cafe", "humor", "oficina", "sarcasmo"],
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "bottle"],
    popular: true
  },
  {
    id: "des-mug-anime-ramen",
    title: "Gatito Neko Ramen & Boba Tea",
    category: "anime",
    tags: ["taza", "anime", "kawaii", "ramen", "neko", "japon"],
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "bottle", "mousepad"],
    popular: true
  },
  {
    id: "des-mug-magic-galaxy",
    title: "Galaxia Cósmica & Nebulosa Estelar",
    category: "gaming",
    tags: ["taza", "galaxia", "universo", "estrellas", "magica"],
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "mousepad", "bottle"],
    popular: true
  },
  {
    id: "des-mug-best-dad-mom",
    title: "Súper Papá / Mejor Mamá del Universo",
    category: "parejas",
    tags: ["taza", "familia", "papa", "mama", "amor", "regalo"],
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "pillow", "keychain"],
    popular: true
  },
  {
    id: "des-mug-developer-code",
    title: "Eat Sleep Code Repeat // Programador",
    category: "gaming",
    tags: ["taza", "developer", "codigo", "programacion", "tecnologia"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "mousepad", "tshirt"],
    popular: true
  },
  {
    id: "des-mug-doctor-nurse",
    title: "Medicina & Vocación de Salvar Vidas",
    category: "empresas",
    tags: ["taza", "medicina", "doctor", "enfermera", "profesion"],
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "bottle", "keychain"],
    popular: false
  },
  {
    id: "des-love-spotify",
    title: "Código Canción Spotify + Amor Infinito",
    category: "parejas",
    tags: ["taza", "parejas", "amor", "aniversario", "musica", "spotify"],
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "pillow", "puzzle", "keychain", "tshirt"],
    popular: true
  },
  {
    id: "des-pet-hero",
    title: "Retrato Real Realeza para Mascotas",
    category: "mascotas",
    tags: ["taza", "mascotas", "perros", "gatos", "retrato", "vintage"],
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "pillow", "tshirt", "mousepad", "puzzle"],
    popular: true
  },
  {
    id: "des-grad-2026",
    title: "Orgullo Graduado - Edición Promoción 2026",
    category: "festividades",
    tags: ["taza", "graduacion", "promocion", "logro", "fiesta"],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mug", "tshirt", "bottle", "pillow"],
    popular: false
  },

  // --- TEXTIL ESPECÍFICO (CAMISETAS & HOODIES) ---
  {
    id: "des-anime-cyber",
    title: "Cyber Samurai & Neon Tokyo",
    category: "anime",
    tags: ["playera", "hoodie", "anime", "samurai", "cyberpunk", "neon"],
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["tshirt", "hoodie", "mousepad"],
    popular: true
  },
  {
    id: "des-rock-classic",
    title: "Vintage Rock Legends & Electric Guitar",
    category: "musica",
    tags: ["playera", "hoodie", "musica", "rock", "guitarra", "vintage"],
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["tshirt", "hoodie", "mug"],
    popular: true
  },
  {
    id: "des-textil-gym-iron",
    title: "Iron Beast Gym & Heavy Lifting",
    category: "gaming",
    tags: ["playera", "hoodie", "gym", "fitness", "motivacion", "deporte"],
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["tshirt", "hoodie", "bottle"],
    popular: true
  },
  {
    id: "des-textil-minimal-nature",
    title: "Aura Montaña & Bosque Minimalista",
    category: "festividades",
    tags: ["playera", "hoodie", "naturaleza", "minimalista", "montana"],
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["tshirt", "hoodie", "bottle"],
    popular: false
  },

  // --- BOTELLAS & TERMOS ---
  {
    id: "des-bottle-outdoor-wild",
    title: "Wild Explorer & Mountain Adventure",
    category: "festividades",
    tags: ["botella", "termo", "aventura", "camping", "outdoor", "montana"],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["bottle", "cap"],
    popular: true
  },
  {
    id: "des-bottle-hydro-fitness",
    title: "Hydration Mode: 100% Active Energy",
    category: "gaming",
    tags: ["botella", "termo", "deporte", "fitness", "agua", "entrenamiento"],
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["bottle"],
    popular: true
  },
  {
    id: "des-business-minimal",
    title: "Logo Corporativo & Executive Branding",
    category: "empresas",
    tags: ["botella", "taza", "empresas", "logo", "corporativo", "minimalista"],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["bottle", "mug", "cap", "tshirt", "keychain"],
    popular: false
  },

  // --- MOUSEPADS GAMER ---
  {
    id: "des-gamer-eat-sleep",
    title: "Eat Sleep Game Repeat (Retro Arcade)",
    category: "gaming",
    tags: ["mousepad", "gaming", "gamer", "arcade", "retro", "pixel"],
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mousepad", "tshirt", "mug", "cap"],
    popular: true
  },
  {
    id: "des-mousepad-synthwave",
    title: "Neon Synthwave Skyline 80s Grid",
    category: "gaming",
    tags: ["mousepad", "synthwave", "retrowave", "neon", "sunset"],
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mousepad"],
    popular: true
  },
  {
    id: "des-mousepad-topographic",
    title: "Topographic Minimalist Dark Mode Map",
    category: "gaming",
    tags: ["mousepad", "topografia", "setup", "minimalista", "black"],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["mousepad"],
    popular: true
  },

  // --- GORRAS TRUCKER ---
  {
    id: "des-cap-vintage-badge",
    title: "Vintage Garage & Custom Motorcycles",
    category: "empresas",
    tags: ["gorra", "vintage", "moto", "garage", "custom"],
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["cap", "tshirt"],
    popular: true
  },
  {
    id: "des-cap-urban-wave",
    title: "Japanese Great Wave Minimalist",
    category: "anime",
    tags: ["gorra", "ola", "japon", "minimalista", "kanji"],
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["cap", "tshirt"],
    popular: true
  },

  // --- COJINES & ROMPECABEZAS ---
  {
    id: "des-pillow-nordic-home",
    title: "Hogar Dulce Hogar & Calidez Nórdica",
    category: "parejas",
    tags: ["cojin", "hogar", "decoracion", "amor", "frases"],
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["pillow"],
    popular: true
  },
  {
    id: "des-puzzle-memories-collage",
    title: "Collage Fotográfico Recuerdos Familiares",
    category: "parejas",
    tags: ["rompecabezas", "puzzle", "familia", "recuerdos", "fotos"],
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
    compatibleMockups: ["puzzle", "keychain"],
    popular: true
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-mug-white-11oz",
    sku: "BLA-TAZ-001",
    name: "Tazas Blancas Cerámica 11oz Grado AAA (Caja x 36)",
    category: "blancos_ceramica",
    currentStock: 144,
    minStockAlert: 36,
    unitCost: 1.85,
    unit: "unidades",
    supplier: "Cerámicas Sublimex",
    location: "Estante A-1",
    lastUpdated: "2026-08-18",
    notes: "Polímero de alta absorción, lote agosto 2026"
  },
  {
    id: "inv-mug-magic-11oz",
    sku: "BLA-TAZ-002",
    name: "Tazas Mágicas Negras Termosensibles 11oz",
    category: "blancos_ceramica",
    currentStock: 28,
    minStockAlert: 20,
    unitCost: 3.20,
    unit: "unidades",
    supplier: "Cerámicas Sublimex",
    location: "Estante A-2",
    lastUpdated: "2026-08-15"
  },
  {
    id: "inv-tshirt-white-m",
    sku: "BLA-TEX-010",
    name: "Camisetas Spun Poliéster Tacto Algodón Blancas (Talla M)",
    category: "blancos_textil",
    currentStock: 52,
    minStockAlert: 25,
    unitCost: 3.80,
    unit: "unidades",
    supplier: "Textiles SubliTex",
    location: "Bodega Textil B-1",
    lastUpdated: "2026-08-19"
  },
  {
    id: "inv-tshirt-white-l",
    sku: "BLA-TEX-011",
    name: "Camisetas Spun Poliéster Tacto Algodón Blancas (Talla L)",
    category: "blancos_textil",
    currentStock: 40,
    minStockAlert: 25,
    unitCost: 3.80,
    unit: "unidades",
    supplier: "Textiles SubliTex",
    location: "Bodega Textil B-1",
    lastUpdated: "2026-08-19"
  },
  {
    id: "inv-hoodie-white-l",
    sku: "BLA-TEX-030",
    name: "Hoodies Térmicos Blancos con Capucha (Talla L)",
    category: "blancos_textil",
    currentStock: 8,
    minStockAlert: 10,
    unitCost: 11.50,
    unit: "unidades",
    supplier: "Confecciones Andinas",
    location: "Bodega Textil B-3",
    lastUpdated: "2026-08-12",
    notes: "¡Alerta! Stock por debajo del mínimo para reposición."
  },
  {
    id: "inv-bottle-alu-white",
    sku: "BLA-ALU-005",
    name: "Botellas Deportivas Aluminio 600ml con Mosquetón",
    category: "blancos_aluminio",
    currentStock: 35,
    minStockAlert: 15,
    unitCost: 3.40,
    unit: "unidades",
    supplier: "AlumPro Promocionales",
    location: "Estante C-1",
    lastUpdated: "2026-08-16"
  },
  {
    id: "inv-cap-trucker-black",
    sku: "BLA-GOR-001",
    name: "Gorras Trucker Malla Negra Frente Blanco",
    category: "blancos_textil",
    currentStock: 48,
    minStockAlert: 20,
    unitCost: 1.90,
    unit: "unidades",
    supplier: "Headwear Import",
    location: "Estante C-2",
    lastUpdated: "2026-08-14"
  },
  {
    id: "inv-mousepad-std",
    sku: "BLA-POL-008",
    name: "Mousepad Blanco Sublimable 22x18cm Base Antideslizante",
    category: "blancos_polimero",
    currentStock: 65,
    minStockAlert: 20,
    unitCost: 1.40,
    unit: "unidades",
    supplier: "PolymerTech",
    location: "Cajonera D-1",
    lastUpdated: "2026-08-17"
  },
  {
    id: "inv-pillow-blank-40",
    sku: "BLA-TEX-050",
    name: "Fundas de Cojín 40x40cm Satín con Cierre Invisible",
    category: "blancos_textil",
    currentStock: 19,
    minStockAlert: 15,
    unitCost: 2.10,
    unit: "unidades",
    supplier: "Textiles SubliTex",
    location: "Cajonera D-2",
    lastUpdated: "2026-08-10"
  },
  {
    id: "inv-puzzle-a4",
    sku: "BLA-POL-020",
    name: "Rompecabezas Sublimable Cartón Rígido A4 120 pzs",
    category: "blancos_polimero",
    currentStock: 24,
    minStockAlert: 10,
    unitCost: 1.65,
    unit: "unidades",
    supplier: "PolymerTech",
    location: "Cajonera D-3",
    lastUpdated: "2026-08-11"
  },
  {
    id: "inv-keychain-poly",
    sku: "BLA-POL-030",
    name: "Llaveros Polímero Rectangulares Doble Cara con Argolla",
    category: "blancos_polimero",
    currentStock: 110,
    minStockAlert: 40,
    unitCost: 0.55,
    unit: "unidades",
    supplier: "PolymerTech",
    location: "Gaveta E-1",
    lastUpdated: "2026-08-18"
  },
  {
    id: "inv-subli-paper-a4",
    sku: "INS-PAP-001",
    name: "Papel de Sublimación Secado Rápido A4 100gr (Paquete 100 hojas)",
    category: "tintas_papel",
    currentStock: 14,
    minStockAlert: 5,
    unitCost: 6.80,
    unit: "cajas",
    supplier: "ColorHD Supplies",
    location: "Estante Insumos I-1",
    lastUpdated: "2026-08-15"
  },
  {
    id: "inv-subli-ink-cmyk",
    sku: "INS-TIN-002",
    name: "Kit de Tintas de Sublimación CMYK UltraChrome (4x100ml)",
    category: "tintas_papel",
    currentStock: 6,
    minStockAlert: 3,
    unitCost: 22.00,
    unit: "unidades",
    supplier: "ColorHD Supplies",
    location: "Estante Insumos I-2",
    lastUpdated: "2026-08-10"
  },
  {
    id: "inv-thermal-tape",
    sku: "INS-CIN-005",
    name: "Cinta Térmica Resistente a Altas Temperaturas (Rollo 33m)",
    category: "empaques_cintas",
    currentStock: 9,
    minStockAlert: 4,
    unitCost: 1.90,
    unit: "rollos",
    supplier: "ColorHD Supplies",
    location: "Mesa de Planchado",
    lastUpdated: "2026-08-17"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    trackingCode: "SUBLI-7821",
    createdAt: "2026-08-20T10:15:00.000Z",
    customer: {
      name: "Valeria Morales",
      email: "valeria.morales@gmail.com",
      phone: "+52 55 9812 3456",
      address: "Calle Los Pinos 142, Depto 302",
      city: "Ciudad Creativa",
      notes: "Es un regalo de cumpleaños para el sábado, por favor cuidar los detalles de la caja."
    },
    items: [
      {
        cartItemId: "item-1",
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        selectedVariants: { color: "Blanca Clásica" },
        customDesign: {
          selectedTemplateId: "des-love-spotify",
          customText: "Nuestra Canción - 15/02/2024",
          textColor: "#000000",
          fontFamily: "sans-serif",
          position: "panoramico",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          uploadedImageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
          specialInstructions: "Centrar bien el código de barras y la dedicatoria en la parte posterior."
        },
        unitPrice: 6.50,
        totalPrice: 13.00
      },
      {
        cartItemId: "item-2",
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedVariants: { finish: "Satín Suave Brillante" },
        customDesign: {
          customText: "Valeria & Mateo Por Siempre",
          textColor: "#BE185D",
          position: "frente",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          uploadedImageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80"
        },
        unitPrice: 12.00,
        totalPrice: 12.00
      }
    ],
    subtotal: 25.00,
    shippingCost: 4.50,
    discount: 0,
    totalAmount: 29.50,
    status: "sublimando",
    paymentStatus: "verificado",
    paymentMethod: "transferencia",
    paymentProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    timeline: [
      {
        status: "recibido",
        timestamp: "2026-08-20T10:15:00.000Z",
        title: "Pedido Registrado con Éxito",
        note: "El pedido ingresó al sistema y se recibió el comprobante de transferencia bancaria."
      },
      {
        status: "arte_aprobacion",
        timestamp: "2026-08-20T11:00:00.000Z",
        title: "Arte y Diseño Calibrado para Impresión",
        note: "Diseño vectorial ajustado al perfil de color CMYK de sublimación."
      },
      {
        status: "sublimando",
        timestamp: "2026-08-20T12:30:00.000Z",
        title: "En Plancha Térmica y Transferencia",
        note: "Actualmente en proceso de sublimación a 200°C con presión controlada."
      }
    ],
    estimatedDelivery: "2026-08-22",
    internalAdminNotes: "Listo para pasar a control de calidad y empaque de regalo."
  },
  {
    id: "ord-1002",
    trackingCode: "SUBLI-9430",
    createdAt: "2026-08-19T16:40:00.000Z",
    customer: {
      name: "Carlos Méndez (Pixel Gaming Clan)",
      email: "carlos.gamer@clanpixel.io",
      phone: "+52 55 4321 8765",
      address: "Av. Tecnológica 880, Int 4",
      city: "Guadalajara",
      notes: "Logotipo del equipo centrado con colores neón muy vivos."
    },
    items: [
      {
        cartItemId: "item-3",
        product: INITIAL_PRODUCTS[6],
        quantity: 3,
        selectedVariants: { size: "Desk Mat XXL (80 x 30 cm)" },
        customDesign: {
          selectedTemplateId: "des-gamer-eat-sleep",
          customText: "PIXEL GAMING SQUAD 2026",
          textColor: "#06B6D4",
          position: "frente",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          uploadedImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
        },
        unitPrice: 19.50,
        totalPrice: 58.50
      },
      {
        cartItemId: "item-4",
        product: INITIAL_PRODUCTS[2],
        quantity: 3,
        selectedVariants: { size: "Talla L", color: "Blanco Puro" },
        customDesign: {
          selectedTemplateId: "des-gamer-eat-sleep",
          customText: "CMENDEZ #01",
          textColor: "#0891B2",
          position: "ambos",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0
        },
        unitPrice: 14.00,
        totalPrice: 42.00
      }
    ],
    subtotal: 100.50,
    shippingCost: 0, // Free shipping > $50
    discount: 5.00,
    totalAmount: 95.50,
    status: "listo_despacho",
    paymentStatus: "verificado",
    paymentMethod: "sinpe_zelle_bizum",
    timeline: [
      {
        status: "recibido",
        timestamp: "2026-08-19T16:40:00.000Z",
        title: "Pedido Recibido",
        note: "Pago vía Zelle confirmado."
      },
      {
        status: "arte_aprobacion",
        timestamp: "2026-08-19T17:30:00.000Z",
        title: "Arte Aprobado por el Cliente",
        note: "Alineación de logotipos y nombres de gamertag confirmados."
      },
      {
        status: "sublimando",
        timestamp: "2026-08-20T09:10:00.000Z",
        title: "Sublimación Completa",
        note: "Mousepads XXL y playeras estampadas con nitidez premium."
      },
      {
        status: "control_calidad",
        timestamp: "2026-08-20T11:45:00.000Z",
        title: "Control de Calidad Aprobado",
        note: "Inspección de bordes, fidelidad de color y doblado profesional."
      },
      {
        status: "listo_despacho",
        timestamp: "2026-08-20T13:00:00.000Z",
        title: "Listo para Envío / Guía Generada",
        note: "Empacado en caja con precinto de seguridad, esperando recolección de paquetería."
      }
    ],
    estimatedDelivery: "2026-08-21",
    trackingCarrier: "DHL Express",
    trackingShippingNumber: "DHL-9842189034",
    internalAdminNotes: "Cliente corporativo gamer frecuente. Se incluyeron 3 llaveros de cortesía."
  },
  {
    id: "ord-1003",
    trackingCode: "SUBLI-5519",
    createdAt: "2026-08-18T09:20:00.000Z",
    customer: {
      name: "Dra. Andrea Salgado",
      email: "andrea.salgado@clinica.com",
      phone: "+52 55 1122 3344",
      address: "Torre Médica Sur, Consultorio 410",
      city: "Monterrey"
    },
    items: [
      {
        cartItemId: "item-5",
        product: INITIAL_PRODUCTS[1], // Taza magica
        quantity: 1,
        selectedVariants: { finish: "Negro Mate" },
        customDesign: {
          selectedTemplateId: "des-coffee-first",
          customText: "Dra. Salgado - Pediatría & Amor",
          textColor: "#000000",
          position: "panoramico",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0
        },
        unitPrice: 9.50,
        totalPrice: 9.50
      },
      {
        cartItemId: "item-6",
        product: INITIAL_PRODUCTS[4], // Botella alu
        quantity: 1,
        selectedVariants: { finish: "Blanca Esmaltada" },
        customDesign: {
          customText: "Dra. Andrea Salgado",
          textColor: "#0284C7",
          position: "frente",
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0
        },
        unitPrice: 11.50,
        totalPrice: 11.50
      }
    ],
    subtotal: 21.00,
    shippingCost: 4.50,
    discount: 0,
    totalAmount: 25.50,
    status: "entregado",
    paymentStatus: "verificado",
    paymentMethod: "tarjeta",
    timeline: [
      {
        status: "recibido",
        timestamp: "2026-08-18T09:20:00.000Z",
        title: "Pedido Recibido",
        note: "Pago procesado con tarjeta."
      },
      {
        status: "arte_aprobacion",
        timestamp: "2026-08-18T10:00:00.000Z",
        title: "Diseño Aprobado",
        note: "Texto médico validado."
      },
      {
        status: "sublimando",
        timestamp: "2026-08-18T14:20:00.000Z",
        title: "Sublimación Terminada",
        note: "Taza mágica y botella estampadas."
      },
      {
        status: "control_calidad",
        timestamp: "2026-08-18T17:00:00.000Z",
        title: "Calidad Verificada",
        note: "Prueba térmica de taza mágica 100% funcional."
      },
      {
        status: "listo_despacho",
        timestamp: "2026-08-19T08:30:00.000Z",
        title: "En Reparto Local",
        note: "Mensajero asignado para entrega directa."
      },
      {
        status: "entregado",
        timestamp: "2026-08-19T13:45:00.000Z",
        title: "Entregado Satisfactoriamente",
        note: "Recibido en recepción de consultorio. ¡Cliente encantada!"
      }
    ],
    estimatedDelivery: "2026-08-19",
    trackingCarrier: "Mensajería Express Local",
    trackingShippingNumber: "LOC-2026-881"
  }
];
