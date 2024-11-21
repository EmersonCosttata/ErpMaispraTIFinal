import "./App.css";
import "./assets/css/texts.css";
import "./assets/css/buttons.css";

import { Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/header/header";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigationMenu from "./components/navigationMenu/NavigationMenu";
import AddClientPage from "./pages/addClientPage/AddClientPage";
import HomePage from "./pages//HomePage";
import Login from "./pages/LoginPage/Login";
import { useAuth } from "./components/AuthContext";
import AddEmployeePage from "./pages/addEmployeePage/AddEmployeePage";
import AddProductPage from "./pages/addProductPage/addProductPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AddSupplierpage from "./pages/addSupplierpage/AddSupplierpage";
import AddSaleRegister from "./pages/addSaleRegister/AddSaleRegister";
import SupplyPurchasingPage from "./pages/SupplyPurchasingPage/SupplyPurchasingPage";
import NotificationPage from "./pages/NotificationPage/NotificationPage";
import UserPage from "./pages/UserPage/UserPage";
function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isNotificationPage = location.pathname === "/notificacao";

  return (
    <>
      {isAuthenticated && <Header isLoggedIn={isAuthenticated} />}
      {isAuthenticated && !isNotificationPage && <NavigationMenu />}

      <Routes>
        {!isAuthenticated && <Route path="/" element={<Login />} />}
        {isAuthenticated && <Route path="/" element={<HomePage />} />}
        {!isAuthenticated && <Route path="/login" element={<Login />} />}
        {!isAuthenticated && (
          <Route path="/resetpassword" element={<ResetPassword />} />
        )}
        <Route
          path="/cliente"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <AddClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionario"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <AddEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compraInsumos"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <SupplyPurchasingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fornecedor"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <AddSupplierpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registroDeVendas"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <AddSaleRegister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificacao"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
