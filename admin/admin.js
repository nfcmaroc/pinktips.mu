// Hidden stock page. Every change goes to the Google script (CONFIG.adminApi),
// which checks the password and writes the sheet. Nothing secret lives in this file.
const $ = (s) => document.querySelector(s);
let password = sessionStorage.pw || "";
let items = [];
let editing = null; // product being edited, or {} for a new one

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const thumb = (u) => (u.includes("images.unsplash.com") ? u.split("?")[0] + "?auto=format&fit=crop&w=160&h=160&q=60"
  : u.includes("googleusercontent.com/d/") ? u.split("=")[0] + "=w300-h300-c" : u);

function toast(text, bad) {
  const t = $("#toast");
  t.textContent = text; t.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(t.timer); t.timer = setTimeout(() => (t.className = "toast"), 2200);
}

async function api(action, extra = {}) {
  const res = await fetch(CONFIG.adminApi, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // plain text = no CORS preflight
    body: JSON.stringify({ action, password, ...extra }),
  });
  const data = await res.json();
  if (data.rows) { items = data.rows; render(); }
  if (!data.ok) throw new Error(data.error);
  return data;
}

// ---------- login ----------
async function login(pw) {
  password = pw;
  $("#loginMsg").textContent = "Connexion…";
  try {
    await api("list");
    sessionStorage.pw = pw;
    $("#login").hidden = true; $("#app").hidden = false;
  } catch (e) {
    password = ""; sessionStorage.removeItem("pw");
    $("#login").hidden = false; $("#app").hidden = true;
    $("#loginMsg").textContent = e.message === "password" ? "Mot de passe incorrect." : "Pas de connexion. Réessayez.";
  }
}
$("#loginForm").addEventListener("submit", (e) => { e.preventDefault(); login($("#pw").value); });
$("#logout").onclick = () => { sessionStorage.removeItem("pw"); location.reload(); };
if (password) login(password);

// ---------- list ----------
function render() {
  const out = items.filter((p) => p.rupture || p.stock <= 0).length;
  $("#summary").textContent = `${items.length} produits · ${out} en rupture`;
  $("#list").innerHTML = items.map((p, i) => {
    const sold = p.rupture || p.stock <= 0;
    return `<li class="item${sold ? " out" : ""}">
      <img src="${esc(thumb(p.photo))}" alt="" loading="lazy">
      <div class="info">
        <b>${esc(p.name)}</b><small>${esc(p.variant)}</small>
        <span class="tag">${sold ? "Rupture" : "En stock"}</span>
        <span class="pr">Rs ${p.price}</span>
      </div>
      <div class="ctrl">
        <div class="step"><button data-i="${i}" data-d="-1" aria-label="Moins">−</button><output>${p.stock}</output><button data-i="${i}" data-d="1" aria-label="Plus">+</button></div>
        <label class="switch"><input type="checkbox" data-r="${i}" ${p.rupture ? "checked" : ""}><span></span>Rupture</label>
        <button class="link" data-e="${i}">Modifier</button>
      </div>
    </li>`;
  }).join("");
}

// save one product (stock taps are grouped: one save 600 ms after the last tap)
const timers = {};
function save(p, now) {
  clearTimeout(timers[p.row]);
  timers[p.row] = setTimeout(async () => {
    try { await api("update", { row: p.row, expect: p.name, product: p }); toast("Enregistré ✓"); }
    catch (e) { toast(e.message === "changed" ? "Le tableau a changé, liste mise à jour." : "Erreur, réessayez.", true); }
  }, now ? 0 : 600);
}

$("#list").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.d) {
    const p = items[b.dataset.i];
    p.stock = Math.max(0, p.stock + Number(b.dataset.d));
    render(); save(p);
  }
  if (b.dataset.e) openEditor(items[b.dataset.e]);
});
$("#list").addEventListener("change", (e) => {
  if (e.target.dataset.r === undefined) return;
  const p = items[e.target.dataset.r];
  p.rupture = e.target.checked; render(); save(p, true);
});

// ---------- add / edit ----------
const form = $("#editForm");
function openEditor(p) {
  editing = p;
  $("#editTitle").textContent = p.row ? "Modifier le produit" : "Nouveau produit";
  $("#delBtn").hidden = !p.row;
  for (const k of ["name", "variant", "price", "stock", "photo"]) form[k].value = p[k] ?? "";
  if (!p.row) { form.price.value = items[0]?.price || 300; form.stock.value = 1; }
  showPreview();
  $("#editor").showModal();
}
function showPreview() {
  const u = form.photo.value.trim();
  $("#preview").hidden = !u; if (u) $("#preview").src = thumb(u);
}
form.photo.addEventListener("input", showPreview);
$("#addBtn").onclick = () => openEditor({});

$("#editor").addEventListener("close", async () => {
  if ($("#editor").returnValue !== "save") return;
  const p = { ...editing, name: form.name.value.trim(), variant: form.variant.value.trim(), price: Number(form.price.value),
              stock: Number(form.stock.value), photo: form.photo.value.trim(), rupture: !!editing.rupture };
  try {
    if (editing.row) await api("update", { row: editing.row, expect: editing.name, product: p });
    else await api("add", { product: p });
    toast(editing.row ? "Enregistré ✓" : "Produit ajouté ✓");
  } catch (e) { toast("Erreur, réessayez.", true); }
});

$("#delBtn").onclick = async () => {
  if (!confirm(`Supprimer « ${editing.name} » ? Cette action est définitive.`)) return;
  $("#editor").close();
  try { await api("delete", { row: editing.row, expect: editing.name }); toast("Produit supprimé"); }
  catch (e) { toast("Erreur, réessayez.", true); }
};

// ---------- photo upload: shrink to 1000 px JPEG in the browser, the script stores it in Drive ----------
$("#file").addEventListener("change", async (e) => {
  const f = e.target.files[0]; if (!f) return;
  const msg = $("#upMsg"); msg.textContent = "Envoi…"; $("#saveBtn").disabled = true;
  try {
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, 1000 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const data = c.toDataURL("image/jpeg", 0.85).split(",")[1];
    const r = await api("upload", { data });
    form.photo.value = r.url; showPreview(); msg.textContent = "Photo envoyée ✓";
  } catch (err) { msg.textContent = "Échec de l'envoi, réessayez."; }
  $("#saveBtn").disabled = false; e.target.value = "";
});
