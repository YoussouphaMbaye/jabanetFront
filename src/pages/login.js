
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import GoogleLogin from 'react-google-login';
import jwt_decode from "jwt-decode";


function Login() {
    
    const [email,setEmail]=useState('');
    const [pwd,setPwd]=useState('');
    const history=useNavigate();
    console.log(email);
    const googleLog=(access_token)=>{
        
        axiosInstance
        .post('auth/convert-token/', {
            token: access_token,
            grant_type: 'convert_token',
            backend: 'google-oauth2',
            client_id: 'bGsZP9WH1QGUWdCOqURTQxpo2Eq5YKYf1kbze1Wt',
			client_secret:
					'HDatPDuiYuLY9SXFJlZ8h2C095kjtZi2f31r7it1k2RiwMFmtxQSeZhgTCn8STFlTyYyAjjiAJsdU6nCZEG7XCdMaDvrcPLg1ApeTiLSKCD8iacZBJCtVf82g0YH2REV',
        })
        .then((res) => {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            console.log(res.data);
            let data=res.data
            console.log(data.access_token)
            //let user=jwt_decode(data.access_token)
            //console.log(user);
            axiosInstance.get("http://127.0.0.1:8000/api/currentUser/").then((res)=>{
                console.log(res.data[0]);
                //localStorage.setItem('user',JSON.stringify(res.data[0]) )
                sessionStorage.setItem('user',JSON.stringify(res.data[0]) )
                history('/')
            }).catch((err)=>{console.log(err)})
            //history.push('/');
            //window.location.reload();
        })
        .catch((err)=>{
            console.log(err)
        });

    }
    const responseGoogle=(response)=>{
        console.log(response.accessToken);
        googleLog(response.accessToken)
    }
    const emaileChange=()=>{

    }
    const loadLogIn=(e)=>{
        e.preventDefault();
        console.log(email,pwd)
        console.log('hhhhhhhhhhhhhhhhhhhhhh')
        
        axiosInstance
			.post(`auth/token/`, {
				grant_type: 'password',
				username: email,
				password: pwd,
				client_id: '8Z9ZIILiBoQgHgEau5QR4SJQkkLZXfkbaKoBQkUG',
				client_secret:
					'HsbgpkIRMjF98OjHVeWiESEapobIeDcDsj262bpycusVBglOblkojBfuk4rHVweNHOQQeizzL5nFMZeizHxrUtEIiXOD1YCtdyerj427up0Lu4WExKNUYn7gn202TscG',
			})
			.then((res) => {
				localStorage.setItem('access_token', res.data.access_token);
				localStorage.setItem('refresh_token', res.data.refresh_token);
                console.log(res.data);
                let user=jwt_decode(res.data.access_token)
                console.log(user);
				//history.push('/');
				//window.location.reload();
			})
            .catch((err)=>{
                console.log(err)
            });

    }
    return ( 
        <div className="col-md-7 m-auto py-5">
            <form onSubmit={loadLogIn}>
                <div className="form-group">
                    <label  >Email</label>
                    <input type='text' name='email' className="form-control" id="email" onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label >Mot de passe</label>
                    <input type='password' name="pwd" className="form-control" id="pwd" onChange={(e)=>setPwd(e.target.value)}/>
                </div>
                
                
                <button type="submit" className="btn btn-primary">Sign in</button><br/>
                <GoogleLogin
                    clientId="495312062723-s741qg0hnbbp1c1cs9d67pe15lvump9p.apps.googleusercontent.com"
                    onSuccess={responseGoogle}
                    isSignedIn={true}
                    />
            </form>
        </div>
     );
}

export default Login;