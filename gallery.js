// Simple 2D gallery with lightbox and scroll‑in animations

const artworks = [
  { src: "Art/Screenshot 2026-02-26 143259.png", title: "Concept sheet I" },
  { src: "Art/Screenshot 2026-02-26 143314.png", title: "Concept sheet II" },
  { src: "Art/Screenshot 2026-02-26 143320.png", title: "Concept sheet III" },
  { src: "Art/Screenshot 2026-02-26 143328.png", title: "Concept sheet IV" },
  { src: "Art/Screenshot 2026-02-26 143333.png", title: "Concept sheet V" },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44.jpeg",
    title: "Slug‑napper poster",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (1).jpeg",
    title: "Poster 1",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (2).jpeg",
    title: "Poster 2",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (3).jpeg",
    title: "Poster 3",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (4).jpeg",
    title: "Poster 4",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (5).jpeg",
    title: "Poster 5",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (6).jpeg",
    title: "Poster 6",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (7).jpeg",
    title: "Poster 7",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (8).jpeg",
    title: "Poster 8",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (9).jpeg",
    title: "Poster 9",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (10).jpeg",
    title: "Poster 10",
  },
  {
    src: "Art/WhatsApp Image 2026-02-26 at 14.28.44 (11).jpeg",
    title: "Poster 11",
  },
];

const galleryEl = document.getElementById("gallery");
const contentGalleryEl = document.getElementById("content-gallery");
const lightboxEl = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");

function createCard(art, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.transitionDelay = `${index * 40}ms`;

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const wrap = document.createElement("div");
  wrap.className = "card-image-wrap";

  const img = document.createElement("img");
  img.className = "card-image";
  img.src = art.src;
  img.alt = "";

  const button = document.createElement("button");
  button.className = "card-button";
  button.type = "button";
  button.addEventListener("click", () => openLightbox(art));

  wrap.appendChild(img);

  inner.appendChild(wrap);
  card.appendChild(inner);
  card.appendChild(button);

  return card;
}

function buildGallery() {
  artworks.forEach((art, index) => {
    const card = createCard(art, index);
    galleryEl.appendChild(card);
  });

  const contentArtworks = [
    { src: "Art/Content Creation/PosterSchoolofRock-01.png" },
    { src: "Art/Content Creation/Screenshot 2026-02-26 151325.png" },
    { src: "Art/Content Creation/WhatsApp Image 2026-02-26 at 15.11.06.jpeg" },
    { src: "Art/Content Creation/WhatsApp Image 2026-02-26 at 15.11.07 (1).jpeg" },
    { src: "Art/Content Creation/WhatsApp Image 2026-02-26 at 15.11.07.jpeg" },
  ];

  contentArtworks.forEach((art, index) => {
    const card = createCard(art, index);
    contentGalleryEl.appendChild(card);
  });
}

function openLightbox(art) {
  lightboxImage.src = art.src;
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  lightboxEl.classList.add("lightbox--open");
  lightboxEl.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightboxEl.classList.remove("lightbox--open");
  lightboxEl.setAttribute("aria-hidden", "true");
}

function setupLightbox() {
  lightboxEl.addEventListener("click", (event) => {
    if (event.target.dataset.lightboxClose !== undefined || event.target === lightboxEl) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

function setupScrollAnimations() {
  const cards = Array.from(document.querySelectorAll(".card"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("card--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  cards.forEach((card) => observer.observe(card));
}

buildGallery();
setupLightbox();
setupScrollAnimations();

