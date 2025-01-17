import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import HomePage from './pages/Home';
import AddCredit from './components/AddCredit';
import AddDebit from './components/AddDebit';
import Navbar from './components/navbar';
import PrivateRoute from './privateRoute'; // Import the PrivateRoute component
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import { Toaster } from 'sonner'; // Import the Toaster component from Sonner

// Layout component to include Navbar conditionally
const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ['/login', '/signup', '/']; // Define routes without Navbar

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app in AuthProvider */}
      <Router>
        {/* Add Toaster at the root level with customized styles */}
        <Toaster position="top-center" richColors toastOptions={{
          success: { style: { backgroundColor: 'green', color: 'white' } },
          error: { style: { backgroundColor: 'red', color: 'white' } },
        }} />

        <Routes>
          {/* Routes where Navbar is not rendered */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Routes wrapped with Layout for conditional Navbar */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="/home"
                    element={
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-credit"
                    element={
                      <PrivateRoute>
                        <AddCredit />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-debit"
                    element={
                      <PrivateRoute>
                        <AddDebit />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
