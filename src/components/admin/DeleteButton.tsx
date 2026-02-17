'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash, Loader2 } from "lucide-react"

interface DeleteButtonProps {
  id: string
  onDelete: (id: string) => Promise<{ success: boolean, error?: string }>
  confirmMessage?: string
}

export function DeleteButton({ id, onDelete, confirmMessage = "Are you sure you want to delete this?" }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(confirmMessage)) return

    setIsDeleting(true)
    const result = await onDelete(id)
    setIsDeleting(false)

    if (!result.success) {
      alert(result.error || "Failed to delete")
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
    </Button>
  )
}
