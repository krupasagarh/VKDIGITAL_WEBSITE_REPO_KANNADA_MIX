import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import HomePlans from "./pages/HomePlans";
import BusinessPlans from "./pages/BusinessPlans";
import Ott from "./pages/Ott";
import Iptv from "./pages/Iptv";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import QuickPay from "./pages/QuickPay";
import { Toaster } from "./components/ui/toaster";

function ScrollToTop() {
  const { pathname } = window.location;
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/home-plans" element={<HomePlans />} />
          <Route path="/business-plans" element={<BusinessPlans />} />
          <Route path="/ott" element={<Ott />} />
          <Route path="/iptv" element={<Iptv />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quick-pay" element={<QuickPay />} />
          <Route path="/terms" element={<GenericPage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<GenericPage title="Privacy Policy" />} />
          <Route path="/refund" element={<GenericPage title="Refund Policy" />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

function GenericPage({ title }) {
  const PageHeader = require("./components/PageHeader").default;
  return (
    <>
      <PageHeader title={title} />
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate">
          <p className="text-slate-600">This page outlines our {title.toLowerCase()} for VK Digital services. For full details, please contact our support team.</p>
          <p className="text-slate-600 mt-4">By subscribing to VK Digital services, you agree to abide by the terms and policies published on this website.</p>
        </div>
      </section>
    </>
  );
}

export default App;
