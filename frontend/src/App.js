import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  ProfilePage,
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Store from "./redux/store.js";
import {  loadSeller,loadUser } from "./redux/actions/user";
import { ShopDashboardPage, ShopCreateProduct } from "./routes/ShopRoutes.js";
import { useSelector } from "react-redux";
import { ShopHomePage } from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";

const App = () => {
 
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);
  return (
  
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupPage />} />


               {/* Shop Router */}
               <Route path="/shop-create" element={<ShopCreatePage />} />
              <Route path="/shop-login" element={<ShopLoginPage />} />

              <Route
                path="/shop/:id"
                element={
                  <SellerProtectedRoute >
                    <ShopHomePage />
                  </SellerProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <SellerProtectedRoute >
                    <ShopDashboardPage />
                  </SellerProtectedRoute>
                }
              />
               <Route
                path="dashboard-create-product"
                element={
                  <SellerProtectedRoute >
                    <ShopCreateProduct />
                  </SellerProtectedRoute>
                }
              />
              <Route
                path="/activation/:activation_token"
                element={<ActivationPage />}
              />
              <Route
                path="/seller/activation/:activation_token"
                element={<SellerActivationPage />}
              />

              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:name" element={<ProductDetailsPage />} />
              <Route path="/best-selling" element={<BestSellingPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              
            </Routes>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              // transition: Bounce,
            />
          </BrowserRouter>
        </div>
     
  );
};

export default App;
