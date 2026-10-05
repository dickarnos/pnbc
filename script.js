/* ==========================================
   MENU MOBILE
========================================== */

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
const navLinks = document.querySelectorAll(".nav-menu a");

/**
 * Met à jour les attributs ARIA du menu.
 * @param {boolean} isOpen
 */
function updateMenuAria(isOpen) {
    if (!menuToggle) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
}

/**
 * Ouvre ou ferme le menu.
 */
function toggleMenu() {
    if (!menuToggle || !nav) return;

    const isOpen = nav.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    updateMenuAria(isOpen);
}

/**
 * Ferme le menu.
 */
function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("active");
    menuToggle.classList.remove("active");

    updateMenuAria(false);
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", toggleMenu);

    // Fermer après avoir sélectionné une page
    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Fermer avec Échap
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            nav.classList.contains("active")
        ) {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Fermer automatiquement lorsqu'on repasse en desktop
    const desktopQuery = window.matchMedia("(min-width: 866px)");

    desktopQuery.addEventListener("change", (event) => {
        if (event.matches) {
            closeMenu();
        }
    });
}


/* ==========================================
   PANNEAU CONTACT
========================================== */

const contactBtn = document.getElementById("open-contact");
const contactPanel = document.getElementById("contact-panel");
const contactOverlay = document.getElementById("contact-overlay");
const contactClose = document.getElementById("contact-close");

let lastContactFocus = null;

/**
 * Ouvre le panneau de contact.
 */
function openContact() {
    if (!contactPanel || !contactOverlay) return;

    lastContactFocus = document.activeElement;

    contactPanel.classList.add("active");
    contactOverlay.classList.add("active");

    contactPanel.setAttribute("aria-hidden", "false");
    contactOverlay.setAttribute("aria-hidden", "false");

    if (contactBtn) {
        contactBtn.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("no-scroll");

    // Placer le focus sur le bouton Fermer
    if (contactClose) {
        requestAnimationFrame(() => {
            contactClose.focus();
        });
    }
}

/**
 * Ferme le panneau de contact.
 */
function closeContact() {
    if (!contactPanel || !contactOverlay) return;

    contactPanel.classList.remove("active");
    contactOverlay.classList.remove("active");

    contactPanel.setAttribute("aria-hidden", "true");
    contactOverlay.setAttribute("aria-hidden", "true");

    if (contactBtn) {
        contactBtn.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("no-scroll");

    // Retour du focus à l'élément qui avait ouvert le panneau
    if (
        lastContactFocus &&
        typeof lastContactFocus.focus === "function"
    ) {
        lastContactFocus.focus();
    } else if (contactBtn) {
        contactBtn.focus();
    }
}

if (
    contactBtn &&
    contactPanel &&
    contactOverlay &&
    contactClose
) {
    contactBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (contactPanel.classList.contains("active")) {
            closeContact();
        } else {
            openContact();
        }
    });

    contactClose.addEventListener("click", closeContact);

    contactOverlay.addEventListener("click", closeContact);

    // Fermer avec Échap
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            contactPanel.classList.contains("active")
        ) {
            closeContact();
        }
    });
}


/* ==========================================
   PROCHAIN MATCH
========================================== */

/**
 * Données du prochain match.
 *
 * Pour afficher "Aucun match programmé" :
 *
 * const prochainMatch = {};
 *
 * Pour afficher un match :
 * renseigner les différentes propriétés.
 */

const prochainMatch = {
    // equipeDomicile: "PNBC",
    // equipeExterieur: "CLUB ADVERSE",

    // logoDomicile: "./assets/images/logo.png",
    // logoExterieur: "./assets/images/logo-ad.webp",

    // date: "20 SEPTEMBRE",
    // heure: "18:00",

    // lieu: "GYMNASE MUNICIPAL",

    // lieuUrl:
    //     "https://www.google.com/maps/search/?api=1&query=Gymnase+Municipal+Popenguine+Ndayane+Senegal"
};

