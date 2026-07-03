const PROJECT_ROOT_FOLDER = "Oral-LUANM-frontend";

const DEFAULT_SITE_DATA = {
  brand: {
    name: "ORAL LUANM",
    logoHtml: "ORAL<span> LUANM</span>",
    description: "Clinica dental enfocada en brindar tratamientos con excelencia clinica, etica profesional y tecnologia medica innovadora.",
    copyright: "&copy; 2026 ORAL LUANM. Todos los derechos reservados.",
  },
  navigation: {
    contact: "Contacto",
    services: "Servicios",
  },
  buttons: {
    login: "Iniciar Sesion",
    logout: "Cerrar Sesion",
    appointment: "Agendar Cita",
    submitAppointment: "Confirmar Solicitud",
    loginSubmit: "Ingresar",
    register: "Registrarse",
    sendMessage: "Enviar Mensaje",
    goContact: "Ir a contacto",
  },
  session: {
    active: "Sesion activa",
  },
  contact: {
    addressShort: "Av. Principal Nro 123-45, Bogota.",
    addressLong: "Av. Principal Nro 123-45, Centro Medico Premium, Consultorio 502, Bogota, Colombia.",
    phone: "+57 300 123 4567",
    phoneLinesHtml: "PBX: (601) 123-4567<br>Movil: +57 300 123 4567",
    email: "oral.luanm@gmail.com",
    emailLinesHtml: "oral.luanm@gmail.com<br>info@oralluanm.com",
    scheduleHtml: "Lunes a Viernes: 8:00 AM - 6:00 PM<br>Sabados: 9:00 AM - 1:00 PM",
    mapTitle: "Mapa interactivo de ubicacion de la clinica ORAL LUANM",
  },
  home: {
    tag: "ORAL LUANM",
    title: "Atencion odontologica cercana y profesional",
    lead: "Encuentra nuestros canales de atencion, horarios, ubicacion y formulario de contacto.",
  },
  contactPage: {
    tag: "Canales de Atencion",
    title: "Ponte en Contacto",
    lead: "Tienes dudas, sugerencias o deseas agendar una consulta personalizada? Estamos listos para ayudarte a dar el primer paso.",
    generalTitle: "Informacion General",
    generalText: "Visitanos en nuestra sede o comunicate por cualquiera de nuestros canales de atencion al paciente.",
    addressTitle: "Nuestra Sede",
    phoneTitle: "Lineas de Atencion",
    emailTitle: "Correo Electronico",
    scheduleTitle: "Horarios de Consulta",
    formTitle: "Envianos un Mensaje",
    mapTag: "Ubicacion",
    mapHeading: "Encuentranos facilmente",
  },
  forms: {
    name: "Nombre Completo",
    email: "Correo Electronico",
    emailLower: "Correo electronico",
    phone: "Telefono",
    contactPhone: "Telefono de Contacto",
    password: "Contrasena",
    message: "Mensaje o Consulta",
    forgotPassword: "Olvide mi contrasena",
    fullNamePlaceholder: "Ej. Juan Perez",
    emailPlaceholder: "Ej. juan@correo.com",
    phonePlaceholder: "Ej. 3001234567",
    messagePlaceholder: "Escribe aqui tus dudas detalladamente...",
  },
  modals: {
    loginTitle: "Iniciar Sesion",
    registerTitle: "Registra Tu Cuenta",
    appointmentTitle: "Agendar Cita",
  },
  footer: {
    navigationTitle: "Navegacion",
    scheduleContactTitle: "Horarios & Contacto",
  },
};

