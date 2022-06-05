import { Component } from "react";
import { Navigate } from 'react-router-dom';
import Header from '../components/Header.js';
import RightArrowIcon from '../images/caret-right-fill.svg'
import BottomArrowIcon from '../images/caret-down-fill.svg'

export default class Send extends Component {
    constructor(props){
        super(props)
        this.state = {
          username: null,
          friends: [],
          messages: [],
          redirect: null,
          keep_receivers: []
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
      send = (e) => {
        const content = e.target.content.value;
        for(let data of this.state.keep_receivers){
          fetch('/api/addTransaction', {
            method: "POST",
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver: data.friend, amount: data.amount, content })
          }).then(res=>res.json()).then(res=>{ 
            this.setState({messages: [...this.state.messages, ...res.messages]}) 
            this.setState({redirect: res.redirect}) 
          })
        }
      }
      addRow = () => {
        this.setState({ keep_receivers: [...this.state.keep_receivers, {id:new Date().getTime(), friendname:'', amount:0}] }) 
      }
      deleteRow = (i) => {
        const keep_receivers = this.state.keep_receivers;
        keep_receivers.splice(i,1);
        this.setState({ keep_receivers });
        if(this.state.keep_receivers.length == 0) this.addRow();
      }
      updatereceiverFriend = (value, i) => {
        const keep_receivers = this.state.keep_receivers;
        keep_receivers[i].friend = value;
        this.setState({keep_receivers})
      }
      updatereceiverAmount = (value, i) => {
        const keep_receivers = this.state.keep_receivers;
        keep_receivers[i].amount = Number(value);
        this.setState({keep_receivers})
      }
      splitAmount = () => {
        const keep_receivers = this.state.keep_receivers;
        const sum = Number(document.getElementById('amount_total').value);
        const count = keep_receivers.length;
        const average = Math.floor(sum / count);
        for(let i=0; i<count; i++) {
          const value = (i!=0) ? average : sum - (average * (count - 1));
          keep_receivers[i].amount = value;
          document.getElementById(`amount_${i}`).value = value;
        }
        this.setState({keep_receivers});
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
              <form className="row" onSubmit={this.send}>
                <div className="col col-sm-12 col-md-3 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Sender</h1>
                    <p className="w-100 display-6">{this.state.username}</p>
                    <div className="input-group mb-1">
                      <input className="form-control" type="text" id="content" placeholder="支払内容" required/>
                    </div>
                  </div>
                </div>
                <div className="col d-none d-md-block col-md-1 my-auto">
                  <img src={RightArrowIcon} />
                </div>
                <div className="col col-12 col-sm-12 d-md-none my-auto">
                  <img src={BottomArrowIcon} />
                </div>
                <div className="col col-sm-12 col-md-8 border rounded mx-auto mt-2">
                  <div className="text-center mb-4">
                    <h1 className="h3 mb-3 font-weight-normal">Receiver</h1>
                  </div>
                  {
                    this.state.keep_receivers.map((r,i)=>(
                      <div key={r.id} className="input-group mb-1">
                        <select className="form-select" onChange={e=>this.updatereceiverFriend(e.target.value,i)} required>
                          <option hidden value="">Select Friend</option>
                          {
                            this.getFriendCands().map((f,i)=><option key={i} value={f}>{f}</option>)
                          }
                        </select>
                        {/* <input className="form-control" type="text" autocomplete="on" list="friend_list" placeholder="friendname"  required/> */}
                        <input id={`amount_${i}`} className="form-control" type="number" placeholder="支払金額" min="1" step="1" onChange={e=>this.updatereceiverAmount(e.target.value,i)} required/>
                        <button type="button" className="btn btn-outline-secondary" onClick={()=>this.deleteRow(i)}>x</button>
                      </div>
                    ))
                  }
                  <p>合計支払い金額: € {this.state.keep_receivers.map(r=>r.amount).reduce((a,b)=>a+b,0)}</p>
                  <button type="button" className="btn btn-primary btn-block mb-2" onClick={this.addRow}>Add</button>
                  <div className="input-group mb-2">
                    <input id="amount_total" className="form-control" type="number" placeholder="合計支払い金額" min="1" step="1" />
                    <button type="button" className="btn btn-primary btn-block" onClick={this.splitAmount}>割り勘にする</button>
                  </div>
                </div>
                <div className="col-12 p-0 d-grid">
                  <button type="submit" className="btn btn-lg btn-primary btn-block mt-2">支払い申請する</button>
                </div>
              </form>
            </div>
          </div>
        );
      }
    }
