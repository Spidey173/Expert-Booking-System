import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/experts" replace />} />
          <Route path="experts" element={<ExpertList />} />
          <Route path="experts/:id" element={<ExpertDetail />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
