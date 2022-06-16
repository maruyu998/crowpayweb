import { Component } from "react";
import { Link, Navigate } from 'react-router-dom'
import LogoImage from "../images/logo.png";
import Header from '../components/Header.js';

export default class Signin extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      redirect: null
    }
  }
  componentDidMount(){
    fetch('/api/getUsername').then(res=>res.json()).then(res=>{
      if(!!res.username){
        this.setState({redirect: '/'})
      }
    })
  }

  signup = (e) => {
    const username = e.target.username.value;
    const password = e.target.password.value;
    fetch('/api/signup', {
      method: "POST",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(res=>res.json()).then(res=>{ 
      this.setState({messages: res.messages}) 
      this.setState({redirect: res.redirect}) 
    })
  }

  render(){
    return (
      <div>
        <Header />
        <div className="container text-center">
          <div className="border rounded mt-5 px-5 py-5 mx-auto col col-sm-11 col-md-8 col-lg-6 col-xl-5">
            <div>
              {this.state.messages.map(message=><div className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
              {this.state.redirect && <Navigate to={this.state.redirect}/>}
            </div>
            <form className="form-signin w-75 mx-auto" onSubmit={this.signup}>
              <div className="text-center mb-4">
                <Link to="/"><img className="mb-4" src={LogoImage} alt="" width="72" height="72" /></Link>
                <h1 className="h3 mb-3 font-weight-normal">Crow Pay Web</h1>
                <p>Crow Pay Web は Crow Pay の簡易 web 版です．</p>
              </div>

              <div className="form-label-group my-2">
                <input type="username" id="username" className="form-control" placeholder="Username" required autoFocus />
              </div>
              <div className="form-label-group my-2">
                <input type="password" id="password" className="form-control" placeholder="Password" required />
              </div>
              <button type="submit" className="btn btn-lg btn-success btn-block w-100">Sign up</button>
              <hr className="my-12" />
              <p className="mx-auto">or</p>
              <Link to='/signin' style={{textDecoration:'none'}}><p className="btn btn-lg btn-outline-dark btn-block w-100">Sign in</p></Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}