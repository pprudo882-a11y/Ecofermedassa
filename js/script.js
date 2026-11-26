/* =====================================
   MAKTUB — SCRIPT PRINCIPAL
===================================== */

/* =====================================
   0. OUTILS COMMUNS (en dehors de toute "boîte")
   Ils sont visibles partout dans le fichier.
===================================== */

const CONFIG =
  typeof MAKTUB_CONFIG !== "undefined" ? MAKTUB_CONFIG : null;

const escapeHTML = value =>
  String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

const formatPrice = (price, currency = "FCFA") => {
  const amount = Number(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Tarif à confirmer";
  }

  return `${amount.toLocaleString("fr-FR")} ${currency}`;
};


if (!CONFIG) {
  console.error("Erreur : MAKTUB_CONFIG est introuvable. Vérifie config.js.");
} else {

/* =====================================
   1. OUTILS DE SÉLECTION
===================================== */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const availableRooms = (CONFIG.rooms || [])
  .filter(room => room.available);


/* =====================================
   2. GESTION DES MODULES
===================================== */

// Correspondance entre les modules et leurs sections HTML.

const moduleSections = {
  hebergement: "#hebergement",
  galerie: "#galerie",
  restaurant: "#restaurant",
  piscine: "#piscine",
  experiences: "#experiences",
  evenements: "#evenements"
};

// Supprimer les sections désactivées.

Object.entries(moduleSections).forEach(([moduleName, selector]) => {
  if (CONFIG.modules?.[moduleName] === false) {
    $$(selector).forEach(section => section.remove());
  }
});

// Supprimer les liens du menu qui pointent vers
// des sections désactivées.

$$(".navigation a[href^='#']").forEach(link => {
  const target = link.getAttribute("href");

  const correspondingModule = Object.entries(moduleSections)
    .find(([, selector]) => selector === target);

  if (
    correspondingModule &&
    CONFIG.modules?.[correspondingModule[0]] === false
  ) {
    link.remove();
  }
});

// Associer les catégories de la galerie aux modules.

const galleryModuleMap = {
  "Hébergement": "hebergement",
  "Restaurant": "restaurant",
  "Piscine": "piscine",
  "Événements": "evenements"
};

// Supprimer les filtres correspondant aux modules désactivés.

$$("[data-filter]").forEach(button => {
  const moduleName = galleryModuleMap[button.dataset.filter];

  if (
    moduleName &&
    CONFIG.modules?.[moduleName] === false
  ) {
    button.remove();
  }
});


/* =====================================
   3. MENU HAMBURGER
===================================== */

const menuToggle = $(".menu-toggle");
const navigation = $(".navigation");

function closeMenu() {
  if (!menuToggle || !navigation) return;

  navigation.classList.remove("active");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
}

if (menuToggle && navigation) {

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  $$("a", navigation).forEach(link => {
    link.addEventListener("click", closeMenu);
  });

}


/* =====================================
   4. INFORMATIONS DE L'ÉTABLISSEMENT
===================================== */

// Nom de l'établissement.

$$(".logo").forEach(logo => {
  logo.innerHTML = `${escapeHTML(CONFIG.name)}<span>.</span>`;
});

// Année automatique dans le pied de page.

const copyright = $(".copyright");

if (copyright) {
  copyright.textContent =
    `© ${new Date().getFullYear()} ${CONFIG.name}. Tous droits réservés.`;
}



/* =====================================
   5. CATALOGUE DES CHAMBRES
===================================== */

const roomsContainer = $("#rooms-container");
const roomDetail = $("#room-detail");
const roomDetailContent = $("#room-detail-content");
const closeRoomDetail = $("#close-room-detail");

let activeRoomImages = [];
let activeRoomImageIndex = 0;


// AFFICHER LES CHAMBRES




function displayRooms() {
  if (!roomsContainer) return;

  if (!availableRooms.length) {
    roomsContainer.innerHTML =
      "<p>Aucune chambre disponible pour le moment.</p>";
    return;
  }

  // Regrouper les chambres par catégorie
  const groups = new Map();

  availableRooms.forEach(room => {
    const category = room.category || "Autres chambres";

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category).push(room);
  });

  // Trier automatiquement les catégories par ordre alphabétique
  const sortedGroups = [...groups.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], "fr")
  );

  // Générer les catégories côte à côte
  roomsContainer.innerHTML = `
    <div class="room-categories-grid">

      ${sortedGroups.map(([category, rooms]) => `

        <section class="room-category-group">

          <div class="room-category-heading">
            <span>MAKTUB — HÉBERGEMENT</span>
            <h3>${escapeHTML(category)}</h3>
          </div>

          <div class="room-category-grid">

            ${rooms.map(room => `
              <article class="room-card">

                <img
                  src="${escapeHTML(room.images?.[0] || "")}"
                  alt="${escapeHTML(room.name)}"
                  loading="lazy"
                >

                <div class="room-card-content">

                  <h3>${escapeHTML(room.name)}</h3>

                  <p class="room-capacity">
                    Capacité : ${Number(room.capacity)} personne(s)
                  </p>

                  <p class="room-price">
                    ${formatPrice(room.price, room.currency)}
                    ${Number(room.price) > 0 ? "/ nuit" : ""}
                  </p>

                  <button
                    class="room-button"
                    type="button"
                    data-room-id="${escapeHTML(room.id)}"
                  >
                    Découvrir cette chambre
                  </button>

                </div>

              </article>
            `).join("")}

          </div>

        </section>

      `).join("")}

    </div>
  `;
}

