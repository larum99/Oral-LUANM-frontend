const getBasePath = () => {
  const depth = window.location.pathname
    .split("/")
    .filter(Boolean)
    .filter((part) =>
      part !== "Odonto-luanm-frontend" &&
      !part.endsWith(".html")
    ).length;

  return depth === 0 ? "./" : "../".repeat(depth);
};

const fillTemplate = (html) => {
  const contactPath = `${getBasePath()}contactanos/`;
  const servicePath = `${getBasePath()}servicios/`;
  const adminPath = `${getBasePath()}registro/admin/`;
  const secretaryPath = `${getBasePath()}registro/secretario/`;
  const clientPath = `${getBasePath()}registro/cliente/`;
  const homePath = `${getBasePath()}index.html`;
  
  return html
    .replaceAll("{{BASE_PATH}}", getBasePath())
    .replaceAll("{{CONTACT_PATH}}", contactPath)
    .replaceAll("{{SERVICE_PATH}}", servicePath)
    .replaceAll("{{ADMIN_PATH}}", adminPath)
    .replaceAll("{{SECRETARY_PATH}}", secretaryPath)
    .replaceAll("{{CLIENT_PATH}}", clientPath)
    .replaceAll("{{HOME_PATH}}", homePath);
}

let siteData = {};
let formsConfig = { forms: {} };

const GLOBAL_SYNC_QUEUE_KEY = "oralLuanmSyncQueue";
const MANAGED_FORM_SKIP_SUBMIT = new Set([
  "formModalLogin",
  "secretaryAppointmentForm",
  "clientAppointmentForm",
  "adminUserForm",
  "adminSpecialistForm",
  "adminPermissionsForm",
]);

const getDataValue = (path) => (
  path.split(".").reduce((value, key) => value?.[key], siteData)
);

const loadSiteData = async () => {
  const response = await fetch(`${getBasePath()}js/datos.json`);

  if (!response.ok) {
    throw new Error("No se pudo cargar js/datos.json");
  }

  siteData = await response.json();
};

const loadFormsConfig = async () => {
  try {
    const response = await fetch(`${getBasePath()}js/forms-config.json`);

    if (!response.ok) {
      throw new Error("No se pudo cargar js/forms-config.json");
    }

    formsConfig = await response.json();
  } catch {
    formsConfig = { forms: {} };
  }
};

const applySiteData = () => {
  document.querySelectorAll("[data-text]").forEach((target) => {
    const value = getDataValue(target.dataset.text);
    if (value !== undefined) target.textContent = value;
  });

  document.querySelectorAll("[data-html]").forEach((target) => {
    const value = getDataValue(target.dataset.html);
    if (value !== undefined) target.innerHTML = value;
  });

  document.querySelectorAll("[data-placeholder]").forEach((target) => {
    const value = getDataValue(target.dataset.placeholder);
    if (value !== undefined) target.setAttribute("placeholder", value);
  });

  document.querySelectorAll("[data-label]").forEach((target) => {
    const value = getDataValue(target.dataset.label);
    if (value !== undefined) target.setAttribute("aria-label", value);
  });
};

const canUseLocalStorage = () => {
  try {
    const probeKey = "__oralluanm_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

const readLocalJson = (key, fallback) => {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalJson = (key, value) => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const removeLocalValue = (key) => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
};

const appendLocalJson = (key, value) => {
  const currentValue = readLocalJson(key, []);
  const currentList = Array.isArray(currentValue) ? currentValue : [];

  currentList.unshift(value);
  writeLocalJson(key, currentList);
};

const getManagedFormConfig = (formId) => formsConfig.forms?.[formId] ?? null;

const getSensitiveFormSources = (config) => (
  new Set(
    (config?.fields ?? [])
      .filter((field) => field.sensitive)
      .map((field) => field.source ?? field.name),
  )
);

const getFormFields = (form) => (
  [...form.elements].filter(
    (field) => (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ),
  )
);

const collectFormValues = (form, sensitiveSources = new Set()) => {
  const values = {};

  getFormFields(form).forEach((field) => {
    if (!field.name || field.disabled || sensitiveSources.has(field.name)) {
      return;
    }

    if (field instanceof HTMLInputElement && field.type === "checkbox") {
      values[field.name] = field.checked;
      return;
    }

    if (field instanceof HTMLInputElement && field.type === "radio") {
      if (field.checked) {
        values[field.name] = field.value;
      }
      return;
    }

    values[field.name] = field.value.trim();
  });

  return values;
};

const applyFormValues = (form, values) => {
  Object.entries(values).forEach(([name, value]) => {
    form.querySelectorAll(`[name="${name}"]`).forEach((field) => {
      if (field instanceof HTMLInputElement && field.type === "checkbox") {
        field.checked = Boolean(value);
        return;
      }

      if (field instanceof HTMLInputElement && field.type === "radio") {
        field.checked = field.value === value;
        return;
      }

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.value = String(value ?? "");
      }
    });
  });
};

const buildFormPayload = (form, config) => {
  const sensitiveSources = getSensitiveFormSources(config);
  const values = collectFormValues(form, sensitiveSources);
  const fields = config?.fields ?? [];
  const omittedSensitiveFields = fields
    .filter((field) => field.sensitive)
    .map((field) => field.name);

  const data = fields.length > 0
    ? fields.reduce((payload, field) => {
        if (field.sensitive) {
          return payload;
        }

        payload[field.name] = values[field.source ?? field.name] ?? null;
        return payload;
      }, {})
    : values;

  return {
    formId: form.id,
    entity: config?.entity ?? form.id,
    backend: config?.backend ?? null,
    path: window.location.pathname,
    submittedAt: new Date().toISOString(),
    data,
    ...(omittedSensitiveFields.length > 0
      ? { sensitiveFieldsOmitted: omittedSensitiveFields }
      : {}),
  };
};

const removeFormAlert = (form) => {
  form.querySelector(".form-alert")?.remove();
};

const showFormAlert = (form, message, variant = "success") => {
  removeFormAlert(form);

  const alert = document.createElement("div");
  alert.className = `alert alert-${variant} mt-3 form-alert`;
  alert.setAttribute("role", "alert");
  alert.textContent = message;

  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton && submitButton.parentElement === form) {
    form.insertBefore(alert, submitButton);
    return;
  }

  form.appendChild(alert);
};

const restoreManagedFormDraft = (form, config) => {
  if (!config?.draftKey) {
    return;
  }

  const draftValues = readLocalJson(config.draftKey, {});
  applyFormValues(form, draftValues);
};

const persistManagedFormDraft = (form, config) => {
  if (!config?.draftKey) {
    return;
  }

  writeLocalJson(config.draftKey, collectFormValues(form, getSensitiveFormSources(config)));
};

const clearManagedFormDraft = (config) => {
  if (!config?.draftKey) {
    return;
  }

  removeLocalValue(config.draftKey);
};

