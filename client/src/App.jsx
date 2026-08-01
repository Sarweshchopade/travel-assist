import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripProvider } from "./context/TripContext";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Planner from "./pages/Planner";
import Generating from "./pages/Generating";
import MobilePreview from "./pages/MobilePreview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTrips from "./pages/MyTrips";
import NotFound from "./pages/NotFound";

import Overview from "./pages/dashboard/Overview";
import Itinerary from "./pages/dashboard/Itinerary";
import Hotels from "./pages/dashboard/Hotels";
import Flights from "./pages/dashboard/Flights";
import Weather from "./pages/dashboard/Weather";
import Budget from "./pages/dashboard/Budget";
import Culture from "./pages/dashboard/Culture";
import Events from "./pages/dashboard/Events";
import Safety from "./pages/dashboard/Safety";
import Language from "./pages/dashboard/Language";
import Chat from "./pages/dashboard/Chat";
import MapRoute from "./pages/dashboard/MapRoute";
import Analytics from "./pages/dashboard/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/plan" element={<Planner />} />
            <Route path="/generating" element={<Generating />} />
            <Route path="/mobile-preview" element={<MobilePreview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="itinerary" element={<Itinerary />} />
              <Route path="hotels" element={<Hotels />} />
              <Route path="flights" element={<Flights />} />
              <Route path="weather" element={<Weather />} />
              <Route path="budget" element={<Budget />} />
              <Route path="culture" element={<Culture />} />
              <Route path="events" element={<Events />} />
              <Route path="safety" element={<Safety />} />
              <Route path="language" element={<Language />} />
              <Route path="chat" element={<Chat />} />
              <Route path="map" element={<MapRoute />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}
