import { ReactElement, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useLoginData, useOpenTopic, usePinMarkerRequest, usePostId, useSelectedTool, useUser } from "../states";
import React from "react";
import { mapIcons } from "../mapIcons";
import { useMapRefreshCount } from "../states";

export function NewPinModal(): ReactElement {
    const { pinMarkerRequest, setPinMarkerRequest } = usePinMarkerRequest();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [pinIcon, setPinIcon] = useState('');
    const [error, setError] = useState('');
    const { setPostId } = usePostId();
    const { setSelectedTool } = useSelectedTool();
    const { user } = useUser();
    const { refreshCount, setRefreshCount } = useMapRefreshCount();
    const { setLoginData } = useLoginData();
    const { setOpenTopic } = useOpenTopic();


    const handleClose = () => {
        setPinMarkerRequest(null);
        setTitle('');
        setBody('');
        setPinIcon('');
        setError('');
    };

    if (pinMarkerRequest === null) {
        return <div></div>;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title || !body || !pinIcon) {
            setError('Please fill all fields and select a pin icon.');
            return;
        }

        const formData = {
            title: title,
            raw: body,
            icon: pinIcon,
            latitude: pinMarkerRequest.latitude,
            longitude: pinMarkerRequest.longitude,
            category: 4,
        };

        const response = await fetch('/forum/posts.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        let responseData: any
        try {
            responseData = await response.json();
        } catch (error) {
            setError('Failed to create new pin');
            return;
        }

        if(responseData.errors !== undefined && responseData.errors.length !== 0) {
            setError(responseData.errors.join('\n') || 'An unknown error occurred.');
            return;
        }

        if(responseData.error !== undefined && responseData.error.length !== 0) {
            setError(responseData.error.join('\n') || 'An unknown error occurred.');
            return;
        }

        if (response.status === 422) {
            try {
                setError(responseData.errors.join('\n') || 'An unknown error occurred.');
            } catch (error) {
                setError('Failed to parse error message.');
            }
            return
        }

        if (response.status === 401 || response.status === 403) {
            setLoginData(null);
            setSelectedTool('Mouse');
            setError('You must be logged in to create a new pin.');
            return;
        }

        if (response.status !== 200) {
            setError(responseData.message);
            return;
        }

        console.log(responseData);
        console.log(responseData.id);
        setRefreshCount(refreshCount + 1);
        setPostId(responseData.topic_id.toString());
        // Change tool to mouse
        setSelectedTool('Mouse');
        setOpenTopic(true)
        handleClose();
    };

    const show = pinMarkerRequest !== null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar um novo Tópico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group controlId="formTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Escreva um título"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBody">
                        <Form.Label>Postagem</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Descreva o tópico"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPinIcon">
                        <Form.Label>Ícone</Form.Label>
                        <div className="icon-wrapper">
                            {Object.keys(mapIcons).map((icon, index) => (
                                <Form.Check
                                    key={index}
                                    type="radio"
                                    label={<img src={mapIcons[icon]} alt={`Location Icon ${icon}`} style={{ width: '24px', marginRight: '10px' }} />}
                                    name="pinIcon"
                                    id={icon}
                                    value={icon}
                                    onChange={() => setPinIcon(icon)}
                                />
                            ))}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Enviar
                    </Button>
                </Modal.Footer>
                <div className="m-3">

                <Form.Text className="text-muted">
                    Depois de criar este tópico, você pode cilcar no botão de <b>"Ver discussão no Fórum"</b> na esquerda onde vocês terá mais opções de edilção, como a inclusão de imagens e videos.
                </Form.Text>
                </div>
            </Form>
        </Modal>
    );
}