const queueManagedSubmission = (config, payload) => {
  if (!canUseLocalStorage()) {
    return;
  }

  if (config?.submissionKey) {
    appendLocalJson(config.submissionKey, payload);
  }

  appendLocalJson(GLOBAL_SYNC_QUEUE_KEY, payload);
};

const syncPasswordConfirmation = (form) => {
  const passwordField = form.querySelector("[data-password-field]");
  const confirmPasswordField = form.querySelector("[data-confirm-password]");

  if (
    !(passwordField instanceof HTMLInputElement) ||
    !(confirmPasswordField instanceof HTMLInputElement)
  ) {
    return;
  }

  const hasMismatch = (
    confirmPasswordField.value.length > 0 &&
    passwordField.value !== confirmPasswordField.value
  );

  confirmPasswordField.setCustomValidity(
    hasMismatch ? "Las contrasenas no coinciden." : "",
  );
};

const initInputSanitizers = (scope = document) => {
  scope.querySelectorAll("[data-digits-only]").forEach((field) => {
    if (
      !(field instanceof HTMLInputElement) ||
      field.dataset.digitsBound === "true"
    ) {
      return;
    }

    field.dataset.digitsBound = "true";
    field.addEventListener("input", () => {
      const maxLength = Number(field.getAttribute("maxlength")) || Infinity;
      field.value = field.value.replace(/\D+/g, "").slice(0, maxLength);
    });
  });

  scope.querySelectorAll("[data-password-field], [data-confirm-password]").forEach((field) => {
    if (!(field instanceof HTMLElement) || field.dataset.passwordBound === "true") {
      return;
    }

    field.dataset.passwordBound = "true";
    field.addEventListener("input", () => {
      const form = field.closest("form");
      if (form instanceof HTMLFormElement) {
        syncPasswordConfirmation(form);
      }
    });
  });
};

const bindManagedForm = (form) => {
  if (form.dataset.formBound === "true") {
    return;
  }

  form.dataset.formBound = "true";
  initInputSanitizers(form);

  const config = getManagedFormConfig(form.id);
  if (config?.draftKey) {
    restoreManagedFormDraft(form, config);

    form.addEventListener("input", () => {
      persistManagedFormDraft(form, config);
      removeFormAlert(form);
    });

    form.addEventListener("change", () => {
      persistManagedFormDraft(form, config);
      removeFormAlert(form);
    });
  }

  if (MANAGED_FORM_SKIP_SUBMIT.has(form.id)) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    syncPasswordConfirmation(form);
    form.classList.add("was-validated");
    removeFormAlert(form);

    if (!form.checkValidity()) {
      return;
    }

    if (config) {
      const payload = buildFormPayload(form, config);
      queueManagedSubmission(config, payload);
      clearManagedFormDraft(config);

      showFormAlert(
        form,
        config.successMessage ?? "Formulario guardado localmente y listo para enviarse al backend.",
      );
    } else {
      showFormAlert(form, "Formulario procesado correctamente.");
    }

    form.reset();
    form.classList.remove("was-validated");
    syncPasswordConfirmation(form);
  });
};

const STORAGE_KEYS = {
  syncQueue: GLOBAL_SYNC_QUEUE_KEY,
  user: "oralLuanmUser",
  users: "oralLuanmAdminUsers",
  specialists: "oralLuanmSpecialists",
  permissions: "oralLuanmTeamPermissions",
  appointments: "oralLuanmAppointments",
};

const ROLE_PATHS = {
  admin: "registro/admin/",
  secretario: "registro/secretario/",
  client: "registro/cliente/",
};

const DEFAULT_SPECIALISTS = [
  { name: "Dra. Maudy Luanm", email: "maudy@oralluanm.com", specialty: "Ortodoncia", status: "Activo" },
  { name: "Dr. Ramirez", email: "ramirez@oralluanm.com", specialty: "Implantologia", status: "Activo" },
  { name: "Dra. Gomez", email: "gomez@oralluanm.com", specialty: "Higiene oral", status: "Activo" },
];

const MOCK_USERS = [
  {
    email: "juan@correo.com",
    password: "123456",
    name: "Juan Administrador",
    role: "admin",
    path: ROLE_PATHS.admin,
  },
  {
    email: "secre@correo.com",
    password: "654321",
    name: "Secretaria Clinica",
    role: "secretario",
    path: ROLE_PATHS.secretario,
  },
  {
    email: "sara@correo.com",
    password: "7654321",
    name: "Sara Cliente",
    role: "client",
    path: ROLE_PATHS.client,
    phone: "3007654321",
  },
];

const DEFAULT_USERS = [
  { name: "Juan Administrador", email: "juan@correo.com", role: "Admin", status: "Activo" },
  { name: "Secretaria Clinica", email: "secre@correo.com", role: "Secretario", status: "Activo" },
  { name: "Sara Cliente", email: "sara@correo.com", role: "Cliente", status: "Activo" },
  { name: "Laura Perez", email: "laura.paciente@correo.com", role: "Cliente", status: "Seguimiento" },
  { name: "Carlos Rojas", email: "carlos.rojas@correo.com", role: "Cliente", status: "Activo" },
];

const DEFAULT_PERMISSIONS = {
  "juan@correo.com": ["appointments", "patients", "admins", "permissions", "specialists"],
  "secre@correo.com": ["appointments", "patients"],
};

const holidayCache = new Map();

const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();

const normalizeRoleValue = (role) => String(role ?? "").trim().toLowerCase();

const getRoleLabel = (role) => {
  const normalizedRole = normalizeRoleValue(role);

  if (normalizedRole === "admin") return "Admin";
  if (normalizedRole === "secretario" || normalizedRole === "secretary") return "Secretario";
  if (normalizedRole === "client" || normalizedRole === "cliente") return "Cliente";

  return String(role ?? "").trim() || "Cliente";
};

const getRolePath = (role) => {
  const normalizedRole = normalizeRoleValue(role);
  return ROLE_PATHS[normalizedRole] ?? ROLE_PATHS.client;
};

const getStorageArray = (key, fallback = []) => {
  const value = readLocalJson(key, fallback);
  return Array.isArray(value) ? value : fallback;
};

const buildPatientLabel = (name, email) => {
  const safeName = String(name ?? "").trim();
  const safeEmail = normalizeEmail(email);

  if (safeName && safeEmail) return `${safeName} - ${safeEmail}`;
  return safeName || safeEmail;
};

const getEmailFromPatientLabel = (value) => {
  const parts = String(value ?? "").split(" - ");
  return normalizeEmail(parts.length > 1 ? parts[parts.length - 1] : "");
};

const createRecordId = (prefix) => (
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
);

const mergeRecordsByKey = (defaults, current, getKey) => {
  const mergedRecords = new Map();

  defaults.forEach((item) => {
    const key = getKey(item);
    if (!key) return;
    mergedRecords.set(key, { ...item });
  });

  current.forEach((item) => {
    const key = getKey(item);
    if (!key) return;

    mergedRecords.set(key, {
      ...(mergedRecords.get(key) ?? {}),
      ...item,
    });
  });

  return [...mergedRecords.values()];
};

