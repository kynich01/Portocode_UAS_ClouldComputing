// ===== PROGRESS BAR =====
const scrubFill = document.getElementById('scrubFill');
function updateScrubBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrubFill.style.width = percent + '%';
}
window.addEventListener('scroll', updateScrubBar);
updateScrubBar();

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    const scrollY = window.scrollY + 200;

    // Cek dulu: udah mentok di bawah belum?
    const sudahMentok = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (sudahMentok) {
        // Kalau udah mentok, matiin semua link, terus nyalain cuma yang terakhir
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[navLinks.length - 1].classList.add('active');
        return; // stop di sini, gak usah lanjut ke loop di bawah
    }

    // Kode asli kamu yang lama, tetap jalan normal kalau BELUM mentok
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}
window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const statusText = document.querySelector('.form-status');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showMessage('Mohon isi semua field!', '#aaaaaa');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Mohon masukkan email yang valid!', '#ef4444');
        return;
    }

    showMessage('Mengirim pesan...', '#cccccc');

    // Kirim data form langsung ke Formspree lewat fetch, tanpa reload halaman
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
        .then(response => {
            if (response.ok) {
                showMessage('Pesan terkirim, terima kasih!', '#4ade80');
                form.reset();
            } else {
                showMessage('Gagal mengirim, coba lagi ya.', '#ef4444');
            }
        })
        .catch(() => {
            showMessage('Gagal mengirim, cek koneksi kamu.', '#ef4444');
        });
});

function showMessage(text, color) {
    statusText.textContent = text;
    statusText.style.color = color;
    setTimeout(() => { statusText.textContent = ''; }, 4000);
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});