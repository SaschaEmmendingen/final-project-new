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