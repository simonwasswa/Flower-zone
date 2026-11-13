import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollManager from './components/layout/ScrollManager';
import FancyCursor from './components/ui/FancyCursor';
import PageCurtain from './components/ui/PageCurtain';
import ScrollProgress from './components/ui/ScrollProgress';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';

// Visitors never need the admin code, so it downloads only when /admin is opened.
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));


function PublicWebsite() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollProgress />
      <FancyCursor />
      <PageCurtain />
      <Header />
      <main key={pathname} className="page-enter flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
        <Route path="*" element={<PublicWebsite />} />
      </Routes>
    </BrowserRouter>
  );
}
