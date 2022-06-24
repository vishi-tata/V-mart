const orderUpdateFormElements = document.querySelectorAll(".order-actions form");

async function updateOrderStatus(event){
    event.preventDefault();
    const formElement = event.target;
    const formData = new FormData(formElement);
    const orderCsrfToken = formData.get("_csrf");
    const orderId = formData.get("orderid");
    const newStatus = formData.get("status");

    let response;

    try{
        response = await fetch(`admin/orders/${orderId}`,{
            method: "PATCH",
            body:JSON.stringify({
                newStatus: newStatus,
                _csrf: orderCsrfToken,
            }),
            headers:{
                "Content-Type":"application.json"
            }
        });
    }catch(error){
        alert("something went wrong");
        return;
    }

    if(!response.ok){
        alert("something went wrong");
        return;
    }

    const responseData = await response.json();

    /*const orderStatusBadgeElement = */formElement.parentElement.parentElement.querySelector(".badge").textContent = responseData.newStatus.toUpperCase();
    // orderStatusBadgeElement.textContent = responseData.newStatus;
}

for(const orderUpdateFormElement of orderUpdateFormElements){
    orderUpdateFormElement.addEventListener("submit",updateOrderStatus);
}