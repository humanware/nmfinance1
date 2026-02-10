$(document).ready(function () {
  const $window = $(window);
  const $body = $("body");
  const $topbar = $("#topbar");
  const $navbar = $("#mainNav");
  const jotformUrl = "https://form.jotform.com/222776871446063";
  const $backToTop = $(".back-to-top");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lastScrollTop = 0;
  let topbarVisible = true;

  const updateOffsets = () => {
    if (!$navbar.length) return;
    const topbarHeight = topbarVisible && $topbar.is(":visible") ? $topbar.outerHeight() : 0;
    const navbarHeight = $navbar.outerHeight() || 0;
    $navbar.css("top", `${topbarHeight}px`);
    $body.css("padding-top", `${topbarHeight + navbarHeight}px`);
  };

  const handleNavbarState = () => {
    const scrollTop = $window.scrollTop();

    topbarVisible = scrollTop <= 40;
    $topbar.toggleClass("hidden", !topbarVisible);

    if (scrollTop > 40) {
      $navbar.addClass("solid");
    } else {
      $navbar.removeClass("solid");
    }

    if (scrollTop > 120 && scrollTop > lastScrollTop) {
      $navbar.addClass("hide");
    } else {
      $navbar.removeClass("hide");
    }

    $backToTop.toggleClass("show", scrollTop > 600);

    lastScrollTop = scrollTop;
    updateOffsets();
  };

  updateOffsets();
  handleNavbarState();

  $window.on("resize", updateOffsets);
  $window.on("scroll", handleNavbarState);

  const closeOffcanvas = () => {
    const offcanvasEl = document.getElementById("offcanvasNav");
    if (offcanvasEl && offcanvasEl.classList.contains("show")) {
      bootstrap.Offcanvas.getInstance(offcanvasEl).hide();
    }
  };

  $(document).on("click", "a[href^='#']", function (event) {
    const targetId = $(this).attr("href");
    const $target = $(targetId);

    if ($target.length) {
      event.preventDefault();
      closeOffcanvas();
      const topbarHeight = topbarVisible && $topbar.is(":visible") ? $topbar.outerHeight() : 0;
      const navbarHeight = $navbar.outerHeight() || 0;
      const offset = topbarHeight + navbarHeight + 12;
      $("html, body").animate({ scrollTop: $target.offset().top - offset }, 700);
    }
  });

  $backToTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 700);
  });

  const observerOptions = { root: null, rootMargin: "-35% 0px -55% 0px", threshold: 0 };
  const observer = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          $(".navbar .nav-link").removeClass("active");
          $(`.navbar .nav-link[href='#${id}']`).addClass("active");
        }
      });
    }, observerOptions)
    : null;

  if (observer) {
    $("section[id], header[id]").each(function () {
      observer.observe(this);
    });
  }

  $(document).on("click", "[data-loan-app='true']", function (event) {
    event.preventDefault();
    const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
    let popupWindow = null;

    if (!isMobile) {
      popupWindow = window.open(jotformUrl, "nmLoanApp", "width=980,height=760,scrollbars=yes,resizable=yes");
    } else {
      popupWindow = window.open(jotformUrl, "_blank", "noopener");
    }

    if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === "undefined") {
      const fallbackTab = window.open(jotformUrl, "_blank", "noopener");
      if (!fallbackTab) {
        window.location.href = jotformUrl;
      }
    }
  });

  const $contactForm = $("#contactForm");
  if ($contactForm.length) {
    $("#form_start").val(Math.floor(Date.now() / 1000));

    $contactForm.on("submit", function (event) {
      event.preventDefault();
      const form = this;
      const $msg = $("#formMessage");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      $.ajax({
        url: $contactForm.attr("action"),
        method: "POST",
        data: $contactForm.serialize(),
        dataType: "json"
      }).done(function (resp) {
        $msg.removeClass("error").addClass("success").text(resp.message || "Message sent successfully.");
        form.reset();
        $("#form_start").val(Math.floor(Date.now() / 1000));
      }).fail(function (xhr) {
        const resp = xhr.responseJSON || {};
        $msg.removeClass("success").addClass("error").text(resp.message || "Unable to send right now.");
      });
    });
  }

  if (!prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline()
      .from(".hero .tag", { opacity: 0, y: 20, duration: 0.6 })
      .from(".hero h1", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
      .from(".hero .lead", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
      .from(".hero .btn", { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, "-=0.3")
      .from(".hero-pills span", { opacity: 0, y: 16, duration: 0.4, stagger: 0.1 }, "-=0.3")
      .from(".hero-card", { opacity: 0, y: 20, duration: 0.6 }, "-=0.2");

    gsap.utils.toArray("[data-anim]").forEach((element) => {
      const animType = element.getAttribute("data-anim");
      if (animType === "stagger") {
        gsap.from(element.children, {
          opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 85%" }
        });
      } else {
        gsap.from(element, {
          opacity: 0, y: 24, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 85%" }
        });
      }
    });

    gsap.to(".hero-shape", { y: -20, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1 });
    gsap.to(".cash-advance-card", { boxShadow: "0 0 30px rgba(47, 109, 255, 0.35)", duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".trust-strip i", { y: -6, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2 });
    gsap.to(".hero-pills span", { y: -6, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.25 });
  }

  if (window.Swiper) {
    const swiperOptions = {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }
    };

    if (!prefersReducedMotion) {
      swiperOptions.autoplay = { delay: 4500, disableOnInteraction: false };
    }

    new Swiper(".testimonial-swiper", swiperOptions);
  }

  $("#year").text(new Date().getFullYear());
});
