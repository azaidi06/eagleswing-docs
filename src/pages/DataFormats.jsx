import React from 'react';
import { colors } from '../colors';
import CollapsibleCard from '../components/CollapsibleCard';
import Table from '../components/Table';
import CodeBlock from '../components/CodeBlock';
import useInView from '../hooks/useInView';

const DataFormats = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });

  const cocoMap = [
    [0, 'Nose'], [1, 'Left Eye'], [2, 'Right Eye'], [3, 'Left Ear'], [4, 'Right Ear'],
    [5, 'Left Shoulder'], [6, 'Right Shoulder'], [7, 'Left Elbow'], [8, 'Right Elbow'],
    [9, 'Left Wrist'], [10, 'Right Wrist'], [11, 'Left Hip'], [12, 'Right Hip'],
    [13, 'Left Knee'], [14, 'Right Knee'], [15, 'Left Ankle'], [16, 'Right Ankle'],
  ];

  const s3Patterns = [
    ['{golfer}/raw/{filename}.MOV', 'Original iPhone upload'],
    ['{golfer}/processed/{filename}.mp4', 'Transcoded H.264 CFR'],
    ['{golfer}/keypoints/{filename}.pkl', 'ViTPose keypoints'],
    ['{golfer}/detection/{filename}.json', 'Swing detection results'],
    ['{golfer}/fingers/{filename}.json', 'Finger predictions'],
    ['{golfer}/frames/{filename}_frame_{N}.jpg', 'Skeleton overlay frames'],
    ['{golfer}/output/{filename}_grid.jpg', 'Swing grid visualization'],
    ['{golfer}/analysis/{golfer}_{day}.png', 'Biomechanical comparison plot'],
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <div ref={headerRef} style={{ marginBottom: '32px', opacity: headerInView ? 1 : 0, transform: headerInView ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px', background: `linear-gradient(135deg, ${colors.text}, ${colors.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Data Formats</h1>
        <p style={{ color: colors.textDim, fontSize: '14px', margin: 0 }}>PKL structure, JSON schemas, and keypoint conventions</p>
      </div>

      {/* PKL */}
      <CollapsibleCard title="PKL Keypoint Files" sub="Core data artifact \u2014 one per video" icon="&#128230;">
        <CodeBlock title="Structure">{`{
    "frame_0": {
        "keypoints": np.ndarray(17, 2),       # COCO-17 (x, y) per frame
        "keypoint_scores": np.ndarray(17,),    # Confidence [0, 1] per joint
        "bbox": [x1, y1, x2, y2]              # Person bounding box
    },
    "frame_1": {...},
    ...
    "__meta__": {
        "fps": 60.0,
        "total_frames": 3000,
        "width": 1080,
        "height": 1920,
        "n_pkl_frames": 3000
    }
}`}</CodeBlock>
      </CollapsibleCard>

      {/* COCO Map */}
      <CollapsibleCard title="COCO-17 Keypoint Map" icon="&#129524;">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            {cocoMap.slice(0, 9).map(([idx, name]) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: `1px solid ${colors.divider}` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 600, color: colors.accent, minWidth: '24px', textAlign: 'right' }}>{idx}</span>
                <span style={{ fontSize: '13px', color: colors.textMuted }}>{name}</span>
              </div>
            ))}
          </div>
          <div>
            {cocoMap.slice(9).map(([idx, name]) => {
              const isWrist = idx === 9 || idx === 10;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: `1px solid ${colors.divider}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 600, color: isWrist ? colors.rose : colors.accent, minWidth: '24px', textAlign: 'right' }}>{idx}</span>
                  <span style={{ fontSize: '13px', color: isWrist ? colors.text : colors.textMuted, fontWeight: isWrist ? 600 : 400 }}>{name}</span>
                  {isWrist && <span style={{ fontSize: '10px', color: colors.rose, background: `${colors.rose}15`, padding: '2px 8px', borderRadius: '4px' }}>swing signal</span>}
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleCard>

      {/* Detection JSON */}
      <CollapsibleCard title="Detection JSON" sub="Produced by swing_detection Lambda" icon="&#128196;">
        <CodeBlock>{`{
    "video_name": "IMG_1016",
    "golfer": "stef",
    "fps": 60.0,
    "total_frames": 5821,
    "backswing_frames": [450, 1200, 2100, 3050, 3900],
    "contact_frames": [520, 1270, 2170, 3120, 3970],
    "num_swings": 5,
    "detection_config": {
        "savgol_window": 9,
        "peak_prominence": 300,
        "peak_distance": 300
    },
    "timestamp": "2024-11-16T14:30:00Z"
}`}</CodeBlock>
      </CollapsibleCard>

      {/* Hand Finder */}
      <CollapsibleCard title="Hand Finder Result" icon="&#9996;">
        <CodeBlock>{`{
    "video_name": "IMG_1016",
    "hand_frames": [[3950, 4100], null, [5200, 5350]],
    "representative_frames": [4025, null, 5275],
    "raised_side": ["LEFT", null, "LEFT"],
    "classifications": ["scored_swing", "no_hand_raise", "scored_swing"],
    "finger_counts": [4, null, 3]
}`}</CodeBlock>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
          {[
            { field: 'hand_frames', desc: '[start, end] frame range, or null' },
            { field: 'representative_frames', desc: 'Best frame for finger counting' },
            { field: 'raised_side', desc: 'LEFT or RIGHT hand raised' },
            { field: 'finger_counts', desc: 'Predicted fingers shown (score)' },
          ].map(item => (
            <div key={item.field} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', padding: '6px 0' }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: colors.accent, flexShrink: 0 }}>{item.field}</code>
              <span style={{ fontSize: '11px', color: colors.textDim }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      {/* DynamoDB */}
      <CollapsibleCard title="DynamoDB Schema" sub="Table: golf-swing-detections" icon="&#128218;">
        <Table
          headers={['Attribute', 'Type', 'Description']}
          rows={[
            ['golfer', 'String (PK)', 'Golfer name'],
            ['video_name', 'String (SK)', 'Video identifier'],
            ['timestamp', 'String', 'ISO 8601 detection time'],
            ['num_swings', 'Number', 'Detected swing count'],
            ['backswing_frames', 'List[Number]', 'Apex frame indices'],
            ['contact_frames', 'List[Number]', 'Impact frame indices'],
            ['finger_predictions', 'List[Object]', 'Added by post_processing'],
          ]}
        />
      </CollapsibleCard>

      {/* S3 Key Patterns */}
      <CollapsibleCard title="S3 Key Patterns" icon="&#128193;">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {s3Patterns.map(([pattern, desc]) => (
            <div key={pattern} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px', borderRadius: '8px', background: `${colors.cardBorder}30` }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: colors.accent, flex: '0 0 auto', minWidth: '320px' }}>{pattern}</code>
              <span style={{ fontSize: '12px', color: colors.textMuted }}>{desc}</span>
            </div>
          ))}
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default DataFormats;
