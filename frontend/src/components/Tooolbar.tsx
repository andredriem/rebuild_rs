import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { SelectedTool, useSelectedTool } from '../states';

export function ToolbarComponent() {
  const { selectedTool, setSelectedTool } = useSelectedTool();

  let mouseSelected = false;
  let pinSelected = false;
  if (selectedTool === 'Mouse') {
    mouseSelected = true;
  } else if (selectedTool === 'Pin') {
    pinSelected = true;
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
    <div style={{
      position: 'absolute',
      top: '0%',
      left: '50%',
      transform: 'translate(-50%, 50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '10px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.65)'
    }}>
      <Button variant="light" onClick={() => handleToolClick('Mouse', mouseSelected)} active={mouseSelected}>
        <FontAwesomeIcon icon={faMousePointer} /></Button>
      <Button variant="light" onClick={() => handleToolClick('Pin', pinSelected)} active={pinSelected}>
        <FontAwesomeIcon icon={faMapPin} />Adicionar Tópico</Button>
      {/* Add more toolbar buttons as needed */}
    </div>
  );
}

export default ToolbarComponent;