const LOCAL_COMPONENTS = {
  header: `
<header>
  <nav class="navbar navbar-expand-lg fixed-top" aria-label="Menu principal de navegacion">
    <div class="container">
      <a class="navbar-brand" href="{{HOME_PATH}}">
        <i class="bi bi-heart-pulse-fill text-primary" aria-hidden="true"></i>
        <span data-html="brand.logoHtml">ORAL<span> LUANM</span></span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegacion">
        <i class="bi bi-list fs-2 text-dark"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item nav-link-item me-lg-3"><a class="nav-link active" aria-current="page" href="{{CONTACT_PATH}}" data-text="navigation.contact">Contacto</a></li>
          <li class="nav-item nav-link-item me-lg-3"><a class="nav-link active" aria-current="page" href="{{SERVICE_PATH}}" data-text="navigation.services">Servicios</a></li>
          <li class="nav-item nav-action-item mt-3 mt-lg-0 me-lg-3">
            <button class="btn btn-outline-primary" data-auth-login-button data-bs-toggle="modal" data-bs-target="#loginModal" data-text="buttons.login">Iniciar Sesion</button>
          </li>
          <li class="nav-item mt-3 mt-lg-0 ms-lg-3 d-none" data-header-session>
            <div class="header-session-info">
              <span data-text="session.active">Sesion activa</span>
              <strong data-session-name></strong>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>
`,
  footer: `
<footer class="footer">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <a class="navbar-brand footer-brand mb-3" href="{{HOME_PATH}}">
          <i class="bi bi-heart-pulse-fill text-primary" aria-hidden="true"></i>
          <span data-html="brand.logoHtml">ORAL<span> LUANM</span></span>
        </a>
        <p class="small mt-3" data-text="brand.description">Clinica dental enfocada en brindar tratamientos con excelencia clinica, etica profesional y tecnologia medica innovadora.</p>
        <div class="social-icons mt-4">
          <a href="https://instagram.com/oral.luanm" class="social-btn" aria-label="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a>
          <a href="https://wa.me/573001234567" class="social-btn" aria-label="WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a>
        </div>
      </div>

      <div class="col-md-6 col-lg-2 offset-lg-1">
        <h4 data-text="footer.navigationTitle">Navegacion</h4>
        <ul class="footer-links">
          <li><a href="{{CONTACT_PATH}}" data-text="navigation.contact">Contacto</a></li>
        </ul>
        <ul class="footer-links">
          <li><a href="{{SERVICE_PATH}}" data-text="navigation.services">Servicios</a></li>
        </ul>
      </div>

      <div class="col-md-6 col-lg-3">
        <h4 data-text="footer.scheduleContactTitle">Horarios & Contacto</h4>
        <ul class="footer-links footer-contact">
          <li><i class="bi bi-geo-alt-fill text-primary" aria-hidden="true"></i><span data-text="contact.addressShort">Av. Principal Nro 123-45, Bogota.</span></li>
          <li><i class="bi bi-telephone-fill text-primary" aria-hidden="true"></i><span data-text="contact.phone">+57 300 123 4567</span></li>
          <li><i class="bi bi-envelope-fill text-primary" aria-hidden="true"></i><span data-text="contact.email">oral.luanm@gmail.com</span></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom text-center">
      <p class="mb-0" data-html="brand.copyright">&copy; 2026 ORAL LUANM. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>

<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header border-bottom-0 pb-0">
        <h2 class="modal-title h5 fw-bold d-flex align-items-center gap-2" id="loginModalLabel">
          <i class="bi bi-person-circle text-primary" aria-hidden="true"></i> <span data-text="modals.loginTitle">Iniciar Sesion</span>
        </h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar modal"></button>
      </div>
      <div class="modal-body">
        <form class="needs-validation auth-form" novalidate id="formModalLogin">
          <div class="mb-3">
            <label for="loginEmail" class="form-label fw-semibold"><span data-text="forms.emailLower">Correo electronico</span> <span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="loginEmail" placeholder="Ej. juan@correo.com" data-placeholder="forms.emailPlaceholder" required>
            <div class="invalid-feedback">Por favor, ingresa tu correo electronico.</div>
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label fw-semibold"><span data-text="forms.password">Contrasena</span> <span class="text-danger">*</span></label>
            <input type="password" class="form-control" id="loginPassword" placeholder="********" required>
            <div class="invalid-feedback">Por favor, ingresa tu contrasena.</div>
          </div>
          <a class="auth-link" href="{{RECOVERY_PATH}}" data-text="forms.forgotPassword">Olvide mi contrasena</a>
          <button type="submit" class="btn btn-primary w-100" data-text="buttons.loginSubmit">Ingresar</button>
        </form>
        <button type="button" class="btn btn-outline-primary w-100 mt-3" id="btnOpenRegister">
          <i class="bi bi-person-plus" aria-hidden="true"></i>
          <span data-text="buttons.register">Registrarse</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header border-bottom-0 pb-0">
        <h2 class="modal-title h5 fw-bold d-flex align-items-center gap-2" id="registerModalLabel">
          <i class="bi bi-person-vcard text-primary" aria-hidden="true"></i> <span data-text="modals.registerTitle">Registra Tu Cuenta</span>
        </h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar modal"></button>
      </div>
      <div class="modal-body">
        <form class="needs-validation auth-form" novalidate id="formModalRegister">
          <div class="mb-3">
            <label for="registerName" class="form-label fw-semibold">Nombre completo <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="registerName" placeholder="Ej. Juan Perez" required>
            <div class="invalid-feedback">Por favor, ingresa tu nombre completo.</div>
          </div>
          <div class="mb-3">
            <label for="registerEmail" class="form-label fw-semibold">Correo electronico <span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="registerEmail" placeholder="Ej. juan@correo.com" required>
            <div class="invalid-feedback">Por favor, ingresa tu correo electronico.</div>
          </div>
          <div class="mb-3">
            <label for="registerPhone" class="form-label fw-semibold">Telefono <span class="text-danger">*</span></label>
            <input type="tel" class="form-control" id="registerPhone" placeholder="Ej. 3001234567" required pattern="[0-9]{7,15}">
            <div class="invalid-feedback">Por favor, ingresa un telefono valido.</div>
          </div>
          <div class="mb-3">
            <label for="registerPassword" class="form-label fw-semibold">Contrasena <span class="text-danger">*</span></label>
            <input type="password" class="form-control" id="registerPassword" placeholder="********" required>
            <div class="invalid-feedback">Por favor, ingresa tu contrasena.</div>
          </div>
          <button type="submit" class="btn btn-primary w-100">Registrarse</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="appointmentModal" tabindex="-1" aria-labelledby="appointmentModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header border-bottom-0 pb-0">
        <h2 class="modal-title h5 fw-bold d-flex align-items-center gap-2" id="appointmentModalLabel">
                <i class="bi bi-calendar-check text-primary" aria-hidden="true"></i> <span data-text="modals.appointmentTitle">Agendar Cita</span>
        </h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar modal"></button>
      </div>
      <div class="modal-body">
        <form class="needs-validation" novalidate id="formModalAppointment">
          <div class="mb-3">
            <label for="modalName" class="form-label fw-semibold"><span data-text="forms.name">Nombre Completo</span> <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="modalName" required>
            <div class="invalid-feedback">Por favor, ingresa tu nombre completo.</div>
          </div>
          <div class="row mb-3 g-3">
            <div class="col-sm-6">
              <label for="modalPhone" class="form-label fw-semibold"><span data-text="forms.phone">Telefono</span> <span class="text-danger">*</span></label>
              <input type="tel" class="form-control" id="modalPhone" required pattern="[0-9]{7,15}">
              <div class="invalid-feedback">Ingresa un telefono valido.</div>
            </div>
            <div class="col-sm-6">
              <label for="modalEmail" class="form-label fw-semibold"><span data-text="forms.emailLower">Correo electronico</span> <span class="text-danger">*</span></label>
              <input type="email" class="form-control" id="modalEmail" required>
              <div class="invalid-feedback">Ingresa un correo valido.</div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100" data-text="buttons.submitAppointment">Confirmar Solicitud</button>
        </form>
      </div>
    </div>
  </div>
</div>
`,
  whatsapp: `
<a href="https://wa.me/{{WHATSAPP_PHONE}}?text=Hola,%20quiero%20agendar%20una%20cita." class="whatsapp-float"
    target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
    <i class="bi bi-whatsapp"></i>
</a>
`,
};

