# Daily Steps Uploader 🚶‍♂️

A Farcaster mini app that allows users to track and share their daily step count with the Farcaster community. Built with Vite, React, TypeScript, and the Farcaster Frame SDK.

## Features

- **Step Tracking**: Enter your daily step count with a simple, intuitive interface
- **Farcaster Integration**: Seamlessly post your steps as casts to share with your Farcaster network
- **Modern UI**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **Web3 Ready**: Built with Wagmi for Ethereum wallet connectivity
- **Frame Support**: Compatible with Farcaster Frames for enhanced social sharing

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS with modern gradients and animations
- **Web3**: Wagmi + Viem for Ethereum integration
- **Farcaster**: Frame SDK for social features
- **Linting**: Biome for code quality
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Farcaster account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dailysteps
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

1. **Enter Your Steps**: Input your daily step count in the number field
2. **Connect Wallet**: Click "Connect" to link your Ethereum wallet
3. **Upload to Farcaster**: Click "Upload to Farcaster" to share your steps
4. **Share Your Progress**: Your steps will be posted as a cast with a walking emoji

## Project Structure

```
dailysteps/
├── src/
│   ├── App.tsx          # Main React application
│   ├── main.tsx         # Application entry point
│   ├── wagmi.ts         # Wagmi configuration
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # Main HTML file with embedded app
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Configuration

### Farcaster Frame

The app includes Farcaster Frame metadata in `index.html` for social sharing:

```html
<meta name="fc:frame" content='{"version":"1"}'>
```

### Farcaster Configuration

The `public/.well-known/farcaster.json` file contains the Farcaster Frame configuration and account association settings:

```json
{
  "frame": {
    "name": "Step Caster",
    "version": "1",
    "iconUrl": "https://dailysteps.vercel.app/icon.png",
    "homeUrl": "https://dailysteps.vercel.app",
    "imageUrl": "https://dailysteps.vercel.app/image.png",
    "buttonTitle": "Upload Steps",
    "splashImageUrl": "https://dailysteps.vercel.app/splash.png",
    "splashBackgroundColor": "#667eea",
    "webhookUrl": "https://dailysteps.vercel.app/api/webhook",
    "screenshotUrls": ["https://dailysteps.vercel.app/screenshot.png"],
    "ogImageUrl": "https://dailysteps.vercel.app/og.png",
    "castShareUrl": "https://dailysteps.vercel.app",
    "ogDescription": "Upload your steps and share your fitness journey with friends on Farcaster.",
    "ogTitle": "Daily Steps Uploader",
    "tags": ["social", "fitness", "health", "steps", "wellness"],
    "tagline": "Share your steps!",
    "heroImageUrl": "https://dailysteps.vercel.app/hero.png",
    "description": "Upload your steps and share your fitness progress with the Farcaster community. Stay motivated with friends.",
    "subtitle": "Share your daily step count",
    "primaryCategory": "health-fitness"
  },
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  }
}
```

This configuration:
- **Frame Metadata**: Defines the app's appearance in Farcaster feeds and discovery
- **Social Sharing**: Configures Open Graph images and descriptions for social media
- **Account Association**: Links the app to a Farcaster account for authentication
- **Webhook URL**: Endpoint for receiving Farcaster events (requires API implementation)

### Wagmi Configuration

The app is configured to work with Base and Mainnet chains. You can modify the chains in `src/wagmi.ts`:

```typescript
export const config = createConfig({
  chains: [base, mainnet],
  connectors: [farcasterFrame()],
  // ...
});
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Biome linter

### Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The configuration is in `biome.json`.

## Deployment

The project is configured for deployment on Vercel with the included `vercel.json` configuration file.

### Environment Variables

No environment variables are required for basic functionality, but you may want to configure:

- `VITE_FARCASTER_HUB_URL` - Custom Farcaster hub URL
- `VITE_APP_URL` - Your app's public URL

## Future Features & Suggestions

Here are 5 exciting features that could enhance the Daily Steps Uploader:

### 1. 🏆 Step Challenges & Leaderboards

Create competitive step challenges where users can compete with friends and the broader Farcaster community.

