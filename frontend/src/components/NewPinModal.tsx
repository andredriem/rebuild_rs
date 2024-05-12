import { ReactElement, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { usePinMarkerRequest } from "../states";
import React from "react";
import { mapIcons } from "../mapIcons";

export function NewPinModal(): ReactElement {
    const { pinMarkerRequest, setPinMarkerRequest } = usePinMarkerRequest();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [pinIcon, setPinIcon] = useState('');
    const [error, setError] = useState('');

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
            uuid: pinMarkerRequest.uuid,
            title: title,
            body: body,
            pinIcon: pinIcon,
            latitude: pinMarkerRequest.latitude,
            longitude: pinMarkerRequest.longitude,
        };

        await fetch('/api/postTopic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        handleClose();
    };

    const show = pinMarkerRequest !== null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Pin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBody">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter body"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPinIcon">
                        <Form.Label>Pin Icon</Form.Label>
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
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
