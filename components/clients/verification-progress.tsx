'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react'
import { REQUIRED_POINTS } from '@/lib/types'

interface VerificationProgressProps {
  points: number
  status: string
}

export function VerificationProgress({ points, status }: VerificationProgressProps) {
  const percentage = Math.min((points / REQUIRED_POINTS) * 100, 100)
  
  const getStatusInfo = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle2,
          text: 'Verification Complete',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          barColor: 'bg-green-500',
        }
      case 'in_progress':
        return {
          icon: Clock,
          text: 'Verification In Progress',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          barColor: 'bg-blue-500',
        }
      case 'failed':
        return {
          icon: XCircle,
          text: 'Verification Failed',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          barColor: 'bg-red-500',
        }
      case 'expired':
        return {
          icon: AlertTriangle,
          text: 'Verification Expired',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          barColor: 'bg-gray-500',
        }
      default:
        return {
          icon: Clock,
          text: 'Pending Verification',
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          barColor: 'bg-amber-500',
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            </div>
            <div>
              <p className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
              <p className="text-sm text-muted-foreground">
                {points >= REQUIRED_POINTS 
                  ? 'All verification requirements met'
                  : `${REQUIRED_POINTS - points} more points needed`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{points}</p>
            <p className="text-sm text-muted-foreground">of {REQUIRED_POINTS} points</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 w-full rounded-full bg-secondary">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${statusInfo.barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Point breakdown legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Primary (70 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Secondary (40 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Commencement (25-35 pts)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
