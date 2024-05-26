import React from 'react';
import { Modal, Button, Image, Container, Col, ButtonGroup, Row } from 'react-bootstrap';
import { LayerType, useCurrentLayer, useShowLayerModal } from '../states';
import defaultLayer from '../images/defaultLayer.png';
import topoLayer from '../images/topoLayer.png';

type LayerModalProps = {};

function LayerModal(props: LayerModalProps) {
  const { showLayerModal, setShowLayerModal } = useShowLayerModal();
  const { currentLayer, setCurrentLayer } = useCurrentLayer();

  const layers: { id: LayerType; label: string; src: string }[]= [
    { id: 'default', label: 'Default', src: defaultLayer },
    { id: 'topo', label: 'Topo', src: topoLayer },
  ];

  const handleSelectLayer = (layerId: LayerType) => {
    setCurrentLayer(layerId);
    setShowLayerModal(false);
  };

  return (
    <Modal show={showLayerModal} onHide={() => setShowLayerModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selecione O Layer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <ButtonGroup className="w-100">
            <Row>
              {layers.map((layer) => (
                <Col key={layer.id} xs={6} md={4} className="p-1">
                  <Button
                    onClick={() => handleSelectLayer(layer.id)}
                    variant={currentLayer === layer.id ? 'primary' : 'light'}
                    className="w-100"
                  >
                    <Image src={layer.src} thumbnail fluid />
                  </Button>
                </Col>
              ))}
            </Row>
          </ButtonGroup>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LayerModal;
