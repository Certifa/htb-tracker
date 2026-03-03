import { useState, useEffect, useRef } from "react";

const RECON_PHASE = {
  id: "recon", name: "Reconnaissance", icon: "🔍",
  steps: [
    { id: "n1", text: "Port scan", hint: "nmapfullscan.py", done: false, note: "" },
    { id: "n2", text: "Service & version fingerprinting", hint: "nmap -sC -sV", done: false, note: "" },
    { id: "n3", text: "/etc/hosts updated", hint: "IP · domain · DC", done: false, note: "" },
  ],
};

const ENUM_LINUX = {
  id: "enum", name: "Enumeration", icon: "📡",
  steps: [
    { id: "el1", text: "Tech stack fingerprint", hint: "whatweb · wappalyzer", done: false, note: "" },
    { id: "el2", text: "Directory bruteforce", hint: "gobuster · ffuf", done: false, note: "" },
    { id: "el3", text: "Vhost / subdomain enum", hint: "ffuf", done: false, note: "" },
    { id: "el4", text: "Parameter fuzzing", hint: "ffuf", done: false, note: "" },
    { id: "el5", text: "Manual app browsing", hint: "burp suite", done: false, note: "" },
  ],
};

const ENUM_WINDOWS = {
  id: "enum", name: "Enumeration", icon: "📡",
  steps: [
    { id: "ew1", text: "Tech stack / web fingerprint", hint: "whatweb · wappalyzer", done: false, note: "" },
    { id: "ew2", text: "Web directory bruteforce", hint: "gobuster · ffuf", done: false, note: "" },
    { id: "ew3", text: "Manual app browsing", hint: "burp suite", done: false, note: "" },
    { id: "ew4", text: "SMB shares & null session", hint: "nxc · smbclient", done: false, note: "" },
    { id: "ew5", text: "LDAP anonymous enum", hint: "ldapsearch · nxc ldap", done: false, note: "" },
    { id: "ew6", text: "User & group enumeration", hint: "nxc · kerbrute", done: false, note: "" },
    { id: "ew7", text: "DNS recon", hint: "dig axfr · dnsrecon", done: false, note: "" },
    { id: "ew8", text: "SNMP enum", hint: "snmpwalk", done: false, note: "" },
  ],
};

const EXPLOIT_PHASE = {
  id: "exploit", name: "Exploitation", icon: "💥",
  steps: [
    { id: "x1", text: "CVE / exploit research", hint: "searchsploit · exploit-db", done: false, note: "" },
    { id: "x2", text: "Manual web testing", hint: "burp suite", done: false, note: "" },
    { id: "x3", text: "SQL injection", hint: "manual · sqlmap", done: false, note: "" },
    { id: "x4", text: "Auth bypass / brute force", hint: "ffuf · hydra", done: false, note: "" },
    { id: "x5", text: "File upload / LFI / RFI / SSTI", hint: "manual · burp", done: false, note: "" },
    { id: "x6", text: "Known exploit / module", hint: "metasploit", done: false, note: "" },
    { id: "x7", text: "✅ Initial foothold", hint: "", done: false, note: "" },
  ],
};

const POST_LINUX = {
  id: "post", name: "Post-Exploitation", icon: "🐧",
  steps: [
    { id: "pl1", text: "Shell stabilization", hint: "pty · stty", done: false, note: "" },
    { id: "pl2", text: "🚩 User flag", hint: "", done: false, note: "" },
    { id: "pl3", text: "Manual local enum", hint: "sudo -l · id · env · history", done: false, note: "" },
    { id: "pl4", text: "Automated privesc scan", hint: "linpeas", done: false, note: "" },
    { id: "pl5", text: "SUID / capabilities check", hint: "find · getcap", done: false, note: "" },
    { id: "pl6", text: "Cron jobs & writable paths", hint: "manual", done: false, note: "" },
    { id: "pl7", text: "Privesc vector lookup", hint: "gtfobins", done: false, note: "" },
    { id: "pl8", text: "Credential harvesting", hint: "configs · .ssh · db · history", done: false, note: "" },
    { id: "pl9", text: "🚩 Root flag", hint: "", done: false, note: "" },
  ],
};

