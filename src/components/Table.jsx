import React from 'react';
import { colors } from '../colors';

const Table = ({ headers, rows, highlightCol }) => (
  <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '10px 16px', textAlign: i === 0 ? 'left' : 'right',
              fontSize: '11px', fontWeight: 600, color: colors.textDim,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              borderBottom: `1px solid ${colors.divider}`,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : `${colors.cardBorder}30` }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: '10px 16px', textAlign: ci === 0 ? 'left' : 'right',
                fontFamily: ci > 0 ? "'JetBrains Mono', monospace" : 'inherit',
                fontSize: '12px', borderBottom: `1px solid ${colors.divider}`,
                color: ci === highlightCol ? colors.accent : (row.bold ? colors.text : colors.textMuted),
                fontWeight: row.bold ? 700 : 400,
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
