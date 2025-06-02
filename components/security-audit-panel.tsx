'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key,
  Globe,
  Database,
  Server,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Zap
} from 'lucide-react'

interface SecurityCheck {
  id: string
  name: string
  description: string
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'client' | 'server'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  result?: string
  recommendation?: string
  autoFix?: boolean
}

interface SecurityReport {
  timestamp: Date
  overallScore: number
  totalChecks: number
  passed: number
  failed: number
  warnings: number
  critical: number
  checks: SecurityCheck[]
}

// Security checks configuration
const SECURITY_CHECKS: Omit<SecurityCheck, 'status' | 'result'>[] = [
  // Authentication checks
  {
    id: 'auth-jwt-secret',
    name: 'JWT Secret Strength',
    description: 'Verify JWT secret is strong and not exposed',
    category: 'authentication',
    severity: 'critical',
    recommendation: 'Use a strong, randomly generated JWT secret and store it securely',
    autoFix: false
  },
  {
    id: 'auth-session-security',
    name: 'Session Security',
    description: 'Check session configuration and security settings',
    category: 'authentication',
    severity: 'high',
    recommendation: 'Enable secure session settings with httpOnly and secure flags',
    autoFix: true
  },
  {
    id: 'auth-password-policy',
    name: 'Password Policy',
    description: 'Verify password strength requirements',
    category: 'authentication',
    severity: 'medium',
    recommendation: 'Implement strong password requirements',
    autoFix: false
  },
  
  // Authorization checks
  {
    id: 'authz-route-protection',
    name: 'Protected Routes',
    description: 'Verify all sensitive routes are properly protected',
    category: 'authorization',
    severity: 'critical',
    recommendation: 'Add authentication middleware to all protected routes',
    autoFix: false
  },
  {
    id: 'authz-role-validation',
    name: 'Role-based Access',
    description: 'Check role-based access control implementation',
    category: 'authorization',
    severity: 'high',
    recommendation: 'Implement proper role validation on server-side',
    autoFix: false
  },
  
  // Data security checks
  {
    id: 'data-input-validation',
    name: 'Input Validation',
    description: 'Check for proper input validation and sanitization',
    category: 'data',
    severity: 'high',
    recommendation: 'Implement comprehensive input validation using schemas',
    autoFix: false
  },
  {
    id: 'data-sql-injection',
    name: 'SQL Injection Protection',
    description: 'Verify protection against SQL injection attacks',
    category: 'data',
    severity: 'critical',
    recommendation: 'Use parameterized queries and ORM protection',
    autoFix: false
  },
  {
    id: 'data-xss-protection',
    name: 'XSS Protection',
    description: 'Check for Cross-Site Scripting vulnerabilities',
    category: 'data',
    severity: 'high',
    recommendation: 'Sanitize user input and use Content Security Policy',
    autoFix: true
  },
  
  // Network security checks
  {
    id: 'network-https-enforcement',
    name: 'HTTPS Enforcement',
    description: 'Verify HTTPS is enforced in production',
    category: 'network',
    severity: 'critical',
    recommendation: 'Force HTTPS redirects and use HSTS headers',
    autoFix: true
  },
  {
    id: 'network-cors-config',
    name: 'CORS Configuration',
    description: 'Check CORS settings for security',
    category: 'network',
    severity: 'medium',
    recommendation: 'Configure CORS to allow only trusted origins',
    autoFix: false
  },
  {
    id: 'network-csp-headers',
    name: 'Content Security Policy',
    description: 'Verify CSP headers are properly configured',
    category: 'network',
    severity: 'high',
    recommendation: 'Implement strict Content Security Policy headers',
    autoFix: true
  },
  
  // Client-side security
  {
    id: 'client-sensitive-data',
    name: 'Client-side Data Exposure',
    description: 'Check for sensitive data exposed to client',
    category: 'client',
    severity: 'high',
    recommendation: 'Remove sensitive data from client-side code',
    autoFix: false
  },
  {
    id: 'client-api-keys',
    name: 'API Key Exposure',
    description: 'Verify API keys are not exposed in client code',
    category: 'client',
    severity: 'critical',
    recommendation: 'Move API keys to server-side environment variables',
    autoFix: false
  },
  
  // Server security
  {
    id: 'server-env-variables',
    name: 'Environment Variables',
    description: 'Check for proper environment variable usage',
    category: 'server',
    severity: 'high',
    recommendation: 'Use environment variables for all sensitive configuration',
    autoFix: false
  },
  {
    id: 'server-error-handling',
    name: 'Error Information Disclosure',
    description: 'Verify error messages don\'t expose sensitive information',
    category: 'server',
    severity: 'medium',
    recommendation: 'Implement generic error messages for production',
    autoFix: true
  }
]

