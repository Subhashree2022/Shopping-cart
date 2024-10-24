document.addEventListener('DOMContentLoaded', () => {
    // Selectors for the cart and summary sections
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.cart-summary p:nth-child(2)');
    const totalElement = document.querySelector('.cart-summary p:nth-child(3)');
    
    let cart = [];
  
    // Fetch cart items from JSON API
    const fetchCartItems = () => {
      showLoader();
      fetch('https://fakestoreapi.com/products?limit=3')  // Using a public API for fake products
        .then(res => res.json())
        .then(data => {
          cart = data.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: 1
          }));
          renderCartItems();
          hideLoader();
          updateSummary();
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
          hideLoader();
        });
    };
  
    // Render cart items to the DOM
    const renderCartItems = () => {
      cartItemsContainer.innerHTML = '';
      cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div class="title">${item.title}</div>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input">
          <div class="price">₹${item.price.toFixed(2)}</div>
          <div class="subtotal">₹${(item.price * item.quantity).toFixed(2)}</div>
          <div class="remove">X</div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
  
        // Attach event listeners for quantity changes and item removal
        cartItemDiv.querySelector('.quantity-input').addEventListener('change', (e) => {
          updateItemQuantity(item.id, e.target.value);
        });
  
        cartItemDiv.querySelector('.remove').addEventListener('click', () => {
          confirmItemRemoval(item.id);
        });
      });
    };
  
    // Update the quantity of a cart item
    const updateItemQuantity = (id, quantity) => {
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity = parseInt(quantity);
        renderCartItems();
        updateSummary();
      }
    };
  
    // Update the subtotal and total summary
    const updateSummary = () => {
      const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const total = subtotal; // You can add tax/shipping to this if needed
  
      subtotalElement.textContent = `Subtotal: ₹${subtotal.toFixed(2)}`;
      totalElement.textContent = `Total: ₹${total.toFixed(2)}`;
    };
  
    // Confirm before removing an item from the cart
    const confirmItemRemoval = (id) => {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <p>Are you sure you want to remove this item?</p>
          <button class="confirm-remove">Yes</button>
          <button class="cancel-remove">No</button>
        </div>
      `;
      document.body.appendChild(modal);
  
      modal.querySelector('.confirm-remove').addEventListener('click', () => {
        removeItem(id);
        document.body.removeChild(modal);
      });
  
      modal.querySelector('.cancel-remove').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
    };
  
    // Remove an item from the cart
    const removeItem = (id) => {
      cart = cart.filter(item => item.id !== id);
      renderCartItems();
      updateSummary();
    };
  
    const showLoader = () => {
        const loader = document.querySelector('.loader');
        if (loader) {
          loader.style.display = 'block';
        } else {
          console.warn('Loader element not found');
        }
      };
      
      const hideLoader = () => {
        const loader = document.querySelector('.loader');
        if (loader) {
          loader.style.display = 'none';
        } else {
          console.warn('Loader element not found');
        }
    };
    fetchCartItems();
      });