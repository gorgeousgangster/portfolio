/* ═══════════════════════════════════════════════════════
   CINEMATIC PORTFOLIO ENGINE — Full UX Interactions
   ═══════════════════════════════════════════════════════ */

(function() {
    'use strict';

    const raf = fn => { let q=false; return (...a) => { if(!q){q=true;requestAnimationFrame(()=>{fn(...a);q=false;})}}};

    // ─── CUSTOM CURSOR ─────────────────────────────────
    const cursor = document.getElementById('cursor');
    const cursorLabel = document.getElementById('cursorLabel');
    const glow = document.getElementById('cursorGlow');
    let mx=0, my=0, cx=0, cy=0, dx=0, dy=0;

    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, {passive:true});

    (function cursorLoop() {
        // Dot follows instantly, ring with slight lag
        cx += (mx-cx)*0.12;
        cy += (my-cy)*0.12;
        dx += (mx-dx)*0.06;
        dy += (my-dy)*0.06;

        if (cursor) cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        if (glow) glow.style.transform = `translate3d(${dx-400}px,${dy-400}px,0)`;
        requestAnimationFrame(cursorLoop);
    })();

    // Cursor states
    const hoverTargets = document.querySelectorAll('a, button, .blog-card, .case__link, .contact__channel, .nav__link, .skill-item');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('cursor--hover');
            const label = el.dataset.cursor || '';
            if (label && cursorLabel) { cursorLabel.textContent = label; cursor.classList.add('cursor--labeled'); }
        }, {passive:true});
        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('cursor--hover', 'cursor--labeled');
            if (cursorLabel) cursorLabel.textContent = '';
        }, {passive:true});
    });

    document.addEventListener('mousedown', () => cursor?.classList.add('cursor--click'));
    document.addEventListener('mouseup', () => cursor?.classList.remove('cursor--click'));

    // ─── RIPPLE EFFECT ─────────────────────────────────
    document.querySelectorAll('.nav__cta, .resume__btn, .contact__submit, .blog-card__link, .case__link, .fab-menu__trigger, .fab-menu__btn').forEach(el => {
        el.classList.add('ripple-container');
        el.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ─── SPOTLIGHT ON CARDS ────────────────────────────
    document.querySelectorAll('.stat-card,.timeline__card,.blog-card,.contact__channel,.case__visual').forEach(el => {
        el.classList.add('spotlight');
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX-r.left)+'px');
            el.style.setProperty('--my', (e.clientY-r.top)+'px');
            el.style.setProperty('--spot', '1');
        }, {passive:true});
        el.addEventListener('mouseleave', () => el.style.setProperty('--spot','0'), {passive:true});
    });

    // ─── TILT EFFECT ───────────────────────────────────
    document.querySelectorAll('.case__visual,.resume__paper,.blog-card--featured').forEach(el => {
        el.style.transition = 'transform 0.12s linear';
        el.addEventListener('mousemove', raf(e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX-r.left)/r.width - 0.5;
            const y = (e.clientY-r.top)/r.height - 0.5;
            el.style.transform = `perspective(900px) rotateX(${y*-5}deg) rotateY(${x*5}deg) scale3d(1.015,1.015,1)`;
        }));
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
            el.style.transform = '';
            setTimeout(() => el.style.transition='transform 0.12s linear', 600);
        });
    });

    // ─── MAGNETIC BUTTONS ──────────────────────────────
    document.querySelectorAll('.nav__cta,.resume__btn,.contact__submit,.hero__socials a,.theme-toggle,.fab-menu__trigger').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate3d(${(e.clientX-r.left-r.width/2)*0.2}px,${(e.clientY-r.top-r.height/2)*0.2}px,0)`;
        }, {passive:true});
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
            btn.style.transform = '';
            setTimeout(() => btn.style.transition='', 400);
        });
    });

    // ─── TEXT SCRAMBLE ON HOVER ─────────────────────────
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    document.querySelectorAll('.case__title, .blog-card h3').forEach(el => {
        const original = el.textContent;
        let interval;

        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                el.textContent = original.split('').map((char, i) => {
                    if (i < iteration) return original[i];
                    if (char === ' ') return ' ';
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                }).join('');
                iteration += 1.5;
                if (iteration >= original.length) { clearInterval(interval); el.textContent = original; }
            }, 25);
        });

        el.addEventListener('mouseleave', () => { clearInterval(interval); el.textContent = original; });
    });

    // ─── NAVIGATION ────────────────────────────────────
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    const onScroll = raf(() => {
        nav.classList.toggle('nav--scrolled', scrollY > 50);
        updateActiveNav();
        updateTimeline();
        updateProgress();
        btt.classList.toggle('visible', scrollY > 600);
    });
    addEventListener('scroll', onScroll, {passive:true});

    menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));

    function updateActiveNav() {
        const y = scrollY + 200;
        document.querySelectorAll('section[id]').forEach(s => {
            const link = document.querySelector(`.nav__link[data-section="${s.id}"]`);
            if (link) link.classList.toggle('nav__link--active', y>=s.offsetTop && y<s.offsetTop+s.offsetHeight);
        });
    }

    // ─── PARTICLES ─────────────────────────────────────
    const pCont = document.getElementById('particles');
    if (pCont && innerWidth > 600) {
        const frag = document.createDocumentFragment();
        for (let i=0; i<20; i++) {
            const d = document.createElement('div');
            d.className = 'particle';
            d.style.cssText = `width:${Math.random()*2.5+1}px;height:${Math.random()*2.5+1}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dx:${(Math.random()-.5)*120}px;--dy:${-(Math.random()*100+50)}px;--dur:${Math.random()*14+8}s;--delay:${Math.random()*-20}s;--alpha:${Math.random()*0.25+0.1};`;
            frag.appendChild(d);
        }
        pCont.appendChild(frag);
    }

    // ─── HERO CANVAS ───────────────────────────────────
    const canvas = document.getElementById('heroCanvas');
    if (canvas && innerWidth > 768) {
        const ctx = canvas.getContext('2d');
        let W, H, nodes=[], running=true;

        function resize() {
            const r = canvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(devicePixelRatio, 2);
            W=r.width; H=r.height;
            canvas.width=W*dpr; canvas.height=H*dpr;
            canvas.style.width=W+'px'; canvas.style.height=H+'px';
            ctx.setTransform(dpr,0,0,dpr,0,0);
            nodes = Array.from({length:40}, () => ({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*0.25, vy:(Math.random()-.5)*0.25, r:Math.random()*1.5+0.7}));
        }

        // Mouse interaction with nodes
        let mouseOnCanvas = {x: -1000, y: -1000};
        canvas.parentElement.addEventListener('mousemove', e => {
            const r = canvas.parentElement.getBoundingClientRect();
            mouseOnCanvas.x = e.clientX - r.left;
            mouseOnCanvas.y = e.clientY - r.top;
        }, {passive:true});

        function draw() {
            if (!running) return;
            ctx.clearRect(0,0,W,H);
            for (const n of nodes) {
                // Repel from mouse
                const ddx = n.x - mouseOnCanvas.x, ddy = n.y - mouseOnCanvas.y;
                const dist = Math.hypot(ddx, ddy);
                if (dist < 150 && dist > 0) {
                    const force = (150-dist)/150 * 0.5;
                    n.vx += (ddx/dist) * force;
                    n.vy += (ddy/dist) * force;
                }
                // Dampen
                n.vx *= 0.98; n.vy *= 0.98;
                n.x+=n.vx; n.y+=n.vy;
                if(n.x<0||n.x>W)n.vx*=-1;
                if(n.y<0||n.y>H)n.vy*=-1;
            }
            for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
                const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.hypot(dx,dy);
                if(d<100){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle=`rgba(34,211,238,${(1-d/100)*0.1})`;ctx.lineWidth=0.5;ctx.stroke();}
            }
            for (const n of nodes) {ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.28);ctx.fillStyle='rgba(34,211,238,0.35)';ctx.fill();}
            requestAnimationFrame(draw);
        }

        resize(); draw();
        addEventListener('resize', resize);
        new IntersectionObserver(([e]) => { running=e.isIntersecting; if(running)draw(); }).observe(canvas.parentElement);
    }

    // ─── ROTATING TEXT ─────────────────────────────────
    const rw = document.getElementById('rotatingWord');
    if (rw) {
        const words = ['raw data','complexity','patterns','noise','questions'];
        let wi=0;
        setInterval(() => {
            rw.classList.add('hero__title-word--out');
            setTimeout(() => {
                wi=(wi+1)%words.length;
                rw.textContent=words[wi];
                rw.classList.remove('hero__title-word--out');
            }, 300);
        }, 3000);
    }

    // ─── COUNTERS ──────────────────────────────────────
    function animateCounters(root) {
        (root||document).querySelectorAll('[data-count]:not([data-done])').forEach(el => {
            el.dataset.done='1';
            const t=+el.dataset.count, s=el.dataset.suffix||'', st=performance.now();
            (function tick(now) {
                const p=Math.min((now-st)/1800,1);
                el.textContent=Math.floor((1-Math.pow(1-p,4))*t)+s;
                p<1?requestAnimationFrame(tick):(el.textContent=t+s);
            })(st);
        });
    }

    // ─── TIMELINE PROGRESS ─────────────────────────────
    const tlProg = document.getElementById('timelineProgress');
    const tl = document.querySelector('.timeline');
    function updateTimeline() {
        if(!tl||!tlProg) return;
        const r=tl.getBoundingClientRect(), vh=innerHeight;
        if(r.top<vh&&r.bottom>0) tlProg.style.height=Math.min(Math.max((vh-r.top)/(r.height+vh*0.4),0),1)*100+'%';
    }

    // ─── RADAR CHART ───────────────────────────────────
    let radarDone=false;
    function drawRadar() {
        if(radarDone) return;
        const c=document.getElementById('skillsRadar');
        if(!c) return; radarDone=true;
        const ctx=c.getContext('2d'), size=350, dpr=Math.min(devicePixelRatio,2);
        c.width=size*dpr;c.height=size*dpr;c.style.width=size+'px';c.style.height=size+'px';ctx.scale(dpr,dpr);
        const cx2=size/2,cy2=size/2,mR=size*0.38;
        const labels=['Python','SQL','Power BI','ML/AI','C++','Data Viz'];
        const vals=[0.9,0.85,0.92,0.8,0.75,0.85];
        const n=6,step=Math.PI*2/n;
        let prog=0;
        (function frame(){
            prog=Math.min(prog+0.022,1);const e=1-Math.pow(1-prog,3);
            ctx.clearRect(0,0,size,size);
            for(let r=1;r<=4;r++){const rad=(r/4)*mR;ctx.beginPath();for(let i=0;i<=n;i++){const a=i*step-Math.PI/2,px=cx2+rad*Math.cos(a),py=cy2+rad*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;ctx.stroke();}
            for(let i=0;i<n;i++){const a=i*step-Math.PI/2;ctx.beginPath();ctx.moveTo(cx2,cy2);ctx.lineTo(cx2+mR*Math.cos(a),cy2+mR*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,0.025)';ctx.stroke();}
            ctx.beginPath();for(let i=0;i<=n;i++){const idx=i%n,a=idx*step-Math.PI/2,r2=vals[idx]*mR*e,px=cx2+r2*Math.cos(a),py=cy2+r2*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();
            const g=ctx.createLinearGradient(0,0,size,size);g.addColorStop(0,'rgba(34,211,238,0.15)');g.addColorStop(1,'rgba(99,102,241,0.06)');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(34,211,238,0.5)';ctx.lineWidth=2;ctx.stroke();
            for(let i=0;i<n;i++){const a=i*step-Math.PI/2,r2=vals[i]*mR*e,px=cx2+r2*Math.cos(a),py=cy2+r2*Math.sin(a);ctx.beginPath();ctx.arc(px,py,4,0,6.28);ctx.fillStyle='#22d3ee';ctx.fill();ctx.beginPath();ctx.arc(px,py,8,0,6.28);ctx.fillStyle='rgba(34,211,238,0.12)';ctx.fill();}
            ctx.font='11px Inter,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--text-2').trim()||'#9898a8';
            for(let i=0;i<n;i++){const a=i*step-Math.PI/2;ctx.fillText(labels[i],cx2+(mR+24)*Math.cos(a),cy2+(mR+24)*Math.sin(a));}
            if(prog<1)requestAnimationFrame(frame);
        })();
    }

    // ─── SCROLL OBSERVER ───────────────────────────────
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if(!e.isIntersecting) return;
            e.target.classList.add('visible');
            if(e.target.closest('.skills')||e.target.matches('.skills')){drawRadar();animateSkillBars();}
            if(e.target.matches('[data-count]')||e.target.closest('.hero')||e.target.closest('.resume')) animateCounters(e.target.closest('section')||document);
        });
    }, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});

    '.stat-card,.timeline__item,.case,.blog-card,.skill-item__fill,[data-count],.skills,.resume'.split(',').forEach(s=>document.querySelectorAll(s).forEach(el=>obs.observe(el)));

    document.querySelectorAll('.stat-card').forEach((c,i)=>c.style.transitionDelay=i*0.12+'s');
    document.querySelectorAll('.timeline__item').forEach((c,i)=>c.style.transitionDelay=i*0.1+'s');
    document.querySelectorAll('.blog-card').forEach((c,i)=>c.style.transitionDelay=i*0.08+'s');

    function animateSkillBars() {
        document.querySelectorAll('.skill-item__fill:not(.visible)').forEach(f=>{f.style.setProperty('--target-width',f.dataset.width);f.classList.add('visible');});
    }

    // ─── SECTION REVEAL ────────────────────────────────
    const sObs = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}}),{threshold:0.04});
    document.querySelectorAll('section').forEach(s=>{s.style.cssText='opacity:0;transform:translateY(30px);transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1)';sObs.observe(s);});
    const hero=document.getElementById('hero');if(hero){hero.style.opacity='1';hero.style.transform='none';}

    // ─── PARALLAX ──────────────────────────────────────
    if (innerWidth > 768) {
        const hc=document.querySelector('.hero__content'), hv=document.querySelector('.hero__visual');
        addEventListener('scroll', raf(()=>{
            const y=scrollY;
            if(y<innerHeight){if(hc)hc.style.transform=`translate3d(0,${y*0.12}px,0)`;if(hv)hv.style.transform=`translate3d(0,${y*0.06}px,0)`;}
        }), {passive:true});
    }

    // ─── ARTICLE MODAL ─────────────────────────────────
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('articleContent');

    window.openArticle = id => {
        const tmpl=document.getElementById('tmpl-'+id);
        if(!tmpl||!modal||!modalContent) return;
        modalContent.innerHTML=tmpl.innerHTML;
        modal.classList.add('active');
        document.body.style.overflow='hidden';
        setTimeout(()=>animateCounters(modalContent), 300);
        showToast('Article opened — scroll to explore');
    };

    window.closeArticle = () => { modal?.classList.remove('active'); document.body.style.overflow=''; };
    addEventListener('keydown', e => { if(e.key==='Escape'&&modal?.classList.contains('active')) closeArticle(); });

    // ─── CONTACT FORM ──────────────────────────────────
    const form = document.getElementById('contactForm');
    if(form) form.addEventListener('submit', e => {
        e.preventDefault();
        const btn=form.querySelector('.contact__submit'), orig=btn.innerHTML;
        btn.innerHTML='<span>Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';
        showToast('Message sent successfully!');
        setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';form.reset();}, 2500);
    });

    // ─── SMOOTH SCROLL ─────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{
        const t=document.querySelector(a.getAttribute('href'));
        if(t){e.preventDefault();scrollTo({top:t.offsetTop-80,behavior:'smooth'});}
    }));

    // ─── BACK TO TOP ───────────────────────────────────
    const btt = document.createElement('button');
    btt.className='back-to-top'; btt.innerHTML='<i class="fas fa-chevron-up"></i>'; btt.setAttribute('aria-label','Back to top');
    document.body.appendChild(btt);
    btt.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));

    // ─── PAGE PROGRESS ─────────────────────────────────
    const progBar = document.createElement('div');
    progBar.className='page-progress'; document.body.appendChild(progBar);
    function updateProgress() {
        const max=document.documentElement.scrollHeight-innerHeight;
        progBar.style.width=max>0?(scrollY/max*100)+'%':'0%';
    }

    // ─── FAB MENU ──────────────────────────────────────
    const fab = document.getElementById('fabMenu');
    const fabTrigger = document.getElementById('fabTrigger');
    if (fabTrigger && fab) {
        fabTrigger.addEventListener('click', () => fab.classList.toggle('open'));
        // Close on click outside
        document.addEventListener('click', e => {
            if (!fab.contains(e.target)) fab.classList.remove('open');
        });
    }

    // ─── TOAST NOTIFICATIONS ───────────────────────────
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout;

    window.showToast = function(msg) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        toast.classList.add('visible');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3000);
    };

    // ─── KEYBOARD SHORTCUTS ────────────────────────────
    addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.key) {
            case '1': scrollToSection('about'); break;
            case '2': scrollToSection('journey'); break;
            case '3': scrollToSection('projects'); break;
            case '4': scrollToSection('skills'); break;
            case '5': scrollToSection('blog'); break;
            case '6': scrollToSection('resume'); break;
            case '7': scrollToSection('contact'); break;
            case 't': case 'T':
                if (!e.ctrlKey && !e.metaKey) { document.getElementById('themeToggle')?.click(); showToast('Theme toggled'); }
                break;
        }
    });

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) { scrollTo({top:el.offsetTop-80,behavior:'smooth'}); showToast(`Navigated to ${id}`); }
    }

    // ─── THEME TOGGLE ──────────────────────────────────
    const toggle = document.getElementById('themeToggle');
    if (localStorage.getItem('portfolio-theme')==='light') document.documentElement.setAttribute('data-theme','light');

    toggle?.addEventListener('click', () => {
        document.body.classList.add('theme-transitioning');
        const light = document.documentElement.getAttribute('data-theme')==='light';
        if(light){document.documentElement.removeAttribute('data-theme');localStorage.setItem('portfolio-theme','dark');}
        else{document.documentElement.setAttribute('data-theme','light');localStorage.setItem('portfolio-theme','light');}
        radarDone=false; drawRadar();
        setTimeout(()=>document.body.classList.remove('theme-transitioning'), 500);
    });

    // ─── TYPING SUBTITLE ───────────────────────────────
    const sub = document.querySelector('.hero__subtitle');
    if (sub && innerWidth > 768) {
        const txt=sub.textContent; sub.textContent='';
        let i=0;
        setTimeout(function type(){if(i<txt.length){sub.textContent+=txt[i++];setTimeout(type,16);}}, 1400);
    }

    // ─── DOUBLE-CLICK EASTER EGG ───────────────────────
    document.querySelector('.nav__logo')?.addEventListener('dblclick', () => {
        document.body.style.transition = 'filter 0.5s';
        document.body.style.filter = 'hue-rotate(180deg)';
        showToast('Easter egg! Double-click again to reset');
        setTimeout(() => {
            document.body.style.filter = '';
            setTimeout(() => document.body.style.transition = '', 500);
        }, 2000);
    });

    // ─── COPY EMAIL ON CLICK ───────────────────────────
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            const email = el.href.replace('mailto:', '');
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!');
            }).catch(() => {
                window.location.href = el.href;
            });
        });
    });

    // ─── INIT ──────────────────────────────────────────
    updateActiveNav();
    showToast('Press 1-7 to navigate • T to toggle theme');

})();
