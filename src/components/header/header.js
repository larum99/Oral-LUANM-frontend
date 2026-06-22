import headerTemplate from "./header.html?raw";
import headerLogo from "./assets/logo-maudy.png";

export function createHeader(options = {}) {
  const { currentPage = "" } = options;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = headerTemplate.replace("{{LOGO_SRC}}", headerLogo);

  const header = wrapper.firstElementChild;
  if (!header) {
    throw new Error("Header template could not be rendered");
  }

  header.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  return header;
}
