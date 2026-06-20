export const getStatusBadgeVariant = (status: string): any => {
  const variants: Record<string, string> = {
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

export const getPriorityBadgeVariant = (priority: string): any => {
  const variants: Record<string, string> = {
    'Low': 'secondary',
    'Medium': 'outline',
    'High': 'warning',
    'Critical': 'destructive',
  }
  return variants[priority] || 'default'
}

export const getCategoryBadgeVariant = (category: string): any => {
  const variants: Record<string, string> = {
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

export const getRoleBadgeVariant = (role: string): any => {
  const variants: Record<string, string> = {
    'administrator': 'default',
    'officer': 'secondary',
    'records': 'outline',
  }
  return variants[role] || 'secondary'
}
