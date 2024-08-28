// import bcrypt from 'bcryptjs';

// // Beispielwerte
// const password = 'adminpassword'; // Das Passwort, das Sie testen möchten
// const hashedPassword = '$2a$10$Tx51eodnB4D4aR1JtyLSJOZvGIDv6jaYFuiGW6C06/1mRO2auZn9q'; // Das Hash, das Sie testen möchten

// const testPasswordComparison = async () => {
//   try {
//     // Vergleich des Passworts mit dem Hash
//     const isMatch = await bcrypt.compare(password, hashedPassword);
    
//     // Ausgabe des Ergebnisses
//     console.log('Password Match Result:', isMatch); // Sollte true ausgeben, wenn das Passwort und der Hash übereinstimmen
//   } catch (error) {
//     console.error('Error comparing password:', error);
//   }
// };

// testPasswordComparison();

import bcrypt from 'bcryptjs';

const testPasswordHashing = async () => {
  try {
    const password = 'adminpassword'; // Das Passwort, das Sie testen möchten
    const salt = await bcrypt.genSalt(10); // Erzeugen Sie einen Salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hashen Sie das Passwort

    console.log('New Hashed Password:', hashedPassword);

    // Vergleichen Sie das Passwort mit dem neu erzeugten Hash
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password Match with New Hash:', isMatch); // Sollte true ausgeben, wenn der Hash korrekt ist
  } catch (error) {
    console.error('Error hashing or comparing password:', error);
  }
};

testPasswordHashing();