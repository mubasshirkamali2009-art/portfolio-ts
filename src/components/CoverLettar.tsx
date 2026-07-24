/**
 * CVSection.tsx
 * -------------------------------------------------------------
 * Matches your site's theme: near-black background, violet/purple
 * accent, orange + teal secondary accents (same as your journey
 * timeline dots), pill-style tags, subtle bordered cards.
 *
 * Fully optimized for all responsive viewports.
 * -------------------------------------------------------------
 */

const profile = {
  name: "Mubasshir Rohman Kamali",
  role: "Full-Stack Developer",
  tag: "SSC Candidate 2026",
  bio: "Self-taught full-stack developer building end-to-end web apps — from responsive UIs to authenticated APIs. Currently exploring context engineering and email-service integration.",
  email: "mubasshirpov@gmail.com",
  phone: "01328287689",
  location: "Uposhahar, Sylhet",
  github: "https://github.com/mubasshirkamali2009-art",
  linkedin: "https://www.linkedin.com/in/mubasshir-rohman",
  resumeHref: "/resume.pdf",
};

const personal = [
  { label: "Father's Name", value: "Mijanur Rohman Kamali" },
  { label: "Mother's Name", value: "Nurjahan Begum" },
  { label: "Present Address", value: "Uposhahar, Sylhet" },
  { label: "Permanent Address", value: "Shaharpara, Jagannathpur, Sunamganj" },
];

const education = [
  {
    year: "2026",
    title: "SSC Candidate",
    place: "Shahjalal Uposhahar, Sylhet",
    description: "Appearing for the Secondary School Certificate examination.",
    color: "purple",
  },
];

const skillGroups = [
  {
    heading: "Frontend",
    color: "purple",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "DaisyUI", "Hero UI", "Framer Motion", "HTML", "CSS" , "Javascript" , "Card operetion" , "Responsive Ui" , "AI Implimention" , "AI Copilot"],
  },
  {
    heading: "Backend",
    color: "orange",
    skills: ["Node.js", "Express.js", "JWT Auth", "Better Auth", "Context Engineering" , "MongoDB" , "AI LLM"] ,
  },
  {
    heading: "Currently Exploring",
    color: "teal",
    skills: ["Email / Mail Service Integration" , "React native" , "python" , ],
  },
];

const accent: Record<string, string> = {
  purple: "var(--cv-purple)",
  orange: "var(--cv-orange)",
  teal: "var(--cv-teal)",
};

