import { Component } from "react";
import { Navigate } from 'react-router-dom'

export default class Signout extends Component {
    constructor(props){
        super(props)
        this.state = { done: false }
    }
    componentDidMount(){
        fetch('/api/signout').then(res=>{this.setState({done: true})})
    }

    render(){
        return (
            <div>
                {this.state.done && <Navigate to="/"/>}
            </div>
        )
    }
}