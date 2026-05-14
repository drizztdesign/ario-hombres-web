/* ============================================
   ARIO HOMBRES · INTERACTIVIDAD
   ============================================ */

// === NAV: scroll y menú móvil ===
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// === GALERÍA: filtros ===
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            const matches = filter === 'all' || item.dataset.cat === filter;
            item.classList.toggle('hidden', !matches);
        });
    });
});

// === SERVICIOS: clic en "Reservar" salta al formulario y rellena el servicio ===
document.querySelectorAll('.reserve-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.service-card');
        const serviceName = card.dataset.service;
        const select = document.getElementById('service');

        if (select && serviceName) {
            for (const opt of select.options) {
                if (opt.value === serviceName) {
                    select.value = serviceName;
                    break;
                }
            }
        }

        document.getElementById('reserva').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('name').focus(), 700);
    });
});

// === FECHA: mínimo hoy ===
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// === RESERVA: submit ===
const form = document.getElementById('bookingForm');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get('name');
    const service = data.get('service');
    const date = data.get('date');
    const time = data.get('time');
    const barber = data.get('barber') || 'el primer barbero disponible';

    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    modalText.innerHTML = `
        Hola <strong>${name}</strong>, tu cita para <strong>${service}</strong>
        el <strong>${formattedDate}</strong> a las <strong>${time}h</strong>
        con ${barber} ha sido registrada.<br><br>
        Te hemos enviado un email de confirmación.
    `;

    modal.classList.add('active');
    form.reset();
});

const closeModal = () => modal.classList.remove('active');
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// === REVEAL ON SCROLL ===
const revealEls = document.querySelectorAll(
    '.section-head, .about-text, .about-imgs, .service-card, .gallery-item, .team-card, .testimonial-card, .booking-info, .booking-form, .contact-block'
);

revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => io.observe(el));

// === COUNTER en hero ===
const counterEls = document.querySelectorAll('.hero-stats strong');
const animateCounter = (el) => {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const hasStar = text.includes('★');
    const num = parseFloat(text);
    if (isNaN(num)) return;

    let current = 0;
    const duration = 1500;
    const step = num / (duration / 16);

    const tick = () => {
        current += step;
        if (current >= num) {
            el.textContent = text;
            return;
        }
        let display = Math.floor(current);
        if (hasStar) display = current.toFixed(1) + '★';
        else if (hasPlus) display = display + 'k+';
        el.textContent = display;
        requestAnimationFrame(tick);
    };
    tick();
};

window.addEventListener('load', () => {
    setTimeout(() => counterEls.forEach(animateCounter), 600);
});
