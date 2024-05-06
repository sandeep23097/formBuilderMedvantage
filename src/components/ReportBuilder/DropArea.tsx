import React,{ FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';

interface DropAreaProps {
    onDrop: (item: any) => void;
    type: string;
    children?: ReactNode;
}

const DropArea: FC<DropAreaProps> = ({ onDrop, type, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} style={{ minHeight: '50px', width: '100%', backgroundColor: isOver ? '#ccc' : '#eee' }}>
      {children}
    </div>
  );
};

export default DropArea;