const discoverRoomsButton = $("#discover-rooms");

if (discoverRoomsButton && roomsContainer) {

  discoverRoomsButton.addEventListener("click", () => {

    const isHidden = roomsContainer.hidden;

    roomsContainer.hidden = !isHidden;

    discoverRoomsButton.textContent = isHidden
      ? "Masquer les chambres"
      : "Découvrir les autres chambres";

    if (isHidden) {
      roomsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  });

}

// AFFICHER LES DÉTAILS D'UNE CHAMBRE


function displayRoomDetails(roomId) {

  const room = availableRooms.find(
    item => String(item.id) === String(roomId)
  );

  if (!room || !roomDetail || !roomDetailContent) return;

  activeRoomImages = (room.images || []).filter(Boolean);
  activeRoomImageIndex = 0;

  const images = activeRoomImages;
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const thumbnails = images.map((image, index) => `
    <button
      type="button"
      class="room-thumbnail ${index === 0 ? "active" : ""}"
      data-gallery-index="${index}"
      aria-label="Voir la photo ${index + 1}"
    >
      <img
        src="${escapeHTML(image)}"
        alt="${escapeHTML(room.name)} - photo ${index + 1}"
        loading="lazy"
      >
    </button>
  `).join("");

  const features = (room.features || []).map(feature => `
    <li>${escapeHTML(feature)}</li>
  `).join("");

  roomDetailContent.innerHTML = `

    <h3>${escapeHTML(room.name)}</h3>

    <p>${escapeHTML(room.description || "Description à venir.")}</p>

    <div class="room-gallery">

      <button
        type="button"
        class="room-main-image"
        data-open-gallery
        aria-label="Agrandir la photo"
        ${!hasImages ? "disabled" : ""}
      >
        ${
          hasImages
            ? `<img
                src="${escapeHTML(images[0])}"
                alt="${escapeHTML(room.name)}"
                id="room-main-photo"
              >`
            : "<p>Aucune photo disponible.</p>"
        }
      </button>

      <div class="room-thumbnails">
        ${thumbnails}
      </div>

    </div>

    <h4>Équipements et caractéristiques</h4>

    ${
      features
        ? `<ul class="room-features">${features}</ul>`
        : "<p>Informations à compléter.</p>"
    }

    <p class="room-price">
      ${formatPrice(room.price, room.currency)}
      ${Number(room.price) > 0 ? "/ nuit" : ""}
    </p>

    <a
      href="#reservation"
      class="room-button"
      data-reserve-room="${escapeHTML(room.id)}"
    >
      Demander une réservation
    </a>

    <div class="room-lightbox" hidden>

      <button
        type="button"
        class="lightbox-close"
        data-close-gallery
        aria-label="Fermer"
      >×</button>

      <button
        type="button"
        class="lightbox-prev"
        data-gallery-prev
        aria-label="Photo précédente"
        ${!hasMultipleImages ? "hidden" : ""}
      >‹</button>

      <img
        src="${hasImages ? escapeHTML(images[0]) : ""}"
        alt="${escapeHTML(room.name)}"
        class="lightbox-image"
      >

      <button
        type="button"
        class="lightbox-next"
        data-gallery-next
        aria-label="Photo suivante"
        ${!hasMultipleImages ? "hidden" : ""}
      >›</button>

      <p class="lightbox-counter">
        ${hasImages ? `1 / ${images.length}` : ""}
      </p>

    </div>

  `;

  roomDetail.hidden = false;

  roomDetail.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// NAVIGATION DANS LA GALERIE

function updateRoomGallery() {

  if (!activeRoomImages.length) return;

  const image = activeRoomImages[activeRoomImageIndex];

  const mainImage = $("#room-main-photo", roomDetailContent);
  const lightboxImage = $(".lightbox-image", roomDetailContent);
  const counter = $(".lightbox-counter", roomDetailContent);

  if (mainImage) mainImage.src = image;
  if (lightboxImage) lightboxImage.src = image;

  if (counter) {
    counter.textContent =
      `${activeRoomImageIndex + 1} / ${activeRoomImages.length}`;
  }

  roomDetailContent
    .querySelectorAll(".room-thumbnail")
    .forEach((thumbnail, index) => {
      thumbnail.classList.toggle(
        "active",
        index === activeRoomImageIndex
      );
    });
}


// CLICS SUR LES PHOTOS ET LES BOUTONS

roomDetailContent?.addEventListener("click", event => {

  const thumbnail = event.target.closest("[data-gallery-index]");

  if (thumbnail) {
    activeRoomImageIndex = Number(thumbnail.dataset.galleryIndex);
    updateRoomGallery();
    return;
  }

  const lightbox = $(".room-lightbox", roomDetailContent);

  if (event.target.closest("[data-open-gallery]")) {
    if (activeRoomImages.length) {
      lightbox.hidden = false;
      updateRoomGallery();
    }
    return;
  }

  if (event.target.closest("[data-gallery-prev]")) {
    activeRoomImageIndex =
      (activeRoomImageIndex - 1 + activeRoomImages.length)
      % activeRoomImages.length;

    updateRoomGallery();
    return;
  }

  if (event.target.closest("[data-gallery-next]")) {
    activeRoomImageIndex =
      (activeRoomImageIndex + 1) % activeRoomImages.length;

    updateRoomGallery();
    return;
  }

  if (event.target.closest("[data-close-gallery]")) {
    lightbox.hidden = true;
  }

});


// OUVERTURE DES DÉTAILS

roomsContainer?.addEventListener("click", event => {

  const button = event.target.closest("[data-room-id]");

  if (button) {
    displayRoomDetails(button.dataset.roomId);
  }

});


// FERMETURE DES DÉTAILS

closeRoomDetail?.addEventListener("click", () => {

  if (roomDetail) {
    roomDetail.hidden = true;
  }

});


// INITIALISATION

displayRooms();

/* =====================================
   6. GALERIE PHOTOS
===================================== */

const galleryContainer = $("#gallery-container");
const galleryFilters = $("#gallery-filters");

const lightbox = $("#gallery-lightbox");
const lightboxImage = $("#lightbox-image");
const lightboxCounter = $("#lightbox-counter");

const galleryPrev = $("#gallery-prev");
const galleryNext = $("#gallery-next");
const galleryCounter = $("#gallery-counter");

let currentGallery = [];
let currentPhotoIndex = 0;

const lightboxCaption = document.createElement("p");
lightboxCaption.className = "gallery-lightbox-caption";

if (lightbox) {
  lightbox.appendChild(lightboxCaption);
}

// Récupérer automatiquement les photos des chambres.

const roomGalleryPhotos = availableRooms.flatMap(room =>
  (room.images || [])
  .filter(Boolean)
  .map(image => ({
    image,
    category: "Hébergement",
    caption: room.name
  }))
);

// Combiner les photos existantes et celles des chambres.
// Éviter les doublons.

const allGalleryPhotos = [
  ...(CONFIG.gallery || []),
  ...roomGalleryPhotos
];

const uniqueGalleryPhotos = allGalleryPhotos.filter(
  (photo, index, array) =>
    array.findIndex(item =>
      item.image === photo.image &&
      item.category === photo.category
    ) === index
);

// Ne conserver que les photos des modules actifs.

const activeGalleryPhotos = uniqueGalleryPhotos.filter(photo => {
  const moduleName = galleryModuleMap[photo.category];

  return !moduleName || CONFIG.modules?.[moduleName] !== false;
});


function updateGalleryCounter() {
  if (!galleryCounter || !galleryContainer) return;

  const total = currentGallery.length;

  if (!total) {
    galleryCounter.textContent = "0 / 0";
    return;
  }

  const firstItem = galleryContainer.firstElementChild;

  if (!firstItem) return;

  const itemWidth = firstItem.getBoundingClientRect().width;

  const gap =
    parseFloat(getComputedStyle(galleryContainer).gap) || 0;

  const step = itemWidth + gap;

  if (!step) return;

  const position = Math.round(
    galleryContainer.scrollLeft / step
  );

  galleryCounter.textContent =
    `${Math.min(position + 1, total)} / ${total}`;
}


function displayGallery(filter = "Tous") {
  if (!galleryContainer) return;

  currentGallery = activeGalleryPhotos.filter(photo =>
    filter === "Tous" || photo.category === filter
  );

  galleryContainer.innerHTML = currentGallery.map((photo, index) => `
  <div class="gallery-item" data-photo-index="${index}">

    <img
      src="${escapeHTML(photo.image)}"
      alt="${escapeHTML(photo.caption || photo.category)}"
      loading="lazy"
    >

    <p class="gallery-caption">
      ${escapeHTML(
        photo.caption ||
        photo.title ||
        photo.description ||
        photo.category
      )}
    </p>

  </div>
`).join("");

  galleryContainer.scrollLeft = 0;

  requestAnimationFrame(updateGalleryCounter);
}


// Filtres de la galerie.

galleryFilters?.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");

  if (!button) return;

  $$(".filter-button").forEach(item => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });

  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");

  displayGallery(button.dataset.filter);
});


