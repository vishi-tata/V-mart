const addToCartButtonElement = document.querySelector("#product-details button");
const cartBadgeElement =document.querySelector(".nav-items .badge")

addToCartButtonElement.addEventListener("click",addToCart);

async function addToCart(){
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    let response;
    try{
        response = await fetch("/cart/items",{
            method: "POST",
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error){
        alert("something went wrong");
        return;
    }
    

    if(!response.ok){
        alert("something went wrong");
        return;
    }

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;
    console.log(newTotalQuantity);
    console.dir(cartBadgeElement);
    cartBadgeElement.textContent = newTotalQuantity;

}