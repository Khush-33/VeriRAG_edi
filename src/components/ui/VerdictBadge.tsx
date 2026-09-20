import React from 'react';
import { ClaimVerdict } from '../../types';
import { Badge } from './Badge';

const verdictTone: Record<ClaimVerdict, 'success' | 'info' | 'warning' | 'danger'> = {
  SUPPORTED: 'success',
  PARTIALLY_SUPPORTED: 'info',
  UNSUPPORTED: 'warning',
  CONTRADICTED: 'danger',
};

const verdictLabel: Record<ClaimVerdict, string> = {
  SUPPORTED: 'Supported',
  PARTIALLY_SUPPORTED: 'Partial',
  UNSUPPORTED: 'Unsupported',
  CONTRADICTED: 'Contradicted',
};

interface VerdictBadgeProps {
  verdict: ClaimVerdict;
  confidence?: number;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, confidence }) => (
  <Badge tone={verdictTone[verdict]}>
    {verdictLabel[verdict]}
    {confidence !== undefined ? ` · ${confidence}%` : ''}
  </Badge>
);
