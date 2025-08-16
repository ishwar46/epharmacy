import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./contexts/SearchContext";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  // Set default title when no other component sets it
  useEffect(() => {
    // Only set default title if no title has been set yet
    if (!document.title || document.title === "FixPharmacy") {
      document.title = "FixPharmacy - Your Trusted Online Pharmacy in Biratnagar, Nepal";
    }
  }, []);

  return (
    <HelmetProvider>
      <SearchProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="App">
          <AppRoutes />
        </div>
      </SearchProvider>
    </HelmetProvider>
  );
};

export default App;
