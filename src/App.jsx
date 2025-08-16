import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./contexts/SearchContext";

const App = () => {
  return (
    <SearchProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="App">
        <AppRoutes />
      </div>
    </SearchProvider>
  );
};

export default App;
