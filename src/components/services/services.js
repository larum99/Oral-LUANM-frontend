import servicesTemplate from "./services.html?raw";

const servicesCatalog = [
  {
    name: "Ortodoncia",
    icon: "OD",
    description:
      "Alineacion dental y correccion de mordida con seguimiento progresivo y planes claros.",
    benefits: [
      "Mejora funcional y estetica.",
      "Acompanamiento por etapas.",
      "Alternativas segun el caso clinico.",
    ],
  },
  {
    name: "Odontologia general",
    icon: "OG",
    description:
      "Controles preventivos, diagnostico, restauraciones y mantenimiento continuo de salud oral.",
    benefits: [
      "Prevencion de problemas mayores.",
      "Tratamientos conservadores.",
      "Seguimiento periodico.",
    ],
  },
  {
    name: "Blanqueamiento dental",
    icon: "BD",
    description:
      "Procedimientos para mejorar el tono dental de forma controlada y compatible con la salud oral.",
    benefits: [
      "Evaluacion previa del esmalte.",
      "Plan seguro y gradual.",
      "Resultados mas armonicos.",
    ],
  },
  {
    name: "Diseno de sonrisa",
    icon: "DS",
    description:
      "Analisis estetico y funcional para definir una sonrisa coherente con el rostro y la mordida.",
    benefits: [
      "Planeacion personalizada.",
      "Balance entre funcion y estetica.",
      "Proceso explicado paso a paso.",
    ],
  },
  {
    name: "Endodoncia",
    icon: "EN",
    description:
      "Tratamientos enfocados en conservar piezas dentales comprometidas y controlar infecciones.",
    benefits: [
      "Conservacion del diente natural.",
      "Control del dolor y la infeccion.",
      "Restauracion posterior planificada.",
    ],
  },
  {
    name: "Odontopediatria",
    icon: "OP",
    description:
      "Atencion infantil con enfoque pedagogico, preventivo y adaptado a la experiencia del nino.",
    benefits: [
      "Entorno mas amable para menores.",
      "Educacion para familias.",
      "Prevencion temprana.",
    ],
  },
  {
    name: "Implantes dentales",
    icon: "ID",
    description:
      "Rehabilitacion de piezas ausentes con planeacion precisa y criterios de estabilidad funcional.",
    benefits: [
      "Recuperacion de soporte masticatorio.",
      "Evaluacion estructural previa.",
      "Plan integral de rehabilitacion.",
    ],
  },
];

function createServiceCard(service) {
  const card = document.createElement("article");
  card.className = "service-card";

  const benefits = service.benefits
    .map((benefit) => `<li>${benefit}</li>`)
    .join("");

  card.innerHTML = `
    <span class="service-card__icon" aria-hidden="true">${service.icon}</span>
    <div>
      <h2>${service.name}</h2>
      <p>${service.description}</p>
    </div>
    <ul class="service-card__benefits">${benefits}</ul>
    <div class="service-card__actions">
      <a class="btn btn-primary" href="./index.html?page=contacto&service=${encodeURIComponent(service.name)}">
        Solicitar este servicio
      </a>
    </div>
  `;

  return card;
}

export function createServices() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = servicesTemplate;

  const section = wrapper.firstElementChild;
  if (!section) {
    throw new Error("Services template could not be rendered");
  }

  const grid = section.querySelector("[data-services-grid]");
  if (grid instanceof HTMLElement) {
    servicesCatalog.forEach((service) => {
      grid.appendChild(createServiceCard(service));
    });
  }

  return section;
}
