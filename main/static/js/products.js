(function () {
  const grid = document.getElementById('productGrid');
  if (!grid) {
    return;
  }

  const utils = window.appUtils || {
    getCookie: () => null,
    showToast: () => undefined,
    toggleBodyScroll: () => undefined,
  };

  const stateLoading = document.getElementById('productStateLoading');
  const stateEmpty = document.getElementById('productStateEmpty');
  const stateError = document.getElementById('productStateError');
  const retryButton = document.getElementById('retryFetchProducts');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const categoryFilter = document.getElementById('categoryFilter');
  const navCategoryButtons = Array.from(document.querySelectorAll('#ddCatMenu [data-category]'));
  const refreshButton = document.getElementById('refreshProductsBtn');

  const productModal = document.getElementById('productModal');
  const deleteModal = document.getElementById('deleteModal');
  const trackedModals = [productModal, deleteModal];

  const productForm = document.getElementById('productForm');
  const productFormErrors = document.getElementById('productFormErrors');
  const productModalTitle = document.getElementById('productModalTitle');
  const productModalSubtitle = document.getElementById('productModalSubtitle');
  const productFormSubmitBtn = document.getElementById('productFormSubmitBtn');
  const productIdField = document.getElementById('productIdField');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteProductName = document.getElementById('deleteProductName');

  const productNameInput = document.getElementById('productName');
  const productPriceInput = document.getElementById('productPrice');
  const productStockInput = document.getElementById('productStock');
  const productCategoryInput = document.getElementById('productCategory');
  const productThumbnailInput = document.getElementById('productThumbnail');
  const productDescriptionInput = document.getElementById('productDescription');

  const template = document.getElementById('productCardTemplate');
  if (!template || !template.content || !template.content.firstElementChild) {
    console.warn('Product card template is missing.');
    return;
  }
  const createTriggers = [
    document.getElementById('createProductButton'),
    document.getElementById('navAddProductBtn'),
    document.querySelector('.create-product-shortcut'),
  ].filter(Boolean);

  let currentFilter = 'all';
  let currentCategory = '';
  let productsCache = [];
  let deleteTargetId = null;

  const productMap = new Map();

  function updateScrollLock() {
    const anyOpen = trackedModals.some((modal) => modal && !modal.classList.contains('hidden'));
    utils.toggleBodyScroll(anyOpen);
  }

  function showModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    updateScrollLock();
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    updateScrollLock();
  }

  function setVisibility(element, visible) {
    if (!element) return;
    element.classList.toggle('hidden', !visible);
  }

  function setGlobalLoading(isLoading) {
    if (refreshButton) {
      refreshButton.disabled = isLoading;
      refreshButton.classList.toggle('opacity-60', isLoading);
    }
  }

  function showLoadingState() {
    setVisibility(stateError, false);
    setVisibility(stateEmpty, false);
    grid.innerHTML = '';
    setVisibility(grid, false);
    setVisibility(stateLoading, true);
    setGlobalLoading(true);
  }

  function showEmptyState() {
    setVisibility(stateLoading, false);
    setVisibility(stateError, false);
    setVisibility(grid, false);
    setVisibility(stateEmpty, true);
  }

  function showErrorState(message) {
    if (stateError && message) {
      const paragraph = stateError.querySelector('[data-role="errorMessage"]');
      if (paragraph) {
        paragraph.textContent = message;
      }
    }
    setVisibility(stateLoading, false);
    setVisibility(stateEmpty, false);
    setVisibility(grid, false);
    setVisibility(stateError, true);
  }

  function hideStates() {
    setVisibility(stateLoading, false);
    setVisibility(stateEmpty, false);
    setVisibility(stateError, false);
    setVisibility(grid, true);
    setGlobalLoading(false);
  }

  function updateFilterButtons(activeFilter) {
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === activeFilter;
      btn.classList.toggle('font-semibold', isActive);
      if (isActive) {
        btn.classList.add('bg-[#0B1F3A]/10');
      } else {
        btn.classList.remove('bg-[#0B1F3A]/10');
      }
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function formatCurrency(amount) {
    if (Number.isNaN(Number(amount))) {
      return amount ?? '-';
    }
    try {
      return `Rp ${new Intl.NumberFormat('id-ID').format(Number(amount))}`;
    } catch (error) {
      return `Rp ${Number(amount).toLocaleString()}`;
    }
  }

  function populateCard(card, product) {
    card.dataset.productId = product.id;
    const detailUrl = `product/${product.id}/`;
    const featuredBadge = card.querySelector('[data-role="featuredBadge"]');
    const detailLink = card.querySelector('[data-role="detailLink"]');
    const nameLink = card.querySelector('[data-role="nameLink"]');
    const detailButton = card.querySelector('[data-role="detailButton"]');
    const thumbnail = card.querySelector('[data-role="thumbnail"]');
    const placeholder = card.querySelector('[data-role="placeholder"]');
    const price = card.querySelector('[data-role="price"]');
    const stock = card.querySelector('[data-role="stock"]');
    const description = card.querySelector('[data-role="description"]');
    const category = card.querySelector('[data-role="category"]');
    const editBtn = card.querySelector('[data-action="edit"]');
    const deleteBtn = card.querySelector('[data-action="delete"]');

    if (featuredBadge) {
      featuredBadge.classList.toggle('hidden', !product.is_featured);
    }

    if (detailLink) detailLink.href = detailUrl;
    if (detailButton) detailButton.href = detailUrl;
    if (nameLink) {
      nameLink.href = detailUrl;
      nameLink.textContent = product.name;
    }

    if (thumbnail) {
      if (product.thumbnail) {
        thumbnail.src = product.thumbnail;
        thumbnail.alt = product.name;
        thumbnail.classList.remove('hidden');
        if (placeholder) {
          placeholder.classList.add('hidden');
        }
      } else {
        thumbnail.classList.add('hidden');
        if (placeholder) {
          placeholder.classList.remove('hidden');
        }
      }
    }

    if (price) price.textContent = formatCurrency(product.price);
    if (stock) stock.textContent = `Stock: ${product.stock}`;
    if (description) description.textContent = product.description;
    if (category) category.textContent = product.category_label || '';

    if (editBtn) {
      if (product.is_owner) {
        editBtn.classList.remove('hidden');
        editBtn.addEventListener('click', () => openProductModal('edit', product));
      } else {
        editBtn.classList.add('hidden');
      }
    }

    if (deleteBtn) {
      if (product.is_owner) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.addEventListener('click', () => openDeleteModal(product));
      } else {
        deleteBtn.classList.add('hidden');
      }
    }
  }

  function renderProducts(products) {
    hideStates();
    grid.innerHTML = '';

    if (!products || products.length === 0) {
      showEmptyState();
      return;
    }

    const fragment = document.createDocumentFragment();
    productMap.clear();

    products.forEach((product) => {
      productMap.set(product.id, product);
      const node = template.content.firstElementChild.cloneNode(true);
      populateCard(node, product);
      fragment.appendChild(node);
    });

    grid.appendChild(fragment);
  }

  function prepareParams() {
    const params = new URLSearchParams();
    params.set('filter', currentFilter);
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    return params.toString();
  }

  async function fetchProducts(options = { showLoading: true }) {
    const { showLoading = true } = options;
    if (showLoading) {
      showLoadingState();
    } else {
      setGlobalLoading(true);
      setVisibility(stateError, false);
    }

    try {
      const response = await fetch(`/api/products/?${prepareParams()}`, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        const message = result.message || 'Gagal mengambil data produk.';
        showErrorState(message);
        utils.showToast(message, 'error');
        return;
      }

      productsCache = Array.isArray(result.data) ? result.data : [];
      renderProducts(productsCache);
    } catch (error) {
      console.error('Failed to fetch products', error);
      showErrorState('Tidak dapat memuat product. Periksa koneksi Anda dan coba lagi.');
      utils.showToast('Tidak dapat memuat product.', 'error');
    } finally {
      setGlobalLoading(false);
    }
  }

  function clearFormErrors() {
    if (!productFormErrors) return;
    productFormErrors.innerHTML = '';
    productFormErrors.classList.add('hidden');
  }

  function showFormErrors(errors) {
    if (!productFormErrors) return;
    if (!errors) {
      clearFormErrors();
      return;
    }

    const messages = [];
    if (typeof errors === 'string') {
      messages.push(errors);
    } else if (Array.isArray(errors)) {
      errors.forEach((err) => messages.push(String(err)));
    } else {
      Object.entries(errors).forEach(([field, fieldErrors]) => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        fieldErrors.forEach((err) => messages.push(`${label}: ${err}`));
      });
    }

    productFormErrors.innerHTML = messages.map((msg) => `<div>${msg}</div>`).join('');
    productFormErrors.classList.remove('hidden');
  }

  function resetProductForm() {
    if (productForm) productForm.reset();
    clearFormErrors();
    productIdField.value = '';
    if (productForm) {
      productForm.dataset.mode = 'create';
    }
  }

  function setFormLoading(isLoading) {
    if (!productForm) return;
    productFormSubmitBtn.disabled = isLoading;
    productFormSubmitBtn.classList.toggle('opacity-60', isLoading);
    productFormSubmitBtn.textContent = isLoading ? 'Saving...' : (productForm.dataset.mode === 'edit' ? 'Update Product' : 'Save Product');
  }

  function openProductModal(mode, product = null) {
    if (!productForm) return;
    productForm.dataset.mode = mode;
    clearFormErrors();
    if (mode === 'edit' && product) {
      productModalTitle.textContent = 'Edit Product';
      productModalSubtitle.textContent = 'Update product information as needed.';
      productFormSubmitBtn.textContent = 'Update Product';
      productIdField.value = product.id;
      productNameInput.value = product.name || '';
      productPriceInput.value = product.price ?? '';
      productStockInput.value = product.stock ?? '';
      productCategoryInput.value = product.category || '';
      productThumbnailInput.value = product.thumbnail || '';
      productDescriptionInput.value = product.description || '';
    } else {
      productModalTitle.textContent = 'Create Product';
      productModalSubtitle.textContent = 'Lengkapi detail produk di bawah ini.';
      productFormSubmitBtn.textContent = 'Save Product';
      resetProductForm();
    }
    showModal(productModal);
  }

  function closeProductModal() {
    resetProductForm();
    hideModal(productModal);
  }

  function openDeleteModal(product) {
    deleteTargetId = product.id;
    if (deleteProductName) {
      deleteProductName.textContent = product.name || 'this product';
    }
    showModal(deleteModal);
  }

  function closeDeleteModal() {
    deleteTargetId = null;
    hideModal(deleteModal);
  }

  async function submitProductForm(event) {
    event.preventDefault();
    if (!productForm) return;

    clearFormErrors();
    const mode = productForm.dataset.mode || 'create';
    const csrfToken = utils.getCookie('csrftoken');
    if (!csrfToken) {
      utils.showToast('CSRF token tidak ditemukan. Muat ulang halaman.', 'error');
      return;
    }

    const payload = {
      name: productNameInput.value.trim(),
      price: productPriceInput.value ? Number(productPriceInput.value) : '',
      stock: productStockInput.value ? Number(productStockInput.value) : '',
      category: productCategoryInput.value,
      thumbnail: productThumbnailInput.value.trim(),
      description: productDescriptionInput.value.trim(),
    };

    const url =
      mode === 'edit' && productIdField.value
        ? `/api/products/${productIdField.value}/`
        : '/api/products/';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    setFormLoading(true);
    try {
      const response = await fetch(url, {
        method,
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
        showFormErrors(result.errors || result.message || 'Gagal menyimpan product.');
        if (result.message && response.status >= 400) {
          utils.showToast(result.message, 'warning');
        }
        return;
      }

      closeProductModal();
      utils.showToast(result.message || (mode === 'edit' ? 'Product updated successfully.' : 'Product created successfully.'), 'success');
      await fetchProducts({ showLoading: false });
    } catch (error) {
      console.error('Failed to submit product form', error);
      showFormErrors('Terjadi kesalahan. Silakan coba lagi.');
      utils.showToast('Gagal menyimpan product.', 'error');
    } finally {
      setFormLoading(false);
    }
  }

  function setDeleteLoading(isLoading) {
    if (!confirmDeleteBtn) return;
    confirmDeleteBtn.disabled = isLoading;
    confirmDeleteBtn.classList.toggle('opacity-60', isLoading);
    confirmDeleteBtn.textContent = isLoading ? 'Deleting...' : 'Delete';
  }

  async function handleDelete() {
    if (!deleteTargetId) {
      closeDeleteModal();
      return;
    }

    const csrfToken = utils.getCookie('csrftoken');
    if (!csrfToken) {
      utils.showToast('CSRF token tidak ditemukan. Muat ulang halaman.', 'error');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/products/${deleteTargetId}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrfToken,
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        utils.showToast(result.message || 'Gagal menghapus product.', 'error');
        return;
      }

      utils.showToast(result.message || 'Product deleted successfully.', 'success');
      closeDeleteModal();
      await fetchProducts({ showLoading: false });
    } catch (error) {
      console.error('Failed to delete product', error);
      utils.showToast('Terjadi kesalahan saat menghapus product.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFilterClick(event) {
    const button = event.currentTarget;
    const newFilter = button.dataset.filter;
    if (!newFilter || newFilter === currentFilter) return;
    currentFilter = newFilter;
    updateFilterButtons(currentFilter);
    fetchProducts();
  }

  function handleCategoryChange(event) {
    currentCategory = event.target.value || '';
    fetchProducts();
  }

  function handleModalClick(event) {
    if (event.target === event.currentTarget) {
      hideModal(event.currentTarget);
      if (event.currentTarget === productModal) {
        resetProductForm();
      }
      if (event.currentTarget === deleteModal) {
        deleteTargetId = null;
      }
    }
  }

  function handleKeydown(event) {
    if (event.key !== 'Escape') return;
    if (productModal && !productModal.classList.contains('hidden')) {
      closeProductModal();
    } else if (deleteModal && !deleteModal.classList.contains('hidden')) {
      closeDeleteModal();
    }
  }

  filterButtons.forEach((btn) => btn.addEventListener('click', handleFilterClick));
  updateFilterButtons(currentFilter);

  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryChange);
  }

  if (navCategoryButtons.length) {
    navCategoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category || '';
        if (categoryFilter) {
          categoryFilter.value = currentCategory;
        }
        const menu = document.getElementById('ddCatMenu');
        if (menu) {
          menu.classList.add('hidden');
        }
        fetchProducts();
      });
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => fetchProducts());
  }

  if (retryButton) {
    retryButton.addEventListener('click', () => fetchProducts());
  }

  createTriggers.forEach((btn) => btn.addEventListener('click', () => openProductModal('create')));

  if (productForm) {
    productForm.addEventListener('submit', submitProductForm);
  }

  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('#productModal, #deleteModal');
      if (modal === productModal) {
        closeProductModal();
      } else if (modal === deleteModal) {
        closeDeleteModal();
      }
    });
  });

  if (productModal) {
    productModal.addEventListener('click', handleModalClick);
  }
  if (deleteModal) {
    deleteModal.addEventListener('click', handleModalClick);
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleDelete);
  }

  document.addEventListener('keydown', handleKeydown);

  fetchProducts();
})();
