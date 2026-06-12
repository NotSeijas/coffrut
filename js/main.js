/* ============================================================
   COFFRUT — main.js  (vista cliente)
   Splash · Carrusel · Tabs de la carta · Scroll reveal · Contadores
   Los datos de la carta vienen de js/data.js (CoffrutData)
   ============================================================ */

/* ============ PANTALLA DE CARGA ============ */
(function splash() {
  const el = document.getElementById("splash");
  if (!el) return;
  const MIN_MS = 2200; // tiempo mínimo visible para que se aprecie la animación
  const t0 = performance.now();

  function ocultar() {
    const restante = Math.max(0, MIN_MS - (performance.now() - t0));
    setTimeout(() => {
      el.classList.add("splash--out");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
    }, restante);
  }

  // En móvil/caché la página puede estar ya cargada cuando corre este script
  if (document.readyState === "complete") ocultar();
  else window.addEventListener("load", ocultar);
})();

/* Destacados del carrusel: se buscan por nombre en la carta,
   así heredan automáticamente su foto y precio actuales. */
const FAVORITOS_NOMBRES = [
  { nombre: "Poke Bowl Pollo",  destaque: "Arroz o quinoa + pollo salteado + palta + fruta fresca" },
  { nombre: "Club Sandwich",    destaque: "El más completo: jamón, queso, pollo, palta y tomate" },
  { nombre: "Copa Frutada",     destaque: "Capas de fruta, yogurt y granola crocante" },
  { nombre: "Panini de Pollo",  destaque: "Pan tostado a la parrilla con pollo y verduras" },
  { nombre: "Detox Verde",      destaque: "El favorito de los que se cuidan" },
  { nombre: "Montecristo",      destaque: "Pan al huevo dorado con jamón y queso" },
];

const FAVORITOS = (() => {
  const todos = Object.values(CoffrutData.getMenu()).flat();
  return FAVORITOS_NOMBRES.map(({ nombre, destaque }) => {
    const p = todos.find((x) => x.nombre === nombre);
    return p ? { ...p, desc: destaque } : null;
  }).filter(Boolean);
})();

const fmt = (n) => `S/ ${n.toFixed(2)}`;

/* Imagen del producto con fallback:
   1° foto subida desde admin (img, base64)
   2° foto de internet (foto, URL) — si falla, muestra el emoji
   3° emoji */
function imgProducto(p) {
  const src = p.img || p.foto;
  if (!src) return p.emoji || "🍽️";
  const emoji = (p.emoji || "🍽️").replace(/'/g, "");
  return `<img src="${src}" alt="${p.nombre}" loading="lazy"
            onerror="this.parentElement.textContent='${emoji}'">`;
}

/* ============ NAVBAR ============ */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navBurger = document.getElementById("navBurger");

window.addEventListener("scroll", () => {
  nav.classList.toggle("nav--solid", window.scrollY > 40);
}, { passive: true });

navBurger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navBurger.classList.toggle("open", open);
  navBurger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navBurger.classList.remove("open");
  })
);

/* ============ PARTÍCULAS DEL HERO ============ */
(function particles() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cont = document.getElementById("heroParticles");
  const emojis = ["🍊", "🍓", "🥝", "🍍", "🫐", "🍋", "☕", "🥑"];
  const total = innerWidth < 640 ? 10 : 18;
  for (let i = 0; i < total; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = emojis[i % emojis.length];
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--size", `${16 + Math.random() * 22}px`);
    p.style.setProperty("--dur", `${12 + Math.random() * 14}s`);
    p.style.setProperty("--delay", `${-Math.random() * 20}s`);
    cont.appendChild(p);
  }
})();

/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============ CONTADORES ANIMADOS ============ */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      counterObserver.unobserve(e.target);
      const el = e.target;
      const target = +el.dataset.count;
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const t0 = performance.now();
      (function tick(t) {
        const k = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - k, 3); // easeOutCubic
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".stats__num").forEach((el) => counterObserver.observe(el));

/* ============ CARRUSEL ============ */
(function carousel() {
  const track = document.getElementById("carTrack");
  const viewport = document.getElementById("carViewport");
  const dotsBox = document.getElementById("carDots");
  const btnPrev = document.getElementById("carPrev");
  const btnNext = document.getElementById("carNext");

  // Render de tarjetas
  track.innerHTML = FAVORITOS.map(
    (f) => `
    <article class="fav-card">
      <div class="fav-card__emoji">${imgProducto(f)}</div>
      <div class="fav-card__body">
        <h3>${f.nombre}</h3>
        <p>${f.desc}</p>
        <span class="fav-card__price">${fmt(f.precio)}</span>
      </div>
    </article>`
  ).join("");

  const cards = [...track.children];
  let index = 0;
  let perView = getPerView();
  let autoTimer = null;

  function getPerView() {
    if (innerWidth <= 640) return 1;
    if (innerWidth <= 900) return 2;
    return 3;
  }
  const maxIndex = () => Math.max(0, cards.length - perView);

  function renderDots() {
    dotsBox.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Ir a la posición ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dotsBox.appendChild(b);
    }
    updateDots();
  }
  function updateDots() {
    [...dotsBox.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;
    updateDots();
  }

  btnNext.addEventListener("click", () => { goTo(index >= maxIndex() ? 0 : index + 1); resetAuto(); });
  btnPrev.addEventListener("click", () => { goTo(index <= 0 ? maxIndex() : index - 1); resetAuto(); });

  // Auto-play
  function startAuto() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoTimer = setInterval(() => goTo(index >= maxIndex() ? 0 : index + 1), 4000);
  }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  viewport.addEventListener("mouseenter", () => clearInterval(autoTimer));
  viewport.addEventListener("mouseleave", startAuto);

  // Drag / swipe
  let startX = 0, dragging = false;
  const start = (x) => { dragging = true; startX = x; viewport.classList.add("dragging"); clearInterval(autoTimer); };
  const end = (x) => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("dragging");
    const dx = x - startX;
    if (Math.abs(dx) > 50) dx < 0 ? goTo(index + 1) : goTo(index - 1);
    startAuto();
  };
  viewport.addEventListener("pointerdown", (e) => start(e.clientX));
  viewport.addEventListener("pointerup", (e) => end(e.clientX));
  viewport.addEventListener("pointerleave", (e) => dragging && end(e.clientX));
  viewport.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", (e) => end(e.changedTouches[0].clientX));

  window.addEventListener("resize", () => {
    const pv = getPerView();
    if (pv !== perView) { perView = pv; index = 0; renderDots(); }
    goTo(index);
  });

  renderDots();
  goTo(0);
  startAuto();
})();

