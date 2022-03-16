import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
function Home(){
    const baseURL = 'http://127.0.0.1:8000/api/';
    
    const [produits,setProduits]=useState(null);
    const getProducts=async()=>{
            
        const response=await axiosInstance.get(baseURL+"produits/").catch((err)=>{
        console.log(err);
    }
    
    );
    setProduits(response.data);
    
}
    useEffect(async()=>{
       
        //setId(idParam);
       // console.log(id);
        getProducts();
    },[]);
    
    return(
        <div className="container-fluid my-body">
        <div className="row">
            {produits!=null?
            produits.map((p)=>{
                return <div className="mb-4 my-body col-md-4 col-lg-3 col-sm-6" key={p.id.toString()}>
                <Link to={"/details/"+p.id}>
                <div className="card" >
                    <img src={p.photos} className="card-img-top" alt="..."width="100%"/>
                    <div className="card-body">
                        <div className="foot-p">
                           <div><p className="card-text">{p.denomination}</p></div>
                           <div><p className="card-text t-prix">{p.prix}FCFA</p></div>
                        </div>
                        
                    </div>
                </div>
                </Link>
            </div>
            })
            :""}
        </div>
        </div>
        
    )
}
export default Home;