const normalizeAppointment = (appointment) => {
  const patient = appointment.patient ?? buildPatientLabel(appointment.patientName, appointment.patientEmail);

  return {
    id: appointment.id ?? createRecordId("appointment"),
    patient,
    patientName: appointment.patientName ?? String(patient ?? "").split(" - ")[0],
    patientEmail: normalizeEmail(appointment.patientEmail ?? getEmailFromPatientLabel(patient)),
    patientPhone: String(appointment.patientPhone ?? "").trim(),
    patientDocument: String(appointment.patientDocument ?? "").trim(),
    specialist: String(appointment.specialist ?? "").trim(),
    date: String(appointment.date ?? appointment.appointmentDate ?? "").trim(),
    time: String(appointment.time ?? appointment.appointmentTime ?? "").trim(),
    reason: String(appointment.reason ?? appointment.appointmentReason ?? "").trim(),
    notes: String(appointment.notes ?? appointment.appointmentNotes ?? "").trim(),
    status: String(appointment.status ?? "Pendiente").trim() || "Pendiente",
    channel: String(appointment.channel ?? "internal").trim() || "internal",
    createdAt: String(appointment.createdAt ?? "").trim(),
    createdByEmail: normalizeEmail(appointment.createdByEmail ?? appointment.patientEmail),
    createdByRole: String(appointment.createdByRole ?? "secretario").trim() || "secretario",
  };
};

const getStoredUsers = () => getStorageArray(STORAGE_KEYS.users, DEFAULT_USERS);

const saveStoredUsers = (users) => {
  writeLocalJson(STORAGE_KEYS.users, users);
};

const getStoredSpecialists = () => getStorageArray(STORAGE_KEYS.specialists, DEFAULT_SPECIALISTS);

const saveStoredSpecialists = (specialists) => {
  writeLocalJson(STORAGE_KEYS.specialists, specialists);
};

const getStoredPermissions = () => {
  const storedPermissions = readLocalJson(STORAGE_KEYS.permissions, DEFAULT_PERMISSIONS);
  return storedPermissions && typeof storedPermissions === "object"
    ? storedPermissions
    : DEFAULT_PERMISSIONS;
};

const saveStoredPermissions = (permissions) => {
  writeLocalJson(STORAGE_KEYS.permissions, permissions);
};

const getStoredAppointments = () => (
  getStorageArray(STORAGE_KEYS.appointments, []).map(normalizeAppointment)
);

const saveStoredAppointments = (appointments) => {
  writeLocalJson(STORAGE_KEYS.appointments, appointments.map(normalizeAppointment));
};

const getCurrentUser = () => {
  const storedUser = readLocalJson(STORAGE_KEYS.user, null);

  if (!storedUser || typeof storedUser !== "object") {
    return null;
  }

  return {
    ...storedUser,
    email: normalizeEmail(storedUser.email),
    role: normalizeRoleValue(storedUser.role),
    path: storedUser.path ?? getRolePath(storedUser.role),
  };
};

const getCurrentUserDashboardHref = (user) => `${getBasePath()}${user.path ?? getRolePath(user.role)}`;

const ensureBaseData = () => {
  const mergedUsers = mergeRecordsByKey(
    DEFAULT_USERS,
    getStorageArray(STORAGE_KEYS.users, []),
    (user) => normalizeEmail(user.email),
  );
  const mergedSpecialists = mergeRecordsByKey(
    DEFAULT_SPECIALISTS,
    getStorageArray(STORAGE_KEYS.specialists, []),
    (specialist) => normalizeEmail(specialist.email),
  );
  const mergedPermissions = {
    ...DEFAULT_PERMISSIONS,
    ...getStoredPermissions(),
  };
  const normalizedAppointments = getStorageArray(STORAGE_KEYS.appointments, [])
    .filter((appointment) => appointment && typeof appointment === "object")
    .map(normalizeAppointment);

  saveStoredUsers(mergedUsers);
  saveStoredSpecialists(mergedSpecialists);
  saveStoredPermissions(mergedPermissions);
  saveStoredAppointments(normalizedAppointments);
};

const parseDateValue = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? "").trim());
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const parseDateTimeValue = (dateValue, timeValue) => {
  const date = parseDateValue(dateValue);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(String(timeValue ?? "").trim());

  if (!date || !timeMatch) {
    return null;
  }

  date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
  return date;
};

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTimeValue = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const moveToNextMonday = (date) => {
  const adjustedDate = new Date(date);
  const day = adjustedDate.getDay();

  if (day === 1) {
    return adjustedDate;
  }

  const daysToAdd = (8 - day) % 7;
  adjustedDate.setDate(adjustedDate.getDate() + daysToAdd);
  return adjustedDate;
};

const addDays = (date, days) => {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + days);
  return adjustedDate;
};

const calculateEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};

const getColombianHolidaySet = (year) => {
  if (holidayCache.has(year)) {
    return holidayCache.get(year);
  }

  const easterSunday = calculateEasterSunday(year);
  const holidays = [
    new Date(year, 0, 1),
    moveToNextMonday(new Date(year, 0, 6)),
    moveToNextMonday(new Date(year, 2, 19)),
    addDays(easterSunday, -3),
    addDays(easterSunday, -2),
    new Date(year, 4, 1),
    moveToNextMonday(addDays(easterSunday, 43)),
    moveToNextMonday(addDays(easterSunday, 64)),
    moveToNextMonday(addDays(easterSunday, 71)),
    moveToNextMonday(new Date(year, 5, 29)),
    new Date(year, 6, 20),
    new Date(year, 7, 7),
    moveToNextMonday(new Date(year, 7, 15)),
    moveToNextMonday(new Date(year, 9, 12)),
    moveToNextMonday(new Date(year, 10, 1)),
    moveToNextMonday(new Date(year, 10, 11)),
    new Date(year, 11, 8),
    new Date(year, 11, 25),
  ].map(formatDateValue);

  const holidaySet = new Set(holidays);
  holidayCache.set(year, holidaySet);
  return holidaySet;
};

const getBlockedDateReason = (dateValue) => {
  const date = parseDateValue(dateValue);

  if (!date) {
    return "";
  }

  if (date.getDay() === 0) {
    return "No se agendan citas los domingos.";
  }

  if (getColombianHolidaySet(date.getFullYear()).has(dateValue)) {
    return "No se agendan citas en festivos de Colombia.";
  }

  return "";
};

const getMinimumAppointmentDateTime = (minutesAhead = 15) => {
  const minimumDate = new Date();
  minimumDate.setMinutes(minimumDate.getMinutes() + minutesAhead, 0, 0);
  return minimumDate;
};

