import User from './db/user.js';
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
        const username = String(req.body.username).toLowerCase();
        const passhash = hash(req.body.password)
        if(await User.findOne({username}).exec()){
            res.json({ messages: [{type: 'warning', text: `username is already registered. (${lefttrycount})`}] })
            return
        }
        const user = new User({username, passhash, amount:0})
        await user.save()
        req.session.username = username
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
