import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definiere das User-Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index für schnellere Abfragen
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
    default: 'user',
  },
  activities: [
    {
      type: {
        type: String,
        enum: ['Bestellung erstellt', 'Retoure erstellt', 'Zur Wunschliste hinzugefügt', 'Profil aktualisiert'],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  notifications: [
    {
      type: String,
    }
  ],
});

// Middleware zum Hashen des Passworts vor dem Speichern
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully.');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Methode zum Vergleichen von Passwörtern
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Entered Password:', enteredPassword);
  console.log('Stored Hashed Password:', this.password);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password Match:', isMatch);
  return isMatch;
};

// Erstelle das User-Modell
const User = mongoose.model('User', userSchema);

export default User;
