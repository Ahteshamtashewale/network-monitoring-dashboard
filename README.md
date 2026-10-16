# NetGuard: Practical Network Monitoring & Cybersecurity Dashboard

[![Virtual Internship Project](https://img.shields.io/badge/Project-Virtual%20Internship-blue.svg)](https://github.com)
[![Cybersecurity](https://img.shields.io/badge/Domain-Cyber%20Security-emerald.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A practical, high-performance Network Monitoring & Cybersecurity Dashboard built to fulfill cybersecurity virtual internship curriculum requirements. Demonstrates core competencies across authentication, input sanitization, automated security checks, SIEM audit logging, and threat awareness.

---

## 📋 Project Overview & Key Features

This repository implements all 5 required cybersecurity pillars specified in the virtual internship guidelines:

| Feature Requirement | Implementation in NetGuard | Security Outcome |
|:---|:---|:---|
| **1. Authentication Concepts** | Multi-tier Role-Based Access Control (`Admin`, `Analyst`, `Auditor`), Brute-Force lockout simulator with 3-attempt cooldown, session token expiration countdown, password entropy evaluator. | Enforces Principle of Least Privilege (PoLP) and defense against dictionary/credential stuffing attacks. |
| **2. Input Validation** | Interactive Network Validator workbench with RFC-compliant IPv4 regex checking, socket port bounds enforcement (1–65535), and real-time detection of command injection (`;`, `&&`, `|`), SQLi, and XSS payloads. | Blocks OWASP Top 10 A03:2021 Injection vulnerabilities at the earliest entry boundary. |
| **3. Security Checks** | Simulated Port & Vulnerability Scanner for critical ports (21 FTP, 22 SSH, 23 Telnet, 80 HTTP, 443 HTTPS, 3389 RDP), TLS certificate posture analyzer, and an active Firewall Rules configuration engine. | Eliminates cleartext protocols (Telnet/FTP), surfaces open attack surfaces, and hardens network perimeters. |
| **4. Logging** | SIEM (Security Information & Event Management) real-time console with structured event schema, severity tagging (`INFO`, `WARNING`, `HIGH`, `CRITICAL`), live search, and 1-click **CSV & JSON log export**. | Delivers compliance auditing, incident timeline reconstruction, and forensic analysis capability. |
| **5. Awareness** | Comprehensive Cybersecurity Knowledge Base covering OWASP Top 10, Defense-in-Depth, Port Hardening, plus an interactive 5-question Cybersecurity Evaluation Quiz. | Fosters organizational security hygiene and continuous analyst training. |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Icons & Motion:** Lucide React, Motion
- **Architecture:** Client-side defense-in-depth simulator, SIEM event stream, regex validation engine
- **Build Tool:** Vite 8

---

## 🚀 How to Add This Project to Your GitHub

### Step 1: Initialize Git
```bash
git init
```

### Step 2: Add all project files
```bash
git add .
```

### Step 3: Commit the changes
```bash
git commit -m "feat: complete cybersecurity network monitoring dashboard for virtual internship"
```

### Step 4: Link your GitHub repository and push
```bash
# Rename default branch to main
git branch -M main

# Add your GitHub repo URL (replace with your repository link)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/network-monitoring-dashboard.git

# Push code to GitHub
git push -u origin main
```

---

## 🧪 Testing & Verification Workflow

This project includes an integrated automated test suite verifying all 5 core modules:

```bash
# Tests verified in the in-app "Submission Kit" tab:
[PASS] Test 1: Role-Based Access Control (RBAC) Enforcement
[PASS] Test 2: Brute-Force Account Lockout Mechanism (3 strikes = 30s lockout)
[PASS] Test 3: Command Injection Sanitizer Barrier (; && | intercepted)
[PASS] Test 4: IPv4 Octet Boundary Verification (0-255 boundaries enforced)
[PASS] Test 5: High-Risk Port 23 (Telnet) Vulnerability Scan & Remediation
[PASS] Test 6: TLS / SSL Certificate Posture & Cipher Check
[PASS] Test 7: SIEM Structured Event Schema & Ingestion
[PASS] Test 8: OWASP Top 10 Threat Mitigation Matrix
```

---

## 🎓 Virtual Internship Project Submission Notes
- **Student / Author:** Ahtesham Tashewale
- **Project Domain:** Practical Virtual Internship - Cybersecurity Track
- **Deliverables:** Working interactive application, test suite verification report, and downloadable SIEM audit logs.
- **License:** MIT
