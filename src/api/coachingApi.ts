// CricVerse AI Coaching Platform Mock Database & API Types

export interface Joint {
  x: number;
  y: number;
  name: string;
}

export interface Skeleton {
  head: Joint;
  neck: Joint;
  leftShoulder: Joint;
  rightShoulder: Joint;
  leftElbow: Joint;
  rightElbow: Joint;
  leftWrist: Joint;
  rightWrist: Joint;
  leftHip: Joint;
  rightHip: Joint;
  leftKnee: Joint;
  rightKnee: Joint;
  leftAnkle: Joint;
  rightAnkle: Joint;
  batTip?: Joint; // For batting sessions
  ballPosition?: Joint; // For bowling sessions
}

export interface MetricBreakdown {
  setup: number;
  backswing: number;
  contact: number;
  followThrough: number;
}

export interface Session {
  id: string;
  type: 'batting' | 'bowling';
  title: string;
  date: string;
  thumbnail: string;
  videoUrl: string;
  overallScore: number;
  metrics: MetricBreakdown;
  critique: {
    setup: string;
    backswing: string;
    contact: string;
    followThrough: string;
  };
  recommendations: string[];
  proCompare: {
    name: string;
    avgScore: number;
    videoUrl: string;
    avatar: string;
    elbowAngleDiff: number;
  };
}

