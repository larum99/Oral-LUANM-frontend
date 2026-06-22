import "./footer.css";
import footerTemplate from "./footer.html?raw";

export function createFooter() {
    const footer = document.createElement("div");
    footer.innerHTML = footerTemplate;

    return footer.firstElementChild;
}