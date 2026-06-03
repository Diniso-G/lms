const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Course } = require('../models');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({error: 'Name, email and password are required'});

        const hashedPassword = await bcrypt.hash(password, 10 );

        const user = await User.create({name, email, password: hashedPassword, role});

        res.status(201).json({ message: 'User registered successfully', user: {id: user.id, name: user.name, email: user.email, role: user.role}});

    } catch (err){
        console.error('Registration error:', err)
        res.status(400). json({ error: err.message || 'Registration Failed'});
    }
};

exports.login = async (req, res) => {
    try{
    const { name, password } = req.body;

    const user = await User.findOne({ where:{name}});
    if (!user) return res.status(401).json({ error:'Invalid Credentials'});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({error: 'Invalid Credentials'});

    const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role}, process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );

    res.status(200).json({token,
        role: user.role, user:{id: user.id, name:user.name}
    });
} catch (err){
    console.error('Login Error:', err);
    res.status(500).json({error: 'Server Error'});
}
};

