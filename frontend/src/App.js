import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import HomePlans from "./pages/HomePlans";
import BusinessPlans from "./pages/BusinessPlans";
import Entertainment from "./pages/Entertainment";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import QuickPay from "./pages/QuickPay";
import PlanBuilder from "./pages/PlanBuilder";
import Account from "./pages/Account";
import { Toaster } from "./components/ui/toaster";
import { PlanCatalogProvider } from "./context/PlanCatalogContext";
import { AuthProvider } from "./context/AuthContext";
import WhatsAppFloat from "./components/WhatsAppFloat";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <PlanCatalogProvider>
        <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/home-plans" element={<HomePlans />} />
          <Route path="/business-plans" element={<BusinessPlans />} />
          {/* Unified entertainment page */}
          <Route path="/entertainment" element={<Entertainment />} />
          {/* Backward-compatible routes */}
          <Route path="/ott" element={<Entertainment />} />
          <Route path="/iptv" element={<Entertainment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/quick-pay" element={<QuickPay />} />
          {/* Path is /plan-builder (with final "r"); /plan-builde and similar typos won't match. */}
          <Route path="/plan-builder" element={<PlanBuilder />} />
          <Route path="/terms" element={<GenericPage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<GenericPage title="Privacy Policy" />} />
          <Route path="/refund" element={<GenericPage title="Refund Policy" />} />
        </Routes>
        <Footer />
        <WhatsAppFloat />
        <Toaster />
        </AuthProvider>
        </PlanCatalogProvider>
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
