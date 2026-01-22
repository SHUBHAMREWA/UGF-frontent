import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import GlobalLoader from './components/GlobalLoader';
import RecentDonorToast from './components/RecentDonorToast';
import { initializeClarity } from './utils/clarity';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import AccessDenied from './components/AccessDenied';
import './App.css';
import './styles/DonationCards.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutUsPage from './pages/AboutUsPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import OurMissionPage from './pages/OurMissionPage';
import OurVisionPage from './pages/OurVisionPage';
import ContactUsPage from './pages/ContactUsPage';
import Programs from './pages/Programs';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Register from './components/Register';
import DonationPage from './pages/DonationPage';
import DonationDetails from './pages/DonationDetails';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
import VolunteerForm from './pages/VolunteerForm';
import SubadminManagement from './components/admin/SubadminManagement';
import SubadminDashboard from './components/admin/SubadminDashboard';
import ProgramDetails from './pages/ProgramDetails';
import BlogDetails from './pages/BlogDetails';
import UserDashboard from './pages/UserDashboard';
import Profile from './components/Profile';
import Campaigns from './pages/Campaigns';
import NotFound from './pages/NotFound';
import EventDetails from './pages/EventDetails';
import useScrollToTop from './hooks/useScrollToTop';
import Emergency from './pages/Emergency';
import EmergencyDetail from './pages/EmergencyDetail';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import CancellationRefunds from './pages/CancellationRefunds';
import AryaMitraTermsAndConditions from './pages/AryaMitraTermsAndConditions';
import TendersList from './pages/TendersList';
import MobileViewFooter from './components/MobileViewFooter';
import { Provider } from "react-redux";
import Store from './redux/store.js';
import CaptchaGuard from './components/CaptchaGuard.jsx';
import { ThemeProvider } from './context/ThemeContext';
import MoveToTopButton from './components/common/MoveToTopButton.jsx';
import CampaignsRequest from './pages/CampaignsRequest.jsx';
import UserCampaigns from './pages/UserCampaigns.jsx';



function AppContent() {
  useScrollToTop();

  return (
    <>
      <Navbar />
      <MoveToTopButton/>
      <main className="main-content">
        <Routes>
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="/mission" element={<OurMissionPage />} />
          <Route path="/vision" element={<OurVisionPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donations/:id" element={<DonationDetails />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/sn-arya-mitra" element={<Emergency />} />
          <Route path="/sn-arya-mitra/:id" element={<EmergencyDetail />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/emergency/:id" element={<EmergencyDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign-request" element={<PrivateRoute><CampaignsRequest /></PrivateRoute>} />
          <Route path="/campaign-request/:id" element={<PrivateRoute><CampaignsRequest /></PrivateRoute>} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-campaigns" element={<PrivateRoute><UserCampaigns /></PrivateRoute>} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/" element={<Home />} />
          <Route path="/volunteer-join" element={<VolunteerForm />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
                <SubadminManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="/subadmin" 
            element={<SubadminDashboard />} 
          />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/arya-mitra-terms" element={<AryaMitraTermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
          <Route path="/tenders" element={<TendersList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}


function App() { 

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const clarityProjectId = process.env.REACT_APP_CLARITY_PROJECT_ID || '';

  // Initialize Microsoft Clarity on app load
  useEffect(() => {
    if (clarityProjectId) {
      initializeClarity(clarityProjectId);
    }
  }, [clarityProjectId]);

  return (
     <Provider store={Store}>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <ThemeProvider>
          <CaptchaGuard>
            <LoaderProvider>
              <AppContent />
              <Footer />
              <MobileViewFooter/>
              <GlobalLoader />
              <RecentDonorToast />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </LoaderProvider>
          </CaptchaGuard>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider> 
    </Provider>
  );
}

export default App;
