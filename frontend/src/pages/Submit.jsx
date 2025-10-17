import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Paperclip, Upload, AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { createReport } from "../api";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const res = await createReport(formData);
      setResult(res);
      try { 
        localStorage.setItem("sluglime_ticket", res.ticket); 
        localStorage.setItem("sluglime_code", res.access_code); 
      } catch {}
    } catch (ex) { 
      setErr(ex.message || "Failed to submit report"); 
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).filter(file => {
      const maxSize = 25 * 1024 * 1024; // 25MB
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'video/mp4'];
      
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 25MB.`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please use PDF, DOCX, JPG, PNG, or MP4.`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (result) {
    return (
      <div className="submit-success">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h1>Report Submitted Successfully!</h1>
            <p className="success-message">
              Your anonymous report has been submitted. Save these details securely - 
              they won't be shown again.
            </p>
            
            <div className="receipt-card">
              <div className="receipt-header">
                <span>Your Secure Receipt</span>
              </div>
              <div className="receipt-content">
                <div className="receipt-item">
                  <label>Ticket Number</label>
                  <div className="receipt-value">
                    <code>{result.ticket}</code>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(result.ticket)}
                      title="Copy ticket"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="receipt-item">
                  <label>Access Code</label>
                  <div className="receipt-value">
                    <code>{result.access_code}</code>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(result.access_code)}
                      title="Copy access code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <Link 
                to={`/status?ticket=${result.ticket}`} 
                className="btn btn-primary btn-large"
              >
                <ExternalLink size={20} />
                Check Status
              </Link>
              <Link to="/" className="btn btn-ghost">
                Return Home
              </Link>
            </div>

            <div className="security-notice">
              <AlertCircle size={16} />
              <span>Keep your ticket and access code safe. You'll need them to track your report.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-form-container">
          <div className="submit-form-card">
            <h1 className="form-title">Submit Your Information Anonymously</h1>
            <p className="form-subtitle">Share your truth securely and help shed light on important issues.</p>
            
            <form onSubmit={onSubmit} className="submit-form">
              {err && (
                <div className="error-alert">
                  <AlertCircle size={20} />
                  <span>{err}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your submission"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Content</label>
                <textarea
                  id="body"
                  className="form-input textarea"
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Detailed information and context about the issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Attachment Upload</label>
                <div 
                  className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={24} />
                  <span>Drag & drop files or click to upload</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="upload-info">
                  Max file size: 25MB. Supported formats: PDF, DOCX, JPG, PNG, MP4
                </div>
                
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="remove-file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large submit-btn"
                disabled={isSubmitting || !title.trim() || !body.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Submitting...
                  </>
                ) : (
                  "Submit Anonymously"
                )}
              </button>
              
              <p className="privacy-note">
                We never store your identity or IP. Your privacy is our priority.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}