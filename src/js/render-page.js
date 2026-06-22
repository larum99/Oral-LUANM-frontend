import { createFooter } from "../components/footer/footer.js";
import { createHeader } from "../components/header/header.js";

export function renderPage(page) {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("No app container found");
  }

  const { id = "", title = "", description = "", sections = [] } = page;
  const currentPage = id;
  const fragment = document.createDocumentFragment();
  const main = document.createElement("main");
  main.className = "page-content";

  document.body.dataset.page = currentPage;

  if (title) {
    document.title = title;
  }

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && description) {
    descriptionMeta.setAttribute("content", description);
  }

  fragment.appendChild(createHeader({ currentPage }));

  sections.forEach((factory) => {
    const section = factory();
    if (section instanceof HTMLElement) {
      main.appendChild(section);
    }
  });

  fragment.appendChild(main);
  fragment.appendChild(createFooter());
  app.replaceChildren(fragment);

  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
}
