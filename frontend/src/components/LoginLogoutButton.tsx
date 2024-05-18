import { Button } from "react-bootstrap";
import { useLoginData, useShowLoginModal } from "../states";
export function LoginLoggoutButton() {
    const { loginData, setLoginData } = useLoginData();
    const { setShowLoginModal } = useShowLoginModal();

    const handleLogoutRequest = async () => {
        if (loginData === null || loginData.username === null) {
            return;
        }
        const username = loginData.username;

        // http://localhost:4200/forum/session/a11 (last part is loginData.username)
        console.log(`/forum/session/${username}/delete_session.json`);
        const response = await fetch(`/forum/session/${username}/delete_session`, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });


        let data: any = null;
        try {
            data = await response.json();
        } catch (error) {
            console.log(`Failed to parse response: ${error}`);
            return;
        }
        if (response.ok) {
            setLoginData(null);
        } else {
            console.log(`Failed to logout: ${data.error}`);
        }
    }

    let loginLoggoutButton = <></>;
    if (loginData) {
        loginLoggoutButton = <Button
            variant="link"
            onClick={handleLogoutRequest}
        >
            Logout
        </Button>
    } else {
        loginLoggoutButton = <Button
            onClick={() => setShowLoginModal(true)}
        >
            Login
        </Button>
    }


    return <>{loginLoggoutButton}</>

}
