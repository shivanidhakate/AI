/**
 * script.js — Enhanced UI Engine
 * Features: Particle Background, DAG Renderer, Radar Chart,
 *           Risk Gauge, AI Typing Diagnosis, Pulsing Bars
 */

// ═══════════════════════════════════════════════════════
//  PARTICLE BACKGROUND
// ═══════════════════════════════════════════════════════
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '0,229,195' : '124,77,255'
        };
    }

    function initAll() {
        resize();
        particles = Array.from({ length: 90 }, createParticle);
    }

    function drawLine(a, b, dist) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,229,195,${0.15 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) drawLine(particles[i], particles[j], dist);
            }
        }
        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    initAll();
    tick();
})();


// ═══════════════════════════════════════════════════════
//  DAG DEFINITION
// ═══════════════════════════════════════════════════════
const dagNodes = [
    { id: 'smoker', label: 'Smoker', x: 120, y: 55, type: 'risk' },
    { id: 'pollution', label: 'Pollution', x: 350, y: 55, type: 'risk' },
    { id: 'obesity', label: 'Obesity', x: 580, y: 55, type: 'risk' },
    { id: 'highBP', label: 'High BP', x: 810, y: 55, type: 'risk' },
    { id: 'lungCancer', label: 'Lung Cancer', x: 120, y: 195, type: 'disease' },
    { id: 'heartDisease', label: 'Heart Disease', x: 350, y: 195, type: 'disease' },
    { id: 'diabetes', label: 'Diabetes', x: 580, y: 195, type: 'disease' },
    { id: 'flu', label: 'Influenza', x: 810, y: 195, type: 'disease' },
    { id: 'cough', label: 'Cough', x: 60, y: 335, type: 'symptom' },
    { id: 'dyspnea', label: 'Dyspnea', x: 175, y: 335, type: 'symptom' },
    { id: 'positiveXray', label: 'X-Ray+', x: 290, y: 335, type: 'symptom' },
    { id: 'chestPain', label: 'Chest Pain', x: 405, y: 335, type: 'symptom' },
    { id: 'fever', label: 'Fever', x: 520, y: 335, type: 'symptom' },
    { id: 'fatigue', label: 'Fatigue', x: 635, y: 335, type: 'symptom' },
    { id: 'excessiveThirst', label: 'Thirst', x: 750, y: 335, type: 'symptom' },
    { id: 'frequentUrination', label: 'Urination', x: 865, y: 335, type: 'symptom' },
];

const dagEdges = [
    ['smoker', 'lungCancer'], ['pollution', 'lungCancer'],
    ['smoker', 'heartDisease'], ['obesity', 'heartDisease'], ['highBP', 'heartDisease'],
    ['obesity', 'diabetes'], ['highBP', 'diabetes'],
    ['lungCancer', 'cough'], ['lungCancer', 'dyspnea'], ['lungCancer', 'positiveXray'],
    ['heartDisease', 'chestPain'], ['heartDisease', 'dyspnea'],
    ['diabetes', 'fatigue'], ['diabetes', 'excessiveThirst'], ['diabetes', 'frequentUrination'],
    ['flu', 'fever'], ['flu', 'cough'], ['flu', 'fatigue'],
];

const nodeMap = {};
dagNodes.forEach(n => nodeMap[n.id] = n);


// ═══════════════════════════════════════════════════════
//  RENDER DAG
// ═══════════════════════════════════════════════════════
function renderDAG(activeNodes = []) {
    const svg = document.getElementById('dag-svg');
    if (!svg) return;
    const VW = 930, VH = 390;
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);

    const typeColors = {
        risk: { fill: '#0d1540', stroke: '#536dfe', glow: 'rgba(83,109,254,0.5)' },
        disease: { fill: '#1a0030', stroke: '#ce93d8', glow: 'rgba(206,147,216,0.5)' },
        symptom: { fill: '#001a16', stroke: '#00e5c3', glow: 'rgba(0,229,195,0.5)' },
    };

    let defs = `<defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#00e5c3" opacity="0.55"/>
    </marker>`;
    dagNodes.forEach(n => {
        const c = typeColors[n.type];
        if (activeNodes.includes(n.id)) {
            defs += `<filter id="glow-${n.id}" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`;
        }
    });
    defs += `</defs>`;

    let edgesHTML = '';
    dagEdges.forEach(([from, to]) => {
        const f = nodeMap[from], t = nodeMap[to];
        const isActive = activeNodes.includes(from) || activeNodes.includes(to);
        // Curved path
        const mx = (f.x + t.x) / 2;
        const my = (f.y + t.y) / 2 - 20;
        edgesHTML += `<path d="M${f.x},${f.y + 18} Q${mx},${my} ${t.x},${t.y - 18}"
      fill="none"
      stroke="${isActive ? '#00e5c3' : 'rgba(0,229,195,0.12)'}"
      stroke-width="${isActive ? 2 : 1}"
      marker-end="url(#arr)"
      style="transition:all 0.5s"/>`;
    });

    let nodesHTML = '';
    dagNodes.forEach(n => {
        const c = typeColors[n.type];
        const isActive = activeNodes.includes(n.id);
        const w = 108, h = 30;
        nodesHTML += `<g transform="translate(${n.x},${n.y})" style="transition:all 0.4s"
                    ${isActive ? `filter="url(#glow-${n.id})"` : ''}>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8"
        fill="${isActive ? c.stroke : c.fill}"
        stroke="${c.stroke}" stroke-width="${isActive ? 2 : 1.2}"
        style="transition:all 0.4s"/>
      <text text-anchor="middle" dominant-baseline="middle"
        fill="${isActive ? '#000' : '#fff'}"
        font-size="11" font-family="Inter,sans-serif"
        font-weight="${isActive ? '700' : '400'}">${n.label}</text>
    </g>`;
    });

    svg.innerHTML = defs + edgesHTML + nodesHTML;
}


