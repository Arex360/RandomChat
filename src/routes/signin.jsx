import React, { PureComponent } from 'react'
import {Link} from 'react-router-dom'
import wall from './assets/wallpaper.png'
import profile from './assets/picture.jpg'
import Firebase from 'firebase'
import config from './config'
import './style.css'
import Record from './Record'

class Signin extends PureComponent {
    constructor(props) {
        super(props)
        if(!Firebase.apps.length){
            Firebase.initializeApp(config)
        }
        this.state = {
            name: 'Register',
            password: '',
            lat: null,
            long: null,
            ipAddress: null,
            Avatar: profile,
            msg: '',
            infoName: '',
            message: '',
            width: window.innerWidth,
            logged: false
        }
    }
    pHandler = event =>{
        this.setState({
            password: event.target.value
        })
    }
    nHandler = event =>{
        this.setState({
            name: event.target.value,
        })
    }
    Join = ()=>{
        var n = this.state.name 
        var p = this.state.password
        var validateName = Firebase.database().ref().child("Additional/"+n.toLowerCase()+"/name")
        var validatePass = Firebase.database().ref().child("Additional/"+n.toLowerCase()+"/password")
        var validateAvatar = Firebase.database().ref().child("Additional/"+n.toLowerCase()+"/Av")
        validateName.on('value',snap=>{
             if(n == snap.val()){
                 validatePass.on('value',P=>{
                     if(p == P.val()){
                         this.setState({
                             msg: 'Successfully Logged in'
                         })
                         validateAvatar.on('value',I=>{
                             this.setState({
                                 Avatar: I.val()
                             })
                            this.setState({
                                logged: true
                            })
                         })
                     }else{
                         alert('Password is not correct')
                     }
                 })
             }else{
                 alert("UserName not found")
             }        
        })      
    }
    render() {
        if(!this.state.logged){
        return (
            <div className="main">
                <p>{this.state.width}</p>
                <div className="image">
                    <img src={wall} alt="" className="i1"/>
                </div>
                <div className="form">
                    <div className="avatar">
                        <img src={this.state.Avatar} alt="" className="pic"/>
                    </div>
                    <input onChange={this.nHandler} type="text"  placeholder="Enter your name" className="name"/>
                    <br/>
                    <input onChange={this.pHandler} type="password" placeholder="Enter the password" className="pin"/>
                    <div className="label">
                         <p className="result">{this.state.msg}</p>
                    </div>
                    <button onClick={this.Join} className="btn">Login</button>
                    <br>
                    </br>
                    <Link to="/signup">
                    <button  className="btn">Register</button>
                    </Link>
                </div>
            </div>
        )
        }
        else if (this.state.logged){
            return (<div>Logged in</div>)
        }
    }
}

export default Signin