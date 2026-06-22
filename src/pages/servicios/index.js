import "./servicios.css";
import { createServices } from "../../components/services/services.js";

const servicesPage = {
  id: "servicios",
  title: "Oral LUANM | Servicios",
  description: "Especialidades odontologicas y tratamientos disponibles en Oral LUANM.",
  sections: [createServices],
};

export default servicesPage;
