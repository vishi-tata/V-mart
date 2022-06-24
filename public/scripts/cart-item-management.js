const cartItemUpdtationFormElements = document.querySelectorAll(".cart-item-management");

const cartBadgeElements = document.querySelectorAll(".nav-items .badge");
const cartTotalPriceElement = document.getElementById("cart-total-price");

async function updateCart(event){
    event.preventDefault();
    const form = event.target;
    const newQuantity = form.firstElementChild.value;
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;

    let response;
    try{
        response = await fetch("/cart/items",{
            method: "PATCH",
            body: JSON.stringify({
                quantity: newQuantity,
                productId: productId,
                _csrf: csrfToken,
            }),
            headers:{
                "content-type":"application/json"
            }
        });
    }catch(error){
        alert("Something went Wrong!");
        return;
    }

    if (!response.ok) {
        alert("something went wrong");
        return;
    }

    const responseData = await response.json();

    if(responseData.updatedCartData.updatedItemPrice === 0){
        form.parentElement.parentElement.remove();
    } else{
        const cartItemPriceElement = form.parentElement.querySelector(".cart-item-price");
        cartItemPriceElement.textContent = responseData.updatedCartData.updatedItemPrice;
    }

    for(const cartBadgeElement of cartBadgeElements){
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }

    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
}

for(const cartItemUpdtationFormElement of cartItemUpdtationFormElements){
    cartItemUpdtationFormElement.addEventListener("submit", updateCart);
}