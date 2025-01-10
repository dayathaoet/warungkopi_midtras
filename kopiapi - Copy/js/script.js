const navbarNav = document.querySelector(".navbar-nav");
const hamburgerButton = document.querySelector("#hamburger-menu");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartButton = document.querySelector("#shopping-cart-button");
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");
const itemDetailCloseButton = document.querySelector(".modal .close-icon");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutButton = document.querySelector("#checkout-button");

toggleActiveClass([
  {
    button: hamburgerButton,
    element: navbarNav,
  },
  {
    button: searchButton,
    element: searchForm,
    callback: () => {
      searchInput.focus();
    },
  },
  {
    button: shoppingCartButton,
    element: shoppingCart,
  },
]);

removeActiveClass([
  { button: hamburgerButton, element: navbarNav },
  { button: searchButton, element: searchForm },
  { button: shoppingCartButton, element: shoppingCart },
]);

toggleModal(itemDetailButtons, itemDetailModal, itemDetailCloseButton);

toggleButtonOnFormInput(checkoutForm, checkoutButton, "disabled");

handleCheckout(checkoutForm, "6285806011157", formatMessage);
