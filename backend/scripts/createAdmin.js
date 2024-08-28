import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js'; // Pfad zu Ihrem User-Modell

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmins = async () => {
  try {
    // Liste von Admin-Daten
    const admins = [
      { name: "Admin1", email: "admin1@example.com", password: "adminpassword1", role: "admin" },
      { name: "Admin2", email: "admin2@example.com", password: "adminpassword2", role: "admin" },
      // Fügen Sie hier weitere Admins hinzu, wenn nötig
    ];

    for (const adminData of admins) {
      const { name, email, password, role } = adminData;

      // Überprüfen, ob der Benutzer bereits existiert
      const userExists = await User.findOne({ email });

      if (userExists) {
        console.log(`Admin user with email ${email} already exists`);
        continue; // Falls der Benutzer existiert, überspringen Sie diesen Admin
      }

      // Benutzer erstellen
      const admin = await User.create({
        name,
        email,
        password, // Passwort wird im pre('save') Hook gehasht
        role,
      });

      console.log("Admin created successfully");
      console.log(admin);
    }
  } catch (error) {
    console.error("Error creating admin users:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmins();