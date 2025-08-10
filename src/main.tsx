// main.tsx or index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store'; // import the store we made

import AuthPage from './pages/AuthPage';
import About from './pages/About';
import { LoginForm } from './components/login-form';
import Dashboard from './pages/Dashboard';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route element={<AuthPage />}>
              <Route index path="/" element={<LoginForm />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
