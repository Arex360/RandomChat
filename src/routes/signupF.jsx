import React, { Component } from 'react'
import fetch from 'node-fetch'
import './style.css'
import profile from './assets/picture.jpg'
import Firebase from 'firebase'
import config from './config'
import wall from './assets/wallpaper.png'
import { register } from '../serviceWorker'

class Signup extends Component {
    lat = null
    long = 2
    Image = ''
    List = []
    constructor(){
        super()
        this.getLocation()
        if(!Firebase.apps.length){
        Firebase.initializeApp(config)
        }
        this.state={
            name: 'Register',
            password: '',
            lat: null,
            long: null,
            ipAddress: null,
            Avatar: profile,
            msg: '',
            infoName: '',
            message: '',
            width: window.innerWidth
        }
        this.check()
        window.addEventListener('resize',()=>{
            var x = window.innerWidth
            var y = window.innerHeight
            this.setState({
                width: window.innerWidth
            })
        })
    }
    mHandler = event =>{
        this.setState({
            message: event.target.value
        })
    }
    getLocation(){
        navigator.geolocation.getCurrentPosition(pos =>{
            this.lat = pos.coords.latitude
            this.long = pos.coords.longitude
            this.setState({
                lat: this.lat,
                long: this.long
            })    
          })
    }
    nHandler = event =>{
        this.setState({
            name: event.target.value,
        })
    }
    getData(){
        var data = Firebase.database().ref().child('Accounts/account')
        data.on('value',snap=>{
           snap.forEach(name=>{
               console.log(name.val())
           })
        })
    }
    onChangeHandler = event=>{
        console.log(event.target.files[0])
        for(let i=0;i<event.target.files.length;i++){
            let imgFile = event.target.files[i]
            let Ref = Firebase.storage().ref("images"+imgFile.name)
            let task = Ref.put(imgFile)
            let imgURL = ''
            console.log("being uploaded")
            task.on('state_changed', p => {
                let progress = p.bytesTransferred / p.totalBytes * 100
                this.setState({
                    msg: 'Picture being uploaded.. (' + Math.floor(progress).toString() +'%)'
                })
                if(progress == 100){
                    this.setState({
                        msg: 'Picture is uploaded'
                    })
                    console.log('uploaded succesfully')
                    Firebase.storage().ref().child("images"+imgFile.name).getDownloadURL().then(function(url) {
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = function(event) {
                          var blob = xhr.response;
                        };
                        xhr.open('GET', url);
                        xhr.send();
                        imgURL = url
                      })
                      .then(()=>{
                          this.setState({
                              Avatar: imgURL
                          })
                      })
                      .catch(function(error) {
                });
                }
            })
        }
    }
    pHandler = event =>{
        this.setState({
            password: event.target.value
        })
    }
    check(){
        let accounts = Firebase.database().ref().child("Accounts/account")
        accounts.on('value',snap=>{
            snap.forEach(child=>{
                this.List.push(child.val())
            })
        })
        console.log(this.List)
    }
    submit = ()=>{
        alert('wait')
        var Registered = false
        var n = this.state.name.toLowerCase()
        var p = this.state.password
        var la = null
        var lo = null
        var Av = this.state.Avatar
        if(this.state.lat != null){
            la = this.state.lat
            lo = this.state.long
        }
        var table = {
            name: n,
            password: p,
            latitude: la,
            longitude: lo,
            Av: Av
        }
        var acc = Firebase.database().ref().child("Accounts/account")
        var store = Firebase.database().ref().child("Additional/"+n)
        for(let i=0;i<this.List.length;i++){
            if(n == this.List[i]){
                Registered = true
                break
            }else{
                Registered = false
            }
        }
        if(!Registered){
            this.setState({
                msg: 'Account Registered'
            })
              store.set(table)
              acc.push(n)
          }else{
              this.setState({
                  msg: 'Account is already Registered'
              })
          }
    }

    received = ()=>{
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
                             var m = Firebase.database().ref().child("Additional/"+n.toLowerCase()+'/Messages')
                             m.push(this.state.message)
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
    Store(n){
        this.setState({
            infoName: n
        })
    }
    show(){
        this.received()
    }
    render() {
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
                    <input onChange={this.nHandler} type="text" placeholder="Enter your name" className="name"/>
                    <br/>
                    <input onChange={this.pHandler} type="password" placeholder="Enter the password" className="pin"/>
                    <br/>
                    <input onChange={this.mHandler} type="text" placeholder="Send Message" className="pin"/>
                    <div className="uploads">
                        <label htmlFor=""></label>
                        <input onChange={this.onChangeHandler.bind(this)} type="file" id="upload"/>
                    </div>
                    <div className="label">
        <p className="result">{this.state.msg}</p>
                    </div>
                    <button onClick={this.submit} className="btn">Register</button>
                    <button onClick={this.received} className="btn">Login</button>
                </div>
            </div>
    )
    }
}

export default Signup