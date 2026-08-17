const STORAGE_KEY = "dentapp-crm-state-v4";
const AUTH_STORAGE_KEY = "dentapp-supabase-auth-v1";
const LOGIN_PREVIEW_STORAGE_KEY = "dentapp-login-preview-v1";
const PROVIDER_REGISTRY_STORAGE_KEY = "dentapp-provider-registry-v1";
const DEFAULT_PASSWORD = "DentAll2026!";
const DOCUMENT_NOTIFICATION_RECIPIENTS = ["stevo@dentall.sk", "obchod@dentall.sk", "dentall@dentall.sk"];

const manufacturers = [
  "A-dec", "Acteon Group", "American Eagle", "Anthogyr", "Bausch", "Dental Hi Tec",
  "Dentatus", "Dentsply", "Diplomat Dental Solutions", "Dürr", "Ekom", "EMS",
  "Ivoclar", "Kerr", "Komet", "Medicom", "Medin", "NSK", "Philips Sonicare",
  "SDI", "Solventum", "Vatech", "VDW", "VOCO", "W&H", "Iné"
];

const inventoryCategories = [
  "Zariadenie", "Náhradný diel", "Spotrebný materiál", "Príslušenstvo", "Dezinfekcia",
  "Nástroje", "RTG", "Súpravy a kreslá", "Servisný materiál", "IT a sieť"
];

const serviceStates = ["Nová", "Naplánovaná", "Na ceste", "Prebieha", "Čaká na diel", "Hotové", "Fakturované"];
const billingStates = ["Na fakturáciu", "Exportované", "Fakturované"];

const officialUsers = [
  { id: "u-super-andrej", name: "Andrej Klacik", role: "SuperAdministrátor", email: "servis.klacik@dentall.sk", phone: "0917 208 861", active: true, protected: true },
  { id: "u-admin-stefan", name: "Štefan Paľa", role: "Administrátor", email: "", phone: "", active: true },
  { id: "u-admin-roman", name: "Roman Gúta", role: "Administrátor", email: "", phone: "", active: true },
  { id: "u-tech-jan-varga", name: "Ján Varga", role: "Technik", email: "servis.varga@dentall.sk", phone: "0908 675 146", active: true },
  { id: "u-tech-oliver-trencsik", name: "Oliver Trencsik", role: "Technik", email: "servis.trencsik@dentall.sk", phone: "0917 926 142", active: true },
  { id: "u-tech-erik-bella", name: "Erik Bella", role: "Technik", email: "servis.bella@dentall.sk", phone: "0905 782 726", active: true },
  { id: "u-tech-stanislav-rovensky", name: "Stanislav Rovenský", role: "Technik", email: "servis.rovensky@dentall.sk", phone: "0947 971 328", active: true },
  { id: "u-tech-maros-hajzus", name: "Maroš Hajzuš", role: "Technik", email: "servis.hajzus@dentall.sk", phone: "0905 284 769", active: true },
  { id: "u-tech-patrik-kapral", name: "Patrik Kapraľ", role: "Technik", email: "", phone: "0948 942 232", active: true },
  { id: "u-tech-daniel-golian", name: "Daniel Golian", role: "Technik", email: "", phone: "0918 446 403", active: true }
];

let inventoryManufacturerFilter = "all";
let inventoryCategoryFilter = "all";
let serviceTechnicianFilter = "all";
let serviceStatusFilter = "open";
let dashboardServiceFilter = "open";
let providerRegistryFilter = "all";
let providerRegionFilter = "all";
let providerDistrictFilter = "all";
let dataMode = "supabase";
localStorage.removeItem("dentapp-data-mode");

const seedData = {
  users: structuredClone(officialUsers),
  clients: [
    { id: "c1", name: "SmileClinic Bratislava", city: "Bratislava", contact: "MUDr. Jana Veselá", email: "info@smileclinic.sk", phone: "+421 2 555 010", status: "Aktívna", segment: "Klinika", note: "VIP klient, pravidelná preventívna kontrola každých 6 mesiacov." },
    { id: "c2", name: "DentCare Trnava", city: "Trnava", contact: "MUDr. Tomáš Král", email: "recepcia@dentcare.sk", phone: "+421 33 555 020", status: "Aktívna", segment: "Ambulancia", note: "Plánovaná obnova OPG pracoviska." },
    { id: "c3", name: "OrthoPlus Nitra", city: "Nitra", contact: "Mgr. Iveta Hrušková", email: "office@orthoplus.sk", phone: "+421 37 555 030", status: "Aktívna", segment: "Ortodoncia", note: "Vyšší objem spotrebného materiálu." },
    { id: "c4", name: "Dental Point Žilina", city: "Žilina", contact: "MUDr. Roman Biela", email: "kontakt@dentalpoint.sk", phone: "+421 41 555 040", status: "Riziko", segment: "Klinika", note: "Treba vyriešiť výpadky siete v RTG miestnosti." },
    { id: "c5", name: "Biela Ambulancia Košice", city: "Košice", contact: "MUDr. Silvia Horváthová", email: "kosice@bielaambulancia.sk", phone: "+421 55 555 050", status: "Aktívna", segment: "Ambulancia", note: "Záujem o klientsky portál a dokumenty zariadení." }
  ],
  devices: [
    { id: "d1", clientId: "c1", type: "CBCT", brand: "Vatech", model: "Green X", serial: "VX-240118", installed: "2024-02-12", warrantyUntil: "2029-02-12", status: "OK", location: "RTG miestnosť", documents: ["Odovzdávací protokol", "Záručný list", "Servisný manuál"] },
    { id: "d2", clientId: "c1", type: "Intraorálny senzor", brand: "EzSensor", model: "HD", serial: "EZ-11882", installed: "2023-09-04", warrantyUntil: "2026-09-04", status: "Servis", location: "Ordinácia 2", documents: ["Faktúra", "Kalibračný protokol"] },
    { id: "d3", clientId: "c2", type: "OPG", brand: "Vatech", model: "PaX-i", serial: "PX-77642", installed: "2021-11-19", warrantyUntil: "2026-11-19", status: "OK", location: "RTG", documents: ["Záručný list"] },
    { id: "d4", clientId: "c3", type: "Skener", brand: "Medit", model: "i700", serial: "MD-88402", installed: "2025-01-15", warrantyUntil: "2028-01-15", status: "OK", location: "Ordinácia 1", documents: ["Licencia", "Odovzdávací protokol"] },
    { id: "d5", clientId: "c4", type: "NAS", brand: "Synology", model: "DS923+", serial: "SY-55219", installed: "2022-06-21", warrantyUntil: "2027-06-21", status: "Pozor", location: "Rack", documents: ["Konfigurácia", "Backup plán"] },
    { id: "d6", clientId: "c5", type: "RTG senzor", brand: "Acteon", model: "X-Mind Unity", serial: "AC-90831", installed: "2023-05-08", warrantyUntil: "2026-05-08", status: "Záruka končí", location: "Ordinácia 3", documents: ["Záručný list", "Revízia"] }
  ],
  inventory: [
    { id: "i1", name: "USB kábel aktívny 5 m", sku: "CAB-USB5-A", qty: 18, min: 8, reserved: 4, category: "Káble", manufacturer: "Vatech", itemType: "Príslušenstvo", location: "Prešov / servis", compatibility: "RTG pracoviská, senzory, skenery", note: "" },
    { id: "i2", name: "PoE switch 8-port", sku: "NET-POE-8", qty: 5, min: 3, reserved: 2, category: "Sieť", manufacturer: "Iné", itemType: "IT a sieť", location: "Prešov / regál IT", compatibility: "Kamery, sieťové prvky, RTG miestnosti", note: "" },
    { id: "i3", name: "UPS 900 VA", sku: "PWR-UPS-900", qty: 2, min: 2, reserved: 1, category: "Napájanie", manufacturer: "Iné", itemType: "IT a sieť", location: "Prešov / regál IT", compatibility: "NAS, router, switch, PC", note: "" },
    { id: "i4", name: "Senzor ochranné návleky", sku: "CON-SLEEVE", qty: 420, min: 250, reserved: 60, category: "Spotrebný materiál", manufacturer: "Vatech", itemType: "Spotrebný materiál", location: "Prešov / spotrebák", compatibility: "Intraorálne senzory", note: "" },
    { id: "i5", name: "HDD 8 TB NAS", sku: "NAS-HDD-8TB", qty: 1, min: 2, reserved: 0, category: "Úložisko", manufacturer: "Iné", itemType: "IT a sieť", location: "Prešov / regál IT", compatibility: "Synology NAS, zálohovanie ambulancií", note: "" },
    { id: "i6", name: "Dezinfekčný balíček", sku: "DURR-DES-BAL", qty: 7, min: 4, reserved: 1, category: "Dezinfekcia", manufacturer: "Dürr", itemType: "Dezinfekcia", location: "Prešov / hygiena", compatibility: "Hygienický program ambulancie", note: "" },
    { id: "i7", name: "Servisná sada pre stomatologickú súpravu", sku: "ADEC-SRV-KIT", qty: 3, min: 2, reserved: 1, category: "Náhradný diel", manufacturer: "A-dec", itemType: "Náhradný diel", location: "Prešov / kreslá", compatibility: "A-dec 300, 400, 500", note: "Doplniť presné diely podľa modelu." },
    { id: "i8", name: "Kompresorový filter", sku: "EKOM-FLT", qty: 4, min: 3, reserved: 0, category: "Náhradný diel", manufacturer: "Ekom", itemType: "Náhradný diel", location: "Prešov / technika", compatibility: "Ekom kompresory", note: "" },
    { id: "i9", name: "Násadec servisný diel", sku: "NSK-SRV", qty: 6, min: 4, reserved: 0, category: "Náhradný diel", manufacturer: "NSK", itemType: "Náhradný diel", location: "Prešov / násadce", compatibility: "NSK násadce a turbínky", note: "" }
  ],
  service: [
    { id: "s1", clientId: "c1", deviceId: "d2", title: "Diagnostika senzora v ordinácii 2", priority: "Vysoká", state: "Prebieha", technicianId: "u1", due: "2026-08-05" },
    { id: "s2", clientId: "c4", deviceId: "d5", title: "Kontrola NAS a výpadkov siete", priority: "Vysoká", state: "Naplánované", technicianId: "u2", due: "2026-08-06" },
    { id: "s3", clientId: "c2", deviceId: "d3", title: "Preventívna kontrola OPG", priority: "Stredná", state: "Naplánované", technicianId: "u3", due: "2026-08-12" },
    { id: "s4", clientId: "c3", deviceId: "d4", title: "Aktualizácia softvéru skenera", priority: "Nízka", state: "Hotové", technicianId: "u1", due: "2026-07-30" }
  ],
  notes: [
    { clientId: "c1", date: "2026-07-28", text: "Doplnené dokumenty ku Green X a zaznamenaná konfigurácia siete." },
    { clientId: "c4", date: "2026-08-01", text: "Ambulancia hlási občasné spomalenie pri ukladaní RTG snímok." }
  ],
  providerRegistry: [
    { id: "pr1", sourceId: "KSK-ZUB-001", idzz: "61-01234567-A0001", name: "Stomatologicka ambulancia Smile", providerName: "Smile Dental s.r.o.", ico: "50123456", specialty: "Zubna ambulancia", addressStreet: "Hlavna 12", city: "Kosice", addressZip: "040 01", district: "Kosice I", region: "Kosicky kraj", email: "ambulancia@smiledental.sk", phone: "0551234567", insurance: "Vszp, Dovera, Union", source: "e-VUC / ukazka", registryState: "Novy" },
    { id: "pr2", sourceId: "PSK-ZUB-018", idzz: "71-76543210-A0002", name: "DENT Plus Presov", providerName: "DENT Plus, s.r.o.", ico: "36765432", specialty: "Zubna ambulancia", addressStreet: "Sabinovska 8", city: "Presov", addressZip: "080 01", district: "Presov", region: "Presovsky kraj", email: "recepcia@dentplus.sk", phone: "051222333", insurance: "Vszp, Dovera", source: "e-VUC / ukazka", registryState: "Novy" },
    { id: "pr3", sourceId: "BSK-ZUB-104", idzz: "11-24681357-A0003", name: "OrthoDent Bratislava", providerName: "OrthoDent BA a.s.", ico: "47246813", specialty: "Ortodoncia / zubna ambulancia", addressStreet: "Ruzova dolina 19", city: "Bratislava", addressZip: "821 09", district: "Bratislava II", region: "Bratislavsky kraj", email: "info@orthodentba.sk", phone: "021234987", insurance: "Vszp, Union", source: "open data / ukazka", registryState: "Novy" },
    { id: "pr4", sourceId: "TTSK-ZUB-052", idzz: "21-11223344-A0004", name: "DentalCare Trnava", providerName: "DentalCare TT s.r.o.", ico: "44112233", specialty: "Zubna ambulancia", addressStreet: "Kollarova 4", city: "Trnava", addressZip: "917 01", district: "Trnava", region: "Trnavsky kraj", email: "trnava@dentalcare.sk", phone: "0335550101", insurance: "Dovera, Union", source: "open data / ukazka", registryState: "Novy" }
  ],
  documentTemplates: [
    { id: "tpl1", name: "Odovzdávací protokol", type: "Inštalácia", file: "documents/odovzdavaci-protokol.pdf", pages: 2, requiredFor: "Nová inštalácia" },
    { id: "tpl2", name: "Záznam o školení", type: "Školenie", file: "documents/skolenie.pdf", pages: 1, requiredFor: "RTG zariadenie" },
    { id: "tpl3", name: "Protokol o demontáži", type: "Demontáž", file: "documents/demontaz.pdf", pages: 1, requiredFor: "Demontáž RTG" },
    { id: "tpl4", name: "Servisný protokol", type: "Servis", file: "documents/servisny-protokol.pdf", pages: 1, requiredFor: "Servisný zásah / výjazd" }
  ],
  documentPackets: []
};

if (window.DENTAPP_IMPORTED_DATA) {
  seedData.clients = window.DENTAPP_IMPORTED_DATA.clients || seedData.clients;
  seedData.devices = window.DENTAPP_IMPORTED_DATA.devices || seedData.devices;
  seedData.service = window.DENTAPP_IMPORTED_DATA.service || seedData.service;
  seedData.notes = window.DENTAPP_IMPORTED_DATA.notes || seedData.notes;
}

let state = loadState();
ensureStateShape();
let session = null;
let supabaseAuth = null;
let portalSessionClientId = "";
let activeView = "dashboard";
let query = "";
let clientLetterFilter = "all";
let supabaseStatus = {
  state: "Neskontrolované",
  detail: "Supabase projekt je nakonfigurovaný, spustite test pripojenia.",
};
let loginPreviewTotals = savedLoginPreviewTotals();

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function hasSupabaseSettings() {
  const config = supabaseConfig();
  return Boolean(config.url && config.anonKey);
}

function friendlyAuthError(error, context = "login") {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("invalid login credentials")) {
    return context === "password"
      ? "Aktuálne heslo nie je správne. Skontrolujte ho a skúste to znova."
      : "Nesprávny e-mail alebo heslo. Skontrolujte prihlasovacie údaje a skúste to znova.";
  }
  if (message.includes("email not confirmed")) {
    return "E-mail používateľa ešte nie je potvrdený v Supabase Auth.";
  }
  if (message.includes("jwt") || message.includes("expired") || message.includes("session")) {
    return "Prihlásenie medzičasom expirovalo. Odhláste sa a prihláste sa znova.";
  }
  return error?.message || "Neznáma chyba.";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedData);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(seedData);
  }
}

