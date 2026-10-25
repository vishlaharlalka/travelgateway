import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const Destinations = lazy(() => import("./pages/Destinations"));
const ItineraryDetail = lazy(() => import("./pages/ItineraryDetail"));
const Vietnam = lazy(() => import("./pages/Vietnam"));
const GoldenChariot = lazy(() => import("./pages/GoldenChariot"));
const PalaceOnWheels = lazy(() => import("./pages/PalaceOnWheels"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Payment = lazy(() => import("./pages/Payment"));
const PlatformOverview = lazy(() => import("./pages/PlatformOverview"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={(
          <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center" role="status">
            <p className="text-sm font-semibold text-muted-foreground">Loading Travel Gateway...</p>
          </div>
        )}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:id" element={<ItineraryDetail />} />
            <Route path="destinations/vietnam" element={<Vietnam />} />
            <Route path="destinations/golden-chariot" element={<GoldenChariot />} />
            <Route path="destinations/palace-on-wheels" element={<PalaceOnWheels />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="payment" element={<Payment />} />
            <Route path="platform-overview" element={<PlatformOverview />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Blog />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="terms-and-conditions" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
