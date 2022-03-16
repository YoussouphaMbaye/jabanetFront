import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";


function Details(){
    const baseURL = 'http://127.0.0.1:8000/api/';
    const idParam=useParams('id');
    const [produit,setProduit]=useState(null);
    const history=useNavigate();
    const ajouterPanier=()=>{
        
        let lePanier=localStorage.getItem('panier');
        if(lePanier==null){
            let produitPanier=[];
            let pPanier={produit:produit,nb:1};
            localStorage.setItem('panier',JSON.stringify([...produitPanier,pPanier]));
            console.log(localStorage.getItem('panier'));
        }else{
            let pPanier={produit:produit,nb:1};
            let produitPanier=JSON.parse(lePanier);
            localStorage.setItem('panier',JSON.stringify([...produitPanier,pPanier]));
            console.log(localStorage.getItem('panier'));
        }
        history('/panier/');
    }
    const getProduct=async()=>{
            
        const response=await axiosInstance.get(baseURL+"produits/"+idParam.id+'/').catch((err)=>{
        console.log(err);
    }
    
    );
    setProduit(response.data);
    
    
}
    useEffect(async()=>{
       
        //setId(idParam);
       // console.log(id);
        getProduct();
    },[]);
    
    
    
    
    return(
        <div>
            {(produit!=null)?
            <div className="container my-body">
            <div className="row">
                <div className="col-md-7">
                <img src={produit.photos} alt='img produit' width="100%"/>
                </div>
                <div className="col-md-5 detail-rigth ">
                    <div className="d-flex justify-content-between foot-p">
                        <div><p className="card-text">{produit.denomination}</p></div>
                        <div><p className="card-text t-prix"><i className="fa fa-heart-o" aria-hidden="true"></i></p></div>
                    </div>
                    <i className="fa fa-caret-down"></i>
                    <hr/>
                    <div>{produit.prix} FCFA</div>
                    <button type="button" onClick={ajouterPanier} className="btn btn-outline-success col-md-12" width="100%">Ajouter au panier<i className="fa fa-shopping-cart"></i></button>
                    <hr/>
                    <div>
                        <h4>Caractéristique principal:</h4>
                        Type de produit:Alimentation<br/>
                        Poid:3g<br/>
                        quantité:10ml<br/>
                    </div>
                   <div>
                        <h4>Caractéristique Thecnique:</h4>                    
                        Boutique:Auchan<br/>
                        Numéro produit:N22345<br/>
                   </div>
                    
                    
                    

                    <hr/>
                    
                  
                  
                </div>

            </div>
            </div>
            :<div></div>}
        </div>
        
    );
}
export default Details;
