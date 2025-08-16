import React from "react";
import { Outlet } from "react-router-dom";
import StickyNavbar from "../components/common/StickyNavbar";
import Footer from "../components/common/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StickyNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
