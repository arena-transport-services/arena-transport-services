(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Header shadow on scroll ----------
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile navigation ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  // ---------- Highlight current section in nav ----------
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-current", link.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "services", "about", "clients", "contact"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  // ---------- Hero slider ----------
  var slides = document.querySelectorAll(".slide");
  var dotsWrap = document.querySelector(".hero__dots");
  var hero = document.querySelector(".hero");
  var current = 0;
  var timer = null;
  var INTERVAL = 6500;

  var dots = Array.prototype.map.call(slides, function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function go(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.querySelectorAll("a").forEach(function (a) {
        a.tabIndex = active ? 0 : -1;
      });
    });
    dots.forEach(function (dot, i) {
      dot.setAttribute("aria-selected", String(i === current));
    });
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function restart() { stop(); start(); }

  document.querySelectorAll(".hero__arrow").forEach(function (btn) {
    btn.addEventListener("click", function () {
      go(current + Number(btn.dataset.dir));
      restart();
    });
  });

  // Swipe support on touch devices
  var touchX = null;
  hero.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { go(current + (dx < 0 ? 1 : -1)); restart(); }
    touchX = null;
  });

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });

  go(0);
  start();

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- Contact form ----------
  // GitHub Pages is static, so the form opens the visitor's email client
  // with the message pre-filled instead of posting to a server.
  var form = document.getElementById("contact-form");
  var status = form.querySelector(".form-status");
  var EMAIL = "info@arenatransport.com.au";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var invalid = [name, email, message].filter(function (field) {
      var bad = !field.value.trim() || !field.checkValidity();
      field.classList.toggle("is-invalid", bad);
      return bad;
    });

    status.classList.remove("is-ok");
    if (invalid.length) {
      status.textContent = "Please fill in your name, a valid email address and a message.";
      invalid[0].focus();
      return;
    }

    var subject = "Website enquiry from " + name.value.trim();
    var body = message.value.trim() + "\n\n—\n" + name.value.trim() + "\n" + email.value.trim();
    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Your email app should now be open. Just press send.";
    status.classList.add("is-ok");
  });

  form.addEventListener("input", function (e) {
    e.target.classList.remove("is-invalid");
  });

  // ---------- Footer year ----------
  document.getElementById("year").textContent = new Date().getFullYear();
})();