// Ouverture de la photo.

function openLightbox(index) {
  if (
    !lightbox ||
    !lightboxImage ||
    !currentGallery.length
  ) return;

  currentPhotoIndex = index;

  updateLightbox();

  lightbox.hidden = false;

  document.body.style.overflow = "hidden";
}


function updateLightbox() {
  const photo = currentGallery[currentPhotoIndex];
  
  if (!photo || !lightboxImage) return;
  
  lightboxImage.src = photo.image;
  lightboxImage.alt = `Photo : ${photo.category}`;
  
  if (lightboxCaption) {
    lightboxCaption.textContent =
      photo.caption ||
      photo.title ||
      photo.description ||
      photo.category;
  }
  
  if (lightboxCounter) {
    lightboxCounter.textContent =
      `${currentPhotoIndex + 1} / ${currentGallery.length}`;
  }
}


// Clic sur une photo.

galleryContainer?.addEventListener("click", event => {
  const item = event.target.closest("[data-photo-index]");

  if (item) {
    openLightbox(Number(item.dataset.photoIndex));
  }
});


// Photo suivante.

$("#lightbox-next")?.addEventListener("click", () => {
  if (!currentGallery.length) return;

  currentPhotoIndex =
    (currentPhotoIndex + 1) % currentGallery.length;

  updateLightbox();
});


