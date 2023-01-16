import User from './db/user.js';
import Friend from './db/friend.js';
import Invitation from './db/invitation.js';
import { hash, getIP } from './utils.js';

class IpCount {
    constructor(){
        this.max_count = 5
        this.max_minutes = 30
        this.dict = {}
    }
    check(req){
        const ip = getIP(req)
        if(this.dict[ip] === undefined) this.dict[ip] = {count:0, last_date:null}
        if(this.dict[ip].last_date === null || (new Date().getTime()) - this.dict[ip].last_date.getTime() > this.max_minutes * 60 * 1000){
            this.dict[ip].last_date = new Date()
            this.dict[ip].count = 0;
        }else{
            this.dict[ip].count += 1;
        }
        if(this.dict[ip].count > this.max_count){
            return false
        }
        return true
    }
    getLeft(req){
        const ip = getIP(req)
        if(this.dict[ip]===undefined) return this.max_count
        return this.max_count - this.dict[ip].count
    }
}
const ipCount = new IpCount()

export default class {
    static getUsername = async (req, res) => {
        res.json({
            username: req.session.username
        })
    }
    static getUserInfo = async (req, res) => {
        const username = req.session.username;
        if(!username){
            res.json({messages: [{type: 'warning', text: 'login required'}]})
            return;
        }
        const invitations = await Invitation.find({issuer:username}).exec()
        res.json({ username, invitations })
    }

    static signin = async (req, res) => {
        const username = String(req.body.username).toLowerCase();
        const passhash = hash(req.body.password);
        const user = await User.findOne({username, passhash}).exec();
        if(!user) {
            res.json({ messages: [{type: 'warning', text: 'username or password is wrong.'}] })
            return
        }
        await new Promise((res,rej)=>req.session.regenerate(()=>{res()}));
        req.session.username = username
        res.json({ 
            messages: [{type: 'info', text: 'signin successed.'}],
            redirect: '/'
        })
    }
    
    static signout = async (req, res) => {
        delete req.session.username
        res.json({})
    }
    
    static signup = async (req, res) => {
        if(!ipCount.check(req)){
            res.json({
                messages: [{type: 'danger', text: `too many try. your action is limited.`}]
            })
            return;
        }
        const lefttrycount = ipCount.getLeft(req)
        const invitationcode = String(req.body.invitationcode);
        if(invitationcode.length == 0){
            res.json({
                messages: [{type: 'warning', text: `enter invitation code. (${lefttrycount})`}]
            })
            return;
        }
        await Invitation.deleteMany({expirationdate: {$lt: new Date()}});
        const invitation = await Invitation.findOne({code: invitationcode, expirationdate: {$gte: new Date()}}).exec();
        if(!invitation){
            res.json({ messages: [{type:'warning', text: `this invitation code is not found. (${lefttrycount})`}] })
            return
        }
        const invitedby = invitation.issuer;
        const username = String(req.body.username).toLowerCase();
        const passhash = hash(req.body.password)
        if(await User.findOne({username}).exec()){
            res.json({ messages: [{type: 'warning', text: `username is already registered. (${lefttrycount})`}] })
            return
        }
        await User({username, passhash, invitedby, amount:0}).save();
        await Friend({username:username, friendname: invitedby, accepted: true}).save();
        await Friend({username:invitedby, friendname: username, accepted: true}).save();
        await Invitation.deleteOne({_id: invitation._id}).exec();
        req.session.username = username;
        res.json({
            messages: [{type: 'info', text: 'registration successed.'}],
            redirect: '/signin'
        })
    }
    
    static loginRequired = async (req, res, next) => {
        if(!!req.session.username) {
            next()
            return
        }
        res.json({
            messages: [{type: 'warning', text: 'login is required'}],
            redirect: '/signin'
        })
    
    }
}