function saveState() {
  if (dataMode === "supabase") {
    saveProviderRegistryState();
    updateLoginPreview();
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveProviderRegistryState();
  updateLoginPreview();
}

function savedProviderRegistryState() {
  try {
    const saved = localStorage.getItem(PROVIDER_REGISTRY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveProviderRegistryState() {
  if (!state?.providerRegistry) return;
  const compact = state.providerRegistry.map((provider) => ({
    id: provider.id,
    registryState: provider.registryState || "Novy",
    linkedClientId: provider.linkedClientId || "",
  }));
  localStorage.setItem(PROVIDER_REGISTRY_STORAGE_KEY, JSON.stringify(compact));
}

function ensureStateShape() {
  ensureOfficialUsers();
  state.documentTemplates = state.documentTemplates || structuredClone(seedData.documentTemplates);
  seedData.documentTemplates.forEach((template) => {
    if (!state.documentTemplates.some((item) => item.id === template.id)) {
      state.documentTemplates.push(structuredClone(template));
    }
  });
  state.documentPackets = state.documentPackets || [];
  state.notes = state.notes || [];
  state.auditLog = state.auditLog || [];
  state.service = state.service || [];
  const savedProviderRegistry = savedProviderRegistryState();
  state.providerRegistry = state.providerRegistry?.length ? state.providerRegistry : structuredClone(seedData.providerRegistry);
  state.providerRegistry.forEach((provider) => {
    const savedProvider = savedProviderRegistry.find((item) => item.id === provider.id);
    const registryState = savedProvider?.registryState || provider.registryState || "Novy";
    provider.registryState = registryState === "Pridane" ? "Importovane" : registryState === "Importovane" ? "Importovane" : "Novy";
    provider.linkedClientId = savedProvider?.linkedClientId || provider.linkedClientId || "";
  });
  state.users.forEach((user) => {
    user.phone = normalizePhoneNumber(user.phone || "");
  });
  const legacyTechnicianMap = {
    u1: "u-tech-jan-varga",
    u2: "u-tech-oliver-trencsik",
    u3: "u-tech-erik-bella",
  };
  state.service.forEach((item) => {
    item.technicianId = legacyTechnicianMap[item.technicianId] || item.technicianId;
    item.documentRecords = item.documentRecords || [];
    if (item.state === "Naplánované") item.state = "Naplánovaná";
  });
  state.documentPackets.forEach((packet) => {
    if (packet.documentType === "service") packet.billingState = packet.billingState || "Na fakturáciu";
    if (canOpenSignedDocument(packet)) ensureProtocolNumber(packet);
  });
  state.inventory = state.inventory || structuredClone(seedData.inventory);
  state.inventory.forEach((item) => {
    item.manufacturer = item.manufacturer || "Iné";
    item.itemType = item.itemType || item.category || "Servisný materiál";
    item.location = item.location || "";
    item.compatibility = item.compatibility || "";
    item.note = item.note || "";
  });
  state.clients.forEach((client) => {
    client.addressStreet = client.addressStreet || "";
    client.addressZip = client.addressZip || "";
    client.addressFloor = client.addressFloor || "";
    client.addressNote = client.addressNote || "";
    client.billingName = client.billingName || "";
    client.billingStreet = client.billingStreet || "";
    client.billingZip = client.billingZip || "";
    client.billingCity = client.billingCity || "";
    client.billingCompanyId = client.billingCompanyId || "";
    client.billingTaxId = client.billingTaxId || "";
    client.photo = client.photo || "";
    client.portalEnabled = client.portalEnabled ?? true;
    client.portalCode = client.portalCode || clientPortalCode(client);
  });
  state.devices.forEach((device) => {
    device.photo = device.photo || "";
    device.invoiceIssued = Boolean(device.invoiceIssued || device.invoiceFile);
    device.invoiceNumber = device.invoiceNumber || "";
    device.invoiceDate = device.invoiceDate || "";
    device.invoiceFile = device.invoiceFile || "";
    device.invoiceFileName = device.invoiceFileName || "";
    device.documentRecords = device.documentRecords || [];
  });
}

function ensureOfficialUsers() {
  const demoUserNames = new Set(["Martin Kováč", "Peter Bartoš", "Lukáš Urban", "Andrea Nová", "Marek Hronec"]);
  const existing = state.users || [];
  const mergedOfficialUsers = officialUsers.map((official) => {
    const current = existing.find((user) => user.id === official.id || user.email === official.email || user.name === official.name);
    return {
      ...official,
      ...(current || {}),
      protected: official.protected || current?.protected || false,
    };
  });
  const customUsers = existing.filter((user) => {
    if (demoUserNames.has(user.name)) return false;
    return !officialUsers.some((official) => official.id === user.id || official.email === user.email || official.name === user.name);
  });
  state.users = [
    ...mergedOfficialUsers,
    ...customUsers.map((user) => ({ active: true, ...user, protected: false })),
  ];
  if (!state.users.some((user) => user.role === "SuperAdministrátor" && user.active)) {
    state.users[0].role = "SuperAdministrátor";
    state.users[0].active = true;
    state.users[0].protected = true;
  }
  state.users.forEach((user) => {
    user.passwordHash = user.passwordHash || hashPassword(DEFAULT_PASSWORD);
    user.mustChangePassword = user.mustChangePassword ?? true;
  });
}

function hashPassword(value = "") {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

function byId(collection, id) {
  return state[collection].find((item) => item.id === id);
}

function nextId(prefix, collection) {
  return `${prefix}${Date.now().toString(36)}`;
}

function protocolPrefixForRecord(record = {}) {
  if (record.documentType === "service" || record.kind === "Servis") return "SP";
  if (record.kind === "Demontáž") return "DP";
  return "OP";
}

function protocolNumber(record = {}) {
  return record.protocolNumber || record.serviceValues?.protocolNumber || "";
}

function nextProtocolNumber(kind, dateValue = "") {
  const year = String(dateValue || new Date().toISOString().slice(0, 10)).slice(0, 4);
  const prefix = kind === "service" ? "SP" : kind === "demolition" ? "DP" : "OP";
  const highest = state.documentPackets.reduce((max, record) => {
    const value = protocolNumber(record);
    const match = value.match(new RegExp(`^${prefix}-${year}-(\\d{4})$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${year}-${String(highest + 1).padStart(4, "0")}`;
}

function ensureProtocolNumber(record, kind = "") {
  if (!record) return "";
  const existing = protocolNumber(record);
  if (existing) {
    record.protocolNumber = existing;
    record.serviceValues = { ...(record.serviceValues || {}), protocolNumber: existing };
    return existing;
  }
  const generated = nextProtocolNumber(kind || (record.documentType === "service" ? "service" : record.kind === "Demontáž" ? "demolition" : "handover"), record.date || record.due || record.createdAt);
  record.protocolNumber = generated;
  record.serviceValues = { ...(record.serviceValues || {}), protocolNumber: generated };
  return generated;
}

function isUuid(value = "") {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function clientPortalCode(client) {
  return `DA-${hashPassword(`${client.id}-${client.name}`).slice(0, 6).toUpperCase()}`;
}

function normalizePortalCode(value = "") {
  return String(value).trim().replace(/\s+/g, "").toUpperCase();
}

function findClientByPortalCode(value = "") {
  const code = normalizePortalCode(value);
  return state.clients.find((client) => client.portalEnabled && normalizePortalCode(client.portalCode) === code);
}

function statusClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (["ok", "aktívna", "hotové"].includes(normalized)) return "status-ok";
  if (["pozor", "záruka končí", "prebieha", "stredná", "importované", "importovane", "na podpis", "na ceste", "čaká na diel", "na fakturáciu", "exportované", "rezervované"].includes(normalized)) return "status-warning";
  if (["riziko", "vysoká"].includes(normalized)) return "status-critical";
  if (["nová", "novy", "naplánovaná", "naplánované", "nízka", "pripravené", "skladom"].includes(normalized)) return "status-planned";
  if (["podpísané", "odovzdané", "fakturované"].includes(normalized)) return "status-ok";
  return "status-active";
}

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Doplniť";
  return new Intl.DateTimeFormat("sk-SK").format(date);
}

function formatOptionalDate(value, fallback = "neuvedené") {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("sk-SK").format(date);
}

function isPlaceholderValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return !normalized || normalized === "doplniť" || normalized === "doplnit" || normalized.startsWith("doplniť ") || normalized.startsWith("doplnit ");
}

function cleanImportedValue(value) {
  return isPlaceholderValue(value) ? "" : String(value || "").trim();
}

function normalizeSerial(value = "") {
  return cleanImportedValue(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function findDeviceBySerial(serial, exceptId = "") {
  const normalized = normalizeSerial(serial);
  if (!normalized) return null;
  return state.devices.find((device) => device.id !== exceptId && normalizeSerial(device.serial) === normalized) || null;
}

function getClientDevices(clientId) {
  return state.devices.filter((device) => device.clientId === clientId);
}

function getClientService(clientId) {
  return visibleServiceItems().filter((item) => item.clientId === clientId);
}

function visibleServiceItems() {
  return isAdmin()
    ? state.service
    : state.service.filter((item) => item.technicianId === session?.id);
}

function isAdmin() {
  const role = (session?.role || "").toLowerCase();
  return role.includes("admin");
}

function isSuperAdmin() {
  return session?.role === "SuperAdministrátor";
}

function technicianAssignableUsers() {
  return state.users.filter((user) => ["Technik", "SuperAdministrátor"].includes(user.role));
}

function canEditUser(user) {
  if (!user || !isAdmin()) return false;
  if (user.protected && user.id !== session?.id) return false;
  if (isSuperAdmin()) return true;
  return user.role === "Technik" && !user.protected;
}

function canAccessService(service) {
  return Boolean(service && (isAdmin() || service.technicianId === session?.id));
}

function matchesServiceStatusFilter(service) {
  if (serviceStatusFilter === "all") return true;
  if (serviceStatusFilter === "open") return !["Hotové", "Fakturované"].includes(service.state);
  return service.state === serviceStatusFilter;
}

function serviceDueDate(service) {
  const date = new Date(service.due);
  return service.due && !Number.isNaN(date.getTime()) ? date : null;
}

function sameDate(a, b) {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

function matchesDashboardServiceFilter(service) {
  const today = new Date();
  const due = serviceDueDate(service);
  const doneStates = ["Hotové", "Fakturované"];
  if (dashboardServiceFilter === "all") return true;
  if (dashboardServiceFilter === "open") return !doneStates.includes(service.state);
  if (dashboardServiceFilter === "done") return doneStates.includes(service.state);
  if (dashboardServiceFilter === "overdue") return due && due < new Date(today.toISOString().slice(0, 10)) && !doneStates.includes(service.state);
  if (dashboardServiceFilter === "today") return due && sameDate(due, today);
  if (dashboardServiceFilter === "week") {
    const end = new Date(today);
    end.setDate(today.getDate() + 7);
    return due && due >= new Date(today.toISOString().slice(0, 10)) && due <= end;
  }
  return service.state === dashboardServiceFilter;
}

function clientName(id) {
  return id ? (byId("clients", id)?.name || "Neznámy klient") : "Sklad / nepriradené";
}

function isStockDevice(device) {
  return !device?.clientId;
}

function deviceName(id) {
  const device = byId("devices", id);
  if (!device) return "Neznáme zariadenie";
  return [cleanImportedValue(device.brand), cleanImportedValue(device.model)].filter(Boolean).join(" ") || cleanImportedValue(device.type) || "Neznáme zariadenie";
}

function deviceLabel(device) {
  return `${[cleanImportedValue(device.brand), cleanImportedValue(device.model)].filter(Boolean).join(" ") || "Zariadenie"} - SN ${cleanImportedValue(device.serial) || "neuvedené"}`;
}

function isDeviceInvoiced(device) {
  return Boolean(device?.invoiceIssued || device?.invoiceFile || device?.invoiceNumber);
}

function invoiceLabel(device) {
  if (!isDeviceInvoiced(device)) return "Nefakturované";
  return device.invoiceNumber ? `Fakturované - ${device.invoiceNumber}` : "Fakturované";
}

function invoiceLink(device, label = "Otvoriť FA") {
  if (!device?.invoiceFile) return "";
  const fileName = device.invoiceFileName || `FA-${device.serial || device.id}.pdf`;
  return `<a class="ghost-action invoice-link" href="${device.invoiceFile}" target="_blank" rel="noreferrer" download="${escapeHtml(fileName)}">${label}</a>`;
}

function clientAddress(client) {
  return [client.addressStreet, client.city, client.addressZip, client.addressFloor].filter(Boolean).join(", ") || client.city || "Doplniť";
}

function billingAddress(client) {
  const billing = [client.billingName, client.billingStreet, client.billingCity, client.billingZip].filter(Boolean).join(", ");
  return billing || "Rovnaká ako adresa ambulancie";
}

function clientSearchText(client) {
  return [
    client.name,
    client.city,
    client.addressStreet,
    client.addressZip,
    client.addressFloor,
    client.addressNote,
    client.billingName,
    client.billingStreet,
    client.billingCity,
    client.billingZip,
    client.contact,
    client.email,
    client.phone,
    client.note
  ].join(" ");
}

function userName(id) {
  return byId("users", id)?.name || "Nepriradené";
}

function matchesSearch(...values) {
  if (!query) return true;
  const haystack = normalizeSearch(values.join(" "));
  return normalizeSearch(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function normalizeSearch(value = "") {
  return String(value).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractIcoFromIdzz(idzz = "") {
  const match = String(idzz).match(/\b\d{2}-(\d{8})-[A-Z]\d{4}\b/i);
  return match ? match[1] : "";
}

function providerIco(provider = {}) {
  return String(provider.ico || extractIcoFromIdzz(provider.idzz) || "").replace(/\D/g, "");
}

function imagePreview(src, alt) {
  return src
    ? `<img class="entity-photo" src="${src}" alt="${escapeHtml(alt)}">`
    : `<div class="entity-photo placeholder">Bez fotografie</div>`;
}

function clientPicker(selectedId = "", allowCreate = false, required = true) {
  const selected = byId("clients", selectedId);
  return `
    <label class="client-picker" data-allow-create-client="${allowCreate ? "true" : "false"}">
      <span>Ambulancia</span>
      <input name="clientSearch" list="clientOptions" placeholder="Začnite písať názov, mesto alebo ulicu..." value="${escapeHtml(selected?.name || "")}" ${required ? "required" : ""}>
      <input type="hidden" name="clientId" value="${escapeHtml(selectedId)}">
      <datalist id="clientOptions">
        ${state.clients.map((client) => `<option value="${escapeHtml(client.name)}" label="${escapeHtml(clientAddress(client))}"></option>`).join("")}
      </datalist>
      <div class="search-result-list client-result-list" data-client-search-results></div>
      ${allowCreate ? `
        <div class="quick-client-form is-hidden" data-quick-client-form>
          <strong>Nová ambulancia</strong>
          <div class="quick-client-grid">
            <input data-quick-client="name" type="text" placeholder="Názov ambulancie">
            <input data-quick-client="city" type="text" placeholder="Mesto">
            <input data-quick-client="addressStreet" type="text" placeholder="Ulica a číslo">
            <input data-quick-client="contact" type="text" placeholder="Kontaktná osoba">
            <input data-quick-client="email" type="email" placeholder="E-mail">
            <input data-quick-client="phone" type="tel" placeholder="Telefón">
          </div>
          <div class="button-row">
            <button class="primary-action" type="button" data-save-quick-client>Uložiť ambulanciu</button>
            <button class="ghost-action" type="button" data-cancel-quick-client>Zrušiť</button>
          </div>
        </div>
      ` : ""}
      <small class="field-hint">${required ? "Vyberte ambulanciu zo zobrazených zhôd." : "Nechajte prázdne, ak je zariadenie zatiaľ voľné na sklade."}</small>
    </label>
  `;
}

function findClientByTypedValue(value) {
  const typed = value.trim().toLowerCase();
  if (!typed) return null;
  return state.clients.find((client) => client.name.toLowerCase() === typed)
    || state.clients.find((client) => clientSearchText(client).toLowerCase().includes(typed));
}

function bindClientPickers(scope) {
  qsa(".client-picker", scope).forEach((picker) => {
    const textInput = qs("[name='clientSearch']", picker);
    const hiddenInput = qs("[name='clientId']", picker);
    const results = qs("[data-client-search-results]", picker);
    const quickForm = qs("[data-quick-client-form]", picker);
    const allowCreate = picker.dataset.allowCreateClient === "true";
    const renderClientResults = () => {
      const typed = textInput.value.trim().toLowerCase();
      const matches = typed
        ? state.clients
          .filter((client) => clientSearchText(client).toLowerCase().includes(typed))
          .slice(0, 8)
        : [];
      const exactMatch = matches.some((client) => client.name.toLowerCase() === typed);
      results.innerHTML = matches.map((client) => `
        <button class="search-result-button" type="button" data-pick-client="${client.id}">
          <strong>${client.name}</strong>
          <small>${clientAddress(client)}</small>
        </button>
      `).join("") + (allowCreate && typed && !exactMatch ? `
        <button class="search-result-button create-result-button" type="button" data-open-quick-client>
          <strong>Vytvoriť ambulanciu „${escapeHtml(textInput.value.trim())}”</strong>
          <small>Ambulancia ešte nie je v zozname. Založí sa bez odchodu z balíka.</small>
        </button>
      ` : "");
      qsa("[data-pick-client]", results).forEach((button) => {
        button.addEventListener("click", () => {
          const client = byId("clients", button.dataset.pickClient);
          if (!client) return;
          textInput.value = client.name;
          hiddenInput.value = client.id;
          results.innerHTML = "";
          quickForm?.classList.add("is-hidden");
          hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
      qs("[data-open-quick-client]", results)?.addEventListener("click", () => {
        const nameInput = qs("[data-quick-client='name']", picker);
        if (nameInput && !nameInput.value.trim()) nameInput.value = textInput.value.trim();
        results.innerHTML = "";
        quickForm?.classList.remove("is-hidden");
        nameInput?.focus();
      });
    };
    qs("[data-save-quick-client]", picker)?.addEventListener("click", () => saveQuickClientFromPicker(picker));
    qs("[data-cancel-quick-client]", picker)?.addEventListener("click", () => {
      quickForm?.classList.add("is-hidden");
      renderClientResults();
    });
    textInput.addEventListener("input", () => {
      const exactClient = state.clients.find((client) => client.name.toLowerCase() === textInput.value.trim().toLowerCase());
      const client = exactClient || null;
      hiddenInput.value = client?.id || "";
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      renderClientResults();
    });
    textInput.addEventListener("focus", renderClientResults);
  });
}

async function saveQuickClientFromPicker(picker) {
  const value = (key) => qs(`[data-quick-client='${key}']`, picker)?.value.trim() || "";
  const name = value("name");
  if (!name) {
    alert("Zadajte názov ambulancie.");
    return;
  }
  const existing = findClientByTypedValue(name);
  if (existing) {
    qs("[name='clientSearch']", picker).value = existing.name;
    qs("[name='clientId']", picker).value = existing.id;
    qs("[data-quick-client-form]", picker)?.classList.add("is-hidden");
    qs("[name='clientId']", picker).dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }
  const client = {
    id: nextId("c", "clients"),
    name,
    city: value("city"),
    addressStreet: value("addressStreet"),
    addressZip: "",
    addressFloor: "",
    contact: value("contact"),
    email: value("email"),
    phone: normalizePhoneNumber(value("phone")),
    status: "Aktívna",
    segment: "Ambulancia",
    note: "Založené rýchlo pri tvorbe podpisového balíka.",
    portalEnabled: true,
  };

  try {
    if (dataMode === "supabase") {
      await saveClientToSupabase(client);
      await loadSupabaseDataIntoState();
    } else {
      state.clients.push(client);
      saveState();
    }
    const savedClient = byId("clients", client.id) || findClientByTypedValue(name);
    if (!savedClient) throw new Error("Ambulancia sa uložila, ale nepodarilo sa ju znova načítať.");
    qs("[name='clientSearch']", picker).value = savedClient.name;
    qs("[name='clientId']", picker).value = savedClient.id;
    qs("[data-client-search-results]", picker).innerHTML = "";
    qs("[data-quick-client-form]", picker)?.classList.add("is-hidden");
    qs("[name='clientId']", picker).dispatchEvent(new Event("change", { bubbles: true }));
    addAudit(dataMode === "supabase" ? "Pridaná ambulancia online" : "Pridaná ambulancia", `${savedClient.name} - rýchle založenie z podpisového balíka`);
  } catch (error) {
    alert(`Rýchle založenie ambulancie zlyhalo: ${error.message}`);
  }
}

function updateLoginPreview() {
  const clientsTotal = loginPreviewTotals?.clients ?? state.clients.length;
  const devicesTotal = loginPreviewTotals?.devices ?? state.devices.length;
  const risksTotal = loginPreviewTotals?.risks ?? (
    state.devices.filter((device) => device.status !== "OK" && device.status !== "Importované").length
    + state.inventory.filter((item) => item.qty <= item.min).length
  );
  const clientsCount = qs("[data-login-clients]");
  const devicesCount = qs("[data-login-devices]");
  const risksCount = qs("[data-login-risks]");

  if (clientsCount) clientsCount.textContent = clientsTotal.toLocaleString("sk-SK");
  if (devicesCount) devicesCount.textContent = devicesTotal.toLocaleString("sk-SK");
  if (risksCount) risksCount.textContent = risksTotal.toLocaleString("sk-SK");
}

function savedLoginPreviewTotals() {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_PREVIEW_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveLoginPreviewTotals(totals) {
  loginPreviewTotals = totals;
  localStorage.setItem(LOGIN_PREVIEW_STORAGE_KEY, JSON.stringify(totals));
  updateLoginPreview();
}

async function refreshLoginPreviewTotals() {
  try {
    const token = savedSupabaseAuth()?.access_token || supabaseAuth?.access_token || "";
    const fallbackRisks =
      loginPreviewTotals?.risks ??
      state.devices.filter((device) => device.status !== "OK" && device.status !== "Importované").length +
        state.inventory.filter((item) => item.qty <= item.min).length;
    const [clients, devices] = await Promise.all([
      supabaseCount("clients?select=id", token),
      supabaseCount("devices?select=id", token),
    ]);
    saveLoginPreviewTotals({ clients, devices, risks: fallbackRisks });
  } catch {
    updateLoginPreview();
  }
}

function initLogin() {
  updateLoginPreview();
  refreshLoginPreviewTotals();

  qsa("[data-login-mode]").forEach((button) => {
    button.onclick = () => {
      const mode = button.dataset.loginMode;
      qsa("[data-login-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
      qs("#loginForm").classList.toggle("is-hidden", mode !== "internal");
      qs("#portalLoginForm").classList.toggle("is-hidden", mode !== "portal");
    };
  });

  qs("#loginForm").onsubmit = async (event) => {
    event.preventDefault();
    const email = qs("#loginEmail").value.trim();
    const password = qs("#loginPin").value;
    if (!email || !password) {
      alert("Zadajte e-mail a heslo.");
      return;
    }

    let user = null;
    try {
      user = await loginWithSupabase(email, password);
      supabaseStatus = { state: "Prihlásené", detail: `Supabase Auth prihlásil používateľa ${user.name}.` };
    } catch (error) {
      supabaseAuth = null;
      alert(friendlyAuthError(error, "login"));
      return;
    }

    await enterAuthenticatedApp(user);
    if (!session.online && session.mustChangePassword) openChangePasswordForm(true);
  };

  qs("#portalLoginForm").onsubmit = (event) => {
    event.preventDefault();
    const client = findClientByPortalCode(qs("#portalCodeInput").value);
    if (!client) {
      alert("Prístupový kód ambulancie sa nenašiel alebo portál nie je aktívny.");
      return;
    }
    openClientPortalPage(client.id);
  };

  qs("#logoutButton").onclick = () => {
    session = null;
    supabaseAuth = null;
    clearSupabaseAuth();
    qs("#loginEmail").value = "";
    qs("#loginPin").value = "";
    qs("#appShell").classList.add("is-hidden");
    qs("#loginScreen").classList.remove("is-hidden");
    updateLoginPreview();
    refreshLoginPreviewTotals();
  };
  qs("#portalLogoutButton").onclick = () => {
    portalSessionClientId = "";
    qs("#portalCodeInput").value = "";
    qs("#clientPortalShell").classList.add("is-hidden");
    qs("#loginScreen").classList.remove("is-hidden");
  };
  qs("#changePasswordButton").onclick = () => {
    openChangePasswordForm(false);
  };
}

async function enterAuthenticatedApp(user) {
  session = user;
  portalSessionClientId = "";
  if (session.online && dataMode === "supabase") {
    try {
      await loadSupabaseDataIntoState();
    } catch (error) {
      supabaseStatus = { state: "Supabase načítanie zlyhalo", detail: error.message };
    }
  }
  qs("#loginScreen").classList.add("is-hidden");
  qs("#appShell").classList.remove("is-hidden");
  qs("#clientPortalShell").classList.add("is-hidden");
  document.body.classList.remove("auth-booting");
  qs("#activeUser").textContent = session.name;
  qs("#activeRole").textContent = session.role;
  qsa(".admin-only").forEach((item) => item.classList.toggle("is-hidden", !isAdmin()));
  updateLoginPreview();
  render();
}

async function restoreLoginOnStart() {
  const user = await restoreSupabaseSession();
  if (!user) {
    document.body.classList.remove("auth-booting");
    return;
  }
  supabaseStatus = { state: "Prihlásené", detail: `Obnovené prihlásenie používateľa ${user.name}.` };
  await enterAuthenticatedApp(user);
}

function initNavigation() {
  const sidebar = qs(".sidebar");
  const menuButton = qs("#menuButton");
  const closeSidebar = () => {
    sidebar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  const toggleSidebar = () => {
    const isOpen = sidebar.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  };

  qsa("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item === button));
      closeSidebar();
      render();
    });
  });

  qs("#globalSearch").addEventListener("input", (event) => {
    query = event.target.value.trim();
    clientLetterFilter = "all";
    render();
  });

  menuButton.setAttribute("aria-controls", "sidebar");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", toggleSidebar);
  qsa("[data-close-sidebar]").forEach((button) => button.addEventListener("click", closeSidebar));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });
}

function openSerialSearch() {
  openModal("Rýchle hľadanie podľa SN", `
    <form class="form-grid" id="serialSearchForm">
      ${input("serial", "Sériové číslo", "napr. VEX300S", "text", qs("#globalSearch").value || "")}
      <button class="primary-action full" type="submit">Otvoriť zariadenie</button>
    </form>
  `, (modal) => qs("#serialSearchForm", modal).addEventListener("submit", (event) => {
    event.preventDefault();
    const value = formValues(event.target).serial.trim().toLowerCase();
    const device = state.devices.find((item) => (item.serial || "").toLowerCase() === value)
      || state.devices.find((item) => (item.serial || "").toLowerCase().includes(value));
    if (!device) {
      alert("Zariadenie s týmto sériovým číslom sa nenašlo.");
      return;
    }
    qsa(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    openDeviceProfile(device.id);
  }));
}

function openChangePasswordForm(required = false) {
  openModal(required ? "Zmena prvého hesla" : "Zmeniť heslo", `
    <form class="form-grid" id="passwordForm" data-required="${required ? "true" : "false"}">
      ${required ? `<p class="form-note full">Používate dočasné heslo. Pred pokračovaním si nastavte vlastné heslo.</p>` : ""}
      ${input("currentPassword", "Aktuálne heslo", "", "password")}
      ${input("newPassword", "Nové heslo", "aspoň 8 znakov", "password")}
      ${input("confirmPassword", "Potvrdenie nového hesla", "", "password")}
      <button class="primary-action full" type="submit">Uložiť nové heslo</button>
    </form>
  `, (modal) => {
    if (required) qs("[data-close-modal]", modal).classList.add("is-hidden");
    qs("#passwordForm", modal).addEventListener("submit", savePasswordChange);
  });
}

async function savePasswordChange(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  if ((values.newPassword || "").length < 8) {
    alert("Nové heslo musí mať aspoň 8 znakov.");
    return;
  }
  if (values.newPassword !== values.confirmPassword) {
    alert("Nové heslá sa nezhodujú.");
    return;
  }
  const submitButton = qs("button[type='submit']", form);
  submitButton.disabled = true;
  submitButton.textContent = "Ukladám heslo...";

  try {
    if (dataMode === "supabase" && hasSupabaseSettings()) {
      await changeSupabasePassword(values.currentPassword, values.newPassword);
    } else if (session.passwordHash !== hashPassword(values.currentPassword)) {
      alert("Aktuálne heslo nie je správne.");
      return;
    }

    const user = byId("users", session.id);
    if (user) {
      user.passwordHash = hashPassword(values.newPassword);
      user.mustChangePassword = false;
      session = { ...session, ...user, mustChangePassword: false };
      saveState();
    } else {
      session.mustChangePassword = false;
    }
    closeCurrentModal(form);
    alert("Heslo bolo zmenené.");
  } catch (error) {
    alert(`Zmena hesla zlyhala: ${friendlyAuthError(error, "password")}`);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Uložiť nové heslo";
  }
}

function setTitle(title, kicker = "DentAll CRM") {
  qs("#viewTitle").textContent = title;
  qs("#viewKicker").textContent = kicker;
}

function render() {
  const content = qs("#content");
  const views = {
    dashboard: renderDashboard,
    clients: renderClients,
    providers: renderProviderRegistry,
    devices: renderDevices,
    inventory: renderInventory,
    service: renderService,
    documents: renderDocuments,
    admin: renderAdmin
  };
  content.innerHTML = views[activeView]();
  bindViewActions(content);
}

function renderDashboard() {
  setTitle("Prehľad", "Operatíva");
  const warrantySoon = state.devices.filter((device) => new Date(device.warrantyUntil) < new Date("2027-01-01")).length;
  const lowStock = state.inventory.filter((item) => item.qty <= item.min).length;
  const serviceItems = visibleServiceItems();
  const openService = serviceItems.filter((item) => !["Hotové", "Fakturované"].includes(item.state)).length;
  const visibleService = serviceItems
    .filter(matchesDashboardServiceFilter)
    .filter((item) => matchesSearch(clientName(item.clientId), item.title, deviceName(item.deviceId), item.state, item.priority));

  return `
    <section class="metrics-grid">
      ${metric("Ambulancie", state.clients.length, "škálovanie na 500+ profilov")}
      ${metric("Zariadenia", state.devices.length, `${warrantySoon} so zárukou do 2027`)}
      ${metric("Otvorený servis", openService, "úlohy pre technikov")}
      ${metric("Skladové riziká", lowStock, "položky na minime")}
    </section>
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <h3>Servisný plán</h3>
          <button class="secondary-action" type="button" data-open-service-form>Nová úloha</button>
        </div>
        <div class="toolbar compact dashboard-service-toolbar">
          <label>
            <span>Filter úloh</span>
            <select data-dashboard-service-filter>
              <option value="open" ${dashboardServiceFilter === "open" ? "selected" : ""}>Otvorené</option>
              <option value="overdue" ${dashboardServiceFilter === "overdue" ? "selected" : ""}>Omeškané</option>
              <option value="today" ${dashboardServiceFilter === "today" ? "selected" : ""}>Dnes</option>
              <option value="week" ${dashboardServiceFilter === "week" ? "selected" : ""}>Najbližších 7 dní</option>
              <option value="done" ${dashboardServiceFilter === "done" ? "selected" : ""}>Hotové / fakturované</option>
              <option value="all" ${dashboardServiceFilter === "all" ? "selected" : ""}>Všetko</option>
              ${serviceStates.map((stateName) => `<option value="${stateName}" ${dashboardServiceFilter === stateName ? "selected" : ""}>${stateName}</option>`).join("")}
            </select>
          </label>
          <p class="form-note">${visibleService.length} úloh vo výbere</p>
        </div>
        ${visibleService.length ? serviceTable(visibleService) : emptyState("Pre tento filter nie sú žiadne servisné úlohy.")}
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Rýchle riziká</h3></div>
        <div class="card-grid">
          ${state.inventory.filter((item) => item.qty <= item.min).map((item) => `
            <article class="record-card risk-card">
              <span class="status-pill status-low">Sklad</span>
              <h3>${item.name}</h3>
              <p>${item.qty} ks na sklade, minimum ${item.min} ks.</p>
              ${isAdmin() ? `<button class="ghost-action" type="button" data-edit-inventory="${item.id}">Upraviť sklad</button>` : ""}
            </article>
          `).join("")}
          ${state.devices.filter((device) => device.status !== "OK").map((device) => `
            <article class="record-card risk-card">
              <span class="status-pill ${statusClass(device.status)}">${device.status}</span>
              <h3>${deviceName(device.id)}</h3>
              <p>${clientName(device.clientId)} - ${device.serial}</p>
              <button class="ghost-action" type="button" data-device-profile="${device.id}">Otvoriť profil</button>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function metric(label, value, note) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
}

function renderClients() {
  setTitle("Ambulancie", "Klienti");
  const searchedClients = state.clients.filter((client) => matchesSearch(clientSearchText(client)));
  const clients = searchedClients.filter((client) => clientLetterFilter === "all" || firstClientLetter(client) === clientLetterFilter);
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Zoznam zubných ambulancií</h3>
        <button class="primary-action" type="button" data-open-client-form>Pridať ambulanciu</button>
      </div>
      <div class="toolbar compact">
        <p class="form-note">Každá ambulancia má vlastný profil pre zariadenia, záruky, dokumenty a servis.</p>
      </div>
      ${clientAlphabetNav(searchedClients)}
      ${clients.length ? clientsTable(clients) : emptyState("Nenašli sa žiadne ambulancie.")}
    </section>
  `;
}

function providerSearchText(provider) {
  const ico = providerIco(provider);
  return [
    providerDisplayName(provider),
    provider.name,
    provider.providerName,
    ico,
    provider.idzz,
    provider.sourceId,
    provider.specialty,
    provider.addressStreet,
    provider.city,
    provider.district,
    provider.region,
    provider.email,
    provider.phone,
    provider.insurance,
    provider.source,
    provider.registryState,
  ].join(" ");
}

function providerMatchesLookup(provider, value) {
  const search = normalizeSearch(value);
  if (!search) return false;
  const haystack = normalizeSearch(providerSearchText(provider));
  return search.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

function providerClientPayload(provider) {
  const ico = providerIco(provider);
  const providerIdentifier = ico ? `IČO: ${ico}` : `IdZZ: ${provider.idzz || "nezadané"}`;
  return {
    id: `reg-${provider.id}`,
    name: providerDisplayName(provider),
    status: "Aktívna",
    segment: "Ambulancia",
    contact: "",
    email: provider.email || "",
    phone: normalizePhoneNumber(provider.phone || ""),
    addressStreet: provider.addressStreet || "",
    city: provider.city || "",
    addressZip: provider.addressZip || "",
    addressFloor: "",
    addressNote: `Import z registra poskytovateľov: ${provider.source || "verejný register"}. ${providerIdentifier}.`,
    billingName: provider.providerName || provider.name || "",
    billingStreet: provider.addressStreet || "",
    billingCity: provider.city || "",
    billingZip: provider.addressZip || "",
    billingCompanyId: ico,
    billingTaxId: "",
    note: `Zdroj: ${provider.source || ""}. Prevádzka: ${provider.name || ""}. IdZZ: ${provider.idzz || "nezadané"}. IČO: ${ico || "nezadané"}. Odbornosť: ${provider.specialty || ""}. Poisťovne: ${provider.insurance || ""}.`,
    photo: "",
    portalEnabled: true,
  };
}

function applyProviderToClientForm(form, provider) {
  const payload = providerClientPayload(provider);
  const setValue = (name, value) => {
    const field = qs(`[name='${name}']`, form);
    if (field) field.value = value || "";
  };
  setValue("name", payload.name);
  setValue("addressStreet", payload.addressStreet);
  setValue("city", payload.city);
  setValue("addressZip", payload.addressZip);
  setValue("email", payload.email);
  setValue("phone", payload.phone);
  setValue("segment", payload.segment);
  setValue("billingCompanyId", payload.billingCompanyId);
  setValue("billingName", payload.billingName);
  setValue("billingStreet", payload.billingStreet);
  setValue("billingCity", payload.billingCity);
  setValue("billingZip", payload.billingZip);
  setValue("addressNote", payload.addressNote);
  setValue("note", payload.note);
}

function openProviderLookupForClient(form) {
  const ico = qs("[name='billingCompanyId']", form)?.value || "";
  const name = qs("[name='name']", form)?.value || "";
  const term = ico.trim() || name.trim();
  if (term.length < 2) {
    alert("Zadajte IČO alebo časť názvu ambulancie/firmy.");
    return;
  }
  const matches = (state.providerRegistry || [])
    .filter((provider) => providerMatchesLookup(provider, term))
    .slice(0, 10);
  if (!matches.length) {
    alert("V registri sa nenašla žiadna zhoda.");
    return;
  }
  if (matches.length === 1) {
    applyProviderToClientForm(form, matches[0]);
    return;
  }
  const parentModal = form.closest(".modal-backdrop");
  openModal("Vybrať z registra", `
    <div class="search-result-list provider-lookup-list">
      ${matches.map((provider) => `
        <button class="search-result-button" type="button" data-apply-provider-client="${provider.id}">
          <strong>${providerDisplayName(provider)}</strong>
          <small>${provider.name || ""}${providerIco(provider) ? ` - IČO ${providerIco(provider)}` : ""}${provider.idzz ? ` - IdZZ ${provider.idzz}` : ""}</small>
          <small>${provider.addressStreet || ""}, ${provider.addressZip || ""} ${provider.city || ""}</small>
        </button>
      `).join("")}
    </div>
  `, (modal) => {
    qsa("[data-apply-provider-client]", modal).forEach((button) => {
      button.addEventListener("click", () => {
        const provider = providerById(button.dataset.applyProviderClient);
        if (provider) applyProviderToClientForm(form, provider);
        modal.remove();
        parentModal?.classList.remove("is-muted");
      });
    });
    parentModal?.classList.add("is-muted");
  });
}

function providerDisplayName(provider) {
  return provider.providerName || provider.name || "Ambulancia z registra";
}

function providerIdentifierLabel(provider) {
  const ico = providerIco(provider);
  if (ico) return `IČO: ${ico}`;
  if (provider.idzz) return `IdZZ: ${provider.idzz}`;
  return "Nezadané";
}

function providerMatchedClient(provider) {
  const ico = providerIco(provider);
  return state.clients.find((client) => {
    const clientIco = String(client.billingCompanyId || "").replace(/\D/g, "");
    if (ico && clientIco && ico === clientIco) return true;
    return normalizeSearch(client.name) === normalizeSearch(provider.name)
      || normalizeSearch(client.name) === normalizeSearch(provider.providerName);
  });
}

function providerRegistryMetrics(providers) {
  const importedCount = providers.filter((provider) => provider.registryState === "Importovane" || provider.linkedClientId).length;
  const newCount = providers.length - importedCount;
  return `
    <section class="metrics-grid provider-metrics">
      ${metric("V registri", providers.length, "ukážkové záznamy pred importom")}
      ${metric("Nové", newCount, "čakajú na posúdenie")}
      ${metric("Importované", importedCount, "už sú medzi klientmi")}
    </section>
  `;
}

function renderProviderRegistry() {
  setTitle("Register ambulancií", "Verejné zdroje");
  const providers = state.providerRegistry || [];
  const regions = [...new Set(providers.map((provider) => provider.region).filter(Boolean))].sort((a, b) => a.localeCompare(b, "sk-SK"));
  const districts = [...new Set(providers
    .filter((provider) => providerRegionFilter === "all" || provider.region === providerRegionFilter)
    .map((provider) => provider.district)
    .filter(Boolean))].sort((a, b) => a.localeCompare(b, "sk-SK"));
  if (providerRegionFilter !== "all" && !regions.includes(providerRegionFilter)) providerRegionFilter = "all";
  if (providerDistrictFilter !== "all" && !districts.includes(providerDistrictFilter)) providerDistrictFilter = "all";
  const filtered = providers
    .filter((provider) => {
      if (providerRegistryFilter === "all") return true;
      if (providerRegistryFilter === "Importovane") return provider.registryState === "Importovane" || provider.linkedClientId;
      return provider.registryState !== "Importovane" && !provider.linkedClientId;
    })
    .filter((provider) => providerRegionFilter === "all" || provider.region === providerRegionFilter)
    .filter((provider) => providerDistrictFilter === "all" || provider.district === providerDistrictFilter)
    .filter((provider) => matchesSearch(providerSearchText(provider)));
  return `
    ${providerRegistryMetrics(providers)}
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Externý zoznam poskytovateľov</h3>
          <p class="form-note">Ukážka oddeleného registra. Do klientov sa ambulancia dostane až po vedomom pridaní.</p>
        </div>
        <button class="ghost-action" type="button" data-simulate-provider-import>Ukázať import</button>
      </div>
      <div class="toolbar compact provider-toolbar">
        <label>
          <span>Stav v registri</span>
          <select data-provider-registry-filter>
            <option value="all" ${providerRegistryFilter === "all" ? "selected" : ""}>Všetko</option>
            <option value="Novy" ${providerRegistryFilter === "Novy" ? "selected" : ""}>Nové</option>
            <option value="Importovane" ${providerRegistryFilter === "Importovane" ? "selected" : ""}>Importované</option>
          </select>
        </label>
        <p class="form-note">${filtered.length} záznamov vo výbere</p>
      </div>
      <div class="toolbar compact provider-toolbar">
        <label>
          <span>Kraj</span>
          <select data-provider-region-filter>
            <option value="all" ${providerRegionFilter === "all" ? "selected" : ""}>Vsetky kraje</option>
            ${regions.map((region) => `<option value="${escapeHtml(region)}" ${providerRegionFilter === region ? "selected" : ""}>${region}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Okres</span>
          <select data-provider-district-filter>
            <option value="all" ${providerDistrictFilter === "all" ? "selected" : ""}>Vsetky okresy</option>
            ${districts.map((district) => `<option value="${escapeHtml(district)}" ${providerDistrictFilter === district ? "selected" : ""}>${district}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="provider-grid">
        ${filtered.map(providerRegistryCard).join("") || emptyState("V tomto filtri nie sú žiadne ambulancie.")}
      </div>
    </section>
  `;
}

function providerRegistryCard(provider) {
  const imported = provider.registryState === "Importovane" || provider.linkedClientId;
  const stateName = imported ? "Importované" : "Nové";
  const displayName = providerDisplayName(provider);
  const branchName = provider.name && provider.name !== displayName ? provider.name : "";
  const ico = providerIco(provider);
  return `
    <article class="record-card provider-card">
      <div class="provider-card-head">
        <span class="status-pill ${statusClass(imported ? "Importovane" : "Novy")}">${stateName}</span>
        <small>${provider.source || "verejný register"}</small>
      </div>
      <h3>${displayName}</h3>
      ${branchName ? `<p><strong>Prevádzka:</strong> ${branchName}</p>` : ""}
      <dl class="compact-details">
        <div><dt>Adresa</dt><dd>${provider.addressStreet}, ${provider.addressZip} ${provider.city}</dd></div>
        <div><dt>Okres</dt><dd>${provider.district || ""}</dd></div>
        <div><dt>IČO</dt><dd>${ico || "-"}</dd></div>
        <div><dt>IdZZ</dt><dd>${provider.idzz || "-"}</dd></div>
        <div><dt>Kontakt</dt><dd>${provider.email || "-"}${provider.phone ? `, ${provider.phone}` : ""}</dd></div>
        <div><dt>Poisťovne</dt><dd>${provider.insurance || "-"}</dd></div>
      </dl>
      <div class="row-actions provider-actions">
        ${imported ? "" : `<button class="primary-action" type="button" data-provider-add-client="${provider.id}">Pridať medzi klientov</button>`}
      </div>
    </article>
  `;
}

function firstClientLetter(client) {
  return String(client.name || "").trim().charAt(0).toLocaleUpperCase("sk-SK") || "#";
}

function clientAlphabetNav(clients) {
  const letters = [...new Set(clients.map(firstClientLetter))].sort((a, b) => a.localeCompare(b, "sk-SK"));
  if (letters.length < 2) return "";
  return `
    <nav class="alphabet-nav" aria-label="Rýchly filter ambulancií podľa písmena">
      <button type="button" class="${clientLetterFilter === "all" ? "is-active" : ""}" data-client-letter="all">Všetky</button>
      ${letters.map((letter) => `<button type="button" class="${clientLetterFilter === letter ? "is-active" : ""}" data-client-letter="${letter}">${letter}</button>`).join("")}
    </nav>
  `;
}

function clientsTable(clients) {
  return `
    <div class="table-shell">
      <table>
        <thead><tr><th>Ambulancia</th><th>Adresa</th><th>Kontakt</th><th>Zariadenia</th><th>Stav</th><th>Akcia</th></tr></thead>
        <tbody>
          ${clients.map((client) => `
            <tr>
              <td data-label="Ambulancia"><button class="link-button" type="button" data-client-profile="${client.id}">${client.name}</button><br><small>${client.segment}</small></td>
              <td data-label="Adresa">${clientAddress(client)}</td>
              <td data-label="Kontakt">${client.contact}<br><small>${client.email}</small></td>
              <td data-label="Zariadenia">${getClientDevices(client.id).length}</td>
              <td data-label="Stav"><span class="status-pill ${statusClass(client.status)}">${client.status}</span></td>
              <td class="row-actions" data-label="Akcia">
                <button class="secondary-action" type="button" data-client-profile="${client.id}">Profil</button>
                <button class="ghost-action" type="button" data-edit-client="${client.id}">Upraviť</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDevices() {
  setTitle("Zariadenia", "Majetok klientov");
  const devices = state.devices.filter((device) => matchesSearch(deviceName(device.id), device.serial, clientName(device.clientId), device.type, device.location, device.status, (device.documents || []).join(" ")));
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Profily zariadení</h3>
        <button class="primary-action" type="button" data-open-device-form>Pridať zariadenie</button>
      </div>
      ${devices.length ? devicesTable(devices) : emptyState("Nenašli sa žiadne zariadenia.")}
    </section>
  `;
}

function devicesTable(devices) {
  return `
    <div class="table-shell">
      <table>
        <thead><tr><th>Zariadenie</th><th>Ambulancia</th><th>Sériové číslo</th><th>Inštalácia</th><th>Záruka</th><th>Fakturácia</th><th>Stav</th><th></th></tr></thead>
        <tbody>
          ${devices.map((device) => `
            <tr>
              <td data-label="Zariadenie"><button class="link-button" type="button" data-device-profile="${device.id}">${deviceName(device.id)}</button><br><small>${device.type} - ${device.location}</small></td>
              <td data-label="Ambulancia">${clientName(device.clientId)}</td>
              <td data-label="Sériové číslo">${device.serial}</td>
              <td data-label="Inštalácia">${formatDate(device.installed)}</td>
              <td data-label="Záruka">${formatOptionalDate(device.warrantyUntil)}</td>
              <td data-label="Fakturácia">
                <span class="status-pill ${isDeviceInvoiced(device) ? "status-ok" : "status-planned"}">${isDeviceInvoiced(device) ? "Fakturované" : "Bez FA"}</span>
                ${isAdmin() && device.invoiceFile ? `<br><small>${invoiceLink(device)}</small>` : ""}
              </td>
              <td data-label="Stav"><span class="status-pill ${statusClass(device.status)}">${device.status}</span></td>
              <td class="row-actions" data-label="Akcia">
                <button class="secondary-action" type="button" data-device-profile="${device.id}">Profil</button>
                <button class="ghost-action" type="button" data-edit-device="${device.id}">Upraviť</button>
                ${device.clientId && !deviceHasSignedHandover(device) ? `<button class="ghost-action" type="button" data-start-handover-device="${device.id}">Podpis</button>` : ""}
                <button class="danger-action" type="button" data-delete-device="${device.id}">Vymazať</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderInventory() {
  setTitle("Sklad", "Materiál a diely");
  const items = state.inventory.filter((item) => {
    const manufacturerMatch = inventoryManufacturerFilter === "all" || item.manufacturer === inventoryManufacturerFilter;
    const categoryMatch = inventoryCategoryFilter === "all" || item.itemType === inventoryCategoryFilter || item.category === inventoryCategoryFilter;
    return manufacturerMatch && categoryMatch && matchesSearch(item.name, item.sku, item.category, item.itemType, item.manufacturer, item.compatibility, item.location, item.note);
  });
  const lowStock = items.filter((item) => item.qty <= item.min).length;
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Skladové položky</h3>
        ${isAdmin() ? `
          <div class="row-actions">
            <button class="ghost-action" type="button" data-open-bulk-inventory-form>Pridať viac položiek</button>
            <button class="primary-action" type="button" data-open-inventory-form>Pridať položku</button>
          </div>
        ` : ""}
      </div>
      <div class="toolbar inventory-toolbar">
        <label>
          <span>Výrobca</span>
          <select data-inventory-manufacturer-filter>
            <option value="all">Všetci výrobcovia</option>
            ${manufacturers.map((name) => `<option value="${name}" ${inventoryManufacturerFilter === name ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Kategória</span>
          <select data-inventory-category-filter>
            <option value="all">Všetky kategórie</option>
            ${inventoryCategories.map((name) => `<option value="${name}" ${inventoryCategoryFilter === name ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
        <p class="form-note">${items.length} položiek vo výbere, ${lowStock} treba doplniť.</p>
      </div>
      ${items.length ? inventoryTable(items) : emptyState("Nenašli sa žiadne skladové položky.")}
    </section>
  `;
}

function inventoryTable(items) {
  return `
    <div class="table-shell">
      <table>
        <thead><tr><th>Položka</th><th>Výrobca</th><th>Typ</th><th>SKU</th><th>Sklad</th><th>Rezervované</th><th>Umiestnenie</th><th>Stav</th>${isAdmin() ? "<th>Akcia</th>" : ""}</tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td data-label="Položka">${item.name}<br><small>${item.compatibility || item.note || ""}</small></td>
              <td data-label="Výrobca">${item.manufacturer}</td>
              <td data-label="Typ">${item.itemType || item.category}</td>
              <td data-label="SKU">${item.sku}</td>
              <td data-label="Sklad">${item.qty} ks</td>
              <td data-label="Rezervované">${item.reserved} ks</td>
              <td data-label="Umiestnenie">${item.location || "Doplniť"}</td>
              <td data-label="Stav"><span class="status-pill ${item.qty <= item.min ? "status-low" : "status-ok"}">${item.qty <= item.min ? "Doplniť" : "OK"}</span></td>
              ${isAdmin() ? `<td data-label="Akcia"><div class="row-actions"><button class="ghost-action" type="button" data-edit-inventory="${item.id}">Upraviť</button><button class="danger-action" type="button" data-delete-inventory="${item.id}">Vymazať</button></div></td>` : ""}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderService() {
  setTitle("Servis", "Úlohy technikov");
  const baseItems = visibleServiceItems()
    .filter((item) => serviceTechnicianFilter === "all" || item.technicianId === serviceTechnicianFilter)
    .filter(matchesServiceStatusFilter);
  const items = baseItems.filter((item) => matchesSearch(item.title, clientName(item.clientId), deviceName(item.deviceId), userName(item.technicianId)));
  const billingMonth = new Date().toISOString().slice(0, 7);
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Servisné úlohy</h3>
        <button class="primary-action" type="button" data-open-service-form>Pridať úlohu</button>
      </div>
      <div class="toolbar compact">
        <label>
          <span>Stav úloh</span>
          <select data-service-status-filter>
            <option value="open" ${serviceStatusFilter === "open" ? "selected" : ""}>Otvorené</option>
            <option value="all" ${serviceStatusFilter === "all" ? "selected" : ""}>Všetko</option>
            ${serviceStates.map((stateName) => `<option value="${stateName}" ${serviceStatusFilter === stateName ? "selected" : ""}>${stateName}</option>`).join("")}
          </select>
        </label>
      </div>
      ${isAdmin() ? `<div class="toolbar compact">
        <label>
          <span>Technik</span>
          <select data-service-technician-filter>
            <option value="all">Všetci technici</option>
            ${technicianAssignableUsers().map((user) => `<option value="${user.id}" ${serviceTechnicianFilter === user.id ? "selected" : ""}>${user.name}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Mesiac fakturácie</span>
          <input type="month" data-service-billing-month value="${billingMonth}">
        </label>
        <label class="checkline">
          <input type="checkbox" data-service-billing-only-new checked>
          <span>Len neexportované</span>
        </label>
        <button class="secondary-action" type="button" data-export-service-billing>Export pre fakturáciu</button>
        <button class="ghost-action" type="button" data-mark-billed-service>Označiť ako fakturované</button>
        <p class="form-note">Export používa dátum vykonania opravy zo servisného protokolu. Neskôr doplnený protokol s korektným dátumom sa zaradí do správneho mesiaca.</p>
      </div>` : `<p class="form-note">Vidíte iba servisné úlohy priradené na vás. Administrátor a SuperAdministrátor vidia všetky úlohy.</p>`}
      ${items.length ? serviceTable(items) : emptyState(isAdmin() ? "Nenašli sa žiadne servisné úlohy." : "Nemáte priradené žiadne servisné úlohy.")}
    </section>
  `;
}

function renderDocuments() {
  setTitle("Dokumenty", "Podpisy a šablóny");
  const packets = state.documentPackets.filter((packet) => matchesSearch(packet.title, clientName(packet.clientId), deviceName(packet.deviceId), packet.kind, packet.state));
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Podpisové balíky</h3>
        <button class="primary-action" type="button" data-open-document-packet-form>Nový balík</button>
      </div>
      ${packets.length ? documentPacketsTable(packets) : emptyState("Zatiaľ nie je vytvorený žiadny podpisový balík.")}
    </section>
  `;
}

function clientPortalDocuments(clientId) {
  return state.documentPackets
    .filter((packet) => packet.clientId === clientId && canOpenSignedDocument(packet))
    .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
}

function portalDocumentTable(documents, emptyText) {
  return documents.length ? `
    <div class="table-shell">
      <table>
        <thead><tr><th>Dokument</th><th>Zariadenie</th><th>Dátum</th><th>Stav</th><th>Akcia</th></tr></thead>
        <tbody>
          ${documents.map((documentRecord) => `
            <tr>
              <td data-label="Dokument">${documentRecord.title}<br><small>${(documentRecord.documents || []).join(", ")}</small></td>
              <td data-label="Zariadenie">${documentRecord.deviceIds?.length ? documentRecord.deviceIds.map((id) => deviceName(id)).join(", ") : deviceName(documentRecord.deviceId)}</td>
              <td data-label="Dátum">${formatDate(documentRecord.date || documentRecord.due)}</td>
              <td data-label="Stav"><span class="status-pill ${statusClass(documentRecord.state)}">${documentRecord.state}</span></td>
              <td data-label="Akcia"><button class="ghost-action" type="button" data-open-signed-document="${documentRecord.id}">Otvoriť</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : emptyState(emptyText);
}

function clientPortalHtml(clientId, showAccessCode = false) {
  const client = byId("clients", clientId);
  if (!client) return emptyState("Ambulancia sa nenašla.");
  const devices = getClientDevices(clientId);
  const documents = clientPortalDocuments(clientId);
  const handoverDocuments = documents.filter((documentRecord) => documentRecord.documentType !== "service");
  const serviceDocuments = documents.filter((documentRecord) => documentRecord.documentType === "service");
  const serviceRequests = state.service
    .filter((service) => service.clientId === clientId)
    .sort((a, b) => (b.due || "").localeCompare(a.due || ""));
  return `
    <div class="portal-view">
      <section class="portal-hero">
        <div>
          <span class="status-pill ${client.portalEnabled ? "status-ok" : "status-warning"}">${client.portalEnabled ? "Portál aktívny" : "Portál vypnutý"}</span>
          <h3>${client.name}</h3>
          <p>${clientAddress(client)}</p>
        </div>
        ${showAccessCode ? `<div class="portal-access">
          <span>Testovací prístupový kód</span>
          <strong>${client.portalCode}</strong>
        </div>` : `<div class="portal-access">
          <span>Klientsky profil</span>
          <strong>${devices.length}</strong>
          <small>zariadení v evidencii</small>
        </div>`}
      </section>

      <section class="portal-section">
        <div class="portal-section-header">
          <h3>Nahlásiť servis</h3>
          <span class="form-note">Po odoslaní vznikne nová servisná požiadavka v CRM.</span>
        </div>
        <form class="form-grid portal-service-form" data-portal-service-request="${client.id}">
          <label><span>Zariadenie</span><select name="deviceId" required>
            ${devices.map((device) => `<option value="${device.id}">${deviceLabel(device)}</option>`).join("")}
          </select></label>
          ${input("contact", "Kontakt", "Meno a telefón", "text", [client.contact, client.phone].filter(Boolean).join(" / "), true)}
          ${input("preferredDate", "Preferovaný termín", "", "date", "", false)}
          <label class="full"><span>Popis problému</span><textarea name="description" required placeholder="Stručne popíšte problém, chybové hlásenie alebo čo treba skontrolovať."></textarea></label>
          <button class="primary-action full" type="submit" ${devices.length ? "" : "disabled"}>Odoslať servisnú požiadavku</button>
        </form>
      </section>

      <section class="portal-section">
        <h3>Zariadenia</h3>
        <div class="portal-device-grid">
          ${devices.map((device) => `
            <article class="record-card">
              ${imagePreview(device.photo, deviceName(device.id))}
              <span class="status-pill ${statusClass(device.status)}">${device.status}</span>
              <h3>${deviceName(device.id)}</h3>
              <dl class="definition-list compact-list">
                <div><dt>Sériové číslo</dt><dd>${device.serial || "Doplniť"}</dd></div>
                <div><dt>Typ</dt><dd>${device.type || "Doplniť"}</dd></div>
                <div><dt>Inštalácia</dt><dd>${formatDate(device.installed)}</dd></div>
                <div><dt>Záruka do</dt><dd>${formatOptionalDate(device.warrantyUntil)}</dd></div>
                <div><dt>Umiestnenie</dt><dd>${device.location || "Doplniť"}</dd></div>
                <div><dt>Fakturácia</dt><dd>
                  <span class="status-pill ${isDeviceInvoiced(device) ? "status-ok" : "status-planned"}">${isDeviceInvoiced(device) ? "Fakturované" : "Zatiaľ bez FA"}</span>
                  ${device.invoiceFile ? `<br>${invoiceLink(device, "Otvoriť faktúru")}` : ""}
                  ${device.invoiceDate ? `<br><small>${formatDate(device.invoiceDate)}</small>` : ""}
                </dd></div>
              </dl>
            </article>
          `).join("") || emptyState("Ambulancia zatiaľ nemá priradené zariadenia.")}
        </div>
      </section>

      <section class="portal-section">
        <h3>Odovzdávacie a školiace protokoly</h3>
        ${portalDocumentTable(handoverDocuments, "Pre túto ambulanciu zatiaľ nie sú uložené odovzdávacie alebo školiace protokoly.")}
      </section>

      <section class="portal-section">
        <h3>Servisné protokoly</h3>
        ${portalDocumentTable(serviceDocuments, "Pre túto ambulanciu zatiaľ nie sú uložené servisné protokoly.")}
      </section>

      <section class="portal-section">
        <h3>Servisné požiadavky</h3>
        ${serviceRequests.length ? `
          <div class="table-shell">
            <table>
              <thead><tr><th>Požiadavka</th><th>Zariadenie</th><th>Termín</th><th>Technik</th><th>Stav</th></tr></thead>
              <tbody>
                ${serviceRequests.map((service) => `
                  <tr>
                    <td data-label="Požiadavka">${service.title}<br><small>${service.portalDescription || ""}</small></td>
                    <td data-label="Zariadenie">${deviceName(service.deviceId)}</td>
                    <td data-label="Termín">${formatDate(service.due)}</td>
                    <td data-label="Technik">${userName(service.technicianId)}</td>
                    <td data-label="Stav"><span class="status-pill ${statusClass(service.state)}">${service.state}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : emptyState("Zatiaľ nie sú evidované servisné požiadavky.")}
      </section>
    </div>
  `;
}

function openClientPortalPage(clientId) {
  portalSessionClientId = clientId;
  session = null;
  qsa(".modal-backdrop").forEach((modal) => modal.remove());
  qs("#loginScreen").classList.add("is-hidden");
  qs("#appShell").classList.add("is-hidden");
  qs("#clientPortalShell").classList.remove("is-hidden");
  const content = qs("#clientPortalContent");
  content.innerHTML = clientPortalHtml(clientId, false);
  bindViewActions(content);
}

function openClientPortal(clientId) {
  const client = byId("clients", clientId);
  if (!client) return;
  openModal(`Klientsky portál: ${client.name}`, `
    ${clientPortalHtml(clientId, true)}
    <div class="button-row">
      <button class="primary-action" type="button" data-open-client-portal-page="${client.id}">Vyskúšať portál ako klient</button>
    </div>
  `, (modal) => bindViewActions(modal));
}

function documentPacketsTable(packets) {
  return `
    <div class="table-shell">
      <table>
        <thead><tr><th>Balík</th><th>Číslo</th><th>Ambulancia</th><th>Zariadenie</th><th>Dokumenty</th><th>Termín</th><th>Stav</th><th>Akcia</th></tr></thead>
        <tbody>
          ${packets.map((packet) => `
            <tr>
              <td data-label="Balík">${packet.title}<br><small>${packet.kind}</small></td>
              <td data-label="Číslo">${protocolNumber(packet) || "Pripravuje sa"}</td>
              <td data-label="Ambulancia">${clientName(packet.clientId)}</td>
              <td data-label="Zariadenie">${packet.deviceIds?.length ? packet.deviceIds.map((id) => deviceName(id)).join(", ") : (packet.deviceId ? deviceName(packet.deviceId) : "Bez zariadenia")}</td>
              <td data-label="Dokumenty">${packet.templateIds.map((id) => byId("documentTemplates", id)?.name).filter(Boolean).join(", ")}</td>
              <td data-label="Termín">${formatDate(packet.due)}</td>
              <td data-label="Stav"><span class="status-pill ${statusClass(packet.state)}">${packet.state}</span></td>
              <td data-label="Akcia">
                <div class="row-actions">
                  ${canOpenSignedDocument(packet) ? `<button class="ghost-action" type="button" data-open-signed-document="${packet.id}">Otvoriť</button>` : ""}
                  ${canSignHandoverPacket(packet) ? `<button class="secondary-action" type="button" data-sign-document-packet="${packet.id}">Podpísať</button>` : ""}
                  ${isAdmin() ? `<button class="danger-action" type="button" data-delete-signed-document="${packet.id}">Vymazať</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function serviceActionButtons(item) {
  return `
    <details class="action-menu">
      <summary>Akcie</summary>
      <div class="action-menu-list">
        <button class="ghost-action" type="button" data-edit-service="${item.id}">Upraviť úlohu</button>
        <button class="ghost-action" type="button" data-open-service-protocol="${item.id}">Servisný protokol</button>
        ${(item.documentRecords || []).slice(-1).map((record) => `<button class="secondary-action" type="button" data-open-signed-document="${record.id}">Otvoriť protokol</button>`).join("")}
      </div>
    </details>
  `;
}

function serviceTable(items) {
  return `
    <div class="table-shell service-table-shell">
      <table>
        <thead><tr><th>Úloha</th><th>Termín</th><th>Priorita</th><th>Stav</th><th>Fakturácia</th><th>Akcia</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td data-label="Úloha">
                <div class="service-task-summary">
                  <strong>${item.title}</strong>
                  <span>${clientName(item.clientId)} · ${deviceName(item.deviceId)}</span>
                  <span>${userName(item.technicianId)}</span>
                </div>
              </td>
              <td data-label="Termín">${formatDate(item.due)}</td>
              <td data-label="Priorita"><span class="status-pill ${statusClass(item.priority)}">${item.priority}</span></td>
              <td data-label="Stav"><span class="status-pill ${statusClass(item.state)}">${item.state}</span></td>
              <td data-label="Fakturácia">${serviceBillingPill(item)}</td>
              <td data-label="Akcia">
                <div class="row-actions">
                  ${serviceActionButtons(item)}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <div class="mobile-card-list service-card-list">
      ${items.map((item) => `
        <article class="record-card service-task-card">
          <div class="service-card-head">
            <div>
              <h3>${item.title}</h3>
              <p>${clientName(item.clientId)}</p>
            </div>
            <span class="status-pill ${statusClass(item.state)}">${item.state}</span>
          </div>
          <dl class="compact-details">
            <div><dt>Zariadenie</dt><dd>${deviceName(item.deviceId)}</dd></div>
            <div><dt>Technik</dt><dd>${userName(item.technicianId)}</dd></div>
            <div><dt>Termín</dt><dd>${formatDate(item.due)}</dd></div>
            <div><dt>Priorita</dt><dd><span class="status-pill ${statusClass(item.priority)}">${item.priority}</span></dd></div>
            <div><dt>Fakturácia</dt><dd>${serviceBillingPill(item)}</dd></div>
          </dl>
          <div class="row-actions">
            ${serviceActionButtons(item)}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function serviceBillingPill(service) {
  const record = (service.documentRecords || []).filter((item) => item.documentType === "service").at(-1);
  if (!record) return `<span class="status-pill status-planned">Bez protokolu</span>`;
  const stateName = record.billingState || "Na fakturáciu";
  return `<span class="status-pill ${statusClass(stateName)}">${stateName}</span>`;
}

function deviceHasSignedHandover(device) {
  return (device.documentRecords || []).some((record) => record.documentType !== "service" && canOpenSignedDocument(record));
}

function serviceBillingRecords(month, technicianId = "all", onlyNew = false) {
  return state.documentPackets
    .filter((record) => {
      const monthMatch = record.documentType === "service" && (record.date || "").startsWith(month);
      const technicianMatch = technicianId === "all" || record.technicianId === technicianId;
      const billingMatch = !onlyNew || (record.billingState || "Na fakturáciu") === "Na fakturáciu";
      return monthMatch && technicianMatch && billingMatch;
    })
    .sort((a, b) => (a.date || "").localeCompare(b.date || "") || clientName(a.clientId).localeCompare(clientName(b.clientId)));
}

function exportServiceBillingCsv(scope) {
  if (!isAdmin()) {
    alert("Export pre fakturáciu je dostupný iba administrátorovi alebo SuperAdministrátorovi.");
    return;
  }
  const month = qs("[data-service-billing-month]", scope)?.value || new Date().toISOString().slice(0, 7);
  const technicianId = qs("[data-service-technician-filter]", scope)?.value || "all";
  const onlyNew = qs("[data-service-billing-only-new]", scope)?.checked ?? true;
  const records = serviceBillingRecords(month, technicianId, onlyNew);
  if (!records.length) {
    alert("Pre vybraný mesiac nie sú uložené žiadne podpísané servisné protokoly.");
    return;
  }

  const missingPriceCount = records.filter((record) => !((record.serviceValues || {}).totalPrice)).length;
  const total = records.reduce((sum, record) => sum + parseMoney((record.serviceValues || {}).totalPrice), 0);
  openModal("Náhľad exportu pre fakturáciu", `
    <div class="stacked">
      <div class="summary-grid">
        <div><strong>${records.length}</strong><span>protokolov</span></div>
        <div><strong>${total.toFixed(2)} €</strong><span>súčet vyplnených cien</span></div>
        <div><strong>${missingPriceCount}</strong><span>bez celkovej ceny</span></div>
      </div>
      ${missingPriceCount ? `<p class="form-note warning-note">Niektoré protokoly nemajú vyplnenú celkovú cenu. Export ich ponechá v tabuľke, aby ich fakturácia vedela skontrolovať.</p>` : ""}
      <div class="table-shell preview-table">
        <table>
          <thead><tr><th>Dátum</th><th>Ambulancia</th><th>Zariadenie</th><th>Technik</th><th>Cena</th><th>Stav</th></tr></thead>
          <tbody>
            ${records.map((record) => {
              const values = record.serviceValues || {};
              return `<tr>
                <td data-label="Dátum">${formatDate(record.date)}</td>
                <td data-label="Ambulancia">${clientName(record.clientId)}</td>
                <td data-label="Zariadenie">${deviceName(record.deviceId)}</td>
                <td data-label="Technik">${userName(record.technicianId)}</td>
                <td data-label="Cena">${values.totalPrice || "Doplniť"}</td>
                <td data-label="Stav"><span class="status-pill ${statusClass(record.billingState || "Na fakturáciu")}">${record.billingState || "Na fakturáciu"}</span></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="button-row">
        <button class="primary-action" type="button" data-confirm-service-billing-export data-month="${month}" data-technician-id="${technicianId}" data-only-new="${onlyNew ? "1" : "0"}">Stiahnuť CSV a označiť exportované</button>
      </div>
    </div>
  `, (modal) => {
    qs("[data-confirm-service-billing-export]", modal)?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      await performServiceBillingExport(button.dataset.month, button.dataset.technicianId, button.dataset.onlyNew === "1");
      closeCurrentModal(button);
    });
  });
}

function serviceBillingCsvRows(records) {
  const headers = [
    "Dátum opravy",
    "Ambulancia",
    "Adresa",
    "Lekár / kontakt",
    "E-mail",
    "Telefón",
    "Zariadenie",
    "Sériové číslo",
    "Servisná úloha",
    "Technik",
    "Záručná oprava",
    "Príchod / odchod",
    "Celkový čas",
    "Cena práce 08-16 bez DPH",
    "Cena práce 08-16 s DPH",
    "Cena mimo pracovného času bez DPH",
    "Cena mimo pracovného času s DPH",
    "Cestovné / paušál",
    "Celková cena s DPH",
    "Stav fakturácie",
    "Náhradné diely",
    "Popis práce",
    "Zistený stav",
    "ID protokolu"
  ];

  const rows = records.map((record) => {
    const client = byId("clients", record.clientId);
    const device = byId("devices", record.deviceId);
    const service = byId("service", record.serviceId);
    const values = record.serviceValues || {};
    return [
      record.date || "",
      client?.name || "",
      client ? clientAddress(client) : "",
      values.doctorName || client?.contact || "",
      values.doctorEmail || client?.email || "",
      values.doctorPhone || client?.phone || "",
      device ? `${device.type || ""} ${device.brand || ""} ${device.model || ""}`.trim() : "",
      device?.serial || "",
      service?.title || "",
      userName(record.technicianId),
      values.warrantyRepair || "",
      values.arrivalDeparture || "",
      values.totalTime || "",
      values.workRate || "",
      values.workRateVat || "",
      values.afterHoursRate || "",
      values.afterHoursRateVat || "",
      values.travelFee || "",
      values.totalPrice || "",
      record.billingState || "Na fakturáciu",
      values.parts || "",
      values.workDescription || "",
      values.inspection || "",
      protocolNumber(record) || record.id,
    ];
  });
  return [headers, ...rows];
}

async function performServiceBillingExport(month, technicianId = "all", onlyNew = false) {
  if (!isAdmin()) return;
  const records = serviceBillingRecords(month, technicianId, onlyNew);
  if (!records.length) {
    alert("Tieto protokoly už boli medzičasom zmenené alebo exportované.");
    return;
  }
  const technicianSlug = technicianId === "all" ? "vsetci" : slugify(userName(technicianId));
  downloadCsv(`dentapp-fakturacia-servis-${month}-${technicianSlug}.csv`, serviceBillingCsvRows(records));
  records.forEach((record) => {
    record.billingState = "Exportované";
    record.exportedAt = new Date().toISOString();
    syncDocumentRecord(record);
  });
  if (dataMode === "supabase") {
    try {
      await Promise.all(records.map((record) => saveDocumentPacketToSupabase(record)));
      await loadSupabaseDataIntoState();
      addAudit("Export fakturácie online", `${month}, technik: ${technicianId === "all" ? "všetci" : userName(technicianId)}, záznamy: ${records.length}`);
      render();
    } catch (error) {
      alert(`Online označenie exportu zlyhalo: ${error.message}`);
    }
    return;
  }
  addAudit("Export fakturácie", `${month}, technik: ${technicianId === "all" ? "všetci" : userName(technicianId)}, záznamy: ${records.length}`);
  saveState();
  render();
}

async function markServiceBillingAsBilled(scope) {
  if (!isAdmin()) return;
  const month = qs("[data-service-billing-month]", scope)?.value || new Date().toISOString().slice(0, 7);
  const technicianId = qs("[data-service-technician-filter]", scope)?.value || "all";
  const records = serviceBillingRecords(month, technicianId, false)
    .filter((record) => (record.billingState || "Na fakturáciu") === "Exportované");
  if (!records.length) {
    alert("Pre vybraný mesiac/technika nie sú žiadne exportované protokoly na označenie ako fakturované.");
    return;
  }
  if (!confirm(`Označiť ${records.length} servisných protokolov ako fakturované?`)) return;
  records.forEach((record) => {
    record.billingState = "Fakturované";
    record.billedAt = new Date().toISOString();
    syncDocumentRecord(record);
    const service = byId("service", record.serviceId);
    if (service) service.state = "Fakturované";
  });
  if (dataMode === "supabase") {
    try {
      await Promise.all(records.map(async (record) => {
        await saveDocumentPacketToSupabase(record);
        const service = byId("service", record.serviceId);
        if (service) await saveServiceTaskToSupabase(service);
      }));
      await loadSupabaseDataIntoState();
      addAudit("Označené ako fakturované online", `${month}, technik: ${technicianId === "all" ? "všetci" : userName(technicianId)}, záznamy: ${records.length}`);
      render();
    } catch (error) {
      alert(`Online označenie fakturácie zlyhalo: ${error.message}`);
    }
    return;
  }
  addAudit("Označené ako fakturované", `${month}, technik: ${technicianId === "all" ? "všetci" : userName(technicianId)}, záznamy: ${records.length}`);
  saveState();
  render();
}

function exportLocalDatabase() {
  if (!isAdmin()) return;
  const snapshot = {
    exportedAt: new Date().toISOString(),
    exportedBy: session?.name || "",
    app: "DentApp",
    schemaVersion: 1,
    data: state,
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dentapp-db-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  addAudit("Export lokálnej DB", "JSON záloha pre migráciu alebo kontrolu");
  saveState();
}

function supabaseConfig() {
  return window.DENTAPP_SUPABASE || {};
}

function supabaseRestUrl(path) {
  const config = supabaseConfig();
  return `${String(config.url || "").replace(/\/$/, "")}/rest/v1/${path}`;
}

function supabaseQueryValue(value = "") {
  return encodeURIComponent(String(value).replaceAll('"', '""'));
}

async function supabaseRequest(path, options = {}) {
  const config = supabaseConfig();
  if (!config.url || !config.anonKey) throw new Error("Chýba Supabase URL alebo anon public key.");
  const token = options.token || supabaseAuth?.access_token || config.anonKey;
  const response = await fetch(supabaseRestUrl(path), {
    ...options,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload?.message || payload?.hint || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }
  return payload;
}

async function supabaseRequestAll(path, pageSize = 1000) {
  const rows = [];
  for (let from = 0; from < 10000; from += pageSize) {
    const page = await supabaseRequest(path, {
      headers: {
        Range: `${from}-${from + pageSize - 1}`,
      },
    });
    if (!Array.isArray(page) || !page.length) break;
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

async function supabaseCount(path, token = supabaseAuth?.access_token) {
  const config = supabaseConfig();
  if (!config.url || !config.anonKey) throw new Error("Chýba Supabase URL alebo anon public key.");
  const response = await fetch(supabaseRestUrl(path), {
    method: "GET",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token || config.anonKey}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message || payload?.hint || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }
  const range = response.headers.get("content-range") || "";
  return Number(range.split("/").at(-1)) || 0;
}

async function supabaseAuthRequest(path, body) {
  const config = supabaseConfig();
  if (!config.url || !config.anonKey) throw new Error("Chýba Supabase URL alebo anon public key.");
  const response = await fetch(`${String(config.url).replace(/\/$/, "")}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.msg || payload?.message || payload?.error_description || response.statusText);
  return payload;
}

async function supabaseAuthGetUser(token) {
  const config = supabaseConfig();
  if (!config.url || !config.anonKey) throw new Error("Chýba Supabase URL alebo anon public key.");
  const response = await fetch(`${String(config.url).replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.msg || payload?.message || payload?.error_description || response.statusText);
  return payload;
}

async function supabaseAuthUpdateUser(token, body) {
  const config = supabaseConfig();
  if (!config.url || !config.anonKey) throw new Error("Chýba Supabase URL alebo anon public key.");
  const response = await fetch(`${String(config.url).replace(/\/$/, "")}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.msg || payload?.message || payload?.error_description || response.statusText);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function saveSupabaseAuth(auth) {
  if (!auth?.access_token) return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function savedSupabaseAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function clearSupabaseAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function refreshSupabaseAuth(auth) {
  if (!auth?.refresh_token) throw new Error("Chýba refresh token.");
  const refreshed = await supabaseAuthRequest("token?grant_type=refresh_token", {
    refresh_token: auth.refresh_token,
  });
  supabaseAuth = refreshed;
  saveSupabaseAuth(refreshed);
  return refreshed;
}

function profileToSession(profile, authUser) {
  return {
    id: profile.id,
    name: profile.display_name,
    role: profile.role,
    email: authUser?.email || profile.email || "",
    phone: normalizePhoneNumber(profile.phone || ""),
    active: profile.active,
    protected: profile.protected,
    clientId: profile.client_id || "",
    online: true,
  };
}

function profileToUser(profile) {
  return {
    id: profile.id,
    onlineId: profile.id,
    name: profile.display_name || "Bez mena",
    role: profile.role || "Technik",
    email: profile.email || "",
    phone: normalizePhoneNumber(profile.phone || ""),
    active: profile.active !== false,
    protected: profile.protected || false,
    clientId: profile.client_id || "",
    online: true,
  };
}

function userProfilePayloadForSupabase(user) {
  return {
    id: user.onlineId || user.id,
    display_name: user.name || "",
    email: user.email || "",
    role: user.role || "Technik",
    phone: normalizePhoneNumber(user.phone || ""),
    active: user.active !== false,
    protected: user.protected || user.role === "SuperAdministrátor",
    client_id: user.clientId || null,
  };
}

async function upsertUserProfileToSupabase(user) {
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const payload = userProfilePayloadForSupabase(user);
  try {
    const rows = await upsertSupabaseRows("users_profile", [payload], "id");
    return rows[0] || null;
  } catch (error) {
    if (!String(error.message || "").toLowerCase().includes("email")) throw error;
    const { email, ...payloadWithoutEmail } = payload;
    const rows = await upsertSupabaseRows("users_profile", [payloadWithoutEmail], "id");
    return rows[0] || null;
  }
}

async function createSupabaseAuthUser(user, password) {
  if (!user.email) throw new Error("Nový online používateľ musí mať e-mail.");
  try {
    const existingProfiles = await supabaseRequest(`users_profile?select=id,display_name,email&email=eq.${encodeURIComponent(user.email)}&limit=1`);
    if (existingProfiles?.length) {
      throw new Error(`E-mail ${user.email} už má profil používateľa ${existingProfiles[0].display_name || ""}. Použite iný e-mail alebo upravte existujúceho používateľa.`);
    }
  } catch (error) {
    const message = String(error.message || "").toLowerCase();
    if (!(message.includes("email") && (message.includes("does not exist") || message.includes("42703")))) throw error;
  }
  const auth = await supabaseAuthRequest("signup", {
    email: user.email,
    password,
    data: { display_name: user.name, role: user.role },
  });
  const authUser = auth.user || (auth.id ? auth : null);
  if (!authUser?.id) {
    const detail = auth?.msg || auth?.message || auth?.error_description || auth?.error || JSON.stringify(auth || {});
    throw new Error(`Supabase Auth nevrátil nové ID používateľa. Skontrolujte, či je e-mail unikátny a či sú v Supabase Auth povolené nové registrácie. Detail: ${detail}`);
  }
  return authUser;
}

async function loginWithSupabase(email, password) {
  const auth = await supabaseAuthRequest("token?grant_type=password", { email, password });
  supabaseAuth = auth;
  saveSupabaseAuth(auth);
  const authUserId = auth.user?.id || "";
  const profiles = await supabaseRequest(`users_profile?select=*&id=eq.${encodeURIComponent(authUserId)}&limit=1`, { token: auth.access_token });
  if (!profiles?.length) {
    throw new Error(`Prihlásenie prešlo pre ${auth.user?.email || email}, auth id ${authUserId}, ale REST/RLS nevrátil profil z users_profile.`);
  }
  return profileToSession(profiles[0], auth.user);
}

async function changeSupabasePassword(currentPassword, newPassword) {
  if (!session?.email) throw new Error("Chýba e-mail prihláseného používateľa.");
  let auth = supabaseAuth || savedSupabaseAuth();
  if (!auth?.access_token) throw new Error("Nie je aktívne online prihlásenie. Odhláste sa a prihláste sa znova.");
  try {
    await supabaseAuthUpdateUser(auth.access_token, {
      password: newPassword,
      current_password: currentPassword,
    });
  } catch (error) {
    if (error.status !== 401 || !auth.refresh_token) throw error;
    auth = await refreshSupabaseAuth(auth);
    await supabaseAuthUpdateUser(auth.access_token, {
      password: newPassword,
      current_password: currentPassword,
    });
  }
  const refreshedLogin = await supabaseAuthRequest("token?grant_type=password", {
    email: session.email,
    password: newPassword,
  });
  supabaseAuth = refreshedLogin;
  saveSupabaseAuth(refreshedLogin);
}

async function restoreSupabaseSession() {
  const auth = savedSupabaseAuth();
  if (!auth?.access_token) return null;
  try {
    supabaseAuth = auth;
    let activeAuth = auth;
    let authUser = null;
    try {
      authUser = await supabaseAuthGetUser(activeAuth.access_token);
    } catch {
      activeAuth = await refreshSupabaseAuth(auth);
      authUser = await supabaseAuthGetUser(activeAuth.access_token);
    }
    const authUserId = authUser?.id || auth.user?.id || "";
    const profiles = await supabaseRequest(`users_profile?select=*&id=eq.${encodeURIComponent(authUserId)}&limit=1`, { token: activeAuth.access_token });
    if (!profiles?.length) throw new Error("Používateľ nemá profil v users_profile.");
    return profileToSession(profiles[0], authUser || auth.user);
  } catch (error) {
    supabaseAuth = null;
    clearSupabaseAuth();
    return null;
  }
}

async function testSupabaseConnection() {
  if (!isAdmin()) return;
  if (!supabaseAuth?.access_token) {
    supabaseStatus = {
      state: "Neprihlásené online",
      detail: "Nie je aktívny Supabase Auth token. Odhláste sa a prihláste sa e-mailom a heslom používateľa vytvoreného v Supabase Auth.",
    };
    render();
    return;
  }
  supabaseStatus = { state: "Testujem", detail: "Prebieha spojenie so Supabase..." };
  render();
  try {
    const rows = await supabaseRequest("clients?select=id&limit=1");
    supabaseStatus = {
      state: "Pripojené",
      detail: `REST API odpovedalo správne. Tabuľka clients je dostupná, vrátených riadkov: ${rows?.length ?? 0}.`,
    };
  } catch (error) {
    supabaseStatus = {
      state: "Vyžaduje nastavenie",
      detail: `${error.message}. Ak je to chyba 401/403/42501, treba doplniť RLS policy alebo použiť Supabase Auth.`,
    };
  }
  render();
}

async function supabaseSelectByLegacy(table, legacyIds) {
  if (!legacyIds.length) return [];
  const ids = legacyIds.map((id) => `"${String(id).replaceAll('"', '""')}"`).join(",");
  return supabaseRequest(`${table}?select=id,legacy_id&legacy_id=in.(${encodeURIComponent(ids)})`);
}

function mapClientForSupabase(client) {
  return {
    legacy_id: client.id,
    name: client.name || "",
    status: client.status || "Aktívna",
    segment: client.segment || "",
    contact: client.contact || "",
    email: client.email || "",
    phone: client.phone || "",
    address_street: client.addressStreet || "",
    address_city: client.city || "",
    address_zip: client.addressZip || "",
    address_floor: client.addressFloor || "",
    address_note: client.addressNote || "",
    billing_name: client.billingName || "",
    billing_street: client.billingStreet || "",
    billing_city: client.billingCity || "",
    billing_zip: client.billingZip || "",
    billing_company_id: client.billingCompanyId || "",
    billing_tax_id: client.billingTaxId || "",
    photo_path: client.photo || "",
    portal_enabled: client.portalEnabled ?? true,
    note: client.note || "",
  };
}

function clientPayloadForSupabase(client) {
  return mapClientForSupabase(client);
}

async function saveClientToSupabase(client) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const rows = await upsertSupabaseRows("clients", [clientPayloadForSupabase(client)]);
  return rows[0] || null;
}

function mapDeviceForSupabase(device, clientIdByLegacy) {
  return {
    legacy_id: device.id,
    client_id: device.clientId ? (clientIdByLegacy.get(device.clientId) || (isUuid(device.clientId) ? device.clientId : null)) : null,
    type: device.type || "",
    brand: device.brand || "",
    model: device.model || "",
    serial: device.serial || "",
    installed: device.installed || null,
    warranty_until: device.warrantyUntil || null,
    status: device.status || "OK",
    location: device.location || "",
    photo_path: device.photo || "",
    invoice_issued: Boolean(device.invoiceIssued || device.invoiceFile || device.invoiceNumber),
    invoice_number: device.invoiceNumber || "",
    invoice_date: device.invoiceDate || null,
    invoice_file_path: device.invoiceFile || "",
    invoice_file_name: device.invoiceFileName || "",
    documents: device.documents || [],
  };
}

function devicePayloadForSupabase(device) {
  const client = byId("clients", device.clientId);
  return mapDeviceForSupabase(device, new Map([[device.clientId, client?.onlineId || (isUuid(client?.id) ? client.id : null)]]));
}

function deviceHasInvoicePayload(device) {
  return Boolean(device.invoiceIssued || device.invoiceNumber || device.invoiceDate || device.invoiceFile);
}

function withoutInvoiceColumns(payload) {
  const clone = { ...payload };
  delete clone.invoice_issued;
  delete clone.invoice_number;
  delete clone.invoice_date;
  delete clone.invoice_file_path;
  delete clone.invoice_file_name;
  return clone;
}

async function saveDeviceToSupabase(device) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  let payload = devicePayloadForSupabase(device);
  if (device.clientId && !payload.client_id) {
    await loadSupabaseDataIntoState();
    payload = devicePayloadForSupabase(device);
  }
  if (device.clientId && !payload.client_id) throw new Error("Zariadenie nemá online ambulanciu.");
  try {
    const rows = await upsertSupabaseRows("devices", [payload]);
    return rows[0] || null;
  } catch (error) {
    if (!deviceHasInvoicePayload(device) && /invoice_|column|schema cache/i.test(error.message || "")) {
      const rows = await upsertSupabaseRows("devices", [withoutInvoiceColumns(payload)]);
      return rows[0] || null;
    }
    if (deviceHasInvoicePayload(device) && /invoice_|column|schema cache/i.test(error.message || "")) {
      throw new Error("V Supabase chýbajú stĺpce pre faktúry. Spustite SQL migráciu supabase/device_invoices.sql a skúste uložiť FA znova.");
    }
    throw error;
  }
}

function mapInventoryForSupabase(item) {
  return {
    legacy_id: item.id,
    name: item.name || "",
    manufacturer: item.manufacturer || "",
    item_type: item.itemType || item.category || "",
    sku: item.sku || "",
    category: item.category || "",
    qty: Number(item.qty) || 0,
    min_qty: Number(item.min) || 0,
    reserved: Number(item.reserved) || 0,
    location: item.location || "",
    compatibility: item.compatibility || "",
    note: item.note || "",
  };
}

function inventoryPayloadForSupabase(item) {
  return mapInventoryForSupabase(item);
}

async function saveInventoryToSupabase(item) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const rows = await upsertSupabaseRows("inventory", [inventoryPayloadForSupabase(item)]);
  return rows[0] || null;
}

async function deleteInventoryFromSupabase(item) {
  if (dataMode !== "supabase") return;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const legacyId = encodeURIComponent(item.id);
  await supabaseRequest(`inventory?legacy_id=eq.${legacyId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

async function deleteDeviceFromSupabase(device) {
  if (dataMode !== "supabase") return;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const column = (device.onlineId || isUuid(device.id)) ? "id" : "legacy_id";
  const value = encodeURIComponent(device.onlineId || device.id);
  await supabaseRequest(`devices?${column}=eq.${value}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

function mapServiceForSupabase(service, clientIdByLegacy, deviceIdByLegacy) {
  return {
    legacy_id: service.id,
    client_id: clientIdByLegacy.get(service.clientId),
    device_id: deviceIdByLegacy.get(service.deviceId),
    technician_id: service.technicianId === session?.id && session?.online ? session.id : null,
    title: service.title || "Servisná úloha",
    priority: service.priority || "Stredná",
    state: service.state || "Nová",
    due: service.due || null,
  };
}

function serviceTaskPayloadForSupabase(service) {
  const client = byId("clients", service.clientId);
  const device = byId("devices", service.deviceId);
  return {
    legacy_id: service.id,
    client_id: client?.onlineId || (isUuid(client?.id) ? client.id : null),
    device_id: device?.onlineId || (isUuid(device?.id) ? device.id : null),
    technician_id: service.technicianId === session?.id && session?.online ? session.id : null,
    title: service.title || "Servisná úloha",
    priority: service.priority || "Stredná",
    state: service.state || "Nová",
    due: service.due || null,
  };
}

async function saveServiceTaskToSupabase(service) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  let payload = serviceTaskPayloadForSupabase(service);
  if (!payload.client_id || !payload.device_id) {
    await loadSupabaseDataIntoState();
    payload = serviceTaskPayloadForSupabase(service);
  }
  if (!payload.client_id || !payload.device_id) throw new Error("Servisná úloha nemá online klienta alebo zariadenie.");
  const rows = await upsertSupabaseRows("service_tasks", [payload]);
  return rows[0] || null;
}

function mapDocumentForSupabase(packet, clientIdByLegacy, deviceIdByLegacy, serviceIdByLegacy) {
  const deviceIds = (packet.deviceIds || (packet.deviceId ? [packet.deviceId] : []))
    .map((id) => deviceIdByLegacy.get(id) || (isUuid(id) ? id : null))
    .filter(Boolean);
  return {
    legacy_id: packet.id,
    document_type: packet.documentType || "",
    title: packet.title || "Dokument",
    kind: packet.kind || "",
    state: packet.state || "",
    billing_state: packet.billingState || null,
    date: packet.date || null,
    due: packet.due || null,
    client_id: clientIdByLegacy.get(packet.clientId) || (isUuid(packet.clientId) ? packet.clientId : null),
    device_id: packet.deviceId ? (deviceIdByLegacy.get(packet.deviceId) || deviceIds[0] || null) : (deviceIds[0] || null),
    service_id: packet.serviceId ? (serviceIdByLegacy.get(packet.serviceId) || (isUuid(packet.serviceId) ? packet.serviceId : null)) : null,
    technician_id: isUuid(packet.technicianId) ? packet.technicianId : (packet.technicianId === session?.id && session?.online ? session.id : null),
    template_ids: packet.templateIds || [],
    device_ids: deviceIds,
    documents: packet.documents || [],
    service_values: { ...(packet.serviceValues || {}), ...(protocolNumber(packet) ? { protocolNumber: protocolNumber(packet) } : {}) },
    warranties: packet.warranties || [],
    signatures: packet.signatures || {},
    rendered_html: packet.renderedHtml || "",
    created_by: isUuid(packet.createdBy) ? packet.createdBy : (packet.createdBy === session?.id && session?.online ? session.id : null),
  };
}

function documentPayloadForSupabase(packet) {
  const clientIdByLegacy = new Map(state.clients.map((client) => [client.id, client.onlineId || (isUuid(client.id) ? client.id : null)]));
  const deviceIdByLegacy = new Map(state.devices.map((device) => [device.id, device.onlineId || (isUuid(device.id) ? device.id : null)]));
  const serviceIdByLegacy = new Map(state.service.map((service) => [service.id, service.onlineId || (isUuid(service.id) ? service.id : null)]));
  return mapDocumentForSupabase(packet, clientIdByLegacy, deviceIdByLegacy, serviceIdByLegacy);
}

async function saveDocumentPacketToSupabase(packet) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  let payload = documentPayloadForSupabase(packet);
  if (!payload.client_id || !payload.device_ids.length) {
    await loadSupabaseDataIntoState();
    payload = documentPayloadForSupabase(packet);
  }
  if (!payload.client_id) throw new Error("Dokument nemá online ambulanciu.");
  if (!payload.device_ids.length) throw new Error("Dokument nemá online zariadenie.");
  const rows = await upsertSupabaseRows("document_packets", [payload]);
  return rows[0] || null;
}

async function deleteDocumentPacketFromSupabase(packet) {
  if (dataMode !== "supabase") return;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const column = (packet.onlineId || isUuid(packet.id)) ? "id" : "legacy_id";
  const value = encodeURIComponent(packet.onlineId || packet.id);
  await supabaseRequest(`document_packets?${column}=eq.${value}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

function mapProviderForSupabase(provider) {
  const linkedClient = byId("clients", provider.linkedClientId);
  const ico = providerIco(provider);
  return {
    source_id: provider.sourceId || provider.id,
    idzz: provider.idzz || "",
    ico,
    name: provider.name || "",
    provider_name: provider.providerName || "",
    specialty: provider.specialty || "",
    address_street: provider.addressStreet || "",
    address_city: provider.city || "",
    address_zip: provider.addressZip || "",
    district: provider.district || "",
    region: provider.region || "",
    email: provider.email || "",
    phone: normalizePhoneNumber(provider.phone || ""),
    insurance: provider.insurance || "",
    source: provider.source || "",
    registry_state: provider.registryState || "Novy",
    linked_client_id: linkedClient?.onlineId || (isUuid(linkedClient?.id) ? linkedClient.id : null),
    imported_at: provider.registryState === "Importovane" ? new Date().toISOString() : null,
  };
}

async function saveProviderRegistryToSupabase(provider) {
  if (dataMode !== "supabase") return null;
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const rows = await upsertSupabaseRows("provider_registry", [mapProviderForSupabase(provider)], "source_id");
  return rows[0] || null;
}

async function upsertSupabaseRows(table, rows, onConflict = "legacy_id") {
  if (!rows.length) return [];
  return supabaseRequest(`${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
  });
}

function clientFromSupabase(row) {
  return {
    id: row.legacy_id || row.id,
    onlineId: row.id,
    name: row.name || "",
    status: row.status || "Aktívna",
    segment: row.segment || "",
    contact: row.contact || "",
    email: row.email || "",
    phone: row.phone || "",
    addressStreet: row.address_street || "",
    city: row.address_city || "",
    addressZip: row.address_zip || "",
    addressFloor: row.address_floor || "",
    addressNote: row.address_note || "",
    billingName: row.billing_name || "",
    billingStreet: row.billing_street || "",
    billingCity: row.billing_city || "",
    billingZip: row.billing_zip || "",
    billingCompanyId: row.billing_company_id || "",
    billingTaxId: row.billing_tax_id || "",
    portalEnabled: row.portal_enabled ?? true,
    note: row.note || "",
    photo: row.photo_path || "",
  };
}

function deviceFromSupabase(row, clientLegacyByOnline) {
  return {
    id: row.legacy_id || row.id,
    onlineId: row.id,
    clientId: clientLegacyByOnline.get(row.client_id) || row.client_id,
    type: row.type || "",
    brand: row.brand || "",
    model: row.model || "",
    serial: row.serial || "",
    installed: row.installed || "",
    warrantyUntil: row.warranty_until || "",
    status: row.status || "OK",
    location: row.location || "",
    documents: row.documents || [],
    documentRecords: [],
    photo: row.photo_path || "",
    invoiceIssued: Boolean(row.invoice_issued || row.invoice_file_path || row.invoice_number),
    invoiceNumber: row.invoice_number || "",
    invoiceDate: row.invoice_date || "",
    invoiceFile: row.invoice_file_path || "",
    invoiceFileName: row.invoice_file_name || "",
  };
}

function inventoryFromSupabase(row) {
  return {
    id: row.legacy_id || row.id,
    onlineId: row.id,
    name: row.name || "",
    manufacturer: row.manufacturer || "",
    itemType: row.item_type || "",
    sku: row.sku || "",
    category: row.category || "",
    qty: Number(row.qty) || 0,
    min: Number(row.min_qty) || 0,
    reserved: Number(row.reserved) || 0,
    location: row.location || "",
    compatibility: row.compatibility || "",
    note: row.note || "",
  };
}

function serviceFromSupabase(row, clientLegacyByOnline, deviceLegacyByOnline) {
  return {
    id: row.legacy_id || row.id,
    onlineId: row.id,
    clientId: clientLegacyByOnline.get(row.client_id) || row.client_id,
    deviceId: deviceLegacyByOnline.get(row.device_id) || row.device_id,
    technicianId: row.technician_id || "",
    title: row.title || "",
    priority: row.priority || "Stredná",
    state: row.state || "Nová",
    due: row.due || "",
    documentRecords: [],
  };
}

function documentFromSupabase(row, clientLegacyByOnline, deviceLegacyByOnline, serviceLegacyByOnline) {
  const deviceIds = (row.device_ids || []).map((id) => deviceLegacyByOnline.get(id) || id);
  const serviceValues = row.service_values || {};
  return {
    id: row.legacy_id || row.id,
    onlineId: row.id,
    documentType: row.document_type || "",
    title: row.title || "",
    kind: row.kind || "",
    state: row.state || "",
    billingState: row.billing_state || "",
    date: row.date || "",
    due: row.due || "",
    clientId: clientLegacyByOnline.get(row.client_id) || row.client_id,
    deviceId: row.device_id ? (deviceLegacyByOnline.get(row.device_id) || row.device_id) : "",
    deviceIds,
    serviceId: row.service_id ? (serviceLegacyByOnline.get(row.service_id) || row.service_id) : "",
    technicianId: row.technician_id || "",
    templateIds: row.template_ids || [],
    documents: row.documents || [],
    protocolNumber: serviceValues.protocolNumber || "",
    serviceValues,
    warranties: row.warranties || [],
    signatures: row.signatures || {},
    renderedHtml: row.rendered_html || "",
    createdBy: row.created_by || "",
  };
}

function providerFromSupabase(row, clientLegacyByOnline) {
  const ico = row.ico || extractIcoFromIdzz(row.idzz || row.source_id || "");
  return {
    id: row.source_id || row.id,
    onlineId: row.id,
    sourceId: row.source_id || "",
    idzz: row.idzz || "",
    name: row.name || "",
    providerName: row.provider_name || "",
    ico,
    specialty: row.specialty || "",
    addressStreet: row.address_street || "",
    city: row.address_city || "",
    addressZip: row.address_zip || "",
    district: row.district || "",
    region: row.region || "",
    email: row.email || "",
    phone: normalizePhoneNumber(row.phone || ""),
    insurance: row.insurance || "",
    source: row.source || "register poskytovateľov",
    registryState: row.registry_state === "Importovane" ? "Importovane" : "Novy",
    linkedClientId: clientLegacyByOnline.get(row.linked_client_id) || "",
  };
}

function attachDocumentRecords() {
  state.devices.forEach((device) => {
    device.documentRecords = state.documentPackets.filter((packet) => (packet.deviceIds || []).includes(device.id) || packet.deviceId === device.id);
  });
  state.service.forEach((service) => {
    service.documentRecords = state.documentPackets.filter((packet) => packet.serviceId === service.id);
  });
}

async function loadSupabaseDataIntoState() {
  if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
  const [profileRows, clientsRows, devicesRows, inventoryRows, serviceRows, documentRows, providerRows] = await Promise.all([
    supabaseRequest("users_profile?select=*&order=display_name.asc"),
    supabaseRequest("clients?select=*&order=name.asc"),
    supabaseRequest("devices?select=*&order=serial.asc"),
    supabaseRequest("inventory?select=*&order=name.asc"),
    supabaseRequest("service_tasks?select=*&order=due.desc"),
    supabaseRequest("document_packets?select=*&order=created_at.desc"),
    supabaseRequestAll("provider_registry?select=*&order=name.asc").catch((error) => {
      console.warn("Register ambulancii sa nepodarilo nacitat zo Supabase:", error);
      return [];
    }),
  ]);

  const onlineUsers = profileRows.map(profileToUser);
  const clients = clientsRows.map(clientFromSupabase);
  const clientLegacyByOnline = new Map(clientsRows.map((row) => [row.id, row.legacy_id || row.id]));
  const devices = devicesRows.map((row) => deviceFromSupabase(row, clientLegacyByOnline));
  const deviceLegacyByOnline = new Map(devicesRows.map((row) => [row.id, row.legacy_id || row.id]));
  const service = serviceRows.map((row) => serviceFromSupabase(row, clientLegacyByOnline, deviceLegacyByOnline));
  const serviceLegacyByOnline = new Map(serviceRows.map((row) => [row.id, row.legacy_id || row.id]));
  const documentPackets = documentRows.map((row) => documentFromSupabase(row, clientLegacyByOnline, deviceLegacyByOnline, serviceLegacyByOnline));

  state = {
    ...state,
    users: onlineUsers,
    clients,
    devices,
    inventory: inventoryRows.map(inventoryFromSupabase),
    service,
    documentPackets,
    providerRegistry: providerRows.length ? providerRows.map((row) => providerFromSupabase(row, clientLegacyByOnline)) : state.providerRegistry,
  };
  ensureStateShape();
  state.users = onlineUsers.length ? onlineUsers : state.users;
  attachDocumentRecords();
  saveLoginPreviewTotals({
    clients: clients.length,
    devices: devices.length,
    risks: devices.filter((device) => device.status !== "OK" && device.status !== "Importované").length
      + inventoryRows.map(inventoryFromSupabase).filter((item) => item.qty <= item.min).length,
  });
  supabaseStatus = {
    state: "Supabase režim",
    detail: `Načítané zo Supabase: ${onlineUsers.length} používateľov, ${clients.length} klientov, ${devices.length} zariadení, ${inventoryRows.length} skladových položiek, ${service.length} servisných úloh, ${documentPackets.length} dokumentov, ${providerRows.length} záznamov registra. Ambulančné profily, zariadenia, používatelia, servis, sklad, dokumenty aj register sa už zapisujú online.`,
  };
}

async function migrateLocalDataToSupabase() {
  if (!isSuperAdmin()) {
    alert("Migráciu do Supabase môže spustiť iba SuperAdministrátor.");
    return;
  }
  if (!supabaseAuth?.access_token) {
    alert("Najprv sa prihláste cez Supabase Auth.");
    return;
  }
  if (!confirm("Odoslať lokálne dáta klientov, zariadení, skladu a servisu do Supabase? Predtým odporúčam stiahnuť Export DB.")) return;

  supabaseStatus = { state: "Migrácia", detail: "Odosielam klientov do Supabase..." };
  render();
  try {
    const clients = await upsertSupabaseRows("clients", state.clients.map(mapClientForSupabase));
    const clientIdByLegacy = new Map(clients.map((client) => [client.legacy_id, client.id]));

    supabaseStatus = { state: "Migrácia", detail: "Odosielam zariadenia..." };
    render();
    const deviceRows = state.devices
      .map((device) => mapDeviceForSupabase(device, clientIdByLegacy))
      .filter((device) => device.client_id);
    const devices = await upsertSupabaseRows("devices", deviceRows);
    const deviceIdByLegacy = new Map(devices.map((device) => [device.legacy_id, device.id]));

    supabaseStatus = { state: "Migrácia", detail: "Odosielam sklad..." };
    render();
    await upsertSupabaseRows("inventory", state.inventory.map(mapInventoryForSupabase));

    supabaseStatus = { state: "Migrácia", detail: "Odosielam servisné úlohy..." };
    render();
    const serviceRows = state.service
      .map((service) => mapServiceForSupabase(service, clientIdByLegacy, deviceIdByLegacy))
      .filter((service) => service.client_id && service.device_id);
    const services = await upsertSupabaseRows("service_tasks", serviceRows);
    const serviceIdByLegacy = new Map(services.map((service) => [service.legacy_id, service.id]));

    supabaseStatus = { state: "Migrácia", detail: "Odosielam dokumenty a podpisové balíky..." };
    render();
    const documentRows = state.documentPackets
      .map((packet) => mapDocumentForSupabase(packet, clientIdByLegacy, deviceIdByLegacy, serviceIdByLegacy))
      .filter((packet) => packet.client_id);
    await upsertSupabaseRows("document_packets", documentRows);

    supabaseStatus = {
      state: "Migrácia hotová",
      detail: `Odoslané: ${clients.length} klientov, ${devices.length} zariadení, ${state.inventory.length} skladových položiek, ${serviceRows.length} servisných úloh, ${documentRows.length} dokumentov.`,
    };
    addAudit("Migrácia do Supabase", supabaseStatus.detail);
    saveState();
  } catch (error) {
    supabaseStatus = { state: "Migrácia zlyhala", detail: error.message };
  }
  render();
}

function downloadCsv(filename, rows) {
  const csv = "\ufeff" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value = "") {
  return `"${String(value).replaceAll('"', '""').replaceAll(/\r?\n/g, " | ")}"`;
}

function parseMoney(value = "") {
  const normalized = String(value).replace(",", ".").replace(/[^0-9.-]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function syncDocumentRecord(record) {
  const replaceRecord = (item) => item.id === record.id ? { ...item, ...record } : item;
  state.documentPackets = state.documentPackets.map(replaceRecord);
  state.devices.forEach((device) => {
    device.documentRecords = (device.documentRecords || []).map(replaceRecord);
  });
  state.service.forEach((service) => {
    service.documentRecords = (service.documentRecords || []).map(replaceRecord);
  });
}

function slugify(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "technik";
}

function addAudit(action, detail = "") {
  state.auditLog = state.auditLog || [];
  state.auditLog.unshift({
    id: nextId("a", "auditLog"),
    at: new Date().toISOString(),
    userId: session?.id || "",
    userName: session?.name || "Systém",
    action,
    detail,
  });
  state.auditLog = state.auditLog.slice(0, 300);
}

function documentNotificationPayload(record) {
  const client = byId("clients", record.clientId);
  const devices = (record.deviceIds || (record.deviceId ? [record.deviceId] : []))
    .map((id) => byId("devices", id))
    .filter(Boolean);
  return {
    recipients: DOCUMENT_NOTIFICATION_RECIPIENTS,
    protocolNumber: protocolNumber(record),
    title: record.title || "Protokol",
    kind: record.kind || (record.documentType === "service" ? "Servis" : "Dokument"),
    date: record.date || record.due || "",
    clientName: client?.name || clientName(record.clientId),
    clientAddress: client ? clientAddress(client) : "",
    devices: devices.map((device) => ({
      label: deviceLabel(device),
      serial: device.serial || "",
    })),
    technician: userName(record.technicianId || record.createdBy || session?.id),
    url: window.location.origin,
  };
}

async function sendDocumentNotification(record) {
  try {
    const response = await fetch("/api/document-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documentNotificationPayload(record)),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }
    addAudit("Odoslaná e-mailová notifikácia", `${protocolNumber(record)} - ${DOCUMENT_NOTIFICATION_RECIPIENTS.join(", ")}`);
  } catch (error) {
    addAudit("E-mailová notifikácia neodišla", `${protocolNumber(record) || record.title}: ${error.message}`);
    console.warn("Document notification failed", error);
  }
}

function renderAdmin() {
  setTitle("Administrácia", "Používatelia a oprávnenia");
  if (!isAdmin()) return emptyState("Táto sekcia je dostupná iba administrátorom.");
  const adminHint = isSuperAdmin()
    ? "Ste prihlásený ako SuperAdministrátor. Môžete pridávať technikov, administrátorov aj nového SuperAdministrátora."
    : "Administrátor môže pridávať technikov. Administrátorov a SuperAdministrátora môže priradiť iba SuperAdministrátor.";
  return `
    <section class="panel">
      <div class="panel-header">
        <h3>Online testovanie</h3>
        <div class="row-actions">
          <button class="secondary-action" type="button" data-test-provider-registry>Test registra</button>
          <button class="secondary-action" type="button" data-test-supabase>Test pripojenia</button>
        </div>
      </div>
      <div class="summary-grid">
        <div><strong>${supabaseStatus.state}</strong><span>Supabase stav</span></div>
        <div><strong>${supabaseConfig().url ? "Nastavené" : "Chýba"}</strong><span>Project URL</span></div>
        <div><strong>${supabaseAuth?.access_token ? "Aktívny" : "Nie"}</strong><span>Auth token</span></div>
      </div>
      <p class="form-note">${supabaseStatus.detail}</p>
    </section>
    <section class="panel">
      <div class="panel-header">
        <h3>Technici a administrátori</h3>
        <div class="row-actions">
          ${isSuperAdmin() ? `<button class="ghost-action" type="button" data-export-database>Export DB</button>` : ""}
          <button class="primary-action" type="button" data-open-user-form>Pridať používateľa</button>
        </div>
      </div>
      <p class="form-note">${adminHint}</p>
      <div class="table-shell">
        <table>
          <thead><tr><th>Meno</th><th>Rola</th><th>E-mail</th><th>Telefón</th><th>Stav</th><th>Ochrana</th><th>Akcia</th></tr></thead>
          <tbody>
            ${state.users.map((user) => `
              <tr>
                <td data-label="Meno">${user.name}</td>
                <td data-label="Rola"><span class="role-pill status-planned">${user.role}</span></td>
                <td data-label="E-mail">${user.email}</td>
                <td data-label="Telefón">${user.phone}</td>
                <td data-label="Stav"><span class="status-pill ${user.active ? "status-ok" : "status-critical"}">${user.active ? "Aktívny" : "Vypnutý"}</span></td>
                <td data-label="Ochrana">${user.protected ? "Chránený účet" : ""}</td>
                <td data-label="Akcia">${canEditUser(user) ? `<button class="ghost-action" type="button" data-edit-user="${user.id}">Upraviť</button>` : ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header"><h3>História zmien</h3></div>
      <div class="timeline">
        ${(state.auditLog || []).slice(0, 30).map((entry) => `
          <article class="timeline-item">
            <strong>${entry.action}</strong>
            <small>${formatDate(entry.at)} - ${entry.userName}</small>
            <p>${entry.detail || ""}</p>
          </article>
        `).join("") || "Zatiaľ bez zaznamenaných zmien."}
      </div>
    </section>
  `;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function providerById(id) {
  return (state.providerRegistry || []).find((provider) => provider.id === id);
}

function updateProviderRegistryState(id, registryState, linkedClientId = "") {
  const provider = providerById(id);
  if (!provider) return;
  provider.registryState = registryState;
  if (linkedClientId) provider.linkedClientId = linkedClientId;
  addAudit("Register ambulancií", `${provider.name} - ${registryState}`);
  saveState();
  render();
}

async function testProviderRegistryConnection() {
  if (!isAdmin()) return;
  if (!supabaseAuth?.access_token) {
    supabaseStatus = {
      state: "Neprihlasene online",
      detail: "Nie je aktivny Supabase Auth token. Odhlaste sa a prihlaste sa znova.",
    };
    render();
    return;
  }
  supabaseStatus = { state: "Testujem register", detail: "Prebieha nacitanie provider_registry zo Supabase..." };
  render();
  try {
    const rows = await supabaseRequestAll("provider_registry?select=id,source_id,name&order=name.asc");
    supabaseStatus = {
      state: "Register dostupny",
      detail: `REST API vratilo ${rows?.length ?? 0} zaznamov z provider_registry. Register sa nacitava po strankach, aby neostal odrezany na limite 1000 riadkov.`,
    };
  } catch (error) {
    supabaseStatus = {
      state: "Register nedostupny",
      detail: `${error.message}. Tabulka provider_registry existuje, ale aplikacia ju nevie citat cez RLS/Auth.`,
    };
  }
  render();
}

async function addProviderAsClient(id) {
  const provider = providerById(id);
  if (!provider) return;
  const existing = providerMatchedClient(provider);
  if (existing) {
    provider.registryState = "Importovane";
    provider.linkedClientId = existing.id;
    if (dataMode === "supabase") await saveProviderRegistryToSupabase(provider).catch(() => null);
    addAudit("Importovaný poskytovateľ z registra", `${provider.name} -> ${existing.name}`);
    saveState();
    activeView = "clients";
    qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "clients"));
    render();
    openClientProfile(existing.id);
    return;
  }
  const client = providerClientPayload(provider);
  try {
    if (dataMode === "supabase") {
      const onlineClient = await saveClientToSupabase(client);
      if (onlineClient?.id) client.onlineId = onlineClient.id;
    }
    if (!state.clients.some((item) => item.id === client.id)) state.clients.push(client);
    provider.registryState = "Importovane";
    provider.linkedClientId = client.id;
    if (dataMode === "supabase") await saveProviderRegistryToSupabase(provider).catch(() => null);
    addAudit("Pridaný klient z registra", `${client.name} - ${provider.sourceId || provider.idzz || provider.id}`);
    saveState();
    activeView = "clients";
    qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "clients"));
    render();
    openClientProfile(client.id);
  } catch (error) {
    alert(`Pridanie klienta z registra zlyhalo: ${error.message}`);
  }
}

async function linkProviderToClient(providerId, clientId) {
  const provider = providerById(providerId);
  const client = byId("clients", clientId);
  if (!provider || !client) return;
  provider.registryState = "Importovane";
  provider.linkedClientId = client.id;
  if (dataMode === "supabase") await saveProviderRegistryToSupabase(provider).catch(() => null);
  addAudit("Prepojený register s klientom", `${provider.name} -> ${client.name}`);
  saveState();
  render();
  openClientProfile(client.id);
}

function openProviderDetail(id) {
  const provider = providerById(id);
  if (!provider) return;
  const imported = provider.registryState === "Importovane" || provider.linkedClientId;
  const displayName = providerDisplayName(provider);
  const ico = providerIco(provider);
  openModal(`Register: ${displayName}`, `
    <div class="profile-card">
      <span class="status-pill ${statusClass(imported ? "Importovane" : "Novy")}">${imported ? "Importované" : "Nové"}</span>
      <h3>${displayName}</h3>
      <dl class="definition-list">
        <div><dt>Prevádzka</dt><dd>${provider.name || "-"}</dd></div>
        <div><dt>Prevádzkovateľ</dt><dd>${provider.providerName || "-"}</dd></div>
        <div><dt>Odbornosť</dt><dd>${provider.specialty || "-"}</dd></div>
        <div><dt>Adresa</dt><dd>${provider.addressStreet || ""}, ${provider.addressZip || ""} ${provider.city || ""}</dd></div>
        <div><dt>Okres / kraj</dt><dd>${provider.district || "-"} / ${provider.region || "-"}</dd></div>
        <div><dt>IČO</dt><dd>${ico || "-"}</dd></div>
        <div><dt>IdZZ</dt><dd>${provider.idzz || "-"}</dd></div>
        <div><dt>Kontakt</dt><dd>${provider.email || "-"}${provider.phone ? `, ${provider.phone}` : ""}</dd></div>
        <div><dt>Poisťovne</dt><dd>${provider.insurance || "-"}</dd></div>
        <div><dt>Zdroj</dt><dd>${provider.source || "-"} (${provider.sourceId || provider.id})</dd></div>
      </dl>
      <div class="button-row">
        ${imported ? `<span class="status-pill ${statusClass("Importovane")}">Importované</span>` : `<button class="primary-action" type="button" data-provider-add-client="${provider.id}">Pridať medzi klientov</button>`}
      </div>
    </div>
  `, (modal) => bindViewActions(modal));
}

function showProviderImportPreview() {
  openModal("Ukážka importu registra", `
    <div class="profile-card">
      <h3>Ako by fungoval reálny import</h3>
      <div class="timeline">
        <article class="timeline-item"><strong>1. Stiahnuť zdroj</strong><small>e-VÚC / open data / krajský endpoint</small></article>
        <article class="timeline-item"><strong>2. Normalizovať údaje</strong><small>IČO, IdZZ, adresa, mesto, kontakty, poisťovne</small></article>
        <article class="timeline-item"><strong>3. Nájsť zhody</strong><small>Porovnanie s klientmi DentApp podľa IČO, názvu a adresy</small></article>
        <article class="timeline-item"><strong>4. Zobraziť v registri</strong><small>Bez automatického miešania medzi reálnych klientov</small></article>
      </div>
      <p class="form-note">Toto je zatiaľ iba návrh obrazovky. Reálny import by sme urobili až po vytvorení tabuľky v Supabase.</p>
    </div>
  `, null);
}

function bindViewActions(scope) {
  qsa("[data-client-profile]", scope).forEach((button) => button.addEventListener("click", () => openClientProfile(button.dataset.clientProfile)));
  qsa("[data-open-client-portal]", scope).forEach((button) => button.addEventListener("click", () => openClientPortal(button.dataset.openClientPortal)));
  qsa("[data-open-client-portal-page]", scope).forEach((button) => button.addEventListener("click", () => openClientPortalPage(button.dataset.openClientPortalPage)));
  qsa("[data-portal-service-request]", scope).forEach((form) => form.addEventListener("submit", savePortalServiceRequest));
  qsa("[data-device-profile]", scope).forEach((button) => button.addEventListener("click", () => openDeviceProfile(button.dataset.deviceProfile)));
  qsa("[data-edit-client]", scope).forEach((button) => button.addEventListener("click", () => openClientForm(button.dataset.editClient)));
  qsa("[data-edit-device]", scope).forEach((button) => button.addEventListener("click", () => openDeviceForm(button.dataset.editDevice)));
  qsa("[data-delete-device]", scope).forEach((button) => button.addEventListener("click", () => deleteDevice(button.dataset.deleteDevice, button.dataset.returnClient || "")));
  qsa("[data-client-letter]", scope).forEach((button) => button.addEventListener("click", () => {
    clientLetterFilter = button.dataset.clientLetter || "all";
    render();
  }));
  qsa("[data-provider-detail]", scope).forEach((button) => button.addEventListener("click", () => openProviderDetail(button.dataset.providerDetail)));
  qsa("[data-provider-add-client]", scope).forEach((button) => button.addEventListener("click", () => addProviderAsClient(button.dataset.providerAddClient)));
  qs("[data-simulate-provider-import]", scope)?.addEventListener("click", showProviderImportPreview);
  qs("[data-provider-registry-filter]", scope)?.addEventListener("change", (event) => {
    providerRegistryFilter = event.target.value;
    render();
  });
  qs("[data-provider-region-filter]", scope)?.addEventListener("change", (event) => {
    providerRegionFilter = event.target.value;
    providerDistrictFilter = "all";
    render();
  });
  qs("[data-provider-district-filter]", scope)?.addEventListener("change", (event) => {
    providerDistrictFilter = event.target.value;
    render();
  });
  qsa("[data-start-handover-device]", scope).forEach((button) => button.addEventListener("click", () => openHandoverWorkflow(button.dataset.startHandoverDevice)));
  qsa("[data-edit-service]", scope).forEach((button) => button.addEventListener("click", () => openServiceForm(button.dataset.editService)));
  qsa("[data-open-service-protocol]", scope).forEach((button) => button.addEventListener("click", () => openServiceProtocolWorkflow(button.dataset.openServiceProtocol)));
  qsa("[data-open-signed-document]", scope).forEach((button) => button.addEventListener("click", () => openSignedDocument(button.dataset.openSignedDocument)));
  qsa("[data-sign-document-packet]", scope).forEach((button) => button.addEventListener("click", () => openHandoverPacketWorkflow(button.dataset.signDocumentPacket)));
  qsa("[data-delete-signed-document]", scope).forEach((button) => button.addEventListener("click", () => deleteSignedDocument(button.dataset.deleteSignedDocument)));
  qsa("[data-add-device-client]", scope).forEach((button) => button.addEventListener("click", () => openDeviceForm("", button.dataset.addDeviceClient)));
  qs("[data-open-client-form]", scope)?.addEventListener("click", () => openClientForm());
  qs("[data-open-device-form]", scope)?.addEventListener("click", () => openDeviceForm());
  qs("[data-open-inventory-form]", scope)?.addEventListener("click", () => openInventoryForm());
  qs("[data-open-bulk-inventory-form]", scope)?.addEventListener("click", () => openBulkInventoryForm());
  qsa("[data-edit-inventory]", scope).forEach((button) => button.addEventListener("click", () => openInventoryForm(button.dataset.editInventory)));
  qsa("[data-delete-inventory]", scope).forEach((button) => button.addEventListener("click", () => deleteInventoryItem(button.dataset.deleteInventory)));
  qs("[data-test-provider-registry]", scope)?.addEventListener("click", testProviderRegistryConnection);
  qs("[data-test-supabase]", scope)?.addEventListener("click", testSupabaseConnection);
  qs("[data-open-service-form]", scope)?.addEventListener("click", () => openServiceForm());
  qs("[data-export-service-billing]", scope)?.addEventListener("click", () => exportServiceBillingCsv(scope));
  qs("[data-mark-billed-service]", scope)?.addEventListener("click", () => markServiceBillingAsBilled(scope));
  qs("[data-service-technician-filter]", scope)?.addEventListener("change", (event) => {
    serviceTechnicianFilter = event.target.value;
    render();
  });
  qs("[data-service-status-filter]", scope)?.addEventListener("change", (event) => {
    serviceStatusFilter = event.target.value;
    render();
  });
  qs("[data-dashboard-service-filter]", scope)?.addEventListener("change", (event) => {
    dashboardServiceFilter = event.target.value;
    render();
  });
  qs("[data-open-document-packet-form]", scope)?.addEventListener("click", () => openDocumentPacketForm());
  qs("[data-open-user-form]", scope)?.addEventListener("click", () => openUserForm());
  qsa("[data-edit-user]", scope).forEach((button) => button.addEventListener("click", () => openUserForm(button.dataset.editUser)));
  qs("[data-export-database]", scope)?.addEventListener("click", exportLocalDatabase);
  qs("[data-inventory-manufacturer-filter]", scope)?.addEventListener("change", (event) => {
    inventoryManufacturerFilter = event.target.value;
    render();
  });
  qs("[data-inventory-category-filter]", scope)?.addEventListener("change", (event) => {
    inventoryCategoryFilter = event.target.value;
    render();
  });
}

function openModal(title, html, onReady) {
  const template = qs("#modalTemplate").content.cloneNode(true);
  template.querySelector("h3").textContent = title;
  template.querySelector(".modal-body").innerHTML = html;
  const backdrop = template.querySelector(".modal-backdrop");
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
  template.querySelector("[data-close-modal]").addEventListener("click", () => backdrop.remove());
  document.body.appendChild(template);
  const modal = qsa(".modal-backdrop").at(-1);
  onReady?.(modal);
}

function openClientProfile(id) {
  const client = byId("clients", id);
  const devices = getClientDevices(id);
  const service = getClientService(id);
  const notes = state.notes.filter((note) => note.clientId === id);
  const packets = state.documentPackets.filter((packet) => packet.clientId === id);
  openModal(`Profil ambulancie: ${client.name}`, `
    <div class="profile-grid">
      <section class="profile-card">
        ${imagePreview(client.photo, client.name)}
        <h3>Kontakt a klientsky profil</h3>
        <dl class="definition-list">
          <div><dt>Adresa</dt><dd>${clientAddress(client)}</dd></div>
          <div><dt>Poschodie</dt><dd>${client.addressFloor || "Doplniť"}</dd></div>
          <div><dt>Fakturácia</dt><dd>${billingAddress(client)}</dd></div>
          <div><dt>IČO / DIČ</dt><dd>${[client.billingCompanyId, client.billingTaxId].filter(Boolean).join(" / ") || "Doplniť"}</dd></div>
          <div><dt>Kontakt</dt><dd>${client.contact}</dd></div>
          <div><dt>E-mail</dt><dd>${client.email}</dd></div>
          <div><dt>Telefón</dt><dd>${client.phone}</dd></div>
          <div><dt>Stav</dt><dd><span class="status-pill ${statusClass(client.status)}">${client.status}</span></dd></div>
          <div><dt>Poznámka</dt><dd>${client.note}</dd></div>
        </dl>
        <div class="button-row">
          <button class="secondary-action" type="button" data-edit-client="${client.id}">Upraviť ambulanciu</button>
          <button class="ghost-action" type="button" data-open-document-packet-form>Nový podpisový balík</button>
          <button class="secondary-action" type="button" data-open-client-portal="${client.id}">Klientsky portál</button>
        </div>
      </section>
      <section class="profile-card">
        <div class="panel-header">
          <h3>Zariadenia ambulancie</h3>
          <button class="primary-action" type="button" data-add-device-client="${client.id}">Pridať zariadenie</button>
        </div>
        ${devices.length ? devices.map((device) => `
          <article class="timeline-item">
            <strong><button class="link-button" type="button" data-device-profile="${device.id}">${deviceName(device.id)}</button></strong>
            <small>SN ${cleanImportedValue(device.serial) || "neuvedené"} - ${device.warrantyUntil ? `záruka do ${formatOptionalDate(device.warrantyUntil)}` : "záruka neuvedená"}</small>
            <span class="status-pill ${statusClass(device.status)}">${device.status}</span>
            <span class="status-pill ${isDeviceInvoiced(device) ? "status-ok" : "status-planned"}">${isDeviceInvoiced(device) ? "Fakturované" : "Bez FA"}</span>
            <div class="button-row">
              <button class="ghost-action" type="button" data-edit-device="${device.id}">Upraviť zariadenie</button>
              ${deviceHasSignedHandover(device) ? "" : `<button class="secondary-action" type="button" data-start-handover-device="${device.id}">Podpis dokumentov</button>`}
              <button class="danger-action" type="button" data-delete-device="${device.id}" data-return-client="${client.id}">Vymazať</button>
            </div>
          </article>
        `).join("") : emptyState("Ambulancia zatiaľ nemá zariadenia.")}
      </section>
      <section class="profile-card">
        <h3>Servisná história</h3>
        <div class="timeline">
          ${service.map((item) => `<article class="timeline-item"><strong>${item.title}</strong><small>${formatDate(item.due)} - ${userName(item.technicianId)}</small></article>`).join("") || "Bez servisnej histórie."}
        </div>
      </section>
      <section class="profile-card">
        <h3>Poznámky a dokumentácia</h3>
        <div class="timeline">
          ${notes.map((note) => `<article class="timeline-item"><strong>${formatDate(note.date)}</strong><p>${note.text}</p></article>`).join("") || "Bez poznámok."}
        </div>
      </section>
      <section class="profile-card">
        <h3>Podpisové balíky</h3>
        <div class="timeline">
          ${packets.map((packet) => `<article class="timeline-item"><strong>${packet.title}</strong><small>${packet.kind} - ${formatDate(packet.due)}</small><span class="status-pill ${statusClass(packet.state)}">${packet.state}</span></article>`).join("") || "Bez podpisových balíkov."}
        </div>
      </section>
    </div>
  `, (modal) => bindViewActions(modal));
}

function openDeviceProfile(id) {
  const device = byId("devices", id);
  openModal(`Profil zariadenia: ${deviceName(id)}`, `
    <div class="profile-grid">
      <section class="profile-card">
        ${imagePreview(device.photo, deviceName(id))}
        <h3>Technické údaje</h3>
        <dl class="definition-list">
          <div><dt>Ambulancia</dt><dd>${clientName(device.clientId)}</dd></div>
          <div><dt>Typ</dt><dd>${device.type}</dd></div>
          <div><dt>Model</dt><dd>${device.brand} ${device.model}</dd></div>
          <div><dt>Sériové číslo</dt><dd>${device.serial}</dd></div>
          <div><dt>Lokácia</dt><dd>${device.location}</dd></div>
          <div><dt>Fakturácia</dt><dd>
            <span class="status-pill ${isDeviceInvoiced(device) ? "status-ok" : "status-planned"}">${invoiceLabel(device)}</span>
            ${isAdmin() && device.invoiceFile ? `<br>${invoiceLink(device)}` : ""}
            ${isAdmin() && device.invoiceDate ? `<br><small>Dátum FA: ${formatDate(device.invoiceDate)}</small>` : ""}
          </dd></div>
          <div><dt>Stav</dt><dd><span class="status-pill ${statusClass(device.status)}">${device.status}</span></dd></div>
        </dl>
        <div class="button-row">
          <button class="secondary-action" type="button" data-edit-device="${device.id}">Upraviť zariadenie</button>
          ${deviceHasSignedHandover(device) ? `<button class="ghost-action" type="button" data-open-signed-document="${device.documentRecords.find((record) => record.documentType !== "service" && canOpenSignedDocument(record))?.id}">Otvoriť odovzdanie</button>` : (device.clientId ? `<button class="ghost-action" type="button" data-start-handover-device="${device.id}">Pripraviť podpis</button>` : "")}
          <button class="danger-action" type="button" data-delete-device="${device.id}">Vymazať zariadenie</button>
        </div>
      </section>
      <section class="profile-card">
        <h3>Záruka a dokumenty</h3>
        <dl class="definition-list">
          <div><dt>Inštalácia</dt><dd>${formatDate(device.installed)}</dd></div>
          <div><dt>Záruka do</dt><dd>${formatOptionalDate(device.warrantyUntil)}</dd></div>
        </dl>
        <ul>
          ${device.documents.map((documentName) => `<li>${documentName}</li>`).join("")}
        </ul>
      </section>
      <section class="profile-card">
        <h3>Odovzdávacie záznamy</h3>
        <div class="timeline">
          ${(device.documentRecords || []).map((record) => `
            <article class="timeline-item">
              <strong>${record.title}</strong>
              <small>${formatDate(record.date)} - ${record.documents.join(", ")}</small>
              ${record.warranty ? `<small>Záruka: ${record.warranty}</small>` : ""}
              <span class="status-pill ${statusClass(record.state)}">${record.state}</span>
              <div class="row-actions">
                ${canOpenSignedDocument(record) ? `<button class="ghost-action" type="button" data-open-signed-document="${record.id}">Otvoriť podpísaný dokument</button>` : ""}
                ${canSignHandoverPacket(record) ? `<button class="secondary-action" type="button" data-sign-document-packet="${record.id}">Podpísať</button>` : ""}
                ${isAdmin() ? `<button class="danger-action" type="button" data-delete-signed-document="${record.id}">Vymazať</button>` : ""}
              </div>
            </article>
          `).join("") || "Zatiaľ bez uložených odovzdávacích dokumentov."}
        </div>
      </section>
    </div>
  `, (modal) => bindViewActions(modal));
}

function openClientForm(id = "") {
  const client = id ? byId("clients", id) : {};
  const customBilling = hasCustomBillingAddress(client);
  openModal(id ? "Upraviť ambulanciu" : "Pridať ambulanciu", `
    <form class="form-grid" id="clientForm" data-edit-id="${id}">
      ${input("name", "Názov ambulancie", "DentAll Clinic", "text", client.name)}
      ${input("addressStreet", "Ulica a číslo", "Strojnícka 18", "text", client.addressStreet, false)}
      ${input("city", "Mesto", "Bratislava", "text", client.city)}
      ${input("addressZip", "PSČ", "080 06", "text", client.addressZip, false)}
      ${input("addressFloor", "Poschodie / orientácia", "2. poschodie, dvere vľavo", "text", client.addressFloor, false)}
      ${input("contact", "Kontaktná osoba", "MUDr. ...", "text", client.contact)}
      ${input("email", "E-mail", "recepcia@ambulancia.sk", "email", client.email, false)}
      ${input("phone", "Telefón", "+421 ...", "text", client.phone, false)}
      ${input("segment", "Segment", "Ambulancia", "text", client.segment, false)}
      <div class="field-with-action">
        ${input("billingCompanyId", "IČO", "36486761", "text", client.billingCompanyId, false)}
        <button class="secondary-action" type="button" data-load-provider-registry>Načítať z registra</button>
        <button class="secondary-action" type="button" data-load-company-by-ico>Načítať podľa IČO</button>
      </div>
      ${input("billingTaxId", "DIČ / IČ DPH", "SK...", "text", client.billingTaxId, false)}
      <label class="checkline full">
        <input type="checkbox" name="customBillingAddress" ${customBilling ? "checked" : ""}>
        <span>Fakturačná adresa je iná ako adresa ambulancie</span>
      </label>
      <section class="form-subsection full ${customBilling ? "" : "is-hidden"}" data-billing-address-section>
        ${input("billingName", "Fakturačný názov", "Ak sa líši od ambulancie", "text", client.billingName, false)}
        ${input("billingStreet", "Fakturačná ulica", "Ulica a číslo", "text", client.billingStreet, false)}
        ${input("billingCity", "Fakturačné mesto", "Mesto", "text", client.billingCity, false)}
        ${input("billingZip", "Fakturačné PSČ", "PSČ", "text", client.billingZip, false)}
      </section>
      <label><span>Stav</span><select name="status">
        ${["Aktívna", "Riziko", "Bez zariadenia", "Neaktívna"].map((status) => `<option ${client.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></label>
      <label><span>Fotografia ambulancie</span><input name="photoFile" type="file" accept="image/*"></label>
      <label class="full"><span>Poznámka k adrese</span><textarea name="addressNote">${escapeHtml(client.addressNote || "")}</textarea></label>
      <label class="full"><span>Poznámka</span><textarea name="note">${escapeHtml(client.note || "")}</textarea></label>
      <button class="primary-action full" type="submit">${id ? "Uložiť zmeny" : "Uložiť ambulanciu"}</button>
    </form>
  `, bindClientForm);
}

function bindClientForm(modal) {
  const form = qs("#clientForm", modal);
  const customBillingInput = qs("[name='customBillingAddress']", form);
  const billingSection = qs("[data-billing-address-section]", form);
  const toggleBillingSection = () => {
    billingSection?.classList.toggle("is-hidden", !customBillingInput?.checked);
  };
  customBillingInput?.addEventListener("change", toggleBillingSection);
  qs("[data-load-provider-registry]", form)?.addEventListener("click", () => openProviderLookupForClient(form));
  qs("[data-load-company-by-ico]", form)?.addEventListener("click", () => fillCompanyByIco(form));
  form.addEventListener("submit", saveClient);
  toggleBillingSection();
}

async function fillCompanyByIco(form) {
  const icoInput = qs("[name='billingCompanyId']", form);
  const ico = (icoInput?.value || "").replace(/\D/g, "");
  if (ico.length < 6) {
    alert("Zadajte platné IČO.");
    return;
  }

  const button = qs("[data-load-company-by-ico]", form);
  const originalText = button?.textContent || "";
  if (button) {
    button.disabled = true;
    button.textContent = "Načítavam...";
  }

  try {
    const company = await fetchCompanyByIco(ico);
    applyCompanyToClientForm(form, company);
  } catch (error) {
    alert(`Údaje podľa IČO sa nepodarilo načítať: ${error.message}`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function fetchCompanyByIco(ico) {
  const response = await fetch(`https://api.subjekt.sk/v1/entity/${encodeURIComponent(ico)}`);
  if (!response.ok) throw new Error(response.status === 404 ? "IČO sa nenašlo." : "Register neodpovedal.");
  const company = await response.json();
  if (!company?.ico || !company?.name) throw new Error("Register nevrátil použiteľné údaje.");
  return company;
}

function applyCompanyToClientForm(form, company) {
  const address = company.address || {};
  const street = [address.street, address.building_no].filter(Boolean).join(" ");
  const useBilling = qs("[name='customBillingAddress']", form)?.checked;
  const setValue = (name, value) => {
    const field = qs(`[name='${name}']`, form);
    if (field && value) field.value = value;
  };

  setValue("billingCompanyId", company.ico);
  setValue("billingTaxId", company.ic_dph || company.dic || "");
  if (useBilling) {
    setValue("billingName", company.name);
    setValue("billingStreet", street);
    setValue("billingCity", address.city || "");
    setValue("billingZip", address.zip || "");
  } else {
    setValue("name", company.name);
    setValue("addressStreet", street);
    setValue("city", address.city || "");
    setValue("addressZip", address.zip || "");
  }
}

function openDeviceForm(id = "", presetClientId = "") {
  const device = id ? byId("devices", id) : {};
  const selectedClientId = device.clientId || presetClientId;
  openModal(id ? "Upraviť zariadenie" : "Pridať zariadenie", `
    <form class="form-grid" id="deviceForm" data-edit-id="${id}">
      ${clientPicker(selectedClientId, false, false)}
      ${input("type", "Typ", "CBCT", "text", device.type)}
      ${input("brand", "Značka", "Vatech", "text", device.brand)}
      ${input("model", "Model", "Green X", "text", device.model)}
      ${input("serial", "Sériové číslo", "SN-...", "text", device.serial)}
      ${input("location", "Umiestnenie", "RTG miestnosť", "text", device.location, false)}
      ${input("installed", "Dátum inštalácie", "", "date", device.installed, false)}
      ${input("warrantyUntil", "Záruka do", "", "date", device.warrantyUntil, false)}
      <label><span>Stav</span><select name="status">
        ${["Skladom", "Rezervované", "OK", "Importované", "Servis", "Pozor", "Záruka končí", "Vyradené"].map((status) => `<option ${device.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></label>
      <label class="full"><span>Dokumenty / poznámka</span><textarea name="documentsText">${escapeHtml((device.documents || []).join("\n"))}</textarea></label>
      <label class="full"><span>Fotografia zariadenia</span><input name="photoFile" type="file" accept="image/*"></label>
      ${isAdmin() ? `
        <fieldset class="full checklist invoice-fieldset">
          <legend>Faktúra k zariadeniu</legend>
          <label class="checkline">
            <input type="checkbox" name="invoiceIssued" ${isDeviceInvoiced(device) ? "checked" : ""}>
            <span>Zariadenie je fakturované</span>
          </label>
          ${input("invoiceNumber", "Číslo FA", "FA-2026-001", "text", device.invoiceNumber || "", false)}
          ${input("invoiceDate", "Dátum FA", "", "date", device.invoiceDate || "", false)}
          <label class="full"><span>Súbor FA</span><input name="invoiceFile" type="file" accept="application/pdf,image/*"></label>
          ${device.invoiceFile ? `<p class="form-note full">Aktuálne uložená FA: ${escapeHtml(device.invoiceFileName || "faktúra")} ${invoiceLink(device, "Otvoriť uloženú FA")}</p>` : `<p class="form-note full">FA uvidia iba administrátori a klient v portáli ambulancie.</p>`}
        </fieldset>
      ` : `<p class="form-note full">Fakturácia: ${isDeviceInvoiced(device) ? "zariadenie je fakturované" : "zatiaľ nefakturované"}. Detail FA vidí iba administrátor a klient.</p>`}
      <button class="primary-action full" type="submit">${id ? "Uložiť zmeny" : "Uložiť zariadenie"}</button>
    </form>
  `, (modal) => {
    bindClientPickers(modal);
    qs("#deviceForm", modal).addEventListener("submit", saveDevice);
  });
}

function openInventoryForm(id = "") {
  if (!isAdmin()) return;
  const item = id ? byId("inventory", id) : {};
  openModal(id ? `Upraviť sklad: ${item.name}` : "Pridať skladovú položku", `
    <form class="form-grid" id="inventoryForm" data-edit-id="${id}">
      ${input("name", "Názov položky", "Servisný diel", "text", item.name || "")}
      <label><span>Výrobca</span><select name="manufacturer">
        ${manufacturers.map((name) => `<option ${name === item.manufacturer ? "selected" : ""}>${name}</option>`).join("")}
      </select></label>
      <label><span>Typ položky</span><select name="itemType">
        ${inventoryCategories.map((name) => `<option ${name === item.itemType ? "selected" : ""}>${name}</option>`).join("")}
      </select></label>
      ${input("sku", "SKU", "SKU-001", "text", item.sku || "")}
      ${input("category", "Kategória", "Servis", "text", item.category || "")}
      ${input("qty", "Množstvo", "0", "number", item.qty ?? 0)}
      ${input("min", "Minimum", "0", "number", item.min ?? 0)}
      ${input("reserved", "Rezervované", "0", "number", item.reserved ?? 0)}
      ${input("location", "Umiestnenie", "Sklad Prešov / regál A1", "text", item.location || "", false)}
      <label class="full"><span>Kompatibilita</span><textarea name="compatibility" placeholder="Napríklad Vatech Green, A-dec 500, Dürr VistaScan...">${escapeHtml(item.compatibility || "")}</textarea></label>
      <label class="full"><span>Poznámka</span><textarea name="note">${escapeHtml(item.note || "")}</textarea></label>
      <button class="primary-action full" type="submit">${id ? "Uložiť zmeny" : "Uložiť položku"}</button>
    </form>
  `, (modal) => qs("#inventoryForm", modal).addEventListener("submit", saveInventory));
}

function openBulkInventoryForm() {
  if (!isAdmin()) return;
  openModal("Pridať viac skladových položiek", `
    <form class="form-grid" id="bulkInventoryForm">
      <label><span>Predvolený výrobca</span><select name="manufacturer">
        ${manufacturers.map((name) => `<option>${name}</option>`).join("")}
      </select></label>
      <label><span>Predvolený typ</span><select name="itemType">
        ${inventoryCategories.map((name) => `<option>${name}</option>`).join("")}
      </select></label>
      ${input("category", "Predvolená kategória", "Servis", "text", "Servis")}
      ${input("location", "Predvolené umiestnenie", "Sklad Prešov / regál A1", "text", "", false)}
      ${input("min", "Predvolené minimum", "0", "number", 0)}
      <label class="full">
        <span>Položky</span>
        <textarea name="itemsText" rows="10" placeholder="Názov; SKU; Množstvo; Minimum; Rezervované; Výrobca; Typ; Kategória; Umiestnenie; Kompatibilita; Poznámka" required></textarea>
      </label>
      <p class="form-note full">Každý riadok vytvorí jednu položku. Stačí vyplniť názov a množstvo, ostatné hodnoty sa doplnia z predvolených polí. Podporované sú riadky oddelené bodkočiarkou, tabulátorom alebo čiarkou.</p>
      <button class="primary-action full" type="submit">Uložiť položky</button>
    </form>
  `, (modal) => qs("#bulkInventoryForm", modal).addEventListener("submit", saveBulkInventory));
}

function openServiceForm(id = "") {
  const item = id ? byId("service", id) : null;
  if (id && !canAccessService(item)) {
    alert("Túto servisnú úlohu nemôžete upravovať.");
    return;
  }
  const selectedTechnicianId = item?.technicianId || (isAdmin() ? (session?.id || technicianAssignableUsers()[0]?.id || "") : session?.id);
  const technicianField = isAdmin()
    ? `<label><span>Technik</span><select name="technicianId">${technicianAssignableUsers().map((user) => `<option value="${user.id}" ${user.id === selectedTechnicianId ? "selected" : ""}>${user.name}</option>`).join("")}</select></label>`
    : `<label><span>Technik</span><select disabled><option>${session?.name || "Prihlásený technik"}</option></select><input type="hidden" name="technicianId" value="${escapeHtml(session?.id || "")}"></label>`;
  openModal(id ? "Upraviť servisnú úlohu" : "Pridať servisnú úlohu", `
    <form class="form-grid" id="serviceForm" data-edit-id="${escapeHtml(id)}">
      ${clientPicker(item?.clientId || "")}
      <label><span>Zariadenie</span><select name="deviceId"><option value="">Najprv vyberte ambulanciu</option></select></label>
      ${input("title", "Názov úlohy", "Servisná úloha", "text", item?.title || "")}
      ${technicianField}
      <label><span>Priorita</span><select name="priority">${["Stredná", "Vysoká", "Nízka"].map((priority) => `<option ${priority === (item?.priority || "Stredná") ? "selected" : ""}>${priority}</option>`).join("")}</select></label>
      <label><span>Stav</span><select name="state">${serviceStates.map((stateName) => `<option ${stateName === (item?.state || "Naplánovaná") ? "selected" : ""}>${stateName}</option>`).join("")}</select></label>
      ${input("due", "Termín", "", "date", item?.due || "")}
      <button class="primary-action full" type="submit">${id ? "Uložiť zmeny" : "Uložiť úlohu"}</button>
    </form>
  `, (modal) => {
    bindClientPickers(modal);
    initServiceDevicePicker(qs("#serviceForm", modal), item?.deviceId || "");
    qs("#serviceForm", modal).addEventListener("submit", saveService);
  });
}

function initServiceDevicePicker(form, selectedDeviceId = "") {
  const clientInput = qs("[name='clientSearch']", form);
  const clientIdInput = qs("[name='clientId']", form);
  const deviceSelect = qs("[name='deviceId']", form);
  const updateDevices = () => {
    const clientId = clientIdInput.value || findClientByTypedValue(clientInput.value)?.id || "";
    const devices = state.devices.filter((device) => device.clientId === clientId);
    deviceSelect.innerHTML = devices.length
      ? devices.map((device) => `<option value="${device.id}" ${device.id === selectedDeviceId ? "selected" : ""}>${deviceLabel(device)}</option>`).join("")
      : `<option value="">Žiadne zariadenie pre vybranú ambulanciu</option>`;
    deviceSelect.disabled = !devices.length;
  };
  clientInput.addEventListener("input", updateDevices);
  clientIdInput.addEventListener("change", updateDevices);
  updateDevices();
}

function deviceSearchText(device) {
  return [
    device.serial,
    device.brand,
    device.model,
    device.type,
    device.location,
    device.status,
    clientName(device.clientId)
  ].filter(Boolean).join(" ").toLowerCase();
}

function isDeviceSelectableForPacket(device, clientId) {
  return Boolean(device && (device.clientId === clientId || isStockDevice(device)));
}

function initDocumentPacketDevicePicker(form) {
  const clientInput = qs("[name='clientSearch']", form);
  const clientIdInput = qs("[name='clientId']", form);
  const deviceSearchInput = qs("[name='deviceSearch']", form);
  const results = qs("[data-device-search-results]", form);
  const selectedList = qs("[data-selected-packet-devices]", form);
  const selectedIds = new Set();

  const renderSelected = () => {
    selectedList.innerHTML = selectedIds.size
      ? [...selectedIds].map((id) => {
        const device = byId("devices", id);
        if (!device) return "";
        return `
          <div class="selected-device-chip">
            <input type="hidden" name="deviceIds" value="${device.id}">
            <span>${deviceLabel(device)}</span>
            <button class="icon-button" type="button" data-remove-packet-device="${device.id}" aria-label="Odobrať zariadenie">×</button>
          </div>
        `;
      }).join("")
      : `<small>Zatiaľ nie je vybrané žiadne zariadenie.</small>`;
    qsa("[data-remove-packet-device]", selectedList).forEach((button) => {
      button.addEventListener("click", () => {
        selectedIds.delete(button.dataset.removePacketDevice);
        renderSelected();
        renderResults();
      });
    });
  };

  const clearDevices = () => {
    selectedIds.clear();
    deviceSearchInput.value = "";
    renderSelected();
  };

  const renderResults = () => {
    const clientId = clientIdInput.value || findClientByTypedValue(clientInput.value)?.id || "";
    const term = deviceSearchInput.value.trim().toLowerCase();
    const devices = state.devices
      .filter((device) => isDeviceSelectableForPacket(device, clientId))
      .filter((device) => !selectedIds.has(device.id))
      .filter((device) => !term || deviceSearchText(device).includes(term))
      .slice(0, 8);

    if (!clientId) {
      results.innerHTML = `<small>Najprv vyberte ambulanciu.</small>`;
      return;
    }
    if (!devices.length) {
      results.innerHTML = `<small>Žiadne zariadenie pre zadané SN alebo text.</small>`;
      return;
    }
    results.innerHTML = devices.map((device) => `
      <button class="search-result-button" type="button" data-pick-packet-device="${device.id}">
        <strong>${deviceLabel(device)}</strong>
        <small>${isStockDevice(device) ? "Voľné zariadenie zo skladu" : clientName(device.clientId)}${device.type ? ` - ${device.type}` : ""}${device.location ? ` - ${device.location}` : ""}</small>
      </button>
    `).join("");
    qsa("[data-pick-packet-device]", results).forEach((button) => {
      button.addEventListener("click", () => {
        const device = byId("devices", button.dataset.pickPacketDevice);
        if (!device) return;
        selectedIds.add(device.id);
        deviceSearchInput.value = "";
        renderSelected();
        renderResults();
      });
    });
  };

  clientInput.addEventListener("input", () => {
    clearDevices();
    renderResults();
  });
  clientIdInput.addEventListener("change", () => {
    clearDevices();
    renderResults();
  });
  deviceSearchInput.addEventListener("input", () => {
    renderResults();
  });
  renderSelected();
  renderResults();
}

function openDocumentPacketForm() {
  openModal("Nový podpisový balík", `
    <form class="form-grid" id="documentPacketForm">
      ${input("title", "Názov", "Inštalácia zariadenia", "text", "Inštalácia zariadenia")}
      <label><span>Typ</span><select name="kind" id="packetKind">
        <option>Inštalácia</option>
        <option>Demontáž</option>
        <option>Servis</option>
      </select></label>
      ${clientPicker("", true)}
      <label class="full device-search-field">
        <span>Zariadenie</span>
        <input name="deviceSearch" type="search" placeholder="Po výbere ambulancie píšte SN, model, typ alebo umiestnenie...">
        <div class="search-result-list" data-device-search-results></div>
        <div class="selected-device-list" data-selected-packet-devices></div>
      </label>
      ${input("due", "Termín podpisu", "", "date", "", false)}
      <label><span>Stav</span><select name="state"><option>Pripravené</option><option>Na podpis</option><option>Podpísané</option></select></label>
      <fieldset class="full checklist">
        <legend>Dokumenty</legend>
        ${state.documentTemplates.map((template) => `
          <label>
            <input type="checkbox" name="templateIds" value="${template.id}" ${template.id !== "tpl3" ? "checked" : ""}>
            <span>${template.name}</span>
          </label>
        `).join("")}
      </fieldset>
      <label class="full"><span>Poznámka</span><textarea name="note" placeholder="Napríklad kto bude podpisovať, čo treba pripraviť..."></textarea></label>
      <button class="primary-action full" type="submit">Vytvoriť balík</button>
    </form>
  `, (modal) => {
    const form = qs("#documentPacketForm", modal);
    bindClientPickers(modal);
    initDocumentPacketDevicePicker(form);
    qs("#packetKind", modal).addEventListener("change", (event) => {
      qsa("[name='templateIds']", modal).forEach((checkbox) => {
        checkbox.checked = event.target.value === "Demontáž" ? checkbox.value === "tpl3" : checkbox.value !== "tpl3";
      });
    });
    form.addEventListener("submit", saveDocumentPacket);
  });
}

function openHandoverPacketWorkflow(packetId) {
  const packet = findDocumentRecord(packetId);
  if (!packet || !canSignHandoverPacket(packet)) {
    alert("Tento podpisový balík sa nedá podpísať.");
    return;
  }
  const firstDeviceId = packet.deviceId || packet.deviceIds?.[0] || getClientDevices(packet.clientId)[0]?.id;
  if (!firstDeviceId) {
    alert("Tento podpisový balík nemá priradené zariadenie ani ambulancia nemá žiadne zariadenie.");
    return;
  }
  openHandoverWorkflow(firstDeviceId, packet.id);
}

function openHandoverWorkflow(deviceId, packetId = "") {
  const initialDevice = byId("devices", deviceId);
  if (!initialDevice) return;
  const packet = packetId ? findDocumentRecord(packetId) : null;
  const client = byId("clients", packet?.clientId || initialDevice.clientId);
  if (!client) {
    alert("Najprv vytvorte podpisový balík a vyberte ambulanciu, ku ktorej sa zariadenie odovzdá.");
    return;
  }
  const packetDeviceIds = new Set(packet?.deviceIds?.length ? packet.deviceIds : (packet?.deviceId ? [packet.deviceId] : [deviceId]));
  const clientDevices = [
    ...getClientDevices(client.id),
    ...[...packetDeviceIds]
      .map((id) => byId("devices", id))
      .filter((device) => device && isStockDevice(device)),
  ].filter((device, index, list) => list.findIndex((item) => item.id === device.id) === index);
  const today = new Date().toISOString().slice(0, 10);
  const handoverDate = packet?.due || packet?.date || today;

  openModal(`Podpis dokumentov: ${client.name}`, `
    <form class="handover-flow" id="handoverForm" data-client-id="${client.id}" data-initial-device-id="${deviceId}" data-packet-id="${escapeHtml(packetId)}">
      <section class="profile-card">
        <h3>Odovzdávané zariadenia</h3>
        <div class="device-checklist">
          ${clientDevices.map((device) => `
            <div class="device-check-item">
              <label>
                <input type="checkbox" name="deviceIds" value="${device.id}" ${packetDeviceIds.has(device.id) ? "checked" : ""}>
                <span>${deviceLabel(device)}</span>
              </label>
              <label>
                <span>Záruka</span>
                <input name="warranty-${device.id}" type="text" value="${device.warrantyText || defaultWarrantyForDevice(device)}" placeholder="napr. 12 mesiacov">
              </label>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="form-grid">
        ${input("handoverDate", "Dátum odovzdania", "", "date", handoverDate)}
        ${input("trainedPerson", "Školený pracovník", "Meno pracovníka ambulancie", "text", client.contact || "", false)}
        <label><span>Podpisujúci technik</span><input name="trainer" type="text" value="${escapeHtml(session?.name || "")}" readonly></label>
        <section class="additional-technicians full" data-additional-technicians>
          <div class="panel-header">
            <h3>Ďalší technici</h3>
            <button class="ghost-action" type="button" data-add-technician>Pridať technika</button>
          </div>
          <div class="additional-technician-list" data-additional-technician-list></div>
          <datalist id="technicianNameOptions">
            ${technicianAssignableUsers().map((user) => `<option value="${escapeHtml(user.name)}"></option>`).join("")}
          </datalist>
        </section>
        <label class="full"><span>Poznámka k odovzdaniu</span><textarea name="note" placeholder="Doplňte odovzdané príslušenstvo, stav pracoviska alebo špeciálne pokyny.">${escapeHtml(packet?.note || "")}</textarea></label>
      </section>
      <section class="signature-pad-grid">
        ${signaturePad("client", "Podpis klienta / školeného pracovníka")}
        ${signaturePad("technician", "Podpis servisného technika")}
      </section>
      <section class="document-preview" data-handover-preview></section>
      <div class="button-row">
        <button class="secondary-action" type="button" data-refresh-handover-preview>Obnoviť náhľad</button>
        <button class="ghost-action" type="button" data-print-handover-preview>Otvoriť pre tlač</button>
        <button class="primary-action" type="submit">Podpísať, odovzdať a uložiť</button>
      </div>
    </form>
  `, (modal) => {
    const form = qs("#handoverForm", modal);
    const update = () => updateHandoverPreview(form);
    initSignaturePads(form, update);
    initAdditionalTechnicians(form, update);
    update();
    qsa("input, textarea", form).forEach((field) => field.addEventListener("input", update));
    qsa("[name='deviceIds']", form).forEach((field) => field.addEventListener("change", update));
    qs("[data-refresh-handover-preview]", form).addEventListener("click", update);
    qs("[data-print-handover-preview]", form).addEventListener("click", () => printHandoverPreview(form));
    form.addEventListener("submit", saveHandover);
  });
}

function defaultWarrantyForDevice(device) {
  const text = `${device.type || ""} ${device.model || ""} ${device.brand || ""}`.toLowerCase();
  if (text.includes("cbct") || text.includes("ct")) return "60 mesiacov";
  if (text.includes("opg") || text.includes("rtg") || text.includes("rvg") || text.includes("senzor")) return "12 mesiacov";
  if (text.includes("súprava") || text.includes("kreslo") || text.includes("a-dec")) return "24 mesiacov";
  return "24 mesiacov";
}

function signaturePad(id, label) {
  return `
    <section class="signature-pad" data-signature-pad="${id}">
      <div class="panel-header">
        <h3>${label}</h3>
        <button class="ghost-action" type="button" data-clear-signature="${id}">Vymazať</button>
      </div>
      <canvas width="680" height="190" aria-label="${label}"></canvas>
      <input type="hidden" name="signature-${id}">
    </section>
  `;
}

function initSignaturePads(scope, onChange) {
  qsa("[data-signature-pad]", scope).forEach((pad) => {
    const canvas = qs("canvas", pad);
    const hidden = qs("input[type='hidden']", pad);
    const context = canvas.getContext("2d");
    let drawing = false;
    let hasInk = false;

    context.lineWidth = 2.4;
    context.lineCap = "round";
    context.strokeStyle = "#13252d";

    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      const source = event.touches?.[0] || event;
      return {
        x: (source.clientX - rect.left) * (canvas.width / rect.width),
        y: (source.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const start = (event) => {
      event.preventDefault();
      drawing = true;
      const p = point(event);
      context.beginPath();
      context.moveTo(p.x, p.y);
      context.lineTo(p.x + 0.1, p.y + 0.1);
      context.stroke();
      hasInk = true;
      hidden.value = canvas.toDataURL("image/png");
      onChange?.();
    };

    const move = (event) => {
      if (!drawing) return;
      event.preventDefault();
      const p = point(event);
      context.lineTo(p.x, p.y);
      context.stroke();
      hasInk = true;
      hidden.value = canvas.toDataURL("image/png");
      onChange?.();
    };

    const end = () => {
      if (!drawing) return;
      drawing = false;
      hidden.value = hasInk ? canvas.toDataURL("image/png") : "";
      onChange?.();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    qs(`[data-clear-signature="${pad.dataset.signaturePad}"]`, pad).addEventListener("click", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      hasInk = false;
      hidden.value = "";
      onChange?.();
    });
  });
}

function initAdditionalTechnicians(scope, onChange) {
  const list = qs("[data-additional-technician-list]", scope);
  const button = qs("[data-add-technician]", scope);
  if (!list || !button) return;
  button.addEventListener("click", () => {
    addAdditionalTechnicianRow(list, onChange);
    onChange?.();
  });
}

function addAdditionalTechnicianRow(list, onChange) {
  const row = document.createElement("div");
  row.className = "additional-technician-row";
  row.innerHTML = `
    <label>
      <span>Technik bez podpisu</span>
      <input name="additionalTechnicians" list="technicianNameOptions" type="text" placeholder="Meno ďalšieho technika">
    </label>
    <button class="ghost-action" type="button" data-remove-technician>Odobrať</button>
  `;
  qs("input", row).addEventListener("input", () => onChange?.());
  qs("[data-remove-technician]", row).addEventListener("click", () => {
    row.remove();
    onChange?.();
  });
  list.append(row);
  qs("input", row).focus();
}

function selectedHandoverDevices(form) {
  return qsa("[name='deviceIds']:checked", form)
    .map((input) => {
      const device = byId("devices", input.value);
      if (!device) return null;
      return {
        ...device,
        handoverWarranty: qs(`[name='warranty-${device.id}']`, form)?.value || defaultWarrantyForDevice(device),
      };
    })
    .filter(Boolean);
}

function handoverValues(form) {
  const values = formValues(form);
  const additionalTechnicians = qsa("[name='additionalTechnicians']", form)
    .map((input) => input.value.trim())
    .filter(Boolean);
  return {
    client: byId("clients", form.dataset.clientId),
    devices: selectedHandoverDevices(form),
    date: values.handoverDate,
    trainedPerson: values.trainedPerson || "",
    trainer: values.trainer || session?.name || "",
    additionalTechnicians,
    note: values.note || "",
    protocolNumber: values.protocolNumber || "",
    signatures: {
      client: values["signature-client"] || "",
      technician: values["signature-technician"] || "",
    },
  };
}

function handoverDocumentsHtml(data) {
  const additionalTechniciansText = (data.additionalTechnicians || []).length
    ? data.additionalTechnicians.join(", ")
    : "Bez ďalších technikov";
  const emptyDeviceRows = Array.from({ length: Math.max(0, 12 - data.devices.length) }, () => `
    <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
  `).join("");
  const deviceRows = data.devices.map((device) => `
    <tr>
      <td>${device.type || "Zariadenie"} ${device.brand || ""} ${device.model || ""}</td>
      <td>${device.serial || "Doplniť"}</td>
      <td>${device.handoverWarranty || defaultWarrantyForDevice(device)}</td>
      <td>1</td>
    </tr>
  `).join("");
  const trainingRows = [
    `<tr><td>${data.trainedPerson || "Doplniť"}</td><td>Doktor/Sestra</td><td>${signatureOnly(data.signatures.client, "Podpis školeného pracovníka")}</td></tr>`,
    ...Array.from({ length: 11 }, () => "<tr><td>&nbsp;</td><td></td><td></td></tr>")
  ].join("");

  return `
    <article class="generated-document dentall-document">
      ${dentallDocumentHeader()}
      <h1>ZÁRUČNÝ LIST, ODOVZDÁVACÍ<br>A PREBERACÍ PROTOKOL</h1>
      <p class="protocol-number-line">Číslo protokolu: <strong>${data.protocolNumber || "bude pridelené pri uložení"}</strong></p>
      <table class="document-table protocol-table">
        <thead><tr><th>Odovzdávané zariadenia</th><th>Výrobné číslo</th><th>Záruka</th><th>ks</th></tr></thead>
        <tbody>${deviceRows}${emptyDeviceRows}</tbody>
      </table>
      <section class="document-legal">
        <h2>Záručné podmienky:</h2>
        <p>Prístroje boli odborne zmontované, nainštalované a uvedené do prevádzky. Obsluha bola zaškolená a informovaná o údržbe. K uvedeným prístrojom boli odovzdané používateľské manuály.</p>
        <p>Dodávateľ poskytuje záruku na poruchy spôsobené vadami materiálu alebo výrobnými vadami počas záručnej doby uvedenej v tabuľke od dátumu predaja výrobku. Písomný záznam o poruche musí byť vystavený v priebehu trvania záruky.</p>
        <p>Záruka sa nevzťahuje na poruchy vzniknuté nesprávnou údržbou, nesprávnym používaním, používaním na účely, pre ktoré nie je zariadenie určené, ani na opravy vykonané osobou, ktorá nebola určená dodávateľom. Nevzťahuje sa ani na poruchy vzniknuté v dôsledku nehôd a živelných pohrôm.</p>
        <p>Elektrická inštalácia, na ktorú je zariadenie pripojené, podlieha vykonaniu východzej revízie podľa príslušných noriem. Revízia nie je súčasťou dodávateľských prác.</p>
        <h2>Osvedčenie:</h2>
        <p>Výrobky sú vyrobené podľa výrobnej dokumentácie a schválených technických podmienok. Použité materiály sú zhodné s výrobnými predpismi a technickými podmienkami. Výrobky sú kompletné a vyhovujú všetkým predpísaným podmienkam.</p>
      </section>
      <section class="document-fields-grid">
        <div><mark>Dátum predaja/dodania:</mark><strong>${formatDate(data.date)}</strong></div>
        <div><mark>Odberateľ:</mark><strong>${data.client.name}</strong><span>${clientAddress(data.client)}</span></div>
        <div><b>Servisný Technik:</b><strong>${data.trainer || "Doplniť"}</strong></div>
        <div><b>Zaškolený personál:</b><strong>${data.trainedPerson || "Doplniť"}</strong></div>
        <div><b>Ďalší technici:</b><strong>${additionalTechniciansText}</strong></div>
      </section>
      <div class="signature-grid protocol-signatures">
        ${signaturePreview(data.signatures.technician, "podpis predajcu")}
        ${signaturePreview(data.signatures.client, "podpis zákazníka a pečiatka")}
      </div>
      <footer class="sewa-note">
        <span class="waste-symbol">X</span>
        <p>Spoločnosť DentAll s.r.o. spolupracuje v oblasti kolektívneho systému zabezpečujúceho zber, dopravu a spracovanie odpadu z elektrických a elektronických zariadení so spoločnosťou SEWA.</p>
      </footer>
    </article>
    <article class="generated-document dentall-document training-document">
      ${dentallDocumentHeader()}
      <h1>Záznam o školení na<br>prácu s RTG</h1>
      <table class="document-table training-device-table">
        <thead><tr><th>Zariadenie</th><th>Výrobné číslo</th></tr></thead>
        <tbody>${data.devices.map((device) => `<tr><td>${device.type || "Zariadenie"} ${device.brand || ""} ${device.model || ""}</td><td>${device.serial || "Doplniť"}</td></tr>`).join("")}</tbody>
      </table>
      <section class="training-copy">
        <p>Obsluha bola zaškolená na prácu s RTG zariadeniami.</p>
        <p>Školenie prebehlo na pracovisku RTG na adrese: <strong>${clientAddress(data.client)}</strong></p>
        <p>Obsah školenia: práca so zariadením (hardware, software), polohovanie pacienta, výber typu expozície, zásady ochrany pacienta, zásady ochrany obsluhy pred žiarením.</p>
        <h2>Prehlásenie personálu:</h2>
        <p>Prehlasujem, že som bol riadne zaškolený na prácu s RTG uvedeného typu a bol som oboznámený so všetkými vecami potrebnými na následné bezpečné vykonávanie expozície na pacientoch. Všetkému som rozumel a tento súhlas potvrdzujem podpisom:</p>
      </section>
      <table class="document-table training-sign-table">
        <thead><tr><th>Meno školeného pracovníka</th><th>Pracovné zaradenie</th><th>Podpis školeného pracovníka</th></tr></thead>
        <tbody>${trainingRows}</tbody>
      </table>
      <section class="training-footer">
        <p><strong>Dátum školenia:</strong> ${formatDate(data.date)}</p>
        <p>Školiteľ: ${data.trainer || "Doplniť"}</p>
        <p>Ďalší technici: ${additionalTechniciansText}</p>
        <p>Firma: Dentall, s.r.o., Strojnická 18, 08006 Prešov</p>
        ${signaturePreview(data.signatures.technician, "Podpis servisného technika")}
      </section>
    </article>
  `;
}

function dentallDocumentHeader() {
  return `
    <header class="dentall-document-header">
      <div class="dentall-logo"><span>Dent</span><strong>All</strong><small>KOMPLEXNÉ VYBAVENIE STOMATOLOGICKEJ AMBULANCIE</small></div>
      <div class="dentall-contact">
        <p><strong>BRATISLAVA :</strong> Sch. Trnavského 8, 841 01 Bratislava, 0905 299 319</p>
        <p><strong>PREŠOV :</strong> Strojnická 18, 080 06 Prešov, 051/ 758 2006</p>
        <p>ičo: 36486761, SK2020015470, e-mail: dentall@dentall.sk</p>
      </div>
    </header>
  `;
}

function signaturePreview(src, label) {
  return `
    <div class="signature-preview">
      ${src ? `<img src="${src}" alt="${label}">` : ""}
      <span>${label}</span>
    </div>
  `;
}

function signatureOnly(src, label) {
  return `
    <div class="signature-only">
      ${src ? `<img src="${src}" alt="${label}">` : ""}
    </div>
  `;
}

function updateHandoverPreview(form) {
  const preview = qs("[data-handover-preview]", form);
  const data = handoverValues(form);
  preview.innerHTML = data.devices.length
    ? handoverDocumentsHtml(data)
    : `<div class="empty-state">Vyberte aspoň jedno zariadenie.</div>`;
}

function printHandoverPreview(form) {
  const data = handoverValues(form);
  if (!data.devices.length) {
    alert("Vyberte aspoň jedno zariadenie.");
    return;
  }
  const popup = window.open("", "_blank");
  if (!popup) {
    alert("Prehliadač zablokoval otvorenie okna pre tlač.");
    return;
  }
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <title>Odovzdanie - ${escapeHtml(data.client.name)}</title>
      <link rel="stylesheet" href="styles.css">
      <style>body{background:#fff;padding:24px}.generated-document{break-after:page;box-shadow:none}</style>
    </head>
    <body>${handoverDocumentsHtml(data)}</body>
    </html>
  `);
  popup.document.close();
}

function openServiceProtocolWorkflow(serviceId) {
  const service = byId("service", serviceId);
  if (!service) return;
  if (!canAccessService(service)) {
    alert("Túto servisnú úlohu môže otvoriť iba priradený technik alebo administrátor.");
    return;
  }
  const client = byId("clients", service.clientId);
  const device = byId("devices", service.deviceId);
  const technician = byId("users", service.technicianId) || session;
  const today = new Date().toISOString().slice(0, 10);

  openModal(`Servisný protokol: ${clientName(service.clientId)}`, `
    <form class="handover-flow" id="serviceProtocolForm" data-service-id="${service.id}">
      <section class="form-grid">
        ${input("serviceDate", "Dátum vykonania opravy", "", "date", today)}
        ${input("doctorName", "Meno a priezvisko lekára", "Kontakt ambulancie", "text", client?.contact || "", false)}
        ${input("doctorEmail", "E-mail", "email ambulancie", "email", client?.email || "", false)}
        ${input("doctorPhone", "Telefón", "telefón ambulancie", "text", client?.phone || "", false)}
        <label><span>Záručná oprava</span><select name="warrantyRepair"><option>NIE</option><option>ÁNO</option></select></label>
        ${input("arrivalDeparture", "Príchod / odchod", "08:00 - 10:30", "text", "", false)}
        ${input("totalTime", "Celkový čas servisných prác", "napr. 2 hod.", "text", "", false)}
        ${input("workRate", "Cena práce 08:00 - 16:00 bez DPH", "40", "text", "40", false)}
        ${input("workRateVat", "Cena práce 08:00 - 16:00 s DPH", "48", "text", "48", false)}
        ${input("afterHoursRate", "Cena práce mimo pracovného času bez DPH", "80", "text", "80", false)}
        ${input("afterHoursRateVat", "Cena práce mimo pracovného času s DPH", "96", "text", "96", false)}
        ${input("travelFee", "Cestovné náklady / paušál", "0", "text", "0", false)}
        ${input("totalPrice", "Celková cena servisných prác s DPH", "0", "text", "0", false)}
        <label class="full"><span>Vykonaná kontrola a zistený stav</span><textarea name="inspection" placeholder="Zistený stav zariadenia a pracoviska."></textarea></label>
        <label class="full"><span>Špecifikácia, typ, výrobné číslo</span><textarea name="specification">${escapeHtml(`${device?.type || ""} ${device?.brand || ""} ${device?.model || ""} SN ${device?.serial || ""}`.trim())}</textarea></label>
        <label class="full"><span>Popis vykonanej práce</span><textarea name="workDescription" placeholder="Popíšte vykonaný servisný zásah."></textarea></label>
        <label class="full"><span>Náhradné diely</span><textarea name="parts" placeholder="Názov dielu | ks | cena bez DPH | cena s DPH"></textarea></label>
      </section>
      <section class="signature-pad-grid">
        ${signaturePad("technician", "Podpis servisného technika")}
        ${signaturePad("client", "Podpis klienta")}
      </section>
      <section class="document-preview" data-service-protocol-preview></section>
      <div class="button-row">
        <button class="secondary-action" type="button" data-refresh-service-protocol-preview>Obnoviť náhľad</button>
        <button class="ghost-action" type="button" data-print-service-protocol-preview>Otvoriť pre tlač</button>
        <button class="primary-action" type="submit">Podpísať servisný protokol</button>
      </div>
    </form>
  `, (modal) => {
    const form = qs("#serviceProtocolForm", modal);
    const update = () => updateServiceProtocolPreview(form);
    initSignaturePads(form, update);
    update();
    qsa("input, textarea, select", form).forEach((field) => field.addEventListener("input", update));
    qs("[data-refresh-service-protocol-preview]", form).addEventListener("click", update);
    qs("[data-print-service-protocol-preview]", form).addEventListener("click", () => printServiceProtocolPreview(form));
    form.addEventListener("submit", saveServiceProtocol);
  });
}

function serviceProtocolValues(form) {
  const values = formValues(form);
  const service = byId("service", form.dataset.serviceId);
  const client = byId("clients", service.clientId);
  const device = byId("devices", service.deviceId);
  const technician = byId("users", service.technicianId) || session;
  return {
    service,
    client,
    device,
    technician,
    date: values.serviceDate,
    doctorName: values.doctorName || "",
    doctorEmail: values.doctorEmail || "",
    doctorPhone: values.doctorPhone || "",
    warrantyRepair: values.warrantyRepair || "NIE",
    inspection: values.inspection || "",
    specification: values.specification || "",
    workDescription: values.workDescription || "",
    parts: values.parts || "",
    arrivalDeparture: values.arrivalDeparture || "",
    totalTime: values.totalTime || "",
    workRate: values.workRate || "40",
    workRateVat: values.workRateVat || "48",
    afterHoursRate: values.afterHoursRate || "80",
    afterHoursRateVat: values.afterHoursRateVat || "96",
    travelFee: values.travelFee || "0",
    totalPrice: values.totalPrice || "0",
    protocolNumber: values.protocolNumber || "",
    signatures: {
      client: values["signature-client"] || "",
      technician: values["signature-technician"] || "",
    },
  };
}

function serviceProtocolDocumentHtml(data) {
  const partRows = (data.parts || "")
    .split(/\r?\n/)
    .map((line) => line.split("|").map((item) => item.trim()))
    .filter((row) => row.some(Boolean));
  const partsHtml = [
    ...partRows.map((row) => `<tr><td>${row[0] || ""}</td><td>${row[1] || ""}</td><td>${row[2] || ""}</td><td>${row[3] || ""}</td></tr>`),
    ...Array.from({ length: Math.max(0, 5 - partRows.length) }, () => "<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>")
  ].join("");
  const workRows = textRows(data.workDescription, 6);

  return `
    <article class="generated-document dentall-document service-document">
      ${dentallDocumentHeader()}
      <h1>Protokol o prevedených servisných prácach / výjazd /<br>konzultácie / manipulácia</h1>
      <p class="protocol-number-line">Číslo protokolu: <strong>${data.protocolNumber || "bude pridelené pri uložení"}</strong></p>
      <table class="document-table service-protocol-table">
        <tbody>
          <tr><th>Meno a Priezvisko lekára</th><td>${data.doctorName || "Doplniť"}</td><th>email:</th><td>${data.doctorEmail || ""}</td><th>t.č.:</th><td>${data.doctorPhone || ""}</td></tr>
          <tr><th>Záručná oprava</th><td colspan="5" class="center">${data.warrantyRepair}</td></tr>
          <tr><th colspan="6">Vykonaná kontrola a zistený stav</th></tr>
          <tr><td colspan="6" class="large-cell">${data.inspection || "&nbsp;"}</td></tr>
          <tr><th colspan="6">Špecifikácia, typ, výrobné číslo</th></tr>
          <tr><td colspan="6" class="large-cell">${data.specification || "&nbsp;"}</td></tr>
        </tbody>
      </table>
      <table class="document-table service-work-table">
        <thead><tr><th colspan="2">Popis vykonanej práce</th></tr></thead>
        <tbody>${workRows}</tbody>
      </table>
      <table class="document-table service-parts-table">
        <thead><tr><th>Náhradné diely</th><th>ks</th><th>cena bez DPH</th><th>cena spolu s DPH</th></tr></thead>
        <tbody>${partsHtml}</tbody>
      </table>
      <table class="document-table service-summary-table">
        <tbody>
          <tr><th>Príchod / odchod</th><td>${data.arrivalDeparture || ""}</td></tr>
          <tr><th>Dátum vykonania opravy</th><td>${formatDate(data.date)}</td></tr>
          <tr><th>Celkový čas servisných prác</th><td>${data.totalTime || ""}</td></tr>
        </tbody>
      </table>
      <section class="service-price-copy">
        <p>V pracovných dňoch v čase od 08:00 - 16:00 hod firma DentAll,s.r.o. účtuje za každú začatú hodinu práce ${data.workRate},- EUR bez DPH, ${data.workRateVat} EUR s DPH.</p>
        <p>V čase od 16:00 - 20:00 hod a v dňoch pracovného voľna firma DentAll,s.r.o. účtuje za každú začatú hodinu práce ${data.afterHoursRate},- EUR bez DPH, ${data.afterHoursRateVat} EUR s DPH.</p>
      </section>
      <table class="document-table service-summary-table">
        <tbody>
          <tr><th>Cestovné náklady / paušál</th><td>${data.travelFee} EUR</td></tr>
          <tr><th>Celková cena servisných prác v EUR s DPH</th><td>${data.totalPrice} EUR</td></tr>
          <tr><th>Prácu vykonal / tel.číslo</th><td>${data.technician?.name || ""} ${data.technician?.phone || ""}</td></tr>
        </tbody>
      </table>
      <div class="signature-grid protocol-signatures">
        ${signaturePreview(data.signatures.technician, "podpis servisného technika")}
        ${signaturePreview(data.signatures.client, "podpis klienta")}
      </div>
    </article>
  `;
}

function requiredServiceProtocolFields(data) {
  const required = [
    ["Dátum opravy", data.date],
    ["Lekár/kontakt", data.doctorName],
    ["Zistený stav", data.inspection],
    ["Špecifikácia zariadenia", data.specification],
    ["Popis práce", data.workDescription],
    ["Príchod / odchod", data.arrivalDeparture],
    ["Celkový čas", data.totalTime],
    ["Cena práce", data.workRate],
    ["Cestovné / paušál", data.travelFee],
    ["Celková cena", data.totalPrice],
  ];
  return required.filter(([, value]) => !String(value || "").trim()).map(([label]) => label);
}

function textRows(text, count) {
  const rows = (text || "").split(/\r?\n/).filter(Boolean);
  return Array.from({ length: Math.max(count, rows.length) }, (_, index) => `
    <tr><td>${rows[index] || "&nbsp;"}</td></tr>
  `).join("");
}

function updateServiceProtocolPreview(form) {
  qs("[data-service-protocol-preview]", form).innerHTML = serviceProtocolDocumentHtml(serviceProtocolValues(form));
}

function printServiceProtocolPreview(form) {
  const data = serviceProtocolValues(form);
  const popup = window.open("", "_blank");
  if (!popup) {
    alert("Prehliadač zablokoval otvorenie okna pre tlač.");
    return;
  }
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <title>Servisný protokol - ${escapeHtml(data.client.name)}</title>
      <link rel="stylesheet" href="styles.css">
      <style>body{background:#fff;padding:24px}.generated-document{break-after:page;box-shadow:none}</style>
    </head>
    <body>${serviceProtocolDocumentHtml(data)}</body>
    </html>
  `);
  popup.document.close();
}

function findSignedDocument(id) {
  const packet = state.documentPackets.find((item) => item.id === id);
  if (packet && canOpenSignedDocument(packet) && canAccessSignedDocument(packet)) return packet;
  for (const device of state.devices) {
    const record = (device.documentRecords || []).find((item) => item.id === id && canOpenSignedDocument(item) && canAccessSignedDocument(item));
    if (record) return record;
  }
  for (const service of state.service) {
    const record = (service.documentRecords || []).find((item) => item.id === id && canOpenSignedDocument(item) && canAccessSignedDocument(item));
    if (record) return record;
  }
  return null;
}

function findDocumentRecord(id) {
  const packet = state.documentPackets.find((item) => item.id === id);
  if (packet) return packet;
  for (const device of state.devices) {
    const record = (device.documentRecords || []).find((item) => item.id === id);
    if (record) return record;
  }
  for (const service of state.service) {
    const record = (service.documentRecords || []).find((item) => item.id === id);
    if (record) return record;
  }
  return null;
}

function canOpenSignedDocument(record) {
  return Boolean(record?.renderedHtml || (record?.signatures?.client && record?.signatures?.technician));
}

function canSignHandoverPacket(record) {
  if (!record || record.documentType === "service" || canOpenSignedDocument(record)) return false;
  const stateName = String(record.state || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return ["na podpis", "pripravene"].includes(stateName);
}

function canAccessSignedDocument(record) {
  if (!portalSessionClientId) return true;
  return record?.clientId === portalSessionClientId;
}

function handoverDataFromSignedRecord(record) {
  const client = byId("clients", record.clientId);
  const warrantyByDevice = new Map((record.warranties || []).map((item) => [item.deviceId, item.warranty]));
  const devices = (record.deviceIds || [])
    .map((deviceId) => byId("devices", deviceId))
    .filter(Boolean)
    .map((device) => ({
      ...device,
      handoverWarranty: warrantyByDevice.get(device.id) || record.warranty || device.warrantyText || defaultWarrantyForDevice(device),
    }));
  if (!client || !devices.length || !record.signatures) return null;
  return {
    client,
    devices,
    date: record.date,
    trainedPerson: record.trainedPerson || "",
    trainer: record.trainer || "",
    additionalTechnicians: record.additionalTechnicians || [],
    note: record.note || "",
    signatures: record.signatures,
  };
}

function openSignedDocument(id) {
  const record = findSignedDocument(id);
  if (!record) {
    const existingRecord = findDocumentRecord(id);
    alert(existingRecord
      ? "Tento starší balík nemá uložený podpísaný dokument. Vymažte ho a vytvorte podpis nanovo."
      : "Podpísaný dokument sa nenašiel.");
    return;
  }
  const currentData = record.documentType === "service" ? null : handoverDataFromSignedRecord(record);
  const documentHtml = record.documentType === "service"
    ? record.renderedHtml
    : (currentData ? handoverDocumentsHtml(currentData) : record.renderedHtml);
  const popup = window.open("", "_blank");
  if (!popup) {
    alert("Prehliadač zablokoval otvorenie podpísaného dokumentu.");
    return;
  }
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(record.title || "Podpísaný dokument")}</title>
      <link rel="stylesheet" href="styles.css">
      <style>body{background:#fff;padding:24px}.generated-document{break-after:page;box-shadow:none}</style>
    </head>
    <body>${documentHtml}</body>
    </html>
  `);
  popup.document.close();
}

async function deleteSignedDocument(id) {
  if (!isAdmin()) {
    alert("Vymazanie podpísaného dokumentu môže vykonať iba administrátor.");
    return;
  }
  const record = findDocumentRecord(id);
  const title = record?.title || "podpisový balík";
  if (!record) {
    alert("Podpisový balík sa nenašiel.");
    return;
  }
  if (!confirm(`Naozaj vymazať ${title}? Záznam sa odstráni aj z profilov priradených zariadení.`)) return;

  if (dataMode === "supabase") {
    try {
      await deleteDocumentPacketFromSupabase(record);
      await loadSupabaseDataIntoState();
      addAudit("Vymazaný podpisový dokument online", title);
      qsa(".modal-backdrop").forEach((modal) => modal.remove());
      render();
    } catch (error) {
      alert(`Vymazanie dokumentu zo Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  state.documentPackets = state.documentPackets.filter((packet) => packet.id !== id);
  state.devices.forEach((device) => {
    device.documentRecords = (device.documentRecords || []).filter((item) => item.id !== id);
  });
  state.service.forEach((service) => {
    service.documentRecords = (service.documentRecords || []).filter((item) => item.id !== id);
  });
  addAudit("Vymazaný podpisový dokument", title);
  saveState();
  qsa(".modal-backdrop").forEach((modal) => modal.remove());
  render();
}

function openUserForm(id = "") {
  const user = id ? byId("users", id) : {};
  if (id && !canEditUser(user)) {
    alert("Na úpravu tohto používateľa nemáte oprávnenie.");
    return;
  }
  const editingProtectedSelf = id && user.id === session?.id && user.protected;
  const roleOptions = isSuperAdmin()
    ? ["Technik", "Administrátor", "SuperAdministrátor"]
    : ["Technik"];
  const activeChecked = user.active !== false ? "checked" : "";
  const emailField = dataMode === "supabase" && id && !isSuperAdmin()
    ? `<label><span>E-mail</span><input name="email" type="email" value="${escapeHtml(user.email || "")}" disabled></label><input type="hidden" name="email" value="${escapeHtml(user.email || "")}">`
    : input("email", "E-mail", "meno@dentall.sk", "email", user.email || "", dataMode === "supabase");
  openModal(id ? `Upraviť používateľa: ${user.name}` : "Pridať používateľa", `
    <form class="form-grid" id="userForm" data-edit-id="${id}">
      ${input("name", "Meno", "Nový technik", "text", user.name || "")}
      <label><span>Rola</span><select name="role" ${editingProtectedSelf ? "disabled" : ""}>${roleOptions.map((role) => `<option ${role === user.role ? "selected" : ""}>${role}</option>`).join("")}</select></label>
      ${editingProtectedSelf ? `<input type="hidden" name="role" value="${escapeHtml(user.role)}">` : ""}
      ${emailField}
      ${phoneInput("phone", "Telefón", "0903123456 alebo +421903123456", user.phone || "")}
      ${id ? "" : input("tempPassword", "Dočasné heslo", DEFAULT_PASSWORD, "text", DEFAULT_PASSWORD, true)}
      ${id ? "" : `<p class="form-note full">${dataMode === "supabase" ? "V Supabase režime sa vytvorí prihlasovací účet aj profil používateľa." : "Nový lokálny používateľ dostane toto dočasné heslo."}</p>`}
      <label class="checkline full">
        <input name="active" type="checkbox" value="true" ${activeChecked} ${editingProtectedSelf ? "disabled" : ""}>
        <span>Aktívny používateľ</span>
      </label>
      ${editingProtectedSelf ? `<p class="form-note full">Chránený SuperAdministrátor si môže upraviť meno, e-mail a telefón. Rolu ani aktívnosť musí zmeniť až po určení iného SuperAdministrátora.</p>` : ""}
      <button class="primary-action full" type="submit">Uložiť používateľa</button>
    </form>
  `, (modal) => qs("#userForm", modal).addEventListener("submit", saveUser));
}

function input(name, labelText, placeholder = "", type = "text", value = "", required = true) {
  return `<label><span>${labelText}</span><input name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value || "")}" ${required ? "required" : ""}></label>`;
}

function phoneInput(name, labelText, placeholder = "", value = "", required = false) {
  return `<label><span>${labelText}</span><input name="${name}" type="text" inputmode="tel" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value || "")}" ${required ? "required" : ""}></label>`;
}

function normalizePhoneNumber(value = "") {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  return hasPlus ? `+${digits}` : digits;
}

function hasCustomBillingAddress(client = {}) {
  return Boolean(client.billingName || client.billingStreet || client.billingCity || client.billingZip);
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function selectedClientId(form) {
  const values = formValues(form);
  if (values.clientId) return values.clientId;
  return findClientByTypedValue(values.clientSearch || "")?.id || "";
}

function fileToDataUrl(file) {
  if (!file || !file.size) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function closeCurrentModal(form) {
  form.closest(".modal-backdrop").remove();
}

async function deleteDevice(id, returnClientId = "") {
  const device = byId("devices", id);
  if (!device) return;

  const label = `${deviceName(id)} (${device.serial || "bez SN"})`;
  if (!confirm(`Naozaj vymazať zariadenie ${label}? Odstránia sa aj servisné úlohy a podpisové balíky priradené k tomuto zariadeniu.`)) return;

  if (dataMode === "supabase") {
    try {
      await deleteDeviceFromSupabase(device);
      await loadSupabaseDataIntoState();
      addAudit("Vymazané zariadenie online", label);
      qsa(".modal-backdrop").forEach((modal) => modal.remove());
      render();
      if (returnClientId && byId("clients", returnClientId)) openClientProfile(returnClientId);
    } catch (error) {
      alert(`Vymazanie zariadenia zo Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  state.devices = state.devices.filter((item) => item.id !== id);
  state.service = state.service.filter((item) => item.deviceId !== id);
  state.documentPackets = state.documentPackets.filter((packet) => {
    if (packet.deviceIds?.includes(id)) return false;
    return packet.deviceId !== id;
  });
  saveState();
  qsa(".modal-backdrop").forEach((modal) => modal.remove());
  render();
  if (returnClientId && byId("clients", returnClientId)) openClientProfile(returnClientId);
}

async function deleteInventoryItem(id) {
  if (!isAdmin()) {
    alert("Sklad môže upravovať iba administrátor alebo SuperAdministrátor.");
    return;
  }
  const item = byId("inventory", id);
  if (!item) return;
  if (!confirm(`Naozaj vymazať skladovú položku ${item.name}?`)) return;
  if (dataMode === "supabase") {
    try {
      await deleteInventoryFromSupabase(item);
      await loadSupabaseDataIntoState();
      addAudit("Vymazaná skladová položka online", `${item.name} (${item.sku || "bez SKU"})`);
      render();
    } catch (error) {
      alert(`Vymazanie zo Supabase zlyhalo: ${error.message}`);
    }
    return;
  }
  state.inventory = state.inventory.filter((entry) => entry.id !== id);
  addAudit("Vymazaná skladová položka", `${item.name} (${item.sku || "bez SKU"})`);
  saveState();
  render();
}

async function saveClient(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  const photo = await fileToDataUrl(qs("[name='photoFile']", form)?.files?.[0]);
  delete values.photoFile;
  const customBillingAddress = values.customBillingAddress === "on";
  delete values.customBillingAddress;
  if (!customBillingAddress) {
    values.billingName = "";
    values.billingStreet = "";
    values.billingCity = "";
    values.billingZip = "";
  }
  const editId = event.target.dataset.editId;
  const payload = editId
    ? { ...byId("clients", editId), ...values, ...(photo ? { photo } : {}) }
    : { id: nextId("c", "clients"), status: "Aktívna", photo, ...values };

  if (dataMode === "supabase") {
    try {
      await saveClientToSupabase(payload);
      await loadSupabaseDataIntoState();
      addAudit(editId ? "Upravená ambulancia online" : "Pridaná ambulancia online", payload.name || "Bez názvu");
      closeCurrentModal(form);
      render();
    } catch (error) {
      alert(`Uloženie ambulancie do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  if (editId) {
    const index = state.clients.findIndex((client) => client.id === editId);
    state.clients[index] = payload;
  } else {
    state.clients.push(payload);
  }
  saveState();
  closeCurrentModal(event.target);
  render();
}

async function saveDevice(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  const clientId = selectedClientId(form);
  values.clientId = clientId;
  delete values.clientSearch;
  const photo = await fileToDataUrl(qs("[name='photoFile']", form)?.files?.[0]);
  const invoiceInput = qs("[name='invoiceFile']", form);
  const invoiceFileObject = invoiceInput?.files?.[0];
  const invoiceFile = await fileToDataUrl(invoiceFileObject);
  const invoiceIssuedInput = qs("[name='invoiceIssued']", form);
  delete values.photoFile;
  delete values.invoiceFile;
  const documents = (values.documentsText || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  delete values.documentsText;
  ["type", "brand", "model", "serial", "location"].forEach((key) => {
    values[key] = cleanImportedValue(values[key]);
  });
  if (!values.clientId && !values.status) values.status = "Skladom";
  if (!values.clientId && !["Skladom", "Rezervované", "Vyradené"].includes(values.status)) values.status = "Skladom";
  if (values.clientId && values.status === "Skladom") values.status = "OK";
  const editId = event.target.dataset.editId;
  const duplicateDevice = editId ? null : findDeviceBySerial(values.serial);
  const targetEditId = editId || duplicateDevice?.id || "";
  const existingDevice = targetEditId ? byId("devices", targetEditId) : {};
  if (isAdmin()) {
    values.invoiceIssued = Boolean(invoiceIssuedInput?.checked || values.invoiceNumber || values.invoiceDate || invoiceFile);
    if (values.invoiceIssued) {
      values.invoiceFile = invoiceFile || existingDevice.invoiceFile || "";
      values.invoiceFileName = invoiceFileObject?.name || existingDevice.invoiceFileName || "";
    } else {
      values.invoiceNumber = "";
      values.invoiceDate = "";
      values.invoiceFile = "";
      values.invoiceFileName = "";
    }
  } else {
    delete values.invoiceIssued;
    delete values.invoiceNumber;
    delete values.invoiceDate;
  }
  const payload = targetEditId
    ? { ...byId("devices", targetEditId), ...values, documents, ...(photo ? { photo } : {}) }
    : { id: nextId("d", "devices"), status: "OK", documents: documents.length ? documents : ["Odovzdávací protokol"], photo, ...values };
  const wasMoved = Boolean(duplicateDevice && duplicateDevice.clientId !== payload.clientId);

  if (dataMode === "supabase") {
    try {
      await saveDeviceToSupabase(payload);
      await loadSupabaseDataIntoState();
      addAudit(targetEditId ? (wasMoved ? "Presunuté zariadenie online" : "Upravené zariadenie online") : "Pridané zariadenie online", `${deviceLabel(payload)} - ${clientName(payload.clientId)}`);
      closeCurrentModal(form);
      render();
    } catch (error) {
      alert(`Uloženie zariadenia do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  if (targetEditId) {
    const index = state.devices.findIndex((device) => device.id === targetEditId);
    state.devices[index] = payload;
  } else {
    state.devices.push(payload);
  }
  saveState();
  closeCurrentModal(event.target);
  render();
}

async function saveInventory(event) {
  event.preventDefault();
  if (!isAdmin()) return;
  const form = event.target;
  const values = formValues(form);
  const editId = form.dataset.editId;
  const payload = {
    id: editId || nextId("i", "inventory"),
    ...values,
    qty: Number(values.qty),
    min: Number(values.min),
    reserved: Number(values.reserved)
  };
  if (dataMode === "supabase") {
    try {
      await saveInventoryToSupabase(payload);
      await loadSupabaseDataIntoState();
      addAudit(editId ? "Upravená skladová položka online" : "Pridaná skladová položka online", `${payload.name} - sklad ${payload.qty} ks`);
      closeCurrentModal(form);
      render();
    } catch (error) {
      alert(`Uloženie skladu do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }
  if (editId) {
    const index = state.inventory.findIndex((item) => item.id === editId);
    if (index === -1) return;
    state.inventory[index] = { ...state.inventory[index], ...payload };
    addAudit("Upravená skladová položka", `${payload.name} - sklad ${payload.qty} ks, rezervované ${payload.reserved} ks`);
  } else {
    state.inventory.push(payload);
    addAudit("Pridaná skladová položka", `${payload.name} - sklad ${payload.qty} ks`);
  }
  saveState();
  closeCurrentModal(form);
  render();
}

function splitInventoryImportLine(line) {
  const delimiter = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
  return line.split(delimiter).map((value) => value.trim());
}

function inventoryItemsFromBulkText(text, defaults) {
  const stamp = Date.now().toString(36);
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [
        name,
        sku = "",
        qty = "0",
        min = defaults.min,
        reserved = "0",
        manufacturer = defaults.manufacturer,
        itemType = defaults.itemType,
        category = defaults.category,
        location = defaults.location,
        compatibility = "",
        note = "",
      ] = splitInventoryImportLine(line);
      return {
        id: `i${stamp}-${index + 1}`,
        name,
        manufacturer: manufacturer || defaults.manufacturer,
        itemType: itemType || defaults.itemType,
        sku,
        category: category || defaults.category,
        qty: Number(qty) || 0,
        min: Number(min) || 0,
        reserved: Number(reserved) || 0,
        location: location || defaults.location,
        compatibility,
        note,
      };
    })
    .filter((item) => item.name);
}

async function saveBulkInventory(event) {
  event.preventDefault();
  if (!isAdmin()) return;
  const form = event.target;
  const values = formValues(form);
  const items = inventoryItemsFromBulkText(values.itemsText || "", {
    manufacturer: values.manufacturer || manufacturers[0] || "",
    itemType: values.itemType || inventoryCategories[0] || "",
    category: values.category || "Servis",
    location: values.location || "",
    min: values.min || "0",
  });
  if (!items.length) {
    alert("Vložte aspoň jednu skladovú položku.");
    return;
  }
  if (dataMode === "supabase") {
    try {
      if (!supabaseAuth?.access_token) throw new Error("Najprv sa prihláste cez Supabase Auth.");
      await upsertSupabaseRows("inventory", items.map(inventoryPayloadForSupabase));
      await loadSupabaseDataIntoState();
      addAudit("Pridané skladové položky online", `${items.length} položiek`);
      closeCurrentModal(form);
      render();
    } catch (error) {
      alert(`Hromadné uloženie skladu do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }
  state.inventory.push(...items);
  addAudit("Pridané skladové položky", `${items.length} položiek`);
  saveState();
  closeCurrentModal(form);
  render();
}

async function saveService(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  const editId = form.dataset.editId || "";
  const existing = editId ? byId("service", editId) : null;
  if (editId && !canAccessService(existing)) {
    alert("Túto servisnú úlohu nemôžete upravovať.");
    return;
  }
  const clientId = selectedClientId(form);
  if (!clientId) {
    alert("Vyberte ambulanciu zo zoznamu zhôd.");
    return;
  }
  const device = byId("devices", values.deviceId);
  if (!device || device.clientId !== clientId) {
    alert("Vyberte zariadenie patriace k zvolenej ambulancii.");
    return;
  }
  values.clientId = clientId;
  delete values.clientSearch;
  if (!isAdmin()) values.technicianId = session?.id || existing?.technicianId || "";
  const serviceId = editId || nextId("s", "service");
  const nextService = { ...(existing || {}), id: serviceId, ...values };
  if (dataMode === "supabase") {
    try {
      await saveServiceTaskToSupabase(nextService);
      await loadSupabaseDataIntoState();
      addAudit(editId ? "Upravená servisná úloha online" : "Pridaná servisná úloha online", `${values.title} - ${clientName(clientId)} - ${userName(values.technicianId)}`);
      closeCurrentModal(event.target);
      render();
    } catch (error) {
      alert(`Uloženie do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }
  if (editId) {
    const index = state.service.findIndex((item) => item.id === editId);
    if (index === -1) return;
    state.service[index] = nextService;
    addAudit("Upravená servisná úloha", `${values.title} - ${clientName(clientId)} - ${userName(values.technicianId)}`);
  } else {
    state.service.push(nextService);
    addAudit("Pridaná servisná úloha", `${values.title} - ${clientName(clientId)} - ${userName(values.technicianId)}`);
  }
  saveState();
  closeCurrentModal(event.target);
  render();
}

async function savePortalServiceRequest(event) {
  event.preventDefault();
  const form = event.target;
  const clientId = form.dataset.portalServiceRequest;
  if (!portalSessionClientId && !isAdmin()) return;
  if (portalSessionClientId && portalSessionClientId !== clientId) return;
  const client = byId("clients", clientId);
  const values = formValues(form);
  const device = byId("devices", values.deviceId);
  if (!client || !device || device.clientId !== clientId) {
    alert("Vyberte zariadenie patriace k tejto ambulancii.");
    return;
  }
  const service = {
    id: nextId("s", "service"),
    clientId,
    deviceId: device.id,
    title: `Požiadavka z portálu - ${deviceName(device.id)}`,
    priority: "Stredná",
    state: "Nová",
    technicianId: "",
    due: values.preferredDate || new Date().toISOString().slice(0, 10),
    portalContact: values.contact,
    portalDescription: values.description,
    createdFromPortal: true,
    createdAt: new Date().toISOString(),
    documentRecords: [],
  };
  try {
    if (dataMode === "supabase") {
      await saveServiceTaskToSupabase(service);
      await loadSupabaseDataIntoState();
    } else {
      state.service.push(service);
      saveState();
    }
    addAudit("Servisná požiadavka z portálu", `${client.name} - ${device.serial || deviceName(device.id)} - ${values.description}`);
    alert("Servisná požiadavka bola odoslaná.");
    const content = qs("#clientPortalContent");
    if (content && portalSessionClientId === clientId) {
      content.innerHTML = clientPortalHtml(clientId, false);
      bindViewActions(content);
    } else {
      closeCurrentModal(form);
      openClientPortal(clientId);
    }
  } catch (error) {
    alert(`Odoslanie servisnej požiadavky zlyhalo: ${error.message}`);
  }
}

async function saveServiceProtocol(event) {
  event.preventDefault();
  const form = event.target;
  const data = serviceProtocolValues(form);
  const missingFields = requiredServiceProtocolFields(data);
  if (missingFields.length) {
    alert(`Doplňte povinné polia: ${missingFields.join(", ")}`);
    return;
  }
  if (!data.signatures.client || !data.signatures.technician) {
    alert("Pred uložením servisného protokolu je potrebný podpis klienta aj podpis servisného technika.");
    return;
  }
  const packetId = nextId("p", "documentPackets");
  const documentNames = ["Servisný protokol"];
  const generatedProtocolNumber = nextProtocolNumber("service", data.date);
  data.protocolNumber = generatedProtocolNumber;
  const renderedHtml = serviceProtocolDocumentHtml(data);
  const record = {
    id: packetId,
    protocolNumber: generatedProtocolNumber,
    documentType: "service",
    title: `Servisný protokol ${generatedProtocolNumber}`,
    kind: "Servis",
    state: "Odovzdané",
    billingState: "Na fakturáciu",
    date: data.date,
    due: data.date,
    documents: documentNames,
    templateIds: ["tpl4"],
    clientId: data.client.id,
    deviceId: data.device.id,
    deviceIds: [data.device.id],
    serviceId: data.service.id,
    createdBy: session?.id || "",
    technicianId: data.technician?.id || "",
    signatures: data.signatures,
    renderedHtml,
    serviceValues: {
      doctorName: data.doctorName,
      doctorEmail: data.doctorEmail,
      doctorPhone: data.doctorPhone,
      warrantyRepair: data.warrantyRepair,
      inspection: data.inspection,
      specification: data.specification,
      workDescription: data.workDescription,
      parts: data.parts,
      arrivalDeparture: data.arrivalDeparture,
      totalTime: data.totalTime,
      workRate: data.workRate,
      workRateVat: data.workRateVat,
      afterHoursRate: data.afterHoursRate,
      afterHoursRateVat: data.afterHoursRateVat,
      travelFee: data.travelFee,
      totalPrice: data.totalPrice,
      protocolNumber: generatedProtocolNumber,
    },
  };

  state.documentPackets.push(record);
  data.service.documentRecords = data.service.documentRecords || [];
  data.service.documentRecords.push(record);
  data.service.state = "Hotové";
  const device = byId("devices", data.device.id);
  if (device) {
    device.documentRecords = device.documentRecords || [];
    device.documentRecords.push(record);
    if (!device.documents.includes("Servisný protokol")) device.documents.push("Servisný protokol");
  }

  if (dataMode === "supabase") {
    try {
      await saveDocumentPacketToSupabase(record);
      await saveServiceTaskToSupabase(data.service);
      if (device) await saveDeviceToSupabase(device);
      await sendDocumentNotification(record);
      await loadSupabaseDataIntoState();
      addAudit("Podpísaný servisný protokol online", `${data.client.name} - ${data.device.serial || deviceName(data.device.id)} - ${data.totalPrice} EUR`);
      qsa(".modal-backdrop").forEach((modal) => modal.remove());
      activeView = "service";
      qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "service"));
      render();
    } catch (error) {
      alert(`Uloženie servisného protokolu do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  addAudit("Podpísaný servisný protokol", `${data.client.name} - ${data.device.serial || deviceName(data.device.id)} - ${data.totalPrice} EUR`);
  saveState();
  await sendDocumentNotification(record);
  qsa(".modal-backdrop").forEach((modal) => modal.remove());
  activeView = "service";
  qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "service"));
  render();
}

async function saveDocumentPacket(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  const clientId = selectedClientId(form);
  if (!clientId) {
    alert("Vyberte ambulanciu zo zoznamu zhôd.");
    return;
  }
  const deviceIds = qsa("[name='deviceIds']", form).map((input) => input.value);
  const invalidDevice = deviceIds
    .map((id) => byId("devices", id))
    .find((device) => !isDeviceSelectableForPacket(device, clientId));
  if (invalidDevice) {
    alert("Vybrané zariadenia musia patriť k zvolenej ambulancii alebo byť voľné na sklade.");
    return;
  }
  values.clientId = clientId;
  values.deviceId = deviceIds[0] || "";
  values.deviceIds = deviceIds;
  delete values.clientSearch;
  delete values.deviceSearch;
  delete values.deviceIds;
  const templateIds = qsa("[name='templateIds']:checked", form).map((input) => input.value);
  delete values.templateIds;
  const packet = {
    id: nextId("p", "documentPackets"),
    ...values,
    deviceIds,
    templateIds,
    createdAt: new Date().toISOString().slice(0, 10),
    createdBy: session?.id || "",
  };
  const stockDevicesToReserve = deviceIds
    .map((id) => byId("devices", id))
    .filter((device) => isStockDevice(device) && device.status !== "Rezervované");

  if (dataMode === "supabase") {
    try {
      await saveDocumentPacketToSupabase(packet);
      await Promise.all(stockDevicesToReserve.map((device) => {
        device.status = "Rezervované";
        return saveDeviceToSupabase(device);
      }));
      await loadSupabaseDataIntoState();
      addAudit("Pridaný podpisový balík online", `${packet.title || "Dokument"} - ${clientName(clientId)}`);
      closeCurrentModal(form);
      activeView = "documents";
      qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "documents"));
      render();
    } catch (error) {
      alert(`Uloženie podpisového balíka do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  state.documentPackets.push(packet);
  stockDevicesToReserve.forEach((device) => {
    device.status = "Rezervované";
  });
  saveState();
  closeCurrentModal(form);
  activeView = "documents";
  qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "documents"));
  render();
}

async function saveHandover(event) {
  event.preventDefault();
  const form = event.target;
  const data = handoverValues(form);
  if (!data.devices.length) {
    alert("Vyberte aspoň jedno zariadenie.");
    return;
  }

  if (!data.signatures.client || !data.signatures.technician) {
    alert("Pred uloĹľenĂ­m je potrebnĂ˝ podpis klienta aj podpis servisnĂ©ho technika.");
    return;
  }

  const existingPacketId = form.dataset.packetId || "";
  const existingPacket = existingPacketId ? findDocumentRecord(existingPacketId) : null;
  const packetId = existingPacketId || nextId("p", "documentPackets");
  const documentNames = ["Odovzdávací a záručný protokol", "Záznam o školení"];
  const generatedProtocolNumber = protocolNumber(existingPacket || {}) || nextProtocolNumber(existingPacket?.kind === "Demontáž" ? "demolition" : "handover", data.date);
  data.protocolNumber = generatedProtocolNumber;
  const warranties = data.devices.map((device) => ({
    deviceId: device.id,
    warranty: device.handoverWarranty || defaultWarrantyForDevice(device),
  }));
  const renderedHtml = handoverDocumentsHtml(data);
  const record = {
    id: packetId,
    protocolNumber: generatedProtocolNumber,
    title: existingPacket?.title || `Odovzdanie ${generatedProtocolNumber}`,
    state: "Odovzdané",
    date: data.date,
    documents: documentNames,
    clientId: data.client.id,
    deviceIds: data.devices.map((device) => device.id),
    createdBy: session?.id || "",
    note: data.note,
    trainedPerson: data.trainedPerson,
    trainer: data.trainer,
    additionalTechnicians: data.additionalTechnicians,
    signatures: data.signatures,
    warranties,
    renderedHtml,
    serviceValues: { ...(existingPacket?.serviceValues || {}), protocolNumber: generatedProtocolNumber },
  };

  const signedPacket = {
    ...record,
    kind: existingPacket?.kind || "Inštalácia",
    deviceId: data.devices[0].id,
    templateIds: existingPacket?.templateIds?.length ? existingPacket.templateIds : ["tpl1", "tpl2"],
    due: data.date,
    createdAt: existingPacket?.createdAt || new Date().toISOString().slice(0, 10),
  };

  const packetIndex = state.documentPackets.findIndex((item) => item.id === packetId);
  if (packetIndex === -1) {
    state.documentPackets.push(signedPacket);
  } else {
    state.documentPackets[packetIndex] = { ...state.documentPackets[packetIndex], ...signedPacket };
  }

  data.devices.forEach((selectedDevice) => {
    const device = byId("devices", selectedDevice.id);
    if (!device) return;
    const warranty = selectedDevice.handoverWarranty || defaultWarrantyForDevice(selectedDevice);
    device.documentRecords = device.documentRecords || [];
    device.documentRecords = device.documentRecords.filter((item) => item.id !== packetId);
    device.documentRecords.push({
      ...record,
      warranty,
      deviceIds: [device.id],
    });
    documentNames.forEach((name) => {
      if (!device.documents.includes(name)) device.documents.push(name);
    });
    device.clientId = data.client.id;
    device.warrantyText = warranty;
    device.installed = device.installed || data.date;
    device.status = ["Importované", "Skladom", "Rezervované"].includes(device.status) ? "OK" : device.status;
  });

  if (dataMode === "supabase") {
    try {
      await saveDocumentPacketToSupabase(signedPacket);
      await Promise.all(data.devices.map((selectedDevice) => {
        const device = byId("devices", selectedDevice.id);
        return device ? saveDeviceToSupabase(device) : Promise.resolve(null);
      }));
      await sendDocumentNotification(signedPacket);
      await loadSupabaseDataIntoState();
      addAudit("Podpísané odovzdávacie dokumenty online", `${data.client.name} - zariadenia: ${data.devices.length}`);
      qsa(".modal-backdrop").forEach((modal) => modal.remove());
      activeView = "documents";
      qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "documents"));
      render();
    } catch (error) {
      alert(`Uloženie odovzdávacích dokumentov do Supabase zlyhalo: ${error.message}`);
    }
    return;
  }

  saveState();
  await sendDocumentNotification(signedPacket);
  qsa(".modal-backdrop").forEach((modal) => modal.remove());
  activeView = "documents";
  qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "documents"));
  render();
}

async function saveUser(event) {
  event.preventDefault();
  const form = event.target;
  const values = formValues(form);
  const editId = form.dataset.editId;
  const tempPassword = values.tempPassword || DEFAULT_PASSWORD;
  delete values.tempPassword;
  values.active = qs("[name='active']", form)?.checked !== false;
  const normalizedEmail = (values.email || "").trim().toLowerCase();
  values.email = normalizedEmail;
  values.phone = normalizePhoneNumber(values.phone || "");
  if (dataMode === "supabase") {
    if (!normalizedEmail) {
      alert("Nový online používateľ musí mať vlastný e-mail.");
      return;
    }
    const duplicateUser = state.users.find((user) => user.id !== editId && (user.email || "").trim().toLowerCase() === normalizedEmail);
    if (duplicateUser) {
      alert(`Tento e-mail už používa ${duplicateUser.name}. Každý Supabase používateľ musí mať vlastný unikátny e-mail.`);
      return;
    }
  }
  if (["Administrátor", "SuperAdministrátor"].includes(values.role) && !isSuperAdmin()) {
    alert("Administrátora alebo SuperAdministrátora môže pridať iba SuperAdministrátor.");
    return;
  }
  if (editId) {
    const index = state.users.findIndex((user) => user.id === editId);
    const original = state.users[index];
    if (!original || !canEditUser(original)) {
      alert("Na úpravu tohto používateľa nemáte oprávnenie.");
      return;
    }
    const updated = {
      ...original,
      ...values,
      protected: original.protected || values.role === "SuperAdministrátor",
    };
    const projectedUsers = state.users.map((user) => user.id === editId ? updated : user);
    if (!projectedUsers.some((user) => user.role === "SuperAdministrátor" && user.active)) {
      alert("V systéme musí zostať aspoň jeden aktívny SuperAdministrátor. Najprv označte nového SuperAdmina.");
      return;
    }
    if (dataMode === "supabase") {
      try {
        await upsertUserProfileToSupabase(updated);
        await loadSupabaseDataIntoState();
        addAudit("Upravený používateľ online", `${updated.name} - ${updated.role}`);
        if (session?.id === updated.id) {
          session = { ...session, ...updated };
          qs("#activeUser").textContent = session.name;
          qs("#activeRole").textContent = session.role;
        }
        closeCurrentModal(form);
        render();
      } catch (error) {
        alert(`Uloženie používateľa do Supabase zlyhalo: ${error.message}`);
      }
      return;
    }

    state.users[index] = updated;
    if (session?.id === updated.id) {
      session = updated;
      qs("#activeUser").textContent = session.name;
      qs("#activeRole").textContent = session.role;
    }
  } else {
    if (values.role === "SuperAdministrátor" && !confirm("Naozaj chcete pridať ďalší účet SuperAdministrátora? SuperAdministrátor má najvyššie oprávnenia.")) {
      return;
    }
    const nextUser = {
      id: nextId("u", "users"),
      active: true,
      protected: values.role === "SuperAdministrátor",
      passwordHash: hashPassword(tempPassword),
      mustChangePassword: true,
      ...values
    };

    if (dataMode === "supabase") {
      if (!isSuperAdmin()) {
        alert("Online používateľov môže vytvárať iba SuperAdministrátor.");
        return;
      }
      try {
        const authUser = await createSupabaseAuthUser(nextUser, tempPassword);
        await upsertUserProfileToSupabase({ ...nextUser, id: authUser.id, onlineId: authUser.id });
        await loadSupabaseDataIntoState();
        addAudit("Pridaný používateľ online", `${nextUser.name} - ${nextUser.role}`);
        closeCurrentModal(form);
        render();
      } catch (error) {
        alert(`Vytvorenie používateľa v Supabase zlyhalo: ${error.message}\n\nSkontrolujte, či má používateľ vlastný unikátny e-mail. Jeden e-mail sa v Supabase nedá použiť pre viacerých technikov/adminov.`);
      }
      return;
    }

    state.users.push(nextUser);
  }
  saveState();
  initLogin();
  closeCurrentModal(form);
  render();
}

initLogin();
initNavigation();
restoreLoginOnStart();
