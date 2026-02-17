
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDv-w_QESVmW0xN5wr_ZSOCfpVFYQmnnM0",
    authDomain: "olamide-and-abiola-website.firebaseapp.com",
    projectId: "olamide-and-abiola-website",
    storageBucket: "olamide-and-abiola-website.firebasestorage.app",
    messagingSenderId: "1007011191409",
    appId: "1:1007011191409:web:82cf93e6381cd1c27199d0"
  };

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("🔥 Firebase connected:", db);
} catch (error) {
  console.error("Firebase initialization error:", error);
}


let currentLightboxIndex = 0;
const galleryImages = [];

document.addEventListener('DOMContentLoaded', () => {
  try { initNavbar(); } catch(e) { console.error(e); }
  try { initCountdown(); } catch(e) { console.error(e); }
  try { initGallery(); } catch(e) { console.error(e); }
  try { initLightbox(); } catch(e) { console.error(e); }
  try { initRevealAnimation(); } catch(e) { console.error(e); }
  try { initRSVPForm(); } catch(e) { console.error(e); }
});


function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

function initCountdown() {
  const weddingDate = new Date('May 9, 2026 16:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      return;
    }

    document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('hours').textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
    document.getElementById('minutes').textContent = Math.floor((diff / (1000 * 60)) % 60);
    document.getElementById('seconds').textContent = Math.floor((diff / 1000) % 60);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initGallery() {
  const items = document.querySelectorAll('.gallery-item img');
  
  
  // galleryImages.length = 0;

  items.forEach(img => {
    galleryImages.push({
      url: img.src,
      caption: img.alt
    });
  });

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  });

  document.querySelectorAll('.gallery-item').forEach(item => observer.observe(item));
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  updateLightboxContent();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function updateLightboxContent() {
  const image = galleryImages[currentLightboxIndex];
  document.getElementById('lightbox-img').src = image.url;
  document.getElementById('lightbox-img').alt = image.caption;
  document.getElementById('lightbox-caption').textContent = image.caption;
  document.getElementById('lightbox-counter').textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  closeBtn.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', () => {
    currentLightboxIndex = currentLightboxIndex === 0 ? galleryImages.length - 1 : currentLightboxIndex - 1;
    updateLightboxContent();
  });

  nextBtn.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxContent();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

function initRevealAnimation() {
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
}

function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const messageEl = document.getElementById('rsvp-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('guest-name').value.trim(),
      email: document.getElementById('guest-email').value.trim(),
      phone: document.getElementById('guest-phone').value.trim(),
      attending: document.getElementById('guest-attending').value === 'yes',
      guests: parseInt(document.getElementById('guest-count').value, 10),
      message: document.getElementById('guest-message').value.trim(),
      createdAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, 'rsvp'), formData);

      messageEl.style.color = '#4b2e1e';
      messageEl.textContent =
        'Thank you for your RSVP! We look forward to celebrating with you.';
      form.reset();

      setTimeout(() => (messageEl.textContent = ''), 5000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      messageEl.style.color = '#d32f2f';
      messageEl.textContent =
        'Error submitting RSVP. Please try again later.';

      setTimeout(() => (messageEl.textContent = ''), 5000);
    }
  });
}

async function getRSVPNamesAndEmails() {
  if (!db) return console.error('Firestore not initialized');

  try {
    const rsvpCol = collection(db, 'rsvp');
    const snapshot = await getDocs(rsvpCol);

    const collated = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data.name,
        email: data.email,
        phoneno: data.phone
      };
    });

    console.log('RSVP Names & Emails:', collated);
    return collated;
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
  }
}

getRSVPNamesAndEmails();

window.copyToClipboard = function() {
  const accountNum = document.getElementById('account-num').textContent;
  navigator.clipboard.writeText(accountNum).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';

    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
};



