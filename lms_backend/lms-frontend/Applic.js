import React from "react";
import {BrowserRouter as Router, Routes, Route} from react-router-dom;
import RegisterPg from './src/pages/RegisterPg';
import LoginPg from './src/pages/LoginPg';
import DashboardPg from './src/pages/DashboardPg';

function Applic(){
    return ( 
    <Router>
        <Routes>
            <Route path= "/register" element= {<RegisterPg />}/>
            <Route path= "/login" element= {<LoginPg />}/>
            <Route path= "/dashboard" element= {<DashboardPg />}/>
    </Routes></Router>
    );
}
export default Applic;
