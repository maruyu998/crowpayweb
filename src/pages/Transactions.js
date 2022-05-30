import { Component } from "react";
import Header from '../components/Header.js';
import { Navigate } from 'react-router-dom';

export default class Transaction extends Component {
	constructor(props){
		super(props)
		this.state = {
      username: null,
			transactions: [],
      messages: [],
      redirect: null
		}
	}

  componentDidMount(){
    this.loadTransactions()
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
				<Header />
        <div className="container">
          <div>
            {this.state.messages.map(message=><div className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
            {this.state.redirect && <Navigate to={this.state.redirect}/>}
          </div>
          <h1 className="display-6">Accept Transaction <span>(¥ {
            this.state.transactions.filter(t=>!t.accepted_at&&t.accepter==this.state.username)
            .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
          })</span></h1>
          {this.state.transactions.filter(t=>!t.accepted_at&&t.accepter==this.state.username).map((t,i)=>(
            <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
              <div className="card-body">
                <p className="m-0">{t.sender} → {t.receiver} (¥ {t.amount})</p>
                <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
                <button className="btn btn-primary btn-block" onClick={()=>this.acceptTransaction(t._id)}>Accept</button>
                <button className="btn btn-danger btn-block" onClick={()=>this.declineTransaction(t._id)}>Decline</button>
              </div>
            </div>
          ))}
          <h1 className="display-6">Waiting Transaction <span>(¥ {
            this.state.transactions.filter(t=>!t.accepted_at&&t.accepter!==this.state.username)
            .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
          })</span></h1>
          {this.state.transactions.filter(t=>!t.accepted_at&&t.accepter!==this.state.username).map((t,i)=>(
            <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
              <div className="card-body">
                <p className="m-0">{t.sender} → {t.receiver} (¥ {t.amount})</p>
                <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
              </div>
            </div>
          ))}
          <h1 className="display-6">Transaction <span>(¥ {
            this.state.transactions.filter(t=>!!t.accepted_at)
            .map(t=>Number(t.amount) * (t.receiver==this.state.username ? 1 : -1)).reduce((a,b)=>a+b,0)
          })</span></h1>
          {this.state.transactions.filter(t=>!!t.accepted_at).map((t,i)=>(
            <div key={i} className={"card " + (t.receiver==this.state.username ? "border-info" : "border-danger") + " mb-1"}>
              <div className="card-body">
                <p className="m-0">{t.sender} → {t.receiver} (¥ {t.amount})</p>
                <p className="m-0">{(new Date(t.issued_at)).toLocaleString()} &lt; {t.content}</p>
              </div>
            </div>
          ))}
          </div>
      </div>
		);
	}
}