const updateAppointmentInputLimits = (dateInput, timeInput, minutesAhead = 15) => {
  const minimumDate = getMinimumAppointmentDateTime(minutesAhead);
  const minimumDateValue = formatDateValue(minimumDate);

  dateInput.min = minimumDateValue;

  if (dateInput.value === minimumDateValue) {
    timeInput.min = formatTimeValue(minimumDate);
    return;
  }

  timeInput.removeAttribute("min");
};

const validateAppointmentSchedule = (dateInput, timeInput, minutesAhead = 15) => {
  updateAppointmentInputLimits(dateInput, timeInput, minutesAhead);
  dateInput.setCustomValidity("");
  timeInput.setCustomValidity("");

  if (!dateInput.value) {
    return;
  }

  const blockedDateReason = getBlockedDateReason(dateInput.value);
  if (blockedDateReason) {
    dateInput.setCustomValidity(blockedDateReason);
  }

  if (!dateInput.value || !timeInput.value || blockedDateReason) {
    return;
  }

  const selectedDateTime = parseDateTimeValue(dateInput.value, timeInput.value);
  const minimumDateTime = getMinimumAppointmentDateTime(minutesAhead);

  if (selectedDateTime && selectedDateTime < minimumDateTime) {
    timeInput.setCustomValidity("La cita debe agendarse con minimo 15 minutos de anticipacion.");
  }
};

const sortAppointmentsByDateTime = (appointments) => (
  [...appointments].sort((left, right) => {
    const leftDate = parseDateTimeValue(left.date, left.time)?.getTime() ?? 0;
    const rightDate = parseDateTimeValue(right.date, right.time)?.getTime() ?? 0;
    return leftDate - rightDate;
  })
);

const hasAppointmentConflict = (appointments, appointmentToCompare, excludeId = "") => (
  appointments.some((appointment) => (
    appointment.id !== excludeId &&
    appointment.status !== "Cancelada" &&
    appointment.date === appointmentToCompare.date &&
    appointment.time === appointmentToCompare.time &&
    appointment.specialist === appointmentToCompare.specialist
  ))
);

const loadComponent = async (target) => {
  const componentName = target.dataset.component;
  const response = await fetch(`${getBasePath()}componentes/${componentName}.html`);

  if (!response.ok) {
    throw new Error(`No se pudo cargar el componente: ${componentName}`);
  }

  target.innerHTML = fillTemplate(await response.text());
};

const loadComponents = async () => {
  const targets = document.querySelectorAll("[data-component]");
  await Promise.all([...targets].map(loadComponent));
};

const initNavbar = () => {
  const navbar = document.querySelector(".navbar");
  const navbarCollapse = document.getElementById("navbarNav");

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateNavbar);
  updateNavbar();

  if (!navbarCollapse) return;

  navbarCollapse.addEventListener("show.bs.collapse", () => {
    document.body.classList.add("nav-menu-open");
  });

  navbarCollapse.addEventListener("hidden.bs.collapse", () => {
    document.body.classList.remove("nav-menu-open");
  });
};

const initRevealAnimations = () => {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    return;
  }

  revealItems.forEach((item) => item.classList.add("active"));
};

const initFormValidation = () => {
  document.querySelectorAll("form").forEach((form) => {
    if (form instanceof HTMLFormElement) {
      bindManagedForm(form);
    }
  });
};

const initAuthModals = () => {
  const registerButton = document.getElementById("btnOpenRegister");
  const loginModalElement = document.getElementById("loginModal");
  const registerModalElement = document.getElementById("registerModal");
  const loginForm = document.getElementById("formModalLogin");

  if (!registerButton || !loginModalElement || !registerModalElement || !loginForm) return;

  registerButton.addEventListener("click", () => {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).hide();

    setTimeout(() => {
      bootstrap.Modal.getOrCreateInstance(registerModalElement).show();
    }, 300);
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    loginForm.classList.add("was-validated");

    const previousAlert = loginForm.querySelector(".alert");
    previousAlert?.remove();

    if (!loginForm.checkValidity()) return;

    const email = normalizeEmail(document.getElementById("loginEmail").value);
    const password = document.getElementById("loginPassword").value.trim();
    const user = MOCK_USERS.find((item) => item.email === email && item.password === password);

    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.user);

      const message = document.createElement("div");
      message.className = "alert alert-danger mt-3 mb-0";
      message.setAttribute("role", "alert");
      message.textContent = "Credenciales invalidas. Verifica tu correo y contrasena.";
      loginForm.appendChild(message);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    window.location.href = `${getBasePath()}${user.path}`;
  });

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("login") === "required") {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
  }
};

const initProtectedViews = () => {
  const requiredRole = document.body.dataset.requiredRole;
  const currentUser = getCurrentUser();

  if (requiredRole && (!currentUser || (requiredRole !== currentUser.role && currentUser.role !== "admin"))) {
    window.location.href = `${getBasePath()}?login=required`;
    return;
  }

  document.querySelectorAll("[data-auth-login-button]").forEach((button) => {
    button.textContent = currentUser
      ? getDataValue("buttons.logout") ?? "Cerrar Sesion"
      : getDataValue("buttons.login") ?? "Iniciar Sesion";
    button.toggleAttribute("data-logout", Boolean(currentUser));

    if (currentUser) {
      button.removeAttribute("data-bs-toggle");
      button.removeAttribute("data-bs-target");
      return;
    }

    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#loginModal");
  });

  document.querySelectorAll("[data-header-session]").forEach((container) => {
    container.classList.toggle("d-none", !currentUser);
  });

  document.querySelectorAll("[data-session-name]").forEach((target) => {
    target.textContent = currentUser?.name ?? target.textContent;
  });

  document.querySelectorAll("[data-session-link]").forEach((target) => {
    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }

    target.href = currentUser
      ? getCurrentUserDashboardHref(currentUser)
      : `${getBasePath()}index.html`;
  });

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.user);
      window.location.href = getBasePath();
    });
  });
};

