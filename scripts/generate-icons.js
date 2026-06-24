#!/usr/bin/env node

/**
 * 生成 PWA 图标脚本
 * 运行方式: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// 确保 public 目录存在
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 创建一个简单的 SVG 图标
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad1)"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">CET</text>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle">4</text>
</svg>`;

// 写入 SVG 文件
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
console.log('✓ Created icon.svg');

// 由于无法直接生成 PNG，我们需要使用 base64 编码的简单图标
// 创建一个 HTML 文件，用户可以在浏览器中打开并截图生成 PNG

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>生成 PWA 图标</title>
  <style>
    body { font-family: sans-serif; padding: 40px; text-align: center; background: #1a1a2e; color: white; }
    .icons { display: flex; gap: 40px; justify-content: center; margin: 40px 0; flex-wrap: wrap; }
    .icon-box { text-align: center; }
    .icon-box p { margin-top: 10px; color: #aaa; }
    canvas { border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .instructions { background: #2a2a4e; padding: 20px; border-radius: 12px; margin: 20px auto; max-width: 600px; text-align: left; }
    .instructions h3 { color: #667eea; margin-top: 0; }
    .instructions ol { margin: 0; padding-left: 20px; }
    .instructions li { margin: 10px 0; line-height: 1.6; }
    code { background: #1a1a2e; padding: 2px 8px; border-radius: 4px; color: #667eea; }
  </style>
</head>
<body>
  <h1>📱 PWA 图标生成器</h1>
  <p>请右键保存以下图标为 PNG 格式，然后放到 public 文件夹</p>
  
  <div class="icons">
    <div class="icon-box">
      <canvas id="icon192" width="192" height="192"></canvas>
      <p>192×192</p>
    </div>
    <div class="icon-box">
      <canvas id="icon512" width="512" height="512"></canvas>
      <p>512×512</p>
    </div>
  </div>
  
  <div class="instructions">
    <h3>📝 操作步骤：</h3>
    <ol>
      <li>右键点击上面的图标</li>
      <li>选择 <strong>"图片另存为..."</strong></li>
      <li>保存为 <code>icon-192.png</code> 和 <code>icon-512.png</code></li>
      <li>将文件放到项目的 <code>public</code> 文件夹</li>
      <li>重新构建项目即可</li>
    </ol>
  </div>
  
  <script>
    function drawIcon(canvasId, size) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');
      
      // 渐变背景
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      
      // 圆角矩形
      const radius = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 文字
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = \`bold \${size * 0.4}px Arial\`;
      ctx.fillText('CET', size / 2, size * 0.45);
      ctx.font = \`bold \${size * 0.25}px Arial\`;
      ctx.fillText('4', size / 2, size * 0.75);
    }
    
    drawIcon('icon192', 192);
    drawIcon('icon512', 512);
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'generate-icons.html'), htmlContent);
console.log('✓ Created generate-icons.html - 打开此文件可以生成 PNG 图标');

console.log('\n📌 下一步：');
console.log('1. 打开 generate-icons.html');
console.log('2. 右键保存图标为 PNG');
console.log('3. 放到 public 文件夹');
console.log('4. 重新构建项目\n');
