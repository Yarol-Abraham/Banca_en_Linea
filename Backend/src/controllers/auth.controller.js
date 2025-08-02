const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET; 

const sendResponse = (res, code, user = null) => {
    
    if(!user) return res.status(code).json({ 
        message: "Usuario no encontrado o no válido.", 
        token: null, 
        user: null, 
    });

    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: process.env.JWT_AUTH_EXPIRE }
    );
    
    return res.status(code).json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });
}

exports.login = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400);
   
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendResponse(res, 401);

    return sendResponse(res, 200, user);
};

exports.validateToken = async (req, res) => {
     req.user._id = req.user.id;
  return sendResponse(res, 200, req.user);
}