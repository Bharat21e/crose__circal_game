
'use client';

import { useState } from 'react';
import MarkIcon from './Marks';
import Game from './Game';
import type { Mark } from '@/lib/game';

export default function PageContent() {

  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);

  function handleSelect(mark: Mark): void {
    setSelectedMark(mark);
  }

  return (
    <main>

      {!selectedMark ? (

        <section className="choose-mark">

          <h1>Welcome to Cross Circle Game</h1>

          <h2>Choose your mark</h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px'
            }}
          >

            <button
              onClick={() => handleSelect('cross')}
              style={{
                backgroundColor: '#14213d',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer'
              }}
            >
              <MarkIcon mark="cross" />
            </button>

            <button
              onClick={() => handleSelect('circle')}
              style={{
                backgroundColor: '#14213d',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer'
              }}
            >
              <MarkIcon mark="circle" />
            </button>

          </div>

        </section>

      ) : (

        <Game selectedMark={selectedMark} />

      )}

    </main>
  );
}
