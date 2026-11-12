// Pinktips admin API, a standalone Apps Script project (script.google.com) on the stock sheet.
// Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
// The password is NOT here: Project Settings > Script properties > ADMIN_PASSWORD.

const SHEET_ID = "11_20pqwnLG5mVZGKGYvPq8C6FIa9RMfnBkROtVedLKY"; // "Pinktips - Stock"
const SHEET = "Stock";
const COLS = 6; // Nom, Variante, Prix, Photo, Stock, Rupture

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function rows(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, COLS).getValues()
    .map((v, i) => ({ row: i + 2, name: String(v[0]).trim(), variant: String(v[1]).trim(), price: Number(v[2]) || 0,
                      photo: String(v[3]).trim(), stock: Number(v[4]) || 0, rupture: v[5] === true }))
    .filter((p) => p.name);
}

function firstEmptyRow(sh) {
  const names = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  const i = names.findIndex((r) => !String(r[0]).trim());
  return i === -1 ? names.length + 2 : i + 2;
}

function put(sh, row, p) {
  sh.getRange(row, 1, 1, 5).setValues([[p.name, p.variant || "", Number(p.price) || 0, p.photo || "", Math.max(0, Number(p.stock) || 0)]]);
  sh.getRange(row, 6).insertCheckboxes().setValue(p.rupture === true);
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (_) { return out({ ok: false, error: "bad request" }); }
  const pw = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  if (!pw || req.password !== pw) { Utilities.sleep(1500); return out({ ok: false, error: "password" }); }

  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (req.action === "update" || req.action === "delete") {
      // refuse if the sheet changed under us (row moved), so we never edit the wrong product
      const now = String(sh.getRange(req.row, 1).getValue()).trim();
      if (req.row < 2 || now !== req.expect) return out({ ok: false, error: "changed", rows: rows(sh) });
      if (req.action === "update") put(sh, req.row, req.product);
      else sh.deleteRow(req.row);
    } else if (req.action === "add") {
      if (!req.product || !String(req.product.name || "").trim()) return out({ ok: false, error: "name" });
      put(sh, firstEmptyRow(sh), req.product);
    }
    return out({ ok: true, rows: rows(sh) });
  } finally {
    lock.releaseLock();
  }
}
