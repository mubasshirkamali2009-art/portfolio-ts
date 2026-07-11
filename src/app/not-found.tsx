"use client";

interface Star {
  left: number;
  top: number;
  delay: number;
}

// Deterministic pseudo-random scatter — same output on server and client,
// so no useEffect/useState (and no hydration mismatch) is needed for this.
const STARS: Star[] = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 55,
  delay: ((i * 13) % 24) / 10,
}));

export default function NotFound404() {

  return (
    <div className="scene">
      <style>{`
        :root{
          --sky-top:#050a14;
          --sky-bot:#0c2038;
          --road:#131a26;
          --road-line:#f4d35e;
          --hole:#050505;
          --neon-teal:#3fb8ff;
          --neon-pink:#2451ff;
          --card-bg:rgba(8,14,26,0.85);
          --text:#eef3fb;
          --muted:#7d93b8;
          --skin:#f0c39a;
          --hair:#15131a;
          --hoodie:#19171f;
          --hoodie-2:#242229;
          --pants:#2e2e38;
          --shoe:#111116;
          --sole:#f2f2f2;
          --pack:#201f26;
        }
        *{box-sizing:border-box;}
        .scene{
          position:relative;
          width:100%;
          height:100vh;
          min-height:520px;
          overflow:hidden;
          margin:0;
          background:linear-gradient(var(--sky-top),var(--sky-bot));
          font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
        }

        /* ---------- STARS ---------- */
        .star{
          position:absolute;
          width:3px;height:3px;
          background:#fff;
          border-radius:50%;
          opacity:.7;
          animation:twinkle 2.4s ease-in-out infinite;
        }
        @keyframes twinkle{
          0%,100%{opacity:.2;}
          50%{opacity:1;}
        }

        /* ---------- ROAD ---------- */
        .ground{
          position:absolute;
          bottom:0; left:0; right:0;
          height:110px;
          background:var(--road);
          border-top:3px solid #171420;
        }
        .road-line{
          position:absolute;
          bottom:55px; left:0; right:0;
          height:6px;
          background-image:repeating-linear-gradient(90deg,var(--road-line) 0 40px, transparent 40px 80px);
          opacity:.6;
          animation:drift 3s linear infinite;
        }
        @keyframes drift{
          from{background-position-x:0;}
          to{background-position-x:-80px;}
        }

        /* ---------- MANHOLE ---------- */
        .manhole-wrap{
          position:absolute;
          left:64%;
          bottom:76px;
          width:150px;
          height:60px;
          transform:translateX(-50%);
        }
        .hole{
          position:absolute;
          left:35px; bottom:0;
          width:80px; height:32px;
          background:radial-gradient(ellipse at center, var(--hole) 0%, #14101f 70%, transparent 72%);
          border-radius:50%;
          box-shadow:inset 0 8px 18px #000;
        }
        .cone-svg{ position:absolute; left:-6px; bottom:0; width:40px; animation:wobble 3s ease-in-out infinite; transform-origin:bottom center;}
        @keyframes wobble{
          0%,100%{transform:rotate(-3deg);}
          50%{transform:rotate(3deg);}
        }
        .cover-svg{ position:absolute; right:0px; bottom:2px; width:52px; animation:coverspin 6s linear infinite; transform-origin:center; }
        @keyframes coverspin{
          from{transform:rotate(0deg);}
          to{transform:rotate(360deg);}
        }

        /* ---------- BOY ---------- */
        .boy{
          position:absolute;
          bottom:78px;
          left:-18%;
          width:96px;
          z-index:5;
          animation:journey 5.2s cubic-bezier(.5,0,.7,1) forwards;
          filter:drop-shadow(0 8px 6px rgba(0,0,0,.45));
        }
        .boy-inner{
          display:block;
          animation:bob .38s ease-in-out infinite;
        }
        @keyframes bob{
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-5px);}
        }
        @keyframes journey{
          0%   { left:-18%; transform:rotate(0deg) scale(1); opacity:1; }
          52%  { left:56%;  transform:rotate(0deg) scale(1); opacity:1; }
          62%  { left:61%;  transform:rotate(-16deg) scale(1); opacity:1; }
          72%  { left:63%;  transform:translateY(30px) rotate(65deg) scale(.82); opacity:1; }
          83%  { left:64%;  transform:translateY(130px) rotate(220deg) scale(.5); opacity:.85; }
          92%  { left:64%;  transform:translateY(230px) rotate(400deg) scale(.15); opacity:0; }
          100% { left:64%;  transform:translateY(230px) rotate(400deg) scale(.15); opacity:0; }
        }
        .leg-front{ animation: legFront .5s ease-in-out infinite; transform-origin: 70px 150px; }
        .leg-back{ animation: legBack .5s ease-in-out infinite; transform-origin: 70px 150px; }
        @keyframes legFront{ 0%,100%{transform:rotate(16deg);} 50%{transform:rotate(-16deg);} }
        @keyframes legBack{ 0%,100%{transform:rotate(-16deg);} 50%{transform:rotate(16deg);} }

        /* ---------- IMPACT ---------- */
        .thud{
          position:absolute;
          left:64%;
          bottom:75px;
          transform:translateX(-50%) scale(0);
          font-weight:900;
          font-size:1.9rem;
          color:var(--neon-pink);
          text-shadow:0 0 12px var(--neon-pink);
          opacity:0;
          animation:thudpop .6s ease-out forwards;
          animation-delay:4.05s;
          z-index:6;
          letter-spacing:1px;
        }
        @keyframes thudpop{
          0%{transform:translateX(-50%) scale(0) rotate(-8deg); opacity:0;}
          50%{transform:translateX(-50%) scale(1.25) rotate(4deg); opacity:1;}
          100%{transform:translateX(-50%) scale(1) rotate(-2deg); opacity:1;}
        }

        .puff{
          position:absolute;
          left:64%; bottom:80px;
          transform:translate(-50%,0) scale(0);
          opacity:0;
          animation:puffAnim 1s ease-out forwards;
          animation-delay:4s;
        }
        .puff span{
          position:absolute;
          width:14px; height:14px;
          background:#cfc9dd;
          border-radius:50%;
          opacity:.8;
        }
        @keyframes puffAnim{
          0%{transform:translate(-50%,0) scale(0); opacity:0;}
          40%{transform:translate(-50%,-24px) scale(1.5); opacity:.85;}
          100%{transform:translate(-50%,-50px) scale(2); opacity:0;}
        }

        /* floating code bits */
        .bit{
          position:absolute;
          bottom:92px;
          font-family:Consolas,'Courier New',monospace;
          font-size:.82rem;
          color:var(--neon-teal);
          opacity:0;
          white-space:nowrap;
          animation:floatup 2.4s ease-out forwards;
        }
        @keyframes floatup{
          0%{opacity:0; transform:translateY(0) translateX(0) rotate(0deg);}
          15%{opacity:1;}
          100%{opacity:0; transform:translateY(-140px) translateX(var(--dx,20px)) rotate(16deg);}
        }
        .bit1{left:54%; animation-delay:4.3s; --dx:-40px;}
        .bit2{left:62%; animation-delay:4.55s; --dx:30px;}
        .bit3{left:68%; animation-delay:4.8s; --dx:60px;}
        .bit4{left:58%; animation-delay:5.05s; --dx:-10px;}

        /* ---------- 404 CARD ---------- */
        .card{
          position:absolute;
          top:50%; left:50%;
          transform:translate(-50%,-45%);
          width:min(90%,460px);
          text-align:center;
          padding:30px 26px 28px;
          border-radius:20px;
          background:var(--card-bg);
          border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(6px);
          box-shadow:0 20px 60px rgba(0,0,0,.5);
          opacity:0;
          animation:cardin .8s ease-out forwards;
          animation-delay:4.7s;
          z-index:10;
        }
        @keyframes cardin{
          0%{opacity:0; transform:translate(-50%,-35%) scale(.92);}
          100%{opacity:1; transform:translate(-50%,-45%) scale(1);}
        }
        .code404{
          font-size:clamp(3.2rem,14vw,5rem);
          font-weight:900;
          margin:0;
          letter-spacing:2px;
          color:var(--text);
          text-shadow:2px 0 var(--neon-teal), -2px 0 var(--neon-pink);
          animation:glitch 3.2s infinite steps(1);
        }
        @keyframes glitch{
          0%,92%,100%{text-shadow:2px 0 var(--neon-teal), -2px 0 var(--neon-pink);}
          93%{text-shadow:-3px 1px var(--neon-teal), 3px -1px var(--neon-pink); transform:skewX(2deg);}
          95%{text-shadow:3px -1px var(--neon-teal), -3px 1px var(--neon-pink); transform:skewX(-2deg);}
          97%{transform:skewX(0);}
        }
        .headline{
          color:var(--text);
          font-size:1.12rem;
          font-weight:700;
          margin:10px 0 6px;
          line-height:1.5;
        }
        .sub{
          color:var(--muted);
          font-size:.92rem;
          margin:0 0 22px;
          line-height:1.6;
        }
        .btn-row{
          display:flex;
          gap:12px;
          justify-content:center;
          flex-wrap:wrap;
        }
        .card button{
          font-family:inherit;
          font-size:.95rem;
          font-weight:700;
          padding:12px 22px;
          border-radius:12px;
          border:none;
          cursor:pointer;
          display:inline-flex;
          align-items:center;
          gap:8px;
          transition:transform .15s ease, box-shadow .15s ease;
        }
        .card button:active{transform:scale(.96);}
        .btn-home{
          background:linear-gradient(135deg,var(--neon-teal),#1d5fd6);
          color:#04101f;
          box-shadow:0 6px 18px rgba(63,184,255,.35);
        }
        .btn-home:hover{transform:translateY(-2px); box-shadow:0 10px 22px rgba(63,184,255,.45);}
        .btn-back{
          background:transparent;
          color:var(--text);
          border:1.5px solid rgba(255,255,255,.25);
        }
        .btn-back:hover{border-color:var(--neon-pink); color:var(--neon-pink); transform:translateY(-2px);}

        @media (prefers-reduced-motion: reduce){
          *{animation-duration:.01ms !important; animation-iteration-count:1 !important;}
        }
      `}</style>

      <div className="ground" />
      <div className="road-line" />

      <div className="manhole-wrap">
        <div className="hole" />

        <svg className="cone-svg" viewBox="0 0 40 46">
          <polygon points="20,2 34,42 6,42" fill="#ff8a3d" />
          <polygon points="12,26 28,26 30,34 10,34" fill="#fff" />
          <rect x="4" y="40" width="32" height="5" rx="2" fill="#c25a1e" />
        </svg>

        <svg className="cover-svg" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="27" fill="#2b2a30" stroke="#111" strokeWidth={3} />
          <circle cx="30" cy="30" r="19" fill="none" stroke="#111" strokeWidth={2} />
          <circle cx="30" cy="30" r="4" fill="#111" />
          <line x1="30" y1="6" x2="30" y2="54" stroke="#111" strokeWidth={2} />
          <line x1="6" y1="30" x2="54" y2="30" stroke="#111" strokeWidth={2} />
        </svg>
      </div>

      <div className="boy">
        <div className="boy-inner">
          <svg viewBox="0 0 140 260" width="100%">
            {/* backpack */}
            <rect x="14" y="72" width="36" height="66" rx="10" fill="var(--pack)" />
            <rect x="19" y="80" width="9" height="16" rx="3" fill="#141319" />

            {/* back leg */}
            <g className="leg-back">
              <rect x="58" y="150" width="20" height="66" rx="8" fill="var(--pants)" />
              <path d="M53 211 h30 l6 13 q2 6 -6 6 h-38 q-8 0 -6 -8 z" fill="var(--shoe)" />
              <rect x="53" y="228" width="42" height="5" rx="2.5" fill="var(--sole)" />
              <path d="M56 213 l24 8" stroke="#fff" strokeWidth={2} opacity={0.7} />
            </g>

            {/* front leg */}
            <g className="leg-front">
              <rect x="72" y="150" width="20" height="68" rx="8" fill="#34343f" />
              <path d="M67 214 h32 l7 13 q2 6 -6 6 h-40 q-8 0 -6 -8 z" fill="#0d0d10" />
              <rect x="67" y="231" width="44" height="5" rx="2.5" fill="var(--sole)" />
              <path d="M70 216 l26 8" stroke="#fff" strokeWidth={2} opacity={0.7} />
            </g>

            {/* torso / hoodie */}
            <path
              d="M40 92 q0 -34 34 -34 q34 0 34 34 v52 q0 14 -14 14 h-40 q-14 0 -14 -14 z"
              fill="var(--hoodie)"
            />
            {/* hood collar */}
            <path d="M50 62 q20 -17 38 0 q-5 11 -19 11 q-14 0 -19 -11 z" fill="var(--hoodie-2)" />
            <line x1="66" y1="76" x2="63" y2="94" stroke="#000" strokeWidth={2} />
            <line x1="76" y1="76" x2="79" y2="94" stroke="#000" strokeWidth={2} />

            {/* arms */}
            <path d="M40 96 q-18 8 -18 38 q0 9 9 9 h11 q2 -18 8 -30 z" fill="var(--hoodie)" />
            <path d="M98 96 q14 6 12 26 q-10 -4 -20 4 q3 -18 8 -30 z" fill="var(--hoodie)" />
            <circle cx="30" cy="143" r="7.5" fill="var(--skin)" />

            {/* laptop */}
            <g transform="translate(20,114) rotate(-6)">
              <rect x="0" y="17" width="66" height="6" rx="2" fill="#9aa0a8" />
              <path d="M0 17 L7 -26 h52 l7 43 z" fill="#c9cdd3" />
              <path d="M7 -20 h52 l5 32 h-62 z" fill="#0d0e12" />
              <text
                x="38"
                y="0"
                fontFamily="Consolas,monospace"
                fontSize={13}
                fill="var(--neon-teal)"
                textAnchor="middle"
              >
                {"</>"}
              </text>
            </g>

            {/* typing hand, resting right on the keyboard */}
            <circle cx="78" cy="129" r="7" fill="var(--skin)" />
            <rect x="72" y="126" width="14" height="9" rx="3" fill="var(--skin)" />

            {/* head */}
            <circle cx="74" cy="40" r="25" fill="var(--skin)" />
            <circle cx="52" cy="42" r="5" fill="var(--skin)" />
            {/* hair */}
            <path
              d="M48 22 q-4 -24 25 -25 q29 -2 30 19 q9 -2 7 11 q-3 -5 -9 -3 q2 9 -6 15 q4 -13 -7 -17 q-4 9 -15 7 q6 -7 -1 -11 q-6 9 -18 6 q4 6 -4 8 q-4 -6 -1 -10 z"
              fill="var(--hair)"
            />
            {/* face */}
            <circle cx="81" cy="38" r="2.2" fill="var(--hair)" />
            <path d="M85 47 q5 3 9 -1" stroke="#5a3a28" strokeWidth={2} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="puff">
        <span style={{ left: "-14px", top: "0px" }} />
        <span style={{ left: "0px", top: "-6px" }} />
        <span style={{ left: "14px", top: "0px" }} />
      </div>
      <div className="thud">THUD!!</div>

      <div className="bit bit1">console.log(&quot;brb...&quot;)</div>
      <div className="bit bit2">undefined</div>
      <div className="bit bit3">Uncaught HoleError</div>
      <div className="bit bit4">git commit -m &quot;oops&quot;</div>

      <div className="card">
        <p className="code404">404</p>
        <p className="headline">
          This guy was coding so hard while walking, he face-planted straight into a manhole.
        </p>
        <p className="sub">The page did the exact same thing. Neither of them saw it coming.</p>
        <div className="btn-row">
          <button className="btn-home" onClick={() => (window.location.href = "/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <path d="M3 11l9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
            Home
          </button>
          
        </div>
      </div>

      {STARS.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}