// ===== Carousel, Lightbox, FAQ, and Today's Special Logic (All DOM Ready) =====
document.addEventListener("DOMContentLoaded", function () {
  // ===== Today's Special Logic =====
  const specialsData = [
    {
      image: "images/cakes.png",
      title: "Decadent Chocolate Layer Cake",
      description: "Rich, moist chocolate cake with velvety ganache frosting and fresh berries.",
      price: "$24.99"
    },
    {
      image: "images/crossiant.png",
      title: "Artisan Butter Croissants",
      description: "Flaky, buttery croissants made with premium French butter and patience.",
      price: "$3.50"
    },
    {
      image: "images/cupcakes.png",
      title: "Gourmet Cupcake Collection",
      description: "Assorted cupcakes with unique flavors and artistic buttercream designs.",
      price: "$18.99"
    },
    {
      image: "images/background.png",
      title: "Baker's Choice Surprise",
      description: "A delightful selection of our finest pastries, chosen by our head baker.",
      price: "$15.99"
    }
  ];

  function loadTodaysSpecial() {
    // Use Math.random() to select a random special
    const randomIndex = Math.floor(Math.random() * specialsData.length);
    const todaysSpecial = specialsData[randomIndex];
    
    // Update the DOM elements
    const specialImage = document.getElementById('special-image');
    const specialTitle = document.getElementById('special-title');
    const specialDescription = document.getElementById('special-description');
    const specialPrice = document.getElementById('special-price');
    
    if (specialImage && specialTitle && specialDescription && specialPrice) {
      specialImage.src = todaysSpecial.image;
      specialImage.alt = todaysSpecial.title;
      specialTitle.textContent = todaysSpecial.title;
      specialDescription.textContent = todaysSpecial.description;
      specialPrice.textContent = todaysSpecial.price;
    }
  }
  
  // Load today's special on page load
  loadTodaysSpecial();

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
      document.querySelectorAll(".toggle-faq").forEach((btn) => {
        if (btn !== button) {
          btn.nextElementSibling.style.maxHeight = null;
          btn.querySelector("span").textContent = "+";
        }
      });
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

