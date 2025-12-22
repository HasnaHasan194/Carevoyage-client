import { Routes, Route } from "react-router-dom";
import { ClientRouter } from "./ClientRouter";
import { CaretakerRouter } from "./CaretakerRouter";
import { AdminRouter } from "./AdminRouter";
import { AgencyRouter } from "./AgencyRouter";

/**
 * Main App Router
 * Combines all role-specific routers
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/*" element={<ClientRouter />} />

      {/* Caretaker Routes */}
      <Route path="/caretaker/*" element={<CaretakerRouter />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* Agency Routes */}
      <Route path="/agency/*" element={<AgencyRouter />} />
    </Routes>
  );
};

