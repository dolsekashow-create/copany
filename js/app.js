const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
};

const ic = (name, cls = "") => `<svg class="i ${cls}"><use href="#i-${name}"/></svg>`;
const TYPE_ICONS = { villa: "home", apartment: "building", house: "home", office: "briefcase", shop: "store", land: "map", building: "building" };
const TYPE_IMAGES = {
  villa: "photo-1613490493576-7fde63acd811", apartment: "photo-1545324418-cc1a3fa10c00",
  house: "photo-1570129477492-45c003edd2be", office: "photo-1497366216548-37526070297c",
  shop: "photo-1441986300917-64674bd600d8", land: "photo-1500382017468-9049fed747ef",
  building: "photo-1460317442991-0ec209397118"
};
const FALLBACK_IMG = "photo-1600585154340-be6161a56a0c";

const ALL = PROPERTIES;
let favs = new Set(store.get("kobani_favs", []));

const state = { purpose: "all", text: "", city: "", type: "", max: null, sort: "new" };

const src = (img, w) => img.startsWith("http") ? img : IMG(img, w);
const money = n => "$" + Number(n).toLocaleString("en-US");
const priceLabel = p => money(p.price) + (p.purpose === "rent" ? " <small>/ شهرياً</small>" : "");

const waLink = text => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
const sendWhatsApp = text => window.open(waLink(text), "_blank", "noopener");
const adCode = p => "KB-" + String(p.id).padStart(5, "0");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- تهيئة القوائم ---------- */
function initFilters() {
  const cities = [...new Set(ALL.map(p => p.city))];
  $("#qCity").innerHTML += cities.map(c => `<option>${c}</option>`).join("");
  const typeOpts = Object.entries(TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#qType").innerHTML += typeOpts;
  $("#addType").innerHTML = typeOpts;

  $("#catGrid").innerHTML = Object.entries(TYPES).map(([k, v]) => `
    <div class="cat" data-type="${k}">
      <img src="${IMG(TYPE_IMAGES[k], 500)}" alt="${v}" loading="lazy">
      <div class="cat-info">
        <strong>${v}</strong>
        <small>${ALL.filter(p => p.type === k).length} عقار</small>
      </div>
    </div>`).join("");
}

/* ---------- عرض العقارات ---------- */
function filtered() {
  const q = state.text.trim();
  let list = ALL.filter(p =>
    (state.purpose === "all" || p.purpose === state.purpose) &&
    (!state.city || p.city === state.city) &&
    (!state.type || p.type === state.type) &&
    (!state.max || p.price <= state.max) &&
    (!q || [p.title, p.desc, p.area, p.city, TYPES[p.type], ...(p.features || [])].join(" ").includes(q))
  );
  const sorters = {
    new: (a, b) => (b.featured - a.featured) || (b.id - a.id),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    size: (a, b) => b.size - a.size
  };
  return list.sort(sorters[state.sort]);
}

function cardHTML(p) {
  return `
  <article class="card prop" data-id="${p.id}">
    <div class="prop-img">
      <img src="${src(p.images[0], 800)}" alt="${p.title}" loading="lazy" onerror="this.src='${IMG(FALLBACK_IMG, 800)}'">
      <div class="tags">
        <span class="tag ${p.purpose}">${p.purpose === "sale" ? "للبيع" : "للإيجار"}</span>
        ${p.featured ? '<span class="tag featured">مميّز</span>' : ""}
      </div>
      <button class="fav ${favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" title="أضف للمفضلة">${ic("heart")}</button>
      <span class="photos-count">${ic("image")} ${p.images.length}</span>
    </div>
    <div class="prop-body">
      <div class="price">${priceLabel(p)}</div>
      <h3>${p.title}</h3>
      <div class="loc">${ic("pin")} ${p.city} — ${p.area}</div>
      <div class="specs">
        <span>${ic(TYPE_ICONS[p.type])} ${TYPES[p.type]}</span>
        <span>${ic("area")} <b>${p.size}</b> م²</span>
        ${p.beds ? `<span>${ic("bed")} <b>${p.beds}</b> غرف</span>` : ""}
        ${p.baths ? `<span>${ic("bath")} <b>${p.baths}</b></span>` : ""}
      </div>
    </div>
  </article>`;
}

function render() {
  const list = filtered();
  $("#grid").innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  const parts = [];
  if (state.purpose !== "all") parts.push(state.purpose === "sale" ? "للبيع" : "للإيجار");
  if (state.type) parts.push(TYPES[state.type]);
  if (state.city) parts.push("في " + state.city);
  $("#resultsInfo").textContent = `${list.length} عقار ${parts.length ? "— " + parts.join(" · ") : "متاح"}`;
  $$(".cat").forEach(c => c.classList.toggle("active", c.dataset.type === state.type));
}

function resetAll() {
  Object.assign(state, { purpose: "all", text: "", city: "", type: "", max: null });
  $("#heroSearch").reset();
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.purpose === "all"));
  render();
}

