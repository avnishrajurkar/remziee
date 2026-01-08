// @ts-ignore
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    // @ts-ignore
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    // @ts-ignore
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = navLinks.style.display === 'flex';
            navLinks.style.display = isExpanded ? 'none' : 'flex';
            
            if (!isExpanded) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderTop = '2px solid var(--black)';
                navLinks.style.borderBottom = '2px solid var(--black)';
                navLinks.style.gap = '1.5rem';
                navLinks.style.zIndex = '1000';
            }
        });
        
        // Close menu when clicking outside
        // @ts-ignore
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav') && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        });
    }
    
    // Fetch products from API
    // @ts-ignore
    const productsGrid = document.getElementById('productsGrid');
    
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const products = await response.json();
            
            if (!Array.isArray(products) || products.length === 0) {
                productsGrid.innerHTML = `
                    <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                        <p>No products available at the moment.</p>
                    </div>
                `;
                return;
            }
            
            renderProducts(products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productsGrid.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <p>Unable to load products. Please try again later.</p>
                    <button onclick="fetchProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--black); color: var(--white); border: none; cursor: pointer;">Retry</button>
                </div>
            `;
        }
    }
    
    function renderProducts(products) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            // Extract product data from Printify response structure
            const title = product.title || 'Untitled Product';
            const images = product.images || [];
            const imageUrl = images[0]?.src || '';
            const variants = product.variants || [];
            const price = variants[0]?.price ? `$${parseFloat(variants[0].price).toFixed(2)}` : 'Price unavailable';
            
            // @ts-ignore
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image-container">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${title}" class="product-image" loading="lazy">` : 
                        `<div style="width: 100%; height: 100%; background: var(--gray-100); display: flex; align-items: center; justify-content: center; color: var(--gray-800);">Image not available</div>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-title">${title}</h3>
                    <div class="product-variants">${variants.length} variants available</div>
                    <div class="product-price">${price}</div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    }
    
    // Initialize
    fetchProducts();
  });