'use client'

import React, { useState, useRef, useEffect } from 'react'
import { getLanguageInfo, SUPPORTED_LANGUAGES, Language } from '@/utils/repositoryUtils'

interface LanguageHeaderProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  className?: string
}

export default function LanguageHeader({ 
  selectedLanguage, 
  onLanguageChange,
  className = ""
}: LanguageHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const languageInfo = getLanguageInfo(selectedLanguage)
  
  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang: Language) =>
    lang.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (language: Language) => {
    onLanguageChange(language.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center space-x-3">
        {/* Clickable Language Name with Dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 hover:bg-white/20 px-2 py-1 rounded-md transition-colors group"
        >
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {languageInfo.name}
          </h2>
          <svg 
            className={`w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-500">
          <span className="font-medium">Click headers to verify on GitHub</span>
          <span className="text-blue-500">↗</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Language Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language.value}
                  onClick={() => handleSelect(language)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-left
                    hover:bg-gray-50 transition-colors duration-150
                    ${selectedLanguage === language.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <span className="font-medium">{language.displayName}</span>
                  {selectedLanguage === language.value && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
                <p className="text-sm">No languages found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 