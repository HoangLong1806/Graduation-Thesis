import React, { useEffect, useState } from "react";
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
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
} from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Store from "./redux/store.js";
import { loadSeller, loadUser } from "./redux/actions/user";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvent,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopPreviewPage,
} from "./routes/ShopRoutes.js";
import { AdminDashboardPage , AdminDashboardUsers} from "./routes/AdminRoutes";
import { useSelector } from "react-redux";
import { ShopHomePage } from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";

import axios from "axios";
import { server } from "./server.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.js";
const App = () => {
  const [stripeApikey, setStripeApiKey] = useState("");
  
  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);
  return (
    <div>
      <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

          {/* Shop Router */}
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />

          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoute>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="dashboard-create-product"
            element={
              <SellerProtectedRoute>
                <ShopCreateProduct />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="dashboard-products"
            element={
              <SellerProtectedRoute>
                <ShopAllProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="dashboard-create-event"
            element={
              <SellerProtectedRoute>
                <ShopCreateEvent />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="dashboard-events"
            element={
              <SellerProtectedRoute>
                <ShopAllEvents />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="dashboard-coupouns"
            element={
              <SellerProtectedRoute>
                <ShopAllCoupouns />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>

            }
          />
           <Route
            path="/admin-users"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardUsers />
              </ProtectedAdminRoute>

            }
          />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </div>
  );
};

export default App;
