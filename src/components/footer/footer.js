import footerTemplate from "./footer.html?raw";
import footerLogo from "./assets/logo-footer.png";

export function createFooter() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = footerTemplate
    .replace("{{FOOTER_LOGO_SRC}}", footerLogo)
    .replace("{{CURRENT_YEAR}}", String(new Date().getFullYear()));

  const footer = wrapper.firstElementChild;
  if (!footer) {
    throw new Error("Footer template could not be rendered");
  }

  return footer;
}
