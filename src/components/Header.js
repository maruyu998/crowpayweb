import { Component } from 'react';
import { Link } from 'react-router-dom';
import LogoImage from "../images/logo.png";
import PersonImage from '../images/person-circle.svg';

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
      <nav className="navbar navbar-expand bg-light mb-3">
        <div className="container">
          <div className="navbar-brand" href="#">
            <Link className="navbar-brand" to="/">
              <img src={LogoImage} alt="" width="30" height="24" className="d-inline-block align-text-top" />
              CrowPayWeb
            </Link>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className='nav-link' to='/transactions'>Transactions</Link>
            </div>
          </div>
          <span className="navbar-text text-center">
            { !this.state.username && <Link className='nav-link' to='/signin'>Sign in</Link> }
            { !!this.state.username && <Link className='nav-link' to='/user'><img src={PersonImage} /><span>{this.state.username}</span></Link> }
          </span>
        </div>
      </nav>
    );  
  }
}