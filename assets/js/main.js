document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.menu-btn');
  if (btn) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Handle contact form mailto submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Helper to read a field by multiple possible IDs (compatibility with different snippets)
    const readVal = (ids) => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && typeof el.value === 'string') return el.value.trim();
      }
      return '';
    };

    // Public function for EmailJS usage if needed elsewhere
    window.sendMail = async function sendMail() {
      const name = readVal(['cf-name', 'name']);
      const company = readVal(['cf-company', 'company']);
      const email = readVal(['cf-email', 'email']);
      const phone = readVal(['cf-phone', 'phone']);
      const address = readVal(['cf-address', 'address']);
      const message = readVal(['cf-message', 'message']);

      const payload = {
        from_name: name,
        company,
        reply_to: email,
        email_id: email,
        phone,
        address,
        message
      };

      const canUseEmailJS = !!(window.emailjs && window.EMAILJS_PUBLIC_KEY && window.EMAILJS_SERVICE_ID && window.EMAILJS_TEMPLATE_ID);
      if (!canUseEmailJS) throw new Error('EmailJS not configured');
      return emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, payload);
    };

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      try {
        await window.sendMail();
        alert('Your message has been sent successfully. Thank you!');
        contactForm.reset();
        return;
      } catch (err) {
        // Fall back to mailto if EmailJS is not configured or failed
      }

      const name = readVal(['cf-name', 'name']);
      const company = readVal(['cf-company', 'company']);
      const email = readVal(['cf-email', 'email']);
      const phone = readVal(['cf-phone', 'phone']);
      const address = readVal(['cf-address', 'address']);
      const message = readVal(['cf-message', 'message']);
      const subject = encodeURIComponent(`Contact Request - ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\n\nMessage:\n${message}`);
      const mailto = `mailto:fakojust@gmail.com?subject=${subject}&body=${body}`;
      const a = document.createElement('a');
      a.href = mailto;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 0);
    });
  }
});


