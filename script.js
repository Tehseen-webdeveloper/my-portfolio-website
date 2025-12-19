/* ================== Spider Web Cursor ================== */
const canvasWeb = document.getElementById("cursor-web");
const ctxWeb = canvasWeb.getContext("2d");

function resizeWebCanvas() {
  canvasWeb.width = window.innerWidth;
  canvasWeb.height = window.innerHeight;
}
resizeWebCanvas();
window.addEventListener("resize", resizeWebCanvas);

let mouse = { x: null, y: null };
let points = [];
const POINTS_COUNT = 70;
const MAX_DISTANCE = 130;

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Point {
  constructor() {
    this.x = Math.random() * canvasWeb.width;
    this.y = Math.random() * canvasWeb.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x <= 0 || this.x >= canvasWeb.width) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvasWeb.height) this.vy *= -1;
  }
  draw() {
    ctxWeb.beginPath();
    ctxWeb.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctxWeb.fillStyle = "rgba(255, 215, 0, 0.9)";
    ctxWeb.fill();
  }
}

for (let i = 0; i < POINTS_COUNT; i++) points.push(new Point());

function drawLines() {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < MAX_DISTANCE) {
        ctxWeb.strokeStyle = `rgba(255, 215, 0, ${1 - distance/MAX_DISTANCE})`;
        ctxWeb.lineWidth = 0.7;
        ctxWeb.beginPath();
        ctxWeb.moveTo(points[i].x, points[i].y);
        ctxWeb.lineTo(points[j].x, points[j].y);
        ctxWeb.stroke();
      }
    }
    if (mouse.x && mouse.y) {
      const dx = points[i].x - mouse.x;
      const dy = points[i].y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MAX_DISTANCE) {
        ctxWeb.strokeStyle = "rgba(255,255,255,0.6)";
        ctxWeb.beginPath();
        ctxWeb.moveTo(points[i].x, points[i].y);
        ctxWeb.lineTo(mouse.x, mouse.y);
        ctxWeb.stroke();
      }
    }
  }
}

function animateWeb() {
  ctxWeb.clearRect(0,0,canvasWeb.width,canvasWeb.height);
  points.forEach(p => { p.move(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateWeb);
}
animateWeb();

/* ================== Page-Wide Cursor Follower ================== */
const follower = document.getElementById("cursor-follower");
let fx=0, fy=0, mx=0, my=0;
document.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; });

function followAnimate() {
  fx += (mx - fx) * 0.15;
  fy += (my - fy) * 0.15;
  follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
  requestAnimationFrame(followAnimate);
}
followAnimate();

/* ================== Cloud Background ================== */
const canvasCloud = document.getElementById("cloud-canvas");
const ctxCloud = canvasCloud.getContext("2d");

function resizeCloudCanvas() {
  canvasCloud.width = window.innerWidth;
  canvasCloud.height = window.innerHeight;
}
resizeCloudCanvas();
window.addEventListener("resize", resizeCloudCanvas);

let clouds = [];
const CLOUD_COUNT = 20;

class Cloud {
  constructor() {
    this.x = Math.random()*canvasCloud.width;
    this.y = Math.random()*canvasCloud.height/2;
    this.width = 100 + Math.random()*150;
    this.height = 50 + Math.random()*50;
    this.speed = 0.2 + Math.random()*0.5;
    this.opacity = 0.2 + Math.random()*0.3;
  }
  draw() {
    ctxCloud.beginPath();
    ctxCloud.ellipse(this.x,this.y,this.width,this.height,0,0,Math.PI*2);
    ctxCloud.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctxCloud.fill();
  }
  update() {
    this.x += this.speed;
    if(this.x - this.width > canvasCloud.width){
      this.x = -this.width;
      this.y = Math.random()*canvasCloud.height/2;
    }
    this.draw();
  }
}

for(let i=0;i<CLOUD_COUNT;i++) clouds.push(new Cloud());

function animateClouds() {
  ctxCloud.clearRect(0,0,canvasCloud.width,canvasCloud.height);
  clouds.forEach(cloud => cloud.update());
  requestAnimationFrame(animateClouds);
}
animateClouds();
