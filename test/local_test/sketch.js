let particles;
let computeShader;
let displayShader;
let instance;
const numParticles = 500;

async function setup() {
  await createCanvas(100, 100, WEBGPU);

  let data = [];
  for (let i = 0; i < numParticles; i++) {
    data.push({
      position: createVector(
        random(-40, 40),
        random(-40, 40)
      ),
      velocity: createVector(
        random(-1, 1),
        random(-1, 1)
      ),
    });
  }
  particles = createStorage(data);

  computeShader = buildComputeShader(simulate);
  displayShader = buildMaterialShader(display);
  instance = buildGeometry(drawParticle);
  describe('50 white spheres bouncing around the canvas.');
}

function drawParticle() {
  sphere(3);
}

function simulate() {
  let r = 3;
  let data = uniformStorage(particles);
  let idx = index.x;
  let pos = data[idx].position;
  let vel = data[idx].velocity;
  pos = pos + vel;
  if (pos.x > width/2 - r || pos.x < -height/2 + r) {
    vel.x = -vel.x;
    pos.x = clamp(pos.x, -width/2 + r, width/2 - r);
  }
  if (pos.y > height/2 - r || pos.y < -height/2 + r) {
    vel.y = -vel.y;
    pos.y = clamp(pos.y, -height/2 + r, height/2 - r);
  }
  data[idx].position = pos;
  data[idx].velocity = vel;
}

function display() {
  let data = uniformStorage(particles);
  worldInputs.begin();
  let pos = data[instanceID()].position;
  worldInputs.position.xy += pos;
  worldInputs.end();
}

function draw() {
  background(30);
  compute(computeShader, numParticles);
  noStroke();
  fill(255);
  lights();
  shader(displayShader);
  model(instance, numParticles);
}
