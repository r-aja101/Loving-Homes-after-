(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Active nav
  const page = document.body.getAttribute("data-page");
  const map = {
    home: "index.html",
    services: "services.html",
    packages: "packages.html",
    about: "about.html",
    contact: "contact.html"
  };

  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (page && map[page] && href.endsWith(map[page])) a.classList.add("active");
  });

  // Mobile menu open/close
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-list");

  function openMenu() {
    if (!menu || !toggle) return;
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    menu.addEventListener("click", (e) => {
      const t = e.target;
      if (t instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      const clickedInside = menu.contains(target) || toggle.contains(target);
      if (!clickedInside && menu.classList.contains("open")) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
  }

  // Package pick (localStorage)
  const storageKey = "lovingHomesPackage";
  const notice = document.getElementById("selectedNotice");
  const picks = document.querySelectorAll(".js-pick");

  function setNotice(text) {
    if (notice) notice.textContent = text;
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) setNotice(`تم اختيار: ${saved}`);

  picks.forEach(btn => {
    btn.addEventListener("click", () => {
      const pkg = btn.getAttribute("data-package") || "";
      localStorage.setItem(storageKey, pkg);
      setNotice(`تم اختيار: ${pkg} (تم حفظه)`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Contact page: show picked package + prefill message
  const pickedEl = document.getElementById("pickedPackage");
  const msgEl = document.getElementById("message");
  const pkg = localStorage.getItem(storageKey);

  if (pickedEl) pickedEl.textContent = pkg || "—";
  if (msgEl && pkg && !msgEl.value.trim()) {
    msgEl.value = `الحزمة المطلوبة: ${pkg}\n\n`;
  }

  // Contact form validation (front-end)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("ok", "error");
    if (type) status.classList.add(type);
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      const nameVal = (name?.value || "").trim();
      const emailVal = (email?.value || "").trim();
      const msgVal = (message?.value || "").trim();

      if (!nameVal || !emailVal || !msgVal) {
        setStatus("رجاءً عبّئ الاسم والبريد والرسالة.", "error");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
        setStatus("رجاءً أدخل بريد إلكتروني صحيح.", "error");
        return;
      }

      setStatus("تم إرسال الرسالة (تجريبي). شكرًا لتواصلك!", "ok");
      form.reset();

      if (message && pkg) message.value = `الحزمة المطلوبة: ${pkg}\n\n`;
    });
  }

  // Scroll Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Services Tabs Alternative
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelector('.tabs-content');

  if (tabBtns.length > 0 && tabContents) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        // Remove active from all btns and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        Array.from(tabContents.children).forEach(c => c.classList.remove('active'));

        // Add active to current
        btn.classList.add('active');
        const activeContent = document.getElementById(target);
        if (activeContent) activeContent.classList.add('active');
      });
    });
  }

  // Custom Cursor
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  if (dot && outline) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      outline.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
    });

    // Hover effects
    document.querySelectorAll('a, button, .card').forEach(el => {
      el.addEventListener('mouseenter', () => outline.style.transform += ' scale(1.5)');
      el.addEventListener('mouseleave', () => outline.style.transform = outline.style.transform.replace(' scale(1.5)', ''));
    });
  }

  // Count Up Stats
  const stats = document.querySelectorAll('.stat-num');
  const countOptions = { threshold: 0.5 };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetNum = parseInt(entry.target.innerText.replace(/\D/g, ''));
        let count = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          count = Math.floor(progress * targetNum);
          entry.target.innerText = (entry.target.innerText.startsWith('+') ? '+' : '') + count + (entry.target.innerText.endsWith('%') ? '%' : '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        countObserver.unobserve(entry.target);
      }
    });
  }, countOptions);

  stats.forEach(s => countObserver.observe(s));
})();