// Photo précédente.

$("#lightbox-prev")?.addEventListener("click", () => {
  if (!currentGallery.length) return;

  currentPhotoIndex =
    (currentPhotoIndex - 1 + currentGallery.length) %
    currentGallery.length;

  updateLightbox();
});


// Fermeture de la fenêtre photo.

function closeLightbox() {
  if (!lightbox) return;

  lightbox.hidden = true;

  document.body.style.overflow = "";
}

$("#lightbox-close")?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


// Défilement horizontal.

function scrollGallery(direction) {
  if (!galleryContainer) return;

  const firstItem = galleryContainer.firstElementChild;

  if (!firstItem) return;

  const width = firstItem.getBoundingClientRect().width;

  const gap =
    parseFloat(getComputedStyle(galleryContainer).gap) || 0;

  galleryContainer.scrollBy({
    left: direction * (width + gap),
    behavior: "smooth"
  });
}

galleryNext?.addEventListener("click", () => scrollGallery(1));

galleryPrev?.addEventListener("click", () => scrollGallery(-1));

galleryContainer?.addEventListener(
  "scroll",
  updateGalleryCounter
);

displayGallery();


/* =====================================
   7. FORMULAIRE DE RÉSERVATION
===================================== */

const reservationForm = $("#reservation-form");

