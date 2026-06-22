import testimonialsTemplate from "./testimonials.html?raw";
import juanPerezImage from "./assets/juan-perez.jpg";
import lauraGomezImage from "./assets/laura-gomez.webp";
import carlosRamirezImage from "./assets/carlos-ramirez.jpg";

export function createTestimonials() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = testimonialsTemplate
    .replace("{{JUAN_PEREZ_IMAGE}}", juanPerezImage)
    .replace("{{LAURA_GOMEZ_IMAGE}}", lauraGomezImage)
    .replace("{{CARLOS_RAMIREZ_IMAGE}}", carlosRamirezImage);

  const section = wrapper.firstElementChild;
  if (!section) {
    throw new Error("Testimonials template could not be rendered");
  }

  return section;
}
