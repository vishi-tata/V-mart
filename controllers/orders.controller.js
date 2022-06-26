const stripe = require('stripe')('sk_test_51LEdb1SBLWDdSAXhoTVlDUFnZsE3zAwWjTCnnT5k9gfKRe1hlHbRdrLRZSWa5FTXR56RRH671vyPvj4c2t4jvXLN00YXVkSeIJ')

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req, res) {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", { orders: orders });
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;
    let userData
    try {
        userData = await User.findUserById(res.locals.uid);

    } catch (error) {
        next(error);
        return;
    }
    const order = new Order(cart, userData);

    try {
        await order.save();
    } catch (error) {
        return next(error);
    }

    req.session.cart = null;

    const session = await stripe.checkout.sessions.create({
        line_items: cart.items.map(function(item) {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.title,
                    },
                    unit_amount: +item.product.price.toFixed(2)*100,
                },
                quantity: item.quantity,
            }
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/orders/success`,
        cancel_url: `http://localhost:3000/orders/failure`,
    });

    res.redirect(303, session.url);
}

function getSuccess(req,res){
    res.render("customer/orders/success");
}

function getFailure(req,res){
    res.render("customer/orders/success");
}

module.exports = {
    getOrders: getOrders,
    addOrder: addOrder,
    getSuccess: getSuccess,
    getFailure: getFailure,
}