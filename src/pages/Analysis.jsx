import React from 'react';
import { colors } from '../colors';
import CollapsibleCard from '../components/CollapsibleCard';
import Table from '../components/Table';
import CodeBlock from '../components/CodeBlock';
import useInView from '../hooks/useInView';

const Analysis = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });

  const metrics = {
    Rotation: ['Shoulder Turn', 'Hip Turn', 'X-Factor', 'X-Factor Stretch'],
    Posture: ['Spine Angle', 'Shoulder Tilt', 'Forward Bend'],
    Linear: ['Hip Sway', 'Head Height', 'Weight Shift'],
  };

  const metricColors = { Rotation: colors.accent, Posture: colors.purple, Linear: colors.green };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <div ref={headerRef} style={{ marginBottom: '32px', opacity: headerInView ? 1 : 0, transform: headerInView ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px', background: `linear-gradient(135deg, ${colors.text}, ${colors.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Biomechanical Analysis</h1>
        <p style={{ color: colors.textDim, fontSize: '14px', margin: 0 }}>Swing comparison, metrics, and statistical analysis</p>
      </div>

      {/* Overview */}
      <CollapsibleCard title="Overview" sub="Keypoint pkls + detection results \u2192 analysis" icon="&#128202;">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { title: 'Metric Extraction', desc: 'Shoulder turn, hip rotation, X-factor, spine angle', color: colors.accent },
            { title: 'SPM Comparison', desc: 'Statistical Parametric Mapping between swing groups', color: colors.purple },
            { title: 'Medoid Selection', desc: 'Most representative swing from a set', color: colors.green },
            { title: 'Visualization', desc: 'Overlay plots, metric time series, comparison grids', color: colors.amber },
          ].map(item => (
            <div key={item.title} style={{ padding: '14px 16px', borderRadius: '10px', background: `${item.color}06`, border: `1px solid ${item.color}15` }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: colors.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* Entry Points */}
      <CollapsibleCard title="Entry Points" icon="&#128187;">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CodeBlock title="CLI pipeline (headless)">{`python -m analyze.pipeline --golfer stef --no-gemini --no-pushover`}</CodeBlock>
          <CodeBlock title="With day filter and phase selection">{`python -m analyze.pipeline --golfer ymirza --day oct25 --phases backswing downswing`}</CodeBlock>
          <CodeBlock title="Streamlit dashboard">{`streamlit run analyze/new_dashboard.py`}</CodeBlock>
        </div>
      </CollapsibleCard>

      {/* Metrics */}
      <CollapsibleCard title="Metrics Computed" sub="Per-frame across swing phases" icon="&#128207;">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Object.entries(metrics).map(([category, items]) => (
            <div key={category} style={{ padding: '16px', borderRadius: '12px', background: `${metricColors[category]}06`, border: `1px solid ${metricColors[category]}15` }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: metricColors[category], marginBottom: '10px' }}>{category}</div>
              {items.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: metricColors[category] }} />
                  <span style={{ fontSize: '12px', color: colors.textMuted }}>{m}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: colors.textDim, marginTop: '14px', lineHeight: 1.6 }}>
          Each metric is computed per-frame across a swing phase, producing time series that can be compared statistically.
        </p>
      </CollapsibleCard>

      {/* Pipeline */}
      <CollapsibleCard title="Analysis Pipeline Flow" sub="From CSV index to published results" icon="&#128260;">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { step: 'CSV index', desc: 'golfer, day, pkls', color: colors.textDim },
            { step: 'Load pkl + detection', desc: 'Per swing', color: colors.accent },
            { step: 'Phase extraction', desc: 'Backswing / downswing', color: colors.accent },
            { step: 'Time normalization', desc: '0-100% of phase', color: colors.green },
            { step: 'Metric computation', desc: 'Rotation, posture, linear', color: colors.green },
            { step: 'Medoid selection', desc: 'Most representative swing', color: colors.purple },
            { step: 'SPM t-test', desc: 'Group comparison', color: colors.purple },
            { step: 'Render + upload', desc: 'S3 /analysis/ + Pushover', color: colors.amber },
          ].map((item, i) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px', borderRadius: '8px', background: `${item.color}06`, border: `1px solid ${item.color}12` }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: item.color, minWidth: '20px' }}>{i + 1}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text, minWidth: '140px' }}>{item.step}</span>
              <span style={{ fontSize: '11px', color: colors.textDim }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* Key Functions */}
      <CollapsibleCard title="Key Functions" icon="&#128736;">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <CodeBlock title="analyze/core.py">{`# Load and prepare swing data
load_golfer_data(csv_path, golfer, data_dir,
                 back_frames, down_frames, day_filter)

# Build SwingData objects from dataframe
build_swing_items(df)  # \u2192 List[SwingData]

# Find most representative swing
resolve_group_by_score(items, score_range)

# SPM comparison
spm_compare(group_a, group_b, metrics)`}</CodeBlock>
          </div>
          <div>
            <CodeBlock title="analyze/plots.py">{`# Main rendering function
render_analysis_figure(
    src_items,        # Source swing group
    tgt_items,        # Target swing group
    phases,           # ["backswing", "downswing"]
    metrics,          # Which metrics to plot
    config            # PlotConfig (colors, sizes)
)  # \u2192 matplotlib Figure`}</CodeBlock>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default Analysis;
