'use client'

import React, { useState, useMemo } from 'react'
import LanguageHeader from './LanguageHeader'
import RepositoryColumn from './RepositoryColumn'
import GitHubStarButton from './GitHubStarButton'
import { useTrendingData } from '@/hooks/useTrendingData'
import { 
  calculateRepositoryConsistency,
  filterRepositoriesBySearch,
  calculateConsistencyStats,
  calculateTotalFilteredRepos
} from '@/utils/repositoryUtils'

export default function RepositoryDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredRepo, setHoveredRepo] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState(['python', 'typescript'])

  const { data, fetchRepositories, timeRanges } = useTrendingData(selectedLanguages)

  // Calculate repository consistency across time periods
  const repositoryConsistency = useMemo(() => {
    return calculateRepositoryConsistency(data)
  }, [data])

  // Filter repositories based on search term
  const filteredData = useMemo(() => {
    return filterRepositoriesBySearch(data, searchTerm)
  }, [data, searchTerm])

  // Calculate metrics with useMemo for performance
  const metrics = useMemo(() => {
    const totalFilteredRepos = calculateTotalFilteredRepos(filteredData)
    const totalUnfilteredRepos = Object.values(data).flatMap(lang => 
      Object.values([lang.daily, lang.weekly, lang.monthly])
    ).reduce((acc, repos) => acc + repos.length, 0)
    
    const totalStarsToday = Object.values(filteredData).flatMap(lang => 
      Object.values([lang.daily, lang.weekly, lang.monthly])
    ).reduce((acc, repos) => acc + repos.reduce((sum, repo) => sum + repo.starsToday, 0), 0)
    
    const consistencyStats = calculateConsistencyStats(repositoryConsistency)
    
    return {
      totalFilteredRepos,
      totalUnfilteredRepos,
      totalStarsToday,
      consistencyStats
    }
  }, [filteredData, data, repositoryConsistency])

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleRepoHover = (repoKey: string | null) => {
    setHoveredRepo(repoKey)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🚀 GitHub Trending Dashboard</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time trending repositories • Updated every 15 minutes
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <GitHubStarButton 
              repoUrl="https://github.com/talkwaqar/github-trending-dashboard" 
              className="scale-75" 
            />
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">6</div>
              <div className="text-xs">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {searchTerm ? metrics.totalFilteredRepos : metrics.totalUnfilteredRepos}
              </div>
              <div className="text-xs">{searchTerm ? '🔍 Filtered' : 'Total Repos'}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-orange-600">
                {metrics.totalStarsToday.toLocaleString()}
              </div>
              <div className="text-xs">🔥 Stars Today</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-purple-600">
                {metrics.consistencyStats.superTrending}
              </div>
              <div className="text-xs">🌟 Super Trending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Panel */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="🔍 Search repositories by name, description, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {searchTerm && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                <span className="font-medium">{metrics.totalFilteredRepos}</span> matches
              </div>
              <button
                onClick={clearSearch}
                className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        {/* Consistency Legend */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {searchTerm ? (
              <>
                <span className="font-medium">Searching in:</span> Repository names, descriptions, and owners
              </>
            ) : (
              <span className="font-medium">Popularity indicators show consistency across time periods</span>
            )}
          </div>
          <div className="flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-gray-600">🌟 All 3 periods (Super Trending)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <span className="text-gray-600">⭐ 2 periods (Trending)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">1 period (Normal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Group Headers */}
      <div className="grid grid-cols-6 border-b border-gray-200 bg-white flex-shrink-0">
        {/* First Language Group Header */}
        <div className="col-span-3 px-6 py-4 border-r border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <LanguageHeader
            selectedLanguage={selectedLanguages[0]}
            onLanguageChange={(lang) => setSelectedLanguages([lang, selectedLanguages[1]])}
          />
        </div>
        
        {/* Second Language Group Header */}
        <div className="col-span-3 px-6 py-4 bg-gradient-to-r from-cyan-50 to-blue-50">
          <LanguageHeader
            selectedLanguage={selectedLanguages[1]}
            onLanguageChange={(lang) => setSelectedLanguages([selectedLanguages[0], lang])}
          />
        </div>
      </div>

      {/* 6-Column Layout */}
      <div className="flex-1 grid grid-cols-6 min-h-0 mb-auto">
        {/* First Language Columns */}
        {timeRanges.map(timeRange => 
          <RepositoryColumn
            key={`${selectedLanguages[0]}-${timeRange.key}`}
            langKey={selectedLanguages[0]}
            timeRange={timeRange}
            langData={filteredData[selectedLanguages[0]]}
            repositoryConsistency={repositoryConsistency}
            searchTerm={searchTerm}
            hoveredRepo={hoveredRepo}
            onRepoHover={handleRepoHover}
            onRetryFetch={fetchRepositories}
          />
        )}
        {/* Second Language Columns */}
        {timeRanges.map(timeRange => 
          <RepositoryColumn
            key={`${selectedLanguages[1]}-${timeRange.key}`}
            langKey={selectedLanguages[1]}
            timeRange={timeRange}
            langData={filteredData[selectedLanguages[1]]}
            repositoryConsistency={repositoryConsistency}
            searchTerm={searchTerm}
            hoveredRepo={hoveredRepo}
            onRepoHover={handleRepoHover}
            onRetryFetch={fetchRepositories}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-6 py-4 mt-auto flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-lg">Open Source Project</span>
            </div>
            <div className="text-sm text-gray-300">
              Built with ❤️ for the developer community
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://www.waqar.ai?utm_source=github&utm_medium=repository&utm_campaign=github-trending-dashboard&utm_content=footer-waqar-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-sm font-semibold">🧠 Waqar.AI</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            <a 
              href="https://www.tplex.com?utm_source=github&utm_medium=repository&utm_campaign=github-trending-dashboard&utm_content=footer-tplex" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-sm font-semibold">⚡ TPlex</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            <div className="text-xs text-gray-400 ml-4">
              <div>Made by developers,</div>
              <div>for developers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 