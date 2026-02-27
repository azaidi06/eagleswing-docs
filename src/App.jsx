import React, { useState } from 'react';
import { colors } from './colors';
import Overview from './pages/Overview';
import PipelineFlow from './pages/PipelineFlow';
import LabelVideos from './pages/LabelVideos';
import SwingDetection from './pages/SwingDetection';
import Analysis from './pages/Analysis';
import DeployCosts from './pages/DeployCosts';
import DataFormats from './pages/DataFormats';

const TABS = [
  { id: 'overview', label: 'Overview', component: Overview },
  { id: 'pipeline', label: 'Pipeline Flow', component: PipelineFlow },
  { id: 'label', label: 'Label Videos', component: LabelVideos },
  { id: 'swing', label: 'Swing Detection', component: SwingDetection },
  { id: 'analysis', label: 'Analysis', component: Analysis },
  { id: 'deploy', label: 'Deploy & Costs', component: DeployCosts },
  { id: 'data', label: 'Data Formats', component: DataFormats },
];

export default function App() {
  const [active, setActive] = useState('overview');
  const ActiveComponent = TABS.find(t => t.id === active).component;

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <nav style={{
        background: colors.card, borderBottom: `1px solid ${colors.cardBorder}`,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 16px',
          display: 'flex', alignItems: 'center', height: '56px', gap: '24px',
        }}>
          <span style={{
            fontFamily: "'DM Sans', -apple-system, sans-serif", fontWeight: 700,
            fontSize: '18px', color: colors.text, letterSpacing: '-0.01em', flexShrink: 0,
          }}>
            EagleSwing
          </span>
          <div style={{ display: 'flex', gap: '4px', overflow: 'auto' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActive(tab.id)} style={{
                padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                fontFamily: "'DM Sans', -apple-system, sans-serif", whiteSpace: 'nowrap',
                border: active === tab.id ? `1px solid ${colors.accent}40` : '1px solid transparent',
                background: active === tab.id ? `${colors.accent}15` : 'transparent',
                color: active === tab.id ? colors.accent : colors.textDim,
                cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div style={{ fontFamily: "'DM Sans', 'SF Pro Display', -apple-system, sans-serif", color: colors.text }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