if (reservationForm) {

  const roomSelect = $("#reservation-room");
  const clientName = $("#client-name");
  const clientPhone = $("#client-phone");
  const clientEmail = $("#client-email");

  const checkin = $("#checkin");
  const checkout = $("#checkout");
  const guests = $("#guests");

  const nightCount = $("#night-count");
  const estimatedPrice = $("#estimated-price");
  const reservationMessage = $("#reservation-message");


  // Date locale au format AAAA-MM-JJ.

  function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  // Calculer le nombre de nuits.

  function getNightCount(arrival, departure) {
    if (!arrival || !departure) return 0;

    const start = new Date(`${arrival}T00:00:00`);
    const end = new Date(`${departure}T00:00:00`);

    return Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    );
  }


  if (
    roomSelect &&
    clientName &&
    clientPhone &&
    checkin &&
    checkout &&
    guests &&
    nightCount &&
    estimatedPrice &&
    reservationMessage
  ) {

    // Ajouter les chambres disponibles au formulaire.

    availableRooms.forEach(room => {
      const option = document.createElement("option");

      option.value = room.id;
      option.textContent = room.name;

      roomSelect.appendChild(option);
    });


    // Empêcher les dates passées.

    checkin.min = getLocalDate();

    checkout.min = getLocalDate();


    // Calcul des nuits et du tarif estimé.

    function calculateReservation() {
      const room = availableRooms.find(
        item => String(item.id) === roomSelect.value
      );

      nightCount.textContent = "0";

      estimatedPrice.textContent = "À calculer";

      if (!room || !checkin.value || !checkout.value) return;

      const nights = getNightCount(
        checkin.value,
        checkout.value
      );

      if (nights <= 0) return;

      nightCount.textContent = nights;

      estimatedPrice.textContent =
        Number(room.price) > 0
          ? formatPrice(
              nights * Number(room.price),
              room.currency
            )
          : "Tarif à confirmer";
    }


    roomSelect.addEventListener(
      "change",
      calculateReservation
    );


    checkin.addEventListener("change", () => {

      checkout.min = checkin.value || getLocalDate();

      if (
        checkout.value &&
        checkout.value <= checkin.value
      ) {
        checkout.value = "";
      }

      calculateReservation();
    });


    checkout.addEventListener(
      "change",
      calculateReservation
    );


    // Présélectionner une chambre depuis sa fiche.

    roomDetailContent?.addEventListener("click", event => {
      const link = event.target.closest("[data-reserve-room]");

      if (!link || !roomSelect) return;

      roomSelect.value = link.dataset.reserveRoom;

calculateReservation();

document.querySelector("#reservation")?.scrollIntoView({
  behavior: "smooth",
  block: "start"
});
    });


    // Envoyer la demande de réservation sur WhatsApp.

    reservationForm.addEventListener("submit", event => {

      event.preventDefault();

      const room = availableRooms.find(
        item => String(item.id) === roomSelect.value
      );

      const arrival = checkin.value;
      const departure = checkout.value;
      const people = Number(guests.value);

      // Vérifier les informations obligatoires.

      if (
        !clientName.value.trim() ||
        !clientPhone.value.trim() ||
        !room ||
        !arrival ||
        !departure
      ) {
        reservationMessage.textContent =
          "Veuillez compléter les informations de réservation.";
        return;
      }


      // Vérifier la date d'arrivée.

      if (arrival < getLocalDate()) {
        reservationMessage.textContent =
          "La date d'arrivée ne peut pas être dans le passé.";
        return;
      }


      // Vérifier le nombre de nuits.

      const nights = getNightCount(arrival, departure);

      if (nights <= 0) {
        reservationMessage.textContent =
          "La date de départ doit être après la date d'arrivée.";
        return;
      }


      // Vérifier le nombre de personnes.

      if (
        !Number.isInteger(people) ||
        people < 1 ||
        people > Number(room.capacity)
      ) {
        reservationMessage.textContent =
          `Cette chambre accepte au maximum ${room.capacity} personne(s).`;
        return;
      }


      // Vérifier le numéro WhatsApp de l'établissement.

      const whatsapp = String(CONFIG.contact?.whatsapp || "")
        .replace(/\D/g, "");

      if (!whatsapp) {
        reservationMessage.textContent =
          "Le numéro WhatsApp de l'établissement n'est pas encore configuré.";
        return;
      }


      // Préparer le montant estimé.

      const total = Number(room.price) > 0
        ? formatPrice(
            nights * Number(room.price),
            room.currency
          )
        : "À confirmer";


      // Construire le message.

      const message =
        `Bonjour ${CONFIG.name},\n\n` +
        `Je souhaite faire une demande de réservation.\n\n` +
        `Nom : ${clientName.value.trim()}\n` +
        `Téléphone : ${clientPhone.value.trim()}\n` +
        `E-mail : ${clientEmail?.value.trim() || "Non renseigné"}\n` +
        `Chambre : ${room.name}\n` +
        `Arrivée : ${arrival}\n` +
        `Départ : ${departure}\n` +
        `Nombre de nuits : ${nights}\n` +
        `Personnes : ${people}\n` +
        `Montant estimé : ${total}\n\n` +
        `Merci de me confirmer la disponibilité et le tarif.`;


      const url =
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;


      window.open(url, "_blank", "noopener,noreferrer");

      reservationMessage.textContent =
        "Votre demande est prête à être envoyée sur WhatsApp. La réservation reste à confirmer par l'établissement.";

    });

  }
}


