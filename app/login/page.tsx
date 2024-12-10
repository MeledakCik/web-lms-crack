"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function Login() {
    const route = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerBio, setRegisterBio] = useState("");
    const [registerPhotoProfile, setRegisterPhotoProfile] = useState<File | null>(null);
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [message, setMessage] = useState("");

    const validatePassword = (password: string): string[] => {
        const errors = [];
        if (!/[A-Z]/.test(password)) errors.push("at least one uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("at least one lowercase letter");
        if (!/\d/.test(password)) errors.push("at least one number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("at least one special character");
        if (password.length < 8) errors.push("minimum 8 characters");
        return errors;
    };    


    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login gagal. Email atau password salah.");
            }
            const data = await response.json();
            console.log(data);
            localStorage.setItem("userId", data.id);
            document.cookie = `token=${data.token}; path=/`;
            route.push("/home");
        } catch (error) {
            setMessage((error as Error).message);
        }
    };    

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
    
        const passwordErrors = validatePassword(registerPassword);
        if (passwordErrors.length > 0) {
            setMessage(`Password must contain ${passwordErrors.join(", ")}.`);
            return;
        }
    
        if (!registerPhotoProfile) {
            setMessage("Silakan unggah foto profil.");
            return;
        }
    
        try {
            const base64Photo = await fileToBase64(registerPhotoProfile);
    
            const formData = new FormData();
            formData.append("username", registerUsername);
            formData.append("email", registerEmail);
            formData.append("password", registerPassword);
            formData.append("name", registerName);
            formData.append("bio", registerBio);
            formData.append("photo_profile", base64Photo);
    
            const response = await fetch("/api/register", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registrasi gagal.");
            }
    
            setMessage("Registrasi berhasil! Anda sekarang dapat login.");
        } catch (error) {
            setMessage((error as Error).message);
        }
    };
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <Tabs defaultValue="loginuser">
                    <TabsList className="flex justify-between bg-gray-200 py-6 mb-4">
                        <TabsTrigger value="loginuser" className="flex-1 text-center py-2 rounded-md">Login</TabsTrigger>
                        <TabsTrigger value="registrasiuser" className="flex-1 text-center py-2 rounded-md">Registrasi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="loginuser">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Login</CardTitle>
                                <CardDescription className="text-sm text-gray-500">Masukkan email dan password</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" onClick={handleLogin} className="w-full">Login</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="registrasiuser">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Registrasi</CardTitle>
                                <CardDescription className="text-sm text-gray-500">Buat akun baru</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Label htmlFor="registerUsername" className="block text-sm font-medium text-gray-700">Username</Label>
                                    <Input
                                        id="registerUsername"
                                        type="text"
                                        placeholder="Username"
                                        value={registerUsername}
                                        onChange={(e) => setRegisterUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        id="registerEmail"
                                        type="email"
                                        placeholder="Email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        id="registerPassword"
                                        type="password"
                                        placeholder="Password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="registerName" className="block text-sm font-medium text-gray-700">Nama</Label>
                                    <Input
                                        id="registerName"
                                        type="text"
                                        placeholder="Nama"
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="registerBio" className="block text-sm font-medium text-gray-700">Bio</Label>
                                    <Input
                                        id="registerBio"
                                        type="text"
                                        placeholder="Masukkan Bio"
                                        value={registerBio}
                                        onChange={(e) => setRegisterBio(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="registerPhotoProfile" className="block text-sm font-medium text-gray-700">Foto Profil</Label>
                                    <Input
                                        id="registerPhotoProfile"
                                        type="file"
                                        onChange={(e) => setRegisterPhotoProfile(e.target.files?.[0] || null)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" onClick={handleRegister} className="w-full">Register</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
}
