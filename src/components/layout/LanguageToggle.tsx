"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLanguage } from "@/components/providers/LanguageProvider"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("es")}>
                    Español {language === 'es' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English {language === 'en' && '✓'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