/* ---------- المفضلة ---------- */
const favLabel = id => favs.has(id) ? `${ic("heart", "red filled")} في المفضلة` : `${ic("heart")} أضف للمفضلة`;

function toggleFav(id) {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set("kobani_favs", [...favs]);
  $("#favCount").textContent = favs.size;
  $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle("on", favs.has(id)));
  toast(favs.has(id) ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة");
}

function openFavs() {
  const items = ALL.filter(p => favs.has(p.id));
  $("#favList").innerHTML = items.length ? items.map(p => `
    <div class="fav-item" data-open="${p.id}">
      <img src="${src(p.images[0], 300)}" alt="">
      <div><b>${p.title}</b><span class="loc">${p.city} — ${money(p.price)}</span></div>
    </div>`).join("") : '<p class="muted" style="margin-top:14px">لم تضف أي عقار إلى المفضلة بعد.</p>';
  openModal("#favModal");
}

/* ---------- النوافذ ---------- */
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModals() { $$(".modal").forEach(m => m.hidden = true); document.body.style.overflow = ""; }

function openProperty(id) {
  const p = ALL.find(x => x.id === id);
  if (!p) return;
  const agent = AGENTS[p.agent ?? 0];
  let idx = 0;
  $("#propDetails").innerHTML = `
    <div class="gallery-main">
      <img id="gMain" src="${src(p.images[0], 1600)}" alt="${p.title}">
      ${p.images.length > 1 ? `<button class="g-nav g-prev" data-g="-1" aria-label="السابق">${ic("chev-r")}</button><button class="g-nav g-next" data-g="1" aria-label="التالي">${ic("chev-l")}</button>` : ""}
    </div>
    <div class="thumbs">${p.images.map((im, i) => `<img src="${src(im, 300)}" data-i="${i}" class="${i ? "" : "active"}" alt="">`).join("")}</div>
    <div class="detail">
      <div>
        <div class="tags" style="position:static;margin-bottom:8px">
          <span class="tag ${p.purpose}">${p.purpose === "sale" ? "للبيع" : "للإيجار"}</span>
          <span class="tag" style="background:var(--navy)">${TYPES[p.type]}</span>
        </div>
        <h2>${p.title}</h2>
        <div class="loc">${ic("pin")} ${p.city} — ${p.area}</div>
        <div class="detail-specs">
          <div><b>${p.size}</b><span>م² المساحة</span></div>
          <div><b>${p.beds || "—"}</b><span>غرف نوم</span></div>
          <div><b>${p.baths || "—"}</b><span>حمامات</span></div>
          <div><b>${p.year || "—"}</b><span>سنة البناء</span></div>
        </div>
        <h4>الوصف</h4>
        <p>${p.desc || "—"}</p>
        ${p.features?.length ? `<h4>المميزات</h4><div class="feat-list">${p.features.map(f => `<span>${ic("check")} ${f}</span>`).join("")}</div>` : ""}
        <p class="loc" style="margin-top:16px">رقم الإعلان: ${adCode(p)}</p>
      </div>
      <aside class="side-card">
        <div class="price">${priceLabel(p)}</div>
        ${p.purpose === "sale" ? `<div class="loc">≈ ${money(Math.round(p.price / p.size))} للمتر المربع</div>` : ""}
        <div class="agent-mini">
          <img src="${IMG(agent.img, 200)}" alt="${agent.name}">
          <div><b>${agent.name}</b><div class="loc">${agent.role}</div></div>
        </div>
        <a class="btn btn-primary" href="tel:${agent.phone.replace(/\s/g, "")}">${ic("phone")} اتصل الآن</a>
        <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(`مرحباً، أستفسر عن العقار:\n🏠 ${p.title}\n📍 ${p.city} — ${p.area}\n💵 ${money(p.price)}${p.purpose === "rent" ? " شهرياً" : ""}\n🔖 رقم الإعلان: ${adCode(p)}\n${location.origin}${location.pathname}#prop-${p.id}`)}">${ic("whatsapp")} استفسر عبر واتساب</a>
        <button class="btn btn-ghost" data-fav="${p.id}">${favLabel(p.id)}</button>
        ${p.purpose === "sale" ? `
        <div class="calc">
          <b>حاسبة التقسيط</b>
          <label>الدفعة الأولى (%)<input type="number" id="cDown" value="30" min="0" max="90"></label>
          <label>عدد السنوات<input type="number" id="cYears" value="5" min="1" max="25"></label>
          <div>القسط الشهري التقريبي: <output id="cOut"></output></div>
        </div>` : ""}
      </aside>
    </div>`;

  const setImg = i => {
    idx = (i + p.images.length) % p.images.length;
    $("#gMain").src = src(p.images[idx], 1600);
    $$(".thumbs img").forEach((t, j) => t.classList.toggle("active", j === idx));
  };
  $$(".thumbs img").forEach(t => t.onclick = () => setImg(+t.dataset.i));
  $$(".g-nav").forEach(b => b.onclick = () => setImg(idx + +b.dataset.g));

  const calc = () => {
    const down = Math.min(90, Math.max(0, +$("#cDown").value || 0));
    const months = Math.max(1, +$("#cYears").value || 1) * 12;
    $("#cOut").textContent = money(Math.round(p.price * (1 - down / 100) / months));
  };
  if (p.purpose === "sale") { $("#cDown").oninput = $("#cYears").oninput = calc; calc(); }

  openModal("#propModal");
}

/* ---------- الفريق ---------- */
function renderAgents() {
  $("#agentsGrid").innerHTML = AGENTS.map(a => `
    <div class="card agent">
      <img src="${IMG(a.img, 600)}" alt="${a.name}" loading="lazy">
      <div class="agent-body">
        <h3>${a.name}</h3>
        <p>${a.role}</p>
        <p class="deals">${ic("award")} ${a.deals} صفقة ناجحة</p>
        <div class="row">
          <a class="btn btn-primary" href="tel:${a.phone.replace(/\s/g, "")}">${ic("phone")} اتصال</a>
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(`مرحباً ${a.name}، أرغب بالتواصل بخصوص عقار.`)}">${ic("whatsapp")} واتساب</a>
        </div>
      </div>
    </div>`).join("");
}

/* ---------- العدادات ---------- */
function animateCounters() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now();
    const step = now => {
      const k = Math.min(1, (now - start) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString("en-US") + (k === 1 ? "+" : "");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    io.unobserve(el);
  }), { threshold: .4 });
  $$("[data-count]").forEach(el => io.observe(el));
}

/* ---------- الأحداث ---------- */
function bindEvents() {
  $$(".tab").forEach(t => t.onclick = () => {
    $$(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    state.purpose = t.dataset.purpose;
    render();
  });

  $("#heroSearch").onsubmit = e => {
    e.preventDefault();
    state.text = $("#qText").value;
    state.city = $("#qCity").value;
    state.type = $("#qType").value;
    state.max = +$("#qMax").value || null;
    render();
    $("#listings").scrollIntoView();
  };

  $("#sortBy").onchange = e => { state.sort = e.target.value; render(); };
  $("#resetFilters").onclick = resetAll;

  $("#catGrid").onclick = e => {
    const c = e.target.closest(".cat");
    if (!c) return;
    state.type = state.type === c.dataset.type ? "" : c.dataset.type;
    $("#qType").value = state.type;
    render();
    $("#listings").scrollIntoView();
  };

  $$("[data-type-link]").forEach(a => a.onclick = () => { state.type = a.dataset.typeLink; $("#qType").value = state.type; render(); });

  // نقرات عامة: المفضلة / فتح العقار / إغلاق النوافذ
  document.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.stopPropagation();
      toggleFav(+fav.dataset.fav);
      if (fav.classList.contains("btn")) fav.innerHTML = favLabel(+fav.dataset.fav);
      return;
    }
    const card = e.target.closest(".prop, [data-open]");
    if (card) { closeModals(); openProperty(+(card.dataset.id || card.dataset.open)); return; }
    if (e.target.closest("[data-close]") || e.target.classList.contains("modal")) closeModals();
  });
  document.addEventListener("keydown", e => e.key === "Escape" && closeModals());

  $("#favBtn").onclick = openFavs;
  $("#addListingBtn").onclick = () => openModal("#addModal");

  $("#addForm").onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    sendWhatsApp([
      "📢 طلب إضافة عقار جديد",
      `👤 المالك: ${d.owner}`,
      `📞 الهاتف: ${d.phone}`,
      `🏠 العنوان: ${d.title}`,
      `🏷 النوع: ${TYPES[d.type]} — ${d.purpose === "sale" ? "للبيع" : "للإيجار"}`,
      `📍 الموقع: ${d.city} — ${d.area}`,
      `💵 السعر: ${money(d.price)}${d.purpose === "rent" ? " شهرياً" : ""}`,
      `📐 المساحة: ${d.size} م²` + (+d.beds ? ` · 🛏 ${d.beds} غرف` : ""),
      d.image && `🖼 صورة: ${d.image}`,
      d.desc && `📝 الوصف: ${d.desc}`
    ].filter(Boolean).join("\n"));
    e.target.reset();
    closeModals();
    toast("تم تحويل طلبك إلى واتساب، اضغط إرسال لإتمامه");
  };

  $("#contactForm").onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    sendWhatsApp([
      "📩 طلب جديد من موقع كوباني العقارية",
      `👤 الاسم: ${d.name}`,
      `📞 الهاتف: ${d.phone}`,
      `📌 نوع الطلب: ${d.kind}`,
      d.msg && `📝 الرسالة: ${d.msg}`
    ].filter(Boolean).join("\n"));
    e.target.reset();
    toast(`شكراً ${d.name}، اضغط إرسال في واتساب لإتمام الطلب`);
  };

  $("#newsletter").onsubmit = e => {
    e.preventDefault();
    sendWhatsApp(`✉️ طلب اشتراك في النشرة البريدية\nالبريد: ${e.target.email.value}`);
    e.target.reset();
    toast("تم تحويل طلب الاشتراك إلى واتساب");
  };

  // القائمة على الجوال
  $("#menuToggle").onclick = () => $("#nav").classList.toggle("open");
  $$("#nav a").forEach(a => a.onclick = () => $("#nav").classList.remove("open"));

  // ظل الهيدر + تفعيل رابط القسم الحالي
  const sections = $$("section[id]");
  window.addEventListener("scroll", () => {
    $("#header").classList.toggle("scrolled", scrollY > 20);
    let cur = "home";
    sections.forEach(s => { if (scrollY + 120 >= s.offsetTop) cur = s.id; });
    $$("#nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }, { passive: true });
}

/* ---------- تشغيل ---------- */
$("#year").textContent = new Date().getFullYear();
$("#favCount").textContent = favs.size;
initFilters();
renderAgents();
render();
bindEvents();
animateCounters();

// رابط مباشر لعقار: index.html#prop-5
const openFromHash = () => { const m = location.hash.match(/^#prop-(\d+)$/); if (m) openProperty(+m[1]); };
window.addEventListener("hashchange", openFromHash);
openFromHash();
