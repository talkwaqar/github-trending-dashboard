# 🚀 GitHub Trending Dashboard

A modern, real-time dashboard for discovering the hottest repositories on GitHub. Built with Next.js, TypeScript, and Tailwind CSS.

🌟 **[Live Demo](https://github-trending-dashboard-production.up.railway.app/)** 🌟

![GitHub Trending Dashboard](https://img.shields.io/badge/Status-Active-green)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan)
![React](https://img.shields.io/badge/React-19-blue)

## ✨ Features

### 🎯 Core Functionality
- **Real-time GitHub trending data** - Updated every 15 minutes
- **25+ Programming Languages** - JavaScript, Python, TypeScript, Java, C#, C++, Go, Rust, and more
- **Multiple Time Ranges** - Daily, Weekly, and Monthly trending repositories
- **6-Column Layout** - Compare 2 languages across 3 time periods simultaneously
- **Advanced Search** - Search by repository name, description, or owner
- **Repository Consistency Tracking** - Identifies repos trending across multiple time periods

### 🎨 User Experience
- **Cross-Column Highlighting** - Hover effects to identify same repositories across columns
- **Visual Consistency Indicators** - Color-coded borders for trending patterns
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Clean, Minimal UI** - Focus on content with reduced visual clutter
- **Interactive Elements** - Clickable headers link directly to GitHub trending pages

### 🏗️ Technical Features
- **Intelligent Caching** - 15-minute memory cache for optimal performance
- **Error Handling** - Graceful fallbacks with retry mechanisms
- **Type Safety** - Full TypeScript implementation
- **Modular Architecture** - Custom hooks, utilities, and component separation
- **Performance Optimized** - Efficient rendering with React useMemo

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3](https://nextjs.org/) with App Router
- **Runtime**: [React 19](https://react.dev/) with latest features
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (latest beta)
- **Web Scraping**: [Cheerio 1.1](https://cheerio.js.org/)
- **HTTP Client**: Native Fetch API
- **Development**: Turbopack for fast builds
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/talkwaqar/github-trending-dashboard.git
   cd github-trending-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

```bash
npm run build
npm start
```

## 🌐 Live Demo

Experience the dashboard live at: **[https://github-trending-dashboard-production.up.railway.app/](https://github-trending-dashboard-production.up.railway.app/)**

🔗 **Deployment**: Hosted on [Railway](https://railway.app) with automatic deployments from the main branch.

## 📖 Usage

### Language Selection
- Click on any language header to open the dropdown
- Search through 25+ supported programming languages
- Select different languages to compare trending patterns

### Time Range Navigation  
- **Today**: Repositories trending in the last 24 hours
- **This Week**: Weekly trending repositories
- **This Month**: Monthly trending repositories
- Click column headers to view on GitHub directly

### Repository Discovery
- **🌟 Super Trending**: Appears in all 3 time periods
- **⭐ Trending**: Appears in 2 time periods  
- **Normal**: Appears in 1 time period only
- Hover over repositories to highlight matches across columns

### Search & Filter
- Use the search bar to filter by repository name, description, or owner
- Real-time filtering across all columns
- Clear search to return to full results

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── api/trending/route.ts    # GitHub scraping API endpoint
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page component
├── components/
│   ├── RepositoryDashboard.tsx  # Main dashboard container
│   ├── LanguageHeader.tsx       # Language selection dropdown
│   ├── RepositoryColumn.tsx     # Individual column rendering
│   └── RepositoryCard.tsx       # Repository card component
├── hooks/
│   └── useTrendingData.ts       # Data fetching & caching hook
├── utils/
│   └── repositoryUtils.ts       # Utility functions & constants
└── types/
    └── repository.ts            # TypeScript type definitions
```

### Key Components

#### Data Management
- **`useTrendingData`**: Custom hook handling API calls, caching, and state management
- **Memory Caching**: 15-minute cache duration with automatic invalidation
- **Error Boundaries**: Graceful error handling with retry mechanisms

#### Repository Processing
- **Consistency Analysis**: Tracks repositories across multiple time periods
- **Search Filtering**: Real-time search with multiple field matching
- **Statistics Calculation**: Aggregated metrics for dashboard display

#### UI Components
- **Modular Design**: Focused, single-responsibility components
- **Performance Optimized**: Strategic use of React.memo and useMemo
- **Responsive Layout**: CSS Grid and Flexbox for optimal layouts

## 🔧 API Reference

### GET `/api/trending`

Fetch trending repositories for a specific language and time range.

**Parameters:**
- `language` (string): Programming language (e.g., 'javascript', 'python')
- `since` (string): Time range ('daily', 'weekly', 'monthly')

**Response:**
```json
{
  "repositories": [
    {
      "owner": "microsoft",
      "name": "TypeScript",
      "description": "TypeScript is a superset of JavaScript...",
      "url": "https://github.com/microsoft/TypeScript",
      "language": "TypeScript",
      "stars": 98234,
      "forks": 12456,
      "starsToday": 45,
      "builtBy": [...]
    }
  ],
  "language": "typescript",
  "since": "daily",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Customization

### Adding New Languages

1. Update `SUPPORTED_LANGUAGES` in `src/utils/repositoryUtils.ts`:
```typescript
export const SUPPORTED_LANGUAGES: Language[] = [
  // ... existing languages
  { "displayName": "New Language", "value": "new-language" }
]
```

### Styling Customization

The project uses Tailwind CSS for styling. Key customization areas:

- **Colors**: Modify consistency level colors in `RepositoryCard.tsx`
- **Layout**: Adjust grid layouts in `RepositoryDashboard.tsx`
- **Typography**: Update font styles in `globals.css`

### Cache Configuration

Modify cache duration in `useTrendingData.ts`:
```typescript
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain component modularity
- Add tests for new features
- Update documentation as needed
- Follow existing code style and conventions

## 📊 Performance

- **Bundle Size**: ~108kB optimized
- **Load Time**: <2s initial load
- **Cache Hit Rate**: >90% after warm-up
- **API Response**: <500ms average
- **Lighthouse Score**: 95+ performance

## 🐛 Known Issues & Limitations

- GitHub rate limiting may affect data freshness during high traffic
- Some repositories may have incomplete contributor data
- Mobile experience optimized for portrait orientation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for providing the trending data
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **Cheerio** for HTML parsing capabilities
- **Open Source Community** for inspiration and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/talkwaqar/github-trending-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/talkwaqar/github-trending-dashboard/discussions)
- **Website**: [waqar.ai](https://www.waqar.ai?utm_source=github&utm_medium=readme&utm_campaign=github-trending-dashboard&utm_content=support-section)

---

<div align="center">

**[🚀 Live Demo](https://github-trending-dashboard-production.up.railway.app/)** • **[📁 View Repository](https://github.com/talkwaqar/github-trending-dashboard)** • **[🐛 Report Bug](https://github.com/talkwaqar/github-trending-dashboard/issues)** • **[💡 Request Feature](https://github.com/talkwaqar/github-trending-dashboard/issues)**

Made with ❤️ by [Waqar](https://github.com/talkwaqar)

</div>
