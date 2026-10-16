import React from 'react';
import { ShieldCheck, Lock, Terminal, ShieldAlert, FileText, BookOpen, GitBranch, ArrowRight, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SiemLogEntry, UserSession, PortCheckResult, FirewallRule } from '../types/cyber';
import { generateInternshipPdf } from '../utils/pdfGenerator';

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
  logs: SiemLogEntry[];
  session: UserSession;
  ports: PortCheckResult[];
  firewallRules: FirewallRule[];
  onTriggerSimulatedAttack: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  setActiveTab,
  logs,
  session,
  ports,
  firewallRules,
  onTriggerSimulatedAttack,
}) => {
  const criticalCount = logs.filter((l) => l.severity === 'CRITICAL').length;
  const highCount = logs.filter((l) => l.severity === 'HIGH').length;
  const blockedCount = logs.filter((l) => l.actionTaken === 'BLOCKED' || l.actionTaken === 'QUARANTINED').length;
  const openPortsCount = ports.filter((p) => p.status === 'OPEN').length;
  const activeFirewallCount = firewallRules.filter((r) => r.enabled).length;

  const keyFeatures = [
    {
      id: 'auth',
      title: 'Authentication Concepts',
      desc: 'Role-based access control, brute-force lockout defense, and password entropy evaluation.',
      icon: Lock,
      status: session.isLockedOut ? 'Lockout Active' : 'Active · RBAC Enforced',
      statusColor: session.isLockedOut ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      id: 'validation',
      title: 'Input Validation',
      desc: 'Deep inspection for command injection (; && |), SQLi, XSS, and RFC IPv4 boundary validation.',
      icon: Terminal,
      status: 'Live Validator Active',
      statusColor: 'text-emerald-400',
    },
    {
      id: 'security',
      title: 'Security Checks',
      desc: 'Port scanner with vulnerability signatures (Telnet/FTP risks) and perimeter firewall rule engine.',
      icon: ShieldCheck,
      status: `${openPortsCount} Open Ports · ${activeFirewallCount} Firewall Rules`,
      statusColor: 'text-emerald-400',
    },
    {
      id: 'logging',
      title: 'SIEM Logging',
      desc: 'Real-time telemetry stream, RFC standardized schema, and 1-click CSV & JSON export.',
      icon: FileText,
      status: `${logs.length} Recorded Events`,
      statusColor: 'text-teal-400',
    },
    {
      id: 'awareness',
      title: 'Security Awareness',
      desc: 'Interactive threat encyclopedia, OWASP Top 10 guidance, and 5-question evaluation quiz.',
      icon: BookOpen,
      status: '5 Modules · Readiness Quiz',
      statusColor: 'text-sky-400',
    },
    {
      id: 'github',
      title: 'GitHub & Submission Kit',
      desc: 'Instant README.md generator, automated 8-point verification test runner, and internship report.',
      icon: GitBranch,
      status: 'Ready for GitHub Push',
      statusColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Hero Summary */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Cybersecurity Virtual Internship Practical Project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Network Monitoring & Security Posture Dashboard
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Demonstrating the five foundational cyber security modules: Authentication, Input Validation, Security Checks, SIEM Logging, and Threat Awareness. Built for portfolio deployment on GitHub.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                generateInternshipPdf({
                  studentName: 'Ahtesham Tashewale',
                  studentEmail: 'ahteshamtashewale@gmail.com',
                });
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Project PDF
            </button>
            <button
              onClick={onTriggerSimulatedAttack}
              className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Simulate Attack
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              GitHub Kit
            </button>
          </div>
        </div>

        {/* Tabular Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-400">Total Ingested Events</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">{logs.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Real-time SIEM stream</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Threats Neutralized</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">{blockedCount}</div>
            <div className="text-xs text-slate-400 mt-0.5">Firewall drops & filters</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Critical / High Alerts</div>
            <div className="text-2xl font-bold font-mono text-red-400 tabular-nums mt-1">{criticalCount + highCount}</div>
            <div className="text-xs text-slate-400 mt-0.5">Actionable incident flags</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Security Role</div>
            <div className="text-2xl font-bold font-mono text-teal-300 uppercase mt-1">{session.role}</div>
            <div className="text-xs text-slate-400 mt-0.5">PoLP Access Model</div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Grid (The 5 Key Requirements + GitHub Kit) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Core Internship Modules</h2>
            <p className="text-xs text-slate-400">Mapped directly to the virtual internship project curriculum requirements</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">5 of 5 Core Competencies Active</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="group cursor-pointer border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 rounded-xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 group-hover:border-emerald-500/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-mono font-medium ${feat.statusColor}`}>
                      {feat.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span>Open Interactive Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Threat Telemetry & Recent Incidents Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent High-Severity Security Logs */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Live SIEM Threat Ingestion (Recent)</h2>
            </div>
            <button
              onClick={() => setActiveTab('logging')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Full Event Console &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Source IP</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 text-slate-400 tabular-nums">{log.timestamp}</td>
                    <td className="py-2.5 font-semibold">
                      <span
                        className={
                          log.severity === 'CRITICAL'
                            ? 'text-red-400'
                            : log.severity === 'HIGH'
                            ? 'text-orange-400'
                            : log.severity === 'WARNING'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">{log.sourceIp}</td>
                    <td className="py-2.5 text-slate-200 font-sans max-w-xs truncate">{log.description}</td>
                    <td className="py-2.5">
                      <span
                        className={
                          log.actionTaken === 'BLOCKED' || log.actionTaken === 'QUARANTINED'
                            ? 'text-red-400 font-semibold'
                            : 'text-emerald-400'
                        }
                      >
                        {log.actionTaken}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Hardening Checklist & Status */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Security Controls Baseline</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time status of controls evaluated in virtual internship testing:
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="text-slate-300">Input Injection Barrier</span>
              <span className="text-emerald-400 font-mono font-medium">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="text-slate-300">Port 23 (Telnet) Filter</span>
              <span className="text-emerald-400 font-mono font-medium">DROPPED</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="text-slate-300">3-Strike Auth Lockout</span>
              <span className="text-emerald-400 font-mono font-medium">ARMED (30s)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="text-slate-300">TLS 1.3 Encryption</span>
              <span className="text-emerald-400 font-mono font-medium">COMPLIANT</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="text-slate-300">SIEM Audit Log Ingestion</span>
              <span className="text-emerald-400 font-mono font-medium">ACTIVE</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('github')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              Run Automated Verification Tests &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