const POST_WINDOWS = {
  id: "post", name: "Post-Exploitation", icon: "🪟",
  steps: [
    { id: "pw1", text: "🚩 User flag", hint: "", done: false, note: "" },
    { id: "pw2", text: "Manual local enum", hint: "whoami /all · net user · net localgroup", done: false, note: "" },
    { id: "pw3", text: "Automated privesc scan", hint: "winpeas", done: false, note: "" },
    { id: "pw4", text: "Privesc vector lookup", hint: "lolbas", done: false, note: "" },
    { id: "pw5", text: "AD graph mapping", hint: "bloodhound · sharphound", done: false, note: "" },
    { id: "pw6", text: "AS-REP roasting", hint: "GetNPUsers · nxc ldap", done: false, note: "" },
    { id: "pw7", text: "Kerberoasting", hint: "GetUserSPNs · nxc ldap", done: false, note: "" },
    { id: "pw8", text: "Pass-the-Hash / Pass-the-Ticket", hint: "nxc · wmiexec · psexec · rubeus", done: false, note: "" },
    { id: "pw9", text: "ADCS abuse", hint: "certipy", done: false, note: "" },
    { id: "pw10", text: "Coercion attack", hint: "petitpotam · coercer · responder · ntlmrelayx", done: false, note: "" },
    { id: "pw11", text: "ACL / DACL abuse", hint: "bloodyAD · dacledit", done: false, note: "" },
    { id: "pw12", text: "Credential dumping", hint: "secretsdump · pypykatz", done: false, note: "" },
    { id: "pw13", text: "DCSync", hint: "secretsdump -just-dc", done: false, note: "" },
    { id: "pw14", text: "🚩 Administrator / DA", hint: "", done: false, note: "" },
  ],
};

const LOOT_PHASE = {
  id: "loot", name: "Loot & Obsidian", icon: "📝",
  steps: [
    { id: "l1", text: "Screenshots captured", hint: "flags · shells · proof", done: false, note: "" },
    { id: "l2", text: "Credentials documented", hint: "user:pass · hashes · tickets", done: false, note: "" },
    { id: "l3", text: "Exported to Obsidian", hint: "copy md button", done: false, note: "" },
    { id: "l4", text: "Attack path written", hint: "foothold → privesc → root", done: false, note: "" },
    { id: "l5", text: "Lessons & rabbit holes noted", hint: "", done: false, note: "" },
  ],
};

function buildPhases(os) {
  const enumPhase = os === "linux" ? ENUM_LINUX : ENUM_WINDOWS;
  const postPhase = os === "linux" ? POST_LINUX : POST_WINDOWS;
  return JSON.parse(JSON.stringify([RECON_PHASE, enumPhase, EXPLOIT_PHASE, postPhase, LOOT_PHASE]));
}

