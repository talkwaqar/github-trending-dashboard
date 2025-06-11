import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { Repository, Contributor, TrendingResponse } from '@/types/repository'

const GITHUB_TRENDING_BASE_URL = 'https://github.com/trending'

function parseNumber(text: string): number {
  if (!text) return 0
  
  // Remove commas and extract number
  const cleanText = text.replace(/,/g, '').trim()
  const match = cleanText.match(/[\d,.]+/)
  
  if (!match) return 0
  
  const numStr = match[0].replace(/,/g, '')
  return parseInt(numStr, 10) || 0
}

function extractStarsToday(text: string): number {
  if (!text) return 0
  
  // Look for patterns like "150 stars today" or "1,234 stars today"
  const match = text.match(/(\d+(?:,\d+)*)\s+stars?\s+today/i)
  
  if (!match) return 0
  
  return parseNumber(match[1])
}

async function scrapeGitHubTrending(language: string, since: string): Promise<Repository[]> {
  try {
    const url = `${GITHUB_TRENDING_BASE_URL}/${encodeURIComponent(language)}?since=${since}`
    console.log(`Scraping: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub responded with status ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const repositories: Repository[] = []

    // Parse each repository article
    $('article.Box-row').each((index, element) => {
      try {
        const $article = $(element)
        
        // Extract repository name and owner
        const repoLink = $article.find('h2.h3 a').first()
        const repoHref = repoLink.attr('href')
        
        if (!repoHref) return
        
        const [, owner, name] = repoHref.split('/')
        if (!owner || !name) return
        
        // Extract description
        const description = $article.find('p.col-9').text().trim() || ''
        
        // Extract language
        const languageElement = $article.find('span[itemprop="programmingLanguage"]')
        const repoLanguage = languageElement.text().trim() || language
        
        // Extract stars
        const starsLink = $article.find('a[href*="/stargazers"]')
        const starsText = starsLink.text().trim()
        const stars = parseNumber(starsText)
        
        // Extract forks
        const forksLink = $article.find('a[href*="/forks"]')
        const forksText = forksLink.text().trim()
        const forks = parseNumber(forksText)
        
        // Extract stars today
        const starsToday = extractStarsToday($article.find('.float-sm-right').text())
        
        // Extract contributors
        const builtBy: Contributor[] = []
        $article.find('a[data-hovercard-type="user"] img.avatar').each((i, img) => {
          const $img = $(img)
          const avatar = $img.attr('src') || ''
          const alt = $img.attr('alt') || ''
          const username = alt.replace('@', '')
          const userLink = $img.closest('a').attr('href') || ''
          
          if (username && avatar) {
            builtBy.push({
              username,
              avatar: avatar.replace(/\?.*$/, ''), // Remove query parameters
              url: `https://github.com${userLink}`
            })
          }
        })
        
        const repository: Repository = {
          owner,
          name,
          description,
          url: `https://github.com${repoHref}`,
          language: repoLanguage,
          stars,
          forks,
          starsToday,
          builtBy: builtBy.slice(0, 5) // Limit to 5 contributors
        }
        
        repositories.push(repository)
        
      } catch (error) {
        console.error('Error parsing repository:', error)
      }
    })

    console.log(`Successfully scraped ${repositories.length} repositories`)
    return repositories
    
  } catch (error) {
    console.error('Error scraping GitHub trending:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'python'
    const since = searchParams.get('since') || 'daily'
    
    // Validate parameters
    const validSince = ['daily', 'weekly', 'monthly']
    
    if (!validSince.includes(since)) {
      return NextResponse.json(
        { error: 'Invalid since parameter' },
        { status: 400 }
      )
    }
    
    const repositories = await scrapeGitHubTrending(language, since)
    
    const response: TrendingResponse = {
      repositories,
      language,
      since,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
    
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch trending repositories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 