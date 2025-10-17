import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MessageCircle, Clock, User, Send, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { fetchReport, postMessage } from "../api";

export default function Status() {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(searchParams.get("ticket") || localStorage.getItem("sluglime_ticket") || "");
  const [code, setCode] = useState(localStorage.getItem("sluglime_code") || "");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function load() {
    if (!ticket.trim() || !code.trim()) {
      setErr("Please enter both ticket and access code");
      return;
    }

    setErr("");
    setIsLoading(true);
    try {
      const reportData = await fetchReport(ticket.trim(), code.trim());
      setReport(reportData);
    } catch (ex) {
      setErr(ex.message || "Failed to load report");
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function send() {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await postMessage(ticket.trim(), code.trim(), message.trim());
      setMessage("");
      await load(); // Refresh the report
    } catch (ex) {
      setErr(ex.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock size={16} />;
      case 'in_progress': return <MessageCircle size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      case 'closed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  useEffect(() => {
    if (ticket && code) {
      load();
    }
  }, []);

  return (
    <div className="status-page">
      <div className="container">
        <div className="page-header">
          <h1>Check Report Status</h1>
          <p>Enter your ticket and access code to view your report</p>
        </div>

        <div className="status-container">
          <div className="status-form">
            <div className="form-header">
              <Search size={24} />
              <h2>Access Your Report</h2>
            </div>

            <div className="form-group">
              <label htmlFor="ticket">Ticket Number</label>
              <div className="input-with-copy">
                <input
                  id="ticket"
                  type="text"
                  className="form-input"
                  placeholder="Enter your ticket number"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                />
                {ticket && (
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(ticket)}
                    title="Copy ticket"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="code">Access Code</label>
              <div className="input-with-copy">
                <input
                  id="code"
                  type="text"
                  className="form-input"
                  placeholder="Enter your access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {code && (
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(code)}
                    title="Copy access code"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            {err && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{err}</span>
              </div>
            )}

            <button 
              className="btn btn-primary btn-large"
              onClick={load}
              disabled={isLoading || !ticket.trim() || !code.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Loading...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Load Report
                </>
              )}
            </button>
          </div>

          {report && (
            <div className="report-details">
              <div className="report-header">
                <div className="report-title">
                  <h2>{report.title}</h2>
                  <div className={`status-badge ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span>{report.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                <div className="report-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Created: {new Date(report.created_at).toLocaleString()}</span>
                  </div>
                  {report.category && (
                    <div className="meta-item">
                      <span>Category: {report.category}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="messages-section">
                <h3>Conversation</h3>
                <div className="messages-list">
                  {report.messages && report.messages.length > 0 ? (
                    report.messages.map((msg, i) => (
                      <div key={i} className={`message ${msg.role}`}>
                        <div className="message-header">
                          <div className="message-author">
                            <User size={16} />
                            <span>{msg.role === 'reporter' ? 'You' : 'Moderator'}</span>
                          </div>
                          <div className="message-time">
                            {new Date(msg.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="message-content">
                          {msg.body}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      <MessageCircle size={24} />
                      <p>No messages yet. Start the conversation below.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="reply-section">
                <h3>Send Message</h3>
                <div className="reply-form">
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={2000}
                  />
                  <div className="reply-actions">
                    <div className="char-count">{message.length}/2000 characters</div>
                    <button 
                      className="btn btn-primary"
                      onClick={send}
                      disabled={!message.trim() || isSending}
                    >
                      {isSending ? (
                        <>
                          <div className="spinner" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}