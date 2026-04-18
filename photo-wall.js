const galleryGrid = document.querySelector("#gallery-grid");
const uploadInput = document.querySelector("#photo-upload-input");
const photoCount = document.querySelector("#photo-count");
const photoLightbox = document.querySelector("#photo-lightbox");
const photoLightboxImage = document.querySelector("#photo-lightbox-image");
const photoLightboxTitle = document.querySelector("#photo-lightbox-title");
const photoLightboxDate = document.querySelector("#photo-lightbox-date");
const photoLightboxCloseButtons = document.querySelectorAll("[data-photo-lightbox-close]");
const photoUploadToast = document.querySelector("#photo-upload-toast");
const photoUploadToastClose = document.querySelector("[data-photo-upload-toast-close]");
let photoUploadToastTimer = null;
let uploadedPhotos = [];
const photoWallLanguage = window.MAPLE_BRIDGE_I18N?.getLanguage?.() || "zh";
const photoWallIsEnglish = photoWallLanguage === "en";
const photoWallUi = {
  lightboxTitle: { zh: "枫桥瞬间", en: "Maple Bridge Moment" },
  uploadSuccess: { zh: "上传成功", en: "Upload complete" },
  close: { zh: "关闭", en: "Close" },
  zoomView: { zh: "放大查看", en: "Open preview" },
  uploadedTitle: { zh: "新上传照片", en: "New Upload" },
  uploadedUser: { zh: "枫盈枫桥用户", en: "Maple Bridge User" },
  uploadedTag: { zh: "新上传", en: "New Upload" },
};

const text = (value) => window.MAPLE_BRIDGE_I18N?.text?.(value) || (typeof value === "string" ? value : value.zh);

const mockPhotos = [
  {
    id: "wall-01",
    title: "千年暗室一灯明",
    uploader: "苏小槐",
    date: "2026.04.09",
    tag: "桥与水巷",
    alt: "照片墙展示图片：千年暗室一灯明",
    image: "images/photo_wall/千年暗室一灯明.jpg"
  },
  {
    id: "wall-02",
    title: "当太阳第三万次照拂古刹",
    uploader: "游客 M.",
    date: "2026.04.08",
    tag: "暮色与灯影",
    alt: "照片墙展示图片：当太阳第三万次照拂古刹",
    image: "images/photo_wall/当太阳第三万次照拂古刹.jpg"
  },
  {
    id: "wall-03",
    title: "月夜、古塔、她",
    uploader: "桥畔路人",
    date: "2026.04.07",
    tag: "生活片段",
    alt: "照片墙展示图片：月夜、古塔、她",
    image: "images/photo_wall/月夜、古塔、她.jpg"
  },
  {
    id: "wall-04",
    title: "水面下的第二座桥",
    uploader: "Maple Walker",
    date: "2026.04.06",
    tag: "桥与水巷",
    alt: "照片墙展示图片：水面下的第二座桥",
    image: "images/photo_wall/水面下的第二座桥.jpg"
  },
  {
    id: "wall-05",
    title: "江枫白日",
    uploader: "南方旅记",
    date: "2026.04.05",
    tag: "生活片段",
    alt: "照片墙展示图片：江枫白日",
    image: "images/photo_wall/江枫白日.jpg"
  },
  {
    id: "wall-06",
    title: "黄昏也会落下",
    uploader: "匿名访客",
    date: "2026.04.04",
    tag: "暮色与灯影",
    alt: "照片墙展示图片：黄昏也会落下",
    image: "images/photo_wall/黄昏也会落下.jpg"
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
  photoLightboxTitle.textContent = text(photoWallUi.lightboxTitle);
  photoLightboxDate.textContent = "";
  document.body.classList.remove("photo-lightbox-open");
};

const hideUploadToast = () => {
  if (!photoUploadToast) {
    return;
  }

  photoUploadToast.hidden = true;
  photoUploadToast.classList.remove("is-visible");
};

const showUploadToast = () => {
  if (!photoUploadToast) {
    return;
  }

  if (photoUploadToastTimer) {
    clearTimeout(photoUploadToastTimer);
  }

  const toastText = photoUploadToast?.querySelector(".photo-upload-toast-text");
  if (toastText) {
    toastText.textContent = text(photoWallUi.uploadSuccess);
  }

  photoUploadToast.hidden = false;
  photoUploadToast.classList.add("is-visible");
  photoUploadToastTimer = window.setTimeout(() => {
    hideUploadToast();
  }, 2400);
};

const createPhotoCard = (photo) => {
  const card = document.createElement("article");
  card.className = "photo-card";
  card.dataset.tag = photo.tag || "";

  card.innerHTML = `
    <button class="photo-frame ${photo.isUploaded ? "photo-frame-uploaded" : ""}" type="button" aria-label="${text(photoWallUi.zoomView)} ${photo.title}">
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

renderGallery([...uploadedPhotos, ...mockPhotos]);

if (uploadInput) {
  uploadInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const newUploadedPhotos = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^.]+$/, "") || text(photoWallUi.uploadedTitle),
      uploader: text(photoWallUi.uploadedUser),
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      tag: text(photoWallUi.uploadedTag),
      alt: photoWallIsEnglish ? `Uploaded Maple Bridge photo preview: ${file.name}` : `用户上传的枫桥照片预览：${file.name}`,
      image: URL.createObjectURL(file),
      isUploaded: true
    }));

    uploadedPhotos = [...newUploadedPhotos, ...uploadedPhotos];
    renderGallery([...uploadedPhotos, ...mockPhotos]);
    uploadInput.value = "";
    showUploadToast();
  });
}

photoLightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closePhotoLightbox);
});

if (photoUploadToastClose) {
  photoUploadToastClose.addEventListener("click", () => {
    if (photoUploadToastTimer) {
      clearTimeout(photoUploadToastTimer);
    }
    hideUploadToast();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoLightbox?.classList.contains("is-open")) {
    closePhotoLightbox();
  }
});
