import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { SelectedTool, useSelectedTool } from '../states';


type ToolbarProps = {
  style: React.CSSProperties;
}

export function ToolbarComponent(props: ToolbarProps) {
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
    <div style={props.style}>
      <Button variant="light" onClick={() => handleToolClick('Mouse', mouseSelected)} active={mouseSelected}>
        <FontAwesomeIcon icon={faMousePointer} /></Button>
      <Button variant="light" onClick={() => handleToolClick('Pin', pinSelected)} active={pinSelected}>
        <FontAwesomeIcon icon={faMapPin} />Adicionar Tópico</Button>
      {/* Add more toolbar buttons as needed */}
    </div>
  );
}

export default ToolbarComponent;
