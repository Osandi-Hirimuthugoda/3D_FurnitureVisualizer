const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const getRendererHTML = (sceneData) => {
  const dataStr = JSON.stringify(sceneData).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body{margin:0;background:#0a0a0a;}</style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script>
    window.__SCENE_DATA__ = ${dataStr};
    window.__RENDER_DONE__ = false;
  </script>
  <script>
    (function() {
      const data = window.__SCENE_DATA__;
      const room = data.roomSpecs || {};
      const items = data.canvasItems || [];
      const opts = data.options || {};

      const L = parseFloat(room.length) || 5;
      const W = parseFloat(room.width) || 4;
      const H = parseFloat(room.height) || 3;
      const wallColor = room.wallColor || '#F5F5DC';
      const floorColor = room.floorType === 'carpet' ? '#8B7355' : '#6B5344';

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, 16/9, 0.1, 100);
      if (opts.camera === 'front') {
        camera.position.set(L / 2, H / 2, W * 1.8);
      } else if (opts.camera === 'side') {
        camera.position.set(L * 1.8, H / 2, W / 2);
      } else if (opts.camera === 'top') {
        camera.position.set(L / 2, Math.max(L, W) * 1.5, W / 2 + 0.1); // slight offset to prevent gimbal lock
      } else {
        camera.position.set(L * 0.8, H * 1.2, W * 1.2);
      }
      camera.lookAt(L/2, opts.camera === 'top' ? 0 : H/2, W/2);

      let bkgColor = 0x0a0a0a, ambColor = 0x404040, ambInt = 0.5, dirColor = 0xffffff, dirInt = 0.8;
      
      if (opts.lighting === 'day') {
        bkgColor = 0xe3f2fd; ambInt = 0.8; dirInt = 1.0;
      } else if (opts.lighting === 'evening') {
        bkgColor = 0x2d1b15; ambColor = 0x503030; ambInt = 0.6; dirColor = 0xff9955; dirInt = 1.0;
      } else if (opts.lighting === 'cool') {
        bkgColor = 0x0f172a; ambColor = 0x406080; ambInt = 0.7; dirColor = 0xddedff; dirInt = 0.9;
      } else if (opts.lighting === 'spotlight') {
        bkgColor = 0x020617; ambInt = 0.2; dirInt = 1.5;
      }

      scene.background = new THREE.Color(bkgColor);

      const ambient = new THREE.AmbientLight(ambColor, ambInt);
      scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(dirColor, dirInt);
      dirLight.position.set(L/2, H * 2, W/2);
      dirLight.castShadow = opts.shadows !== false;
      scene.add(dirLight);

      const geo = (w, h, d) => new THREE.BoxGeometry(w, h, d);
      const mat = (hex) => new THREE.MeshLambertMaterial({ color: hex });

      const floor = new THREE.Mesh(geo(L, 0.05, W), mat(floorColor));
      floor.position.set(L/2, -0.025, W/2);
      scene.add(floor);

      const wallBack = new THREE.Mesh(geo(L, H, 0.1), mat(wallColor));
      wallBack.position.set(L/2, H/2, 0);
      scene.add(wallBack);

      const wallLeft = new THREE.Mesh(geo(0.1, H, W), mat(wallColor));
      wallLeft.position.set(0, H/2, W/2);
      scene.add(wallLeft);

      const wallRight = new THREE.Mesh(geo(0.1, H, W), mat(wallColor));
      wallRight.position.set(L, H/2, W/2);
      scene.add(wallRight);

      const colors = { sofas: 0xD4A574, chairs: 0x8B7355, tables: 0x87CEEB, beds: 0xC4B896, desks: 0x708090 };
      items.forEach(function(item) {
        const w = parseFloat(item.width) || 1;
        const d = parseFloat(item.height) || 1;
        const h = (item.dimensions && item.dimensions.height) ? parseFloat(item.dimensions.height) : 0.8;
        const x = parseFloat(item.x) || 0;
        const z = parseFloat(item.y) || 0;
        const rot = (parseFloat(item.rotation) || 0) * Math.PI / 180;
        const hex = colors[item.category] || 0x808080;
        const mesh = new THREE.Mesh(geo(w, h, d), mat(hex));
        mesh.position.set(x, h/2, z);
        mesh.rotation.y = rot;
        scene.add(mesh);
      });

      const canvas = document.getElementById('canvas');
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(1280, 720);
      renderer.setPixelRatio(2);
      if (opts.shadows !== false) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      renderer.render(scene, camera);
      window.__RENDER_DONE__ = true;
    })();
  </script>
</body>
</html>`;
};

async function rasterizeDesign(design, options = {}) {
  const sceneData = {
    roomSpecs: design.roomSpecs,
    canvasItems: design.canvasItems,
    options: {
      camera: options.camera || 'perspective',
      lighting: options.lighting || 'day',
      shadows: options.shadows !== false
    }
  };

  const html = getRendererHTML(sceneData);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForFunction('window.__RENDER_DONE__ === true', { timeout: 10000 });

    const canvas = await page.$('#canvas');
    const buffer = await canvas.screenshot({ type: 'png' });

    await browser.close();
    return buffer;
  } catch (err) {
    if (browser) await browser.close();
    throw err;
  }
}

module.exports = { rasterizeDesign };
