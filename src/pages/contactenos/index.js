import "./contactenos.css";
import { createContact } from "../../components/contact/contact.js";

const contactPage = {
  id: "contacto",
  title: "Oral LUANM | Contactenos",
  description: "Contacta a Oral LUANM y agenda tu cita odontologica.",
  sections: [createContact],
};

export default contactPage;
