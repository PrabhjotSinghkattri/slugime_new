import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="home-page">
      <header className="container page-header" style={{paddingTop: '1.5rem'}}>
        <hr style={{border:'0',borderTop:'1px solid #ddd',marginBottom:'1rem'}} />
        <h1 style={{fontSize:'5rem',margin:'0',textAlign:'center',fontWeight:800,color:'#111'}}>slugLime</h1>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem',marginTop:'1.75rem'}}>
          <Link to="/search" aria-label="search" title="Search" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:44,height:44,borderRadius:44,border:'1px solid #ddd',background:'#fff'}}>
            <Search color="#111" />
          </Link>

          <div className="segmented-control" role="tablist" aria-label="content-type">
            <Link to="/newsletter" className="seg-btn active">✓</Link>
            <Link to="/magazine" className="seg-btn">Magazine</Link>
          </div>
        </div>
        <hr style={{border:'0',borderTop:'1px solid #ddd',marginTop:'1.75rem'}} />
      </header>

      <main className="container" style={{minHeight:'60vh', position:'relative'}}>
        {/* empty content area for now - real feed will be added later */}
        <div style={{height:'48vh'}}></div>

        <Link to="/submit" className="fab" aria-label="create">
          <div className="fab-inner">+</div>
        </Link>
      </main>
    </div>
  );
}
