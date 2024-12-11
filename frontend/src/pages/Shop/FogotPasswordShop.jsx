import React, { useState } from "react";
import { server } from "../../server";

const ForgotPasswordShop = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(`${server}/shop/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Link reset mật khẩu đã được gửi đến email của bạn.");
            } else {
                setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Quên Mật Khẩu Shop
                </h2>
                {message && (
                    <div className="mb-4 text-green-600">{message}</div>
                )}
                {error && (
                    <div className="mb-4 text-red-600">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nhập địa chỉ email của bạn"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 bg-indigo-600 text-white rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Gửi link reset mật khẩu"}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <a href="/shop/login" className="text-indigo-600 hover:text-indigo-800">
                        Quay lại trang đăng nhập
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordShop;