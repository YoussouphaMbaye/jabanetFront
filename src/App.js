import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import { Route, BrowserRouter as Router, Routes,Link } from 'react-router-dom';
import Details from './pages/details';
import Header from './composants/header';
import Panier from './pages/panier';
import ProduitDuCategorie from './pages/produitDuCategorie';
import Login from './pages/login';
import axiosInstance from './axios';
import ValiderCommande from './pages/validerCommande';
function App() {
  const baseURL = 'http://127.0.0.1:8000/api/';
  axiosInstance.get(baseURL+"produits/").then(response=>{
    //console.log(response.data);
  }).catch(err=>{console.log(err)})
  return (
    <div className="App">
      
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Router>
          <Header/>
          <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/details/:id" element={<Details/>} />
          <Route exact path="/panier/" element={<Panier/>} />
          <Route exact path="/login/" element={<Login/>} />
          <Route exact path="/valider/" element={<ValiderCommande/>} />
          <Route exact path="/produitC/:idCategorie" element={<ProduitDuCategorie/>} />
          </Routes>
        </Router>
  
        
    </div>
  );
}

export default App;
