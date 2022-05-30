let productList = [];
let basketList = [];

// ! object literail
const PRODUCT_TYPES = {
  ALL: "ALL PRODUCTS",
  CLOTHES: "CLOTHES",
  SHOE: "SHOE",
  FURNITURE: "FURNITURE",
  TOYS: "TOYS",
  BEDLINEN: "BED LINEN",
};

// ! get data from database
const getData = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((book) => (productList = book));
};
getData();

// ! star creation function
const createStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    } else {
      starRateHtml += `<i class="bi bi-star-fill"></i>`;
    }
  }

  return starRateHtml;
};

// ! book creation function
const createProductItemsHtml = () => {
  const productListEl = document.querySelector(".product-list");
  let productListHtml = "";
  productList.forEach((product, index) => {
    productListHtml += ` 
          <div class="card h-100 shadow-sm">
            <img
              src="${product.imgSource}"
              class="card-img-top"
              alt="product.name"
            />
            <div class="label-top shadow-sm">${product.name}</div>
            <div class="card-body">
              <div class="clearfix mb-3">
                <span class="float-start badge rounded-pill bg-success"
                  >${product.price} $</span
                >
                ${
                  product.oldPrice
                    ? `<span class="old-price"
                  >${product.oldPrice} $</span
                >`
                    : ""
                }
                <span class="float-end">${product.reviewCount} reviews</span>
              </div>
              <h6 class="product-brand">${product.brand}</h6>
              <br />
              <p class="card-title">${product.description}</p>
              <div class="d-grid gap-2 my-4">
                <button
                  class="btn btn-warning bold-btn"
                  onclick="addToBasket(${product.id})"
                >
                  add to cart
                </button>
              </div>
              <div class="clearfix mb-1">
                <span class="float-end book-star-rate"> ${createStars(
                  product.starRate
                )} </span>
              </div>
            </div>
          </div>`;
  });
  productListEl.innerHTML = productListHtml;
};

// ! create book type function
const createProductTypeHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];

  productList.forEach((product) => {
    if (filterTypes.findIndex((filter) => filter == product.type) == -1)
      filterTypes.push(product.type);
  });

  filterTypes.forEach((type, index) => {
    filterHtml += ` <li class="${
      index == 0 ? "active" : null
    }" onclick="filterProducts(this)" data-type="${type}">${
      PRODUCT_TYPES[type] || type
    }</li>`;
  });

  filterEl.innerHTML = filterHtml;
};

// ! filter books function
const filterProducts = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let productType = filterEl.dataset.type;
  getData();
  if (productType != "ALL") {
    productList = productList.filter((product) => product.type == productType);
    createProductItemsHtml();
  }
};

// ! listed basket item
const listBasketItem = () => {
  localStorage.setItem("basketList", JSON.stringify(basketList));
  const basketListEl = document.querySelector(".basket-list");
  const basketCountEl = document.querySelector(".basket-count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  const totalPriceEl = document.querySelector(".total-price");

  let basketListHtml = "";
  let totalPrice = 0;

  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
    <li class="basket-item">
    <img src="${item.product.imgSource}" width="100" height="100">
               <div class="basket-item-info">
                 <h3 class="book-name">${item.product.name}</h3>
                 <span class="book-price">${item.product.price} $</span><br/>
               </div>
               <div class="book-count">
                 <span class="decrease" onclick="decraseItemToBasket(${item.product.id})">-</span>
                 <span class="my-5">${item.quantity}</span>
                <span class="increase" onclick="increaseItemToBasket(${item.product.id})">+</span>
                <span class="book-remove" onclick="removeItemToBasket(${item.product.id})"><i class="bi bi-trash mx-3"></i></span>
                </div>
              </li>`;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<i class="basket-item mt-5">You have not item in basket</i>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Total : " + totalPrice.toFixed(2) + "$" : null;
};

// ! add to basket function
const addToBasket = (productId) => {
  const findBook = productList.find((item) => item.id == productId);
  if (findBook) {
    const basketAlReadyIndex = basketList.findIndex(
      (basket) => basket.product.id == productId
    );
    if (basketAlReadyIndex == -1) {
      let addedItem = { quantity: 1, product: findBook };
      basketList.push(addedItem);
    } else {
      if (
        basketList[basketAlReadyIndex].quantity <
        basketList[basketAlReadyIndex].product.stock
      )
        basketList[basketAlReadyIndex].quantity += 1;
      else {
        toastr.error("sorry, we have dont any stock");
        return;
      }
    }
    listBasketItem();
    toastr.success("added successfully");
  }
};

// ! remove item from basket
const removeItemToBasket = (productId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == productId
  );
  if (findedIndex != -1) {
    basketList.splice(findedIndex, 1);
  }
  listBasketItem();
};

// ! decrement item from basket
const decraseItemToBasket = (productId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == productId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1)
      basketList[findedIndex].quantity -= 1;
    else removeItemToBasket(bookId);
    listBasketItem();
  }
};

// ! increment item from basket
const increaseItemToBasket = (productId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == productId
  );
  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity < basketList[findedIndex].product.stock
    )
      basketList[findedIndex].quantity += 1;
    else toastr.error("sorry, we have dont any stock");
    listBasketItem();
  }
};

// ! filter input value
let input = document.querySelector("#search-input");
let list = document.querySelectorAll(".product-list");
function search() {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].innerText.toLowerCase().includes(input.value.toLowerCase())) {
      list[i].style.display = "block";
    } else {
      list[i].style.display = "none";
    }
  }
}
input.addEventListener("input", search);

// ! if exist in localStorage
if (localStorage.getItem("basketList")) {
  basketList = JSON.parse(localStorage.getItem("basketList"));
  listBasketItem();
}

setTimeout(() => {
  createProductItemsHtml();
  createProductTypeHtml();
}, 100);
