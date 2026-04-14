const galleryGrid = document.querySelector("#gallery-grid");
const uploadInput = document.querySelector("#photo-upload-input");
const photoCount = document.querySelector("#photo-count");
const photoLightbox = document.querySelector("#photo-lightbox");
const photoLightboxImage = document.querySelector("#photo-lightbox-image");
const photoLightboxTitle = document.querySelector("#photo-lightbox-title");
const photoLightboxDate = document.querySelector("#photo-lightbox-date");
const photoLightboxCloseButtons = document.querySelectorAll("[data-photo-lightbox-close]");

const createSceneSvg = ({ palette, title, subtitle, aspect = "4:5" }) => {
  const [first, second, third] = palette;
  const [aspectWidth, aspectHeight] = aspect.split(":").map(Number);
  const width = aspectWidth * 120;
  const height = aspectHeight * 120;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${first}" />
          <stop offset="100%" stop-color="${second}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="28" fill="url(#sky)" />
      <circle cx="${width * 0.78}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.09}" fill="${third}" fill-opacity="0.85" />
      <rect x="${width * 0.08}" y="${height * 0.68}" width="${width * 0.84}" height="${height * 0.2}" rx="18" fill="rgba(255,248,239,0.35)" />
      <path d="M${width * 0.14} ${height * 0.68} C${width * 0.3} ${height * 0.5}, ${width * 0.55} ${height * 0.5}, ${width * 0.76} ${height * 0.68}" stroke="rgba(44,38,34,0.55)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M${width * 0.18} ${height * 0.78} L${width * 0.68} ${height * 0.3}" stroke="rgba(255,252,247,0.22)" stroke-width="4" />
      <text x="${width * 0.08}" y="${height * 0.14}" fill="rgba(45,42,38,0.84)" font-size="${Math.round(width * 0.065)}" font-family="Noto Serif SC, serif">${title}</text>
      <text x="${width * 0.08}" y="${height * 0.23}" fill="rgba(45,42,38,0.58)" font-size="${Math.round(width * 0.035)}" font-family="Manrope, sans-serif">${subtitle}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const mockPhotos = [
  {
    id: "wall-01",
    title: "桥洞边的午后风",
    uploader: "苏小槐",
    date: "2026.04.09",
    tag: "桥与水巷",
    alt: "枫桥水巷与桥洞午后光影示意图",
    image: createSceneSvg({
      palette: ["#e7dac8", "#b7835f", "#f8eddc"],
      title: "桥边光影",
      subtitle: "枫盈枫桥"
    })
  },
  {
    id: "wall-02",
    title: "夜色刚落下的时候",
    uploader: "游客 M.",
    date: "2026.04.08",
    tag: "暮色与灯影",
    alt: "枫桥暮色与灯影示意图",
    image: createSceneSvg({
      palette: ["#5f6e78", "#31424f", "#e8c58e"],
      title: "暮色枫桥",
      subtitle: "Evening Walk",
      aspect: "5:4"
    })
  },
  {
    id: "wall-03",
    title: "寒山寺旁的小摊热气",
    uploader: "桥畔路人",
    date: "2026.04.07",
    tag: "生活片段",
    alt: "枫桥街边生活场景示意图",
    image: createSceneSvg({
      palette: ["#f0e0cc", "#9c6d53", "#d4b28c"],
      title: "街边温度",
      subtitle: "Local Moment",
      aspect: "4:6"
    })
  },
  {
    id: "wall-04",
    title: "水面把桥影拉得很长",
    uploader: "Maple Walker",
    date: "2026.04.06",
    tag: "桥与水巷",
    alt: "桥影映在水面的示意图",
    image: createSceneSvg({
      palette: ["#d8e4df", "#688175", "#f4f1ea"],
      title: "水巷倒影",
      subtitle: "Bridge Reflection",
      aspect: "3:4"
    })
  },
  {
    id: "wall-05",
    title: "雨后青石路很安静",
    uploader: "南方旅记",
    date: "2026.04.05",
    tag: "生活片段",
    alt: "雨后青石路与街景示意图",
    image: createSceneSvg({
      palette: ["#d9d2c6", "#6b5447", "#f0e0bf"],
      title: "雨后街巷",
      subtitle: "Quiet Stone Road",
      aspect: "5:6"
    })
  },
  {
    id: "wall-06",
    title: "远处钟声和近处河波",
    uploader: "匿名访客",
    date: "2026.04.04",
    tag: "暮色与灯影",
    alt: "河道与远景寺院氛围示意图",
    image: createSceneSvg({
      palette: ["#d8c6ad", "#8f5f3f", "#f7ecd9"],
      title: "钟声与河波",
      subtitle: "Heritage Calm",
      aspect: "16:10"
    })
  }
];

const openPhotoLightbox = (photo) => {
  if (!photoLightbox || !photoLightboxImage || !photoLightboxTitle || !photoLightboxDate) {
    return;
  }

  photoLightboxImage.src = photo.image;
  photoLightboxImage.alt = photo.alt;
  photoLightboxTitle.textContent = photo.title;
  photoLightboxDate.textContent = photo.date;
  photoLightbox.classList.add("is-open");
  photoLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("photo-lightbox-open");
};

const closePhotoLightbox = () => {
  if (!photoLightbox || !photoLightboxImage || !photoLightboxTitle || !photoLightboxDate) {
    return;
  }

  photoLightbox.classList.remove("is-open");
  photoLightbox.setAttribute("aria-hidden", "true");
  photoLightboxImage.src = "";
  photoLightboxImage.alt = "";
  photoLightboxTitle.textContent = "枫桥瞬间";
  photoLightboxDate.textContent = "";
  document.body.classList.remove("photo-lightbox-open");
};

const createPhotoCard = (photo) => {
  const card = document.createElement("article");
  card.className = "photo-card";
  card.dataset.tag = photo.tag || "";

  card.innerHTML = `
    <button class="photo-frame ${photo.isUploaded ? "photo-frame-uploaded" : ""}" type="button" aria-label="放大查看 ${photo.title}">
      <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
    </button>
    <div class="photo-card-copy">
      <div class="photo-card-meta">
        <span class="photo-date">${photo.date}</span>
      </div>
      <h3>${photo.title}</h3>
    </div>
  `;

  const trigger = card.querySelector(".photo-frame");
  if (trigger) {
    trigger.addEventListener("click", () => openPhotoLightbox(photo));
  }

  return card;
};

const renderGallery = (items) => {
  if (!galleryGrid) {
    return;
  }

  galleryGrid.innerHTML = "";
  items.forEach((item) => {
    galleryGrid.appendChild(createPhotoCard(item));
  });

  if (photoCount) {
    photoCount.textContent = String(items.length);
  }
};

renderGallery(mockPhotos);

if (uploadInput) {
  uploadInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const uploadedPhotos = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^.]+$/, "") || "新上传照片",
      uploader: "枫盈枫桥用户",
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      tag: "新上传",
      alt: `用户上传的枫桥照片预览：${file.name}`,
      image: URL.createObjectURL(file),
      isUploaded: true
    }));

    renderGallery([...uploadedPhotos, ...mockPhotos]);
  });
}

photoLightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closePhotoLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoLightbox?.classList.contains("is-open")) {
    closePhotoLightbox();
  }
});
