import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./contexts/SearchContext";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
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
