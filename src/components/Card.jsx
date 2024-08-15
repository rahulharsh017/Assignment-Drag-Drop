// src/components/DraggableCard.js
import React, { forwardRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const Card = ({ card, onShowMore }) => {
  const [isResizing, setIsResizing] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    disabled: isResizing,  
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: 'absolute',
    top: card.position.y,
    left: card.position.x,
    cursor: isResizing ? 'default' : 'grab',
  };

  const handleResizeStart = (e) => {
    setIsResizing(true);
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isResizing && listeners)} 
      {...attributes}
      className="draggable-card"
    >
      <ResizableBox
        width={card.size.width}
        height={card.size.height}
        minConstraints={[100, 100]}
        maxConstraints={[400, 400]}
        className="card"
        onResizeStart={handleResizeStart} 
        onResizeStop={() => setIsResizing(false)} 
      >
        <div
        id={card.id}>
          <p>{card.text.slice(0, 50)}...</p>
          <button className='show-more' onClick={onShowMore}>Show More</button>
        </div>
      </ResizableBox>
    </div>
  );
};

export default Card;
