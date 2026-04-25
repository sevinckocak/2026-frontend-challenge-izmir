import { Route, Routes } from 'react-router-dom';
import Landing from '../pages/landing/Landing';
import Dashboard from '../pages/dashboard/Dashboard';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
