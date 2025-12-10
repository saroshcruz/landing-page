// Typed.js effect
var typed = new Typed('.typed', {
  strings: ['Frontend Developer', 'JavaScript Enthusiast', 'Problem Solver'],
  typeSpeed: 80,
  backSpeed: 40,
  backDelay: 1400,
  startDelay: 300,
  loop: true
});

// Scroll-driven interactions: progress bar, blob parallax, section theme changes
(function(){
  const progressBar = document.getElementById('progressBar');
  const blob1 = document.getElementById('blob1');
  const blob2 = document.getElementById('blob2');
  const sections = Array.from(document.querySelectorAll('section'));
  const themeColors = {
    dark: ['#06b6d4','#8b5cf6'],
    calm: ['#60a5fa','#7dd3fc'],
    bright: ['#f59e0b','#f97316'],
    warm: ['#fb7185','#f97316']
  };

  // Smooth scroll behavior for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Update progress bar width
  function updateProgress(){
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight>0 ? (scrollTop/docHeight)*100 : 0;
    progressBar.style.width = pct + '%';
  }

  // Parallax blobs (uses rAF)
  let lastY = 0;
  function onScroll(){ lastY = window.scrollY || window.pageYOffset; }
  window.addEventListener('scroll', onScroll, {passive:true});

  function animate(){
    // subtle parallax transforms
    const y = lastY;
    const t1 = `translate3d(${Math.sin(y*0.0009)*40}px, ${y*0.06}px, 0) scale(1.02)`;
    const t2 = `translate3d(${Math.cos(y*0.0012)*30}px, ${-y*0.035}px, 0) scale(.98)`;
    if(blob1) blob1.style.transform = t1;
    if(blob2) blob2.style.transform = t2;

    updateProgress();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // IntersectionObserver for revealing sections and theme switching
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const el = entry.target;
      if(entry.isIntersecting){
        el.classList.add('in-view');
        // set accent based on data-theme
        const theme = el.dataset.theme;
        if(theme && themeColors[theme]){
          const [c1,c2] = themeColors[theme];
          document.documentElement.style.setProperty('--accent', c1);
          // also tint blobs
          if(blob1) blob1.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
          if(blob2) blob2.style.background = `linear-gradient(135deg, ${c2}, ${c1})`;
        }
      } else {
        el.classList.remove('in-view');
      }
    });
  }, {threshold: 0.28});

  sections.forEach(s=>io.observe(s));
})();
