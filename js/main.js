/**
 * ORAL LUANM - Premium Dental Clinic JavaScript
 * Handles interactivity, scrolling effects, animations, gallery filters, and form validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Scroll Effect on Navbar
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run on load in case the page is already scrolled
  handleScroll();

  // 2. Intersection Observer for Reveal-on-Scroll Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // 3. Form Validation (Bootstrap 5 Custom Validations)
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
      } else {
        // Form is valid - display a success visual indicator (since we are not sending to a server)
        event.preventDefault();
        
        // Find if there's a modal containing this form to close it, or just show success alert
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3 alert-dismissible fade show';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
          <strong>¡Gracias por tu mensaje!</strong> Tu solicitud ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        `;
        
        form.appendChild(successMessage);
        form.reset();
        form.classList.remove('was-validated');
        
        // Remove alert automatically after 5 seconds
        setTimeout(() => {
          const bsAlert = new bootstrap.Alert(successMessage);
          bsAlert.close();
        }, 5000);
      }
    }, false);
  });

  // 4. Gallery Filtering System (Only runs on galeria.html)
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-wrapper');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Toggle active class on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            // Trigger a minor transition
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 5. Gallery Lightbox / Modal Dynamic Src (Only runs on galeria.html)
  const galleryLinks = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  
  if (galleryLinks.length > 0 && lightboxModal) {
    const modalImg = lightboxModal.querySelector('.modal-lightbox-img');
    const modalTitle = lightboxModal.querySelector('.modal-lightbox-title');
    const modalCategory = lightboxModal.querySelector('.modal-lightbox-category');

    galleryLinks.forEach(link => {
      link.addEventListener('click', () => {
        const imgSrc = link.querySelector('img').getAttribute('src');
        const imgAlt = link.querySelector('img').getAttribute('alt');
        const titleText = link.querySelector('.gallery-title').textContent;
        const catText = link.querySelector('.gallery-category').textContent;

        modalImg.setAttribute('src', imgSrc);
        modalImg.setAttribute('alt', imgAlt);
        modalTitle.textContent = titleText;
        modalCategory.textContent = catText;
      });
    });
  }

  // 6. Dynamic Service Modal details (Only runs on servicios.html)
  const serviceModal = document.getElementById('serviceDetailModal');
  if (serviceModal) {
    const modalTitle = serviceModal.querySelector('.modal-title');
    const modalBodyImg = serviceModal.querySelector('.service-modal-img');
    const modalBodyDesc = serviceModal.querySelector('.service-modal-desc');
    const modalBenefitsList = serviceModal.querySelector('.service-modal-benefits');
       // Detailed dynamic content for services
    const serviceDetails = {
      ortodoncia: {
        title: 'Ortodoncia Premium',
        img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
        desc: 'Alinea tus dientes y mejora tu mordida utilizando tecnología de vanguardia como brackets estéticos, autoligables y alineadores invisibles (Invisalign). Nuestro tratamiento personalizado no solo mejora la estética de tu sonrisa, sino que optimiza tu función masticatoria y tu salud bucal a largo plazo.',
        benefits: ['Alineadores invisibles cómodos y removibles.', 'Brackets de zafiro de alta estética y resistencia.', 'Tratamientos eficientes con menor tiempo de consulta.', 'Diagnóstico digital 3D de alta precisión.']
      },
      general: {
        title: 'Odontología General e Higiene',
        img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        desc: 'El pilar fundamental de tu salud bucodental. Realizamos limpiezas profesionales profundas con ultrasonido, diagnóstico integral con cámara intraoral, eliminación de caries y restauraciones estéticas con resinas biocompatibles de alta durabilidad.',
        benefits: ['Limpieza dental profunda y remoción de sarro sin dolor.', 'Detección temprana de caries y patologías bucales.', 'Restauraciones dentales estéticas idénticas a tus dientes naturales.', 'Educación en técnicas de cepillado e higiene oral.']
      },
      blanqueamiento: {
        title: 'Blanqueamiento Dental LED',
        img: 'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&w=800&q=80',
        desc: 'Recupera el brillo natural de tu sonrisa de forma rápida y segura. Ofrecemos técnicas de blanqueamiento en consultorio con lámpara de luz fría de última generación y tratamientos combinados para casa. Diseñados para minimizar la sensibilidad y maximizar el brillo.',
        benefits: ['Dientes hasta 4 tonos más blancos en una sola sesión.', 'Fórmula de gel blanqueador de grado médico que protege el esmalte.', 'Resultados duraderos y de apariencia sumamente natural.', 'Seguimiento personalizado contra la sensibilidad dental.']
      },
      sonrisa: {
        title: 'Diseño de Sonrisa Digital',
        img: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80',
        desc: 'Transformamos por completo el aspecto de tus dientes mediante carillas de porcelana ultra-delgadas o de resina de alta gama. Planificamos digitalmente tu tratamiento proyectando el resultado final antes de empezar, garantizando proporciones perfectas y armonía facial.',
        benefits: ['Visualización digital en 3D de tu sonrisa antes del tratamiento.', 'Carillas de porcelana minimalistas sin desgastar el diente.', 'Resistencia superior al manchado y al desgaste habitual.', 'Tratamientos que combinan perfectamente con tus facciones faciales.']
      },
      endodoncia: {
        title: 'Endodoncia sin Dolor',
        img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80',
        desc: 'Tratamiento de conducto avanzado realizado bajo magnificación médica y sistemas rotatorios de última generación. Permite salvar piezas dentales dañadas por infecciones o caries profundas, eliminando el dolor de forma eficaz, segura y en menos sesiones.',
        benefits: ['Uso de sistemas rotatorios que acortan el tiempo de tratamiento.', 'Procedimiento altamente efectivo, cómodo e indoloro.', 'Prevención de extracciones dentales innecesarias.', 'Biomateriales de sellado de alta compatibilidad.']
      },
      odontopediatria: {
        title: 'Odontopediatría Cariñosa',
        img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
        desc: 'Cuidado dental especializado para los más pequeños del hogar. Nos enfocamos en crear experiencias positivas, libres de miedo y llenas de diversión. Promovemos la prevención, aplicaciones de flúor, selladores de fosas y fisuras, y el cuidado de los dientes de leche.',
        benefits: ['Ambiente adaptado para que los niños jueguen y se relajen.', 'Especialistas capacitados en psicología infantil.', 'Prevención activa contra las caries tempranas.', 'Tratamientos mínimamente invasivos y muy amigables.']
      },
      implantes: {
        title: 'Implantes Dentales y Prótesis',
        img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        desc: 'La solución permanente e ideal para la pérdida de uno o más dientes. Colocamos implantes de titanio de marcas líderes mundiales que se integran perfectamente al hueso, sobre los cuales colocamos coronas de zirconio que imitan la estética y funcionalidad de un diente natural.',
        benefits: ['Restauración al 100% de la capacidad de masticación y habla.', 'Uso de guías quirúrgicas digitales para colocación sin dolor.', 'Coronas de zirconio premium de alta estética y durabilidad.', 'Previene la pérdida de estructura ósea maxilar.']
      }
    };

    // Listen to BS modal show event
    serviceModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const serviceKey = button.getAttribute('data-service');
      const details = serviceDetails[serviceKey];
      
      if (details) {
        modalTitle.textContent = details.title;
        modalBodyImg.setAttribute('src', details.img);
        modalBodyImg.setAttribute('alt', details.title);
        modalBodyDesc.textContent = details.desc;
        
        // Clean and update benefits list
        modalBenefitsList.innerHTML = '';
        details.benefits.forEach(benefit => {
          const li = document.createElement('li');
          li.className = 'mb-2 d-flex align-items-start gap-2';
          li.innerHTML = `<i class="bi bi-patch-check-fill text-primary mt-1"></i> <span>${benefit}</span>`;
          modalBenefitsList.appendChild(li);
        });
      }
    });
  }

  // 7. Auto-close navbar collapse on link click on mobile
  const navLinks = document.querySelectorAll('.navbar-collapse .nav-link:not(.dropdown-toggle)');
  const menuToggle = document.getElementById('navbarNav');
  if (menuToggle && navLinks.length > 0) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(menuToggle);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }
});
