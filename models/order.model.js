const mongodb = require("mongodb");

const db = require("../data/database");

class Order{
    constructor(cart,userData, status="pending",date,orderId){
        this.productData = cart
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        if(this.date){
            this.formattedDate = this.date.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        }
        this.id = orderId
    }

    save(){
        if(this.id){
            const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
        } else {
            const orderDocument = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status
            }
            return db.getDb().collection("orders").insertOne(orderDocument);
        }
    }

    static transformOrderDocument(orderDocument){
        return new Order(
            orderDocument.productData,
            orderDocument.userData,
            orderDocument.status,
            orderDocument.date,
            orderDocument._id,
        )
    }

    static transformOrderDocuments(orderDocuments){
        return orderDocuments.map(this.transformOrderDocument);
    }
    
    static async findAll(){
        const orders= await db.getDb().collection("orders").find().sort({_id:-1}).toArray();
        return this.transformOrderDocuments(orders);
    }
    
    static async findAllForUser(userId){
        const uid = new mongodb.ObjectId(userId);
        const orders = await db.getDb().collection("orders").find({"userData._id": uid }).sort({_id:-1}).toArray();
        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId){
        const order = await db.getDb().collection("orders").findOne({_id: new mongodb.ObjectId(orderId)});
        return this.transformOrderDocument(order);
    }
}

module.exports = Order;