import React, { useState } from 'react';
import { Download, Search, Pause, Play, Trash2, Shield, Plus, X } from 'lucide-react';
import { LogSeverity, NetworkProtocol, SiemLogEntry, UserSession } from '../types/cyber';
import { exportLogsToCsv, exportLogsToJson } from '../utils/securityEngine';

interface LoggingTabProps {
  logs: SiemLogEntry[];
  session: UserSession;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onClearLogs: () => void;
  onAddSamplePacket: () => void;
}

export const LoggingTab: React.FC<LoggingTabProps> = ({
  logs,
  session,
  isStreaming,
  onToggleStreaming,
  onClearLogs,
  onAddSamplePacket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');
  const [activeLogModal, setActiveLogModal] = useState<SiemLogEntry | null>(null);

  const canWipe = session.role === 'admin';

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.sourceIp.includes(searchTerm) ||
      log.destinationIp.includes(searchTerm) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesProtocol = selectedProtocol === 'ALL' || log.protocol === selectedProtocol;

    return matchesSearch && matchesSeverity && matchesProtocol;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Requirement 4 · Practical Cyber Security Concept
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              SIEM Security Event Telemetry & Audit Logging
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standardized security log ingestion, forensic timeline auditing, threat anomaly filtering, and one-click export for internship compliance reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleStreaming}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isStreaming
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-emerald-950 border-emerald-800 text-emerald-300'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isStreaming ? 'Pause Feed' : 'Resume Live Ingestion'}
            </button>

            <button
              onClick={onAddSamplePacket}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Ingest Packet
            </button>

            <button
              onClick={() => exportLogsToCsv(filteredLogs)}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              onClick={() => exportLogsToJson(filteredLogs)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>

            {canWipe && (
              <button
                onClick={onClearLogs}
                className="px-3 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded-lg text-xs transition-colors flex items-center gap-1"
                title="Wipe audit logs (Admin only)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search IP, event type, or signature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Severity selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-mono mr-1">SEVERITY:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Protocol selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-mono mr-1">PROTO:</span>
            {['ALL', 'TCP', 'UDP', 'HTTPS', 'DNS', 'SSH'].map((proto) => (
              <button
                key={proto}
                onClick={() => setSelectedProtocol(proto)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  selectedProtocol === proto
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Showing <span className="text-white font-bold tabular-nums">{filteredLogs.length}</span> of{' '}
            <span className="tabular-nums">{logs.length}</span> security events
          </div>
          <div className="text-xs font-mono text-slate-500">
            Click any row to inspect raw packet headers & forensics
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 font-mono z-10">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Event Type</th>
                <th className="py-2.5 px-4">Source IP</th>
                <th className="py-2.5 px-4">Destination IP</th>
                <th className="py-2.5 px-4">Proto:Port</th>
                <th className="py-2.5 px-4">Action Taken</th>
                <th className="py-2.5 px-4">Forensic Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No security events match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setActiveLogModal(log)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 text-slate-400 tabular-nums whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold whitespace-nowrap">
                      <span
                        className={
                          log.severity === 'CRITICAL'
                            ? 'text-red-400 font-bold'
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
                    <td className="py-2.5 px-4 text-white font-medium whitespace-nowrap">
                      {log.eventType}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 whitespace-nowrap">
                      {log.sourceIp}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                      {log.destinationIp}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 tabular-nums whitespace-nowrap">
                      {log.protocol}:{log.port}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={
                          log.actionTaken === 'BLOCKED' || log.actionTaken === 'QUARANTINED'
                            ? 'text-red-400 font-bold'
                            : log.actionTaken === 'FLAGGED'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {log.actionTaken}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 font-sans max-w-sm truncate">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Detail Modal */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="border border-slate-700 bg-slate-900 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Event Forensic Detail ({activeLogModal.id})</h3>
              </div>
              <button
                onClick={() => setActiveLogModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Timestamp</span>
                <span className="text-white font-semibold">{activeLogModal.timestamp}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Severity & Action</span>
                <span className="text-red-400 font-semibold">{activeLogModal.severity} / {activeLogModal.actionTaken}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Source IP & Port</span>
                <span className="text-white">{activeLogModal.sourceIp}:{activeLogModal.port}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Destination IP</span>
                <span className="text-white">{activeLogModal.destinationIp}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold">Incident Analysis:</span>
              <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                {activeLogModal.description}
              </p>
            </div>

            {activeLogModal.rawPayload && (
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Captured Raw Payload Header:</span>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {activeLogModal.rawPayload}
                </pre>
              </div>
            )}

            {activeLogModal.remediation && (
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Recommended Remediation & Defense:</span>
                <p className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 leading-relaxed font-sans">
                  {activeLogModal.remediation}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveLogModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
