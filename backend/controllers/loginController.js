import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting login with email:', email);

        // Versuche, einen Admin zu finden
        let user = await Admin.findOne({ email });
        let userType = 'admin';

        console.log('Admin query result:', user);

        if (!user) {
            // Wenn kein Admin gefunden wird, suche einen normalen Benutzer
            user = await User.findOne({ email });
            userType = 'user';
            console.log('User query result:', user);
        }

        if (!user) {
            console.log('No user found with this email');
            return res.status(404).json({ message: 'No user found with this email' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, role: userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful, token:', token);
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};