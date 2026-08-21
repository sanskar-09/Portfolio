document.addEventListener('DOMContentLoaded', function () {

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.querySelector('.main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle):not(.portfolio-nav-link)');

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }

    // Active link highlight
    const offset = 140;
    sections.forEach(function (section) {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === SMOOTH SCROLL FOR NAV LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    if (link.classList.contains('portfolio-nav-link') ||
        link.hasAttribute('data-bs-toggle') ||
        link.classList.contains('carousel-control-prev') ||
        link.classList.contains('carousel-control-next')) {
      return;
    }
    link.addEventListener('click', function (e) {
      var target = this.getAttribute('href');
      if (target !== '#' && document.querySelector(target)) {
        e.preventDefault();
        var el = document.querySelector(target);
        var top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  // === PORTFOLIO NAV LINKS (dropdown + sidebar links) ===
  document.querySelectorAll('.portfolio-nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var tabTarget = this.getAttribute('data-target');
      var section = document.querySelector(targetId);
      if (section) {
        var top = section.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
        setTimeout(function () {
          if (tabTarget) {
            var tabEl = document.querySelector('#' + tabTarget + '-tab');
            if (tabEl) {
              var tab = new bootstrap.Tab(tabEl);
              tab.show();
            }
          }
        }, 500);
      }
      closeMobileMenu();
    });
  });

  function closeMobileMenu() {
    var collapse = document.querySelector('.navbar-collapse.show');
    if (collapse) {
      var toggler = document.querySelector('.navbar-toggler');
      if (toggler) toggler.click();
    }
  }

  // === TAB SWITCH CARD ANIMATION ===
  document.querySelectorAll('button[data-bs-toggle="pill"]').forEach(function (tabBtn) {
    tabBtn.addEventListener('shown.bs.tab', function (e) {
      var targetId = e.target.getAttribute('data-bs-target');
      var target = document.querySelector(targetId);
      if (target) {
        var cards = target.querySelectorAll('.academic-card');
        cards.forEach(function (card, i) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(function () {
            card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 70);
        });
      }
    });
  });

  // === COURSE FILTER ===
  document.querySelectorAll('.btn-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      document.querySelectorAll('.btn-filter').forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      document.querySelectorAll('.course-item').forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(function () {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'opacity 0.2s ease';
          item.style.opacity = '0';
          setTimeout(function () {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // === PROJECT DETAILS MODAL ===
  document.querySelectorAll('.project-details-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var projectData;
      try {
        var raw = this.getAttribute('data-project');
        projectData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err) {
        projectData = this.dataset.project;
        if (typeof projectData === 'object') { /* already parsed by browser */ }
        else return;
      }

      if (projectData) {
        setText('#projectModalLabel', projectData.title || 'Project Details');
        setText('#modal-problem', projectData.problem || 'N/A');
        setText('#modal-solution', projectData.solution || 'N/A');
        setText('#modal-features', projectData.features || 'N/A');
        setText('#modal-academic', projectData.academic || 'N/A');
        setText('#modal-outcome', projectData.outcome || 'N/A');

        var stackEl = document.querySelector('#modal-stack');
        if (stackEl && projectData.stack) {
          stackEl.innerHTML = projectData.stack.split(',').map(function (s) {
            return '<span class="tech-tag">' + s.trim() + '</span>';
          }).join('');
        } else if (stackEl) {
          stackEl.textContent = 'N/A';
        }

        var modal = new bootstrap.Modal(document.getElementById('projectModal'));
        modal.show();
      }
    });
  });

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  // === SCROLL REVEAL ANIMATIONS ===
  var animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  function revealOnScroll() {
    var windowHeight = window.innerHeight;
    animatedEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  // Trigger once on load
  setTimeout(revealOnScroll, 100);

  // === STAT COUNTER ANIMATION ===
  var statNumbers = document.querySelectorAll('.stat-number[data-count]');
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    var statsSection = document.querySelector('.stats-bar');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      countersStarted = true;
      statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + '+';
          }
        }
        requestAnimationFrame(step);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  setTimeout(animateCounters, 200);

  // === INTERACTIVE SPOTLIGHT EFFECT ===
  document.querySelectorAll('.academic-card, .stat-box, .skill-category-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.background = 'radial-gradient(500px circle at ' + x + 'px ' + y + 'px, rgba(255, 90, 78, 0.1), #1e293b)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

});
