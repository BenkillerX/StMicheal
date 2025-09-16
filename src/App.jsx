// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import About from "./Components/About/About";
import Annunse from "./Components/Annunse";
import Event from "./Components/Events";
import NavBar from "./Components/NavBar";
import Form from "./Components/Form/Form";
import Login from "./Components/Login/Login";
import { supabase } from "./supabaseClient";
import Dashboard from "./Components/Dashboard/Dashboard";

const ADMIN_EMAIL = 'benedictakhere802@gmail.com';

function RequireAdmin({ user, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    // If no user or user email doesn't match admin, redirect to login
    if (!user || user?.email !== ADMIN_EMAIL) {
      navigate('/login');
    }
  }, [user, navigate]);

  // while redirecting, don't render children
  return (user && user.email === ADMIN_EMAIL) ? children : null;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session/user
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <NavBar user={user} setUser={setUser} />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/announcements" element={<Annunse />} />
          <Route path="/events" element={<Event />} />
          <Route path="/Form" element={<Form setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* Protected admin route */}
          <Route
            path="/dash"
            element={
              <RequireAdmin user={user}>
                <Dashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
