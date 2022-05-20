import { Component, useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import LeftArrowIcon from '../images/caret-left-fill.svg'
import BottomArrowIcon from '../images/caret-down-fill.svg'

export default class Request extends Component {
    constructor(props){
        super(props)
        this.state = {
          username: null,
          friends: [],
          filtered_friends: [],
          messages: [],
          redirect: null,
          sender_rows: [],
          amount: 0,
          sender: null,
          transactionContent: "",
        }
      }
      componentDidMount(){
        this.addRow()
        fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
          console.log(res)
          this.setState({username: res.username});
          this.setState({friends: (res.friends || []).filter(f=>f.accepted).map(f=>f.username)});
          this.setState({filtered_friends: this.state.friends});
          this.setState({redirect: res.redirect});
        })
      }      
      updateFriends = (e) => {
        const query = e.target.value;
        if(!query) this.setState({filtered_friends: this.state.friends});
        else this.setState({filtered_friends: (this.state.friends || []).filter(f=>RegExp(query, 'g').test(f))});
        console.log(this.state.filtered_friends)
        this.setState({sender: query})
      }
      updateAmount = (e) => {
        const value = e.target.value
        this.setState({amount: Number(value)})
      }
      updateTransactionContent = (e) => {
        const value = e.target.value
        this.setState({transactionContent: value})
      }
      request = () => {
        fetch('/api/addTransaction', {
          method: "POST",
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: this.state.sender,
            amount: this.state.amount,
            content: this.state.transactionContent
          })
        }).then(res=>res.json()).then(res=>{ 
          this.setState({'messages': res.messages}) 
          this.setState({'redirect': res.redirect}) 
        })
      }
      addRow = () => {
        const sender_rows = [...this.state.sender_rows.concat(), {friendname:'', amount:0}]
        if(sender_rows.length > 1) return
        this.setState({ sender_rows: sender_rows }) 
      }
      deleteRow = (_i) => {
        return;
        const sender_rows = this.state.sender_rows
        this.setState({sender_rows: sender_rows.filter((r,i)=>i!=_i)})
      }
    
      render(){
        return (
          <div>
            <Header />
            <div className="container text-center mt-5 px-5 mx-auto">
              <div>
                {this.state.messages.map(message=><div className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
                {this.state.redirect && <Navigate to={this.state.redirect}/>}
              </div>
              <div className="row">
                <div className="col col-sm-12 col-md-3 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Reciever</h1>
                    <p className="w-100 display-6">{this.state.username}</p>
                    <input className="w-100" type="number" placeholder="請求金額" onChange={this.updateAmount} required/>
                    <input className="w-100" type="text" placeholder="請求内容" onChange={this.updateTransactionContent} required/>
                  </div>
                </div>
                <div className="col col-sm-12 col-md-1 my-auto">
                  <img src={LeftArrowIcon} />
                </div>
                <div className="col col-sm-12 col-md-8 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Sender</h1>
                  </div>
                  {
                      console.log(this.state.filtered_friends)
                  }
                  {
                    this.state.sender_rows.map((r,i)=>(
                      <div key={i}>
                        <input type="text" autocomplete="on" list="friend_list" placeholder="friendname" onChange={this.updateFriends} required/>
                        <input type="number" placeholder="amount" value={this.state.amount / this.state.sender_rows.length}/>
                        <button className="btn" onClick={()=>this.deleteRow(i)}>x</button>
                      </div>
                    ))
                  }
                  <button className="btn btn-primary btn-block" onClick={this.addRow}>Add</button>
                  <datalist id="friend_list">
                    {this.state.filtered_friends.map((f,i)=><option key={i} value={f}/>)}
                  </datalist>
                </div>
              </div>
              <button className="btn btn-lg btn-primary btn-block w-100 mt-2" onClick={this.request}>支払う</button>
            </div>
          </div>
        );
      }
    }