"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"

interface SearchAutocompleteProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchAutocomplete({ onSearch, placeholder, className }: SearchAutocompleteProps) {
  const { language, t } = useLanguage()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use useMemo to create stable references for trending searches and categories
  const trendingSearches = useMemo(() => {
    switch (language) {
      case "en":
        return ["modern villa", "sports car", "anime character", "mythical dragon", "office building"]
      case "zh":
        return ["现代别墅", "跑车", "动漫角色", "神话龙", "办公楼"]
      case "vi":
      default:
        return ["villa hiện đại", "xe thể thao", "nhân vật anime", "rồng thần thoại", "tòa nhà văn phòng"]
    }
  }, [language])

  const categories = useMemo(() => {
    switch (language) {
      case "en":
        return ["Architecture", "Vehicles", "Characters", "Creatures", "Furniture", "Weapons"]
      case "zh":
        return ["建筑", "车辆", "角色", "生物", "家具", "武器"]
      case "vi":
      default:
        return ["Kiến trúc", "Xe cộ", "Nhân vật", "Sinh vật", "Nội thất", "Vũ khí"]
    }
  }, [language])

  // Create a stable reference for all suggestions
  const allSuggestions = useMemo(() => {
    const additionalSuggestions =
      language === "en"
        ? [
            "ferrari 3d model",
            "modern house",
            "anime character",
            "dragon model",
            "office building",
            "sports car",
            "fantasy creature",
            "architectural model",
          ]
        : language === "zh"
          ? ["法拉利3D模型", "现代房屋", "动漫角色", "龙模型", "办公楼", "跑车", "奇幻生物", "建筑模型"]
          : [
              "ferrari 3d model",
              "modern house",
              "anime character",
              "dragon model",
              "office building",
              "sports car",
              "fantasy creature",
              "architectural model",
            ]

    return [...trendingSearches, ...categories.map((cat) => cat.toLowerCase()), ...additionalSuggestions]
  }, [trendingSearches, categories, language])

  // Load recent searches from localStorage only when language changes
  useEffect(() => {
    const saved = localStorage.getItem(`recentSearches_${language}`)
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch {
        setRecentSearches([])
      }
    } else {
      setRecentSearches([])
    }
  }, [language])

  // Generate suggestions based on query - now with stable dependencies
  useEffect(() => {
    if (query.length > 1) {
      const filtered = allSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query, allSuggestions])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem(`recentSearches_${language}`, JSON.stringify(updated))

    setQuery(searchQuery)
    setIsOpen(false)
    onSearch(searchQuery)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(`recentSearches_${language}`)
  }

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter((s) => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem(`recentSearches_${language}`, JSON.stringify(updated))
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || t.search.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query)
            }
          }}
          className="pl-10 pr-4 h-12 bg-white border-[#d1e6d9] focus:border-[#39e079] rounded-xl"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-[#d1e6d9] max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Search Suggestions */}
            {query.length > 1 && suggestions.length > 0 && (
              <div className="p-3 border-b border-[#e8f2ec]">
                <h4 className="text-sm font-medium text-[#51946b] mb-2">{t.search.suggestions}</h4>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-[#e8f2ec] rounded-lg text-sm transition-colors flex items-center"
                  >
                    <Search className="w-4 h-4 mr-3 text-[#51946b]" />
                    <span className="flex-1">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {query.length <= 1 && recentSearches.length > 0 && (
              <div className="p-3 border-b border-[#e8f2ec]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#51946b]">{t.search.recent}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-[#51946b] hover:text-[#0e1a13]"
                  >
                    {t.search.clear_all}
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center group hover:bg-[#e8f2ec] rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 mr-3 text-[#51946b]" />
                    <button onClick={() => handleSearch(search)} className="flex-1 text-left text-sm">
                      {search}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecentSearch(search)}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {query.length <= 1 && (
              <div className="p-3 border-b border-[#e8f2ec]">
                <h4 className="text-sm font-medium text-[#51946b] mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t.search.trending}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((trend, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-[#e8f2ec] text-[#0e1a13] hover:bg-[#39e079] hover:text-[#0e1a13] transition-colors"
                      onClick={() => handleSearch(trend)}
                    >
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {query.length <= 1 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-[#51946b] mb-2">{t.search.popular_categories}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(category)}
                      className="text-left px-3 py-2 hover:bg-[#e8f2ec] rounded-lg text-sm transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