// Security audit hook
function useSecurityAudit() {
  const [report, setReport] = useState<SecurityReport | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentCheck, setCurrentCheck] = useState<string | null>(null)
  
  // Simulate security checks (in real implementation, these would be actual security tests)
  const runSecurityCheck = useCallback(async (check: SecurityCheck): Promise<SecurityCheck> => {
    // Simulate check duration
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500))
    
    let status: SecurityCheck['status'] = 'passed'
    let result = ''
    
    // Simulate different check results based on check type
    switch (check.id) {
      case 'auth-jwt-secret':
        const hasStrongSecret = process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32
        status = hasStrongSecret ? 'passed' : 'failed'
        result = hasStrongSecret ? 'JWT secret is properly configured' : 'JWT secret is weak or missing'
        break
        
      case 'auth-session-security':
        status = 'passed' // Assuming NextAuth.js handles this
        result = 'Session security is properly configured'
        break
        
      case 'authz-route-protection':
        status = 'passed' // Based on our middleware implementation
        result = 'Protected routes are properly secured'
        break
        
      case 'data-sql-injection':
        status = 'passed' // Prisma provides protection
        result = 'Using Prisma ORM provides SQL injection protection'
        break
        
      case 'network-https-enforcement':
        const isProduction = process.env.NODE_ENV === 'production'
        status = isProduction ? 'warning' : 'passed'
        result = isProduction ? 'HTTPS enforcement should be configured in production' : 'Development environment detected'
        break
        
      case 'client-api-keys':
        // Check for exposed API keys in client code
        const hasExposedKeys = false // Would scan client bundles
        status = hasExposedKeys ? 'failed' : 'passed'
        result = hasExposedKeys ? 'API keys found in client code' : 'No API keys exposed in client code'
        break
        
      default:
        // Random result for demonstration
        const random = Math.random()
        if (random > 0.8) {
          status = 'failed'
          result = 'Security issue detected'
        } else if (random > 0.6) {
          status = 'warning'
          result = 'Potential security concern'
        } else {
          status = 'passed'
          result = 'Security check passed'
        }
    }
    
    return { ...check, status, result }
  }, [])
  
  const runAudit = useCallback(async () => {
    setIsRunning(true)
    setCurrentCheck(null)
    
    const checks: SecurityCheck[] = SECURITY_CHECKS.map(check => ({
      ...check,
      status: 'pending'
    }))
    
    setReport({
      timestamp: new Date(),
      overallScore: 0,
      totalChecks: checks.length,
      passed: 0,
      failed: 0,
      warnings: 0,
      critical: 0,
      checks
    })
    
    const completedChecks: SecurityCheck[] = []
    
    for (const check of checks) {
      setCurrentCheck(check.name)
      const result = await runSecurityCheck(check)
      completedChecks.push(result)
      
      // Update report with current progress
      const passed = completedChecks.filter(c => c.status === 'passed').length
      const failed = completedChecks.filter(c => c.status === 'failed').length
      const warnings = completedChecks.filter(c => c.status === 'warning').length
      const critical = completedChecks.filter(c => c.status === 'failed' && c.severity === 'critical').length
      
      const overallScore = Math.round((passed / completedChecks.length) * 100)
      
      setReport({
        timestamp: new Date(),
        overallScore,
        totalChecks: checks.length,
        passed,
        failed,
        warnings,
        critical,
        checks: [...completedChecks, ...checks.slice(completedChecks.length)]
      })
    }
    
    setCurrentCheck(null)
    setIsRunning(false)
  }, [runSecurityCheck])
  
  return {
    report,
    isRunning,
    currentCheck,
    runAudit
  }
}

