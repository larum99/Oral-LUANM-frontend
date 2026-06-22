import aboutTemplate from "./about.html?raw";

export function createAbout() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = aboutTemplate;

  const section = wrapper.firstElementChild;
  if (!section) {
    throw new Error("About template could not be rendered");
  }

  return section;
}
