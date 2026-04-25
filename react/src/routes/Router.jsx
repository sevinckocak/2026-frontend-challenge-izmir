import { Route, Routes } from "react-router-dom";
import Landing from "../pages/landing/Landing";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}
