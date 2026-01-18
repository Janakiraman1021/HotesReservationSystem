'use client';

/**
 * Control panel for booking actions
 */

export function Controls({
  inputValue,
  onInputChange,
  onBook,
  onRandomize,
  onReset,
}) {
  const isBookDisabled = inputValue < 1 || inputValue > 5;

  return (
    <div
      style={{
        backgroundColor: '#0f1629',
        padding: '32px',
        borderBottom: '1px solid #1a2749',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 1 auto' }}>
        <label htmlFor="roomCount" style={{ fontWeight: '500', color: '#f0f4ff', fontSize: '14px' }}>
          Number of rooms (1–5):
        </label>
        <input
          id="roomCount"
          type="number"
          min="1"
          max="5"
          value={inputValue}
          onChange={(e) => onInputChange(parseInt(e.target.value) || 1)}
          style={{
            width: '70px',
            padding: '8px 12px',
            border: '1px solid #00d4ff',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#1a2749',
            color: '#f0f4ff',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 8px rgba(0, 212, 255, 0.2)',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onBook}
          disabled={isBookDisabled}
          style={{
            padding: '10px 24px',
            backgroundColor: isBookDisabled ? '#1a2749' : '#00d4ff',
            color: isBookDisabled ? '#a0afc9' : '#0a0e27',
            border: '1px solid #00d4ff',
            borderRadius: '6px',
            cursor: isBookDisabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: isBookDisabled ? 'none' : '0 0 12px rgba(0, 212, 255, 0.4)',
          }}
          onMouseEnter={(e) => {
            if (!isBookDisabled) {
              e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isBookDisabled) {
              e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.4)';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          Book Rooms
        </button>

        <button
          onClick={onRandomize}
          style={{
            padding: '10px 24px',
            backgroundColor: 'transparent',
            color: '#00ff88',
            border: '1px solid #00ff88',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 12px rgba(0, 255, 136, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
            e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 12px rgba(0, 255, 136, 0.2)';
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Random Occupancy
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '10px 24px',
            backgroundColor: 'transparent',
            color: '#ff1744',
            border: '1px solid #ff1744',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 12px rgba(255, 23, 68, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.5)';
            e.target.style.backgroundColor = 'rgba(255, 23, 68, 0.1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 12px rgba(255, 23, 68, 0.2)';
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
