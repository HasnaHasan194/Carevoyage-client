import { Routes, Route } from "react-router-dom";
import { ClientRouter } from "./ClientRouter";
import { CaretakerRouter } from "./CaretakerRouter";
import { AdminRouter } from "./AdminRouter";
import { AgencyRouter } from "./AgencyRouter";
import { LandingPage } from "../components/LandingPage/LandingPage";


export const AppRouter = () => {
  return (
    <Routes>
      {/* Landing Page  */}
      <Route path="/" element={<LandingPage />} />

      {/* Caretaker Routes */}
      <Route path="/caretaker/*" element={<CaretakerRouter />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* Agency Routes */}
      <Route path="/agency/*" element={<AgencyRouter />} />

      {/* Client Routes */}
      <Route path="/*" element={<ClientRouter />} />
    </Routes>
  );
};