/* ============ CARTA: TABS + GRID ============ */
(function menu() {
  const tabsBox = document.getElementById("menuTabs");
  const grid = document.getElementById("menuGrid");
  const data = CoffrutData.getMenu();
  const categorias = Object.keys(data);

  function renderTabs(activa) {
    tabsBox.innerHTML = categorias
      .map(
        (c) => `<button class="menu__tab ${c === activa ? "active" : ""}" role="tab"
                  aria-selected="${c === activa}" data-cat="${c}">${c}</button>`
      )
      .join("");
    tabsBox.querySelectorAll(".menu__tab").forEach((b) =>
      b.addEventListener("click", () => {
        renderTabs(b.dataset.cat);
        renderGrid(b.dataset.cat);
      })
    );
  }

  function renderGrid(cat) {
    grid.innerHTML = data[cat]
      .map(
        (d, i) => `
      <article class="dish" style="--i:${i}">
        <div class="dish__img">${imgProducto(d)}</div>
        <div class="dish__body">
          <div class="dish__head">
            <h3 class="dish__name">${d.nombre}</h3>
            <span class="dish__price">${fmt(d.precio)}</span>
          </div>
          <p class="dish__desc">${d.desc || ""}</p>
        </div>
      </article>`
      )
      .join("");
  }

  renderTabs(categorias[0]);
  renderGrid(categorias[0]);

  /* API pública: abrir una categoría desde otras secciones */
  window.irACategoria = (cat) => {
    const destino = categorias.includes(cat) ? cat : categorias[0];
    renderTabs(destino);
    renderGrid(destino);
    document.getElementById("carta").scrollIntoView({ behavior: "smooth" });
  };
})();

/* ============ PASTILLAS DE "NOSOTROS" → CARTA ============ */
document.querySelectorAll(".about__pills button[data-cat]").forEach((btn) =>
  btn.addEventListener("click", () => window.irACategoria(btn.dataset.cat))
);

/* ============ SEDES ============ */
(function sedes() {
  const grid = document.getElementById("sedesGrid");
  const barra = document.getElementById("menuSede");
  const note = document.getElementById("menuNote");
  if (!grid) return;

  function render() {
    const activa = CoffrutData.getSedeActiva();

    /* Tarjetas de sede */
    grid.innerHTML = CoffrutData.getSedes()
      .map((s) => {
        const esActiva = s.id === activa.id;
        return `
        <article class="sede-card ${esActiva ? "sede-card--activa" : ""}">
          ${esActiva ? `<span class="sede-card__badge">✓ Tu sede para pedidos</span>` : ""}
          <div class="sede-card__map">
            <iframe title="Mapa de ${s.nombre}" src="${s.mapa}" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div class="sede-card__body">
            <h3>${s.nombre}</h3>
            <p class="sede-card__dir">📍 ${s.direccion}</p>
            <p class="sede-card__ref">${s.referencia}</p>
            <div class="sede-card__actions">
              ${
                esActiva
                  ? `<a class="btn btn--yellow btn--sm" href="${s.pedido}" target="_blank" rel="noopener">Pedir en esta sede</a>`
                  : `<button class="btn btn--ghost btn--sm" data-sede="${s.id}">Elegir esta sede</button>`
              }
            </div>
          </div>
        </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-sede]").forEach((btn) =>
      btn.addEventListener("click", () => {
        CoffrutData.setSedeActiva(btn.dataset.sede);
        render();
      })
    );

    /* Barra de sede en la carta */
    if (barra) {
      barra.innerHTML = `
        <span>Estás pidiendo en: <strong>${activa.nombre}</strong></span>
        <div class="menu__sede-actions">
          <a class="btn btn--yellow btn--sm" href="${activa.pedido}" target="_blank" rel="noopener">Pedir online</a>
          <a class="menu__sede-cambiar" href="#sedes">Cambiar sede</a>
        </div>`;
    }
    if (note) {
      note.innerHTML = `Precios en soles (S/) · Pedidos online: <strong>${activa.nombre}</strong> —
        <a href="${activa.pedido}" target="_blank" rel="noopener">pedir por delivery</a>`;
    }
  }

  render();
})();
