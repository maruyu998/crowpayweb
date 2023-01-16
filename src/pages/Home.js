import React, { Component } from "react";
import { Navigate, Link } from 'react-router-dom';
import RequestIcon from '../images/request.svg';
import SendIcon from '../images/send.svg';
import OtherIcon from '../images/three-dots.svg';
import FundIcon from '../images/fund.png';
import Header from '../components/Header.js';

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            is_signed_in: false,
            amount: null,
            messages: [],
            redirect: null,
            // friends: [],
            requested_friends: [],
            accept_transactions: []
        }
    }
    componentDidMount(){
        this.loadSummary()
        this.loadFriends()
        this.loadTransactions()
    }
    loadSummary(){
        fetch('/api/getUserSummary').then(res=>res.json()).then(res=>{
            this.setState({messages: res.messages})
            this.setState({redirect: res.redirect})
            this.setState({amount: res.amount})
        })
    }
    loadFriends = () => {
        fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
            this.setState({username: res.username});
            // this.setState({friends: res.friends || []});
            this.setState({requested_friends: res.requested_friends || []});
            this.setState({redirect: res.redirect});
        })
    }
    acceptFriend = (friendname) => {
        const result = window.confirm(`フレンド申請を受け入れますか?`)
        if(!result) return
        fetch('/api/acceptFriend', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendname })
        }).then(res=>res.json()).then(res=>{
            this.setState({messages: res.messages})
            this.setState({redirect: res.redirect})
            this.loadFriends()
        })
    }
    declineFriend = (friendname) => {
        const result = window.confirm(`フレンド申請を却下しますか?`)
        if(!result) return
        fetch('/api/declineFriend', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendname })
        }).then(res=>res.json()).then(res=>{
            this.setState({messages: res.messages})
            this.setState({redirect: res.redirect})
            this.loadFriends()
        })
    }  
    loadTransactions = () => {
        fetch('/api/getTransactions').then(res=>res.json()).then(res=>{
            const accept_transactions = res.transactions ? res.transactions.filter(t=>!t.accepted_at&&t.accepter==res.username): []
            this.setState({username: res.username})
            this.setState({accept_transactions});
            this.setState({redirect: res.redirect});
            this.setState({messages: res.messages});
        })
    }
    acceptTransaction = (id) => {
        const result = window.confirm(`取引を受け入れますか?`)
        if(!result) return
        fetch('/api/acceptTransaction', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id: id })
        }).then(res=>res.json()).then(res=>{
            this.setState({'messages': res.messages})
            this.setState({'redirect': res.redirect})
            this.loadTransactions()
        })
      }
      declineTransaction = (id) => {
        const result = window.confirm(`取引を拒否しますか?`)
        if(!result) return
        fetch('/api/declineTransaction', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id: id })
        }).then(res=>res.json()).then(res=>{
            this.setState({'messages': res.messages})
            this.setState({'redirect': res.redirect})
            this.loadTransactions()
        })
    }

    render(){
        return (
            <div>
                <div>
                    {this.state.messages.map((message,i)=><div key={i} className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
                    {this.state.redirect && <Navigate to={this.state.redirect}/>}
                </div>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col col-12 col-sm-12 col-md-8 order-2 order-md-1">
                            <div className="card">
                                <div className="card-body">
                                    <p>残高</p>
                                    <p className="display-1">¥ {this.state.amount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4 order-1 order-md-2">
                            <div className="row">
                                <div className="col-4 text-center">
                                    <Link to='/send'>
                                        <img className="w-100" src={SendIcon}></img>
                                        <p>支払い</p>
                                    </Link>
                                </div>
                                <div className="col-4 text-center">
                                    <Link to='/request'>
                                        <img className="w-100" src={RequestIcon}></img>
                                        <p>請求</p>
                                    </Link>
                                </div>
                                <div className="col-4 text-center">
                                    <Link to='#'>
                                        <img className="w-100" src={FundIcon}></img>
                                        <p>募金</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.requested_friends.length > 0 && <h1 className="display-6">Accept Friends</h1> }
                    <div className="row">
                        {this.state.requested_friends.map((f,i)=>
                        <div key={i} className="col col-12 col-sm-12 col-md-6 col-xl-3 p-1">
                            <div className="card">
                            <div className="card-body" style={{paddingRight:"2px"}}>
                                <p className="display-6 m-0">{f.username}</p>
                                <button className="btn btn-primary btn-block mr-4" onClick={()=>this.acceptFriend(f.username)}>Accept</button>
                                <button className="btn btn-danger btn-block mx-4" onClick={()=>this.declineFriend(f.username)}>Decline</button>
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                    {this.state.accept_transactions.length > 0 && <h1 className="display-6">Accept Transaction <span>(¥ {
                        this.state.accept_transactions.map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
                    })</span></h1> }
                    {
                        this.state.accept_transactions.map((t,i)=>(
                        <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
                        <div className="card-body">
                            {
                                t.sender == this.state.username ? <p className="m-0">{this.state.username} → {t.receiver} (¥ {t.amount})</p> : <p className="m-0">{this.state.username} ← {t.sender} (¥ {t.amount})</p>
                            } 
                            <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
                            <button className="btn btn-primary btn-block mr-4" onClick={()=>this.acceptTransaction(t._id)}>Accept</button>
                            <button className="btn btn-danger btn-block mx-4" onClick={()=>this.declineTransaction(t._id)}>Decline</button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
