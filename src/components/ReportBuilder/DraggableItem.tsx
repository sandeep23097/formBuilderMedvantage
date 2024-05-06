import React,{ FC } from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
    id: string;
    type: string;
    name: string;
}

const DraggableItem: FC<DraggableItemProps> = ({ id, type, name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, name },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>{name}</div>;
};

export default DraggableItem;
