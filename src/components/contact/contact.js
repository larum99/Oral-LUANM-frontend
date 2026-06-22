import contactTemplate from "./contact.html?raw";

const CONTACT_DRAFT_STORAGE_KEY = "oralluanm-contact-draft";
const CONTACT_SUBMISSION_STORAGE_KEY = "oralluanm-contact-last-submission";

function canUseLocalStorage() {
  try {
    const probeKey = "__oralluanm_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

function readDraft() {
  if (!canUseLocalStorage()) {
    return {};
  }

  try {
    const value = window.localStorage.getItem(CONTACT_DRAFT_STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function writeDraft(values) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(CONTACT_DRAFT_STORAGE_KEY, JSON.stringify(values));
}

function clearDraft() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY);
}

function writeLastSubmission(values) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    CONTACT_SUBMISSION_STORAGE_KEY,
    JSON.stringify({
      ...values,
      submittedAt: new Date().toISOString(),
    }),
  );
}

function getFormValues(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function applyDraft(form, values) {
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (
      (field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement) &&
      typeof value === "string"
    ) {
      field.value = value;
    }
  });
}

export function createContact() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = contactTemplate;

  const section = wrapper.firstElementChild;
  if (!section) {
    throw new Error("Contact template could not be rendered");
  }

  const form = section.querySelector(".contact-form");
  const status = section.querySelector(".contact-form__status");

  if (form instanceof HTMLFormElement && status instanceof HTMLElement) {
    const url = new URL(window.location.href);
    const selectedService = url.searchParams.get("service");
    const draft = readDraft();

    applyDraft(form, draft);

    const serviceField = form.elements.namedItem("service");
    if (serviceField instanceof HTMLSelectElement && selectedService) {
      serviceField.value = selectedService;
    }

    form.addEventListener("input", () => {
      writeDraft(getFormValues(form));
    });

    form.addEventListener("change", () => {
      writeDraft(getFormValues(form));
    });

      form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.classList.add("is-submitted");

      if (!form.checkValidity()) {
        status.textContent = "Completa los campos requeridos antes de enviar.";
        status.dataset.state = "error";
        return;
      }

      const values = getFormValues(form);
      writeLastSubmission(values);
      clearDraft();
      status.textContent =
        "Mensaje guardado correctamente. El formulario ya usa localStorage para conservar borradores locales.";
      status.dataset.state = "success";
      form.reset();
      form.classList.remove("is-submitted");
    });
  }

  return section;
}
