const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const {body, validationResult} = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route Get api/profile/me
// get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(404).json({msg: 'Profile not found'})
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route Get api/profile/
// get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find()
        .populate('user', ['name', 'avatar']);

        if(!profiles){
            return res.status(404).json({msg: 'Profiles not found'})
        }

        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route Get api/profile/user/:user_id
// get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(404).json({msg: 'Profile not found'})
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Profile not found'})
        }
        res.status(500).send('Server error');
    }
});

// @route DELETE api/profile/
// delete profile, user, posts
// @access Private
router.delete('/', auth ,async (req, res) => {
    try {
        //@todo - remove users posts

        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        //Remove user
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: 'User removed'});
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// @route Post api/profile/
// create or update user's profile
// @access Private
router.post('/',[
    auth,
    [
        body('status', 'Status is required').not().isEmpty(),
        body('skills', 'Skills is required').not().isEmpty(),
    ]
    ] ,
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        //Build profile.social object
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({user: req.user.id});
            if(profile){
                //Update and send the new object
                profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
                return res.json(profile);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send('Server Error');
        }

        //Create a Profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)

});

// @route put api/profile/experience
// add experience to user's profile
// @access Private
router.put('/experience', [
    auth,
    [
        body('title', 'Title is required').notEmpty(),
        body('company', 'Company name is required').notEmpty(),
        body('from', 'Starting date is invalid').notEmpty()
    ]
], 
async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try {
        let profile = await Profile.findOne({user: req.user.id});
        //push(0) 
        profile.experiences.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

// @route DELETE api/profile/experience/:exp_id
// delete experience from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) =>{
    try {
        let profile = await Profile.findOne({user: req.user.id});
        let removeIndex = profile.experiences.map(item => item.id).indexOf(req.params.exp_id); 

        if(removeIndex < 0){
            return res.status(500).json({msg: "Experience doesn't exist"});
        }
        profile.experiences.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

// @route put api/profile/education
// add education to user's profile
// @access Private

router.put('/education', [
    auth,
    [
        body('school', 'School name is required').notEmpty(),
        body('degree', 'Degree is required').notEmpty(),
        body('from', 'Starting date is required').notEmpty(),
        body('to', 'Ending date is required').notEmpty()
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        try {
            let profile = await Profile.findOne({user: req.user.id});
            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                description,
                current
            } = req.body;
            const newEdc = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                description,
                current
            };

            profile.education.unshift(newEdc);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }
]);

// @route delete api/profile/education/:edc_id
// delete education from user's profile
// @access Private

router.delete('/education/:edc_id', auth, async(req, res) =>{
    try {
        let profile =  await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(elt => elt.id).indexOf(req.params.edc_id);
        if(removeIndex < 0){
            return res.status(500).json({msg: "Education doesn't exist"});
        }
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

// @route get api/profile/github/:username
// dget user's github profile
// @access Public

router.get('/github/:username',  (req, res) =>{
    try {
        const options = {
            uri: 'https://api.github.com/users/'+req.params.username+
                '/repos?per_page=5&sort=created:asc&client_id='+config.get('githubClientId')+
                '&client_secret='+config.get('githubSecret'),
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

         request(options, (errors, response, body) =>{
            if(errors) console.error(error);

            if(response.statusCode !== 200){
                console.log(res);
                return res.status(400).json({msg: 'Github profile not found'})
            }

            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
})

module.exports = router;