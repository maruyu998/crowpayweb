import React, { Component } from "react";
import Header from '../components/Header.js';
import { Link, Navigate } from 'react-router-dom';

export default class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      friends: [],
      requested_friends: [],
      payable_wallets: [],
      selected_payable_wallet_ids: [],
      messages: [],
      redirect: null,
      invitations: []
    }
  }
  componentDidMount(){
    this.loadUserInfo()
    this.loadFriends()
    this.loadPayableWallets()
  }
  loadUserInfo = () => {
    fetch('/api/getUserInfo').then(res=>res.json()).then(res=>{
      this.setState({username: res.username})
      this.setState({invitations: res.invitations})
    })
  }
  loadFriends = () => {
    fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
      this.setState({friends: res.friends || []});
      this.setState({requested_friends: res.requested_friends || []});
      this.setState({redirect: res.redirect});
    })
  }
  requestFriends = (e) => {
    const name = e.target.crowusername.value;
    const result = window.confirm(`${name}さんへのフレンド申請を送信しますか?`)
    if(!result) return
    fetch('/api/requestAddFriend', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendname: name })
    }).then(res=>res.json()).then(res=>{
      this.setState({messages: res.messages})
      this.setState({redirect: res.redirect})
      this.loadFriends()
    })
  }
  acceptFriend = (friendname) => {
    const result = window.confirm(`${friendname}さんからのフレンド申請を受け入れますか?`)
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
    const result = window.confirm(`${friendname}さんからのフレンド申請を却下しますか?`)
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
  cancelFriend = (friendname) => {
    const result = window.confirm(`${friendname}さんへのフレンド申請をキャンセルしますか?`)
    if(!result) return
    fetch('/api/cancelFriend', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendname })
    }).then(res=>res.json()).then(res=>{
      this.setState({messages: res.messages})
      this.setState({redirect: res.redirect})
      this.loadFriends()
    })
  }
  loadPayableWallets = () => {
    fetch('/api/getPayableWallets').then(res=>res.json()).then(res=>{
      this.setState({selected_payable_wallet_ids: res.selected_payable_wallet_ids || []});
      this.setState({payable_wallets: res.payable_wallets || []});
      this.setState({redirect: res.redirect});
    })
  }
  selectPayableWallet = (wallet_id) => {
    let selected_payable_wallet_ids = this.state.selected_payable_wallet_ids
    if(selected_payable_wallet_ids.filter(wid=>wid==wallet_id).length > 0){
      selected_payable_wallet_ids = selected_payable_wallet_ids.filter(wid=>wid!=wallet_id)
    }else{
      selected_payable_wallet_ids.push(wallet_id)
    }
    this.setState({selected_payable_wallet_ids})
    fetch('/api/setPayableWallets', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_payable_wallet_ids })
    })
  }
  issueInvitationCode = (e) => {
    fetch('/api/issueInvitationCode').then(res=>res.json()).then(res=>{
      this.setState({messages: res.messages})
      this.setState({redirect: res.redirect})
      this.loadUserInfo()
    })
  }
  remoeInvitationCode = (invitationid) => {
    fetch('/api/removeInvitationCode', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationid })
    }).then(res=>res.json()).then(res=>{
      this.setState({messages: res.messages})
      this.setState({redirect: res.redirect})
      this.loadUserInfo()
    })
  }


  render(){
    return (
      <div>
        <Header />
        <div className="container">
          <div>
            {this.state.messages.map((message,i)=><div key={i} className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
            {this.state.redirect && <Navigate to={this.state.redirect}/>}
          </div>
          <Link className="btn btn-primary" to="/signout">Sign out</Link>
          <hr />
          <div className="row">
            <div className="col col-12 col-sm-8 order-2 order-sm-1">
              {this.state.requested_friends.length > 0 && <h1 className="display-6">Accept Friends</h1>}
              <div className="row">
                {this.state.requested_friends.map((f,i)=>
                  <div key={i} className="col col-12 col-sm-12 col-md-6 col-xl-3 p-1">
                    <div className="card">
                      <div className="card-body" style={{paddingRight:"2px"}}>
                        <p className="display-6 m-0">{f.username}</p>
                        {f.invitedby && <p className="display-7 m-0">invited by: {f.invitedby}</p>}
                        <button className="btn btn-primary btn-block mr-4" onClick={()=>this.acceptFriend(f.username)}>Accept</button>
                        <button className="btn btn-danger btn-block mx-4" onClick={()=>this.declineFriend(f.username)}>Decline</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {this.state.friends.filter(f=>!f.accepted).length > 0 && <h1 className="display-6">Pending Friends</h1> }
              <div className="row">
                {this.state.friends.filter(f=>!f.accepted).map((f,i)=>
                  <div key={i} className="col col-12 col-sm-12 col-md-6 col-xl-3 p-1">
                    <div className="card">
                      <div className="card-body" style={{paddingRight:"2px"}}>
                        <p className="display-6 m-0">{f.username}</p>
                        <button className="btn btn-danger btn-block" onClick={()=>this.cancelFriend(f.username)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="display-6">Friends</h1>
              <div className="row">
                {this.state.friends.filter(f=>f.accepted).map((f,i)=>
                  <div key={i} className="col col-12 col-sm-12 col-md-6 col-xl-3 p-1">
                    <div className="card">
                      <div className="card-body" style={{paddingRight:"2px"}}>
                        <p className="display-6 m-0">{f.username}</p>
                        <p className="display-7 m-0">¥ {f.amount} </p>
                        {f.invitedby && <p className="display-7 m-0">invited by: {f.invitedby}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col col-12 col-sm-4 order-1 order-sm-2">
              <h1 className="display-6">Invite New Friend</h1>
              <p>有効期限30分の招待コード(コードは使用後失効)</p>
              {this.state.invitations.map((invitation,i)=>(
                <div className="card" key={i}>
                  <div className="card-body">
                    <p className="py-0 display-6">{invitation.code}</p>
                    <p className="py-0" style={{fontSize:"6px"}}>有効期限: {new Date(invitation.expirationdate).toLocaleString()}</p>
                    <button type="submit" className="btn btn-sm btn-danger btn-block" onClick={()=>this.remoeInvitationCode(invitation._id)}>remove</button>
                  </div>
                </div>
              ))}
              <form className="input-group" onSubmit={this.issueInvitationCode}>
                <button type="submit" className="btn btn-lg btn-primary btn-block w-100">issue invitationcode</button>
              </form>
              <hr />
              <h1 className="display-6">Add Friends</h1>
              <form className="input-group" onSubmit={this.requestFriends}>
                <input type="text" id="crowusername" className="form-control" placeholder="Friend username" required></input>
                <button type="submit" className="btn btn-lg btn-primary btn-block w-100">send request</button>
              </form>
              <hr />
              <h1 className="display-6">Add Payable Wallet</h1>
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Register Payable Wallets
                </button>
                <ul className="dropdown-menu">
                  {
                    this.state.payable_wallets.map(w=><li><p className="dropdown-item" onClick={e=>this.selectPayableWallet(w._id)}>{w.name}{this.state.selected_payable_wallet_ids.indexOf(w._id)>=0?" ✓":""}</p></li>)
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
