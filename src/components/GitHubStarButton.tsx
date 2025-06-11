'use client'

import React, { useState, useEffect } from 'react'

interface GitHubStarButtonProps {
  repoUrl: string
  className?: string
}

export default function GitHubStarButton({ repoUrl, className = '' }: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Extract owner/repo from URL
  const getRepoPath = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
    return match ? `${match[1]}/${match[2]}` : null
  }

  const repoPath = getRepoPath(repoUrl)

  useEffect(() => {
    const fetchStarCount = async () => {
      if (!repoPath) return
      
      try {
        const response = await fetch(`https://api.github.com/repos/${repoPath}`)
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count || 0)
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStarCount()
  }, [repoPath])

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    }
    return count.toString()
  }

  if (!repoPath) return null

  return (
    <div className={`flex items-center ${className}`}>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-l-md transition-colors"
        title="Star this repository"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Star</span>
      </a>
      <a
        href={`${repoUrl}/stargazers`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 border-l-0 px-2.5 py-1.5 rounded-r-md transition-colors min-w-[3rem] justify-center"
        title="View stargazers"
      >
        <span className="font-medium">
          {loading ? '...' : formatCount(starCount)}
        </span>
      </a>
    </div>
  )
} 