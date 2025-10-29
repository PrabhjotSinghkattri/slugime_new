import React from 'react';
import { Link } from 'react-router-dom';

export default function Search() {
  return (
    <div className="search-page container" style={{paddingTop: '1.5rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <Link to="/" aria-label="back">←</Link>
        <input className="form-input" placeholder="Search stories, authors, newsletters..." style={{flex:1}} />
        <button className="btn btn-ghost" style={{marginLeft:'.5rem'}}>Clear</button>
      </div>

      <div style={{marginTop:'1.25rem'}}>
        <div className="card" style={{padding:'1rem', marginBottom:'1rem'}}>
          <div style={{height:180, background:'#ddd', borderRadius:8}}></div>
        </div>

        <hr style={{border:'0',borderTop:'3px solid #000'}} />

        <div className="card" style={{padding:'1rem', marginTop:'1rem'}}>
          <div style={{height:220, background:'#ddd', borderRadius:8}}></div>
        </div>
      </div>
    </div>
  )
}
