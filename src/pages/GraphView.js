import React, { Component } from "react";
import Header from '../components/Header.js';
import { ForceGraph2D } from 'react-force-graph';

export default class Graph extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      all_users_info: [],
      absmax: 1,
      all_friends_info: [],
      messages: [],
      redirect: null
    }
  }
  componentDidMount(){
    this.loadAllUsers()
  }
  loadAllUsers = () => {
    fetch('/api/getAllUsers').then(res=>res.json()).then(res=>{
      this.setState({messages: res.messages});
      this.setState({username: res.username});
      this.setState({all_users_info: res.all_users_info});
      this.setState({all_friends_info: res.all_friends_info});
      let absmax=null;
      for(let user of res.all_users_info){
        if(absmax == null || absmax < Math.abs(user.amount)) absmax = user.amount
      }
      this.setState({ absmax })
    })
  }
  render(){
    return (
      <div>
        <Header />
        <ForceGraph2D
          width={window.innerWidth}
          height={window.innerHeight-100}
          graphData={{
            nodes: this.state.all_users_info.map(({username,amount})=>({
              id:username, 
              name: `${username} (¥${amount})`,
              amount: amount,
              val: (10+Math.abs(amount))/50000*20,
              color: `hsl(${100+amount/100},100%,${50-amount/700}%)`
            })),
            links: this.state.all_friends_info.map(({username,friendname})=>({
              source:username,
              target:friendname
            }))
          }}
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const fontsize = 14
            ctx.font = `${fontsize/globalScale}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.amount > 0 ? "red" : "black";
            ctx.fillText(node.name, node.x, node.y);
          }}
        />
      </div>
    );
  }
}
