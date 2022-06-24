const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req,res){
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders",{orders:orders});
}

async function addOrder(req,res,next){
    const cart = res.locals.cart;
    let userData
    try{
        userData = await User.findUserById(res.locals.uid);

    } catch(error){
        next(error);
        return;
    }
    const order = new Order(cart,userData);

    try{
        await order.save();
    } catch(error){
        return next(error);
    }

    req.session.cart = null;

    res.redirect("/orders");

}

module.exports = {
    getOrders: getOrders,
    addOrder: addOrder,
}