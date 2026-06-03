const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token Provided' });

    const token = authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : authHeader;
    
    if (!token) return res.status(401).json({error: 'Invalid token format'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: decoded.id, email: decoded.email, role: decoded.role};
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid/Expired Token'});
    }

};