/**
 * Affiche le prochain match ou le message
 * indiquant qu'aucun match n'est programmé.
 *
 * @param {Object} match
 */
function afficherProchainMatch(match) {
    const matchCard = document.getElementById("match-card");
    const noMatch = document.getElementById("no-match");

    if (!matchCard || !noMatch) return;

    const hasMatch =
        match &&
        typeof match === "object" &&
        Object.keys(match).length > 0;

    if (!hasMatch) {
        matchCard.hidden = true;
        noMatch.hidden = false;
        return;
    }

    const equipes = matchCard.querySelectorAll(".team h3");

    if (equipes[0]) {
        equipes[0].textContent =
            match.equipeDomicile || "—";
    }

    if (equipes[1]) {
        equipes[1].textContent =
            match.equipeExterieur || "—";
    }

    /* ---------- Logos ---------- */

    const logoDom = document.getElementById("logo-domicile");
    const logoExt = document.getElementById("logo-exterieur");

    if (logoDom) {
        if (match.logoDomicile) {
            logoDom.src = match.logoDomicile;
            logoDom.alt =
                `Logo ${match.equipeDomicile || "équipe à domicile"}`;
        } else {
            logoDom.removeAttribute("src");
            logoDom.alt = "";
        }
    }

    if (logoExt) {
        if (match.logoExterieur) {
            logoExt.src = match.logoExterieur;
            logoExt.alt =
                `Logo ${match.equipeExterieur || "équipe adverse"}`;
        } else {
            logoExt.removeAttribute("src");
            logoExt.alt = "";
        }
    }

    /* ---------- Date ---------- */

    const dateEl = document.getElementById("date-match");
    const heureEl = document.getElementById("heure-match");

    if (dateEl) {
        dateEl.textContent = match.date || "";
    }

    if (heureEl) {
        heureEl.textContent = match.heure || "";
    }

    /* ---------- Lieu ---------- */

    const lieuEl = document.getElementById("lieu-match");

    if (lieuEl) {
        lieuEl.textContent = match.lieu || "";

        if (match.lieuUrl) {
            lieuEl.href = match.lieuUrl;
            lieuEl.target = "_blank";
            lieuEl.rel = "noopener noreferrer";
            lieuEl.removeAttribute("aria-disabled");
            lieuEl.removeAttribute("tabindex");
        } else {
            lieuEl.removeAttribute("href");
            lieuEl.removeAttribute("target");
            lieuEl.removeAttribute("rel");

            // Évite qu'un faux lien soit parcouru au clavier
            lieuEl.setAttribute("aria-disabled", "true");
            lieuEl.setAttribute("tabindex", "-1");
        }
    }

    matchCard.hidden = false;
    noMatch.hidden = true;
}

afficherProchainMatch(prochainMatch);


/* ==========================================
   BARRE DE PROGRESSION DU SCROLL
========================================== */

const scrollProgress =
    document.getElementById("scroll-progress");

/**
 * Met à jour la progression de lecture.
 */
function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;

    const docHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        docHeight > 0
            ? (scrollTop / docHeight) * 100
            : 0;

    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);

window.addEventListener(
    "resize",
    updateScrollProgress
);

updateScrollProgress();


/* ==========================================
   GALERIE — LIGHTBOX
========================================== */

const galleryItems =
    document.querySelectorAll(".gallery-item");

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightbox-img");

const lightboxCap =
    document.getElementById("lightbox-caption");

const lightboxClose =
    document.getElementById("lightbox-close");

const lightboxPrev =
    document.getElementById("lightbox-prev");

const lightboxNext =
    document.getElementById("lightbox-next");

let currentIndex = 0;
let lastLightboxFocus = null;


/**
 * Récupère les informations d'une image.
 *
 * @param {HTMLElement} item
 * @returns {Object}
 */
function getImageData(item) {
    const img = item.querySelector("img");

    const title =
        item.querySelector(".gallery-overlay h3");

    const date =
        item.querySelector(".gallery-overlay p");

    return {
        src: img ? img.src : "",
        alt: img ? img.alt || "" : "",
        title: title ? title.textContent.trim() : "",
        date: date ? date.textContent.trim() : ""
    };
}


