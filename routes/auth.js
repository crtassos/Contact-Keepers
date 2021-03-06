const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')

const User = require('../models/User')
const { check, validationResult } = require('express-validator');



// @route  GET api/auth
// @desc   Get logged in user
// @access Private
router.get('/', auth, async (req,res)=>{

    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'Server error' })
    }
})


// @route  POST api/auth
// @desc   Auth user & get token
// @access Public
router.post('/', 
[
    check('email', 'Please include a valid email'),
    check('password','Password is required').exists()
],
async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ msg: 'Invalid Credentials' })
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ msg:'Invalid Credentials' })
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn:3600
        },(err,token)=>{
            if(err) throw err
            res.json({ token })
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})

module.exports = router