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
  notifications: [ // Hier das Feld für Benachrichtigungen hinzufügen
    {
      message: { type: String, required: true },  // Der Typ muss String sein
      date: { type: Date, default: Date.now }
    }
  ]
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
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

// Erstelle das Admin-Modell
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
