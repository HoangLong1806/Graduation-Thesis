import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../server";

const ResetPasswordShop = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();  

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${server}/shop/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: password, confirmPassword: confirmPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Mật khẩu đã được đặt lại thành công.");
                // Redirect người dùng đến trang đăng nhập sau khi thành công
                setTimeout(() => {
                    navigate("/shop/login");
                }, 2000);
            } else {
                setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Kiểm tra xem token có tồn tại trong URL không
        if (!token) {
            setError("Token không hợp lệ.");
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Đặt Lại Mật Khẩu
                </h2>
                {success && (
                    <div className="mb-4 text-green-600">{success}</div>
                )}
                {error && (
                    <div className="mb-4 text-red-600">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 bg-indigo-600 text-white rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default ResetPasswordShop;