const cloneDefaultSiteData = () => JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));

const isFilePage = () => window.location.protocol === "file:";

const withLocalIndex = (path) => (
  isFilePage() && path.endsWith("/") ? `${path}index.html` : path
);

const getBasePath = () => {
  const parts = window.location.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });

  const projectRootIndex = parts.lastIndexOf(PROJECT_ROOT_FOLDER);
  const scopedParts = projectRootIndex >= 0
    ? parts.slice(projectRootIndex + 1)
    : parts;

  const depth = scopedParts
    .filter((part) =>
      !part.endsWith(".html")
    ).length;

  return depth === 0 ? "./" : "../".repeat(depth);
};

const fillTemplate = (html) => {
  const contactPath = `${getBasePath()}contactanos/`;
  const servicePath = `${getBasePath()}servicios/`;
  const adminPath = `${getBasePath()}registro/admin/`;
  const secretaryPath = `${getBasePath()}registro/secretario/`;
  const homePath = getBasePath();
  const recoveryPath = `${getBasePath()}registro/olvide-contrasena/`;

  const whatsappPhone = siteData.contact.phone.replace(/\D/g, "");

  return html
    .replaceAll("{{BASE_PATH}}", getBasePath())
    .replaceAll("{{CONTACT_PATH}}", withLocalIndex(contactPath))
    .replaceAll("{{SERVICE_PATH}}", withLocalIndex(servicePath))
    .replaceAll("{{ADMIN_PATH}}", withLocalIndex(adminPath))
    .replaceAll("{{SECRETARY_PATH}}", withLocalIndex(secretaryPath))
    .replaceAll("{{HOME_PATH}}", withLocalIndex(homePath))
    .replaceAll("{{RECOVERY_PATH}}", withLocalIndex(recoveryPath))
    .replaceAll("{{WHATSAPP_PHONE}}", whatsappPhone);
}

