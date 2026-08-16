// --- Souls Chapel Website Javascript logic (Simplified) ---

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Theme Switcher (Dark/Light Mode)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Read saved theme or fallback to user system setting
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });


  /* ==========================================================================
     2. Mobile Header Toggle Menu
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close nav on click of any nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // Change nav style on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  /* ==========================================================================
     3. Scroll Reveal Observer & Active Navigation Menu Indicator
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Highlighting navbar links based on window position
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     4. About Section - Interactive Values Accordion
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.value-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.value-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      accordionItems.forEach(el => el.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     5. Interactive Contact Form Submission Handler
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const contactResponse = document.getElementById('contactResponse');

  window.handleContact = (event) => {
    event.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending Message...";
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let jsonRes = await response.json();
      if (response.status == 200) {
        contactResponse.classList.remove('error');
        contactResponse.classList.add('success');
        contactResponse.querySelector('span').innerText = "Your message has been sent successfully. We will be in touch soon!";
        contactResponse.style.display = 'flex';
        contactForm.reset();
      } else {
        console.error(response);
        contactResponse.classList.remove('success');
        contactResponse.classList.add('error');
        contactResponse.querySelector('span').innerText = jsonRes.message || "Something went wrong. Please try again.";
        contactResponse.style.display = 'flex';
      }
    })
    .catch((error) => {
      console.error(error);
      contactResponse.classList.remove('success');
      contactResponse.classList.add('error');
      contactResponse.querySelector('span').innerText = "Network error. Please check your internet connection.";
      contactResponse.style.display = 'flex';
    })
    .then(() => {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
      // Hide response after 8 seconds
      setTimeout(() => {
        contactResponse.style.display = 'none';
      }, 8000);
    });
  };
});
