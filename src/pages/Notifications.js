import React, { Component } from "react";
import Header from '../components/Header.js';
import { Navigate } from 'react-router-dom';

export default class Notification extends Component {
	constructor(props){
		super(props)
		this.state = {
      notifications: [],
      messages: [],
      redirect: null
    }
	}
  componentDidMount(){
    this.loadNotifications()
  }
  loadNotifications = () => {
    fetch('/api/getNotifications').then(res=>res.json()).then(res=>{
      this.setState({notifications: res.notifications || []})
      this.setState({redirect: res.redirect});
      this.setState({messages: res.messages})
    })
  }
  removeNotification(notification){
    const result = window.confirm(`通知「${notification.title}」を削除しますか?`)
    if(!result) return
    const notification_id = notification._id;
    fetch('/api/removeNotification', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_id })
    }).then(res=>res.json()).then(res=>{
      this.setState({redirect: res.redirect});
      this.setState({messages: res.messages})
      this.loadNotifications()
    })
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
          <h1 className="display-6">Notifications</h1>
          {this.state.notifications.map((n,i)=>(
            <div key={i} className="card mb-1">
              <div className="card-body">
                <p className="m-0">{n.title}</p>
                <p className="m-0" style={{fontSize:"0.5em"}}>{(new Date(n.created_at)).toLocaleString()}</p>
                <p className="m-0" style={{fontSize:"0.5em"}}>{n.message}</p>
                <button type="button" className="btn btn-sm btn-info" onClick={()=>this.removeNotification(n)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
		);
	}
}
