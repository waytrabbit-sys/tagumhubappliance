/* ==========================================================================
   ROBINSONS APPLIANCES TAGUM — SITE SCRIPT
   Vanilla JS only. Handles: sticky header shadow, hamburger/mobile drawer,
   active-nav highlighting, smooth scroll for on-page anchors, scroll-reveal
   fade-ins, back-to-top button, floating action button stack, simple
   product-grid category filtering, and a front-end-only contact form demo.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------------------
     1. STICKY HEADER SHADOW ON SCROLL
  ----------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* -----------------------------------------------------------------------
     2. HAMBURGER / MOBILE NAV DRAWER
  ----------------------------------------------------------------------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close the drawer whenever a link inside it is tapped */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* -----------------------------------------------------------------------
     3. ACTIVE NAVIGATION — highlight the link matching the current page
  ----------------------------------------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-nav a').forEach(function (link) {
    var linkPage = link.getAttribute('href');
    if (!linkPage) return;
    linkPage = linkPage.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* -----------------------------------------------------------------------
     4. SMOOTH SCROLL FOR ON-PAGE ANCHOR LINKS (e.g. "#categories")
  ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  /* -----------------------------------------------------------------------
     5. SCROLL-REVEAL FADE-IN ANIMATIONS
  ----------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* Fallback: no IntersectionObserver support — just show everything */
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Stagger children of any .reveal-stagger container */
  document.querySelectorAll('.reveal-stagger').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  /* -----------------------------------------------------------------------
     6. BACK TO TOP BUTTON
  ----------------------------------------------------------------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 480) backToTop.classList.add('is-visible');
      else backToTop.classList.remove('is-visible');
    }
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------------------------------
     7. FLOATING ACTION BUTTON (FAB) STACK — Call / Email / Facebook / Directions
  ----------------------------------------------------------------------- */
  var fabStack = document.querySelector('.fab-stack');
  var fabToggle = document.querySelector('.fab-toggle');
  if (fabStack && fabToggle) {
    fabToggle.addEventListener('click', function () {
      var isOpen = fabStack.classList.toggle('is-open');
      fabToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    /* Close the FAB menu if the user clicks elsewhere on the page */
    document.addEventListener('click', function (e) {
      if (!fabStack.contains(e.target)) fabStack.classList.remove('is-open');
    });
  }

  /* -----------------------------------------------------------------------
     8. PRODUCT / CATEGORY FILTER (used on products.html)
     Cards are tagged with data-category; filter buttons carry the same
     value in data-filter="". "all" shows everything.
  ----------------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-grid .product-card');
  var emptyState = document.querySelector('.empty-state');

  if (filterButtons.length && productCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');
        var visibleCount = 0;

        productCards.forEach(function (card) {
          var matches = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = matches ? '' : 'none';
          if (matches) visibleCount++;
        });

        if (emptyState) {
          emptyState.classList.toggle('is-visible', visibleCount === 0);
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     9. CONTACT FORM (front-end only demo — no backend wired up)
  ----------------------------------------------------------------------- */
  var contactForm = document.querySelector('.contact-form');
  var formSuccess = document.querySelector('.form-success');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formSuccess.classList.add('is-visible');
      contactForm.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* -----------------------------------------------------------------------
     10. "INQUIRE" BUTTONS — pre-fill the contact page via a query string
     (works when contact.html reads window.location.search — kept simple
     and optional so it degrades gracefully as a plain link otherwise)
  ----------------------------------------------------------------------- */
  var inquireButtons = document.querySelectorAll('[data-inquire]');
  inquireButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var product = btn.getAttribute('data-inquire');
      window.location.href = 'contact.html?product=' + encodeURIComponent(product);
    });
  });

  var subjectField = document.querySelector('#subject');
  if (subjectField) {
    var params = new URLSearchParams(window.location.search);
    var product = params.get('product');
    if (product) {
      subjectField.value = 'Product Inquiry: ' + product;
    }
  }

  /* =========================================================================
     V1.2 ADDITIONS — Tagum Hub Appliance products.html revision
     Department navigation active-state, chip-based TV size / AC type /
     Audio category filters, and a global search bar (also doubles as a
     brand filter — clicking a brand card fills the search box).
  ========================================================================= */

  /* -----------------------------------------------------------------------
     11. DEPARTMENT NAVIGATION — active state while scrolling products.html
  ----------------------------------------------------------------------- */
  var deptNavLinks = document.querySelectorAll('.dept-nav a');
  var deptSections = document.querySelectorAll('.department-section[id]');
  if (deptNavLinks.length && deptSections.length && 'IntersectionObserver' in window) {
    var deptObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        deptNavLinks.forEach(function (link) {
          var match = link.getAttribute('href') === '#' + id;
          link.classList.toggle('active', match);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    deptSections.forEach(function (sec) { deptObserver.observe(sec); });
  }

  /* -----------------------------------------------------------------------
     12. GENERIC CHIP FILTER — powers the TV size, AC type and Audio
     category filters. Each chip group lives inside a wrapper with an id
     (e.g. #tv-size-filter), targets a product grid by id, and reads/writes
     a single data-* attribute per card (declared in FILTER_CONFIGS below).
  ----------------------------------------------------------------------- */
  var FILTER_CONFIGS = [
    { barId: 'tv-size-filter', gridId: 'tv-product-grid', emptyId: 'tv-empty-state', chipAttr: 'data-size-filter', cardAttr: 'data-size' },
    { barId: 'ac-type-filter', gridId: 'ac-product-grid', emptyId: 'ac-empty-state', chipAttr: 'data-actype-filter', cardAttr: 'data-actype' },
    { barId: 'audio-type-filter', gridId: 'audio-product-grid', emptyId: 'audio-empty-state', chipAttr: 'data-audiotype-filter', cardAttr: 'data-audiotype' }
  ];

  FILTER_CONFIGS.forEach(function (cfg) {
    var bar = document.getElementById(cfg.barId);
    var grid = document.getElementById(cfg.gridId);
    var empty = document.getElementById(cfg.emptyId);
    if (!bar || !grid) return;

    var chips = bar.querySelectorAll('[' + cfg.chipAttr + ']');
    var cards = grid.querySelectorAll('.product-card');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');

        var value = chip.getAttribute(cfg.chipAttr);
        var visibleCount = 0;

        cards.forEach(function (card) {
          var cardValue = (card.getAttribute(cfg.cardAttr) || '').split(' ');
          var matches = value === 'all' || cardValue.indexOf(value) !== -1;
          card.style.display = matches ? '' : 'none';
          if (matches) visibleCount++;
        });

        if (empty) empty.classList.toggle('is-visible', visibleCount === 0);
      });
    });
  });

  /* -----------------------------------------------------------------------
     13. GLOBAL SEARCH BAR (products.html) — filters product cards,
     brand cards and commercial cards site-wide by their data-searchable
     text. Also acts as the brand filter: clicking any brand card fills
     the search box with that brand name and re-runs the filter.
  ----------------------------------------------------------------------- */
  var searchInput = document.getElementById('product-search');
  if (searchInput) {
    var searchableItems = document.querySelectorAll('[data-searchable]');

    function runSearch() {
      var query = searchInput.value.trim().toLowerCase();
      searchableItems.forEach(function (item) {
        var haystack = (item.getAttribute('data-searchable') || '').toLowerCase();
        var matches = query === '' || haystack.indexOf(query) !== -1;
        item.style.display = matches ? '' : 'none';
      });
    }

    searchInput.addEventListener('input', runSearch);

    /* Brand cards double as a brand filter: click one to search by it */
    document.querySelectorAll('.brand-mini[data-searchable]').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () {
        var brand = card.getAttribute('data-searchable');
        searchInput.value = brand;
        runSearch();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

});

