/* ═══════════════════════════════════════════════
   Zared Maldonado — Portfolio Scripts
   ═══════════════════════════════════════════════ */

// ── Ir al inicio al recargar (evita que el browser restaure el scroll) ──
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// Override por si hay un hash en el URL que el browser intenta navegar
window.addEventListener('load', () => {
    if (location.hash) history.replaceState(null, '', ' ');
    window.scrollTo({ top: 0, behavior: 'instant' });
});

// ── Fade-in on scroll ──
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Language toggle ──
const btn = document.getElementById('langToggle');
let lang = 'en';

function applyLang(l) {
    document.documentElement.setAttribute('data-lang', l);
    document.querySelectorAll('[data-en]').forEach(el => {
        const val = el.getAttribute('data-' + l);
        if (val !== null) el.innerHTML = val;
    });
    // swap placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const val = el.getAttribute('data-' + l + '-placeholder');
        if (val !== null) el.placeholder = val;
    });
    btn.textContent = l === 'es' ? '🌐 ES' : '🌐 EN';
}

// ── Formspree AJAX submit ──
const contactForm = document.querySelector('.contact-form');
const formSuccess = document.querySelector('.form-success');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '.6';

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                contactForm.reset();
                formSuccess.style.display = 'block';
                const successMsg = formSuccess.getAttribute('data-' + lang);
                if (successMsg) formSuccess.textContent = successMsg;
            } else {
                const data = await res.json();
                alert('Error: ' + (data.error || JSON.stringify(data)));
            }
        } catch {
            alert('Network error. Please try again.');
        }

        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    });
}

btn.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    applyLang(lang);
});
