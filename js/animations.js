/* ==========================================================================
   ANIMATIONS.JS — ORAL LUANM
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // El hero se excluye porque su animación de entrada ya la maneja
    // animations.css con @keyframes al cargar la página 
    const revealElements = document.querySelectorAll(".reveal-on-scroll:not(.hero)");


    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    function animateCounter(counter) {

        const target = Number(counter.dataset.target);

        let current = 0;

        const increment = target / 50;

        const timer = setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            if (target === 2000) {

                counter.textContent =
                    Math.floor(current).toLocaleString("es-CO") + "+";

            }

            else if (target === 10) {

                counter.textContent =
                    Math.floor(current) + "+";

            }

            else {

                counter.textContent =
                    current.toFixed(1);

            }

        }, 30);

    }
    const counters = document.querySelectorAll(".stat-numero");

    counters.forEach(animateCounter);


    revealElements.forEach((element) => revealObserver.observe(element));

    // ---- NAVBAR: sombra y padding reducido al hacer scroll ----
    const scrollThreshold = 40;
    let ticking = false;

    function updateNavbarOnScroll() {

        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.toggle("navbar-scrolled", window.scrollY > scrollThreshold);
        }
        ticking = false;
    }

    window.addEventListener("scroll", () => {

        if (!ticking) {
            requestAnimationFrame(updateNavbarOnScroll);
            ticking = true;
        }
    });

});