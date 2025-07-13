// src/layout/MainLayout.jsx
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="p-4 ">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
