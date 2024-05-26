import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faMapPin, faArrows, faLayerGroup, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SelectedTool, useChangeGenericError, useChangePinSelectedTopicId, useSelectedTool, useShowLayerModal } from '../states';
import { Col, Collapse, Container, Row } from 'react-bootstrap';


type ToolbarProps = {
  style: React.CSSProperties;
}

export function ToolbarComponent(props: ToolbarProps) {
  const { selectedTool, setSelectedTool } = useSelectedTool();
  const { setShowLayerModal, showLayerModal } = useShowLayerModal();
  const [currentlyShownDescription, setCurrentlyShownDescription] = useState<null | 'pin' | 'changePin' | 'layer'>('pin');
  const { changePinSelectedTopicId, setChangePinSelectedTopicId } = useChangePinSelectedTopicId();
  const { changeGenericError } = useChangeGenericError();


  // use effect for when selected tool changes to reset changePinSelectedTopicId
  React.useEffect(() => {
    if (selectedTool !== 'ChangePin') {
      setChangePinSelectedTopicId(null);
    }
  }, [selectedTool, setChangePinSelectedTopicId]);


  let mouseSelected = false;
  let pinSelected = false;
  let changePinSelected = false;
  let layerSelected = false;
  let helperText: string | null = null;
  if (selectedTool === 'Mouse') {
    mouseSelected = true;
  } else if (selectedTool === 'Pin') {
    pinSelected = true;
    helperText = 'Clique em algum lugar do mapa para adicionar um tópico';
  } else if (selectedTool === 'ChangePin') {
    changePinSelected = true;
    if (changePinSelectedTopicId) {
      helperText = 'Clique no novo local para mover o tópico';
    } else {
      helperText = 'Clique em um tópico que você tenha criado, depois clique em um novo local para mover o tópico';
    }
  } else if (selectedTool === 'Layer') {
    layerSelected = true;
  }

  // If changeGenericError is set, we show it in helper text
  if (changeGenericError) {
    helperText = changeGenericError;
  }

  let backgroundColor = 'white';
  // If changeGenericError is set, we show it in helper text with danger color
  if (changeGenericError) {
    backgroundColor = 'danger';
  }

  let opacity = 75
  if (changeGenericError) {
    opacity = 50
  }

  const handleToolClick = (toolName: SelectedTool, alreadySelected: boolean) => {
    if (alreadySelected) {
      // We assume user want to go back to mouse tool
      setSelectedTool('Mouse');
      return;
    }

    setSelectedTool(toolName);
  }

  return (
    <div style={

      {
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translate(-50%, 5%)',
        zIndex: 1000,
        width: '100%',
        minHeight: '100%',
        pointerEvents: 'none',
      }

    }>
      <Container style={{ width: 'fit-content', textAlign: 'center', pointerEvents: 'auto' }}>
        <Row className='flex-nowrap'>
          <Container style={{ backgroundColor: 'white', boxShadow: '0 1px 5px rgba(0,0,0,0.65)' }}>
            <Row className='flex-nowrap p-2'>
              <ToolBarButton icon={faMousePointer} description="Mouse" selected={mouseSelected} onClick={() => handleToolClick('Mouse', mouseSelected)} descriptionTag={null} currentlyShownDescription={currentlyShownDescription} onMouseOver={() => setCurrentlyShownDescription(null)} />
              <ToolBarButton icon={faMapPin} description="Adicionar Tópico" selected={pinSelected} onClick={() => handleToolClick('Pin', pinSelected)} descriptionTag="pin" currentlyShownDescription={currentlyShownDescription} onMouseOver={() => setCurrentlyShownDescription('pin')} />
              <ToolBarButton icon={faArrows} description="Mover Tópico" selected={changePinSelected} onClick={() => handleToolClick('ChangePin', changePinSelected)} descriptionTag="changePin" currentlyShownDescription={currentlyShownDescription} onMouseOver={() => setCurrentlyShownDescription('changePin')} />
              <ToolBarButton icon={faLayerGroup} description="Selecionar Layer" selected={layerSelected} onClick={() => setShowLayerModal(true)} descriptionTag="layer" currentlyShownDescription={currentlyShownDescription} onMouseOver={() => setCurrentlyShownDescription('layer')} />
            </Row>
          </Container>
        </Row>
      </Container>
      {helperText && (
        <Container className='mt-2'>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p className={`bg-${backgroundColor} bg-opacity-${opacity} font-weight-bold p-3 text-center d-inline-block`} >
                  {helperText}
                </p>
              </div>
        </Container>
      )}

    </div>
  );
}

type ToolBarButtonProps = {
  icon: IconDefinition
  description: string
  selected: boolean
  onClick: () => void
  onMouseOver: () => void
  descriptionTag: 'pin' | 'changePin' | 'layer' | null
  currentlyShownDescription: 'pin' | 'changePin' | 'layer' | null
}


/** Function to render toolbarbuton */
function ToolBarButton(props: ToolBarButtonProps) {
  //props.descriptionTag === props.currentlyShownDescription
  return (
    <Col className='p-0'>
      <Button variant="light" onClick={props.onClick} active={props.selected} onMouseOver={props.onMouseOver} className='xs-12'>
        <Container>
          <Row className='flex-nowrap'>
            <Col className='p-0'>
              <FontAwesomeIcon icon={props.icon} />
            </Col>
            <Col className='p-0'>
              <Collapse in={props.descriptionTag === props.currentlyShownDescription} dimension="width">
                <p className='text-left text-nowrap my-0 px-1' style={{ width: 'fit-content' }}>
                  {props.description}
                </p>
              </Collapse>
            </Col>
          </Row>
        </Container>
      </Button>
    </Col>
  );

}

export default ToolbarComponent;