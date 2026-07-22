import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { FALLBACK, DEPT_LABELS } from "./fallback-data.js";

const WA = "94777737602";

function waLink(text) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function productCardHTML(p, deptLabel, idx) {
  const name = escapeHtml(p.name);
  const img = p.image || "";
  const variants = Array.isArray(p.variants) && p.variants.length ? p.variants : ["Standard"];
  const hasChoice = variants.length > 1;
  const cardId = `p${idx}`;

  let sizeControl = "";
  if (hasChoice) {
    const options = variants.map((v, i) => `<option value="${escapeHtml(v)}"${i === 0 ? " selected" : ""}>${escapeHtml(v)}</option>`).join("");
    sizeControl = `
          <label class="size-label" for="${cardId}-size">Size</label>
          <select id="${cardId}-size" class="size-select" data-card="${cardId}">${options}</select>`;
  } else {
    sizeControl = `<div class="spec">${escapeHtml(variants[0])}</div>`;
  }

  const initialVariant = variants[0];
  const waHref = waLink(`Hi, I would like a price for: ${p.name} - ${initialVariant} (${deptLabel})`);

  return `
      <div class="product-card reveal" id="${cardId}" data-name="${escapeHtml(p.name)}" data-dept="${escapeHtml(deptLabel)}">
        <div class="product-thumb${img ? "" : " no-photo"}">${
          img
            ? `<img src="${img}" alt="${name}" onerror="this.parentElement.classList.add('no-photo');this.remove();this.parentElement.innerHTML='<i class=\\'fa-solid fa-image\\'></i><span>Photo coming soon</span>';">`
            : `<i class="fa-solid fa-image"></i><span>Photo coming soon</span>`
        }</div>
        <div class="product-body">
          <h4>${name}</h4>
          ${sizeControl}
          <a href="${waHref}" target="_blank" class="call-price" id="${cardId}-link">Call for Price <i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>`;
}

function groupBySubcategory(items) {
  const groups = new Map();
  items.forEach((it) => {
    const key = it.subcategory || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  });
  return Array.from(groups.entries());
}

function render(items, deptLabel) {
  const container = document.getElementById("product-container");
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<p style="color:var(--paper-dim);text-align:center;padding:40px 0;">No products listed yet — WhatsApp us your list and we\'ll help directly.</p>';
    return;
  }
  const groups = groupBySubcategory(items);
  let html = "";
  let idx = 0;
  groups.forEach(([subTitle, list]) => {
    if (subTitle) html += `<div class="subcategory-head reveal"><h3>${escapeHtml(subTitle)}</h3></div>`;
    html += '<div class="product-grid">';
    list.forEach((p) => {
      html += productCardHTML(p, deptLabel, idx);
      idx++;
    });
    html += "</div>";
  });
  container.innerHTML = html;

  // Wire up size selectors so the WhatsApp link updates with the chosen size
  container.querySelectorAll(".size-select").forEach((select) => {
    select.addEventListener("change", () => {
      const cardId = select.dataset.card;
      const card = document.getElementById(cardId);
      const link = document.getElementById(`${cardId}-link`);
      if (!card || !link) return;
      const name = card.dataset.name;
      const dept = card.dataset.dept;
      const size = select.value;
      link.href = waLink(`Hi, I would like a price for: ${name} - ${size} (${dept})`);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll("#product-container .reveal").forEach((el) => io.observe(el));
}

function isConfigured(cfg) {
  return cfg && cfg.apiKey && !String(cfg.apiKey).startsWith("YOUR_");
}

async function main() {
  const dept = document.body.dataset.department;
  if (!dept) return;
  const deptLabel = DEPT_LABELS[dept] || dept;

  if (isConfigured(firebaseConfig)) {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const q = query(collection(db, "products"), where("department", "==", dept));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const items = [];
        snap.forEach((doc) => items.push(doc.data()));
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        render(items, deptLabel);
        return;
      }
    } catch (err) {
      console.warn("Could not load products from Firebase, showing default catalog instead.", err);
    }
  }

  render(FALLBACK[dept] || [], deptLabel);
}

main();
