/* ==========================================================================
   Abhishek Kumar Mishra - Portfolio JavaScript Logic
   Includes Fixed Top Header, 3D WebGL Background, 3D Card Tilt & Skill Search
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  init3DCanvas();
  init3DTilt();
  initNavbar();
  initMobileDrawer();
  initTerminal();
  initSkillsFilter();
  initSkillSearch();
  initProjectsFilter();
  initSkillBars();
  initModals();
  initContactForm();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Three.js 3D Light Particle Background
   -------------------------------------------------------------------------- */
function init3DCanvas() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Particle Geometry
  const particleCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorBlue = new THREE.Color('#2563eb');
  const colorIndigo = new THREE.Color('#4f46e5');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

    const mixedColor = colorBlue.clone().lerp(colorIndigo, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Light Theme Particle Material
  const material = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    transparent: true,
    opacity: 0.35
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    camera.position.x = targetX;
    camera.position.y = -targetY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* --------------------------------------------------------------------------
   2. Custom 3D Tilt Engine for Cards & Avatars
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.data-tilt');

  tiltElements.forEach(el => {
    const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 12;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    });
  });
}

/* --------------------------------------------------------------------------
   3. Navbar & Scroll Spy
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer Controller
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = drawer.querySelectorAll('a');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Developer Terminal
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   5. Interactive Developer Terminal
   -------------------------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const form = document.getElementById('terminal-form');
  const container = document.getElementById('terminal-container');

  if (!output) return;

  const commands = {
    help: `Available commands:
  • <strong>linkedin</strong>     - Open / view Abhishek's official LinkedIn profile
  • <strong>careerthon</strong>   - View details about Careerthon SaaS app (careerthon.app)
  • <strong>skills</strong>       - Display top technical stack & frameworks
  • <strong>projects</strong>     - List featured production & ML projects
  • <strong>experience</strong>   - View internship & professional background
  • <strong>contact</strong>      - Get direct email, phone & social links
  • <strong>clear</strong>        - Clear terminal screen
  • <strong>sudo hire</strong>    - Fast-track interview / hiring request`,

    linkedin: `🔗 <strong>LINKEDIN PROFILE</strong>
URL: <a href="https://www.linkedin.com/in/iabhishek18" target="_blank" style="color: #2563eb; text-decoration: underline;">https://www.linkedin.com/in/iabhishek18</a>
Headline: Software Engineer & Data Scientist | Java, Spring Boot, Python, ML | Creator of Careerthon
Status: Open to Software Engineering & Data Science Opportunities.`,

    careerthon: `🚀 <strong>CAREERTHON - LinkedIn Profile Review SaaS Platform</strong>
Website: <a href="https://careerthon.app" target="_blank" style="color: #2563eb; text-decoration: underline;">https://careerthon.app</a>
Stack: Java, Spring Boot, SQL, Docker, Railway
Features:
  - Analyzes LinkedIn profiles across 15+ parameters.
  - Handles 1,000+ daily requests with optimized SQL queries.
  - Scaled backend to support 50,000+ users.
  - Containerized with Docker & deployed on Railway.`,

    skills: `⚡ <strong>TECHNICAL SKILLS OVERVIEW</strong>
Languages:    Java, Python, SQL, JavaScript
Frameworks:   Spring Boot, JavaFX, Node.js, Streamlit, TensorFlow
ML/AI:        Naive Bayes, LSTM, Neural Networks, NLP, Clustering
Databases:    MySQL, SQLite, NoSQL, MS SQL Server
Tools & Cloud: Docker, REST APIs, WebSocket, Git, Power BI, Railway, Linux`,

    projects: `📁 <strong>FEATURED PROJECTS</strong>
1. <strong>Careerthon SaaS Platform</strong> (https://careerthon.app) - Java & Spring Boot
2. <strong>YouTube Spam Detection</strong> (92% Accuracy) - Python, TensorFlow, LSTM
3. <strong>Heart Disease Prediction System</strong> (85% Accuracy) - Python & Streamlit
4. <strong>Car Rental Web Application</strong> - JavaFX, MySQL & WebSockets`,

    experience: `💼 <strong>PROFESSIONAL EXPERIENCE</strong>
1. <strong>Celebal Technologies</strong> (Jun 2025 - Aug 2025)
   Role: Data Science Intern
   Focus: Python, SQL, Power BI, Customer Segmentation, Data Pipelines.

2. <strong>EY-GDS</strong> (Feb 2024 - Apr 2024)
   Role: Full Stack Developer Intern
   Focus: Java, JavaFX, MySQL, WebSockets, REST APIs, Git.`,

    contact: `📫 <strong>CONTACT INFORMATION</strong>
LinkedIn: https://www.linkedin.com/in/iabhishek18
Location: Bengaluru / Kolkata, India
Phone:    +91-9304146138
Email:    abhishekcsbs789@gmail.com
GitHub:   https://github.com/abhiM200
App:      https://careerthon.app`,

    'sudo hire': `🎉 <strong>EXCELLENT CHOICE!</strong>
Abhishek is open to full-time Software Engineer & Data Scientist roles.
Connect on LinkedIn: <strong>https://www.linkedin.com/in/iabhishek18</strong>
Send an email to <strong>abhishekcsbs789@gmail.com</strong> or call <strong>+91-9304146138</strong> to initiate contact!`
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function processCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append prompt & user command
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">abhishek@portfolio:~$</span> ${escapeHtml(cmd)}`;
    output.appendChild(line);

    // Clear command handling
    if (cmd === 'clear') {
      output.innerHTML = '';
      if (input) input.value = '';
      return;
    }

    const response = document.createElement('div');
    response.className = 'terminal-response';

    if (commands[cmd]) {
      response.innerHTML = commands[cmd];
    } else {
      response.innerHTML = `Command not found: '${escapeHtml(cmd)}'. Type <span class="cmd-chip" onclick="runTerminalCmd('help')">help</span> for a list of valid commands.`;
    }

    output.appendChild(response);
    output.scrollTop = output.scrollHeight;

    if (input) {
      input.value = '';
    }
  }

  // Expose global function for chip click events
  window.runTerminalCmd = function(cmdStr) {
    processCommand(cmdStr);
    if (input) input.focus();
  };

  // Form submit handler (catches both Enter keypress and Run button click)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input && input.value.trim()) {
        processCommand(input.value);
      }
    });
  }

  // Focus input when clicking anywhere inside terminal wrapper
  if (container) {
    container.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && !e.target.classList.contains('cmd-chip') && input) {
        input.focus();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Skills Category Filtering & Live Search
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.skills-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initSkillSearch() {
  const searchInput = document.getElementById('skill-search-input');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    skillCards.forEach(card => {
      const keywords = card.getAttribute('data-skill-keywords') || '';
      const text = card.textContent.toLowerCase();

      if (query === '' || keywords.includes(query) || text.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Projects Category Filtering
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.projects-filter .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Skill Bar Animation on Scroll
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let animated = false;

  function checkScroll() {
    const section = document.getElementById('skills');
    if (!section) return;
    const sectionPos = section.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !animated) {
      skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* --------------------------------------------------------------------------
   9. Project Detail Modal Manager & Schedule Modal
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.querySelector('.modal-close');

  const projectDetails = {
    careerthon: {
      title: "Careerthon - LinkedIn Profile Review SaaS Platform",
      content: `
        <p style="color: #334155; margin-bottom: 1rem;">
          <strong>Careerthon (careerthon.app)</strong> is a production-grade SaaS application designed to help job seekers optimize their LinkedIn profiles using data analytics across 15+ key parameters.
        </p>
        <ul style="color: #64748b; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          <li>Engineered scalable backend architecture using Java and Spring Boot capable of handling 50K+ users.</li>
          <li>Designed high-performance REST APIs and optimized SQL query execution handling 1,000+ daily requests.</li>
          <li>Implemented monetization model and containerized the application stack using Docker.</li>
          <li>Set up automated CI/CD deployment pipelines on Railway cloud platform for zero-downtime releases.</li>
        </ul>
        <div style="display: flex; gap: 0.8rem; margin-top: 1rem;">
          <a href="https://careerthon.app" target="_blank" class="btn btn-primary btn-sm">Launch Careerthon ↗</a>
          <a href="https://www.linkedin.com/in/iabhishek18" target="_blank" class="btn btn-secondary btn-sm">LinkedIn Profile ↗</a>
        </div>
      `
    },
    youtube: {
      title: "ML-Based YouTube Spam Comment Detection",
      content: `
        <p style="color: #334155; margin-bottom: 1rem;">
          An automated machine learning solution to detect and filter spam comments on YouTube with <strong>92% accuracy</strong>.
        </p>
        <ul style="color: #64748b; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          <li>Processed over 100,000+ comment records using Selenium web scrapers and custom NLP pipelines.</li>
          <li>Trained Naive Bayes classifiers alongside deep learning LSTM models for sequential text classification.</li>
          <li>Implemented TF-IDF feature extraction, stop-word removal, and tokenization pipelines in TensorFlow.</li>
        </ul>
        <a href="https://github.com/abhiM200" target="_blank" class="btn btn-primary btn-sm">Source Code on GitHub ↗</a>
      `
    },
    heart: {
      title: "Heart Disease Prediction System",
      content: `
        <p style="color: #334155; margin-bottom: 1rem;">
          A clinical decision-support machine learning app achieving <strong>85% prediction accuracy</strong> for early cardiovascular risk evaluation.
        </p>
        <ul style="color: #64748b; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          <li>Trained multiple classification models including Logistic Regression, Decision Trees, and Random Forests.</li>
          <li>Applied advanced feature engineering, data imputation, and hyperparameter tuning with Scikit-learn.</li>
          <li>Deployed an interactive web interface using Streamlit allowing real-time parameter entry.</li>
        </ul>
        <a href="https://github.com/abhiM200" target="_blank" class="btn btn-primary btn-sm">View Demo Repository ↗</a>
      `
    },
    carrental: {
      title: "Car Rental Web Application",
      content: `
        <p style="color: #334155; margin-bottom: 1rem;">
          Full-stack application engineered during internship at EY-GDS featuring desktop GUI and web real-time communications.
        </p>
        <ul style="color: #64748b; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          <li>Built JavaFX front-end desktop interface integrated with MySQL database backend.</li>
          <li>Implemented real-time bidirectional communication system using WebSockets for live booking updates.</li>
          <li>Optimized NoSQL and MySQL query execution reducing average retrieval latency.</li>
        </ul>
        <a href="https://github.com/abhiM200" target="_blank" class="btn btn-primary btn-sm">View GitHub Code ↗</a>
      `
    }
  };

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      if (projectDetails[projId]) {
        modalTitle.textContent = projectDetails[projId].title;
        modalBody.innerHTML = projectDetails[projId].content;
        modalOverlay.classList.add('open');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }
}

function showHireModal() {
  const hireModal = document.getElementById('hire-modal');
  if (hireModal) hireModal.classList.add('open');
}

function closeHireModal() {
  const hireModal = document.getElementById('hire-modal');
  if (hireModal) hireModal.classList.remove('open');
}

/* --------------------------------------------------------------------------
   10. Contact Form Handling & Copy Utilities
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    showToast('🚀 Thank you! Your message has been sent successfully.');
    form.reset();
  });
}

function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`📋 Copied ${label} to clipboard!`);
  }).catch(() => {
    showToast(`Failed to copy.`);
  });
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* --------------------------------------------------------------------------
   11. Back to Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
