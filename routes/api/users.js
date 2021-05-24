const express = require('express')
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {body, validationResult} = require('express-validator')


const User = require('../../models/User');

// @route POST api/users
// @access Public
router.post('/', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password length must be 6 characters at least').isLength({min: 6})
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
    //check if user exists
    let user = await User.findOne({email});
    if(user){
        return res.status(400).json({msg: 'User already exists'})
    }
    //Get user's gravatar
    const avatar = gravatar.url(email,{
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' //default
    });

    user = new User({
        name,
        email,
        avatar,
        password
    })

    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    //Retutn jwt
    const payload = {
        user:{
            id: user.id
        }
    };
    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err, token) =>{
            if(err) throw err;
            res.json({token});
        }
        )

    } catch (error) {
        res.status(500).send('Server Error');  
    }

   
});

module.exports = router;