/* =====================================
   8. RACCOURCIS CLAVIER
===================================== */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeMenu();
    closeLightbox();
  }

  if (!lightbox || lightbox.hidden) return;

  if (event.key === "ArrowRight") {
    $("#lightbox-next")?.click();
  }

  if (event.key === "ArrowLeft") {
    $("#lightbox-prev")?.click();
  }

});

} // Fin de la configuration MAKTUB


/* =====================================
   RESTAURANT — CONTENU DYNAMIQUE
===================================== */

(function() {
  
  if (!CONFIG) return;
  
  const restaurant = CONFIG.restaurant;
  
  if (!restaurant) return;
  
  const restaurantEnabled =
    CONFIG.modules?.restaurant !== false &&
    restaurant.enabled !== false;
  
  const hero = document.querySelector(".restaurant-hero");
  const heroImage = hero?.querySelector("img");
  
  const intro = document.querySelector("#presentation");
  const introTitle = intro?.querySelector("h2");
  const introText = intro?.querySelector("p:last-child");
  
  const menuSection = document.querySelector("#carte");
  
  if (!restaurantEnabled) {
    if (hero) hero.hidden = true;
    if (intro) intro.hidden = true;
    if (menuSection) menuSection.hidden = true;
    return;
  }
  
  // Image principale
  if (heroImage && restaurant.image) {
    heroImage.src = restaurant.image;
    heroImage.alt = restaurant.title || "Restaurant Maktub";
  }
  
  // Titre de présentation
  if (introTitle) {
    introTitle.textContent =
      restaurant.title || "Notre restaurant";
  }
  
  // Description
  if (introText) {
    introText.textContent =
      restaurant.description || "Découvrez notre restaurant.";
  }
  
})();
/* =====================================
   EXPÉRIENCES ET ÉVÉNEMENTS
===================================== */

