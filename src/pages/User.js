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
      messages: [],
      redirect: null
    }
  }
  componentDidMount(){
    this.loadFriends()
  }

  loadFriends = () => {
    fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
      this.setState({username: res.username});
      this.setState({friends: res.friends || []});
      this.setState({requested_friends: res.requested_friends || []});
      this.setState({redirect: res.redirect});
    })
  }

  requestFriends = (e) => {
    const result = window.confirm(`${friendname}さんへのフレンド申請を送信しますか?`)
    if(!result) return
    const name = e.target.crowusername.value;
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
              <h1 className="display-6">Accept Friends</h1>
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
              <h1 className="display-6">Pending Friends</h1>
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
                        <p className="display-7 m-0">friends' sum: ¥ {f.friendsamount}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col col-12 col-sm-4 order-1 order-sm-2">
              <h1 className="display-6">Add Friends</h1>
              <form className="input-group" onSubmit={this.requestFriends}>
                <input type="text" id="crowusername" className="form-control" placeholder="Friend username" required></input>
                <button type="submit" className="btn btn-lg btn-primary btn-block w-100">send request</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
