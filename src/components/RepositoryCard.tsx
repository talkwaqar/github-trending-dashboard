'use client'

import React from 'react'
import { Repository } from '@/types/repository'

interface RepositoryCardProps {
  repository: Repository
  consistencyLevel?: number // 1 = normal, 2 = trending, 3 = super trending
  isHovered?: boolean
  shouldBlink?: boolean
  onHover?: () => void
  onLeave?: () => void
}

export default function RepositoryCard({ 
  repository, 
  consistencyLevel = 1, 
  isHovered = false, 
  shouldBlink = false, 
  onHover, 
  onLeave 
}: RepositoryCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  // Generate consistent border color for cross-column repositories
  const getCrossColumnBorderColor = (repoName: string) => {
    const borderColors = [
      'border-rose-300', 'border-orange-300', 'border-emerald-300', 
      'border-sky-300', 'border-violet-300', 'border-teal-300',
      'border-lime-300', 'border-indigo-300', 'border-fuchsia-300', 'border-cyan-300'
    ]
    
    // Use repository name to generate consistent index
    let hash = 0
    for (let i = 0; i < repoName.length; i++) {
      const char = repoName.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    const index = Math.abs(hash) % borderColors.length
    return borderColors[index]
  }

  // Determine styling based on consistency level - white backgrounds with colored borders only
  const getConsistencyStyles = () => {
    switch (consistencyLevel) {
      case 3: // Super trending (appears in all 3 time periods) - Purple border
        return {
          cardClasses: 'bg-white border-2 border-purple-300 shadow-md',
          badgeClasses: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
          badgeText: '🌟 Super Trending',
          starsClasses: 'bg-white border-purple-200 text-purple-700'
        }
      case 2: // Trending (appears in 2 time periods) - Consistent colored border
        const borderColor = getCrossColumnBorderColor(repository.name)
        return {
          cardClasses: `bg-white border-2 ${borderColor} shadow-md`,
          badgeClasses: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
          badgeText: '⭐ Trending',
          starsClasses: 'bg-white border-blue-200 text-blue-700'
        }
      default: // Normal (appears in 1 time period only) - Light gray border
        return {
          cardClasses: 'bg-white border border-gray-200 shadow-sm',
          badgeClasses: '',
          badgeText: '',
          starsClasses: 'bg-white border-gray-200 text-gray-700'
        }
    }
  }

  const styles = getConsistencyStyles()

  // Add animation classes based on hover state
  const getAnimationClasses = () => {
    if (isHovered) {
      return 'shadow-2xl ring-4 ring-blue-400 ring-opacity-60'
    }
    if (shouldBlink) {
      return 'animate-pulse ring-2 ring-yellow-400 ring-opacity-75'
    }
    return ''
  }

  return (
    <div 
      className={`${styles.cardClasses} ${getAnimationClasses()} rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Consistency Badge */}
      {consistencyLevel > 1 && (
        <div className="flex justify-end mb-2">
          <div className={`${styles.badgeClasses} px-2 py-1 rounded-full text-xs font-bold shadow-sm`}>
            {styles.badgeText}
          </div>
        </div>
      )}

      {/* Repository Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            <a 
              href={repository.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {repository.owner} / {repository.name}
            </a>
          </h3>
          {repository.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {repository.description}
            </p>
          )}
        </div>
        
        {/* Language Badge */}
        {repository.language && (
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <span className="text-sm font-medium text-gray-700">
              {repository.language}
            </span>
          </div>
        )}
      </div>

      {/* Repository Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Stars */}
          <div className="flex items-center space-x-1 text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{formatNumber(repository.stars)}</span>
          </div>

          {/* Forks */}
          <div className="flex items-center space-x-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium">{formatNumber(repository.forks)}</span>
          </div>

          {/* Built By Contributors */}
          {repository.builtBy && repository.builtBy.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Built by</span>
              <div className="flex -space-x-2">
                {repository.builtBy.slice(0, 3).map((contributor) => (
                  <a
                    key={contributor.username}
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative hover:z-10 transition-transform hover:scale-110"
                    title={`@${contributor.username}`}
                  >
                    <img
                      src={contributor.avatar}
                      alt={`@${contributor.username}`}
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                  </a>
                ))}
                {repository.builtBy.length > 3 && (
                  <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{repository.builtBy.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stars Today */}
        {repository.starsToday > 0 && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${styles.starsClasses}`}>
            <svg className={`w-3 h-3 ${
              consistencyLevel === 3 ? 'text-purple-600' 
              : consistencyLevel === 2 ? 'text-blue-600'
              : 'text-yellow-500'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className={`text-xs font-semibold ${
              consistencyLevel === 3 ? 'text-purple-800' 
              : consistencyLevel === 2 ? 'text-blue-800'
              : 'text-yellow-700'
            }`}>
              {formatNumber(repository.starsToday)} today
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 