/* ============================================================================
   V2.1 — DARK MODE PATCH
   Applies the saved theme immediately (before DOMContentLoaded) to avoid a
   flash of the wrong theme, then wires up the Moon/Sun toggle button once
   the DOM is ready. Persists the choice in localStorage under 'theme'.
   ============================================================================ */
(function () {
  try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    /* localStorage unavailable (e.g. privacy mode) — default to light theme */
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  var currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');

  themeToggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
});
/* ==========================================================
   TAGUM HUB APPLIANCE V1.0 — LIVE PRODUCT SEARCH
   ========================================================== */

const searchInput = document.querySelector('#productSearch');

if (searchInput) {
  const productCards = document.querySelectorAll('.product-card');

  searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase().trim();

    productCards.forEach(card => {
      const searchable = (card.dataset.searchable || '').toLowerCase();

      if (searchable.includes(keyword)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
/* ===== HERO SLIDER ===== */

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let current = 0;

function showSlide(index){

slides.forEach(s=>s.classList.remove('active'));
dots.forEach(d=>d.classList.remove('active'));

slides[index].classList.add('active');
dots[index].classList.add('active');
const progress = document.querySelector('.hero-progress-bar');

progress.style.animation = 'none';
progress.offsetHeight;
progress.style.animation = 'heroProgress 5s linear infinite';

current = index;

}

nextBtn?.addEventListener('click',()=>{

let next = (current+1)%slides.length;
showSlide(next);

});

prevBtn?.addEventListener('click',()=>{

let prev = (current-1+slides.length)%slides.length;
showSlide(prev);

});

dots.forEach((dot,index)=>{

dot.addEventListener('click',()=>showSlide(index));

});

setInterval(()=>{

let next=(current+1)%slides.length;
showSlide(next);

},5000);
// ===== Animated Statistics =====
const stats = document.querySelectorAll(".stat-value[data-target]");

const runStats = () => {
  stats.forEach(stat => {
    const target = Number(stat.dataset.target);
    const isPercent = stat.textContent.includes("%");
    const isPlus = target === 30;

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        clearInterval(timer);

        if (isPercent) stat.textContent = `Up to ${target}%`;
        else if (isPlus) stat.textContent = `${target}+`;
        else stat.textContent = target;
      } else {
        if (isPercent) stat.textContent = `${current}%`;
        else stat.textContent = current;
      }
    }, 25);
  });
};

const statsBand = document.querySelector(".stats-band");

const statObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    runStats();
    statObserver.disconnect();
  }
}, { threshold: 0.4 });