export default function CVSection() {
  return (
    <section className="cv-section">
      <style>{`
        :root{
          --cv-bg:#07070b;
          --cv-bg-2:#0c0c13;
          --cv-purple:#8b5cf6;
          --cv-orange:#f5a623;
          --cv-teal:#22c3a6;
          --cv-text:#f4f4f7;
          --cv-muted:#9093a8;
          --cv-card:rgba(255,255,255,0.025);
          --cv-border:rgba(255,255,255,0.08);
        }
        .cv-section{
          position:relative;
          width:100%;
          padding:60px 16px;
          background:var(--cv-bg);
          font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
          color:var(--cv-text);
        }
        .cv-inner{
          max-width:1100px;
          margin:0 auto;
          display:grid;
          grid-template-columns:330px 1fr;
          gap:32px;
        }

        /* ---------- LEFT: profile card ---------- */
        .cv-profile{
          background:var(--cv-card);
          border:1px solid var(--cv-border);
          border-radius:20px;
          padding:30px 24px;
          height:fit-content;
          position:sticky;
          top:24px;
        }
        .cv-avatar{
          width:70px;
          height:70px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.4rem;
          font-weight:800;
          color:#07070b;
          background:linear-gradient(135deg,var(--cv-purple),#5b3ecf);
          margin-bottom:16px;
        }
        .cv-tag{
          display:inline-block;
          font-size:.72rem;
          font-weight:700;
          letter-spacing:.02em;
          color:var(--cv-purple);
          background:rgba(139,92,246,.12);
          border:1px solid rgba(139,92,246,.3);
          padding:4px 11px;
          border-radius:20px;
          margin-bottom:12px;
        }
        .cv-name{
          font-size:1.5rem;
          font-weight:800;
          margin:0 0 6px;
          line-height:1.3;
        }
        .cv-role{
          color:var(--cv-purple);
          font-size:1rem;
          font-weight:600;
          margin:0 0 16px;
        }
        .cv-bio{
          color:var(--cv-muted);
          font-size:.87rem;
          line-height:1.65;
          margin:0 0 20px;
        }
        .cv-contact{
          display:flex;
          flex-direction:column;
          gap:12px;
          margin-bottom:20px;
        }
        .cv-contact-row{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:.85rem;
          color:var(--cv-muted);
          text-decoration:none;
          word-break:break-all;
        }
        .cv-contact-row svg{ flex-shrink:0; color:var(--cv-purple); }
        a.cv-contact-row:hover{ color:var(--cv-text); }

        .cv-socials{
          display:flex;
          gap:10px;
          margin-bottom:22px;
        }
        .cv-social-btn{
          width:38px;
          height:38px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:1px solid var(--cv-border);
          color:var(--cv-muted);
          text-decoration:none;
          transition:border-color .15s ease, color .15s ease;
        }
        .cv-social-btn:hover{
          border-color:var(--cv-purple);
          color:var(--cv-purple);
        }

        .cv-download{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          width:100%;
          padding:12px 18px;
          border-radius:12px;
          border:none;
          font-size:.9rem;
          font-weight:700;
          color:#07070b;
          background:linear-gradient(135deg,var(--cv-purple),#6d3ee0);
          text-decoration:none;
          box-shadow:0 8px 20px rgba(139,92,246,.25);
          transition:transform .15s ease, box-shadow .15s ease;
        }
        .cv-download:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 26px rgba(139,92,246,.35);
        }

        /* ---------- RIGHT column ---------- */
        .cv-right{
          display:flex;
          flex-direction:column;
          gap:24px;
        }
        .cv-card{
          background:var(--cv-card);
          border:1px solid var(--cv-border);
          border-radius:20px;
          padding:24px;
        }
        .cv-card-heading{
          font-size:1.15rem;
          font-weight:800;
          margin:0 0 18px;
        }

        /* personal details grid */
        .cv-personal-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px 24px;
        }
        .cv-personal-label{
          font-size:.72rem;
          text-transform:uppercase;
          letter-spacing:.04em;
          color:var(--cv-muted);
          margin:0 0 4px;
        }
        .cv-personal-value{
          font-size:.92rem;
          font-weight:600;
          margin:0;
          line-height:1.4;
        }

        /* education timeline */
        .cv-edu-item{
          position:relative;
          padding-left:22px;
        }
        .cv-edu-dot{
          position:absolute;
          left:0;
          top:6px;
          width:10px;
          height:10px;
          border-radius:50%;
        }
        .cv-edu-year{
          font-size:.75rem;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.03em;
          margin:0 0 4px;
        }
        .cv-edu-title{
          font-size:1.05rem;
          font-weight:700;
          margin:0 0 2px;
        }
        .cv-edu-place{
          font-size:.85rem;
          color:var(--cv-muted);
          font-style:italic;
          margin:0 0 8px;
        }
        .cv-edu-desc{
          font-size:.87rem;
          color:var(--cv-muted);
          line-height:1.6;
          margin:0;
        }

        /* skills */
        .cv-skill-group{ margin-bottom:20px; }
        .cv-skill-group:last-child{ margin-bottom:0; }
        .cv-skill-heading{
          display:flex;
          align-items:center;
          gap:8px;
          font-size:.88rem;
          font-weight:700;
          margin:0 0 12px;
        }
        .cv-skill-dot{
          width:8px;
          height:8px;
          border-radius:50%;
        }
        .cv-skill-tags{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
        }
        .cv-skill-tag{
          font-size:.8rem;
          font-weight:600;
          padding:6px 13px;
          border-radius:20px;
          border:1px solid var(--cv-border);
          color:var(--cv-text);
          background:rgba(255,255,255,.02);
        }

        /* Responsive Breakpoint fixes */
        @media (max-width: 868px) {
          .cv-inner {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .cv-profile {
            position: relative;
            top: 0;
            width: 100%;
          }
        }

        @media (max-width: 550px) {
          .cv-section {
            padding: 40px 12px;
          }
          .cv-personal-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cv-card {
            padding: 20px 16px;
          }
        }
      `}</style>

      <div className="cv-inner">
        {/* LEFT: profile card */}
        <div className="cv-profile">
          <div className="cv-avatar">MK</div>
          <span className="cv-tag">{profile.tag}</span>
          <h3 className="cv-name">{profile.name}</h3>
          <p className="cv-role">{profile.role}</p>
          <p className="cv-bio">{profile.bio}</p>

          <div className="cv-contact">
            <a className="cv-contact-row" href={`mailto:${profile.email}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {profile.email}
            </a>
            <a className="cv-contact-row" href={`tel:${profile.phone}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {profile.phone}
            </a>
            <div className="cv-contact-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {profile.location}
            </div>
          </div>

          <div className="cv-socials">
            <a className="cv-social-btn" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.04 1.53 1.04.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
            <a className="cv-social-btn" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z" />
              </svg>
            </a>
          </div>

          <a className="cv-download" href={profile.resumeHref} download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download CV
          </a>
        </div>

        {/* RIGHT column */}
        <div className="cv-right">
          {/* personal details */}
          <div className="cv-card">
            <h4 className="cv-card-heading">Personal Details</h4>
            <div className="cv-personal-grid">
              {personal.map((p) => (
                <div key={p.label}>
                  <p className="cv-personal-label">{p.label}</p>
                  <p className="cv-personal-value">{p.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* education */}
          <div className="cv-card">
            <h4 className="cv-card-heading">Education</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {education.map((e, i) => (
                <div className="cv-edu-item" key={i}>
                  <span className="cv-edu-dot" style={{ background: accent[e.color] }} />
                  <p className="cv-edu-year" style={{ color: accent[e.color] }}>
                    {e.year}
                  </p>
                  <p className="cv-edu-title">{e.title}</p>
                  <p className="cv-edu-place">{e.place}</p>
                  <p className="cv-edu-desc">{e.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* skills */}
          <div className="cv-card">
            <h4 className="cv-card-heading">Skills &amp; Tech Stack</h4>
            {skillGroups.map((group) => (
              <div className="cv-skill-group" key={group.heading}>
                <p className="cv-skill-heading">
                  <span className="cv-skill-dot" style={{ background: accent[group.color] }} />
                  {group.heading}
                </p>
                <div className="cv-skill-tags">
                  {group.skills.map((s) => (
                    <span className="cv-skill-tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}