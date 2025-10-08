(function () {
  const utils = window.appUtils || {
    getCookie: () => null,
    showToast: () => undefined,
  };

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutButton = document.getElementById('logoutButton');

  function toObjectFromForm(form) {
    const payload = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      if (key === 'csrfmiddlewaretoken') return;
      payload[key] = value;
    });
    return payload;
  }

  function formatErrors(errors) {
    const messages = [];
    if (!errors) {
      return messages;
    }
    if (typeof errors === 'string') {
      messages.push(errors);
      return messages;
    }
    if (Array.isArray(errors)) {
      errors.forEach((msg) => messages.push(String(msg)));
      return messages;
    }
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      (Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors]).forEach((msg) => {
        messages.push(`${label}: ${msg}`);
      });
    });
    return messages;
  }

  function renderFormErrors(container, errors) {
    if (!container) return;
    const messages = formatErrors(errors);
    if (messages.length === 0) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }
    container.innerHTML = messages.map((msg) => `<div>${msg}</div>`).join('');
    container.classList.remove('hidden');
  }

  function setFormLoading(form, isLoading) {
    const submitButton = form.querySelector('[type="submit"]');
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.classList.toggle('opacity-60', isLoading);
    const originalText = submitButton.dataset.originalText || submitButton.textContent;
    if (!submitButton.dataset.originalText) {
      submitButton.dataset.originalText = originalText;
    }
    submitButton.textContent = isLoading ? 'Please wait...' : originalText;
  }

  async function handleAuthSubmit(event, { successFallbackMessage }) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorContainerId = form.id === 'loginForm' ? 'loginError' : 'registerError';
    const errorContainer = document.getElementById(errorContainerId);
    if (errorContainer) {
      errorContainer.classList.add('hidden');
      errorContainer.innerHTML = '';
    }

    const csrfToken = utils.getCookie('csrftoken');
    if (!csrfToken) {
      utils.showToast('CSRF token tidak ditemukan. Muat ulang halaman.', 'error');
      return;
    }

    const endpoint = form.getAttribute('action') || window.location.pathname;
    const payload = toObjectFromForm(form);

    setFormLoading(form, true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          Accept: 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        renderFormErrors(errorContainer, result.errors || result.message || 'Gagal memproses permintaan.');
        if (result.message) {
          utils.showToast(result.message, 'warning');
        }
        return;
      }

      const message = result.message || successFallbackMessage;
      utils.showToast(message, 'success');

      if (form === registerForm) {
        form.reset();
      }

      const redirectTarget = result.redirect || (form === registerForm ? '/login/' : '/');
      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 600);
    } catch (error) {
      console.error('Authentication request failed', error);
      renderFormErrors(errorContainer, 'Terjadi kesalahan. Silakan coba lagi.');
      utils.showToast('Tidak dapat memproses permintaan.', 'error');
    } finally {
      setFormLoading(form, false);
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) =>
      handleAuthSubmit(event, { successFallbackMessage: 'Login berhasil.' }),
    );
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (event) =>
      handleAuthSubmit(event, { successFallbackMessage: 'Akun berhasil dibuat.' }),
    );
  }

  async function handleLogout(event) {
    event.preventDefault();
    if (!logoutButton) return;

    const csrfToken = utils.getCookie('csrftoken');
    if (!csrfToken) {
      utils.showToast('CSRF token tidak ditemukan. Muat ulang halaman.', 'error');
      return;
    }

    logoutButton.disabled = true;
    logoutButton.classList.add('opacity-70');
    try {
      const response = await fetch(logoutButton.dataset.logoutUrl || '/logout/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        utils.showToast(result.message || 'Gagal logout.', 'error');
        return;
      }

      utils.showToast(result.message || 'Logout berhasil.', 'success');
      const redirectTarget = result.redirect || '/login/';
      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 500);
    } catch (error) {
      console.error('Logout failed', error);
      utils.showToast('Tidak dapat logout sekarang.', 'error');
    } finally {
      logoutButton.disabled = false;
      logoutButton.classList.remove('opacity-70');
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
})();
