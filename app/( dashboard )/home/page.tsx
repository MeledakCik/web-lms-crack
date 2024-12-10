"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LogOut, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const Home = () => {
    const { toast } = useToast();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutRequest = async () => {
        try {
            const response = await fetch("/api/logout", { method: "POST" });

            if (response.ok) {
                toast({ title: "Logout Berhasil", description: "Anda telah keluar." });
                localStorage.removeItem("userId");
                window.location.href = "/login";
            } else {
                toast({ title: "Error", description: "Gagal logout. Silakan coba lagi." });
            }
        } catch (error) {
            console.error("Error:", error);
            toast({ title: "Error", description: "Terjadi kesalahan saat logout." });
        }
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        handleLogoutRequest();
    };

    const cancelLogout = () => setIsLogoutModalOpen(false);

    return (
        <div className="h-full w-full justify-center items-center">
            <div className="flex justify-between ml-4 mr-4 rounded mt-3 items-center bg-white shadow p-4">
                <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsLogoutModalOpen(true)} className="rounded-full p-2 hover:bg-red-200">
                        <LogOut className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            </div>

            <div className="flex-grow container mx-auto px-4 py-6 overflow-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Selamat Datang Di Web Lms Scraping</h2>
                <div className="relative justify-center mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { title: "Cek Profile", img: "/profile.jpg" },
                            { title: "Edit Profile", img: "/cekprofile.png" },
                            { title: "Cek Kehadiran", img: "/kehadiran.png" },
                            { title: "Cek Kelas", img: "/kelas.jpeg" },
                            { title: "Cek Report", img: "/report.png" },
                            { title: "Change Password", img: "/change-password.svg" },
                            { title: "Automatic Absen", img: "/absen.jpeg" },
                            { title: "Crack User", img: "/users.png" },
                            { title: "Crack File User", img: "/crack_file.jpg" },
                        ].map((item, index) => (
                            <Card
                                key={index}
                                className="rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-400"
                            >
                                <img src={item.img} alt={item.title} className="rounded-lg mb-4 w-full h-40 object-cover" />
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center">
                    <div className="rounded-lg bg-white shadow-lg p-12 w-full max-w-sm mx-4">
                        <p className="text-center font-bold text-lg mb-4">Apakah benar ingin logout?</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button onClick={confirmLogout} className="rounded-lg bg-red-300 hover:bg-red-400 text-white py-2 px-4">
                                Logout
                            </button>
                            <button onClick={cancelLogout} className="rounded-lg bg-gray-300 py-2 px-4">
                                Batal
                            </button>
                            <X className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 cursor-pointer" onClick={cancelLogout} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
