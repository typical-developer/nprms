'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useCases } from '@/lib/case-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Case, CaseCategory, Priority } from '@/lib/mock-data'

const categories = [
  'Theft',
  'Assault',
  'Fraud',
  'Armed Robbery',
  'Missing Person',
  'Homicide',
  'Cybercrime',
]

const priorities = ['Low', 'Medium', 'High', 'Critical']

export function CaseRegistrationForm() {
  const { user } = useAuth()
  const { addCase } = useCases()
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
    complainantName: '',
    complainantPhone: '',
    complainantAddress: '',
    suspectName: '',
    witnesses: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Create new case object
    const newCase: Case = {
      case_id: `case-${Date.now()}`,
      case_number: formData.caseNumber,
      title: formData.title,
      description: formData.description,
      category: formData.category as CaseCategory,
      priority: formData.priority as Priority,
      status: 'Registered',
      date_reported: new Date().toISOString(),
      location: formData.location,
      complainant_name: formData.complainantName,
      complainant_contact: formData.complainantPhone,
      complainant_address: formData.complainantAddress,
      registered_by: user,
      assigned_officer: null,
      assigned_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addCase(newCase)
    setSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        caseNumber: '',
        title: '',
        category: '',
        description: '',
        location: '',
        priority: 'Medium',
        complainantName: '',
        complainantPhone: '',
        complainantAddress: '',
        suspectName: '',
        witnesses: '',
      })
      setSubmitted(false)
    }, 2000)
  }

  if (submitted) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-green-700">Case Registered Successfully!</h3>
          <p className="text-green-600">Case #{formData.caseNumber} has been added to the system.</p>
          <p className="text-sm text-green-600">You will be redirected shortly...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Register New Case</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="caseNumber">Case Number</Label>
            <Input
              id="caseNumber"
              placeholder="AUTO-2025-001"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Case Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Case Title</Label>
          <Input
            id="title"
            placeholder="Brief description of the case"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Case Description</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the case..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Where the incident occurred"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="complainantName">Complainant Name</Label>
            <Input
              id="complainantName"
              placeholder="Full name"
              value={formData.complainantName}
              onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="complainantPhone">Complainant Phone</Label>
            <Input
              id="complainantPhone"
              placeholder="+234..."
              value={formData.complainantPhone}
              onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="complainantAddress">Complainant Address</Label>
          <Input
            id="complainantAddress"
            placeholder="Full address"
            value={formData.complainantAddress}
            onChange={(e) => setFormData({ ...formData, complainantAddress: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="suspectName">Suspect Name (if known)</Label>
          <Input
            id="suspectName"
            placeholder="Full name or nickname"
            value={formData.suspectName}
            onChange={(e) => setFormData({ ...formData, suspectName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="witnesses">Witnesses (comma-separated)</Label>
          <Textarea
            id="witnesses"
            placeholder="Names and contact info of witnesses"
            value={formData.witnesses}
            onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
            className="min-h-24"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="gap-2">
            Register Case
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
