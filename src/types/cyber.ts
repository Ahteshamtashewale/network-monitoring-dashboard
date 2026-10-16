export type UserRole = 'admin' | 'analyst' | 'auditor';

export interface UserSession {
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
  token: string | null;
  expiresInSeconds: number;
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
}

export type LogSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type NetworkProtocol = 'TCP' | 'UDP' | 'ICMP' | 'HTTPS' | 'DNS' | 'SSH';

export interface SiemLogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: NetworkProtocol;
  port: number;
  eventType: string;
  severity: LogSeverity;
  description: string;
  remediation?: string;
  rawPayload?: string;
  actionTaken: 'ALLOWED' | 'BLOCKED' | 'FLAGGED' | 'QUARANTINED';
}

export interface PortCheckResult {
  port: number;
  service: string;
  status: 'OPEN' | 'CLOSED' | 'FILTERED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vulnerabilityDescription: string;
  remediation: string;
  cveExample?: string;
}

export interface ValidationTestResult {
  input: string;
  inputType: 'IP_ADDRESS' | 'PORT' | 'COMMAND' | 'DOMAIN';
  isValid: boolean;
  threatsDetected: string[];
  sanitizedOutput: string;
  explanation: string;
  category: 'PASS' | 'INJECTION_ATTEMPT' | 'SYNTAX_ERROR' | 'OUT_OF_BOUNDS';
}

export interface FirewallRule {
  id: string;
  name: string;
  sourceIp: string;
  targetPort: number | 'ALL';
  protocol: NetworkProtocol | 'ALL';
  action: 'ALLOW' | 'DROP' | 'REJECT';
  enabled: boolean;
  reason: string;
}

export interface TestCase {
  id: string;
  requirement: 'Authentication' | 'Input Validation' | 'Security Checks' | 'Logging' | 'Awareness';
  title: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  details: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptCategory: string;
}