let siteData = cloneDefaultSiteData();

const getDataValue = (path) => (
  path.split(".").reduce((value, key) => value?.[key], siteData)
);

const loadSiteData = async () => {
  siteData = cloneDefaultSiteData();

  if (isFilePage()) return;

  try {
    const response = await fetch(`${getBasePath()}js/datos.json`);

    if (response.ok) {
      siteData = await response.json();
    }
  } catch {
    siteData = cloneDefaultSiteData();
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

const USERS_STORAGE_KEY = "oralLuanmUsers";

const getRegisteredUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
};


const saveRegisteredUsers = (users) => {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users)
  );
};

const registerUser = (user) => {
  const users = getRegisteredUsers();

  users.push(user);

  saveRegisteredUsers(users);
};

const MOCK_USERS = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Administrador",
    email: "juan@correo.com",
    telefono: "3001234567",
    fechaNacimiento: "1985-08-15",
    tipoDocumento: "Cédula de ciudadanía",
    documento: "100000001",
    password: "123456",
    role: "admin",
    path: "registro/admin/index.html"
  },
  {
    id: 2,
    nombre: "Ana",
    apellido: "Secretaria",
    email: "secre@correo.com",
    telefono: "3007654321",
    fechaNacimiento: "1992-04-10",
    tipoDocumento: "Cédula de ciudadanía",
    documento: "100000002",
    password: "654321",
    role: "secretario",
    path: "registro/secretario/index.html"
  },
  {
    id: 3,
    nombre: "Laura",
    apellido: "Paciente",
    email: "laura@correo.com",
    telefono: "3009876543",
    fechaNacimiento: "2000-09-22",
    tipoDocumento: "Cédula de ciudadanía",
    documento: "100000003",
    password: "123456",
    role: "cliente",
    path: "registro/cliente/index.html"
  }
];

const loadComponent = async (target) => {
  const componentName = target.dataset.component;
  const localComponent = LOCAL_COMPONENTS[componentName];

  if (isFilePage() && localComponent) {
    target.innerHTML = fillTemplate(localComponent);
    return;
  }

  try {
    const response = await fetch(`${getBasePath()}componentes/${componentName}.html`);

    if (response.ok) {
      target.innerHTML = fillTemplate(await response.text());
      return;
    }
  } catch {
    // The local fallback keeps the static pages usable when opened as file://.
  }

  if (localComponent) {
    target.innerHTML = fillTemplate(localComponent);
    return;
  }

  throw new Error(`No se pudo cargar el componente: ${componentName}`);
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
  document.querySelectorAll(".needs-validation").forEach((form) => {
    if (form.id === "formModalLogin") return;
    if (form.id === "secretaryAppointmentForm") return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");

      if (form.checkValidity()) {
        if (form.classList.contains("auth-form") || form.id === "recoveryForm") {
          const previousAlert = form.querySelector(".alert");
          previousAlert?.remove();

          const message = document.createElement("div");
          message.className = "alert alert-success mt-3 alert-dismissible fade show";
          message.setAttribute("role", "alert");
          message.innerHTML = form.id === "recoveryForm"
            ? `
              <strong>Solicitud recibida.</strong> Revisa tu correo para continuar con la recuperacion.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            `
            : `
              <strong>Proceso exitoso.</strong> Bienvenido a la comunidad Oral LUANM.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            `;

          form.appendChild(message);
          setTimeout(() => bootstrap.Alert.getOrCreateInstance(message).close(), 2200);
        }

        form.reset();
        form.classList.remove("was-validated");
      }
    });
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

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();
    const user = MOCK_USERS.find((item) => item.email === email && item.password === password);

    if (!user) {
      localStorage.removeItem("oralLuanmUser");

      const message = document.createElement("div");
      message.className = "alert alert-danger mt-3 mb-0";
      message.setAttribute("role", "alert");
      message.textContent = "Credenciales invalidas. Verifica tu correo y contrasena.";
      loginForm.appendChild(message);
      return;
    }

    localStorage.setItem("oralLuanmUser", JSON.stringify(user));
    window.location.href = withLocalIndex(`${getBasePath()}${user.path}`);
  });

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("login") === "required") {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
  }
};

