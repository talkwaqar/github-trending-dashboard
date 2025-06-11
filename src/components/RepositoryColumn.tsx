'use client'

import React from 'react'
import RepositoryCard from './RepositoryCard'
import { Repository } from '@/types/repository'
import { LanguageData } from '@/hooks/useTrendingData'
import { getGitHubTrendingUrl } from '@/utils/repositoryUtils'

interface TimeRange {
  key: string
  name: string
  icon: string
  bgColor: string
  borderColor: string
  since: string
}

interface RepositoryColumnProps {
  langKey: string
  timeRange: TimeRange
  langData: LanguageData | undefined
  repositoryConsistency: { [key: string]: { [repoKey: string]: number } }
  searchTerm: string
  hoveredRepo: string | null
  onRepoHover: (repoKey: string | null) => void
  onRetryFetch: (language: string, since: string) => void
}

export default function RepositoryColumn({
  langKey,
  timeRange,
  langData,
  repositoryConsistency,
  searchTerm,
  hoveredRepo,
  onRepoHover,
  onRetryFetch
}: RepositoryColumnProps) {
  if (!langData) {
    return (
      <div key={`${langKey}-${timeRange.key}`} className="flex flex-col h-full border-r border-gray-200 last:border-r-0">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium mt-3 block">Loading...</span>
          </div>
        </div>
      </div>
    )
  }
  
  const repos = langData[timeRange.key as keyof Pick<LanguageData, 'daily' | 'weekly' | 'monthly'>] as Repository[]
  const loading = langData.loading[timeRange.key as keyof typeof langData.loading]
  const error = langData.error[timeRange.key as keyof typeof langData.error]
  
  const githubUrl = getGitHubTrendingUrl(langKey, timeRange.since)

  return (
    <div key={`${langKey}-${timeRange.key}`} className="flex flex-col h-full border-r border-gray-200 last:border-r-0">
      {/* Clickable Time Period Header */}
      <div className={`${timeRange.bgColor} ${timeRange.borderColor} border-b px-4 py-4 flex-shrink-0 hover:opacity-90 transition-all cursor-pointer group`}>
        <a 
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                {timeRange.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {timeRange.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-600">
                    {loading ? '⏳ Loading...' : `📦 ${repos.length}`}
                  </span>
                  {searchTerm && (
                    <div className="text-xs text-blue-600 font-medium">Filtered</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {!loading && repos.length > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-yellow-600">🔥</span>
                  <span className="text-gray-700 font-semibold">
                    {repos.reduce((acc, repo) => acc + repo.starsToday, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </a>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500 font-medium">
                Loading repositories...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-3">{error}</p>
              <button
                onClick={() => onRetryFetch(langKey, timeRange.key)}
                className="px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        ) : repos.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                {searchTerm ? (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <span className="text-2xl">📭</span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {searchTerm ? 'No matching repositories' : 'No repositories found'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {repos
              .map(repo => ({
                repo,
                consistencyCount: repositoryConsistency[langKey]?.[`${repo.owner}/${repo.name}`] || 1
              }))
              .sort((a, b) => b.consistencyCount - a.consistencyCount) // Sort by consistency: 3 (super) > 2 (trending) > 1 (normal)
              .slice(0, 15)
              .map(({ repo, consistencyCount }, index) => {
                const repoKey = `${repo.owner}/${repo.name}`
                const isHovered = hoveredRepo === repoKey && consistencyCount > 1
                const shouldBlink = hoveredRepo !== null && hoveredRepo !== repoKey && consistencyCount > 1
                
                return (
                  <div key={`${repo.owner}/${repo.name}-${index}`}>
                    <RepositoryCard 
                      repository={repo} 
                      consistencyLevel={consistencyCount}
                      isHovered={isHovered}
                      shouldBlink={shouldBlink}
                      onHover={consistencyCount > 1 ? () => onRepoHover(repoKey) : undefined}
                      onLeave={consistencyCount > 1 ? () => onRepoHover(null) : undefined}
                    />
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
} 