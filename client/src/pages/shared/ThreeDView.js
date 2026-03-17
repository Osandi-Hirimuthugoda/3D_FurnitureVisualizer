import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import { getDesign } from '../../api/designs';
import { addToCart } from '../../api/cart';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Html, PivotControls } from '@react-three/drei';
import * as THREE from 'three';
import './ThreeDView.css';

const cameraOptions = [
  { id: 'perspective', label: 'Perspective View', description: 'Immersive angled view of the entire room.' },
  { id: 'front', label: 'Front View', description: 'Look straight at the main wall.' },
  { id: 'side', label: 'Side View', description: 'Focus on the side wall and furniture depth.' },
  { id: 'top', label: 'Top View', description: 'Bird\u2019s eye view of your layout.' }
];

const lightingOptions = [
  { id: 'day', label: 'Natural Daylight' },
  { id: 'evening', label: 'Warm Evening' },
  { id: 'cool', label: 'Cool Office' },
  { id: 'spotlight', label: 'Dramatic Spotlight' }
];

const colors = { sofas: '#D4A574', chairs: '#8B7355', tables: '#87CEEB', beds: '#C4B896', desks: '#708090' };

function FurnitureItem({ item, idx, colors, shadowsEnabled }) {
  const w = parseFloat(item.width) || 1;
  const d = parseFloat(item.height) || 1;
  const h = (item.dimensions && item.dimensions.height) ? parseFloat(item.dimensions.height) : 0.8;
  const centerX = (parseFloat(item.x) || 0) + w / 2;
  const centerZ = (parseFloat(item.y) || 0) + d / 2;
  const rot = -(parseFloat(item.rotation) || 0) * Math.PI / 180;
  const hex = item.color || colors[item.category] || '#808080';

  const isImage = item.image && typeof item.image === 'string' && (item.image.startsWith('data:image') || item.image.startsWith('http'));

  if (isImage) {
    return (
      <TexturedFurniture
        mapUrl={item.image}
        name={item.name}
        position={[centerX, h / 2, centerZ]}
        rotation={[0, rot, 0]}
        w={w}
        h={h}
        d={d}
        categoryColor={hex}
      />
    );
  }

  return (
    <mesh key={idx} position={[centerX, h / 2, centerZ]} rotation={[0, rot, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshLambertMaterial color={hex} transparent opacity={0.7} />
      <Html distanceFactor={5} position={[0, h / 2 + 0.2, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {item.name}
        </div>
      </Html>
    </mesh>
  );
}

function TexturedFurniture({ mapUrl, name, position, rotation, w, h, d, categoryColor }) {
  // Defensive check to avoid useTexture hanging on wrong type
  if (typeof mapUrl !== 'string') return null;

  return (
    <Suspense fallback={<mesh position={position}><boxGeometry args={[w, h, d]} /><meshBasicMaterial color="#ccc" wireframe /></mesh>}>
      <ActualTexturedFurniture mapUrl={mapUrl} name={name} position={position} rotation={rotation} w={w} h={h} d={d} categoryColor={categoryColor} />
    </Suspense>
  );
}

function ActualTexturedFurniture({ mapUrl, name, position, rotation, w, h, d, categoryColor }) {
  const texture = useTexture(mapUrl);

  // Create 6 materials for the box
  // 0:Right, 1:Left, 2:Top, 3:Bottom, 4:Front, 5:Back
  const sideMaterial = new THREE.MeshStandardMaterial({ color: categoryColor, roughness: 0.8 });
  const faceMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true, alphaTest: 0.3 });
  const materials = [sideMaterial, sideMaterial, faceMaterial, sideMaterial, faceMaterial, faceMaterial];

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Label above the object */}
      <Html distanceFactor={5} position={[0, h / 2 + 0.3, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '2px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

function HumanFigure({ height, position, color, onMove, onDraggingState }) {
  const headSize = height * 0.12;
  const torsoHeight = height * 0.4;
  const legHeight = height * 0.48;
  const armLength = height * 0.4;


  return (
    <group position={[position[0], height / 2, position[2]]}>
      <PivotControls
        anchor={[0, -height / 2, 0]}
        depthTest={false}
        displayValues={false}
        axisColors={['#ff3f3f', '#3f7fff', '#3fff3f']}
        fixed={false}
        disableScaling={true}
        disableRotations={true}
        activeAxes={[true, false, true]}
        onDragStart={() => onDraggingState(true)}
        onDragEnd={() => onDraggingState(false)}
        onDrag={(l) => {
          // Extract world position from matrix
          const matrix = new THREE.Matrix4();
          matrix.copy(l);
          const pos = new THREE.Vector3();
          pos.setFromMatrixPosition(matrix);
          onMove([pos.x, 0, pos.z]);
        }}
      >
        {/* Head */}
        <mesh position={[0, height / 2 - headSize / 2, 0]} castShadow>
          <sphereGeometry args={[headSize / 2, 16, 16]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>

        {/* Torso */}
        <mesh position={[0, legHeight + torsoHeight / 2 - height / 2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, torsoHeight]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.08, legHeight / 2 - height / 2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, legHeight]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>
        <mesh position={[0.08, legHeight / 2 - height / 2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, legHeight]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.15, legHeight + torsoHeight - 0.1 - height / 2, 0]} rotation={[0, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, armLength]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>
        <mesh position={[0.15, legHeight + torsoHeight - 0.1 - height / 2, 0]} rotation={[0, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, armLength]} />
          <meshStandardMaterial color={color === '#000000' ? '#444' : color} roughness={0.5} />
        </mesh>

        <Html distanceFactor={5} position={[0, height / 2 + 0.2, 0]} center>
          <div style={{
            background: color === '#ffff00' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            color: color === '#ffff00' ? 'white' : '#333',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            border: `1px solid ${color}`
          }}>
            Human ({height.toFixed(2)}m)
          </div>
        </Html>
      </PivotControls>
    </group>
  );
}

function CameraController({ activeCamera, roomSpecs, zoomLevel, isDraggingScale }) {
  const cameraRef = React.useRef();
  const controlsRef = React.useRef();

  const L = parseFloat(roomSpecs?.length) || 5;
  const W = parseFloat(roomSpecs?.width) || 4;
  const H = parseFloat(roomSpecs?.height) || 3;

  React.useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    let targetPos = [L * 0.8, H * 1.2, W * 1.2];
    let lookAt = [L / 2, H / 2, W / 2];

    if (activeCamera === 'front') {
      targetPos = [L / 2, H / 2, W * 1.8];
    } else if (activeCamera === 'side') {
      targetPos = [L * 1.8, H / 2, W / 2];
    } else if (activeCamera === 'top') {
      targetPos = [L / 2, Math.max(L, W) * 1.5, W / 2 + 0.1];
      lookAt = [L / 2, 0, W / 2];
    }

    camera.position.set(...targetPos);
    camera.zoom = zoomLevel;
    camera.updateProjectionMatrix();

    controls.target.set(...lookAt);
    controls.update();

  }, [activeCamera, roomSpecs, L, W, H, zoomLevel]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={0.1} far={100} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} enabled={!isDraggingScale} />
    </>
  );
}

function RoomScene({ roomSpecs, canvasItems, lighting, shadowsEnabled, showHuman, humanHeight, humanColor, humanPosition, setHumanPosition, setIsDraggingScale }) {
  const L = parseFloat(roomSpecs?.length) || 5;
  const W = parseFloat(roomSpecs?.width) || 4;
  const H = parseFloat(roomSpecs?.height) || 3;
  const wallColor = roomSpecs?.wallColor || '#F5F5DC';
  const floorColor = roomSpecs?.floorType === 'carpet' ? '#8B7355' : '#6B5344';

  const roomShapePoints = React.useMemo(() => {
    const pts = [];
    const shape = roomSpecs?.shape || 'rectangle';
    if (shape === 'l-shape') {
      pts.push(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(L, 0),
        new THREE.Vector2(L, W * 0.5),
        new THREE.Vector2(L * 0.5, W * 0.5),
        new THREE.Vector2(L * 0.5, W),
        new THREE.Vector2(0, W)
      );
    } else if (shape === 'u-shape') {
      pts.push(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(L, 0),
        new THREE.Vector2(L, W),
        new THREE.Vector2(L * 0.8, W),
        new THREE.Vector2(L * 0.8, W * 0.4),
        new THREE.Vector2(L * 0.2, W * 0.4),
        new THREE.Vector2(L * 0.2, W),
        new THREE.Vector2(0, W)
      );
    } else {
      pts.push(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(L, 0),
        new THREE.Vector2(L, W),
        new THREE.Vector2(0, W)
      );
    }
    return pts;
  }, [roomSpecs?.shape, L, W]);

  const floorShape = React.useMemo(() => {
    const s = new THREE.Shape();
    if (roomShapePoints.length > 0) {
      s.moveTo(roomShapePoints[0].x, roomShapePoints[0].y);
      for (let i = 1; i < roomShapePoints.length; i++) {
        s.lineTo(roomShapePoints[i].x, roomShapePoints[i].y);
      }
      s.lineTo(roomShapePoints[0].x, roomShapePoints[0].y);
    }
    return s;
  }, [roomShapePoints]);

  const wallSegments = React.useMemo(() => {
    const segs = [];
    for (let i = 0; i < roomShapePoints.length; i++) {
      const p1 = roomShapePoints[i];
      const p2 = roomShapePoints[(i + 1) % roomShapePoints.length];

      // Keep front open
      if (Math.abs(p1.y - W) < 0.01 && Math.abs(p2.y - W) < 0.01) continue;

      const dx = p2.x - p1.x;
      const dz = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dz * dz);
      const cx = (p1.x + p2.x) / 2;
      const cz = (p1.y + p2.y) / 2;
      const rotY = Math.atan2(-dz, dx);

      segs.push({ cx, cz, length, rotY, key: `wall-${i}` });
    }
    return segs;
  }, [roomShapePoints, W]);

  let bkgColor = '#0a0a0a', ambColor = '#404040', ambInt = 0.5, dirColor = '#ffffff', dirInt = 0.8;
  if (lighting === 'day') {
    bkgColor = '#e3f2fd'; ambInt = 0.8; dirInt = 1.0;
  } else if (lighting === 'evening') {
    bkgColor = '#2d1b15'; ambColor = '#503030'; ambInt = 0.6; dirColor = '#ff9955'; dirInt = 1.0;
  } else if (lighting === 'cool') {
    bkgColor = '#0f172a'; ambColor = '#406080'; ambInt = 0.7; dirColor = '#ddedff'; dirInt = 0.9;
  } else if (lighting === 'spotlight') {
    bkgColor = '#020617'; ambInt = 0.2; dirInt = 1.5;
  }

  return (
    <>
      <color attach="background" args={[bkgColor]} />
      <ambientLight color={ambColor} intensity={ambInt} />
      <directionalLight
        color={dirColor}
        intensity={dirInt}
        position={[L / 2, H * 2, W / 2]}
        castShadow={shadowsEnabled}
        shadow-mapSize={[1024, 1024]}
      />

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <extrudeGeometry args={[floorShape, { depth: 0.05, bevelEnabled: false }]} />
        <meshLambertMaterial color={floorColor} />
      </mesh>

      {/* Walls */}
      {wallSegments.map((ws) => (
        <mesh key={ws.key} position={[ws.cx, H / 2, ws.cz]} rotation={[0, ws.rotY, 0]} receiveShadow>
          <boxGeometry args={[ws.length, H, 0.1]} />
          <meshLambertMaterial color={wallColor} />
        </mesh>
      ))}

      {/* Furniture */}
      {canvasItems?.map((item, idx) => (
        <FurnitureItem
          key={item.canvasId || idx}
          item={item}
          idx={idx}
          colors={colors}
          shadowsEnabled={shadowsEnabled}
        />
      ))}

      {/* Human Reference */}
      {showHuman && (
        <HumanFigure
          height={humanHeight}
          position={humanPosition}
          color={humanColor}
          onMove={setHumanPosition}
          onDraggingState={setIsDraggingScale}
        />
      )}
    </>
  );
}

const ThreeDView = () => {
  const navigate = useNavigate();
  const scaleRefSectionRef = React.useRef(null);
  const [designId, setDesignId] = useState(null);
  const [rasterizeError, setRasterizeError] = useState(null);
  const [isRasterizing, setIsRasterizing] = useState(false);
  const [roomSpecs, setRoomSpecs] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);

  const [activeCamera, setActiveCamera] = useState('perspective');
  const [activeLighting, setActiveLighting] = useState('day');
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [shadowQuality, setShadowQuality] = useState(80);
  const [viewMode, setViewMode] = useState('3d');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHuman, setShowHuman] = useState(true);
  const [humanHeight, setHumanHeight] = useState(1.70);
  const [humanColor, setHumanColor] = useState('#333333');
  const [humanPosition, setHumanPosition] = useState([1, 0, 1]);
  const [isDraggingScale, setIsDraggingScale] = useState(false);
  const [cartStatus, setCartStatus] = useState('idle');

  useEffect(() => {
    if (roomSpecs) {
      setHumanPosition([roomSpecs.length * 0.2, 0, roomSpecs.width * 0.2]);
    }
  }, [roomSpecs?.length, roomSpecs?.width]);

  const handleBackTo2D = () => {
    navigate('/room-layout');
  };

  const handleOpenAppearance = () => {
    navigate('/appearance');
  };

  const handleAddAllToCart = async () => {
    const itemsWithId = canvasItems.filter(i => i.id);
    if (itemsWithId.length === 0) {
      alert('No furniture items with product IDs on canvas.');
      return;
    }
    setCartStatus('adding');
    try {
      for (const item of itemsWithId) {
        await addToCart(item.id, 1);
      }
      setCartStatus('done');
      setTimeout(() => setCartStatus('idle'), 2500);
    } catch (err) {
      setCartStatus('error');
      setTimeout(() => setCartStatus('idle'), 2500);
    }
  };

  const fetchDesign = useCallback(async () => {
    const id = designId || localStorage.getItem('currentDesignId');

    // Always try to load canvasItems from localStorage first (covers template items not yet saved)
    const localItems = localStorage.getItem('canvasItems');
    if (localItems) {
      try { setCanvasItems(JSON.parse(localItems)); } catch { }
    }

    const localSpecs = localStorage.getItem('roomSpecs');
    if (localSpecs) {
      try { setRoomSpecs(JSON.parse(localSpecs)); } catch { }
    }

    if (!id) {
      if (!localSpecs) {
        setRasterizeError('No design loaded. Go to Room Setup and continue to 2D Layout first.');
      }
      return;
    }
    setIsRasterizing(true);
    setRasterizeError(null);
    try {
      const design = await getDesign(id);
      setRoomSpecs(design.roomSpecs || {});
      // Prefer backend canvasItems if they exist, else keep localStorage ones
      if (design.canvasItems && design.canvasItems.length > 0) {
        setCanvasItems(design.canvasItems);
      }
    } catch (err) {
      console.error(err);
      // Don't show error if we already have local data
      if (!localSpecs) setRasterizeError('Failed to load design.');
    } finally {
      setIsRasterizing(false);
    }
  }, [designId]);

  useEffect(() => {
    setDesignId(localStorage.getItem('currentDesignId'));
  }, []);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  const handleZoomChange = (direction) => {
    setZoomLevel((current) => {
      const delta = direction === 'in' ? 0.15 : -0.15;
      const next = current + delta;
      if (next < 0.8) return 0.8;
      if (next > 1.4) return 1.4;
      return next;
    });
  };

  const currentCamera = cameraOptions.find((option) => option.id === activeCamera);
  const currentLighting = lightingOptions.find((option) => option.id === activeLighting);

  const shadowLabel =
    shadowQuality >= 75 ? 'High' : shadowQuality >= 45 ? 'Medium' : 'Low';

  const userRole = localStorage.getItem('userRole');

  return (
    <>
      <Navbar userRole={userRole} />
      <div className="three-d-page">
        <header className="three-d-header">
          <button className="back-btn" onClick={handleBackTo2D}>
            ← Back to 2D Layout
          </button>

          <div className="three-d-header-center">
            <h1>3D Room Visualization</h1>
            <span className="current-view-pill">
              Current view: {currentCamera?.label}
            </span>
          </div>

          <button className="appearance-btn" onClick={handleOpenAppearance}>
            Appearance
          </button>
          <button
            className="appearance-btn scale-ref-btn"
            onClick={() => scaleRefSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            📐 Scale Reference
          </button>
          {userRole !== 'admin' && (
            <button
              className={`appearance-btn cart-all-btn-3d ${cartStatus}`}
              onClick={handleAddAllToCart}
              disabled={cartStatus === 'adding' || canvasItems.length === 0}
            >
              {cartStatus === 'adding' && '⏳ Adding...'}
              {cartStatus === 'done' && '✓ Added!'}
              {cartStatus === 'error' && '✗ Failed'}
              {cartStatus === 'idle' && '🛒 Add All to Cart'}
            </button>
          )}
        </header>

        <div className="three-d-content">
          {/* LEFT PANEL \u2013 Controls */}
          <aside className="three-d-controls">
            <section className="control-section">
              <div className="control-header">
                <h3>Camera Angles</h3>
                <p className="control-subtitle">
                  Choose how you want to explore the room.
                </p>
              </div>

              <div className="pill-group">
                {cameraOptions.map((camera) => (
                  <button
                    key={camera.id}
                    className={`pill-button ${activeCamera === camera.id ? 'active' : ''
                      }`}
                    onClick={() => setActiveCamera(camera.id)}
                  >
                    <span className="pill-label">{camera.label}</span>
                    <span className="pill-description">{camera.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="control-section">
              <div className="control-header">
                <h3>Lighting Presets</h3>
                <p className="control-subtitle">
                  Quickly preview your room under different moods.
                </p>
              </div>

              <div className="list-group">
                {lightingOptions.map((lighting) => (
                  <button
                    key={lighting.id}
                    className={`list-button ${activeLighting === lighting.id ? 'active' : ''
                      }`}
                    onClick={() => setActiveLighting(lighting.id)}
                  >
                    <span className="dot" />
                    <span className="list-label">{lighting.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="control-section">
              <div className="control-header">
                <h3>Rendering Options</h3>
                <p className="control-subtitle">
                  Adjust realism for performance or visual quality.
                </p>
              </div>

              <div className="control-row shadows-row">
                <div>
                  <span className="row-label">Shadows</span>
                  <p className="row-description">
                    Soft contact shadows under furniture and along walls.
                  </p>
                </div>

                <button
                  className={`toggle-switch ${shadowsEnabled ? 'enabled' : 'disabled'
                    }`}
                  onClick={() => setShadowsEnabled(!shadowsEnabled)}
                  aria-pressed={shadowsEnabled}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              <div className="control-row slider-row">
                <div className="slider-labels">
                  <span className="row-label">Shadow quality</span>
                  <span className="slider-value">
                    {shadowLabel} ({shadowQuality}%)
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={shadowQuality}
                  onChange={(e) => setShadowQuality(Number(e.target.value))}
                  className="shadow-slider"
                />
              </div>
            </section>

            <section className="control-section" ref={scaleRefSectionRef}>
              <div className="control-header">
                <h3>Scale Reference</h3>
                <p className="control-subtitle">
                  Use a human figure to judge furniture size.
                </p>
              </div>

              <div className="control-row shadows-row">
                <div>
                  <span className="row-label">Show Human</span>
                  <p className="row-description">
                    Display a stick figure for proportion.
                  </p>
                </div>

                <button
                  className={`toggle-switch ${showHuman ? 'enabled' : 'disabled'
                    }`}
                  onClick={() => setShowHuman(!showHuman)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              <div className="control-row slider-row">
                <div className="slider-labels">
                  <span className="row-label">Human Height</span>
                  <span className="slider-value">
                    {humanHeight.toFixed(2)}m
                  </span>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="2.2"
                  step="0.05"
                  value={humanHeight}
                  onChange={(e) => setHumanHeight(Number(e.target.value))}
                  className="shadow-slider"
                />
              </div>

              <div className="control-row">
                <span className="row-label">Human Color</span>
                <div className="human-color-picker">
                  {[
                    { name: 'Black', hex: '#333333' },
                    { name: 'Blue', hex: '#3b82f6' },
                    { name: 'Red', hex: '#ef4444' },
                    { name: 'Yellow', hex: '#ffff00' },
                    { name: 'Green', hex: '#22c55e' }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      className={`color-swatch ${humanColor === c.hex ? 'active' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setHumanColor(c.hex)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </section>

            {userRole !== 'admin' && (
              <section className="control-section">
                <div className="control-header">
                  <h3>Cart</h3>
                  <p className="control-subtitle">Add all furniture items to your cart.</p>
                </div>
                <button
                  className={`cart-sidebar-btn ${cartStatus}`}
                  onClick={handleAddAllToCart}
                  disabled={cartStatus === 'adding' || canvasItems.length === 0}
                >
                  {cartStatus === 'adding' && '⏳ Adding to Cart...'}
                  {cartStatus === 'done' && '✓ Added to Cart!'}
                  {cartStatus === 'error' && '✗ Failed - Try Again'}
                  {cartStatus === 'idle' && '🛒 Add All Items to Cart'}
                </button>
              </section>
            )}

            <section className="control-section">
              <div className="control-header">
                <h3>View Mode</h3>
              </div>

              <div className="pill-group vertical">
                <button
                  className={`pill-button compact ${viewMode === '3d' ? 'active' : ''
                    }`}
                  onClick={() => setViewMode('3d')}
                >
                  <span className="pill-label">3D View</span>
                  <span className="pill-description">
                    Rotate, orbit and zoom around the room.
                  </span>
                </button>

                <button
                  className="pill-button compact secondary"
                  onClick={handleBackTo2D}
                >
                  <span className="pill-label">Switch to 2D Layout</span>
                  <span className="pill-description">
                    Go back to precise top-down editing.
                  </span>
                </button>
              </div>
            </section>
          </aside>

          {/* RIGHT PANEL \u2013 3D Room Preview */}
          <main className="three-d-viewport-area">
            <div className="three-d-status-row">
              <span className="status-chip">
                Camera: {currentCamera?.label}
              </span>
              <span className="status-chip">
                Lighting: {currentLighting?.label}
              </span>
              <span className="status-chip">
                Shadows: {shadowsEnabled ? 'On' : 'Off'} ({shadowLabel})
              </span>
            </div>

            <div className="three-d-viewport-wrapper">
              {isRasterizing && (
                <div className="rasterize-loading">
                  <div className="rasterize-spinner" />
                  <p>Loading 3D experience...</p>
                </div>
              )}
              {rasterizeError && !isRasterizing && (
                <div className="rasterize-error">
                  <p>{rasterizeError}</p>
                  <button className="retry-btn" onClick={fetchDesign}>Retry</button>
                </div>
              )}
              {!isRasterizing && !rasterizeError && roomSpecs && (
                <Canvas shadows={shadowsEnabled} gl={{ preserveDrawingBuffer: true }}>
                  <Suspense fallback={null}>
                    <CameraController
                      activeCamera={activeCamera}
                      roomSpecs={roomSpecs}
                      zoomLevel={zoomLevel}
                      isDraggingScale={isDraggingScale}
                    />
                    <RoomScene
                      roomSpecs={roomSpecs}
                      canvasItems={canvasItems}
                      lighting={activeLighting}
                      shadowsEnabled={shadowsEnabled}
                      showHuman={showHuman}
                      humanHeight={humanHeight}
                      humanColor={humanColor}
                      humanPosition={humanPosition}
                      setHumanPosition={setHumanPosition}
                      setIsDraggingScale={setIsDraggingScale}
                    />
                  </Suspense>
                </Canvas>
              )}
            </div>

            <div className="three-d-viewport-footer">

              <div className="zoom-controls">
                <button
                  className="zoom-btn"
                  onClick={() => handleZoomChange('out')}
                  aria-label="Zoom out"
                >-
                </button>
                <span className="zoom-label">Zoom</span>
                <button
                  className="zoom-btn"
                  onClick={() => handleZoomChange('in')}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  className="zoom-btn reset"
                  onClick={() => setZoomLevel(1)}
                >
                  Reset
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ThreeDView;

