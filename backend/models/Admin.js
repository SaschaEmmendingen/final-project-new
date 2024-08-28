import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definiere das Schema für Admins
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  phone: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'admin', // Standardmäßig 'admin', kann jedoch nach Bedarf angepasst werden
  },
});

// Middleware, um das Passwort vor dem Speichern zu hashen
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Methode zur Überprüfung des Passworts
adminSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Entered Password:', enteredPassword);
  console.log('Stored Hashed Password:', this.password);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password Match:', isMatch);
  return isMatch;
};

// Erstelle das Admin-Modell
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;