// ═══════════════════════════════════════════════════════
//  RADAR CHART
// ═══════════════════════════════════════════════════════
function renderRadar(probs) {
    const svg = document.getElementById('radar-svg');
    if (!svg) return;

    const cx = 130, cy = 118, R = 95;
    const labels = ['Lung Cancer', 'Diabetes', 'Heart Disease', 'Influenza'];
    const keys = ['lungCancer', 'diabetes', 'heartDisease', 'flu'];
    const colors = ['#ff6b6b', '#6bcbff', '#ff9ff3', '#ffd93d'];
    const n = labels.length;

    function pt(i, r) {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

    // Grid
    let grid = '';
    [0.25, 0.5, 0.75, 1].forEach(f => {
        const pts = Array.from({ length: n }, (_, i) => pt(i, R * f));
        grid += `<polygon points="${pts.map(p => `${p.x},${p.y}`).join(' ')}"
      fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
    });

    // Axes
    let axes = '';
    for (let i = 0; i < n; i++) {
        const p = pt(i, R);
        axes += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    }

    // Labels
    let lbls = '';
    labels.forEach((lbl, i) => {
        const p = pt(i, R + 18);
        lbls += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle"
      fill="${colors[i]}" font-size="10" font-family="Inter,sans-serif" font-weight="600">${lbl}</text>`;
    });

    // Data polygon
    const datapts = keys.map((k, i) => pt(i, R * Math.min(probs[k] || 0, 1)));
    const polyStr = datapts.map(p => `${p.x},${p.y}`).join(' ');
    const data = `
    <polygon points="${polyStr}"
      fill="rgba(0,229,195,0.15)" stroke="#00e5c3" stroke-width="2"
      style="transition:points 0.6s"/>`;

    // Dots
    let dots = '';
    datapts.forEach((p, i) => {
        dots += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${colors[i]}"
      stroke="#000" stroke-width="1.5" style="transition:cx 0.6s,cy 0.6s"/>`;
    });

    svg.innerHTML = grid + axes + lbls + data + dots;
}


// ═══════════════════════════════════════════════════════
//  RISK GAUGE
// ═══════════════════════════════════════════════════════
function updateGauge(probs, evidence = []) {
    const values = Object.values(probs);
    
    // Calculate realistic combined probability of having *at least one* disease
    // P(at least one) = 1 - P(none) = 1 - product of (1 - P(each disease))
    const chanceOfNoDisease = values.reduce((acc, p) => acc * (1 - p), 1);
    let score = (1 - chanceOfNoDisease) * 100;

    // Safeguard ensuring it perfectly reflects 0 to 100
    const capped = Math.max(0, Math.min(score, 100));

    const arc = document.getElementById('gauge-arc');
    const numEl = document.getElementById('gauge-num');
    const statusEl = document.getElementById('gauge-status');

    const totalLen = 251;
    const offset = totalLen - (totalLen * capped / 100);
    if (arc) arc.style.strokeDashoffset = offset;
    if (numEl) numEl.textContent = capped.toFixed(1);

    if (statusEl) {
        if (capped >= 60) { statusEl.textContent = '⚠ HIGH RISK DETECTED'; statusEl.className = 'gauge-status status-high'; }
        else if (capped >= 30) { statusEl.textContent = '⚡ MODERATE RISK'; statusEl.className = 'gauge-status status-med'; }
        else { statusEl.textContent = '✓ LOW RISK'; statusEl.className = 'gauge-status'; }
    }
}


// ═══════════════════════════════════════════════════════
//  PROBABILITY BARS
// ═══════════════════════════════════════════════════════
const diseaseConfig = {
    lungCancer: { barId: 'bar-lung', valId: 'val-lung', badgeId: 'badge-lung', cardClass: 'lung' },
    diabetes: { barId: 'bar-diabetes', valId: 'val-diabetes', badgeId: 'badge-diabetes', cardClass: 'diabetes' },
    heartDisease: { barId: 'bar-heart', valId: 'val-heart', badgeId: 'badge-heart', cardClass: 'heart' },
    flu: { barId: 'bar-flu', valId: 'val-flu', badgeId: 'badge-flu', cardClass: 'flu' },
};

function updateBars(probs) {
    Object.entries(diseaseConfig).forEach(([key, cfg]) => {
        const pctVal = (probs[key] || 0) * 100;
        const pctStr = pctVal.toFixed(1);
        const bar = document.getElementById(cfg.barId);
        const val = document.getElementById(cfg.valId);
        const badge = document.getElementById(cfg.badgeId);
        const card = document.querySelector(`[data-disease="${key}"]`);

        if (bar) { bar.style.width = pctStr + '%'; }
        if (val) { val.textContent = pctStr + '%'; }

        // High-risk glow on bar
        if (bar) { pctVal >= 50 ? bar.classList.add('pulsing') : bar.classList.remove('pulsing'); }
        if (card) { pctVal >= 50 ? card.classList.add('high-risk') : card.classList.remove('high-risk'); }

        // Badge
        if (badge) {
            if (pctVal >= 60) { badge.textContent = 'HIGH'; badge.className = 'risk-badge risk-high'; }
            else if (pctVal >= 30) { badge.textContent = 'MODERATE'; badge.className = 'risk-badge risk-med'; }
            else { badge.textContent = 'LOW'; badge.className = 'risk-badge risk-low'; }
        }

        // Update val color
        if (val) {
            if (pctVal >= 60) val.style.color = '#ff4444';
            else if (pctVal >= 30) val.style.color = '#ffa726';
            else val.style.color = 'var(--text)';
        }
    });
}


// ═══════════════════════════════════════════════════════
//  AI TYPING DIAGNOSIS
// ═══════════════════════════════════════════════════════
let typingTimer = null;

function generateDiagnosis(probs, evidence) {
    const sorted = Object.entries(probs)
        .sort(([, a], [, b]) => b - a)
        .map(([k, v]) => ({ key: k, pct: ((v * 100).toFixed(1)) }));

    const names = {
        lungCancer: 'Lung Cancer', diabetes: 'Diabetes',
        heartDisease: 'Heart Disease', flu: 'Influenza'
    };

    if (evidence.length === 0) {
        return 'Awaiting patient data... Select symptoms from the left panel to begin analysis.';
    }

    const top = sorted[0];
    let text = `Bayesian analysis complete. `;

    if (top.pct >= 60) {
        text += `⚠ HIGH ALERT: ${names[top.key]} at ${top.pct}% probability. `;
        text += `Immediate clinical evaluation recommended. `;
    } else if (top.pct >= 30) {
        text += `Elevated risk of ${names[top.key]} (${top.pct}%). `;
        text += `Second opinion and diagnostic tests advised. `;
    } else {
        text += `Low overall risk profile detected. `;
    }

    const highRisk = sorted.filter(d => d.pct >= 30);
    if (highRisk.length > 1) {
        text += `Secondary concern: ${names[highRisk[1].key]} (${highRisk[1].pct}%). `;
    }

    text += `Based on ${evidence.length} observed symptom(s).`;
    return text;
}

function typeText(target, text) {
    clearTimeout(typingTimer);
    const dot = document.getElementById('typing-dot');
    if (dot) dot.classList.add('active');

    target.textContent = '';
    let i = 0;
    function step() {
        if (i < text.length) {
            target.textContent += text[i++];
            typingTimer = setTimeout(step, 18);
        } else {
            if (dot) dot.classList.remove('active');
        }
    }
    step();
}


// ═══════════════════════════════════════════════════════
//  MAIN UPDATE
// ═══════════════════════════════════════════════════════
function getEvidence() {
    return Array.from(document.querySelectorAll('.symptom-cb:checked')).map(cb => cb.value);
}

function update() {
    const evidence = getEvidence();
    let probs = BayesianEngine.queryIndependent(evidence);

    // If no symptoms are selected, zero out the baseline priors across the dashboard 
    // so every visual element (radar, bars, gauge) begins cleanly at 0%
    if (evidence.length === 0) {
        Object.keys(probs).forEach(key => { probs[key] = 0; });
    }

    // Active DAG nodes
    const activeNodes = [...evidence];
    Object.entries(probs).forEach(([d, v]) => { if (v > 0.15) activeNodes.push(d); });

    renderDAG(activeNodes);
    renderRadar(probs);
    updateGauge(probs, evidence);
    updateBars(probs);

    // Symptom badge counter
    const badge = document.getElementById('symptom-count-badge');
    if (badge) {
        badge.textContent = evidence.length;
        badge.classList.remove('pop');
        void badge.offsetWidth;
        badge.classList.add('pop');
    }

    // AI typing
    const aiText = document.getElementById('ai-text');
    if (aiText) {
        const diagnosis = generateDiagnosis(probs, evidence);
        clearTimeout(typingTimer);
        setTimeout(() => typeText(aiText, diagnosis), 200);
    }
}


// ═══════════════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.symptom-cb').forEach(cb => {
        cb.addEventListener('change', update);
    });

    document.getElementById('reset-btn')?.addEventListener('click', () => {
        document.querySelectorAll('.symptom-cb').forEach(cb => cb.checked = false);
        update();
    });

    // Click on disease card to expand/collapse info
    document.querySelectorAll('.disease-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('expanded'));
    });

    update();
    window.addEventListener('resize', update);
});
