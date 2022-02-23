import { authService } from "fbase";
import React from "react";
import {useNavigate} from "react-router-dom"
const Profile = () => {
    let navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }
    return (
        <>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
}

export default Profile;