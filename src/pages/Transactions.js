import { Component } from "react";
import Header from '../components/Header';
import { Navigate } from 'react-router-dom';

export default class Transaction extends Component {
	constructor(props){
		super(props)
		this.state = {
			transactions: [],
      messages: [],
      redirect: null
		}
	}
  componentDidMount(){
    fetch('/api/getTransactions').then(res=>res.json()).then(res=>{
      console.log(res)
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
          <h1 className="display-6">Accept Transaction</h1>
          {this.state.transactions.filter(t=>!t.accepted_at&&t.accepter===this.state.username).map((transaction,i)=>(
            <div key={i} className="card">
              <div className="card-body">
                <p>{transaction.sender} → {transaction.reciever} (¥{transaction.amount})</p>
                <p>登録日時 {transaction.issued_at}: {transaction.content}</p>
                <button className="btn btn-primary btn-block" onClick={()=>this.acceptTransaction(transaction._id)}>Accept</button>
                <button className="btn btn-danger btn-block" onClick={()=>this.declineTransaction(transaction._id)}>Decline</button>
              </div>
            </div>
          ))}
          <h1 className="display-6">Waiting Transaction</h1>
          {this.state.transactions.filter(t=>!t.accepted_at&&t.accepter!==this.state.username).map((transaction,i)=>(
            <div key={i} className="card">
              <div className="card-body">
                <p>{transaction.sender} → {transaction.reciever} ({transaction.amount}円)</p>
                <p>登録日時 {transaction.issued_at}: {transaction.content}</p>
              </div>
            </div>
          ))}
          <h1 className="display-6">Transaction</h1>
          {this.state.transactions.filter(t=>!!t.accepted_at).map((transaction,i)=>(
            <div key={i} className="card">
              <div className="card-body">
                <p>{transaction.sender} → {transaction.reciever} ({transaction.amount}円)</p>
                <p>登録日時 {transaction.issued_at}: {transaction.content}</p>
              </div>
            </div>
          ))}
          </div>
      </div>
		);
	}
}