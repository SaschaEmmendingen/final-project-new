import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin' // oder 'User', je nach Sender
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // oder 'Admin', je nach Empfänger
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
