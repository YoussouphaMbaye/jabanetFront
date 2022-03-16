import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import axiosInstance from "../axios";
import Header from "../composants/header";

function Panier(){
    const[panier,setPanier]=useState([]);
    const[user,setUser]=useState(null);
    const navigate=useNavigate();
    const getPanier=()=>{
        if(localStorage.getItem('panier')){
            let produitPanier=JSON.parse(localStorage.getItem('panier'));
            setPanier(produitPanier);
        }
        
    }
    const validerCommande=async()=>{
        let currentUser=JSON.parse(sessionStorage.getItem('user'));
        console.log(currentUser);
        if(currentUser){
            
            await axiosInstance.get('http://127.0.0.1:8000/api/utilisateurs/?user='+currentUser.id)
            .then(async(response)=>{
                    console.log(response.data);
                    console.log('oupslllllllllllllllllllll')
                    if(response.data.length==1)
                    navigate('/valider/')
                    else{
                        //enregistre utilisateur
                        // let fdata=new FormData()
                        // fdata.append("profile","client")
                        // fdata.append("user",3)
                        // console.log({'profile':'client','user':3})
                        await axiosInstance.post(
                       
                        'http://127.0.0.1:8000/api/utilisateurs/',
                        JSON.stringify({profile:'client',user:'http://127.0.0.1:8000/api/users/'+currentUser.id+'/'})
                    )
                        .then((response)=>{
                                console.log(response);
                                console.log('mmmmmmmmmmmmmmmmmm')
                                navigate('/valider/')
                        }).catch((err)=>console.log(err))
                        //end
                    }
                    
            }).catch((err)=>console.log(err))
            
        }else{
            console.log('nonnnnnnnnnnnnnnnnnn')
            navigate('/login/')
        }
        

    }
    useEffect(()=>{
        getPanier();
        console.log(panier)
    },[])
    const plusNbProduit=(idLink)=>{
        let lesProduits=panier.slice();
        const id=lesProduits.findIndex(p=>p.produit.url==idLink);
        lesProduits[id].nb=lesProduits[id].nb+1;
        setPanier(lesProduits);
        localStorage.setItem('panier',panier);

       
    }
    const moinNbProduit=async(idLink)=>{
        if(panier.length){
        let lesProduits=panier.slice();
        const id=lesProduits.findIndex(p=>p.produit.url==idLink);
       
        if(lesProduits[id].nb==1){
            console.log(id)
            await lesProduits.splice(id,1);
            console.log(lesProduits.length)
            setPanier(lesProduits);
            localStorage.setItem('panier',panier);
            
        }else{
            lesProduits[id].nb=lesProduits[id].nb-1;
            setPanier(lesProduits);
            localStorage.setItem('panier',panier);
            
        }
        
        if(lesProduits.length<1){
            console.log('mmmmmmmmmmmmm');
            
            localStorage.removeItem('panier');
            setPanier([])
        }
          
        
        
    }else{
        localStorage.removeItem(panier);
    }


       
    }
    return(
       <div className="my-body container">
             {panier.length>0?
             <>
                <div className="d-flex justify-content-between mb-5">
                    <div><Link className="btn btn-primary" to="/">Contunier mes achats</Link></div>
                    <div> Nombre de produit {panier.length}</div>
                    <div><button className="btn btn-primary" onClick={validerCommande}>Valider la commande</button></div>
                </div>
                {panier.map((p)=>{
                    return <div className="row panier-item " key={p.produit.id}>
                        <hr/>
                        <div className="col-md-4">
                            <img src={p.produit.photos} alt="image" width="70%"/>
                        </div>
                        <div className="col-md-4">
                            {p.produit.denomination}<br/>
                            {p.produit.description}
                        </div>
                        <div className="col-md-4 ">
                        <div className="col-md-4 d-flex">
                            
                           
                            <div>
                                <button className="btn btn-outline-success" onClick={()=>plusNbProduit(p.produit.url)}>+</button>
                            </div>
                            <div>
                                <p className="nb-panier">&nbsp;{p.nb}&nbsp;</p>
                            </div>
                            <div>
                                <button className="btn btn-outline-success" onClick={()=>moinNbProduit(p.produit.url)}>-</button>
                            </div>

                           
                        </div>
                        <div>{p.produit.prix}FCFA</div>
                        </div>
                        <hr/>
                        
                    </div>
                })}
            </>:""}
        </div>
    )
}
export default Panier;