if (statsBand) {
    statObserver.observe(statsBand);

    // Trigger agad kung nasa screen na
    setTimeout(() => {
        runStats();
    }, 500);
}
// ================= QUICK VIEW =================

const quickView = document.getElementById("quickView");

const qImg = document.getElementById("modalImage");
const qBrand = document.getElementById("modalBrand");
const qTitle = document.getElementById("modalTitle");
const qLead = document.getElementById("modalLead");
const qStatus = document.getElementById("modalStatus");
const qInquire = document.getElementById("modalInquire");

// lahat ng product card
document.querySelectorAll(".product-card").forEach(card=>{

card.addEventListener("click",()=>{

qImg.src = card.dataset.image;
qBrand.textContent = card.dataset.brand;
qTitle.textContent = card.dataset.model;
qLead.textContent = "Lead Time: " + card.dataset.lead;

qStatus.textContent = card.dataset.status;

if(card.dataset.status.toLowerCase().includes("order")){
qStatus.classList.add("order");
}else{
qStatus.classList.remove("order");
}

qInquire.href =
`contact.html?product=${encodeURIComponent(card.dataset.model)}`;

quickView.classList.add("active");

});

});

// close
document.querySelector(".close-modal").onclick=()=>{
quickView.classList.remove("active");
};

document.querySelector(".close-btn").onclick=()=>{
quickView.classList.remove("active");
};

quickView.addEventListener("click",(e)=>{
if(e.target===quickView){
quickView.classList.remove("active");
}
});
// ================= AUTO FILL CONTACT FORM =================

const urlParams = new URLSearchParams(window.location.search);
const selectedProduct = urlParams.get("product");

if (selectedProduct) {

    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    if (subject) {
        subject.value = "Product Inquiry";
    }

    if (message) {
        message.value =
`Hello Tagum Hub Appliance,

I'm interested in this model:

${selectedProduct}

Please send me the latest price, availability, installment options, and delivery schedule.

Thank you!`;
    }

}
// ================= BRAND FILTER =================

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // active button
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // filter products
        productCards.forEach(card => {

            const searchable = (
                card.dataset.searchable || ""
            ).toLowerCase();

            if (
                filter === "all" ||
                searchable.includes(filter.toLowerCase())
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });
});