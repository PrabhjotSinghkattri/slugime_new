import React from 'react';

export default function Newsletter(){
  return (
    <div className="newsletter-page container" style={{paddingTop:'1.5rem'}}>
      <header style={{textAlign:'center'}}>
        <h2 style={{margin:0,fontSize:'2.25rem'}}>Newsletter</h2>
        <p style={{color:'#666'}}>Subscribe to curated dispatches</p>
      </header>

      <div style={{marginTop:'1.25rem'}}>
        <div className="card" style={{padding:'1.25rem', display:'flex',gap:'1rem',alignItems:'center'}}>
          <div style={{flex:1}}>
            <h3 style={{margin:0}}>Weekly Digest</h3>
            <p style={{color:'#666'}}>Short description about what the newsletter contains.</p>
          </div>
          <button className="btn btn-primary">Subscribe</button>
        </div>

        <div style={{marginTop:'1rem'}}>
          <div className="card" style={{padding:'1rem', marginBottom:'1rem'}}>
            <div style={{height:160, background:'#ddd', borderRadius:8}}></div>
            <h4 style={{marginTop:'.5rem'}}>Latest dispatch</h4>
            <p style={{color:'#444'}}>A preview of the most recent newsletter issue.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
