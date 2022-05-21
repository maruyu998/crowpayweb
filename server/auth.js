const User = require('./db/user');
const hash = require('./utils').hash;

module.exports.getUsername = async (req, res) => {
    res.json({
        username: req.session.username
    })
}

module.exports.signin = async (req, res) => {
    const username = req.body.username;
    const passhash = hash(req.body.password);
    const user = await User.findOne({username, passhash}).exec();
    if(!user) {
        res.json({ messages: [{type: 'warning', text: 'username or password is wrong.'}] })
        return
    }
    req.session.username = username
    res.json({ 
        messages: [{type: 'info', text: 'signin successed.'}],
        redirect: '/'
    })
}

module.exports.signout = async (req, res) => {
    delete req.session.username
    res.json({})
}

module.exports.signup = async (req, res) => {
    // res.json({
    //     messages: [{ type: 'danger', text: 'only admin user can register new account for now.'}]
    // })
    // return
    const username = req.body.username
    const passhash = hash(req.body.password)
    if(await User.findOne({username}).exec()){
        res.json({ messages: [{type: 'warning', text: 'username is already registered.'}] })
        return
    }
    const user = new User({username, passhash, amount:0})
    await user.save()
    res.json({ 
        messages: [{type: 'info', text: 'registration successed.'}],
        redirect: '/signin'
    })
}

module.exports.loginRequired = async (req, res, next) => {
    if(!!req.session.username) {
        next()
        return
    }
    res.json({
        messages: [{type: 'warning', text: 'login is required'}],
        redirect: '/signin'
    })

}