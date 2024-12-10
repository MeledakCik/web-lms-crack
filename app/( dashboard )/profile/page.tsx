'use client';

import { useToast } from "@/hooks/use-toast";
import  ProfileMe  from "@/components/profile/Profile";
const Profile = () => {
    const { toast } = useToast();

    return (
        <>
            <ProfileMe />
        </>

    );
};

export default Profile;
