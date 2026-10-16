import React, { useState } from 'react';
import { Shield, KeyRound, UserCheck, AlertOctagon, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { UserRole, UserSession } from '../types/cyber';
import { calculatePasswordStrength } from '../utils/securityEngine';

interface AuthTabProps {
  session: UserSession;
  onUpdateRole: (role: UserRole) => void;
  onSimulateLoginAttempt: (isSuccess: boolean) => void;
  onResetLockout: () => void;
}

export const AuthTab: React.FC<AuthTabProps> = ({
  session,
  onUpdateRole,
  onSimulateLoginAttempt,
  onResetLockout,
}) => {
  const [testPassword, setTestPassword] = useState('P@ssw0rd2026!');
  const [loginUser, setLoginUser] = useState('sec_analyst');
  const [loginPass, setLoginPass] = useState('');
  const [authStatusMessage, setAuthStatusMessage] = useState<string | null>(null);

  const pwdAnalysis = calculatePasswordStrength(testPassword);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (session.isLockedOut) return;

    if (loginPass === 'Admin#Secure2026') {
      onSimulateLoginAttempt(true);
      setAuthStatusMessage('Authentication successful! Token re-issued.');
    } else {
      onSimulateLoginAttempt(false);
      setAuthStatusMessage('Invalid password credentials. Failed attempt logged.');
    }
  };

  const rolePermissions: Record<UserRole, { viewLogs: boolean; runScans: boolean; updateFirewall: boolean; exportData: boolean; wipeAudit: boolean }> = {
    admin: { viewLogs: true, runScans: true, updateFirewall: true, exportData: true, wipeAudit: true },
    analyst: { viewLogs: true, runScans: true, updateFirewall: false, exportData: true, wipeAudit: false },
    auditor: { viewLogs: true, runScans: false, updateFirewall: false, exportData: true, wipeAudit: false },
  };

  const currentPerms = rolePermissions[session.role];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Requirement 1 · Practical Cyber Security Concept
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Authentication & Role-Based Access Control (RBAC)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Demonstrating identity verification, Principle of Least Privilege (PoLP), brute-force defense with rate-limiting lockouts, and cryptographic password strength analysis.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            {(['admin', 'analyst', 'auditor'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onUpdateRole(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  session.role === r
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Brute-Force & Lockout Simulator */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 rounded-lg text-amber-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Brute-Force & Lockout Simulator</h2>
                <p className="text-xs text-slate-400">Protects login endpoints against automated dictionary attacks</p>
              </div>
            </div>

            {session.isLockedOut ? (
              <span className="text-xs font-mono text-red-400 font-semibold animate-pulse">
                LOCKED OUT ({session.lockoutRemainingSeconds}s)
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-400">
                ARMED · 3-STRIKE RULE
              </span>
            )}
          </div>

          {/* Strikes progress visual */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Consecutive Failed Attempts:</span>
              <span className="font-mono tabular-nums font-bold text-white">
                {session.failedAttempts} / 3 Strikes
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((strike) => {
                const isTripped = session.failedAttempts >= strike;
                return (
                  <div
                    key={strike}
                    className={`h-2 rounded transition-all ${
                      isTripped
                        ? 'bg-red-500 shadow-sm shadow-red-500/50'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
            {session.isLockedOut && (
              <div className="p-3 rounded bg-red-950/60 border border-red-900/80 text-xs text-red-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Account Security Lockout Engaged
                </div>
                <div>
                  Threshold reached. Login interface locked for {session.lockoutRemainingSeconds}s to mitigate brute-force attempts.
                </div>
              </div>
            )}
          </div>

          {/* Interactive Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                disabled={session.isLockedOut}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Password <span className="text-slate-500">(Hint for pass: `Admin#Secure2026`)</span>
              </label>
              <input
                type="password"
                value={loginPass}
                placeholder="Enter password to test auth..."
                onChange={(e) => setLoginPass(e.target.value)}
                disabled={session.isLockedOut}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            {authStatusMessage && (
              <div className="text-xs font-mono text-slate-300 p-2 bg-slate-900 border border-slate-800 rounded">
                {authStatusMessage}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={session.isLockedOut || !loginPass}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Authenticate User
              </button>
              <button
                type="button"
                onClick={() => onSimulateLoginAttempt(false)}
                disabled={session.isLockedOut}
                className="px-3 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded-lg text-xs transition-colors disabled:opacity-40"
              >
                +1 Failed Strike
              </button>
              {session.isLockedOut && (
                <button
                  type="button"
                  onClick={onResetLockout}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Module 2: Role-Based Access Control (RBAC) Matrix */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">RBAC Permission Matrix</h2>
              <p className="text-xs text-slate-400">Current Role: <span className="font-mono text-emerald-400 uppercase font-semibold">{session.role}</span></p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Principle of Least Privilege ensures accounts receive only the operational privileges necessary to perform authorized duties, minimizing threat blast radius.
          </p>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Inspect Telemetry & Audit Logs</span>
                <p className="text-slate-400 text-[11px]">Read-only access to network SIEM event feed</p>
              </div>
              {currentPerms.viewLogs ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono"><CheckCircle className="w-4 h-4" /> ALLOWED</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-mono"><XCircle className="w-4 h-4" /> DENIED</span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Execute Port & Vulnerability Scans</span>
                <p className="text-slate-400 text-[11px]">Active socket probe against perimeter targets</p>
              </div>
              {currentPerms.runScans ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono"><CheckCircle className="w-4 h-4" /> ALLOWED</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-mono"><XCircle className="w-4 h-4" /> DENIED</span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Modify Firewall Rule Engine</span>
                <p className="text-slate-400 text-[11px]">Drop/allow network ingress ports dynamically</p>
              </div>
              {currentPerms.updateFirewall ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono"><CheckCircle className="w-4 h-4" /> ALLOWED</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-mono"><XCircle className="w-4 h-4" /> DENIED (Admin Only)</span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Export Audit Compliance CSV/JSON</span>
                <p className="text-slate-400 text-[11px]">Download raw logs for forensic reporting</p>
              </div>
              {currentPerms.exportData ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono"><CheckCircle className="w-4 h-4" /> ALLOWED</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-mono"><XCircle className="w-4 h-4" /> DENIED</span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-white">Purge System Logs / Emergency Reset</span>
                <p className="text-slate-400 text-[11px]">Destructive system operation requiring root credential</p>
              </div>
              {currentPerms.wipeAudit ? (
                <span className="text-emerald-400 flex items-center gap-1 font-mono"><CheckCircle className="w-4 h-4" /> ALLOWED</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-mono"><XCircle className="w-4 h-4" /> DENIED (Admin Only)</span>
              )}
            </div>
          </div>
        </div>

        {/* Module 3: Password Complexity & Entropy Scorer */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Password Entropy & Complexity Lab</h2>
              <p className="text-xs text-slate-400">Evaluates credential resistance to offline cracking</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Interactive Password Evaluator</label>
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              placeholder="Type any password to analyze..."
            />
          </div>

          {/* Strength bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Calculated Entropy Score:</span>
              <span className={`font-mono font-bold ${pwdAnalysis.color}`}>
                {pwdAnalysis.score}/100 ({pwdAnalysis.label})
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  pwdAnalysis.score >= 80
                    ? 'bg-emerald-500'
                    : pwdAnalysis.score >= 60
                    ? 'bg-teal-500'
                    : pwdAnalysis.score >= 40
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${pwdAnalysis.score}%` }}
              />
            </div>
          </div>

          {/* Feedback items */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 font-medium mb-1">NIST Guidelines Assessment:</div>
            {pwdAnalysis.feedback.length === 0 ? (
              <div className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Meets all security criteria: 12+ chars, mixed cases, digits, symbols.
              </div>
            ) : (
              pwdAnalysis.feedback.map((item, idx) => (
                <div key={idx} className="text-amber-400 flex items-center gap-1.5">
                  <span>·</span>
                  <span>{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Module 4: Cryptographic Session Token Inspector */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg text-teal-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">JWT Session Token Structure</h2>
              <p className="text-xs text-slate-400">Stateless bearer token inspecting session claims</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto">
            <div className="text-slate-500">// Header (HMAC-SHA256)</div>
            <div className="text-emerald-400 font-semibold">&#123; &quot;alg&quot;: &quot;HS256&quot;, &quot;typ&quot;: &quot;JWT&quot; &#125;</div>
            <div className="text-slate-500 mt-2">// Payload Claims</div>
            <div>
              &#123;
              <br />
              &nbsp;&nbsp;&quot;sub&quot;: &quot;usr_{session.username}&quot;,
              <br />
              &nbsp;&nbsp;&quot;role&quot;: &quot;{session.role}&quot;,
              <br />
              &nbsp;&nbsp;&quot;iss&quot;: &quot;NetGuard-Security-Gateway&quot;,
              <br />
              &nbsp;&nbsp;&quot;exp_countdown&quot;: &quot;{session.expiresInSeconds}s&quot;
              <br />
              &#125;
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Session Status: <strong className="text-white">Authenticated</strong></span>
            <span className="font-mono tabular-nums text-emerald-400">{session.expiresInSeconds}s remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};