**AI Prompt to Implement:**
```
Add a step challenges feature to the Daily Steps Uploader. Create a new component that allows users to:
1. Create weekly/monthly step challenges with custom goals (e.g., "10K Steps Challenge")
2. Invite friends via Farcaster mentions to join challenges
3. Display a real-time leaderboard showing participants and their progress
4. Post challenge updates and results as casts
5. Award virtual badges/achievements for completing challenges

Include:
- Challenge creation modal with goal setting
- Leaderboard component with user avatars and progress bars
- Challenge state management (active, completed, failed)
- Integration with Farcaster API to fetch user data and post updates
- Achievement system with unlockable badges
- Challenge sharing functionality with custom cast templates
```

### 2. 📊 Advanced Analytics Dashboard

Provide detailed insights into users' step patterns, trends, and fitness goals.

**AI Prompt to Implement:**
```
Build an advanced analytics dashboard for the Daily Steps Uploader. Create a comprehensive analytics system that includes:
1. Weekly/monthly step trend charts using Chart.js or Recharts
2. Goal tracking with progress visualization (circular progress bars)
3. Personal records tracking (best day, best week, streaks)
4. Step distribution analysis (morning vs evening activity)
5. Achievement unlock progress tracking
6. Export functionality for step data

Features to include:
- Interactive charts with zoom and pan capabilities
- Goal setting with smart recommendations based on historical data
- Streak counter with motivational messages
- Comparison charts (this week vs last week)
- Mobile-responsive dashboard layout
- Data persistence using localStorage or a simple backend
- Share analytics as image cards on Farcaster
```

### 3. 🤝 Social Features & Friend System

Enable users to follow friends, share achievements, and create fitness communities.

**AI Prompt to Implement:**
```
Implement a comprehensive social system for the Daily Steps Uploader. Add features that enable:
1. Friend system with Farcaster integration (follow/unfollow users)
2. Activity feed showing friends' recent step uploads and achievements
3. Comment and reaction system on step posts
4. Group challenges with team-based competitions
5. Fitness buddy matching based on similar activity levels
6. Social sharing with customizable templates

Components to build:
- Friend list component with online status indicators
- Activity feed with infinite scroll
- Comment system with real-time updates
- Group creation and management interface
- Buddy matching algorithm
- Social sharing modal with template selection
- Notification system for friend activities
- Privacy settings for step sharing preferences
```

### 4. 🎯 Smart Goal Setting & AI Recommendations

Use AI to provide personalized fitness recommendations and smart goal setting.

**AI Prompt to Implement:**
```
Create an AI-powered goal setting and recommendation system for the Daily Steps Uploader. Implement:
1. Smart goal recommendations based on user's historical data and fitness level
2. Personalized step targets that adapt to user's progress
3. AI-generated motivational messages and tips
4. Weather-aware step suggestions (indoor alternatives on rainy days)
5. Integration with health apps for comprehensive fitness tracking
6. Predictive analytics for goal achievement probability

Features to include:
- Machine learning model for step pattern analysis
- Dynamic goal adjustment based on performance
- Weather API integration for contextual recommendations
- Health app integration (Apple Health, Google Fit)
- Personalized workout suggestions
- Progress prediction algorithms
- Adaptive difficulty system
- Wellness tips and educational content
```

### 5. 🏅 Gamification & Rewards System

Add game-like elements to make step tracking more engaging and fun.

**AI Prompt to Implement:**
```
Build a comprehensive gamification system for the Daily Steps Uploader. Create an engaging rewards and achievement system that includes:
1. Experience points (XP) system based on step milestones
2. Level progression with unlockable features and badges
3. Daily/weekly quests with specific step targets
4. Virtual currency earned through activity that can be used for customization
5. Seasonal events and limited-time challenges
6. Avatar customization with fitness-themed items

Gamification elements:
- XP calculation based on step count and consistency
- Level system with increasing difficulty
- Quest system with daily, weekly, and monthly challenges
- Virtual currency (StepCoins) for purchasing avatar items
- Achievement badges with rarity levels (bronze, silver, gold, platinum)
- Seasonal events (summer fitness challenge, winter wellness)
- Avatar customization with fitness gear and accessories
- Leaderboards for different categories (most XP, longest streak, etc.)
- Social sharing of achievements and level-ups
- Milestone celebrations with confetti animations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Farcaster Frame SDK documentation](https://docs.farcaster.xyz/developers/frames)
2. Review the [Wagmi documentation](https://wagmi.sh/)
3. Open an issue in this repository

---

Built with ❤️ for the Farcaster community
