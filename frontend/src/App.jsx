import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./theme.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Status from "./pages/Status";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/" element={
            <>
              <Navbar />
              <main className="main-content">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/submit" element={
            <>
              <Navbar />
              <main className="main-content">
                <Submit />
              </main>
              <Footer />
            </>
          } />
          <Route path="/status" element={
            <>
              <Navbar />
              <main className="main-content">
                <Status />
              </main>
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <main className="main-content">
                <About />
              </main>
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <main className="main-content">
                <Contact />
              </main>
              <Footer />
            </>
          } />
          <Route path="*" element={
            <>
              <Navbar />
              <main className="main-content">
                <NotFound />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}