const initSecretaryAppointments = () => {
  const form = document.getElementById("secretaryAppointmentForm");
  const table = document.getElementById("appointmentsTable");
  const dateInput = document.getElementById("appointmentDate");
  const timeInput = document.getElementById("appointmentTime");
  const patientInput = document.getElementById("patientSelect");
  const newPatientFields = document.getElementById("newPatientFields");
  const newPatientNameInput = document.getElementById("newPatientName");
  const newPatientEmailInput = document.getElementById("newPatientEmail");
  const newPatientPhoneInput = document.getElementById("newPatientPhone");
  const newPatientDocumentInput = document.getElementById("newPatientDocument");
  const specialistInput = document.getElementById("specialistSelect");
  const reasonInput = document.getElementById("appointmentReason");
  const notesInput = document.getElementById("appointmentNotes");
  const submitButton = document.getElementById("appointmentSubmitButton");
  const editActions = document.getElementById("appointmentEditActions");
  const clearButton = document.getElementById("clearAppointmentSelection");
  const cancelButton = document.getElementById("cancelAppointmentButton");

  if (
    !form ||
    !table ||
    !dateInput ||
    !timeInput ||
    !patientInput ||
    !newPatientFields ||
    !newPatientNameInput ||
    !newPatientEmailInput ||
    !newPatientPhoneInput ||
    !newPatientDocumentInput ||
    !specialistInput ||
    !reasonInput ||
    !notesInput ||
    !submitButton ||
    !editActions ||
    !clearButton ||
    !cancelButton
  ) return;

  const secretaryFormConfig = getManagedFormConfig(form.id);

  let selectedAppointmentRow = null;

  const getShortName = (value) => String(value ?? "").split(" - ")[0];

  const patientExists = (patientValue) => (
    [...patientInput.options].some((option) => option.value === patientValue || option.textContent === patientValue)
  );

  const addPatientOption = (patientValue) => {
    if (patientExists(patientValue)) return;

    const option = document.createElement("option");
    option.value = patientValue;
    option.textContent = patientValue;
    patientInput.appendChild(option);
  };

  const loadPatientOptionsFromUsers = () => {
    getStoredUsers()
      .filter((user) => {
        const normalizedRole = normalizeRoleValue(user.role);
        return normalizedRole === "cliente" || normalizedRole === "client";
      })
      .forEach((user) => {
        addPatientOption(buildPatientLabel(user.name, user.email));
      });
  };

  const setNewPatientMode = (isActive) => {
    newPatientFields.classList.toggle("d-none", !isActive);

    [newPatientNameInput, newPatientEmailInput, newPatientPhoneInput, newPatientDocumentInput].forEach((input) => {
      input.required = isActive;
      if (!isActive) {
        input.value = "";
        input.setCustomValidity("");
      }
    });
  };

  const buildNewPatientValue = () => (
    buildPatientLabel(newPatientNameInput.value.trim(), newPatientEmailInput.value)
  );

  const loadSpecialistOptions = () => {
    getStoredSpecialists().forEach((specialist) => {
      const value = `${specialist.name} - ${specialist.specialty}`;

      if ([...specialistInput.options].some((option) => option.value === value || option.textContent === value)) return;

      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      specialistInput.appendChild(option);
    });
  };

  const getAppointmentsFromTable = () => (
    [...table.querySelectorAll(".appointment-row")].map((row) => normalizeAppointment({
      id: row.dataset.id,
      patient: row.dataset.patient,
      patientName: row.dataset.patientName,
      patientEmail: row.dataset.patientEmail,
      patientPhone: row.dataset.patientPhone,
      patientDocument: row.dataset.patientDocument,
      specialist: row.dataset.specialist,
      date: row.dataset.date,
      time: row.dataset.time,
      reason: row.dataset.reason,
      notes: row.dataset.notes,
      status: row.dataset.status,
      channel: row.dataset.channel,
      createdAt: row.dataset.createdAt,
      createdByEmail: row.dataset.createdByEmail,
      createdByRole: row.dataset.createdByRole,
    }))
  );

  const saveAppointments = () => {
    saveStoredAppointments(getAppointmentsFromTable());
  };

  const setFormMode = (mode) => {
    const isEditing = mode === "edit";

    submitButton.textContent = isEditing ? "Actualizar Cita" : "Asignar Cita";
    editActions.classList.toggle("d-none", !isEditing);
  };

  const clearSelection = () => {
    selectedAppointmentRow?.classList.remove("is-selected");
    selectedAppointmentRow = null;
    form.reset();
    form.classList.remove("was-validated");
    setNewPatientMode(false);
    setFormMode("create");
    validateAppointmentSchedule(dateInput, timeInput);
    clearManagedFormDraft(secretaryFormConfig);
  };

  const buildAppointmentRow = (appointment) => {
    const normalizedAppointment = normalizeAppointment(appointment);
    const row = document.createElement("tr");
    const isConfirmed = normalizedAppointment.status === "Confirmada";

    row.className = "appointment-row";
    row.dataset.id = normalizedAppointment.id;
    row.dataset.patient = normalizedAppointment.patient;
    row.dataset.patientName = normalizedAppointment.patientName;
    row.dataset.patientEmail = normalizedAppointment.patientEmail;
    row.dataset.patientPhone = normalizedAppointment.patientPhone;
    row.dataset.patientDocument = normalizedAppointment.patientDocument;
    row.dataset.specialist = normalizedAppointment.specialist;
    row.dataset.date = normalizedAppointment.date;
    row.dataset.time = normalizedAppointment.time;
    row.dataset.reason = normalizedAppointment.reason;
    row.dataset.notes = normalizedAppointment.notes;
    row.dataset.status = normalizedAppointment.status;
    row.dataset.channel = normalizedAppointment.channel;
    row.dataset.createdAt = normalizedAppointment.createdAt;
    row.dataset.createdByEmail = normalizedAppointment.createdByEmail;
    row.dataset.createdByRole = normalizedAppointment.createdByRole;
    row.innerHTML = `
      <td>${normalizedAppointment.time}</td>
      <td>${getShortName(normalizedAppointment.patient)}</td>
      <td>${getShortName(normalizedAppointment.specialist)}</td>
      <td><span class="status-pill ${isConfirmed ? "status-active" : "status-pending"}">${normalizedAppointment.status}</span></td>
    `;

    return row;
  };

  const renderAppointments = (appointments) => {
    table.innerHTML = "";
    sortAppointmentsByDateTime(appointments).forEach((appointment) => {
      addPatientOption(appointment.patient);
      table.appendChild(buildAppointmentRow(appointment));
    });
  };

  const loadAppointments = () => {
    const storedAppointments = getStoredAppointments();

    if (storedAppointments.length > 0) {
      renderAppointments(storedAppointments);
      return;
    }

    const bootstrapAppointments = getAppointmentsFromTable();

    if (bootstrapAppointments.length === 0) {
      saveAppointments();
      return;
    }

    saveStoredAppointments(bootstrapAppointments);
    renderAppointments(bootstrapAppointments);
  };

  const populateFormFromRow = (row) => {
    selectedAppointmentRow?.classList.remove("is-selected");
    selectedAppointmentRow = row;
    selectedAppointmentRow.classList.add("is-selected");

    addPatientOption(row.dataset.patient);
    patientInput.value = row.dataset.patient;
    setNewPatientMode(false);
    specialistInput.value = row.dataset.specialist;
    dateInput.value = row.dataset.date;
    timeInput.value = row.dataset.time;
    reasonInput.value = row.dataset.reason;
    notesInput.value = row.dataset.notes;
    form.classList.remove("was-validated");
    setFormMode("edit");
    validateAppointmentSchedule(dateInput, timeInput);
  };

  loadPatientOptionsFromUsers();
  loadSpecialistOptions();
  loadAppointments();
  restoreManagedFormDraft(form, secretaryFormConfig);
  setNewPatientMode(patientInput.value === "new-patient");
  validateAppointmentSchedule(dateInput, timeInput);
  dateInput.addEventListener("change", () => validateAppointmentSchedule(dateInput, timeInput));
  timeInput.addEventListener("change", () => validateAppointmentSchedule(dateInput, timeInput));
  timeInput.addEventListener("input", () => validateAppointmentSchedule(dateInput, timeInput));

  table.addEventListener("click", (event) => {
    const row = event.target.closest(".appointment-row");
    if (!row) return;

    populateFormFromRow(row);
  });

  patientInput.addEventListener("change", () => {
    if (patientInput.value === "new-patient") {
      selectedAppointmentRow?.classList.remove("is-selected");
      selectedAppointmentRow = null;
      setNewPatientMode(true);
      setFormMode("create");
      return;
    }

    setNewPatientMode(false);
  });

  clearButton.addEventListener("click", clearSelection);

  cancelButton.addEventListener("click", () => {
    if (!selectedAppointmentRow) return;

    selectedAppointmentRow.remove();
    saveAppointments();
    clearSelection();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    validateAppointmentSchedule(dateInput, timeInput);

    if (!form.checkValidity()) return;

    const isNewPatient = patientInput.value === "new-patient";
    const patient = isNewPatient
      ? buildNewPatientValue()
      : patientInput.value;

    if (isNewPatient) {
      addPatientOption(patient);
      patientInput.value = patient;
    }

    const patientEmail = isNewPatient
      ? normalizeEmail(newPatientEmailInput.value)
      : normalizeEmail(getEmailFromPatientLabel(patient));
    const patientName = isNewPatient
      ? newPatientNameInput.value.trim()
      : getShortName(patient);
    const appointment = normalizeAppointment({
      id: selectedAppointmentRow?.dataset.id,
      patient,
      patientName,
      patientEmail,
      patientPhone: isNewPatient ? newPatientPhoneInput.value.trim() : selectedAppointmentRow?.dataset.patientPhone,
      patientDocument: isNewPatient ? newPatientDocumentInput.value.trim() : selectedAppointmentRow?.dataset.patientDocument,
      specialist: specialistInput.value,
      date: dateInput.value,
      time: timeInput.value,
      reason: reasonInput.value,
      notes: notesInput.value.trim(),
      status: selectedAppointmentRow?.dataset.status ?? "Pendiente",
      channel: selectedAppointmentRow?.dataset.channel ?? "internal",
      createdAt: selectedAppointmentRow?.dataset.createdAt ?? new Date().toISOString(),
      createdByEmail: selectedAppointmentRow?.dataset.createdByEmail ?? normalizeEmail(getCurrentUser()?.email),
      createdByRole: selectedAppointmentRow?.dataset.createdByRole ?? normalizeRoleValue(getCurrentUser()?.role ?? "secretario"),
    });
    const currentAppointments = getAppointmentsFromTable();

    if (hasAppointmentConflict(currentAppointments, appointment, selectedAppointmentRow?.dataset.id ?? "")) {
      timeInput.setCustomValidity("Ese horario ya esta ocupado para el especialista seleccionado.");
      form.reportValidity();
      return;
    }

    timeInput.setCustomValidity("");

    if (patientEmail) {
      const storedUsers = getStoredUsers();
      const existingUser = storedUsers.find((user) => normalizeEmail(user.email) === patientEmail);

      if (!existingUser) {
        storedUsers.push({
          name: patientName,
          email: patientEmail,
          role: "Cliente",
          status: "Activo",
        });
        saveStoredUsers(storedUsers);
      }
    }

    const row = buildAppointmentRow(appointment);

    if (selectedAppointmentRow) {
      selectedAppointmentRow.replaceWith(row);
    } else {
      table.appendChild(row);
    }

    saveAppointments();
    clearManagedFormDraft(secretaryFormConfig);
    renderAppointments(getStoredAppointments());
    clearSelection();
  });
};

