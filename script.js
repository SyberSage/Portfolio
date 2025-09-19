/* Starfield background */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
window.addEventListener('resize', () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; initStars(); });

let stars = [];
function initStars(){
  stars = [];
  const count = Math.round((w*h)/45000); 
  for(let i=0;i<count;i++){
  stars.push({
  x: Math.random()*w,
  y: Math.random()*h,
  r: Math.random()*1.6 + 0.3,
  vx: (Math.random()-0.5)*0.25,
  vy: (Math.random()-0.5)*0.25,
  twinkle: Math.random()*0.8,
  hue: Math.random()*360 
});

  }
}

function drawStars(){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    ctx.globalAlpha = 0.8 + Math.sin(perf*0.002 + s.twinkle)*0.25;

    // drift hue
    s.hue = (s.hue + 0.3) % 360;
    ctx.fillStyle = `hsl(${s.hue}, 100%, 70%)`;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();

    // move star
    s.x += s.vx; 
    s.y += s.vy;
    if(s.x < 0) s.x = w;
    if(s.x > w) s.x = 0;
    if(s.y < 0) s.y = h;
    if(s.y > h) s.y = 0;
  }

  // ⭐ draw shooting stars here
  drawShootingStars();
}


let perf = 0;
function loopStars(ts){
  perf = ts;
  drawStars();
  requestAnimationFrame(loopStars);
}
initStars();
requestAnimationFrame(loopStars);

/* ---------- Shooting stars ---------- */
let shootingStars = [];

function spawnShootingStar() {
  const angleOptions = [
    Math.PI / 4,       // ↘ diagonal down-right
    (3 * Math.PI) / 4, // ↙ diagonal down-left
    0,                 // → horizontal right
    Math.PI            // ← horizontal left
  ];
  
  shootingStars.push({
    x: Math.random() * w,
    y: Math.random() * h * 0.3, // spawn in top 30% of screen
    length: Math.random() * 80 + 50,
    speed: Math.random() * 6 + 4,
    angle: angleOptions[Math.floor(Math.random() * angleOptions.length)],
    opacity: 1
  });
}
setInterval(spawnShootingStar, 5000); // one every 5s

function drawShootingStars() {
  for (let i = 0; i < shootingStars.length; i++) {
    let s = shootingStars[i];
    ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - s.length * Math.cos(s.angle),
      s.y - s.length * Math.sin(s.angle)
    );
    ctx.stroke();

    // move shooting star
    s.x += s.speed * Math.cos(s.angle);
    s.y += s.speed * Math.sin(s.angle);
    s.opacity -= 0.01;

    // remove when invisible
    if (s.opacity <= 0) {
      shootingStars.splice(i, 1);
      i--;
    }
  }
}



/* Smooth scroll */
const nav = document.getElementById('main-nav');
const navHeight = () => nav.offsetHeight || 64;
document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight() - 12;
    window.scrollTo({top, behavior:'smooth'});
  });
});


const sections = document.querySelectorAll('section, header#about');
const navLinks = document.querySelectorAll('nav a');
const observerOptions = { root: null, rootMargin: `-${navHeight()}px 0px -40% 0px`, threshold: 0.2 };

const sectionObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(a=>{
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

/*  Fade-in */
const fadeElems = document.querySelectorAll('.fade-in-elem');
const fadeObserver = new IntersectionObserver((entries, obs)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('visible');
      obs.unobserve(en.target);
    }
  });
},{threshold:0.18, rootMargin:'0px 0px -8% 0px'});
fadeElems.forEach(el => fadeObserver.observe(el));

/*  language bars  */
const langRows = document.querySelectorAll('.lang-row');
const langObserver = new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const level = parseInt(entry.target.dataset.level || '0',10);
      const bars = entry.target.querySelectorAll('.bar');
      for(let i=0;i<level && i<bars.length;i++){
        bars[i].classList.add('filled');
      }
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.25});
langRows.forEach(l => langObserver.observe(l));

/* ---------- Accessibility: focus outlines for keyboard users ---------- */
function handleFirstTab(e){
  if(e.key === 'Tab'){
    document.body.classList.add('show-focus');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);

