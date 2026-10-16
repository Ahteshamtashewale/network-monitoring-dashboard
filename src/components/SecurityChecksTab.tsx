import React, { useState } from 'react';
import { ShieldCheck, Play, Plus, CheckCircle, ShieldAlert, Lock, Globe, Server, ShieldX } from 'lucide-react';
import { FirewallRule, PortCheckResult, UserSession } from '../types/cyber';

interface SecurityChecksTabProps {
  ports: PortCheckResult[];
  firewallRules: FirewallRule[];
  session: UserSession;
  onToggleFirewallRule: (id: string) => void;
  onAddFirewallRule: (rule: Omit<FirewallRule, 'id'>) => void;
  onScanPorts: () => void;
  isScanning: boolean;
}

export const SecurityChecksTab: React.FC<SecurityChecksTabProps> = ({
  ports,
  firewallRules,
  session,
  onToggleFirewallRule,
  onAddFirewallRule,
  onScanPorts,
  isScanning,
}) => {
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePort, setNewRulePort] = useState('8080');
  const [newRuleAction, setNewRuleAction] = useState<'ALLOW' | 'DROP'>('DROP');
  const [targetHost, setTargetHost] = useState('192.168.1.1 (Perimeter Gateway)');

  const canModifyFirewall = session.role === 'admin';

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModifyFirewall) return;

    onAddFirewallRule({
      name: newRuleName || `Block Port ${newRulePort}`,
      sourceIp: '0.0.0.0/0',
      targetPort: Number(newRulePort) || 'ALL',
      protocol: 'TCP',
      action: newRuleAction,
      enabled: true,
      reason: 'Custom administrative policy enforcement.',
    });

    setNewRuleName('');
    setShowAddRuleModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Requirement 3 · Practical Cyber Security Concept
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Network Security Checks & Vulnerability Hardening
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Automated port vulnerability probing, legacy cleartext service detection, SSL/TLS certificate posture verification, and perimeter firewall rule governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onScanPorts}
              disabled={isScanning || session.role === 'auditor'}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Probing Network Sockets...' : 'Run Socket Vulnerability Scan'}
            </button>
          </div>
        </div>
      </div>

      {/* Target Selector & Scanner Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Target Host Asset:</span>
          <select
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="192.168.1.1 (Perimeter Gateway)">192.168.1.1 (Perimeter Gateway)</option>
            <option value="10.0.0.12 (Internal Database Server)">10.0.0.12 (Internal Database Server)</option>
            <option value="172.16.0.5 (Public Web Ingress)">172.16.0.5 (Public Web Ingress)</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
          <span>Engine: <strong className="text-white">SYN-Stealth & Banner Grabbing</strong></span>
          <span>·</span>
          <span>Status: <strong className={isScanning ? 'text-amber-400' : 'text-emerald-400'}>{isScanning ? 'Scanning...' : 'Idle / Ready'}</strong></span>
        </div>
      </div>

      {/* Port Security Scan Results Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Port Security Probing Results</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {ports.length} Monitored Ports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3">Port</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Risk Rating</th>
                <th className="pb-3">Vulnerability / Protocol Detail</th>
                <th className="pb-3">Recommended Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {ports.map((port) => (
                <tr key={port.port} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white tabular-nums">{port.port}</td>
                  <td className="py-3 text-slate-200">{port.service}</td>
                  <td className="py-3">
                    <span
                      className={`font-semibold ${
                        port.status === 'OPEN'
                          ? 'text-emerald-400'
                          : port.status === 'FILTERED'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {port.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`font-semibold ${
                        port.riskLevel === 'CRITICAL'
                          ? 'text-red-400'
                          : port.riskLevel === 'HIGH'
                          ? 'text-orange-400'
                          : port.riskLevel === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {port.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 font-sans max-w-xs">
                    {port.vulnerabilityDescription}
                    {port.cveExample && (
                      <span className="block text-[10px] font-mono text-red-300 mt-0.5">
                        Ref: {port.cveExample}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400 font-sans max-w-xs">{port.remediation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: TLS / Certificate Inspection & Firewall Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module A: TLS / SSL Security Posture Analyzer */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">TLS / SSL Encryption Posture</h2>
              <p className="text-xs text-slate-400">Cryptographic cipher and certificate validity check</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-400">Active TLS Protocol:</span>
              <span className="font-mono text-emerald-400 font-semibold">TLSv1.3 (RFC 8446)</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-400">Cipher Negotiation:</span>
              <span className="font-mono text-slate-200">TLS_AES_256_GCM_SHA384</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-400">HTTP Strict Transport Security:</span>
              <span className="font-mono text-emerald-400">HSTS Enforced (max-age=31536000)</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-400">Key Exchange Security:</span>
              <span className="font-mono text-slate-200">ECDHE Curve25519 (PFS Active)</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-400">Legacy Protocols (SSLv3/TLS 1.0/1.1):</span>
              <span className="font-mono text-emerald-400">Permanently Disabled</span>
            </div>
          </div>
        </div>

        {/* Module B: Active Perimeter Firewall Rules */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Perimeter Firewall Rule Engine</h2>
                <p className="text-xs text-slate-400">
                  {canModifyFirewall ? 'Admin Privilege: Rules Configurable' : 'Read-Only (Requires Admin Role)'}
                </p>
              </div>
            </div>

            {canModifyFirewall && (
              <button
                onClick={() => setShowAddRuleModal(true)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Rule
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {firewallRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`font-bold ${
                        rule.action === 'DROP' || rule.action === 'REJECT'
                          ? 'text-red-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {rule.action}
                    </span>
                    <span className="text-slate-300 font-semibold">{rule.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      Port {rule.targetPort} / {rule.protocol}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-sans">{rule.reason}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleFirewallRule(rule.id)}
                    disabled={!canModifyFirewall}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                      rule.enabled
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-400'
                    } disabled:opacity-50`}
                  >
                    {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Rule Inline Form */}
          {showAddRuleModal && (
            <form onSubmit={handleCreateRule} className="p-3 rounded-lg bg-slate-900 border border-slate-700 space-y-3 text-xs">
              <div className="font-semibold text-white">Create New Firewall Policy</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Rule Name"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Port (e.g. 8080)"
                  value={newRulePort}
                  onChange={(e) => setNewRulePort(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                />
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value as 'ALLOW' | 'DROP')}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                >
                  <option value="DROP">DROP Packet</option>
                  <option value="ALLOW">ALLOW Packet</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-slate-950 font-semibold rounded text-xs"
                >
                  Save Policy
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-3 py-1 text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