const initClientDashboard = () => {
  const form = document.getElementById("clientAppointmentForm");
  const table = document.getElementById("clientAppointmentsTable");
  const patientNameInput = document.getElementById("clientPatientName");
  const patientEmailInput = document.getElementById("clientPatientEmail");
  const specialistInput = document.getElementById("clientSpecialistSelect");
  const dateInput = document.getElementById("clientAppointmentDate");
  const timeInput = document.getElementById("clientAppointmentTime");
  const reasonInput = document.getElementById("clientAppointmentReason");
  const notesInput = document.getElementById("clientAppointmentNotes");
  const sessionName = document.getElementById("clientSessionName");
  const sessionEmail = document.getElementById("clientSessionEmail");

  if (
    !form ||
    !table ||
    !patientNameInput ||
    !patientEmailInput ||
    !specialistInput ||
    !dateInput ||
    !timeInput ||
    !reasonInput ||
    !notesInput ||
    !sessionName ||
    !sessionEmail
  ) return;

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  const clientFormConfig = getManagedFormConfig(form.id);
  const getShortName = (value) => String(value ?? "").split(" - ")[0];

  const populateSessionFields = () => {
    sessionName.textContent = currentUser.name ?? "Cliente";
    sessionEmail.textContent = currentUser.email ?? "";
    patientNameInput.value = currentUser.name ?? "";
    patientEmailInput.value = currentUser.email ?? "";
  };

  const loadSpecialists = () => {
    specialistInput.innerHTML = '<option value="">Seleccionar especialista</option>';

    getStoredSpecialists().forEach((specialist) => {
      const option = document.createElement("option");
      option.value = `${specialist.name} - ${specialist.specialty}`;
      option.textContent = option.value;
      specialistInput.appendChild(option);
    });
  };

  const getUserAppointments = () => (
    getStoredAppointments().filter((appointment) => (
      normalizeEmail(appointment.patientEmail) === currentUser.email ||
      normalizeEmail(appointment.createdByEmail) === currentUser.email ||
      normalizeEmail(getEmailFromPatientLabel(appointment.patient)) === currentUser.email
    ))
  );

  const renderAppointments = () => {
    const appointments = getUserAppointments();

    if (appointments.length === 0) {
      table.innerHTML = '<tr><td colspan="5">No tienes citas registradas todavia.</td></tr>';
      return;
    }

    table.innerHTML = sortAppointmentsByDateTime(appointments).map((appointment) => `
      <tr>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td>${getShortName(appointment.specialist)}</td>
        <td>${appointment.reason}</td>
        <td><span class="status-pill ${appointment.status === "Confirmada" ? "status-active" : "status-pending"}">${appointment.status}</span></td>
      </tr>
    `).join("");
  };

  const resetForm = () => {
    form.reset();
    populateSessionFields();
    form.classList.remove("was-validated");
    validateAppointmentSchedule(dateInput, timeInput);
    clearManagedFormDraft(clientFormConfig);
  };

  populateSessionFields();
  loadSpecialists();
  restoreManagedFormDraft(form, clientFormConfig);
  populateSessionFields();
  validateAppointmentSchedule(dateInput, timeInput);
  renderAppointments();

  dateInput.addEventListener("change", () => validateAppointmentSchedule(dateInput, timeInput));
  timeInput.addEventListener("change", () => validateAppointmentSchedule(dateInput, timeInput));
  timeInput.addEventListener("input", () => validateAppointmentSchedule(dateInput, timeInput));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeFormAlert(form);
    form.classList.add("was-validated");
    validateAppointmentSchedule(dateInput, timeInput);

    if (!form.checkValidity()) {
      return;
    }

    const appointment = normalizeAppointment({
      patient: buildPatientLabel(currentUser.name, currentUser.email),
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      patientPhone: currentUser.phone ?? "",
      specialist: specialistInput.value,
      date: dateInput.value,
      time: timeInput.value,
      reason: reasonInput.value,
      notes: notesInput.value.trim(),
      status: "Pendiente",
      channel: "client-dashboard",
      createdAt: new Date().toISOString(),
      createdByEmail: currentUser.email,
      createdByRole: currentUser.role,
    });
    const appointments = getStoredAppointments();

    if (hasAppointmentConflict(appointments, appointment)) {
      timeInput.setCustomValidity("Ese horario ya esta ocupado para el especialista seleccionado.");
      form.reportValidity();
      return;
    }

    timeInput.setCustomValidity("");
    appointments.push(appointment);
    saveStoredAppointments(appointments);

    if (clientFormConfig) {
      const payload = buildFormPayload(form, clientFormConfig);
      payload.data = {
        ...payload.data,
        status: appointment.status,
        channel: appointment.channel,
      };
      queueManagedSubmission(clientFormConfig, payload);
    }

    showFormAlert(form, "Tu cita quedo registrada localmente y ya es visible para administracion y secretaria.");
    renderAppointments();
    resetForm();
  });
};

