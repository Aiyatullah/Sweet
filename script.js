// ===== Carousel, Lightbox, and FAQ Logic (All DOM Ready) =====
document.addEventListener("DOMContentLoaded", function () {
  // ===== Carousel Logic =====
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  let carouselInterval = null;

  if (carousel && prevBtn && nextBtn) {
    let currentIndex = 0;
    const totalSlides = carousel.children.length;
    const progressBar = document.getElementById("carousel-progress");
    let progressTimeout = null;

    function updateCarousel() {
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        // Force reflow for restart
        void progressBar.offsetWidth;
        progressBar.style.transition = "width 3s linear";
        progressBar.style.width = "100%";
      }
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    // Auto-transition every 3 seconds
    function startCarouselAuto() {
      if (carouselInterval) clearInterval(carouselInterval);
      if (progressTimeout) clearTimeout(progressTimeout);
      updateCarousel();
      carouselInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
      }, 3000);
    }
    function stopCarouselAuto() {
      if (carouselInterval) clearInterval(carouselInterval);
      if (progressTimeout) clearTimeout(progressTimeout);
      if (progressBar) progressBar.style.width = "0%";
    }
    carousel.parentElement.addEventListener("mouseenter", stopCarouselAuto);
    carousel.parentElement.addEventListener("mouseleave", startCarouselAuto);
    updateCarousel();
    startCarouselAuto();
  }

  // ===== Sparkle Effect on Gallery Hover =====
  // document.querySelectorAll("#gallery .group").forEach((item) => {
  //   item.addEventListener("mouseenter", (e) => {
  //     const sparkleContainer = item.querySelector("#sparkle-container");
  //     if (!sparkleContainer) return;
  //     for (let i = 0; i < 8; i++) {
  //       const sparkle = document.createElement("div");
  //       sparkle.className = "sparkle";
  //       const x = Math.random() * 90 + 5;
  //       const y = Math.random() * 90 + 5;
  //       sparkle.style.left = `${x}%`;
  //       sparkle.style.top = `${y}%`;
  //       sparkleContainer.appendChild(sparkle);
  //       setTimeout(() => sparkle.remove(), 700);
  //     }
  //   });
  // });

  // ===== LIGHTBOX LOGIC (with Animated Show/Hide) =====
  const galleryItems = document.querySelectorAll("#gallery .group");
  const galleryImages = Array.from(
    document.querySelectorAll("#gallery .group img")
  );
  let currentImageIndex = 0;

  function updateLightboxContent() {
    const img = galleryImages[currentImageIndex];
    document.getElementById("lightbox-image").src = img.src;
    document.getElementById("lightbox-caption").textContent =
      img.alt || "Sweet Treat";
    document.getElementById("lightbox-counter").textContent = `${
      currentImageIndex + 1
    } of ${galleryImages.length}`;
  }

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("hidden");
    setTimeout(() => {
      lightbox.style.opacity = "1";
      lightbox.style.transform = "scale(1)";
    }, 10);
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.opacity = "0";
    lightbox.style.transform = "scale(0.98)";
    setTimeout(() => {
      lightbox.classList.add("hidden");
    }, 400);
    document.body.style.overflow = "auto";
  }

  function nextImage() {
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  function prevImage() {
    if (!galleryImages.length) return;
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
  }

  // Attach click listeners to gallery items (the parent divs)
  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        openLightbox(index);
      });
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && !lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    }
  });

  // Overlay click closes lightbox
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  // Lightbox Controls
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtnLightbox = document.getElementById("lightbox-prev");
  const nextBtnLightbox = document.getElementById("lightbox-next");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }
  if (prevBtnLightbox) {
    prevBtnLightbox.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the lightbox from closing
      prevImage();
    });
  }
  if (nextBtnLightbox) {
    nextBtnLightbox.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the lightbox from closing
      nextImage();
    });
  }

  // Add swipe support for lightbox (touch events)
  (function addSwipeSupport() {
    const image = document.getElementById("lightbox-image");
    let startX = 0;
    let endX = 0;
    function onTouchStart(e) {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
      }
    }
    function onTouchMove(e) {
      if (e.touches && e.touches.length === 1) {
        endX = e.touches[0].clientX;
      }
    }
    function onTouchEnd() {
      if (startX && endX) {
        const diff = endX - startX;
        if (Math.abs(diff) > 50) {
          if (diff < 0) nextImage(); // swipe left
          else prevImage(); // swipe right
        }
      }
      startX = 0;
      endX = 0;
    }
    if (image) {
      image.addEventListener("touchstart", onTouchStart);
      image.addEventListener("touchmove", onTouchMove);
      image.addEventListener("touchend", onTouchEnd);
    }
  })();

  // ===== FAQ Accordion Logic =====
  document.querySelectorAll(".toggle-faq").forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector("span");
      const isExpanded = content.style.maxHeight;
      // First, close all other FAQ items for a clean accordion effect
      document.querySelectorAll(".toggle-faq").forEach((btn) => {
        if (btn !== button) {
          btn.nextElementSibling.style.maxHeight = null;
          btn.querySelector("span").textContent = "+";
        }
      });
      // Then, toggle the state of the clicked item
      if (isExpanded) {
        content.style.maxHeight = null;
        icon.textContent = "+";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.textContent = "−";
      }
    });
  });
});

