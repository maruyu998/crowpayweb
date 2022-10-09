import React, { Component } from "react";
import Header from '../components/Header.js';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'

export default class Transaction extends Component {
	constructor(props){
		super(props)
		this.state = {
      username: null,
			transactions: [],
      friends: [],
      selected_friends: [],
      messages: [],
      redirect: null
		}
    fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
      this.setState({friends: res.friends || []});
    })
	}
  componentDidMount(){
    this.loadTransactions()
    if(Cookies.get('selected_friends')){
      this.setState({selected_friends: Cookies.get('selected_friends').split(',')})
    }
  }
  loadTransactions = () => {
    fetch('/api/getTransactions').then(res=>res.json()).then(res=>{
      this.setState({username: res.username})
      this.setState({transactions: res.transactions || []})
      this.setState({redirect: res.redirect});
      this.setState({messages: res.messages})
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
  cancelTransaction = (id) => {
    const result = window.confirm(`取引をキャンセルしますか?`)
    if(!result) return
    fetch('/api/cancelTransaction', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: id })
    }).then(res=>res.json()).then(res=>{ 
      this.setState({'messages': res.messages}) 
      this.setState({'redirect': res.redirect}) 
      this.loadTransactions()
    })
  }
  clickedFriendFilter(friend_name){
    let selected_friends = this.state.selected_friends
    if(friend_name==null){ // all friend is clicked
      selected_friends = []
    }
    else if(this.state.selected_friends.indexOf(friend_name)>=0){
      selected_friends = selected_friends.filter(f=>f!=friend_name)
    }else{
      selected_friends.push(friend_name)
    }
    this.setState({selected_friends})
    Cookies.set('selected_friends', selected_friends.join(','))
  }
  
	render(){
		return (
			<div>
				<Header />
        <div className="container">
          <div>
            {this.state.messages.map(message=><div className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
            {this.state.redirect && <Navigate to={this.state.redirect}/>}
          </div>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              ユーザフィルタ
            </button>
            <ul className="dropdown-menu">
              <li><p className="dropdown-item" onClick={e=>this.clickedFriendFilter(null)}>All Friends{this.state.selected_friends.length==0?" ✓":""}</p></li>
              <li><hr className="dropdown-divider" /></li>
              {
                this.state.friends.map(f=><li><p className="dropdown-item" onClick={e=>this.clickedFriendFilter(f.username)}>{f.username}{this.state.selected_friends.indexOf(f.username)>=0?" ✓":""}</p></li>)
              }
            </ul>
          </div>
          <div><p>表示取引ユーザ: {this.state.selected_friends.length==0?"すべてのユーザ":this.state.selected_friends.join(",")}</p></div>
          {
            this.state.transactions
            .filter(t=>!t.accepted_at&&t.accepter==this.state.username)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0).length > 0 &&
            <h1 className="display-6">Accept Transaction <span>(¥ {
              this.state.transactions
              .filter(t=>!t.accepted_at&&t.accepter==this.state.username)
              .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
              .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
            })</span></h1>
          }
          {
            this.state.transactions
            .filter(t=>!t.accepted_at&&t.accepter==this.state.username)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
            .map((t,i)=>(
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
          {
            this.state.transactions
            .filter(t=>!t.accepted_at&&t.accepter!==this.state.username)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0).length > 0 &&
            <h1 className="display-6">Waiting Transaction <span>(¥ {
              this.state.transactions
              .filter(t=>!t.accepted_at&&t.accepter!==this.state.username)
              .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
              .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
            })</span></h1>
          }
          {
            this.state.transactions
            .filter(t=>!t.accepted_at&&t.accepter!==this.state.username)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
            .map((t,i)=>(
            <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
              <div className="card-body">
                {
                  t.sender == this.state.username ? <p className="m-0">{this.state.username} → {t.receiver} (¥ {t.amount})</p> : <p className="m-0">{this.state.username} ← {t.sender} (¥ {t.amount})</p>
                } 
                <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
                <button className="btn btn-danger btn-block" onClick={()=>this.cancelTransaction(t._id)}>Cancel</button>
              </div>
            </div>
          ))}
          <h1 className="display-6">Transaction <span>(¥ {
            this.state.transactions
            .filter(t=>!!t.accepted_at)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
            .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
          })</span></h1>
          {
            this.state.transactions
            .filter(t=>!!t.accepted_at)
            .filter(t=>this.state.selected_friends.length==0||this.state.selected_friends.indexOf(t.sender)>=0||this.state.selected_friends.indexOf(t.receiver)>=0)
            .map((t,i)=>(
            <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
              <div className="card-body">
                {
                  t.sender == this.state.username ? <p className="m-0">{this.state.username} → {t.receiver} (¥ {t.amount})</p> : <p className="m-0">{this.state.username} ← {t.sender} (¥ {t.amount})</p>
                } 
                <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
              </div>
            </div>
          ))}
          </div>
      </div>
		);
	}
}