const initAdminDashboard = () => {
  const workspace = document.getElementById("adminWorkspace");
  const workspaceTitle = document.getElementById("adminWorkspaceTitle");
  const workspaceDescription = document.getElementById("adminWorkspaceDescription");
  const viewButtons = document.querySelectorAll("[data-admin-view]");

  if (!workspace || !workspaceTitle || !workspaceDescription || viewButtons.length === 0) return;

  const usersKey = "oralLuanmAdminUsers";
  const specialistsKey = "oralLuanmSpecialists";
  const permissionsKey = "oralLuanmTeamPermissions";
  const appointmentsKey = "oralLuanmAppointments";

  const defaultUsers = [
    { name: "Juan Administrador", email: "juan@correo.com", role: "Admin", status: "Activo" },
    { name: "Secretaria Clinica", email: "secre@correo.com", role: "Secretario", status: "Activo" },
    { name: "Sara Cliente", email: "sara@correo.com", role: "Cliente", status: "Activo" },
    { name: "Laura Perez", email: "laura.paciente@correo.com", role: "Cliente", status: "Seguimiento" },
    { name: "Carlos Rojas", email: "carlos.rojas@correo.com", role: "Cliente", status: "Activo" },
  ];
  const defaultSpecialists = [
    { name: "Dra. Maudy Luanm", email: "maudy@oralluanm.com", specialty: "Ortodoncia", status: "Activo" },
    { name: "Dr. Ramirez", email: "ramirez@oralluanm.com", specialty: "Implantologia", status: "Activo" },
    { name: "Dra. Gomez", email: "gomez@oralluanm.com", specialty: "Higiene oral", status: "Activo" },
  ];
  const defaultPermissions = {
    "juan@correo.com": ["appointments", "patients", "admins", "permissions", "specialists"],
    "secre@correo.com": ["appointments", "patients"],
  };

  const readStorage = (key, fallback) => {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getUsers = () => readStorage(usersKey, defaultUsers);
  const getSpecialists = () => readStorage(specialistsKey, defaultSpecialists);
  const getPermissions = () => readStorage(permissionsKey, defaultPermissions);
  const getAppointments = () => readStorage(appointmentsKey, []);

  const setWorkspaceHeader = (title, description) => {
    workspaceTitle.textContent = title;
    workspaceDescription.textContent = description;
  };

  const updateMetricCounts = () => {
    const users = getUsers();
    const appointments = getAppointments();
    const specialists = getSpecialists();

    document.getElementById("adminUsersCount").textContent = users.filter((user) => user.status === "Activo").length;
    document.getElementById("adminAppointmentsCount").textContent = appointments.length;
    document.getElementById("adminSpecialistsCount").textContent = specialists.length;
    document.getElementById("adminAdminsCount").textContent = users.filter((user) => user.role === "Admin").length;
  };

  const renderUserRows = (users) => users.map((user) => `
    <tr>
      <td><strong>${user.name}</strong><span>${user.email}</span></td>
      <td>${user.role}</td>
      <td><span class="status-pill ${user.status === "Activo" ? "status-active" : "status-pending"}">${user.status}</span></td>
      <td>${getPermissions()[user.email]?.length ?? 0} permisos</td>
    </tr>
  `).join("");

  const renderUsers = () => {
    setWorkspaceHeader("Usuarios activos", "Crea usuarios internos, clientes y auxiliares administrativos.");
    workspace.innerHTML = `
      <div class="admin-grid">
        <form class="admin-inline-form" id="adminUserForm" novalidate>
          <h3>Crear usuario</h3>
          <input class="form-control" id="adminUserName" name="adminUserName" placeholder="Nombre completo" minlength="3" maxlength="80" required>
          <div class="invalid-feedback">Ingresa un nombre valido.</div>
          <input type="email" class="form-control" id="adminUserEmail" name="adminUserEmail" placeholder="correo@ejemplo.com" required>
          <div class="invalid-feedback">Ingresa un correo valido.</div>
          <select class="form-select" id="adminUserRole" name="adminUserRole" required>
            <option>Cliente</option>
            <option>Secretario</option>
            <option>Admin</option>
          </select>
          <div class="invalid-feedback">Selecciona un rol.</div>
          <button class="btn btn-primary" type="submit">Guardar Usuario</button>
        </form>
        <div class="table-responsive">
          <table class="table admin-table align-middle">
            <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Permisos</th></tr></thead>
            <tbody>${renderUserRows(getUsers())}</tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("adminUserForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const users = getUsers();
      const email = document.getElementById("adminUserEmail").value.trim().toLowerCase();
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        existingUser.name = document.getElementById("adminUserName").value.trim();
        existingUser.role = document.getElementById("adminUserRole").value;
      } else {
        users.push({
          name: document.getElementById("adminUserName").value.trim(),
          email,
          role: document.getElementById("adminUserRole").value,
          status: "Activo",
        });
      }

      writeStorage(usersKey, users);
      updateMetricCounts();
      renderUsers();
    });
  };

  const renderAppointments = () => {
    setWorkspaceHeader("Listado de citas", "Consulta las citas creadas desde el panel de secretaria.");
    const appointments = getAppointments();

    workspace.innerHTML = `
      <div class="table-responsive">
        <table class="table admin-table align-middle">
          <thead><tr><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Especialista</th><th>Motivo</th><th>Estado</th></tr></thead>
          <tbody>
            ${appointments.map((appointment) => `
              <tr>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.patient}</td>
                <td>${appointment.specialist}</td>
                <td>${appointment.reason}</td>
                <td><span class="status-pill ${appointment.status === "Confirmada" ? "status-active" : "status-pending"}">${appointment.status}</span></td>
              </tr>
            `).join("") || `<tr><td colspan="6">No hay citas registradas.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderSpecialists = () => {
    setWorkspaceHeader("Especialistas", "Crea especialistas para que aparezcan en la lista de agendamiento.");
    workspace.innerHTML = `
      <div class="admin-grid">
        <form class="admin-inline-form" id="adminSpecialistForm" novalidate>
          <h3>Crear especialista</h3>
          <input class="form-control" id="specialistName" name="specialistName" placeholder="Nombre del especialista" minlength="3" maxlength="80" required>
          <div class="invalid-feedback">Ingresa un nombre valido.</div>
          <input type="email" class="form-control" id="specialistEmail" name="specialistEmail" placeholder="correo@oralluanm.com" required>
          <div class="invalid-feedback">Ingresa un correo valido.</div>
          <input class="form-control" id="specialistSpecialty" name="specialistSpecialty" placeholder="Especialidad" minlength="3" maxlength="80" required>
          <div class="invalid-feedback">Ingresa una especialidad valida.</div>
          <button class="btn btn-primary" type="submit">Guardar Especialista</button>
        </form>
        <div class="table-responsive">
          <table class="table admin-table align-middle">
            <thead><tr><th>Especialista</th><th>Especialidad</th><th>Estado</th></tr></thead>
            <tbody>
              ${getSpecialists().map((specialist) => `
                <tr>
                  <td><strong>${specialist.name}</strong><span>${specialist.email}</span></td>
                  <td>${specialist.specialty}</td>
                  <td><span class="status-pill status-active">${specialist.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("adminSpecialistForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const specialists = getSpecialists();
      const email = document.getElementById("specialistEmail").value.trim().toLowerCase();
      const existingSpecialist = specialists.find((specialist) => specialist.email === email);

      if (existingSpecialist) {
        existingSpecialist.name = document.getElementById("specialistName").value.trim();
        existingSpecialist.specialty = document.getElementById("specialistSpecialty").value.trim();
      } else {
        specialists.push({
          name: document.getElementById("specialistName").value.trim(),
          email,
          specialty: document.getElementById("specialistSpecialty").value.trim(),
          status: "Activo",
        });
      }

      writeStorage(specialistsKey, specialists);
      updateMetricCounts();
      renderSpecialists();
    });
  };

  const renderAdmins = () => {
    setWorkspaceHeader("Administradores y permisos", "Asigna permisos por usuario y habilita nuevos administradores.");
    const users = getUsers().filter((user) => user.role === "Admin" || user.role === "Secretario");
    const permissions = getPermissions();
    const permissionItems = [
      ["appointments", "Gestionar citas"],
      ["patients", "Ver pacientes"],
      ["admins", "Crear administradores"],
      ["permissions", "Editar permisos"],
      ["specialists", "Crear especialistas"],
    ];

    workspace.innerHTML = `
      <div class="admin-grid">
        <form class="admin-inline-form" id="adminPermissionsForm">
          <h3>Permisos del equipo</h3>
          <select class="form-select" id="adminPermissionUser">
            ${users.map((user) => `<option value="${user.email}">${user.name} - ${user.role}</option>`).join("")}
          </select>
          <div class="permission-list">
            ${permissionItems.map(([value, label]) => `
              <label><input type="checkbox" value="${value}"> ${label}</label>
            `).join("")}
          </div>
          <button type="submit" class="btn btn-primary">Guardar Permisos</button>
        </form>
        <div class="table-responsive">
          <table class="table admin-table align-middle">
            <thead><tr><th>Usuario</th><th>Rol</th><th>Permisos</th></tr></thead>
            <tbody>${renderUserRows(users)}</tbody>
          </table>
        </div>
      </div>
    `;

    const userSelect = document.getElementById("adminPermissionUser");
    const permissionChecks = [...workspace.querySelectorAll("#adminPermissionsForm input[type='checkbox']")];

    const syncChecks = () => {
      const activePermissions = permissions[userSelect.value] ?? [];
      permissionChecks.forEach((input) => {
        input.checked = activePermissions.includes(input.value);
      });
    };

    userSelect.addEventListener("change", syncChecks);
    syncChecks();

    document.getElementById("adminPermissionsForm").addEventListener("submit", (event) => {
      event.preventDefault();
      permissions[userSelect.value] = permissionChecks
        .filter((input) => input.checked)
        .map((input) => input.value);
      writeStorage(permissionsKey, permissions);
      renderAdmins();
    });
  };

  const renderView = (view) => {
    viewButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.adminView === view);
    });

    if (view === "appointments") renderAppointments();
    if (view === "specialists") renderSpecialists();
    if (view === "admins") renderAdmins();
    if (view === "users") renderUsers();
  };

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => renderView(button.dataset.adminView));
  });

  updateMetricCounts();
  renderUsers();
};

const initServices = () => {
  const container = document.getElementById("servicios-container");

  if (!container || typeof SERVICES === "undefined") return;

  SERVICES.forEach((service, index) => {
    const isReverse = index % 2 !== 0;

    const card = document.createElement("article");
    card.className = `servicio-card ${isReverse ? "reverse" : ""}`;

    card.innerHTML = `
      <div class="servicio-card__content">
        <h2 class="servicio-card__title">${service.titulo}</h2>
        <p class="servicio-card__text">${service.descripcion}</p>
      </div>

      <figure class="servicio-card__image">
        <img src="${service.imagen}" alt="${service.titulo}">
      </figure>
    `;

    container.appendChild(card);
  });
};

const initSpecialists = () => {
  const container = document.getElementById("especialistas-container");

  if (!container || typeof SPECIALISTS === undefined) return;

  SPECIALISTS.forEach((specialist) => {
    const card = document.createElement("article");
    card.className = "especialistas-card";

    card.innerHTML = `
      <figure class="especialista-card__image">
          <img
            src="${specialist.imagen}"
            alt="${specialist.nombre}">
      </figure>

      <div class="especialista-card__body">
          <h3 class="especialista-card__name">
              ${specialist.nombre}
          </h3>

          <p class="especialista-card__specialty">
              ${specialist.especialidad}
          </p>
      </div>
    `;

    container.appendChild(card);
  });
};

const initApp = async () => {
  await Promise.all([loadSiteData(), loadFormsConfig()]);
  ensureBaseData();
  await loadComponents();
  applySiteData();
  initNavbar();
  initRevealAnimations();
  initProtectedViews();
  initFormValidation();
  initAuthModals();
  initSecretaryAppointments();
  initClientDashboard();
  initAdminDashboard();
  initServices();
  initSpecialists();
};

initApp().catch((error) => {
  console.error(error);
});