(function() {

  if (!CONFIG) return;

  /* =====================================
     EXPÉRIENCES
  ===================================== */

  const experiences = CONFIG.experiences;
  const experiencesSection = document.querySelector("#experiences");
  const experiencesGrid = experiencesSection?.querySelector(".experience-grid");

  const experiencesEnabled =
    CONFIG.modules?.experiences !== false &&
    experiences?.enabled !== false;

  if (!experiencesEnabled) {

    if (experiencesSection) {
      experiencesSection.hidden = true;
    }

  } else if (experiencesGrid) {

    const items = (experiences?.items || []).filter(item =>
      item.enabled !== false
    );

    experiencesGrid.innerHTML = items.length
      ? items.map(item => `

          <article class="experience-card">

            <div class="experience-image">
              ${
                item.image
                  ? `<img
                       src="${escapeHTML(item.image)}"
                       alt="${escapeHTML(item.name)}"
                       loading="lazy"
                     >`
                  : `<div class="image-placeholder">Image à venir</div>`
              }
            </div>

            <div class="experience-card-content">

              <h3>${escapeHTML(item.name)}</h3>

              <p>${escapeHTML(item.description || "")}</p>

              ${
                item.price > 0
                  ? `<span>
                      ${formatPrice(item.price, item.currency || "FCFA")}
                    </span>`
                  : ""
              }

            </div>

          </article>

        `).join("")
      : `<p>Nos expériences seront bientôt présentées.</p>`;


    // Détecter les images qui ne se chargent pas.

    experiencesGrid.querySelectorAll("img").forEach(img => {

      img.addEventListener("error", () => {

        img.style.display = "none";

        const fallback = document.createElement("div");

        fallback.className = "image-placeholder";
        fallback.textContent = "Image indisponible";

        img.parentElement.appendChild(fallback);

        console.error("Image introuvable :", img.src);

      });

    });

  }


  /* =====================================
     ÉVÉNEMENTS
  ===================================== */

  const events = CONFIG.evenements;
  const eventsSection = document.querySelector("#evenements");
  const eventsContent = eventsSection?.querySelector(".events-content");

  const eventsEnabled =
    CONFIG.modules?.evenements !== false &&
    events?.enabled !== false;

  if (!eventsEnabled) {

    if (eventsSection) {
      eventsSection.hidden = true;
    }

  } else if (eventsContent && events) {

    // Le bloc de texte (à droite de l'image).

    const textBox =
      eventsContent.querySelector("div:not(.image-placeholder)") ||
      eventsContent;

    // Titre

    const title = textBox.querySelector("h2, h3");

    if (title) {
      title.textContent = events.title || "Vos événements";
    }

    // Description

    const description = textBox.querySelector("p");

    if (description) {
      description.textContent =
        events.description || "Organisez vos événements chez Maktub.";
    }

    // Image

    const imagePlaceholder =
      eventsSection.querySelector(".image-placeholder");

    if (imagePlaceholder) {

      imagePlaceholder.innerHTML = "";

      if (events.image) {

        const img = document.createElement("img");

        img.src = events.image;
        img.alt = events.title || "Événements Maktub";
        img.loading = "lazy";

        imagePlaceholder.appendChild(img);

        img.addEventListener("error", () => {

          img.remove();

          imagePlaceholder.textContent = "Image indisponible";

          console.error("Image introuvable :", events.image);

        });

      } else {

        imagePlaceholder.textContent = "Image à venir";

      }

    }

    // Types d'événements

    const oldList = textBox.querySelector(".events-types");

    if (oldList) {
      oldList.remove();
    }

    const types = events.types || [];

    if (types.length) {

      const list = document.createElement("ul");

      list.className = "events-types";

      list.innerHTML = types.map(type => `
        <li>${escapeHTML(type)}</li>
      `).join("");

      textBox.appendChild(list);

    }

    // Tarif

    const oldPrice = textBox.querySelector(".events-price");

    if (oldPrice) {
      oldPrice.remove();
    }

    if (events.pricing?.enabled && events.pricing.amount > 0) {

      const price = document.createElement("p");

      price.className = "events-price";

      price.textContent =
        events.pricing.description ||
        `À partir de ${formatPrice(
          events.pricing.amount,
          events.pricing.currency || "FCFA"
        )}`;

      textBox.appendChild(price);

    }

  }

})();

/* =====================================
   9. GALERIE DE LA PISCINE
===================================== */

