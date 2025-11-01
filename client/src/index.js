import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AIHealthPrediction from "./routes/AIHealthPrediction";
import GenerateReport from './routes/GenerateReport';
import HealthAnalytics from './routes/HealthAnalytics';
import Login from './routes/Login';
import Register from './routes/Register';
import UserLanding from './routes/UserLanding';
import UserSettings from './routes/UserSettings';
import MerchantGenerateReport from './routes/MerchantGenerateReport';
import AdministratorDashboard from './routes/AdministratorDashboard';
import MerchantLanding from './routes/MerchantLanding'
import MerchantReports from './routes/MerchantReports'
import AppThemeProvider from './components/AppThemeProvider';
import ProtectedRoutes from './utils/ProtectedRoutes'
import LandingRoute from './utils/LandingRoute'
import { UserProvider } from './utils/UserContext';
import ErrorPage from './routes/ErrorPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
           
            

            <Route element={<ProtectedRoutes />}>
              {/*This can be changed later. This will make login render on loading*/}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>


            {/*Route to a different landing paged based on the users role*/}
            <Route path="/landing" element={<LandingRoute />} />
            
            {/*standard_user routes*/}
            <Route element={<ProtectedRoutes role='standard_user' />}>
              <Route path="/user-landing" element={<UserLanding />} />
              <Route path="/user-settings" element={<UserSettings />} />
              <Route path="/ai-health-prediction" element={<AIHealthPrediction />} />
              <Route path="/generate-report" element={<GenerateReport />} />
              <Route path="/health-analytics" element={<HealthAnalytics />} />
            </Route>

            {/*Merchant routes*/}
            <Route element={<ProtectedRoutes role='merchant' />}>
              <Route path="/merchant-generate-report" element={<MerchantGenerateReport />} />  
              <Route path="/merchant-landing" element={<MerchantLanding />} />
              <Route path="merchant-reports" element={ <MerchantReports />} />
            </Route>

            {/*Admin routes*/}
            <Route element={<ProtectedRoutes role='admin' />}>
              <Route path="/admin-dashboard" element={<AdministratorDashboard />} />
            </Route>

            <Route path="" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AppThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