const initProtectedViews = () => {
  const requiredRole = document.body.dataset.requiredRole;
  const storedUser = localStorage.getItem("oralLuanmUser");
  let currentUser = null;

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("oralLuanmUser");
  }

  if (requiredRole && (!currentUser || (requiredRole !== currentUser.role && currentUser.role !== "admin"))) {
    window.location.href = `${withLocalIndex(getBasePath())}?login=required`;
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

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("oralLuanmUser");
      window.location.href = withLocalIndex(getBasePath());
    });
  });
};

const initSecretaryAppointments = () => {
  const storageKey = "oralLuanmAppointments";
  const specialistsStorageKey = "oralLuanmSpecialists";
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

  let selectedAppointmentRow = null;

  const padTime = (value) => String(value).padStart(2, "0");

  const getMinimumAppointmentDate = () => {
    const minimumDate = new Date(Date.now() + 15 * 60 * 1000);
    const year = minimumDate.getFullYear();
    const month = padTime(minimumDate.getMonth() + 1);
    const day = padTime(minimumDate.getDate());
    const hours = padTime(minimumDate.getHours());
    const minutes = padTime(minimumDate.getMinutes());

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  };

  const updateAppointmentLimits = () => {
    const minimum = getMinimumAppointmentDate();
    dateInput.min = minimum.date;

    if (!dateInput.value || dateInput.value === minimum.date) {
      timeInput.min = minimum.time;
      return;
    }

    timeInput.removeAttribute("min");
  };

  const validateAppointmentDateTime = () => {
    const minimum = getMinimumAppointmentDate();

    updateAppointmentLimits();
    dateInput.setCustomValidity("");
    timeInput.setCustomValidity("");

    if (!dateInput.value || !timeInput.value) return;

    const selectedDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
    const minimumDateTime = new Date(`${minimum.date}T${minimum.time}`);

    if (selectedDateTime < minimumDateTime) {
      timeInput.setCustomValidity("La cita debe agendarse con minimo 15 minutos de anticipacion.");
    }
  };

  const getShortName = (value) => value.split(" - ")[0];

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
    `${newPatientNameInput.value.trim()} - ${newPatientEmailInput.value.trim().toLowerCase()}`
  );

  const loadSpecialistOptions = () => {
    const storedSpecialists = localStorage.getItem(specialistsStorageKey);

    if (!storedSpecialists) return;

    try {
      JSON.parse(storedSpecialists).forEach((specialist) => {
        const value = `${specialist.name} - ${specialist.specialty}`;

        if ([...specialistInput.options].some((option) => option.value === value || option.textContent === value)) return;

        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        specialistInput.appendChild(option);
      });
    } catch {
      localStorage.removeItem(specialistsStorageKey);
    }
  };

  const getAppointmentsFromTable = () => (
    [...table.querySelectorAll(".appointment-row")].map((row) => ({
      patient: row.dataset.patient,
      specialist: row.dataset.specialist,
      date: row.dataset.date,
      time: row.dataset.time,
      reason: row.dataset.reason,
      notes: row.dataset.notes,
      status: row.dataset.status,
    }))
  );

  const saveAppointments = () => {
    localStorage.setItem(storageKey, JSON.stringify(getAppointmentsFromTable()));
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
    updateAppointmentLimits();
  };

  const buildAppointmentRow = ({ patient, specialist, date, time, reason, notes, status = "Pendiente" }) => {
    const row = document.createElement("tr");
    const isConfirmed = status === "Confirmada";

    row.className = "appointment-row";
    row.dataset.patient = patient;
    row.dataset.specialist = specialist;
    row.dataset.date = date;
    row.dataset.time = time;
    row.dataset.reason = reason;
    row.dataset.notes = notes;
    row.dataset.status = status;
    row.innerHTML = `
      <td>${time}</td>
      <td>${getShortName(patient)}</td>
      <td>${getShortName(specialist)}</td>
      <td><span class="status-pill ${isConfirmed ? "status-active" : "status-pending"}">${status}</span></td>
    `;

    return row;
  };

  const renderAppointments = (appointments) => {
    table.innerHTML = "";
    appointments.forEach((appointment) => {
      addPatientOption(appointment.patient);
      table.appendChild(buildAppointmentRow(appointment));
    });
  };

  const loadAppointments = () => {
    const storedAppointments = localStorage.getItem(storageKey);

    if (!storedAppointments) {
      saveAppointments();
      return;
    }

    try {
      const appointments = JSON.parse(storedAppointments);

      if (Array.isArray(appointments)) {
        renderAppointments(appointments);
      }
    } catch {
      localStorage.removeItem(storageKey);
      saveAppointments();
    }
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
    validateAppointmentDateTime();
  };

  updateAppointmentLimits();
  loadSpecialistOptions();
  loadAppointments();
  dateInput.addEventListener("change", validateAppointmentDateTime);
  timeInput.addEventListener("change", validateAppointmentDateTime);
  timeInput.addEventListener("input", validateAppointmentDateTime);

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
    validateAppointmentDateTime();

    if (!form.checkValidity()) return;

    const patient = patientInput.value === "new-patient"
      ? buildNewPatientValue()
      : patientInput.value;

    if (patientInput.value === "new-patient") {
      addPatientOption(patient);
      patientInput.value = patient;
    }

    const appointment = {
      patient,
      specialist: specialistInput.value,
      date: dateInput.value,
      time: timeInput.value,
      reason: reasonInput.value,
      notes: notesInput.value,
      status: selectedAppointmentRow?.dataset.status ?? "Pendiente",
    };
    const row = buildAppointmentRow(appointment);

    if (selectedAppointmentRow) {
      selectedAppointmentRow.replaceWith(row);
    } else {
      table.prepend(row);
    }

    saveAppointments();
    clearSelection();
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
          <input class="form-control" id="adminUserName" placeholder="Nombre completo" required>
          <input type="email" class="form-control" id="adminUserEmail" placeholder="correo@ejemplo.com" required>
          <select class="form-select" id="adminUserRole" required>
            <option>Cliente</option>
            <option>Secretario</option>
            <option>Admin</option>
          </select>
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
          <input class="form-control" id="specialistName" placeholder="Nombre del especialista" required>
          <input type="email" class="form-control" id="specialistEmail" placeholder="correo@oralluanm.com" required>
          <input class="form-control" id="specialistSpecialty" placeholder="Especialidad" required>
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

