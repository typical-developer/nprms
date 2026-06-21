'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden flex items-center border-b border-border bg-card px-3 py-2.5 sticky top-0 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <SheetContent side="left" className="w-64 p-0 sm:max-w-64">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div onClick={() => setOpen(false)}>
            <Sidebar inSheet />
          </div>
        </SheetContent>
      </Sheet>
      <span className="ml-2 text-sm font-semibold text-foreground">NPRMS</span>
    </div>
  )
}
