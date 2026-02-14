// ===================== Config =====================
const PHONE = "966546100481"; // بدون +
const WA_LINK = `https://wa.me/${PHONE}`;

// ===================== Helpers =====================
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", href === path);
  });
}

function setupMobileNav() {
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("mobile");
  });

  // اقفل القائمة عند الضغط خارجها
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("mobile")) return;
    const inside = nav.contains(e.target) || toggle.contains(e.target);
    if (!inside) nav.classList.remove("mobile");
  });

  // اقفلها عند اختيار لينك
  $$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mobile")));
}

function setupQuickLinks() {
  const waEls = $$("[data-wa]");
  const phEls = $$("[data-phone]");

  waEls.forEach(el => el.setAttribute("href", `${WA_LINK}`));
  phEls.forEach(el => el.setAttribute("href", `tel:+${PHONE}`));
}

function setupWhatsAppForm() {
  const form = $("#waForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = ($("#name")?.value || "").trim();
    const service = ($("#service")?.value || "").trim();
    const details = ($("#details")?.value || "").trim();

    const msg =
`السلام عليكم، أنا ${name || "عميل"}.
حابب أطلب خدمة: ${service || "ترميم/سيراميك/ديكورات"}.
تفاصيل إضافية: ${details || "—"}
الموقع: الجبيل`;

    const url = `${WA_LINK}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
  });
}

// ===================== Lightbox Gallery =====================
function setupLightbox() {
  const lb = $("#lightbox");
  if (!lb) return;

  const lbImg = $("#lbImg");
  const lbCount = $("#lbCount");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");
  const btnClose = $$("#lightbox [data-close]");

  const items = $$(".g-item img");
  if (!items.length) return;

  let idx = 0;

  function openAt(i) {
    idx = i;
    const src = items[idx].getAttribute("src");
    lbImg.setAttribute("src", src);
    lbCount.textContent = `${idx + 1} / ${items.length}`;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function prev() {
    openAt((idx - 1 + items.length) % items.length);
  }
  function next() {
    openAt((idx + 1) % items.length);
  }

  items.forEach((img, i) => {
    img.addEventListener("click", () => openAt(i));
    img.parentElement.addEventListener("click", () => openAt(i));
  });

  btnPrev?.addEventListener("click", prev);
  btnNext?.addEventListener("click", next);
  btnClose.forEach(b => b.addEventListener("click", close));

  // اقفل عند الضغط على الخلفية
  lb.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") close();
  });

  // كيبورد
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") next();  // RTL: خلي اليمين/الشمال كما تحب
    if (e.key === "ArrowRight") prev();
  });
}

// ===================== Init =====================
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupMobileNav();
  setupQuickLinks();
  setupWhatsAppForm();
  setupLightbox();
});