export interface Drill {
  id: string;
  title: string;
  category: 'batting' | 'bowling' | 'posture' | 'footwork';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  reps: string;
  description: string;
  targetMetric: string;
  steps: string[];
  videoMockPlaceholder: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  sessionsCount: number;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CoachReview {
  id: string;
  coachName: string;
  coachAvatar: string;
  coachTitle: string;
  date: string;
  audioFeedbackUrl: string; // Mocked
  audioDuration: string;
  writtenFeedback: string;
  sessionTitle: string;
  sessionId: string;
}

// ----------------------------------------------------
// Mock Databases
// ----------------------------------------------------

export const mockSessions: Session[] = [
  {
    id: "s-1",
    type: "batting",
    title: "Cover Drive Analysis - Session 4",
    date: "July 08, 2026",
    thumbnail: "https://images.unsplash.com/photo-1540747737956-37872c76d1fd?w=400&h=225&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-34351-large.mp4", // Mock stock video
    overallScore: 84,
    metrics: {
      setup: 92,
      backswing: 85,
      contact: 76,
      followThrough: 83
    },
    critique: {
      setup: "Excellent front stance. Stance width is within the 90-100% optimal range of shoulder width. Head is level and eye line is flat.",
      backswing: "Clean backlift, though slightly angled toward third slip. Hands are high, providing good potential kinetic energy.",
      contact: "Elbow angle is 84° at impact, which is slightly closed/low. This causes a premature rolling of the wrists, limiting loft control and power. Front foot is aligned with the ball's pitch line.",
      followThrough: "High elbow follow-through is stable. Weight distribution was 70% forward, slightly falling off-balance towards the off-side."
    },
    recommendations: [
      "Keep the front elbow pointed high towards the bowler during the downswing.",
      "Practice the 'Stance-to-Impact Lock' drill to build muscle memory for a 105° elbow extension.",
      "Focus on driving weight straight down the pitch rather than leaning towards cover-point."
    ],
    proCompare: {
      name: "Virat Kohli",
      avgScore: 98,
      videoUrl: "",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop",
      elbowAngleDiff: -21 // You are 21 deg lower than Kohli's ideal drive
    }
  },
  {
    id: "s-2",
    type: "bowling",
    title: "Outswing Seam Release - Session 2",
    date: "July 05, 2026",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=225&fit=crop",
    videoUrl: "",
    overallScore: 78,
    metrics: {
      setup: 80,
      backswing: 72,
      contact: 85,
      followThrough: 75
    },
    critique: {
      setup: "Runup acceleration is progressive. Stride length is consistent but shows minor stuttering on step 6.",
      backswing: "Gather is slightly low. Back knee flexes more than the recommended 15°, causing a loss of ground reaction force.",
      contact: "Excellent release angle of 172° (nearly straight arm). Seam index is tilted 15° towards first slip, which is perfect for outswing. Wrist flick speed was clocked at 42 rad/sec.",
      followThrough: "Deceleration path is short. Stopping within 3 steps puts extra load on the lumbar region. Action needs a longer lateral run-off."
    },
    recommendations: [
      "Incorporate front-leg brace exercises to stop knee buckling at loading.",
      "Work on a 4-step deceleration run-off to reduce lumbar spine stress.",
      "Align the non-bowling arm directly with the target during gather."
    ],
    proCompare: {
      name: "Jasprit Bumrah",
      avgScore: 96,
      videoUrl: "",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      elbowAngleDiff: 8 // Bumrah releases slightly lower but with extreme wrist snap
    }
  },
  {
    id: "s-3",
    type: "batting",
    title: "Pull Shot Posture Check",
    date: "June 28, 2026",
    thumbnail: "https://images.unsplash.com/photo-1624898191707-b4305701d527?w=400&h=225&fit=crop",
    videoUrl: "",
    overallScore: 91,
    metrics: {
      setup: 94,
      backswing: 88,
      contact: 92,
      followThrough: 90
    },
    critique: {
      setup: "Ready position has excellent bounce. Head stays tracking the short ball trajectory.",
      backswing: "Fast hand speed backward. Weight transfers 80% to the backfoot cleanly.",
      contact: "Excellent high-to-low swing path. Rolled the wrists at the perfect instant to keep the ball on the turf. Contact point is well in front of the body.",
      followThrough: "Complete, balanced rotational follow-through around the body without falling."
    },
    recommendations: [
      "Keep visual track of the ball all the way to the bat face to avoid top edges on quicker bouncers.",
      "Maintain the high chest posture throughout the roll."
    ],
    proCompare: {
      name: "Travis Head",
      avgScore: 94,
      videoUrl: "",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      elbowAngleDiff: 3
    }
  }
];

export const mockDrills: Drill[] = [
  {
    id: "d-1",
    title: "High Elbow Cover Drive Lock",
    category: "batting",
    difficulty: "Beginner",
    duration: "15 Mins",
    reps: "3 sets x 15 drives",
    description: "Build muscle memory for the optimal front-elbow elevation (95°-110°) during cover drives to hit the ball cleanly along the ground.",
    targetMetric: "Elbow Position & Downswing Path",
    steps: [
      "Set up a batting tee 1 step in front of your normal batting stance.",
      "Assume stance, lift the bat to high backswing.",
      "Step forward with your lead foot next to the tee, ensuring your toe points towards mid-off.",
      "Swing down, focusing on keeping the lead elbow pointing straight towards the target (mid-off/cover).",
      "Hold the contact position for 2 seconds and check your elbow in a mirror or camera. It should be bent at roughly 100° and higher than your wrists."
    ],
    videoMockPlaceholder: "https://images.unsplash.com/photo-1540747737956-37872c76d1fd?w=600&h=400&fit=crop"
  },
  {
    id: "d-2",
    title: "Front Knee Bracing Wall",
    category: "bowling",
    difficulty: "Intermediate",
    duration: "20 Mins",
    reps: "4 sets x 10 loading hops",
    description: "Stabilize and brace the front leg upon landing to transfer maximal ground kinetic energy up to the shoulder and ball release.",
    targetMetric: "Brace Knee Angle & Release Speed",
    steps: [
      "Stand 2 steps back from a soft landing mat.",
      "Perform a short gather jump, landing on your back foot, then planting your front foot.",
      "Focus purely on locking the front knee (maximum 5° bend) at landing.",
      "Do not deliver the ball; instead, absorb the forward momentum with a braced leg, letting your upper body hinge over the hip joint.",
      "Repeat with a medicine ball to increase core stabilization."
    ],
    videoMockPlaceholder: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop"
  },
  {
    id: "d-3",
    title: "Under-Arm Swing Path Lock",
    category: "footwork",
    difficulty: "Beginner",
    duration: "10 Mins",
    reps: "5 sets x 10 reps",
    description: "Correct the swing path trajectory from backswing to follow-through, preventing cross-batting on straight deliveries.",
    targetMetric: "Downswing Path Alignment",
    steps: [
      "Stand inside a narrow corridor or next to a wall (on your off-side).",
      "Practice your straight drive shadow swing.",
      "Keep the bat path perfectly parallel to the wall, avoiding scraping the wall on backswing or follow-through.",
      "This forces a straight, vertical bat presentation."
    ],
    videoMockPlaceholder: "https://images.unsplash.com/photo-1624898191707-b4305701d527?w=600&h=400&fit=crop"
  }
];

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Prithvi Raj", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", sessionsCount: 42, overallScore: 94.2, trend: "up" },
  { rank: 2, name: "Liam O'Connor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", sessionsCount: 30, overallScore: 91.5, trend: "up" },
  { rank: 3, name: "You (Lawrence)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", sessionsCount: 8, overallScore: 84.0, trend: "stable" },
  { rank: 4, name: "Shaun Marsh", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", sessionsCount: 19, overallScore: 83.8, trend: "down" },
  { rank: 5, name: "Zane Malik", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop", sessionsCount: 25, overallScore: 81.2, trend: "up" }
];

export const mockCoachReviews: CoachReview[] = [
  {
    id: "r-1",
    coachName: "Brett Lee",
    coachAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    coachTitle: "Fast Bowling Legend & CricVerse Elite Coach",
    date: "July 06, 2026",
    audioFeedbackUrl: "#",
    audioDuration: "1:42",
    writtenFeedback: "Lawrence, your wrist snap looks sharp here, and your speed is climbing! However, the AI correctly identified that your front knee is buckling slightly at plant. Focus on locking that knee during your drills. I've left some custom markers on your frame-40 load phase. Keep it up!",
    sessionTitle: "Outswing Seam Release - Session 2",
    sessionId: "s-2"
  },
  {
    id: "r-2",
    coachName: "Kumar Sangakkara",
    coachAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    coachTitle: "Master Batsman & CricVerse Strategy Director",
    date: "July 01, 2026",
    audioFeedbackUrl: "#",
    audioDuration: "2:15",
    writtenFeedback: "Hello Lawrence. Looking at your Cover Drive session, your footwork is actually very clean. The key adjustment is hands-related: keep that elbow high. The AI's warning about the low wrist flick is accurate. Try the shadow batting drills next wall-side. Excellent posture otherwise.",
    sessionTitle: "Cover Drive Analysis - Session 4",
    sessionId: "s-1"
  }
];

// ----------------------------------------------------
// Skeletal Simulation Engine
// ----------------------------------------------------
// Generates fully animated 2D skeleton joints for batting or bowling actions,
// depending on a frame parameter (0 to 100).
// x, y are scaled from 0 to 400 (for a 400x400 canvas viewport)
export const getSkeletalFrame = (type: 'batting' | 'bowling', frame: number): Skeleton => {
  const t = frame / 100; // normalized time 0.0 -> 1.0

  if (type === 'batting') {
    // ----------------------------------------------------
    // BATTING COVER DRIVE SIMULATION
    // ----------------------------------------------------
    // Stance -> Backswing -> Downswing -> Impact -> Follow-through

    let headX = 200;
    let headY = 100;
    let stanceOffset = 0;
    
    // Front foot stride forward
    let frontFootOffset = 0;
    let torsoLean = 0;

    // Bat Angle
    let batAngle = 90; // degrees from horizontal
    let batLength = 55;

    if (t < 0.25) {
      // Phase 1: Stance (0 - 25)
      const p = t / 0.25; // 0 -> 1
      stanceOffset = p * -10;
      headX = 200 + stanceOffset;
      headY = 100 + Math.sin(p * Math.PI) * 2;
      batAngle = 90 - p * 35; // lifts slightly
    } else if (t < 0.50) {
      // Phase 2: Backlift/Stride (25 - 50)
      const p = (t - 0.25) / 0.25; // 0 -> 1
      stanceOffset = -10 + p * -15;
      frontFootOffset = p * 40; // step forward
      torsoLean = p * 15; // lean head forward
      headX = 190 + p * -25;
      headY = 102 + p * 15;
      batAngle = 55 - p * 80; // High backlift (-25deg)
    } else if (t < 0.70) {
      // Phase 3: Downswing & Contact (50 - 70)
      const p = (t - 0.50) / 0.20; // 0 -> 1
      frontFootOffset = 40;
      torsoLean = 15 + p * 12;
      headX = 165 + p * -20;
      headY = 117 + p * 10;
      batAngle = -25 + p * 160; // Swings down to contact (135deg)
    } else {
      // Phase 4: Follow-Through (70 - 100)
      const p = (t - 0.70) / 0.30; // 0 -> 1
      frontFootOffset = 40;
      torsoLean = 27 - p * 10;
      headX = 145 + p * -10;
      headY = 127 - p * 15;
      batAngle = 135 + p * 90; // Finish wrap around shoulder (225deg)
    }

    // Joints computation
    const neckX = headX;
    const neckY = headY + 22;

    const shoulderL_X = neckX - 12;
    const shoulderL_Y = neckY + 8;
    const shoulderR_X = neckX + 12;
    const shoulderR_Y = neckY + 6;

    // Hips
    const hipL_X = 205 + stanceOffset;
    const hipL_Y = 220;
    const hipR_X = 225 + stanceOffset;
    const hipR_Y = 220;

    // Back leg (Right leg) - stays grounded
    const kneeR_X = hipR_X + 10;
    const kneeR_Y = 270;
    const ankleR_X = kneeR_X - 5;
    const ankleR_Y = 320;

    // Front leg (Left leg) - steps forward
    const kneeL_X = hipL_X - 15 + frontFootOffset * 0.4;
    const kneeL_Y = 265 + (frontFootOffset > 0 ? 10 : 0);
    const ankleL_X = hipL_X - 25 + frontFootOffset;
    const ankleL_Y = 320;

    // Arms & Bat logic
    // Batting hands will grip the bat handle
    let handX = 0;
    let handY = 0;

    if (t < 0.50) {
      // Stance & backlift: Hands near body
      handX = shoulderR_X - 10 + (stanceOffset * 0.5);
      handY = shoulderR_Y + 25 - (t * 40);
    } else if (t < 0.70) {
      // Downswing: hands move down/forward
      const p = (t - 0.50) / 0.20;
      handX = (shoulderR_X - 10 - 12) + p * -35;
      handY = (shoulderR_Y + 5) + p * 60;
    } else {
      // Followthrough: hands wrap high left
      const p = (t - 0.70) / 0.30;
      handX = -12 + (shoulderR_X - 45) + p * -10;
      handY = (shoulderR_Y + 65) - p * 90;
    }

    const wristR_X = handX;
    const wristR_Y = handY;
    const wristL_X = handX - 5;
    const wristL_Y = handY + 3;

    // Right elbow (Top Hand)
    const elbowR_X = (shoulderR_X + wristR_X) / 2 + 18 * Math.sin(t * Math.PI);
    const elbowR_Y = (shoulderR_Y + wristR_Y) / 2 + 20 * Math.cos(t * Math.PI);

    // Left elbow (Bottom Hand)
    const elbowL_X = (shoulderL_X + wristL_X) / 2 - 12 * Math.sin(t * Math.PI);
    const elbowL_Y = (shoulderL_Y + wristL_Y) / 2 + 25 * Math.cos(t * Math.PI);

    // Bat Tip position based on bat angle
    const angleRad = (batAngle * Math.PI) / 180;
    const batTipX = handX - batLength * Math.cos(angleRad);
    const batTipY = handY + batLength * Math.sin(angleRad);

    return {
      head: { x: headX, y: headY, name: "Head" },
      neck: { x: neckX, y: neckY, name: "Neck" },
      leftShoulder: { x: shoulderL_X, y: shoulderL_Y, name: "L_Shoulder" },
      rightShoulder: { x: shoulderR_X, y: shoulderR_Y, name: "R_Shoulder" },
      leftElbow: { x: elbowL_X, y: elbowL_Y, name: "L_Elbow" },
      rightElbow: { x: elbowR_X, y: elbowR_Y, name: "R_Elbow" },
      leftWrist: { x: wristL_X, y: wristL_Y, name: "L_Wrist" },
      rightWrist: { x: wristR_X, y: wristR_Y, name: "R_Wrist" },
      leftHip: { x: hipL_X, y: hipL_Y, name: "L_Hip" },
      rightHip: { x: hipR_X, y: hipR_Y, name: "R_Hip" },
      leftKnee: { x: kneeL_X, y: kneeL_Y, name: "L_Knee" },
      rightKnee: { x: kneeR_X, y: kneeR_Y, name: "R_Knee" },
      leftAnkle: { x: ankleL_X, y: ankleL_Y, name: "L_Ankle" },
      rightAnkle: { x: ankleR_X, y: ankleR_Y, name: "R_Ankle" },
      batTip: { x: batTipX, y: batTipY, name: "Bat Tip" }
    };
  } else {
    // ----------------------------------------------------
    // BOWLING ACTION SIMULATION
    // ----------------------------------------------------
    // Runup -> Load-up -> Release -> Follow-through

    let bodyX = 220;
    let bodyY = 160;
    let ballX = 0;
    let ballY = 0;

    let armAngle = 0; // bowling arm angle

    if (t < 0.30) {
      // Phase 1: Run-up/Gather (0 - 30)
      const p = t / 0.30;
      bodyX = 280 - p * 60;
      bodyY = 160 + Math.sin(p * Math.PI * 2) * 5; // slight bobbing
      armAngle = p * 120; // arm starts gathering
    } else if (t < 0.55) {
      // Phase 2: Load-up/Arch (30 - 55)
      const p = (t - 0.30) / 0.25;
      bodyX = 220 - p * 20;
      bodyY = 160 - p * 15; // spring upward
      armAngle = 120 + p * 150; // arm winds back behind body
    } else if (t < 0.75) {
      // Phase 3: Release (55 - 75)
      const p = (t - 0.55) / 0.20;
      bodyX = 200 - p * 30;
      bodyY = 145 + p * 25; // drop lower body forward
      armAngle = 270 + p * 180; // arm swings rapidly over head
    } else {
      // Phase 4: Follow-Through (75 - 100)
      const p = (t - 0.75) / 0.25;
      bodyX = 170 - p * 40;
      bodyY = 170 + p * 15;
      armAngle = 90 + p * 90; // arm wraps across body
    }

    const neckX = bodyX;
    const neckY = bodyY - 38;
    const headX = neckX;
    const headY = neckY - 22;

    const shoulderL_X = neckX - 15;
    const shoulderL_Y = neckY + 5;
    const shoulderR_X = neckX + 15;
    const shoulderR_Y = neckY + 5;

    const hipL_X = bodyX - 10;
    const hipL_Y = bodyY + 40;
    const hipR_X = bodyX + 10;
    const hipR_Y = bodyY + 40;

    // Legs
    let kneeL_X = hipL_X;
    let kneeL_Y = hipL_Y + 45;
    let ankleL_X = kneeL_X;
    let ankleL_Y = kneeL_Y + 50;

    let kneeR_X = hipR_X;
    let kneeR_Y = hipR_Y + 45;
    let ankleR_X = kneeR_X;
    let ankleR_Y = kneeR_Y + 50;

    // Add leg walking movement
    if (t < 0.55) {
      const legPhase = t * Math.PI * 6;
      kneeL_X += Math.sin(legPhase) * 15;
      kneeL_Y += Math.cos(legPhase) * 5;
      ankleL_X += Math.sin(legPhase) * 20;

      kneeR_X -= Math.sin(legPhase) * 15;
      kneeR_Y -= Math.cos(legPhase) * 5;
      ankleR_X -= Math.sin(legPhase) * 20;
    } else if (t < 0.75) {
      // Plant left foot braced, swing right foot forward
      const p = (t - 0.55) / 0.20;
      // Left leg (front plant)
      kneeL_X = hipL_X - 10;
      kneeL_Y = hipL_Y + 40; // braced
      ankleL_X = kneeL_X - 5;
      ankleL_Y = 320;

      // Right leg (back lift & swing)
      kneeR_X = hipR_X + 25 - p * 30;
      kneeR_Y = hipR_Y + 25 - p * 20;
      ankleR_X = kneeR_X + 15 - p * 40;
      ankleR_Y = 280 + p * 40;
    } else {
      // Followthrough deceleration steps
      const p = (t - 0.75) / 0.25;
      // Left leg (stays back now)
      ankleL_X = hipL_X - 30;
      ankleL_Y = 320;
      kneeL_X = (hipL_X + ankleL_X) / 2 + 10;
      kneeL_Y = (hipL_Y + ankleL_Y) / 2;

      // Right leg steps forward to ground
      ankleR_X = hipR_X - 50 * p;
      ankleR_Y = 320;
      kneeR_X = (hipR_X + ankleR_X) / 2;
      kneeR_Y = (hipR_Y + ankleR_Y) / 2 + 10;
    }

    // Arms
    // Left arm (non-bowling, starts high then pulls down to chest)
    let wristL_X = shoulderL_X - 30;
    let wristL_Y = shoulderL_Y - 20;
    if (t > 0.40 && t < 0.75) {
      const p = (t - 0.40) / 0.35;
      wristL_X = shoulderL_X + 10;
      wristL_Y = shoulderL_Y + 30 + p * 20;
    } else if (t >= 0.75) {
      wristL_X = shoulderL_X + 15;
      wristL_Y = shoulderL_Y + 45;
    }
    const elbowL_X = (shoulderL_X + wristL_X) / 2 - 10;
    const elbowL_Y = (shoulderL_Y + wristL_Y) / 2 + 5;

    // Right arm (Bowling arm, performs 360 degree circle)
    const armRad = (armAngle * Math.PI) / 180;
    const armLength = 55;
    const wristR_X = shoulderR_X + armLength * Math.cos(armRad);
    const wristR_Y = shoulderR_Y + armLength * Math.sin(armRad);
    
    // Straight bowling arm
    const elbowR_X = (shoulderR_X + wristR_X) / 2;
    const elbowR_Y = (shoulderR_Y + wristR_Y) / 2;

    // Ball release simulation
    if (t < 0.65) {
      // Ball in hand
      ballX = wristR_X;
      ballY = wristR_Y;
    } else {
      // Ball released, flies forward down-left
      const p = (t - 0.65) / 0.35;
      ballX = wristR_X - p * 150;
      ballY = wristR_Y + p * 70;
    }

    return {
      head: { x: headX, y: headY, name: "Head" },
      neck: { x: neckX, y: neckY, name: "Neck" },
      leftShoulder: { x: shoulderL_X, y: shoulderL_Y, name: "L_Shoulder" },
      rightShoulder: { x: shoulderR_X, y: shoulderR_Y, name: "R_Shoulder" },
      leftElbow: { x: elbowL_X, y: elbowL_Y, name: "L_Elbow" },
      rightElbow: { x: elbowR_X, y: elbowR_Y, name: "R_Elbow" },
      leftWrist: { x: wristL_X, y: wristL_Y, name: "L_Wrist" },
      rightWrist: { x: wristR_X, y: wristR_Y, name: "R_Wrist" },
      leftHip: { x: hipL_X, y: hipL_Y, name: "L_Hip" },
      rightHip: { x: hipR_X, y: hipR_Y, name: "R_Hip" },
      leftKnee: { x: kneeL_X, y: kneeL_Y, name: "L_Knee" },
      rightKnee: { x: kneeR_X, y: kneeR_Y, name: "R_Knee" },
      leftAnkle: { x: ankleL_X, y: ankleL_Y, name: "L_Ankle" },
      rightAnkle: { x: ankleR_X, y: ankleR_Y, name: "R_Ankle" },
      ballPosition: { x: ballX, y: ballY, name: "Cricket Ball" }
    };
  }
};
