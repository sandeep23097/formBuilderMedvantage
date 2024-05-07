import React, { FunctionComponent } from "react";
import {
  isMobile as libIsMobile,
  isTablet as libIsTablet
} from "react-device-detect";
let isMobile:Boolean;
if (process.env.NODE_ENV === "localhost") {
  isMobile = window.innerWidth < 1024;
} else {
  isMobile = libIsMobile || libIsTablet || window.innerWidth < 1024;
};
interface NavbarProps {
  window?: ()=>Window
}
// import logo from './../assets/img-logo.png';
import logo from '../assets/medLogo.png';

 
const Navbar: FunctionComponent<NavbarProps> = (props) => {

  return (
    <>

<header
        id="header"
        className="header-sticky sticky-active"
        data-fullwidth="true"
      >
        <div className="header-inner custom-inner">          
          <div className="container">

            <div className="nav-container">
              
              <div className="logo">
              <a
                href="/"
                className="vcenter"
                data-src-dark="/img/medLogo.png"                
              >
                <img
                  src={logo}/>                
              </a>
            </div>              

            <div className="nav-n-logo">
              <div className="nav-wrappper"               
              >
                <div>
                <a
                  href="/reportBuilder"
                                       
                >               
                  REPORT BUILDER
                </a>
              </div>

              <div>
                <a
                  href="/queryBuilder"
                               
                >               
                  QUERY BUILDER
                </a>
              </div>
              </div>

              <div className="toggle-button"              
              >
                <button>
                <div></div>
                <div></div>
                <div></div>
                </button>
                
              </div>
              </div>

            </div> 
           
          </div>
        </div>
      </header>

      {/* <header
        id="header"
        className="header-sticky sticky-active"
        data-fullwidth="true"
      >
        <div className="header-inner custom-inner">          
          <div className="container">
           
            <div className="row">
            <div className="col-md-2">
            <div id="logo">
              <a
                href="/"
                className="logo vcenter"
                data-src-dark="/img/medLogo.png"
                
              >
                <img
                  src={logo}
                  alt="Form Builder"
                  style={
                    isMobile
                      ? { marginTop: "7px", display: "inline-block" }
                      : { display: "inline-block" }
                  }
                  className={isMobile ? "p-l-20 p-r-15" : "p-r-20"}
                />                
              </a>
            </div>
            </div>

            <div className="col-md-2">
            <div >
              <a
                href="/reportBuilder"
                className="logo vcenter"
                data-src-dark="/img/medLogo.png"               
              >
               
                Report Builder
              </a>
            </div>


            </div>
            <div className="col-md-2">
            <div >
              <a
                href="/queryBuilder"
                className="logo vcenter"
                data-src-dark="/img/img-logo.png"
                style={{ fontFamily: "Cassannet", fontSize: "16px" }}
              >               
                Query Builder
              </a>
            </div>
            </div>

            </div>
          
           
          </div>
        </div>
      </header> */}
    </>
  );
}
 
export default Navbar;