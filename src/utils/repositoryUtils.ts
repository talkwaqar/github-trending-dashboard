import { Repository } from '@/types/repository'
import { LanguageData } from '@/hooks/useTrendingData'

// Language constants
export interface Language {
  displayName: string
  value: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { "displayName": "JavaScript", "value": "javascript" },
  { "displayName": "Python", "value": "python" },
  { "displayName": "TypeScript", "value": "typescript" },
  { "displayName": "Java", "value": "java" },
  { "displayName": "C#", "value": "c#" },
  { "displayName": "C++", "value": "c++" },
  { "displayName": "C", "value": "c" },
  { "displayName": "PHP", "value": "php" },
  { "displayName": "Go", "value": "go" },
  { "displayName": "Rust", "value": "rust" },
  { "displayName": "Ruby", "value": "ruby" },
  { "displayName": "Swift", "value": "swift" },
  { "displayName": "Kotlin", "value": "kotlin" },
  { "displayName": "Scala", "value": "scala" },
  { "displayName": "Dart", "value": "dart" },
  { "displayName": "R", "value": "r" },
  { "displayName": "MATLAB", "value": "matlab" },
  { "displayName": "Objective-C", "value": "objective-c" },
  { "displayName": "Shell", "value": "shell" },
  { "displayName": "PowerShell", "value": "powershell" },
  { "displayName": "Perl", "value": "perl" },
  { "displayName": "Lua", "value": "lua" },
  { "displayName": "Haskell", "value": "haskell" },
  { "displayName": "Clojure", "value": "clojure" },
  { "displayName": "Elixir", "value": "elixir" }
]

export function getLanguageInfo(langKey: string) {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.value === langKey)
  return { name: language?.displayName || langKey }
}

export function calculateRepositoryConsistency(data: { [key: string]: LanguageData }) {
  const consistency: { [key: string]: { [repoKey: string]: number } } = {}
  
  Object.keys(data).forEach(language => {
    consistency[language] = {}
    const langData = data[language]
    
    // Create a map of all unique repositories
    const allRepos = new Map<string, Repository>()
    
    // Add repos from each time period
    langData.daily.forEach(repo => {
      const key = `${repo.owner}/${repo.name}`
      allRepos.set(key, repo)
    })
    langData.weekly.forEach(repo => {
      const key = `${repo.owner}/${repo.name}`
      allRepos.set(key, repo)
    })
    langData.monthly.forEach(repo => {
      const key = `${repo.owner}/${repo.name}`
      allRepos.set(key, repo)
    })
    
    // Count appearances for each repo
    allRepos.forEach((repo, repoKey) => {
      let count = 0
      if (langData.daily.some(r => `${r.owner}/${r.name}` === repoKey)) count++
      if (langData.weekly.some(r => `${r.owner}/${r.name}` === repoKey)) count++
      if (langData.monthly.some(r => `${r.owner}/${r.name}` === repoKey)) count++
      consistency[language][repoKey] = count
    })
  })
  
  return consistency
}

export function filterRepositoriesBySearch(data: { [key: string]: LanguageData }, searchTerm: string) {
  if (!searchTerm.trim()) return data

  const filtered: { [key: string]: LanguageData } = {}
  
  Object.keys(data).forEach(language => {
    filtered[language] = {
      ...data[language],
      daily: data[language].daily.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      weekly: data[language].weekly.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      monthly: data[language].monthly.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  })
  
  return filtered
}

export function calculateConsistencyStats(repositoryConsistency: { [key: string]: { [repoKey: string]: number } }) {
  const stats = { superTrending: 0, trending: 0, normal: 0 }
  
  Object.values(repositoryConsistency).forEach(langConsistency => {
    Object.values(langConsistency).forEach(count => {
      if (count === 3) stats.superTrending++
      else if (count === 2) stats.trending++
      else stats.normal++
    })
  })
  
  return stats
}

export function calculateTotalFilteredRepos(filteredData: { [key: string]: LanguageData }) {
  return Object.values(filteredData).flatMap(lang => 
    Object.values([lang.daily, lang.weekly, lang.monthly])
  ).reduce((acc, repos) => acc + repos.length, 0)
}

export function getGitHubTrendingUrl(language: string, timeRange: string) {
  return `https://github.com/trending/${encodeURIComponent(language)}?since=${timeRange}`
} 