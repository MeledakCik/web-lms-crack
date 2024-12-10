'use client';

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LogOut, X, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface ProfileData {
    username: string;
    email: string;
    name: string;
    photo_profile: string;
    bio: string;
}

const Profile = () => {
    const { toast } = useToast();
    const [profile, setProfile] = useState<ProfileData>({
        username: "",
        email: "",
        name: "",
        photo_profile: "",
        bio: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<keyof ProfileData | null>(null);
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

    const getProfileData = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID tidak ditemukan di localStorage.");
            }

            const res = await fetch(`/api/profile?userId=${userId}`);

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setProfile(data);
        } catch (error: any) {
            console.error("Gagal mengambil data profil:", error.message);
            setProfile({
                username: "Error",
                email: "N/A",
                name: "N/A",
                photo_profile: "",
                bio: "Profile error",
            });
        }
    };


    useEffect(() => {
        getProfileData();
    }, []);

    const openModal = (content: keyof ProfileData) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    return (
        <>
            <div className="h-screen w-full justify-center items-center">
                <div className="flex justify-between ml-4 mr-4 rounded mt-3 items-center bg-white shadow p-2">
                    <div className="flex items-center space-x-4">
                        {profile.photo_profile ? (
                            <img
                                src={profile.photo_profile}
                                alt="Profile"
                                className="w-16 h-16 rounded-full mx-auto object-cover shadow-lg"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto shadow-lg" />
                        )}
                        <h1 className="text-lg font-bold text-gray-800 ml-5">{profile.name}</h1>
                    </div>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut className="inline-block w-6 h-6 mr-2 hover:text-red-400" />
                    </button>
                </div>
                <div className="relative justify-center mt-4 ml-4 mr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { title: "Cek Username", img: "/profile.jpg", data: "username" },
                            { title: "Cek Email", img: "/cekprofile.png", data: "email" },
                            { title: "Cek Bio", img: "/kehadiran.png", data: "bio" },
                        ].map((item:any, index) => (
                            <Card
                                key={index}
                                className="rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-400"
                            >
                                <img src={item.img} alt={item.title} className="rounded-lg mb-4 w-full h-40 object-cover" />
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <Button onClick={() => openModal(item.data)} className="bg-white text-gray-800 border-none shadow-none hover:bg-whtie"><Plus /> Lihat</Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </div >
            {isModalOpen && modalContent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="relative bg-white py-14 px-14 rounded-lg shadow-lg max-w-lg w-full">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-start">Detail {modalContent} : </h2>
                        <p className="text-gray-700 mb-4 ml-4 text-start">
                            {profile[modalContent]}
                        </p>
                    </div>
                </div>
            )
            }

            {
                isLogoutModalOpen && (
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
                )
            }
        </>
    );
};

export default Profile;
