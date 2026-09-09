import React from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { HomePage } from './pages/HomePage.js';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </ThemeProvider>
  );
}
