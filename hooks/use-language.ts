"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type Translation, getTranslation } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi")
  const [t, setT] = useState<Translation>(getTranslation("vi"))

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "zh", "vi"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setT(getTranslation(savedLanguage))
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("zh")) {
        setLanguageState("zh")
        setT(getTranslation("zh"))
      } else if (browserLang.startsWith("en")) {
        setLanguageState("en")
        setT(getTranslation("en"))
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setT(getTranslation(lang))
    localStorage.setItem("language", lang)

    // Update document language
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang === "en" ? "en-US" : "vi-VN"
  }

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {
        language,
        setLanguage,
        t
      }
    },
    children
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
