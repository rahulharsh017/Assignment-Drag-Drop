
import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { ArcherContainer, ArcherElement } from 'react-archer';
import Card from './Card';
import Pop from './Pop';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCardText, setNewCardText] = useState('');
  const [sourceId, setSourceId] = useState(null);
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem('cards'));
    if (storedCards) {
      setCards(storedCards);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (newCardText.trim() === '') return;

    const newCard = {
      id: `${cards.length + 1}`,
      text: newCardText,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
    };
    console.log('Adding Card:', newCard); // Log card details
    setCards([...cards, newCard]);
    setNewCardText('');
  };

  const updateCardPosition = (id, x, y) => {
    setCards(cards.map(card => (card.id === id ? { ...card, position: { x, y } } : card)));
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      updateCardPosition(card.id, card.position.x + delta.x, card.position.y + delta.y);
    }
  };

  const addRelation = (targetId) => {
    if (sourceId && targetId !== sourceId) {
      const newRelation = {
        sourceId,
        targetId,
        sourceAnchor: 'bottom',
        targetAnchor: 'top',
        style: { strokeColor: 'blue', strokeWidth: 2 },
      };
      console.log('Adding Relation:', newRelation); // Log relation details
      setRelations((prevRelations) => [...prevRelations, newRelation]);
      setSourceId(null);
    }
  };

  const handleCardClick = (cardId) => {
    if (!sourceId) {
      setSourceId(cardId);
    } else {
      addRelation(cardId);
    }
  };

  return (
    <div className="canvas-container">
      <div className="add-card-container">
        <input
          type="text"
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          placeholder="Enter card text"
        />
        <button onClick={addCard}>Add Card</button>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <ArcherContainer strokeColor="black">
          <div className="canvas">
            {cards.map((card) => (
              <ArcherElement
                key={card.id}
                id={card.id}
                relations={relations
                  .filter(rel => rel.sourceId === card.id)
                  .map(rel => ({
                    targetId: rel.targetId,
                    targetAnchor: rel.targetAnchor,
                    sourceAnchor: rel.sourceAnchor,
                    style: rel.style,
                  }))
                }
              >
                <Card
                  card={card}
                  onShowMore={() => setSelectedCard(card)}
                  onClick={() => handleCardClick(card.id)}
                />
              </ArcherElement>
            ))}
          </div>
        </ArcherContainer>
      </DndContext>
      {selectedCard && (
        <Pop
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default Canvas;
