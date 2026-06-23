const getBasePath = () => {
  const depth = window.location.pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => !part.endsWith(".html")).length;

  return depth === 0 ? "./" : "../".repeat(depth);
};

const fillTemplate = (html) => {
  const contactPath = `${getBasePath()}contactanos/`;

  return html
    .replaceAll("{{BASE_PATH}}", getBasePath())
    .replaceAll("{{CONTACT_PATH}}", contactPath);
};

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

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateNavbar);
  updateNavbar();
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
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");

      if (form.checkValidity()) {
        form.reset();
        form.classList.remove("was-validated");
      }
    });
  });
};

const initApp = async () => {
  await loadComponents();
  initNavbar();
  initRevealAnimations();
  initFormValidation();
};

initApp().catch((error) => {
  console.error(error);
});
