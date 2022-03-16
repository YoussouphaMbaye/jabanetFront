import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import axiosInstance from "../axios";

function ValiderCommande(){
    const[panier,setPanier]=useState([]);
    const[user,setUser]=useState(null);
    const[lieuLiv,setLieuxLiv]=useState([]);
    const[idLieux,setIdLieux]=useState(null)
    const[utilisateur,setUtilisateur]=useState(null)
    const[totale,setTotal]=useState(0)
    const navigate=useNavigate();
    const getUtilisateur=()=>{
        let currentUser=JSON.parse(sessionStorage.getItem('user'));
        
        axiosInstance.get("http://127.0.0.1:8000/api/utilisateurs/?user/"+currentUser.id).then(response=>{
            //console.log(response.data);
            setUtilisateur(response.data[0]);
            
        }).catch(err=>{console.log(err)})

    }
    useEffect(()=>{
        getUtilisateur();
        const baseURL = 'http://127.0.0.1:8000/api/';
        axiosInstance.get(baseURL+"lieux_livraisons/").then(response=>{
            //console.log(response.data);
            setLieuxLiv(response.data)
            
        }).catch(err=>{console.log(err)})

    },[]);
    const getPanier=()=>{
        if(localStorage.getItem('panier')){
            let produitPanier=JSON.parse(localStorage.getItem('panier'));
            setPanier(produitPanier);
            let somme=0;
            produitPanier.forEach(element => {
                //console.log(element.produit.prix)
                somme=somme+(element.nb*element.produit.prix);
                setTotal(somme)
            });
            console.log(somme)
        }
        
    }
    const finaliserCommande=async()=>{
        let currentUser=JSON.parse(sessionStorage.getItem('user'));

        console.log(JSON.stringify({lieux_livraison:'http://127.0.0.1:8000/api/lieux_livraisons/'+idLieux+'/',client:'http://127.0.0.1:8000/api/utilisateurs/?user='+currentUser.id,total:totale}))
        await axiosInstance.post(
                       
            'http://127.0.0.1:8000/api/commandes/',
            JSON.stringify({lieux_livraison:'http://127.0.0.1:8000/api/lieux_livraisons/'+idLieux+'/',client:utilisateur.url,total:totale})
        )
            .then(async(response)=>{
                    console.log(response.data);
                    console.log(JSON.stringify({nb:1,produit:'http://127.0.0.1:8000/api/produits/'+1+'/',commande:'http://127.0.0.1:8000/api/commandes/'+response.data.id+'/'}))
                    panier.forEach(async(p)=>{
                        await axiosInstance.post('http://127.0.0.1:8000/api/produitItems/',JSON.stringify({nb:p.nb,produit:'http://127.0.0.1:8000/api/produits/'+p.produit.id+'/',commande:'http://127.0.0.1:8000/api/commandes/'+response.data.id+'/'}))
                        .then((response)=>{
                            console.log(response.data)

                        }).catch((err)=>{
                            console.log(err);
                        })
                    })
                    //navigate('/valider/')
            }).catch((err)=>console.log(err))

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
             <div className="row">
                <div className="col-md-9 ">
                <div className="row ">
                    <div className="col-md-3 p-2">
                        <h4>Produit</h4>
                    </div>
                    <div className="col-md-3 p-2">
                        <h4>Désignation</h4>
                    </div>
                    <div className="col-md-3 p-2">
                        <h4>Quantité</h4>
                    </div>
                    <div className="col-md-3 p-2">
                        <h4>Prix totale</h4>
                    </div>
                </div>
                {panier.map((p)=>{
                    return <div className="row panier-item " key={p.produit.id}>
                        
                        <div className="col-md-3 p-2">
                            <img src={p.produit.photos} alt="image" width="70%"/>
                        </div>
                        <div className="col-md-3 p-2">
                            {p.produit.denomination}<br/>
                            {p.produit.description}
                        </div>
                        <div className="col-md-3 p-2">
                            <div className="col-md-3 d-flex">
                                
                            
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
                        <div className="col-md-3 p-2">
                                {p.produit.prix*p.nb+"FCFA"} 
                            </div>
                        
                        
                    </div>
                })}
                </div>
                <div className="col-md-3  pt-3">
                     <div><p>Total a payer:{totale}   </p> </div>  
                     <select name='lesLieux' onChange={(e)=>setIdLieux(e.target.value)}>
                        <option value="">Choisir le lieu de livraison</option>
                        {lieuLiv.length>0?lieuLiv.map((l)=>{
                            return <option value={l.id} key={l.id}>{l.denomination}</option>
                        }):""}
                    </select>
                    <div>
                        <button className="btn btn-primary  mt-3"  onClick={finaliserCommande}>Valider la commande</button>
                    </div>
                </div>
            </div>
            
            :""}

        </div>
    )
}
export default ValiderCommande;