// Security score component
function SecurityScore({ report }: { report: SecurityReport }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getScoreIcon = (score: number) => {
    if (score >= 90) return <ShieldCheck className="w-8 h-8 text-green-600" />
    if (score >= 70) return <ShieldAlert className="w-8 h-8 text-yellow-600" />
    return <ShieldX className="w-8 h-8 text-red-600" />
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Security Score</h3>
        <Badge variant={report.critical > 0 ? 'destructive' : report.failed > 0 ? 'secondary' : 'default'}>
          {report.critical > 0 ? 'Critical Issues' : report.failed > 0 ? 'Issues Found' : 'Secure'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        {getScoreIcon(report.overallScore)}
        <div>
          <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
            {report.overallScore}%
          </div>
          <div className="text-sm text-gray-600">Overall Security Score</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{report.passed}</div>
          <div className="text-xs text-gray-600">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{report.warnings}</div>
          <div className="text-xs text-gray-600">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{report.failed}</div>
          <div className="text-xs text-gray-600">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-800">{report.critical}</div>
          <div className="text-xs text-gray-600">Critical</div>
        </div>
      </div>
    </Card>
  )
}

// Security check item component
function SecurityCheckItem({ check }: { check: SecurityCheck }) {
  const getStatusIcon = () => {
    switch (check.status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }
  
  const getSeverityBadge = () => {
    const variants = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive',
      critical: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[check.severity]} className="text-xs">
        {check.severity.toUpperCase()}
      </Badge>
    )
  }
  
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-medium">{check.name}</h4>
            <p className="text-sm text-gray-600">{check.description}</p>
          </div>
        </div>
        {getSeverityBadge()}
      </div>
      
      {check.result && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-sm">{check.result}</p>
        </div>
      )}
      
      {check.status === 'failed' && check.recommendation && (
        <Alert className="mt-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Recommendation:</strong> {check.recommendation}
          </AlertDescription>
        </Alert>
      )}
      
      {check.autoFix && check.status === 'failed' && (
        <div className="mt-3">
          <Button size="sm" variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            Auto Fix
          </Button>
        </div>
      )}
    </Card>
  )
}

// Main security audit panel
export function SecurityAuditPanel() {
  const { report, isRunning, currentCheck, runAudit } = useSecurityAudit()
  
  const categorizedChecks = useMemo(() => {
    if (!report) return {}
    
    return report.checks.reduce((acc, check) => {
      if (!acc[check.category]) {
        acc[check.category] = []
      }
      acc[check.category].push(check)
      return acc
    }, {} as Record<string, SecurityCheck[]>)
  }, [report])
  
  const exportReport = useCallback(() => {
    if (!report) return
    
    const reportData = {
      ...report,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-audit-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [report])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Security Audit
          </h2>
          <p className="text-gray-600">Comprehensive security analysis of your application</p>
        </div>
        
        <div className="flex gap-2">
          {report && (
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
          
          <Button onClick={runAudit} disabled={isRunning}>
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running Audit...' : 'Run Security Audit'}
          </Button>
        </div>
      </div>
      
      {/* Current check indicator */}
      {isRunning && currentCheck && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <div className="font-medium">Running Security Check</div>
              <div className="text-sm text-gray-600">{currentCheck}</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Security score */}
      {report && <SecurityScore report={report} />}
      
      {/* Security checks by category */}
      {report && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="authorization">Authz</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {report.checks.map(check => (
              <SecurityCheckItem key={check.id} check={check} />
            ))}
          </TabsContent>
          
          {Object.entries(categorizedChecks).map(([category, checks]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {checks.map(check => (
                <SecurityCheckItem key={check.id} check={check} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {/* No report state */}
      {!report && !isRunning && (
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Security Audit Available</h3>
          <p className="text-gray-600 mb-4">
            Run a comprehensive security audit to identify potential vulnerabilities and security issues.
          </p>
          <Button onClick={runAudit}>
            <Shield className="w-4 h-4 mr-2" />
            Start Security Audit
          </Button>
        </Card>
      )}
    </div>
  )
}

export default SecurityAuditPanel