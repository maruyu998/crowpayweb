import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LogoImage from "../images/logo.png";
import PersonImage from '../images/person-circle.svg';
import NotificationImage from '../images/notification.svg';
import TransactionsImage from '../images/transactions.svg';
import GraphImage from '../images/bezier.svg';

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = { username: null }
  }
  componentDidMount(){
    fetch('/api/getUsername').then(res=>res.json()).then(res=>{
      this.setState({username: res.username})
    })
  }
  render() {
    return (
      <nav className="navbar navbar-expand bg-light mb-3" style={{height:"4em"}}>
        <div className="container">
          <div className="navbar-brand" href="#">
            <div className="d-none d-md-block">
              <Link className="navbar-brand" to="/">
                <img src={LogoImage} alt="" width="30" height="24" className="d-inline-block align-text-top" />
                CrowPayWeb
              </Link>
            </div>
            <div className="d-sm-block d-md-none">
              <Link className="navbar-brand" to="/">
                <img src={LogoImage} alt="" width="30" height="24" className="d-inline-block align-text-top" />
              </Link>
            </div>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {
              !!this.state.username && 
                <div className="navbar-nav">
                  <Link className='nav-link text-center' to='/transactions'>
                    <img src={TransactionsImage} /><p className="m-0" style={{fontSize:"0.6em"}}>Transactions</p>
                  </Link>
                </div>
            }
          </div>
          {
            !!this.state.username && <Link className='nav-link text-center' to="/graphview"><img src={GraphImage} /><p className="m-0" style={{fontSize:"0.6em"}}>GraphView</p></Link>
          }
          {
            !!this.state.username && <Link className='nav-link text-center' to="/notifications"><img src={NotificationImage} /><p className="m-0" style={{fontSize:"0.6em"}}>Notifications</p></Link>
          }
          <span className="navbar-text text-center">
            { !this.state.username && <Link className='nav-link' to='/signin'>Sign in</Link> }
            { !!this.state.username && <Link className='nav-link text-center' to='/user'><img src={PersonImage} /><p className="m-0" style={{fontSize:"0.6em"}}>{this.state.username}</p></Link> }
          </span>
        </div>
      </nav>
    );  
  }
}