(function() {

  const poolButton = document.querySelector("#open-pool-gallery");
  const poolSection = document.querySelector("#piscine");

  if (!poolButton || !poolSection) return;

  // Photos de la piscine.
  // Tu pourras ajouter les prochaines images dans cette liste.

  const poolImages = [
  
  "images/gallery/piscine2.jpg",
  "images/gallery/piscine3.jpg",
  ];

  let currentPoolIndex = 0;

  // Créer la fenêtre de galerie.

  const poolLightbox = document.createElement("div");

  poolLightbox.className = "pool-lightbox";
  poolLightbox.hidden = true;

  poolLightbox.innerHTML = `
    <button
      type="button"
      class="pool-lightbox-close"
      aria-label="Fermer la galerie"
    >×</button>

    <button
      type="button"
      class="pool-lightbox-prev"
      aria-label="Photo précédente"
    >‹</button>

    <div class="pool-lightbox-content">

      <img
        class="pool-lightbox-image"
        src=""
        alt="Piscine Maktub"
      >

      <p class="pool-lightbox-counter"></p>

    </div>

    <button
      type="button"
      class="pool-lightbox-next"
      aria-label="Photo suivante"
    >›</button>
  `;

  document.body.appendChild(poolLightbox);

  const poolImage = poolLightbox.querySelector(".pool-lightbox-image");
  const poolCounter = poolLightbox.querySelector(".pool-lightbox-counter");

  const poolClose = poolLightbox.querySelector(".pool-lightbox-close");
  const poolPrev = poolLightbox.querySelector(".pool-lightbox-prev");
  const poolNext = poolLightbox.querySelector(".pool-lightbox-next");


  // Afficher la photo sélectionnée.

  function updatePoolGallery() {

    const image = poolImages[currentPoolIndex];

    poolImage.src = image;

    poolCounter.textContent =
      `${currentPoolIndex + 1} / ${poolImages.length}`;

    // Masquer les flèches s'il n'y a qu'une photo.

    poolPrev.hidden = poolImages.length <= 1;
    poolNext.hidden = poolImages.length <= 1;
  }


  // Ouvrir la galerie.

  poolButton.addEventListener("click", event => {

    event.preventDefault();

    if (!poolImages.length) return;

    currentPoolIndex = 0;

    updatePoolGallery();

    poolLightbox.hidden = false;

    document.body.style.overflow = "hidden";

  });


  // Fermer la galerie.

  function closePoolGallery() {

    poolLightbox.hidden = true;

    document.body.style.overflow = "";

  }

  poolClose.addEventListener("click", closePoolGallery);


  // Photo suivante.

  poolNext.addEventListener("click", () => {

    currentPoolIndex =
      (currentPoolIndex + 1) % poolImages.length;

    updatePoolGallery();

  });


  // Photo précédente.

  poolPrev.addEventListener("click", () => {

    currentPoolIndex =
      (currentPoolIndex - 1 + poolImages.length) %
      poolImages.length;

    updatePoolGallery();

  });


  // Fermer en cliquant sur le fond.

  poolLightbox.addEventListener("click", event => {

    if (event.target === poolLightbox) {
      closePoolGallery();
    }

  });


  // Navigation au clavier.

  document.addEventListener("keydown", event => {

    if (poolLightbox.hidden) return;

    if (event.key === "Escape") {
      closePoolGallery();
    }

    if (event.key === "ArrowRight" && poolImages.length > 1) {
      poolNext.click();
    }

    if (event.key === "ArrowLeft" && poolImages.length > 1) {
      poolPrev.click();
    }

  });
})();


/* =====================================
   10. AVIS CLIENTS — TÉMOIGNAGES APPROUVÉS
===================================== */

(function() {

  const approvedReviewsContainer =
    document.querySelector("#approved-reviews");
  
  if (approvedReviewsContainer && Array.isArray(CONFIG?.reviews)) {
    
    const approvedReviews = CONFIG.reviews;
    
    if (approvedReviews.length === 0) {
      
      approvedReviewsContainer.innerHTML = `
        <p class="reviews-empty">
          Les témoignages de nos visiteurs seront bientôt disponibles.
        </p>
      `;
      
    } else {
      
      approvedReviewsContainer.innerHTML = approvedReviews.map(review => {
        
        const name = escapeHTML(review.name);
        const message = escapeHTML(review.message);
        
        const rating = Math.max(
          1,
          Math.min(5, Number(review.rating) || 1)
        );
        
        const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
        
        return `
          <article class="approved-review">
            <h4>${name}</h4>

            <p class="approved-review-stars">
              ${stars}
            </p>

            <p>${message}</p>
          </article>
        `;
        
      }).join("");
      
    }
    
  }

})();


/* =====================================
   11. ENVOI DU FORMULAIRE D'AVIS (Formspree)
===================================== */

(function() {

  const form = document.querySelector("#review-form");
  const message = document.querySelector("#review-form-message");

  if (!form || !message) return;

  form.addEventListener("submit", async event => {

    // Empêcher le rechargement de la page.
    event.preventDefault();

    // Tant que VOTRE_ID n'est pas remplacé, on prévient.
    if (form.action.includes("VOTRE_ID")) {
      message.textContent =
        "Le formulaire n'est pas encore configuré.";
      return;
    }

    const button = form.querySelector("button[type='submit']");

    button.disabled = true;
    message.textContent = "Envoi en cours...";

    try {

      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Réponse refusée : " + response.status);
      }

      form.reset();

      message.textContent =
        "Merci ! Votre témoignage a bien été envoyé.";

    } catch (error) {

      console.error("Envoi de l'avis impossible :", error);

      message.textContent =
        "L'envoi a échoué. Veuillez réessayer plus tard.";

    }

    button.disabled = false;

  });

})();
