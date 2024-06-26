import { useEffect, useState } from 'react';
import { useLoginData, useShowLoginModal, useTriggerLoginCheckCounter } from '../states';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { set } from 'ol/transform';
import googleIcon from '../svg/google.svg';

type LoginModalProps = {
    show: boolean;
}

export function LoginModal() {
    const { loginData, setLoginData } = useLoginData();
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isRequestingLogin, setIsRequestingLogin] = useState<boolean>(false);
    const { showLoginModal, setShowLoginModal } = useShowLoginModal();
    const [localPassword, setLocalPassword] = useState<string>('');
    const [localUsername, setLocalUsername] = useState<string>('');
    const { setTriggerLoginCheckCounter, triggerLoginCheckCounter } = useTriggerLoginCheckCounter();
    const googleLogin = async () => {
        const response = await fetch("/forum/session/csrf.json", {
            headers: {
                "Content-Type": "application/json",
            },
        });

        let jsonData = null;
        try {
            jsonData = await response.json();
        } catch (error) {
            console.log('Failed to parse response');
            return;
        }

        let csrf = jsonData.csrf;

        // Create and submit the form
        const form = document.createElement("form");
        form.setAttribute("style", "display:none;");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/forum/auth/google_oauth2");

        const input = document.createElement("input");
        input.setAttribute("name", "authenticity_token");
        input.setAttribute("value", csrf);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    };

    // For securityReasons we will force the reset of localPassword and localUsername
    // everytime the showLoginModal changes
    useEffect(() => {
        setLocalPassword('');
        setLocalUsername('');
    }, [showLoginModal]);

    const handleLogin = async (username: string, password: string): Promise<void> => {
        setIsRequestingLogin(true);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const SECOND_FACTOR_METHOD = 1;
        console.log(timezone);
        // Build the request with a proper build function
        const body = {
            login: username,
            password: password,
            second_factor_method: SECOND_FACTOR_METHOD,
            timezone: timezone,
        };
        const response = await fetch("/forum/session.json", {
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },

            method: "POST",
        });

        let data = null;
        try {
            data = await response.json();
        } catch (error) {
            setLoginError('Server sent an invalid response');
            setIsRequestingLogin(false)
            return;
        }

        if (!response.ok) {
            const error = data.error ?? 'An unknown error occurred';
            setLoginError(error);
            setIsRequestingLogin(false)
            return;
        }

        if (data.error !== undefined) {
            setLoginError(data.error)
            setIsRequestingLogin(false)
            return;
        }

        const userId = (data.user.id as number).toString()
        const returnedUsername = data.user.username as string;
        const avatarTemplate = data.user.avatar_template as string;
        const email = data.user.email as string;

        setLoginData({
            userId,
            avatarTemplate,
            email,
            username: returnedUsername,
        })
        setLoginError(null);
        setIsRequestingLogin(false)
        // Close the modal
        setShowLoginModal(false);
    };

    const closeModal = () => {
        setShowLoginModal(false);
        setLoginError(null);
    };

    return (
        <Modal show={showLoginModal} onHide={closeModal}>
            <Form onSubmit={(e) => { e.preventDefault(); handleLogin(localUsername, localPassword) }}>

                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className='m-2 mb-4'>
                            <Button onClick={googleLogin} variant="light" className='border border-dark'>
                                <Row>
                                    <Col xs="auto">
                                        <img src={googleIcon} alt="Google Icon" className="google-icon" style={{ height: '20px', marginRight: '8px' }} />
                                    </Col>
                                    <Col xs="auto">
                                        Logar/Registrar com a Google
                                    </Col>
                                </Row>
                            </Button>
                        </Row>
                        <Row className='m-2 mb-4'>
                            <Button onClick={() => {
                                // set url to /forum/latest
                                window.location.href = '/forum/latest';
                            }} variant="light" className='border border-dark'>
                                <Row>
                                    <Col xs="auto">
                                        <img src={googleIcon} alt="Google Icon" className="google-icon" style={{ height: '20px', marginRight: '8px', visibility: 'hidden' }} />
                                    </Col>
                                    <Col xs="auto">
                                        Criar conta no Forum
                                    </Col>
                                </Row>
                            </Button>
                        </Row>
                        <Row>

                            <Form.Group>
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Usuário ou Email"
                                    onChange={(e) => setLocalUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Senha"
                                    onChange={(e) => setLocalPassword(e.target.value)}
                                />
                            </Form.Group>
                            {loginError && <div className="alert alert-danger" role="alert">
                                {loginError}
                            </div>}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={isRequestingLogin} type="submit">
                        {isRequestingLogin ? 'Logging in...' : 'Login'}
                    </Button>
                </Modal.Footer>
            </Form>

        </Modal>
    );
}
