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

    // ---- TITULO DEL HERO: reveal palabra por palabra (bloque a bloque) ----
    // Envuelve cada palabra en un span en tiempo de ejecución (no toca el HTML)
    // y dispara el reveal con IntersectionObserver, solo transform/opacity.
    const heroTitle = document.querySelector(".hero-text h1");

    if (heroTitle) {
        const wrapWordsInTextNodes = (node) => {
            node.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const fragment = document.createDocumentFragment();

                    child.textContent.split(/(\s+)/).forEach((piece) => {
                        if (piece.trim() === "") {
                            fragment.appendChild(document.createTextNode(piece));
                            return;
                        }
                        const wordSpan = document.createElement("span");
                        wordSpan.className = "word-reveal";
                        wordSpan.textContent = piece;
                        fragment.appendChild(wordSpan);
                    });

                    child.replaceWith(fragment);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    wrapWordsInTextNodes(child);
                }
            });
        };

        wrapWordsInTextNodes(heroTitle);

        const words = heroTitle.querySelectorAll(".word-reveal");
        words.forEach((word, index) => {
            word.style.transitionDelay = `${index * 45}ms`;
        });

        const titleObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    heroTitle.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        titleObserver.observe(heroTitle);
    }

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