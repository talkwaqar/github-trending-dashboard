export interface Repository {
  owner: string
  name: string
  description: string
  url: string
  language: string
  stars: number
  forks: number
  starsToday: number
  builtBy: Contributor[]
}

export interface Contributor {
  username: string
  avatar: string
  url: string
}

export interface TrendingResponse {
  repositories: Repository[]
  language: string
  since: string
  lastUpdated: string
} 