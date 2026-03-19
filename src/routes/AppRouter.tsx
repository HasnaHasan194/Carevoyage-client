import { Routes, Route } from "react-router-dom";
import { ClientRouter } from "./ClientRouter";
import { CaretakerRouter } from "./CaretakerRouter";
import { AdminRouter } from "./AdminRouter";
import { AgencyRouter } from "./AgencyRouter";
import { LandingPage } from "../components/LandingPage/LandingPage";

import { APP_ROUTE_PATHS } from "./frontendconstants";


export const AppRouter = () => {
  return (
    <Routes>
      {/* Landing Page  */}
      <Route path={APP_ROUTE_PATHS.HOME} element={<LandingPage />} />

      {/* Caretaker Routes */}
      <Route
        path={APP_ROUTE_PATHS.CARETAKER_ROOT}
        element={<CaretakerRouter />}
      />

      {/* Admin Routes */}
      <Route path={APP_ROUTE_PATHS.ADMIN_ROOT} element={<AdminRouter />} />

      {/* Agency Routes */}
      <Route path={APP_ROUTE_PATHS.AGENCY_ROOT} element={<AgencyRouter />} />

      {/* Client Routes */}
      <Route path={APP_ROUTE_PATHS.CLIENT_ROOT} element={<ClientRouter />} />
    </Routes>
  );
};

