const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth')
const contact = require('../models/Contact');
const Contact = require('../models/Contact');

// @route  GET api/contacts
// @desc   Get all contacts
// @access Private
router.get('/', auth, async (req,res)=>{
   try {
    // Get user based oh nis id and get the most recent contact (-1)
    const contacts = await Contact.find({ user: req.user.id }).sort({ date:-1 })
    res.json(contacts)
} catch (err) {
       console.error(err.message)
       res.status(500).send('Server Error')
   }
})

// @route  POST api/contacts
// @desc   Add new contact
// @access Private
router.post('/', 
[
    auth, 
    check('name','Name is required').not().isEmpty()
], 
    async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors })
    }

    const { email, name, phone, type } = req.body

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        })

        const contact = await newContact.save()

        res.json(contact)

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'Error adding new Contact' })
    }
   
})


// @route  PUT api/contacts/:id
// @desc   Update contact
// @access Private
router.put('/:id',(req,res)=>{
    res.send('Update contact with Id')
})

// @route  DELETE api/contacts/:id
// @desc   Delete contact
// @access Private
router.delete('/:id',(req,res)=>{
    res.send('Delete contact')
})


module.exports = router