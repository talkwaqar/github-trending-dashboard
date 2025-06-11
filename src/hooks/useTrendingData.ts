import { useState, useEffect } from 'react'
import { Repository } from '@/types/repository'

export interface LanguageData {
  daily: Repository[]
  weekly: Repository[]
  monthly: Repository[]
  loading: {
    daily: boolean
    weekly: boolean
    monthly: boolean
  }
  error: {
    daily: string | null
    weekly: string | null
    monthly: string | null
  }
}

interface CacheEntry {
  data: Repository[]
  timestamp: number
}

const timeRanges = [
  { key: 'daily', name: 'Today', icon: '📅', bgColor: 'bg-gradient-to-br from-orange-50 to-red-50', borderColor: 'border-orange-200', since: 'daily' },
  { key: 'weekly', name: 'This Week', icon: '📊', bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50', borderColor: 'border-green-200', since: 'weekly' },
  { key: 'monthly', name: 'This Month', icon: '📈', bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50', borderColor: 'border-purple-200', since: 'monthly' }
]

// Memory cache with 15-minute expiry
const cache = new Map<string, CacheEntry>()
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export function useTrendingData(selectedLanguages: string[]) {
  const [data, setData] = useState<{ [key: string]: LanguageData }>({})

  // Initialize data structure when languages change
  useEffect(() => {
    const newData: { [key: string]: LanguageData } = {}
    selectedLanguages.forEach(lang => {
      newData[lang] = {
        daily: [],
        weekly: [],
        monthly: [],
        loading: { daily: true, weekly: true, monthly: true },
        error: { daily: null, weekly: null, monthly: null }
      }
    })
    setData(newData)
  }, [selectedLanguages])

  const getCacheKey = (language: string, since: string) => `${language}-${since}`

  const isValidCache = (cacheEntry: CacheEntry) => {
    return Date.now() - cacheEntry.timestamp < CACHE_DURATION
  }

  const fetchRepositories = async (language: string, since: string) => {
    try {
      const cacheKey = getCacheKey(language, since)
      const cachedData = cache.get(cacheKey)
      
      // Check if we have valid cached data
      if (cachedData && isValidCache(cachedData)) {
        console.log(`Using cached data for ${language} ${since}`)
        setData(prev => ({
          ...prev,
          [language]: {
            ...prev[language],
            [since]: cachedData.data,
            loading: {
              ...prev[language].loading,
              [since]: false
            },
            error: {
              ...prev[language].error,
              [since]: null
            }
          }
        }))
        return
      }

      // Fetch fresh data
      console.log(`Fetching fresh data for ${language} ${since}`)
      const response = await fetch(`/api/trending?language=${language}&since=${since}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData = await response.json()
      const repositories = responseData.repositories || []
      
      // Cache the data
      cache.set(cacheKey, {
        data: repositories,
        timestamp: Date.now()
      })
      
      setData(prev => ({
        ...prev,
        [language]: {
          ...prev[language],
          [since]: repositories,
          loading: {
            ...prev[language].loading,
            [since]: false
          },
          error: {
            ...prev[language].error,
            [since]: null
          }
        }
      }))
      
    } catch (err) {
      console.error(`Error fetching ${language} ${since}:`, err)
      setData(prev => ({
        ...prev,
        [language]: {
          ...prev[language],
          loading: {
            ...prev[language].loading,
            [since]: false
          },
          error: {
            ...prev[language].error,
            [since]: 'Failed to fetch repositories'
          }
        }
      }))
    }
  }

  // Fetch data for all combinations when languages change
  useEffect(() => {
    selectedLanguages.forEach(language => {
      timeRanges.forEach(timeRange => {
        fetchRepositories(language, timeRange.key)
      })
    })
  }, [selectedLanguages])

  return {
    data,
    fetchRepositories,
    timeRanges
  }
} 