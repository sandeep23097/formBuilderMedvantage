import React,{ FC } from 'react';
import { useDrag } from 'react-dnd';

interface DraggableTableProps {
    id: string;
    name: string;
}

const DraggableTable: FC<DraggableTableProps> = ({ id, name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TABLE',
    item: { id, name },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>{name}</div>;
};

export default DraggableTable;