const initClientDashboard = () => {
  const sessionKey = "oralLuanmUser";
  const usersKey = "oralLuanmUsers";

  const userName = document.getElementById("clientUserName");
  const userEmail = document.getElementById("clientUserEmail");
  const userPhone = document.getElementById("clientUserPhone");
  const userDocument = document.getElementById("clientUserDocument");

  if (!userName && !userEmail && !userPhone && !userDocument) return;

  const readStorage = (key, fallback) => {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      return fallback;
    }
  };

  const session = readStorage(sessionKey, null);

  if (!session) {
    return;
  }

  const users = readStorage(usersKey, []);

  const user = users.find((item) => item.email === session.email);

  if (!user) {
    return;
  }

  if (userName) {
    userName.textContent = `${user.name} ${user.lastName}`;
  }

  if (userEmail) {
    userEmail.textContent = user.email;
  }

  if (userPhone) {
    userPhone.textContent = user.phone;
  }

  if (userDocument) {
    userDocument.textContent = `${user.documentType} ${user.document}`;
  }
};

const initServices = () => {
  const container = document.getElementById("servicios-container");

  if (!container || typeof SERVICES === "undefined") return;

  SERVICES.forEach((service, index) => {
    const isReverse = index % 2 !== 0;

    const card = document.createElement("article");
    card.className = `servicio-card ${isReverse ? "reverse" : ""}`;

    card.id = service.id;

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

  if (!container || typeof SPECIALISTS === "undefined") return;

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

const scrollToHash = () => {
  const hash = window.location.hash;

  if (!hash) return;

  const target = document.querySelector(hash);

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};

const initApp = async () => {
  await loadSiteData();
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
  scrollToHash();
};

initApp().catch((error) => {
  console.error(error);
});