/**
 * Met à jour le contenu de la lightbox.
 */
function updateLightbox() {
    if (!lightboxImg || !lightboxCap) return;

    const item = galleryItems[currentIndex];

    if (!item) return;

    const data = getImageData(item);

    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;

    if (data.title && data.date) {
        lightboxCap.textContent =
            `${data.title} — ${data.date}`;
    } else if (data.title) {
        lightboxCap.textContent = data.title;
    } else {
        lightboxCap.textContent = "";
    }
}


/**
 * Ouvre la lightbox.
 *
 * @param {number} index
 */
function openLightbox(index) {
    if (!lightbox) return;

    currentIndex = index;

    lastLightboxFocus = document.activeElement;

    updateLightbox();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    if (lightboxClose) {
        requestAnimationFrame(() => {
            lightboxClose.focus();
        });
    }
}


/**
 * Ferme la lightbox.
 */
function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    if (
        lastLightboxFocus &&
        typeof lastLightboxFocus.focus === "function"
    ) {
        lastLightboxFocus.focus();
    }
}


/**
 * Image suivante.
 */
function nextImage() {
    if (galleryItems.length === 0) return;

    currentIndex =
        (currentIndex + 1) % galleryItems.length;

    updateLightbox();
}


/**
 * Image précédente.
 */
function prevImage() {
    if (galleryItems.length === 0) return;

    currentIndex =
        (currentIndex - 1 + galleryItems.length) %
        galleryItems.length;

    updateLightbox();
}


/* ---------- Initialisation galerie ---------- */

if (
    galleryItems.length > 0 &&
    lightbox
) {
    galleryItems.forEach((item, index) => {

        // Si les éléments ne sont pas des boutons,
        // on les rend accessibles au clavier.
        if (
            !item.hasAttribute("tabindex") &&
            item.tagName !== "BUTTON" &&
            item.tagName !== "A"
        ) {
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");
            item.setAttribute(
                "aria-label",
                `Ouvrir l'image ${index + 1}`
            );
        }

        item.addEventListener("click", () => {
            openLightbox(index);
        });

        item.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }

    if (lightboxNext) {
        lightboxNext.addEventListener(
            "click",
            nextImage
        );
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener(
            "click",
            prevImage
        );
    }

    // Fermer en cliquant sur le fond
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation clavier
    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        switch (event.key) {
            case "Escape":
                closeLightbox();
                break;

            case "ArrowRight":
                event.preventDefault();
                nextImage();
                break;

            case "ArrowLeft":
                event.preventDefault();
                prevImage();
                break;

            default:
                break;
        }
    });
}


/* ==========================================
   LIEN ACTIF DANS LE MENU
========================================== */

function setActiveNavLink() {
    let currentPath =
        window.location.pathname
            .split("/")
            .pop();

    if (!currentPath) {
        currentPath = "index.html";
    }

    document
        .querySelectorAll(".nav-menu a")
        .forEach((link) => {

            const linkPath =
                link.getAttribute("href");

            if (!linkPath) return;

            const cleanLink =
                linkPath
                    .split("#")[0]
                    .split("?")[0]
                    .replace("./", "");

            if (cleanLink === currentPath) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.classList.remove("active");

                link.removeAttribute(
                    "aria-current"
                );
            }
        });
}

setActiveNavLink();


/* ==========================================
   BOUTIQUE — COMMANDES WHATSAPP
========================================== */

const shopButtons =
    document.querySelectorAll(".shop-btn");

shopButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const produit =
            button.dataset.product;

        if (!produit) {
            console.warn(
                "Boutique : produit non défini."
            );
            return;
        }

        const numero = "221781769036";

        const message =
            encodeURIComponent(
                `Bonjour, je souhaite commander : ${produit}.`
            );

        const whatsappUrl =
            `https://wa.me/${numero}?text=${message}`;

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );
    });
});