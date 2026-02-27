import React from 'react';
import { colors } from '../colors';
import CollapsibleCard from '../components/CollapsibleCard';
import Table from '../components/Table';
import CodeBlock from '../components/CodeBlock';
import useInView from '../hooks/useInView';

const PipelineStep = ({ label, sub, color, isLast }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, border: `2px solid ${color}40` }} />
      {!isLast && <div style={{ width: '2px', height: '32px', background: `${color}30` }} />}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '2px' }}>{sub}</div>}
    </div>
  </div>
);

const SwingDetection = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });

  const pipelineSteps = [
    { label: 'Load .pkl', sub: '17 keypoints × N frames', color: colors.accent },
    { label: 'Extract wrist x,y', sub: 'Indices 9 (left), 10 (right)', color: colors.accent },
    { label: 'Interpolate', sub: 'Fill low-confidence gaps', color: colors.green },
    { label: 'Combine x + y', sub: 'Single signal per wrist', color: colors.green },
    { label: 'Savitzky-Golay smooth', sub: 'Window=9, poly=3', color: colors.purple },
    { label: 'scipy.find_peaks', sub: 'Prominence + distance filters', color: colors.purple },
    { label: 'Filter chain', sub: 'Amplitude, spacing, edge removal', color: colors.amber },
    { label: 'Backswing apex frames', sub: 'Peak frame indices', color: colors.rose },
    { label: 'Search downswing', sub: 'Velocity minimum → contact frames', color: colors.rose },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <div ref={headerRef} style={{ marginBottom: '32px', opacity: headerInView ? 1 : 0, transform: headerInView ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px', background: `linear-gradient(135deg, ${colors.text}, ${colors.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Swing Detection</h1>
        <p style={{ color: colors.textDim, fontSize: '14px', margin: 0 }}>Signal processing on wrist keypoints to find backswings and contacts</p>
      </div>

      {/* Overview */}
      <CollapsibleCard title="Overview" sub="Pure numpy/scipy — no OpenCV, no ML models" icon="&#127919;">
        <p style={{ fontSize: '13px', color: colors.textMuted, lineHeight: 1.6, marginBottom: '16px' }}>
          Takes a <code style={{ color: colors.accent, background: `${colors.accent}15`, padding: '1px 6px', borderRadius: '4px', fontSize: '12px' }}>.pkl</code> keypoint file and finds:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: `${colors.rose}06`, border: `1px solid ${colors.rose}15` }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.rose }}>Backswing apex frames</div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>Where the club reaches the top of the backswing</div>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: `${colors.green}06`, border: `1px solid ${colors.green}15` }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.green }}>Contact/impact frames</div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>Where the club hits the ball</div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: colors.textDim }}>Runs on Lambda CPU in ~13 seconds.</p>
      </CollapsibleCard>

      {/* Signal Pipeline */}
      <CollapsibleCard title="Signal Pipeline" sub="From raw keypoints to detected swings" icon="&#128200;">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            {pipelineSteps.map((step, i) => (
              <PipelineStep key={step.label} {...step} isLast={i === pipelineSteps.length - 1} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>Config Parameters</div>
            <CodeBlock>{`cfg = Config()
# cfg.savgol_window = 9       # Smoothing window
# cfg.savgol_poly = 3         # Polynomial order
# cfg.peak_prominence = 300   # Min peak height
# cfg.peak_distance = 300     # Min frames between peaks
# cfg.left_wrist = 9          # COCO-17 index
# cfg.right_wrist = 10        # COCO-17 index`}</CodeBlock>
            <p style={{ fontSize: '11px', color: colors.textDim, marginTop: '8px' }}>~40 tunable parameters in a frozen dataclass</p>
          </div>
        </div>
      </CollapsibleCard>

      {/* Data Structures */}
      <CollapsibleCard title="Detection Data Structures" sub="DetectionResult and ContactResult" icon="&#128202;">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.rose, marginBottom: '8px' }}>DetectionResult</div>
            <Table
              headers={['Field', 'Type']}
              rows={[
                ['name', 'str (video name)'],
                ['peak_frames', 'ndarray (apex indices)'],
                ['smoothed', 'ndarray (full signal)'],
                ['combined', 'ndarray (pre-smooth)'],
                ['fps', 'float'],
                ['total_frames', 'int'],
                ['filter_log', 'list (trace)'],
                ['pkl_data', 'dict (keypoints)'],
              ]}
            />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.green, marginBottom: '8px' }}>ContactResult</div>
            <Table
              headers={['Field', 'Type']}
              rows={[
                ['name', 'str (video name)'],
                ['contact_frames', 'ndarray (-1 if not found)'],
                ['backswing_result', 'DetectionResult'],
                ['smoothed', 'ndarray'],
              ]}
            />
          </div>
        </div>
      </CollapsibleCard>

      {/* Lambda */}
      <CollapsibleCard title="Lambda Deployment" sub="Triggered by S3 .pkl suffix events" icon="&#9889;">
        <CodeBlock title="lambda_handler.py — simplified flow">{`def handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    # Download pkl from S3
    pkl_path = download_from_s3(bucket, key)

    # Run detection
    result = detect_backswings(pkl_path)
    contact = detect_contacts(result)

    # Upload JSON to S3 /detection/
    upload_json(bucket, key, result, contact)

    # Write to DynamoDB
    write_to_dynamo(result, contact)`}</CodeBlock>
      </CollapsibleCard>
    </div>
  );
};

export default SwingDetection;
