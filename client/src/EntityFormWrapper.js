import React from 'react';
import { useParams } from 'react-router-dom';
import EntityForm from './EntityForm';
import { useEntityData } from './functions'; // Assuming you have defined the useEntityData hook in functions.js

const EntityFormWrapper = () => {
  const { entity } = useParams(); // Destructure only 'entity' from useParams
  const { entityData, uiElements, handleInputChange, handleSubmit, handleClear } = useEntityData(entity);

  return (
    <EntityForm
      id={entityData.id}
      components={uiElements}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onClear={handleClear}
      data={entityData}
      name={entity}
    />
  );
};

export default EntityFormWrapper;
