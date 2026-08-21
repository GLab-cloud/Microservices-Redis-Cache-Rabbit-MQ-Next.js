'use client'
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="bg-white shadow-md p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={"/"} className="text-xl font-bold text-gray-800">
          The Reading Retreat
        </Link>
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar