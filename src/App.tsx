/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { AuthTab } from './components/AuthTab';
import { InputValidationTab } from './components/InputValidationTab';
import { SecurityChecksTab } from './components/SecurityChecksTab';
import { LoggingTab } from './components/LoggingTab';
import { AwarenessTab } from './components/AwarenessTab';
import { SubmissionKitTab } from './components/SubmissionKitTab';
import { INITIAL_FIREWALL_RULES, INITIAL_PORTS, INITIAL_SIEM_LOGS } from './data/defaultData';
import { FirewallRule, PortCheckResult, SiemLogEntry, UserRole, UserSession } from './types/cyber';
import { generateRandomMockPacket } from './utils/securityEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Authentication State
  const [session, setSession] = useState<UserSession>({
    username: 'sec_analyst',
    role: 'analyst',
    isAuthenticated: true,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresInSeconds: 3600,
    failedAttempts: 0,
    isLockedOut: false,
    lockoutRemainingSeconds: 0,
  });

  // Security checks & Firewall State
  const [ports, setPorts] = useState<PortCheckResult[]>(INITIAL_PORTS);
  const [isScanning, setIsScanning] = useState(false);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES);

  // SIEM Logs State
  const [logs, setLogs] = useState<SiemLogEntry[]>(INITIAL_SIEM_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [logCounter, setLogCounter] = useState(106);

  // Countdown timer for session & lockout
  useEffect(() => {
    const timer = setInterval(() => {
      setSession((prev) => {
        let newLockoutRemaining = prev.lockoutRemainingSeconds;
        let newIsLockedOut = prev.isLockedOut;
        let newFailedAttempts = prev.failedAttempts;

        if (prev.isLockedOut) {
          if (prev.lockoutRemainingSeconds > 1) {
            newLockoutRemaining = prev.lockoutRemainingSeconds - 1;
          } else {
            newLockoutRemaining = 0;
            newIsLockedOut = false;
            newFailedAttempts = 0;
          }
        }

        const newExpires = prev.expiresInSeconds > 1 ? prev.expiresInSeconds - 1 : 3600;

        return {
          ...prev,
          expiresInSeconds: newExpires,
          isLockedOut: newIsLockedOut,
          lockoutRemainingSeconds: newLockoutRemaining,
          failedAttempts: newFailedAttempts,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Background mock packet ingestion stream
  useEffect(() => {
    if (!isStreaming) return;

    const streamInterval = setInterval(() => {
      const mock = generateRandomMockPacket(logCounter);
      setLogCounter((c) => c + 1);
      setLogs((prev) => [mock, ...prev.slice(0, 79)]);
    }, 9000);

    return () => clearInterval(streamInterval);
  }, [isStreaming, logCounter]);

  // Auth Handlers
  const handleUpdateRole = (role: UserRole) => {
    setSession((prev) => ({
      ...prev,
      role,
      username: role === 'admin' ? 'sec_admin' : role === 'analyst' ? 'sec_analyst' : 'auditor_compliance',
    }));

    // Record role elevation to SIEM
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [
      {
        id: `log-${logCounter}`,
        timestamp: timeStr,
        sourceIp: '192.168.1.45',
        destinationIp: '192.168.1.1',
        protocol: 'HTTPS',
        port: 443,
        eventType: 'ROLE_PRIVILEGE_CHANGED',
        severity: role === 'admin' ? 'WARNING' : 'INFO',
        actionTaken: 'ALLOWED',
        description: `Active role updated to "${role.toUpperCase()}". RBAC permissions re-evaluated.`,
        remediation: 'Access control verified against internal security policies.',
      },
      ...prev,
    ]);
    setLogCounter((c) => c + 1);
  };

  const handleSimulateLoginAttempt = (isSuccess: boolean) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    if (isSuccess) {
      setSession((prev) => ({
        ...prev,
        failedAttempts: 0,
        isLockedOut: false,
        lockoutRemainingSeconds: 0,
        expiresInSeconds: 3600,
      }));

      setLogs((prev) => [
        {
          id: `log-${logCounter}`,
          timestamp: timeStr,
          sourceIp: '192.168.1.45',
          destinationIp: '192.168.1.1',
          protocol: 'HTTPS',
          port: 443,
          eventType: 'AUTH_SUCCESS',
          severity: 'INFO',
          actionTaken: 'ALLOWED',
          description: `User "${session.username}" authenticated successfully. Bearer token granted.`,
          remediation: 'Compliant session established.',
        },
        ...prev,
      ]);
      setLogCounter((c) => c + 1);
    } else {
      setSession((prev) => {
        const nextFailed = prev.failedAttempts + 1;
        const shouldLock = nextFailed >= 3;
        return {
          ...prev,
          failedAttempts: nextFailed,
          isLockedOut: shouldLock,
          lockoutRemainingSeconds: shouldLock ? 30 : 0,
        };
      });

      const nextFailed = session.failedAttempts + 1;
      const willLock = nextFailed >= 3;

      setLogs((prev) => [
        {
          id: `log-${logCounter}`,
          timestamp: timeStr,
          sourceIp: '192.168.1.45',
          destinationIp: '192.168.1.1',
          protocol: 'HTTPS',
          port: 443,
          eventType: willLock ? 'ACCOUNT_LOCKOUT_TRIGGERED' : 'AUTH_FAILED_STRIKE',
          severity: willLock ? 'HIGH' : 'WARNING',
          actionTaken: willLock ? 'BLOCKED' : 'FLAGGED',
          description: willLock
            ? `Account locked out for 30s after 3 consecutive failed login strikes for user "${session.username}".`
            : `Failed authentication strike ${nextFailed}/3 recorded for user "${session.username}".`,
          remediation: willLock
            ? 'Account suspended under brute-force mitigation policy.'
            : 'Validate credentials and monitor IP address.',
        },
        ...prev,
      ]);
      setLogCounter((c) => c + 1);
    }
  };

  const handleResetLockout = () => {
    setSession((prev) => ({
      ...prev,
      failedAttempts: 0,
      isLockedOut: false,
      lockoutRemainingSeconds: 0,
    }));
  };

  // Firewall Handlers
  const handleToggleFirewallRule = (id: string) => {
    setFirewallRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddFirewallRule = (rule: Omit<FirewallRule, 'id'>) => {
    const newRule: FirewallRule = {
      ...rule,
      id: `fw-${Date.now().toString().slice(-4)}`,
    };
    setFirewallRules((prev) => [newRule, ...prev]);

    // Record in SIEM
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [
      {
        id: `log-${logCounter}`,
        timestamp: timeStr,
        sourceIp: '192.168.1.1',
        destinationIp: '0.0.0.0/0',
        protocol: 'TCP',
        port: typeof rule.targetPort === 'number' ? rule.targetPort : 0,
        eventType: 'FIREWALL_POLICY_CREATED',
        severity: 'INFO',
        actionTaken: 'ALLOWED',
        description: `New perimeter rule created: "${newRule.name}" (${newRule.action} Port ${newRule.targetPort}).`,
        remediation: 'Rule applied to active packet filtering table.',
      },
      ...prev,
    ]);
    setLogCounter((c) => c + 1);
  };

  // Port Scan Handler
  const handleScanPorts = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // add SIEM event
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLogs((prev) => [
        {
          id: `log-${logCounter}`,
          timestamp: timeStr,
          sourceIp: '192.168.1.45',
          destinationIp: '192.168.1.1',
          protocol: 'TCP',
          port: 23,
          eventType: 'PORT_SCAN_COMPLETED',
          severity: 'WARNING',
          actionTaken: 'FLAGGED',
          description: 'Port sweep revealed legacy cleartext services (Port 21 FTP open, Port 23 Telnet filtered).',
          remediation: 'Perimeter hardening recommended: enforce SSH and drop Port 21/23.',
        },
        ...prev,
      ]);
      setLogCounter((c) => c + 1);
    }, 1200);
  };

  // Add Log from Input Validation
  const handleAddLogFromValidation = (entry: {
    eventType: string;
    severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
    sourceIp: string;
    description: string;
    actionTaken: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTPS';
  }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [
      {
        id: `log-${logCounter}`,
        timestamp: timeStr,
        sourceIp: entry.sourceIp,
        destinationIp: '192.168.1.1',
        protocol: entry.protocol,
        port: 80,
        eventType: entry.eventType,
        severity: entry.severity,
        actionTaken: entry.actionTaken,
        description: entry.description,
        remediation: 'Input sanitization engine filtered shell execution vectors.',
      },
      ...prev,
    ]);
    setLogCounter((c) => c + 1);
  };

  // Trigger Simulated Attack
  const handleTriggerSimulatedAttack = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const attackLog: SiemLogEntry = {
      id: `log-${logCounter}`,
      timestamp: timeStr,
      sourceIp: '198.51.100.201',
      destinationIp: '192.168.1.1',
      protocol: 'TCP',
      port: 23,
      eventType: 'TELNET_BRUTE_FORCE_EXPLOIT',
      severity: 'CRITICAL',
      actionTaken: 'BLOCKED',
      description: 'Massive SYN probe and dictionary attack targeting unencrypted Telnet port 23.',
      remediation: 'Packets dropped by firewall rule fw-01. Source IP placed on external blacklist.',
      rawPayload: 'CONNECT telnet://192.168.1.1:23 root:toor admin:admin',
    };

    setLogs((prev) => [attackLog, ...prev]);
    setLogCounter((c) => c + 1);
    setActiveTab('logging');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleToggleStreaming = () => {
    setIsStreaming((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onOpenSubmissionModal={() => setActiveTab('github')}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            setActiveTab={setActiveTab}
            logs={logs}
            session={session}
            ports={ports}
            firewallRules={firewallRules}
            onTriggerSimulatedAttack={handleTriggerSimulatedAttack}
          />
        )}

        {activeTab === 'auth' && (
          <AuthTab
            session={session}
            onUpdateRole={handleUpdateRole}
            onSimulateLoginAttempt={handleSimulateLoginAttempt}
            onResetLockout={handleResetLockout}
          />
        )}

        {activeTab === 'validation' && (
          <InputValidationTab onAddLog={handleAddLogFromValidation} />
        )}

        {activeTab === 'security' && (
          <SecurityChecksTab
            ports={ports}
            firewallRules={firewallRules}
            session={session}
            onToggleFirewallRule={handleToggleFirewallRule}
            onAddFirewallRule={handleAddFirewallRule}
            onScanPorts={handleScanPorts}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'logging' && (
          <LoggingTab
            logs={logs}
            session={session}
            isStreaming={isStreaming}
            onToggleStreaming={handleToggleStreaming}
            onClearLogs={handleClearLogs}
            onAddSamplePacket={() => {
              const packet = generateRandomMockPacket(logCounter);
              setLogCounter((c) => c + 1);
              setLogs((prev) => [packet, ...prev]);
            }}
          />
        )}

        {activeTab === 'awareness' && <AwarenessTab />}

        {activeTab === 'github' && <SubmissionKitTab />}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>NetGuard · Practical Network Monitoring & Cybersecurity Virtual Internship Project</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('github')}
            className="hover:text-slate-300 transition-colors"
          >
            GitHub Setup Guide
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveTab('awareness')}
            className="hover:text-slate-300 transition-colors"
          >
            OWASP Awareness
          </button>
          <span>·</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
}