function HostsHelper({ ip, os }) {
  const [domain, setDomain] = useState("");
  const [dc, setDc] = useState("");
  const [copied, setCopied] = useState(false);
  const entry = [ip || "<IP>", domain || (os === "windows" ? "domain.htb" : "box.htb"), os === "windows" && dc ? dc : null].filter(Boolean).join("    ");
  const copy = () => { navigator.clipboard.writeText(entry); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const fi = { flex: 1, minWidth: 90, padding: "6px 9px", background: "#111120", border: "1px solid #1e1e38", borderRadius: 5, color: "#e2e8f0", fontFamily: "inherit", fontSize: 10, outline: "none" };
  return (
    <div style={{ background: "#0c0c1a", border: "1px solid #1a1a30", borderRadius: 7, padding: "10px 12px", marginBottom: 10 }}>
      <div style={{ fontSize: 7.5, color: "#383858", letterSpacing: 2, marginBottom: 8 }}>/ETC/HOSTS</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 7, flexWrap: "wrap" }}>
        <div style={{ ...fi, flex: "0 0 115px", color: "#404060", background: "#0e0e1c" }}>{ip || "<IP>"}</div>
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder={os === "windows" ? "domain.htb" : "box.htb"} style={fi} />
        {os === "windows" && <input value={dc} onChange={e => setDc(e.target.value)} placeholder="dc01.domain.htb" style={fi} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <code style={{ flex: 1, fontSize: 9.5, color: "#4a6a5a", background: "#0a0a12", padding: "5px 8px", borderRadius: 4, fontFamily: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry}</code>
        <button onClick={copy} style={{ padding: "4px 10px", background: copied ? "#00ff9d15" : "transparent", border: `1px solid ${copied ? "#00ff9d30" : "#1e1e38"}`, borderRadius: 4, color: copied ? "#00ff9d" : "#484868", fontFamily: "inherit", fontSize: 9, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
          {copied ? "✓" : "copy"}
        </button>
      </div>
    </div>
  );
}

function PhaseCard({ phase, onToggle, onNote, isExpanded, onToggleExpand, boxIP, boxOS }) {
  const done = phase.steps.filter(s => s.done).length;
  const total = phase.steps.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const [editingNote, setEditingNote] = useState(null);
  const taRef = useRef(null);
  useEffect(() => { if (editingNote !== null && taRef.current) taRef.current.focus(); }, [editingNote]);

  const isPost = phase.id === "post";
  const isWinPost = isPost && boxOS === "windows";
  const isLinPost = isPost && boxOS === "linux";
  const accent = isWinPost ? "#60a5fa" : isLinPost ? "#fbbf24" : "#00ff9d";
  const accentBg = isWinPost ? "#60a5fa0e" : isLinPost ? "#fbbf240e" : "#00ff9d0e";
  const accentBd = isWinPost ? "#60a5fa25" : isLinPost ? "#fbbf2425" : "#00ff9d25";
  const bar = pct === 100 ? accent : pct > 60 ? (isWinPost ? "#3b82f6" : isLinPost ? "#d97706" : "#00d4aa") : pct > 30 ? "#f59e0b" : pct > 0 ? "#ef4444" : "#2a2a3e";
  const phaseIcon = isPost ? (boxOS === "windows" ? "🪟" : "🐧") : phase.icon;

  return (
    <div style={{ background: "linear-gradient(135deg,#111120,#16162a)", border: `1px solid ${pct === 100 ? accentBd : "#1e1e38"}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", boxShadow: pct === 100 ? `0 0 14px ${accentBg}` : "0 2px 6px #0004" }}>
      <div onClick={onToggleExpand} style={{ padding: "11px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
        <span style={{ fontSize: 14 }}>{phaseIcon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: pct === 100 ? accent : "#dde4f0", letterSpacing: .3 }}>{phase.name}</span>
            <span style={{ fontSize: 9, color: "#484868", background: "#181830", padding: "1px 6px", borderRadius: 3 }}>{done}/{total}</span>
          </div>
          <div style={{ height: 2, background: "#181830", borderRadius: 1, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: bar, transition: "width .35s ease" }} />
          </div>
        </div>
        <span style={{ color: "#303050", fontSize: 9, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s", display: "inline-block" }}>▼</span>
      </div>

      {isExpanded && (
        <div style={{ padding: "0 14px 12px" }}>
          {phase.id === "recon" && (
            <div style={{ borderTop: "1px solid #181830", paddingTop: 10, marginBottom: 2 }}>
              <HostsHelper ip={boxIP} os={boxOS} />
            </div>
          )}
          {phase.steps.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "6px 0", borderTop: i === 0 ? "1px solid #181830" : "none" }}>
              <div onClick={() => onToggle(phase.id, step.id)} style={{ width: 15, height: 15, minWidth: 15, borderRadius: 3, border: `2px solid ${step.done ? accent : "#323252"}`, background: step.done ? accentBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 3, flexShrink: 0, transition: "all .15s" }}>
                {step.done && <span style={{ color: accent, fontSize: 8, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span onClick={() => onToggle(phase.id, step.id)} style={{ fontSize: 11, color: step.done ? "#323252" : "#d0dae8", textDecoration: step.done ? "line-through" : "none", cursor: "pointer", lineHeight: 1.4 }}>
                    {step.text}
                  </span>
                  {step.hint && !step.done && (
                    <span style={{ fontSize: 9, color: "#363656", fontStyle: "italic", letterSpacing: .2, lineHeight: 1 }}>
                      {step.hint}
                    </span>
                  )}
                </div>
                {step.note && editingNote !== step.id && (
                  <div onClick={() => setEditingNote(step.id)} style={{ fontSize: 10, color: accent, marginTop: 4, padding: "4px 8px", background: accentBg, borderRadius: 4, borderLeft: `2px solid ${accentBd}`, cursor: "pointer", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}>
                    {step.note}
                  </div>
                )}
                {editingNote === step.id && (
                  <textarea ref={taRef} defaultValue={step.note}
                    placeholder="findings, IPs, creds, hashes, what worked..."
                    onBlur={e => { onNote(phase.id, step.id, e.target.value); setEditingNote(null); }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.target.blur(); } }}
                    style={{ width: "100%", marginTop: 5, padding: "6px 8px", background: "#0c0c18", border: `1px solid ${accentBd}`, borderRadius: 5, color: accent, fontFamily: "inherit", fontSize: 10, resize: "vertical", minHeight: 32, outline: "none", boxSizing: "border-box" }} />
                )}
                {!step.note && editingNote !== step.id && (
                  <button onClick={() => setEditingNote(step.id)} style={{ marginTop: 3, padding: "1px 6px", background: "transparent", border: "1px solid #1e1e38", borderRadius: 3, color: "#2a2a48", fontSize: 8.5, cursor: "pointer", fontFamily: "inherit" }}>+ note</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PentestTracker() {
  const [screen, setScreen] = useState("start");
  const [boxName, setBoxName] = useState("");
  const [boxIP, setBoxIP] = useState("");
  const [boxOS, setBoxOS] = useState(null);
  const [activeBox, setActiveBox] = useState(null);
  const [phases, setPhases] = useState([]);
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [view, setView] = useState("tracker");
  const [customStep, setCustomStep] = useState({ phaseId: "", text: "", hint: "" });
  const [showAdd, setShowAdd] = useState(false);

  const total = phases.reduce((a, p) => a + p.steps.length, 0);
  const done = phases.reduce((a, p) => a + p.steps.filter(s => s.done).length, 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const userFlagId = boxOS === "linux" ? "pl2" : "pw1";
  const rootFlagId = boxOS === "linux" ? "pl9" : "pw14";
  const allSteps = phases.flatMap(p => p.steps);
  const userFlag = allSteps.find(s => s.id === userFlagId)?.done;
  const rootFlag = allSteps.find(s => s.id === rootFlagId)?.done;

  const start = () => {
    if (!boxName.trim() || !boxOS) return;
    setActiveBox({ name: boxName.trim(), ip: boxIP.trim(), os: boxOS });
    setPhases(buildPhases(boxOS));
    setExpanded({ recon: true });
    setBoxName(""); setBoxIP(""); setBoxOS(null);
    setScreen("tracker");
  };
  const toggle = (phaseId, stepId) => setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, steps: p.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s) } : p));
  const updateNote = (phaseId, stepId, n) => setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, steps: p.steps.map(s => s.id === stepId ? { ...s, note: n } : s) } : p));
  const toggleExp = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const finish = () => {
    setHistory(prev => [{ name: activeBox.name, ip: activeBox.ip, os: activeBox.os, date: new Date().toISOString().split("T")[0], done, total, pct, userFlag, rootFlag, techniques: phases.flatMap(p => p.steps).filter(s => s.done && s.note).map(s => s.text + ": " + s.note) }, ...prev]);
    setActiveBox(null); setPhases([]); setExpanded({}); setScreen("start");
  };
  const addCustom = () => {
    if (!customStep.phaseId || !customStep.text.trim()) return;
    setPhases(prev => prev.map(p => p.id === customStep.phaseId ? { ...p, steps: [...p.steps, { id: "c" + Date.now(), text: customStep.text.trim(), hint: customStep.hint.trim(), done: false, note: "" }] } : p));
    setCustomStep({ phaseId: "", text: "", hint: "" }); setShowAdd(false);
  };
  const exportMD = () => {
    if (!activeBox) return;
    let md = `# ${activeBox.name} — HTB Notes\n\n**IP:** \`${activeBox.ip || "N/A"}\`  |  **OS:** ${activeBox.os === "linux" ? "Linux 🐧" : "Windows / AD 🪟"}\n**Date:** ${new Date().toISOString().split("T")[0]}\n**Progress:** ${done}/${total} (${pct}%)\n**User:** ${userFlag ? "✅" : "❌"}  |  **Root/Admin:** ${rootFlag ? "✅" : "❌"}\n\n---\n\n`;
    phases.forEach(p => {
      md += `## ${p.id === "post" ? (activeBox.os === "windows" ? "🪟" : "🐧") : p.icon} ${p.name}\n\n`;
      p.steps.forEach(s => { md += `- [${s.done ? "x" : " "}] **${s.text}**${s.hint ? ` · _${s.hint}_` : ""}\n`; if (s.note) md += `  > ${s.note.replace(/\n/g, "\n  > ")}\n`; });
      md += "\n";
    });
    navigator.clipboard.writeText(md);
  };

  const inp = { padding: "10px 13px", background: "#111120", border: "1px solid #1e1e38", borderRadius: 7, color: "#e2e8f0", fontFamily: "inherit", fontSize: 11, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#e2e8f0", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ padding: "13px 20px 11px", borderBottom: "1px solid #141424", background: "linear-gradient(180deg,#0f0f1c,#08080f)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 9, color: "#00ff9d", letterSpacing: 4, fontWeight: 700 }}>HTB TRACKER</span>
            <span style={{ fontSize: 8, color: "#1a1a30", letterSpacing: 1 }}>certifa</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {["tracker", "history"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "3px 10px", fontFamily: "inherit", fontSize: 9, cursor: "pointer", background: view === v ? "#141424" : "transparent", border: `1px solid ${view === v ? "#00ff9d20" : "#141424"}`, borderRadius: 5, color: view === v ? "#00ff9d" : "#404060" }}>
                {v === "history" && history.length > 0 ? `History (${history.length})` : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 20px", maxWidth: 680, margin: "0 auto" }}>
        {view === "tracker" && (
          <>
            {screen === "start" && (
              <div style={{ textAlign: "center", padding: "42px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>⚔️</div>
                <div style={{ color: "#252540", fontSize: 9, marginBottom: 26, letterSpacing: 3 }}>NEW ENGAGEMENT</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 380, margin: "0 auto" }}>
                  <input value={boxName} onChange={e => setBoxName(e.target.value)} onKeyDown={e => e.key === "Enter" && start()} placeholder="Box name (e.g. Forest, IClean...)" style={inp} />
                  <input value={boxIP} onChange={e => setBoxIP(e.target.value)} onKeyDown={e => e.key === "Enter" && start()} placeholder="Target IP (e.g. 10.10.11.25)" style={inp} />
                  <div>
                    <div style={{ fontSize: 8, color: "#363656", letterSpacing: 2, marginBottom: 7, textAlign: "left" }}>TARGET OS</div>
                    <div style={{ display: "flex", gap: 7 }}>
                      {[["linux", "🐧", "Linux"], ["windows", "🪟", "Windows / AD"]].map(([os, emoji, label]) => (
                        <button key={os} onClick={() => setBoxOS(os)} style={{ flex: 1, padding: "13px 8px", background: boxOS === os ? (os === "linux" ? "#fbbf2410" : "#60a5fa10") : "#111120", border: `1px solid ${boxOS === os ? (os === "linux" ? "#fbbf2435" : "#60a5fa35") : "#1e1e38"}`, borderRadius: 8, color: boxOS === os ? (os === "linux" ? "#fbbf24" : "#60a5fa") : "#363656", fontFamily: "inherit", fontSize: 10.5, fontWeight: boxOS === os ? 700 : 400, cursor: "pointer", transition: "all .15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 20 }}>{emoji}</span>
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={start} style={{ padding: "11px", background: boxName.trim() && boxOS ? "#00ff9d" : "#141424", border: "none", borderRadius: 7, color: boxName.trim() && boxOS ? "#08080f" : "#363656", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: boxName.trim() && boxOS ? "pointer" : "default", transition: "all .2s", letterSpacing: 2, marginTop: 2 }}>
                    START BOX
                  </button>
                </div>
              </div>
            )}

            {screen === "tracker" && activeBox && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 8, color: "#363656", letterSpacing: 2.5, marginBottom: 3 }}>TARGET</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#00ff9d" }}>{activeBox.name}</div>
                      <span style={{ fontSize: 9.5, padding: "1px 7px", borderRadius: 20, background: activeBox.os === "linux" ? "#fbbf2410" : "#60a5fa10", color: activeBox.os === "linux" ? "#fbbf24" : "#60a5fa", border: `1px solid ${activeBox.os === "linux" ? "#fbbf2422" : "#60a5fa22"}` }}>
                        {activeBox.os === "linux" ? "🐧 Linux" : "🪟 Windows"}
                      </span>
                    </div>
                    {activeBox.ip && <div style={{ fontSize: 9, color: "#363656", marginTop: 2 }}>{activeBox.ip}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 21, fontWeight: 700, color: pct === 100 ? "#00ff9d" : "#dde4f0", lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: 8.5, color: "#363656", marginTop: 3 }}>{done}/{total}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 5, justifyContent: "flex-end" }}>
                      {[["user", userFlag], ["root", rootFlag]].map(([lbl, val]) => (
                        <span key={lbl} style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: val ? "#00ff9d0e" : "#141424", color: val ? "#00ff9d" : "#252540", border: `1px solid ${val ? "#00ff9d22" : "#1e1e38"}` }}>🚩 {lbl}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ height: 2, background: "#141424", borderRadius: 1, marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,#00ff9d,#00c49d)", transition: "width .4s ease" }} />
                </div>

                {phases.map(phase => (
                  <PhaseCard key={phase.id} phase={phase} onToggle={toggle} onNote={updateNote}
                    isExpanded={expanded[phase.id] || false} onToggleExpand={() => toggleExp(phase.id)}
                    boxIP={activeBox.ip} boxOS={activeBox.os} />
                ))}

                {showAdd ? (
                  <div style={{ background: "#111120", border: "1px solid #1e1e38", borderRadius: 9, padding: 12, marginTop: 7 }}>
                    <div style={{ fontSize: 8, color: "#363656", marginBottom: 7, letterSpacing: 2 }}>ADD CUSTOM STEP</div>
                    <select value={customStep.phaseId} onChange={e => setCustomStep(p => ({ ...p, phaseId: e.target.value }))} style={{ width: "100%", padding: "7px 9px", background: "#0c0c18", border: "1px solid #1e1e38", borderRadius: 5, color: "#c8d4e0", fontFamily: "inherit", fontSize: 10, marginBottom: 6, outline: "none" }}>
                      <option value="">Select phase...</option>
                      {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <input value={customStep.text} onChange={e => setCustomStep(p => ({ ...p, text: e.target.value }))} placeholder="Technique name..." style={{ flex: 2, padding: "7px 9px", background: "#0c0c18", border: "1px solid #1e1e38", borderRadius: 5, color: "#e2e8f0", fontFamily: "inherit", fontSize: 10, outline: "none" }} />
                      <input value={customStep.hint} onChange={e => setCustomStep(p => ({ ...p, hint: e.target.value }))} placeholder="tool hint (optional)" style={{ flex: 1, padding: "7px 9px", background: "#0c0c18", border: "1px solid #1e1e38", borderRadius: 5, color: "#484868", fontFamily: "inherit", fontSize: 10, outline: "none", fontStyle: "italic" }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={addCustom} style={{ flex: 1, padding: "7px", background: "#00ff9d", border: "none", borderRadius: 5, color: "#08080f", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Add</button>
                      <button onClick={() => setShowAdd(false)} style={{ padding: "7px 12px", background: "transparent", border: "1px solid #1e1e38", borderRadius: 5, color: "#363656", fontFamily: "inherit", fontSize: 11, cursor: "pointer" }}>×</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: "8px", background: "transparent", border: "1px dashed #1a1a30", borderRadius: 8, color: "#222238", fontFamily: "inherit", fontSize: 9, cursor: "pointer", marginTop: 6 }}>
                    + add custom step
                  </button>
                )}

                <div style={{ display: "flex", gap: 7, marginTop: 13 }}>
                  <button onClick={exportMD} style={{ flex: 1, padding: "10px", background: "#141424", border: "1px solid #1e1e38", borderRadius: 7, color: "#7080a0", fontFamily: "inherit", fontSize: 9, cursor: "pointer", letterSpacing: .5 }}>
                    📋 Copy Obsidian MD
                  </button>
                  <button onClick={finish} style={{ flex: 1, padding: "10px", background: pct > 50 ? "#00ff9d" : "#141424", border: pct > 50 ? "none" : "1px solid #1e1e38", borderRadius: 7, color: pct > 50 ? "#08080f" : "#363656", fontFamily: "inherit", fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: .5 }}>
                    ✓ FINISH BOX
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {view === "history" && (
          history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#1e1e38" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 9, letterSpacing: 2.5 }}>NO COMPLETED BOXES YET</div>
            </div>
          ) : (
            history.map((h, i) => (
              <div key={i} style={{ background: "#111120", border: "1px solid #1a1a30", borderRadius: 9, padding: 14, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#00ff9d" }}>{h.name}</span>
                      <span style={{ fontSize: 8.5, padding: "1px 6px", borderRadius: 20, background: h.os === "linux" ? "#fbbf2410" : "#60a5fa10", color: h.os === "linux" ? "#fbbf24" : "#60a5fa", border: `1px solid ${h.os === "linux" ? "#fbbf2422" : "#60a5fa22"}` }}>
                        {h.os === "linux" ? "🐧" : "🪟"}
                      </span>
                    </div>
                    {h.ip && <div style={{ fontSize: 9, color: "#252540", marginTop: 2 }}>{h.ip}</div>}
                    <div style={{ fontSize: 8, color: "#363656", marginTop: 3 }}>{h.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: h.pct === 100 ? "#00ff9d" : "#f59e0b" }}>{h.pct}%</span>
                    <div style={{ display: "flex", gap: 5, marginTop: 4, justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 8.5, color: h.userFlag ? "#00ff9d" : "#252540" }}>🚩 user</span>
                      <span style={{ fontSize: 8.5, color: h.rootFlag ? "#00ff9d" : "#252540" }}>🚩 root</span>
                    </div>
                  </div>
                </div>
                {h.techniques.length > 0 && (
                  <div style={{ marginTop: 9 }}>
                    <div style={{ fontSize: 7.5, color: "#363656", letterSpacing: 2, marginBottom: 5 }}>KEY FINDINGS</div>
                    {h.techniques.slice(0, 5).map((t, j) => (
                      <div key={j} style={{ fontSize: 9.5, color: "#5a6a7a", padding: "2px 0 2px 7px", borderLeft: "2px solid #1a1a30", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</div>
                    ))}
                    {h.techniques.length > 5 && <div style={{ fontSize: 8, color: "#252540", marginTop: 3 }}>+{h.techniques.length - 5} more</div>}
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
