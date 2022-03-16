


import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
function Header(){
  const history=useNavigate();
  const [listCategie,setListCategorie]=useState([]);
  const baseURL = 'http://127.0.0.1:8000/api/';
  const listerCategorie=()=>{
    // const response=await axios.get("http://127.0.0.1:8000/api/categories/").catch((err)=>{
    //   console.log(err);
    // });
    // setListCategorie(response);
    // console.log(response)
    axiosInstance.get("http://127.0.0.1:8000/api/categories/").then((d)=>{
      
      
      setListCategorie(d.data);
    }).catch((err)=>{
      console.log(err);
    });

  }
  const getProduitDuCategorie=(e)=>{
    let id=e.target.value;
    
    history("/produitC/"+id);
    



  }
  useEffect(async()=>{
    await listerCategorie();
    
  },[]);
    return(
        <div>
          <div className="my-header px-4 py-3">
            <div>JABANET</div>
            <div>
              <select name='lesCategie' onChange={(e)=>getProduitDuCategorie(e)}>
                <option value="">Tous les categories</option>
                {listCategie.length>0?listCategie.map((c)=>{
                  return <option value={c.id} key={c.id}>{c.denomination}</option>
                }):""}
              </select>
            </div>
            <div>
            <Link to='/panier' type="button" className=" position-relative">
            <i className="fa fa-shopping-cart fa-2x"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  99+
                <span className="visually-hidden">unread messages</span>
              </span>
          </Link>
            </div>
          </div>
            
        </div>
        
    )
}
export default Header;



