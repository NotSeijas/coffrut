/* ============================================================
   COFFRUT — data.js
   Carta base + capa de datos (localStorage)
   Compartido entre index.html (cliente) y admin.html (admin)
   ============================================================ */

/* ---------- CARTA BASE ----------
   Productos confirmados de la carta oficial.
   ⚠ Los marcados con "editar: true" son estimados — puedes
   corregirlos aquí o eliminarlos/recrearlos desde el panel admin. */
const MENU_BASE = {
  "Paninos": [
    { nombre: "Panini de Pollo", foto: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=600&q=80",   precio: 9.90, desc: "Lechuga + pollo + tomate", emoji: "🥖" },
    { nombre: "Panini Mixto", foto: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80",      precio: 8.50, desc: "Jamón + queso edam", emoji: "🥪" },
    { nombre: "Panini al Natural", foto: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&q=80", precio: 8.90, desc: "Palta + tomate + lechuga", emoji: "🥑" },
    { nombre: "Caprese", foto: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80",           precio: 8.90, desc: "Mozzarella + tomate + albahaca", emoji: "🍅" },
  ],
  "Sandwich": [
    { nombre: "Triple Clásico", foto: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=80",        precio: 7.50,  desc: "Pollo + jamón + queso", emoji: "🥪" },
    { nombre: "Triple Nutritivo", foto: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",      precio: 7.50,  desc: "Palta + huevo + tomate", emoji: "🥚" },
    { nombre: "Emparedado de Pollo", foto: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600&q=80",   precio: 9.90,  desc: "Pollo + queso edam", emoji: "🍗" },
    { nombre: "Triple Tropical", foto: "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=600&q=80",       precio: 7.90,  desc: "Pollo + jamón + fruta", emoji: "🍍" },
    { nombre: "Sanguchito de Pollo", foto: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&q=80",   precio: 7.90,  desc: "Pollo + tomate + lechuga", emoji: "🥬" },
    { nombre: "Club Sandwich", foto: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600&q=80",         precio: 15.90, desc: "Jamón + queso + pollo + palta + tomate", emoji: "🥓" },
    { nombre: "Sandwich Mixto Casero", foto: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80", precio: 7.50,  desc: "Jamón + queso, tostado al momento", emoji: "🧀" },
    { nombre: "Triple Vegetariano", foto: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=600&q=80",    precio: 7.90,  desc: "Aceituna + palta + tomate", emoji: "🫒" },
  ],
  "Croissant": [
    { nombre: "Ciabatta Potente", foto: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80", precio: 12.90, desc: "Pollo a la plancha + tocino + queso edam + lechuga + tomate", emoji: "🥖" },
    { nombre: "Mixto Montado", foto: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",    precio: 12.90, desc: "Full queso y jamón + huevo a la inglesa", emoji: "🍳" },
    { nombre: "Montecristo", foto: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80",      precio: 12.90, desc: "Pan blanco revuelto en huevo + jamón + queso", emoji: "🥐" },
  ],
  "Frutados": [
    { nombre: "Ensalada de Frutas", foto: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&q=80", precio: 9.90,  desc: "Fruta fresca de estación + miel", emoji: "🍓", editar: true },
    { nombre: "Copa Frutada", foto: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",       precio: 11.90, desc: "Fruta + yogurt + granola en capas", emoji: "🍨", editar: true },
    { nombre: "Bowl Tropical", foto: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",      precio: 13.90, desc: "Kiwi + mango + fresa + arándanos + chía", emoji: "🥝", editar: true },
  ],
  "Hamburguesas": [
    { nombre: "Hamburguesa Clásica", foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", precio: 11.90, desc: "Carne + lechuga + tomate + papas", emoji: "🍔", editar: true },
    { nombre: "Hamburguesa de Pollo", foto: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80", precio: 11.90, desc: "Pollo a la plancha + queso + verduras", emoji: "🍔", editar: true },
    { nombre: "Hamburguesa Royal", foto: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",   precio: 14.90, desc: "Carne + huevo + queso + tocino", emoji: "🍔", editar: true },
  ],
  "Comida Saludable": [
    { nombre: "Pollo a la Plancha con Verduras", foto: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80", precio: 17.90, desc: "Brócoli, zanahoria y beterraga al vapor + papa amarilla sancochada", emoji: "🍗" },
    { nombre: "Ensalada César", foto: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",                  precio: 14.90, desc: "Verdura fresca + queso regional + tiras de pollo y tostadas", emoji: "🥗" },
    { nombre: "Poke Bowl Pollo", foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",                 precio: 15.90, desc: "Base de arroz, quinoa o mix de verduras + proteína salteada + fruta fresca + palta", emoji: "🍚" },
    { nombre: "Salteado de Pollo con Quinoa", foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",    precio: 18.90, desc: "Pollo al wok con verduras frescas y quinoa dorada", emoji: "🥘" },
  ],
  "Salteados": [
    { nombre: "Lomo Saltado", foto: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",          precio: 18.90, desc: "Clásico lomo con papas fritas y arroz", emoji: "🥩", editar: true },
    { nombre: "Pollo Saltado", foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",         precio: 16.90, desc: "Pollo al wok con cebolla y tomate", emoji: "🍗", editar: true },
    { nombre: "Tallarín Saltado", foto: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",      precio: 16.90, desc: "Tallarines al wok estilo criollo", emoji: "🍜", editar: true },
  ],
  "Pastas": [
    { nombre: "Pasta Alfredo", foto: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&q=80",     precio: 15.90, desc: "Salsa cremosa + pollo a la plancha", emoji: "🍝", editar: true },
    { nombre: "Pasta a la Huancaína", foto: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", precio: 15.90, desc: "Salsa huancaína + tiras de pollo", emoji: "🍝", editar: true },
    { nombre: "Pasta al Pesto", foto: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",    precio: 15.90, desc: "Albahaca fresca + parmesano", emoji: "🌿", editar: true },
  ],
  "Jugos & Café": [
    { nombre: "Jugo de Naranja", foto: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80",  precio: 7.50, desc: "Exprimido al momento", emoji: "🍊", editar: true },
    { nombre: "Jugo Surtido", foto: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80",     precio: 8.50, desc: "Mix de frutas de la región", emoji: "🍹", editar: true },
    { nombre: "Batido de Fresa", foto: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80",  precio: 9.50, desc: "Fresa + leche, cremoso y frío", emoji: "🍓", editar: true },
    { nombre: "Detox Verde", foto: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&q=80",      precio: 9.90, desc: "Piña + apio + espinaca + jengibre", emoji: "🥬", editar: true },
    { nombre: "Cappuccino", foto: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",       precio: 8.00, desc: "Café espresso + leche espumada", emoji: "☕", editar: true },
    { nombre: "Café Americano", foto: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",   precio: 6.00, desc: "Café de la región, recién pasado", emoji: "☕", editar: true },
  ],
};

/* ---------- CAPA DE DATOS ----------
   localStorage guarda:
   - coffrut_custom : productos agregados desde el admin
   - coffrut_deleted: ids de productos base eliminados desde el admin
   El id de un producto base es "Categoría::Nombre". */

const STORE_CUSTOM = "coffrut_custom";
const STORE_DELETED = "coffrut_deleted";

const CoffrutData = {
  baseId: (cat, nombre) => `${cat}::${nombre}`,

  getCustom() {
    try { return JSON.parse(localStorage.getItem(STORE_CUSTOM)) || []; }
    catch { return []; }
  },
  saveCustom(list) {
    localStorage.setItem(STORE_CUSTOM, JSON.stringify(list));
  },

  getDeleted() {
    try { return JSON.parse(localStorage.getItem(STORE_DELETED)) || []; }
    catch { return []; }
  },
  saveDeleted(list) {
    localStorage.setItem(STORE_DELETED, JSON.stringify(list));
  },

  addProduct(prod) {
    const list = this.getCustom();
    prod.id = "c_" + Date.now();
    list.push(prod);
    this.saveCustom(list);
    return prod;
  },

  removeCustom(id) {
    this.saveCustom(this.getCustom().filter((p) => p.id !== id));
  },

  removeBase(cat, nombre) {
    const del = this.getDeleted();
    const id = this.baseId(cat, nombre);
    if (!del.includes(id)) { del.push(id); this.saveDeleted(del); }
  },

  restoreBase(cat, nombre) {
    this.saveDeleted(this.getDeleted().filter((d) => d !== this.baseId(cat, nombre)));
  },

  /* Carta final: base − eliminados + agregados */
  getMenu() {
    const deleted = this.getDeleted();
    const menu = {};
    for (const [cat, items] of Object.entries(MENU_BASE)) {
      menu[cat] = items
        .filter((p) => !deleted.includes(this.baseId(cat, p.nombre)))
        .map((p) => ({ ...p, origen: "base" }));
    }
    for (const p of this.getCustom()) {
      if (!menu[p.categoria]) menu[p.categoria] = [];
      menu[p.categoria].push({ ...p, origen: "custom" });
    }
    // Quitar categorías que quedaron vacías
    for (const cat of Object.keys(menu)) {
      if (menu[cat].length === 0) delete menu[cat];
    }
    return menu;
  },

  getCategorias() {
    return Object.keys(this.getMenu());
  },
};
