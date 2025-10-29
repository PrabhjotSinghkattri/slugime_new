import React from 'react';
import { Link } from 'react-router-dom';

export default function Magazine(){
  return (
    <div className="magazine-page container" style={{paddingTop:'1.5rem'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0,fontSize:'2rem'}}>Today</h2>
        <Link to="/" style={{fontSize:'1.25rem'}}>✕</Link>
      </header>

      <div style={{marginTop:'1rem'}}>
        <div className="card" style={{padding:'1rem', marginBottom:'1rem'}}>
          <div style={{height:220, background:'#ddd', borderRadius:8}}></div>
          <h3 style={{marginTop:'.75rem'}}>From: XYZ</h3>
          <p style={{color:'#444'}}>Short excerpt of the piece that will show under the hero image.</p>
        </div>

        <div className="mag-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="card" style={{padding:'1rem'}}>
            <div style={{height:120, background:'#ddd', borderRadius:8}}></div>
            <p style={{marginTop:'.5rem'}}>jhwbej jdnsjklacj</p>
          </div>
          <div className="card" style={{padding:'1rem'}}>
            <div style={{height:120, background:'#ddd', borderRadius:8}}></div>
          </div>
          <div className="card" style={{padding:'1rem'}}>
            <div style={{height:120, background:'#ddd', borderRadius:8}}></div>
          </div>
          <div className="card" style={{padding:'1rem'}}>
            <div style={{height:220, background:'#ddd', borderRadius:8}}></div>
          </div>
        </div>
      </div>

    </div>
  )
}
