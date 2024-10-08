import mongoose from 'mongoose';

const returnSchema = mongoose.Schema({
  reason: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },  // Füge den Namen des Produkts hinzu
      quantity: { type: Number, required: true },
    }
  ],
  returnedAt: { type: Date, default: Date.now },
});

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  returns: [returnSchema], // Rücksendedaten hinzufügen
});

const Order = mongoose.model('Order', orderSchema);

export default Order;