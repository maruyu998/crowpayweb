import { Component } from "react";
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header.js';
import LeftArrowIcon from '../images/caret-left-fill.svg'
import UpArrowIcon from '../images/caret-up-fill.svg'

export default class Request extends Component {
    constructor(props){
        super(props)
        this.state = {
          username: null,
          friends: [],
          messages: [],
          redirect: null,
          keep_senders: [],
        }
      }
      componentDidMount(){
        this.addRow()
        fetch('/api/getUserFriends').then(res=>res.json()).then(res=>{
          this.setState({username: res.username});
          this.setState({friends: (res.friends || []).filter(f=>f.accepted).map(f=>f.username)});
          this.setState({redirect: res.redirect});
        })
      }
      getFriendCands = () => {
        return this.state.friends
      }
      request = (e) => {
        const content = e.target.content.value;
        for(let data of this.state.keep_senders){
          fetch('/api/addTransaction', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: data.friend, amount: data.amount, content })
          }).then(res=>res.json()).then(res=>{ 
            this.setState({messages: [...this.state.messages, ...res.messages]}) 
            this.setState({redirect: res.redirect}) 
          })
        }
      }
      addRow = () => {
        this.setState({ keep_senders: [...this.state.keep_senders, {id:new Date().getTime(), friendname:'', amount:0}] }) 
      }
      deleteRow = (i) => {
        const keep_senders = this.state.keep_senders;
        keep_senders.splice(i,1);
        this.setState({ keep_senders });
        if(this.state.keep_senders.length == 0) this.addRow();
      }
      updateSenderFriend = (value, i) => {
        const keep_senders = this.state.keep_senders;
        keep_senders[i].friend = value;
        this.setState({keep_senders})
      }
      updateSenderAmount = (value, i) => {
        const keep_senders = this.state.keep_senders;
        keep_senders[i].amount = Number(value);
        this.setState({keep_senders})
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
              <form className="row" onSubmit={this.request}>
                <div className="col col-sm-12 col-md-3 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Receiver</h1>
                    <p className="w-100 display-6">{this.state.username}</p>
                    <div class="input-group mb-1">
                      <input className="form-control" type="text" id="content" placeholder="請求内容" required/>
                    </div>
                  </div>
                </div>
                <div className="col d-none d-md-block col-md-1 my-auto">
                  <img src={LeftArrowIcon} />
                </div>
                <div className="col col-12 col-sm-12 d-md-none my-auto">
                  <img src={UpArrowIcon} />
                </div>
                <div className="col col-sm-12 col-md-8 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Sender</h1>
                  </div>
                  {
                    this.state.keep_senders.map((r,i)=>(
                      <div key={r.id} class="input-group mb-1">
                        <select className="form-select" onChange={e=>this.updateSenderFriend(e.target.value,i)} required>
                          <option hidden value="">Select Friend</option>
                          {
                            this.getFriendCands().map((f,i)=><option key={i} value={f}>{f}</option>)
                          }
                        </select>
                        <input className="form-control" type="number" placeholder="請求金額" min="1" step="1" onChange={e=>this.updateSenderAmount(e.target.value,i)} required/>
                        <button type="button" className="btn btn-outline-secondary" onClick={()=>this.deleteRow(i)}>x</button>
                      </div>
                    ))
                  }
                  <p>合計請求金額: ¥ {this.state.keep_senders.map(r=>r.amount).reduce((a,b)=>a+b,0)}</p>
                  <button type="button" className="btn btn-primary btn-block mb-2" onClick={this.addRow}>Add</button>
                </div>
                <div className="col-12 p-0 d-grid">
                  <button type="submit" className="btn btn-lg btn-primary btn-block mt-2">請求申請する</button>
                </div>
              </form>
            </div>
          </div>
        );
      }
    }