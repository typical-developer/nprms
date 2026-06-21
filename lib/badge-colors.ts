type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'accent' | 'info' | 'warning'

export const getStatusVariant = (status: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'Registered': 'secondary',
    'Assigned': 'outline',
    'Under Investigation': 'default',
    'Resolved': 'accent',
    'Closed': 'info',
    'Archived': 'secondary',
    'Reopened': 'warning',
  }
  return variants[status] || 'default'
}

export const getPriorityVariant = (priority: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'Low': 'secondary',
    'Medium': 'outline',
    'High': 'warning',
    'Critical': 'destructive',
  }
  return variants[priority] || 'default'
}

export const getCategoryVariant = (category: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'Theft': 'outline',
    'Assault': 'warning',
    'Fraud': 'secondary',
    'Armed Robbery': 'destructive',
    'Missing Person': 'outline',
    'Homicide': 'destructive',
    'Cybercrime': 'secondary',
  }
  return variants[category] || 'default'
}

export const getRoleBadgeVariant = (role: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    'administrator': 'default',
    'officer': 'secondary',
    'records': 'outline',
  }
  return variants[role] || 'secondary'
}

// Legacy exports for backward compatibility
export const getStatusBadgeVariant = getStatusVariant
export const getPriorityBadgeVariant = getPriorityVariant
export const getCategoryBadgeVariant = getCategoryVariant
