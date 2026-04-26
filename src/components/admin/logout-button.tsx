'use client';

import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const router = useRouter();
    const auth = useAuth();
    
    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
        router.push('/admin/login');
    }

    return (
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
        </Button>
    )
}
