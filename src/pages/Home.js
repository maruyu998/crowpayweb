import { Component } from "react";
import { Navigate, Link } from 'react-router-dom';
import RequestIcon from '../images/request.svg';
import SendIcon from '../images/send.svg';
import OtherIcon from '../images/three-dots.svg';
import Header from '../components/Header';

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            is_signed_in: false,
            amount: null,
            messages: [],
            redirect: null
        }
    }
    componentDidMount(){
        fetch('/api/getUserSummary').then(res=>res.json()).then(res=>{
            this.setState({messages: res.messages})
            this.setState({redirect: res.redirect})
            this.setState({amount: res.amount})
        })
    }

    render(){
        return (
            <div>
                <div>
                    {this.state.messages.map((message,i)=><div key={i} className={'alert alert-'+message.type} role="alert">{message.text}</div>)}
                    {this.state.redirect && <Navigate to={this.state.redirect}/>}
                </div>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col col-12 col-sm-12 col-lg-8">
                            <div className="card">
                                <div className="card-body">
                                    <p>残高</p>
                                    <p className="display-1">¥ {this.state.amount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-lg-4">
                            <div className="row">
                                <div className="col-4 text-center">
                                    <Link to='/send'>
                                        <img src={SendIcon}></img>
                                        <p>支払い</p>
                                    </Link>
                                </div>
                                <div className="col-4 text-center">
                                    <Link to='/request'>
                                        <img src={RequestIcon}></img>
                                        <p>請求</p>
                                    </Link>
                                </div>
                                <div className="col-4 text-center">
                                    <Link to='#'>
                                        <img src={OtherIcon}></img>
                                        <p>その他</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}