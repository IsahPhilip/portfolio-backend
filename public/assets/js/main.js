document.addEventListener('DOMContentLoaded', function () {
  // Select navigation links (mobile + desktop)
  const navLinks = document.querySelectorAll('.mobile-bottom-nav a, #nav-links a');
  const sections = document.querySelectorAll('.sections > section');
  const sidebar = document.querySelector('.sidebar');
  const mobileNav = document.querySelector('#nav-links');
  const menuToggle = document.querySelector('.menu-toggle');

  // Toggle mobile menu
  window.toggleMenu = function () {
    if (window.innerWidth <= 900) {
      sidebar.classList.toggle('active');
      mobileNav.classList.toggle('active');
    }
  };

  // ================= ACTIVE LINK ON SCROLL =================
  function updateActiveLink() {
    let currentSectionId = '';
    const scrollY = window.scrollY + 150; // offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();


  // ================= BLOG FEED =================
  const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@isahphilip50';
  const blogGrid = document.getElementById('blog-grid');

  if (blogGrid) {
    fetch(feedUrl)
      .then(res => res.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          blogGrid.innerHTML = '<p>No blog posts available.</p>';
          return;
        }
        blogGrid.innerHTML = '';
        data.items.slice(0, 5).forEach(item => {
          const imageUrl = item.thumbnail || 'assets/img/placeholder.jpg';
          const card = document.createElement('a');
          card.className = 'blog-card';
          card.href = item.link;
          card.target = '_blank';
          card.innerHTML = `
            <div class="blog-image"><img src="${imageUrl}" alt="${item.title}" loading="lazy"></div>
            <h4>${item.title}</h4>
            <p>Published: ${new Date(item.pubDate).toLocaleDateString()}</p>
          `;
          blogGrid.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Error fetching Medium feed:', err);
        blogGrid.innerHTML = '<p>Failed to load blog posts.</p>';
      });
  }

  // ================= CONTACT FORM =================
  // const form = document.getElementById('contact-form');
  // if (form) {
  //   form.addEventListener('submit', async function (e) {
  //     e.preventDefault();
  //     const formData = new FormData(form);
  //     try {
  //       const response = await fetch('https://formspree.io/f/mblapvgo', {
  //         method: 'POST',
  //         body: formData,
  //         headers: { 'Accept': 'application/json' }
  //       });
  //       if (response.ok) {
  //         showAlert('Message sent successfully!', 'success');
  //         form.reset();
  //       } else {
  //         showAlert('Failed to send message.', 'error');
  //       }
  //     } catch (err) {
  //       console.error('Error sending message:', err);
  //       showAlert('Error sending message. Please try again.', 'error');
  //     }
  //   });
  // }

  // ================= CONTACT FORM =================
  const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const full_name = document.getElementById('full_name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('/contactForm', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (response.ok) {
                    showAlert(result.message, true);
                    form.reset();
                } else {
                    console.error('Server error:', result);
                    showAlert(result.message || 'Failed to send message.', false);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                showAlert('Error sending message. Please check your connection.', false);
            }
        });
    }

  // ================= DARK/LIGHT MODE =================
  const modeBtns = document.querySelectorAll('.dark-light-mode');
  const body = document.body;

  function updateModeIcon(btn) {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (body.classList.contains('dark-mode')) {
      icon.classList.add('hgi-sun-01');
      icon.classList.remove('hgi-moon-02');
    } else {
      icon.classList.add('hgi-moon-02');
      icon.classList.remove('hgi-sun-01');
    }
  }

  function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    modeBtns.forEach(updateModeIcon);
  }

  // Load saved mode
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
  }

  // Initialize icons & add event listeners
  modeBtns.forEach(btn => {
    updateModeIcon(btn);
    btn.addEventListener('click', toggleDarkMode);
  });

  // ================= ANIMATIONS =================
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animate__animated')) {
        entry.target.classList.add('animate__animated', 'animate__fadeInUp', 'animate__slow');
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => animationObserver.observe(el));

  // ================= TAWK CHAT =================
  const letsTalkBtn = document.querySelector('.nav-cta');
  if (letsTalkBtn) {
    letsTalkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.Tawk_API && window.Tawk_API.maximize) {
        window.Tawk_API.maximize();
      } else {
        showAlert('Chat service unavailable.', 'error');
      }
    });
  }

  // ================= ALERT FUNCTION =================
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');
    if (alertContainer && alertMessage) {
      alertContainer.classList.add('hide');
      alertMessage.textContent = message;
      alertContainer.style.display = 'flex';
      alertContainer.className = `alert-container ${type}`;

      if (type === 'success') {
        alertContainer.style.background = 'var(--light-green)';
        alertContainer.style.color = 'var(--green)';
        alertContainer.style.borderColor = 'var(--green)';
      } else if (type === 'error') {
        alertContainer.style.background = 'var(--light-red)';
        alertContainer.style.color = 'var(--red)';
        alertContainer.style.borderColor = 'var(--red)';
      } else {
        // default / info
        alertContainer.style.background = 'var(--off-white)';
        alertContainer.style.color = 'var(--dark-gray)';
        alertContainer.style.borderColor = 'var(--primary-purple)';
      }

      setTimeout(() => {
        alertContainer.classList.remove('hide');
        alertContainer.style.display = 'none';
      }, 7000);
    }
  }

  const closeAlertBtn = document.getElementById('close-alert');
  if (closeAlertBtn) {
    closeAlertBtn.addEventListener('click', () => {
      const alertContainer = document.getElementById('alert-container');
      if (alertContainer) {
        alertContainer.classList.remove('hide');
        alertContainer.style.display = 'none';
      }
    });
  }
});