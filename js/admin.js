/* ============================================================
   COFFRUT — admin.js
   Login · Agregar productos (con foto) · Ocultar/eliminar
   ============================================================
   ⚠ IMPORTANTE: esta autenticación es solo del lado del cliente
   (suficiente para un demo o proyecto de curso). Para producción
   real se necesita un backend que valide la contraseña y guarde
   los productos en una base de datos. */

const ADMIN_PASS = "coffrut2026"; // ← cambia la contraseña aquí
const SESSION_KEY = "coffrut_admin_session";

/* ============ LOGIN ============ */
const loginScreen = document.getElementById("loginScreen");
const panel = document.getElementById("panel");
const loginForm = document.getElementById("loginForm");
const loginPass = document.getElementById("loginPass");
const loginError = document.getElementById("loginError");

function mostrarPanel() {
  loginScreen.hidden = true;
  loginScreen.style.display = "none";
  panel.hidden = false;
  initPanel();
}

if (sessionStorage.getItem(SESSION_KEY) === "ok") mostrarPanel();

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (loginPass.value === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, "ok");
    mostrarPanel();
  } else {
    loginError.hidden = false;
    loginPass.value = "";
    loginPass.focus();
    // re-disparar la animación de shake
    loginError.style.animation = "none";
    void loginError.offsetWidth;
    loginError.style.animation = "";
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ============ PANEL ============ */
let fotoBase64 = null;

function initPanel() {
  renderCategorias();
  renderLista();

  document.getElementById("prodForm").addEventListener("submit", guardarProducto);
  document.getElementById("prodFoto").addEventListener("change", cargarFoto);
  document.getElementById("btnQuitarFoto").addEventListener("click", quitarFoto);
  document.getElementById("buscar").addEventListener("input", (e) => renderLista(e.target.value));
}

function renderCategorias() {
  const sel = document.getElementById("prodCat");
  const cats = new Set([...Object.keys(MENU_BASE), ...CoffrutData.getCustom().map((p) => p.categoria)]);
  sel.innerHTML = [...cats].map((c) => `<option value="${c}">${c}</option>`).join("");
}

/* ---------- Foto: leer + comprimir a max 700px (JPEG) ---------- */
function cargarFoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 700;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      fotoBase64 = canvas.toDataURL("image/jpeg", 0.82);
      document.getElementById("fotoPreviewImg").src = fotoBase64;
      document.getElementById("fotoPreview").hidden = false;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function quitarFoto() {
  fotoBase64 = null;
  document.getElementById("prodFoto").value = "";
  document.getElementById("fotoPreview").hidden = true;
}

/* ---------- Guardar producto ---------- */
function guardarProducto(e) {
  e.preventDefault();
  const msg = document.getElementById("formMsg");
  const catNueva = document.getElementById("prodCatNueva").value.trim();
  const categoria = catNueva || document.getElementById("prodCat").value;
  const nombre = document.getElementById("prodNombre").value.trim();
  const precio = parseFloat(document.getElementById("prodPrecio").value);
  const desc = document.getElementById("prodDesc").value.trim();

  if (!categoria || !nombre || isNaN(precio) || precio < 0) {
    msg.textContent = "Completa categoría, nombre y precio válido.";
    msg.className = "prod-form__msg err";
    return;
  }

  const prod = { categoria, nombre, precio, desc, emoji: "🍽️" };
  if (fotoBase64) prod.img = fotoBase64;

  try {
    CoffrutData.addProduct(prod);
  } catch (err) {
    // localStorage lleno (las fotos en base64 ocupan espacio)
    msg.textContent = "Sin espacio de almacenamiento. Elimina productos con foto o usa imágenes más pequeñas.";
    msg.className = "prod-form__msg err";
    return;
  }

  msg.textContent = `"${nombre}" agregado a ${categoria} ✓`;
  msg.className = "prod-form__msg ok";
  e.target.reset();
  quitarFoto();
  renderCategorias();
  renderLista();
  setTimeout(() => { msg.textContent = ""; }, 3500);
}

/* ---------- Lista de productos ---------- */
function renderLista(filtro = "") {
  const cont = document.getElementById("listaProductos");
  const menu = CoffrutData.getMenu();
  const f = filtro.toLowerCase();
  let html = "";

  for (const [cat, items] of Object.entries(menu)) {
    const visibles = items.filter(
      (p) => !f || p.nombre.toLowerCase().includes(f) || (p.desc || "").toLowerCase().includes(f)
    );
    if (!visibles.length) continue;

    html += `<div class="cat-group"><h3>${cat} · ${visibles.length}</h3>`;
    html += visibles
      .map((p, i) => {
        const esBase = p.origen === "base";
        const accion = esBase
          ? `<button class="btn-admin btn-admin--warn btn-admin--sm"
               data-accion="ocultar" data-cat="${cat}" data-nombre="${p.nombre}">Ocultar</button>`
          : `<button class="btn-admin btn-admin--danger btn-admin--sm"
               data-accion="eliminar" data-id="${p.id}">Eliminar</button>`;
        return `
        <div class="prod-row" style="animation-delay:${i * 30}ms">
          <div class="prod-row__thumb">${
            p.img || p.foto
              ? `<img src="${p.img || p.foto}" alt="" loading="lazy"
                   onerror="this.parentElement.textContent='${(p.emoji || "🍽️").replace(/'/g, "")}'">`
              : p.emoji || "🍽️"
          }</div>
          <div class="prod-row__info">
            <div class="prod-row__name">${p.nombre}
              <span class="prod-row__tag ${esBase ? "prod-row__tag--base" : "prod-row__tag--custom"}">
                ${esBase ? "base" : "agregado"}
              </span>
            </div>
            <div class="prod-row__desc">${p.desc || "—"}</div>
          </div>
          <span class="prod-row__price">S/ ${p.precio.toFixed(2)}</span>
          ${accion}
        </div>`;
      })
      .join("");
    html += `</div>`;
  }

  /* Productos base ocultos → opción de restaurar */
  const ocultos = CoffrutData.getDeleted();
  if (ocultos.length && !f) {
    html += `<div class="cat-group"><h3>Ocultos de la carta · ${ocultos.length}</h3>`;
    html += ocultos
      .map((id) => {
        const [cat, nombre] = id.split("::");
        return `
        <div class="prod-row">
          <div class="prod-row__thumb">🚫</div>
          <div class="prod-row__info">
            <div class="prod-row__name">${nombre}</div>
            <div class="prod-row__desc">${cat}</div>
          </div>
          <button class="btn-admin btn-admin--primary btn-admin--sm"
            data-accion="restaurar" data-cat="${cat}" data-nombre="${nombre}">Restaurar</button>
        </div>`;
      })
      .join("");
    html += `</div>`;
  }

  cont.innerHTML = html || `<p class="lista-vacia">No se encontraron productos.</p>`;

  cont.querySelectorAll("[data-accion]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const { accion, cat, nombre, id } = btn.dataset;
      if (accion === "eliminar" && confirm(`¿Eliminar "${getNombreCustom(id)}" definitivamente?`)) {
        CoffrutData.removeCustom(id);
      } else if (accion === "ocultar" && confirm(`¿Ocultar "${nombre}" de la carta?`)) {
        CoffrutData.removeBase(cat, nombre);
      } else if (accion === "restaurar") {
        CoffrutData.restoreBase(cat, nombre);
      } else {
        return;
      }
      renderCategorias();
      renderLista(document.getElementById("buscar").value);
    })
  );
}

function getNombreCustom(id) {
  const p = CoffrutData.getCustom().find((x) => x.id === id);
  return p ? p.nombre : "este producto";
}
