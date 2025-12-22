"use client"

import { useLanguage } from "@/components/providers/LanguageProvider"

export function T({ k, className }: { k: string, className?: string }) {
    const { t } = useLanguage()
    return <span className={className}>{t(k)}</span>
}
