import "@fortawesome/fontawesome-free/css/all.min.css";
import "./app.css";
import { renderPage } from "../js/render-page.js";

const routes = {
  home: () => import("../pages/home/index.js"),
  contacto: () => import("../pages/contactenos/index.js"),
  nosotros: () => import("../pages/nosotros/index.js"),
  servicios: () => import("../pages/servicios/index.js"),
};

function resolvePageKey() {
  const currentUrl = new URL(window.location.href);
  return currentUrl.searchParams.get("page") ?? "home";
}

function shouldHandleAsAppRoute(url) {
  return (
    url.origin === window.location.origin &&
    url.pathname === window.location.pathname &&
    (url.searchParams.get("page") !== null || url.hash || url.pathname.endsWith("index.html"))
  );
}

async function renderCurrentPage() {
  const routeKey = resolvePageKey();
  const loadPage = routes[routeKey] ?? routes.home;
  const module = await loadPage();
  renderPage(module.default);
}

window.addEventListener("popstate", renderCurrentPage);
window.addEventListener("hashchange", renderCurrentPage);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const link = target.closest("a");
  if (!(link instanceof HTMLAnchorElement) || !link.href) {
    return;
  }

  const url = new URL(link.href, window.location.href);
  if (!shouldHandleAsAppRoute(url)) {
    return;
  }

  event.preventDefault();
  window.history.pushState({}, "", url);
  renderCurrentPage();
});

renderCurrentPage();
