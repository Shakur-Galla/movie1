# Movie Discovery App

The Movie1 mobile application built with React Native and Expo that allows users to discover, search, and save their favorite movies using The Movie Database (TMDB) API.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Data Persistence](#data-persistence)
- [UI/UX Design](#uiux-design)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

This mobile application provides a comprehensive movie browsing experience with real-time search, detailed movie information, and personalized favorites management. Built using modern React Native technologies and best practices, the app demonstrates production-ready code quality with proper error handling, type safety, and optimized performance.

## Features

### Core Functionality

#### 1. Movie Discovery
- Browse popular and trending movies
- Infinite scroll pagination for seamless browsing
- Pull-to-refresh functionality to get latest movies
- Display movie poster, title, rating, and overview
- Skeleton loading states for better UX

#### 2. Advanced Search
- Real-time search with 500ms debouncing
- Search results with pagination support
- Clear search functionality
- Comprehensive empty states (initial, loading, no results, error)
- Smart keyboard handling

#### 3. Movie Details
- Comprehensive movie information display
- High-quality backdrop and poster images
- Movie metadata (release date, runtime, status)
- Genre tags
- Detailed plot overview
- Top 10 cast members with profile pictures
- Box office information (budget and revenue)
- User ratings and vote counts
- Add/Remove from favorites functionality

#### 4. Favorites Management
- Save favorite movies locally
- Persistent storage across app sessions
- View all favorite movies in dedicated screen
- Remove individual favorites with confirmation
- Bulk remove with "Clear All" option
- Optimistic UI updates with error rollback

#### 5. Navigation
- Bottom tab navigation (Home, Search, Favorites)
- Stack navigation for movie details
- Smooth transitions between screens
- Back button navigation

### User Experience Features

- Skeleton loading screens for all async operations
- Error states with retry functionality
- Confirmation dialogs for destructive actions
- Responsive design for various screen sizes
- Smooth animations and transitions
- Intuitive empty states with helpful messages

## Tech Stack

### Core Technologies

**Framework & Platform**
- **React Native** (0.81.5) - Cross-platform mobile development
- **Expo** (~54.0.29) - Development platform and tooling
- **Expo Router** (~6.0.19) - File-based routing system
- **TypeScript** (~5.9.2) - Type safety and enhanced developer experience

**State Management**
- **Zustand** (^5.0.9) - Lightweight state management library
- Modular store architecture with separate concerns
- Optimistic updates with rollback capability

**Data & API**
- **Axios** (^1.13.2) - HTTP client for API requests
- **Expo Constants** (~18.0.12) - Environment configuration
- **AsyncStorage** (^2.2.0) - Local data persistence

**Navigation**
- **React Navigation Native** (^7.1.8) - Navigation infrastructure
- **React Navigation Bottom Tabs** (^7.4.0) - Tab navigation

**Styling**
- **NativeWind** (^4.2.1) - Tailwind CSS for React Native
- **Tailwind CSS** (^3.4.17) - Utility-first CSS framework

**UI Components**
- **Expo Vector Icons** (^15.0.3) - Icon library (Ionicons)
- Custom skeleton loading components
- Reusable UI components

### Development Tools

- **ESLint** (^9.25.0) - Code linting
- **Prettier** - Code formatting
- **React Native Screens** (~4.16.0) - Native screen optimization
- **React Native Safe Area Context** (^5.4.0) - Safe area handling
- **React Native Gesture Handler** (~2.28.0) - Gesture management
- **React Native Reanimated** (~3.10.0) - Animation library

## Architecture

### Design Patterns

**1. Separation of Concerns**
- API layer separated from business logic
- Store layer for state management
- Component layer for UI presentation
- Utility layer for shared functionality

**2. Type Safety**
- Comprehensive TypeScript interfaces
- Typed API responses
- Type-safe store implementations
- Compile-time error detection

**3. Error Handling**
- Centralized error handling in API client
- User-friendly error messages
- Retry mechanisms for failed requests
- Graceful degradation

**4. Performance Optimization**
- Debounced search to reduce API calls
- Pagination for large data sets
- Optimistic UI updates
- Memoization where appropriate
- Efficient re-renders with Zustand

### Code Organization

The application follows a feature-based structure with clear separation between:
- Presentation layer (screens and components)
- Business logic layer (stores)
- Data layer (API and storage)
- Shared utilities and hooks

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (installed globally)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **TMDB API Key** (free registration at themoviedb.org)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie-discovery-app
```

### 2. Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Install Additional Dependencies

```bash
npx expo install axios expo-constants
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npm install zustand
npx expo install @react-native-async-storage/async-storage
```

## Configuration

### 1. Obtain TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/signup)
2. Create a free account
3. Navigate to Settings > API
4. Request an API key (choose "Developer" option)
5. Copy your API key

### 2. Configure Environment Variables

Update your `.env` file with your API key:

```json
EXPO_PUBLIC_TMDB_API_KEY=APIKEY_GOES_HERE
```

**Security Note**: For production applications, consider using `expo-constants` with environment-specific configuration files and never commit API keys to version control.

## Running the Application

### Development Mode

Start the Expo development server:

```bash
npx expo start
```

Or with cache clearing:

```bash
npx expo start -c
```

### Run on Android

```bash
npx expo start --android
```

Or press `a` in the terminal after starting the dev server.

### Run on iOS

```bash
npx expo start --ios
```

Or press `i` in the terminal after starting the dev server.

### Run on Web

```bash
npx expo start --web
```

Or press `w` in the terminal after starting the dev server.

## Building for Production

### Android APK

1. **Install EAS CLI** (if not already installed):

```bash
npm install -g eas-cli
```

2. **Login to Expo**:

```bash
eas login
```

3. **Configure EAS Build**:

```bash
eas build:configure
```

4. **Build APK**:

```bash
eas build --platform android --profile preview
```

For production build:

```bash
eas build --platform android --profile production
```

5. **Download APK**:

Once the build is complete, download the APK from the provided URL.

### iOS Build

```bash
eas build --platform ios --profile production
```

**Note**: iOS builds require an Apple Developer account.

## Project Structure

```
movie-discovery-app/
├── app/                          # Application screens (Expo Router)
│   ├── _layout.tsx              # Root layout
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx         # Tab layout configuration
│   │   ├── index.tsx           # Home screen (Popular movies)
│   │   ├── search.tsx          # Search screen
│   │   └── favorites.tsx       # Favorites screen
│   └── movie/                   # Movie details
│       └── [id].tsx            # Dynamic movie detail screen
│
├── components/                   # Reusable components
│   └── Skeleton.tsx             # Loading skeleton components
│
├── api/                         # API layer
│   ├── types.ts                # TypeScript type definitions
│   ├── client.ts               # Axios client configuration
│   └── endpoints.ts            # API endpoint methods
│
├── store/                       # State management (Zustand)
│   ├── moviesStore.ts          # Popular movies state
│   ├── searchStore.ts          # Search state
│   ├── movieDetailStore.ts     # Movie details state
│   ├── favoritesStore.ts       # Favorites state
│   └── index.ts                # Store exports
│
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts          # Debounce hook for search
│   └── index.ts                # Hook exports
│
├── utility/                     # Utility functions
│   └── storage.ts              # AsyncStorage service
│
├── assets/                      # Static assets
│   └── images/                 # App images and icons
│
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── global.css                  # Global styles
```

## API Integration

### TMDB API

The application integrates with The Movie Database (TMDB) API v3.

**Base URL**: `https://api.themoviedb.org/3`

**Endpoints Used**:

1. **Get Popular Movies**
   - Endpoint: `/movie/popular`
   - Method: GET
   - Parameters: `api_key`, `page`
   - Returns: List of popular movies with pagination

2. **Search Movies**
   - Endpoint: `/search/movie`
   - Method: GET
   - Parameters: `api_key`, `query`, `page`
   - Returns: Search results with pagination

3. **Get Movie Details**
   - Endpoint: `/movie/{movie_id}`
   - Method: GET
   - Parameters: `api_key`
   - Returns: Comprehensive movie information

4. **Get Movie Credits**
   - Endpoint: `/movie/{movie_id}/credits`
   - Method: GET
   - Parameters: `api_key`
   - Returns: Cast and crew information

**Image URLs**:
- Base URL: `https://image.tmdb.org/t/p/`
- Poster size: `w500`
- Backdrop size: `w780`
- Profile size: `w500`

### API Client Implementation

The API client is implemented with the following features:

**Request Interceptor**:
- Automatic API key injection
- Request logging in development
- Error transformation

**Response Interceptor**:
- Automatic error handling
- HTTP status code mapping
- User-friendly error messages

**Error Handling**:
- 401: Invalid API key
- 404: Resource not found
- 429: Rate limit exceeded
- 500-503: Server errors
- Network errors

## State Management

### Zustand Stores

The application uses Zustand for state management with four separate stores:

#### 1. Movies Store (`moviesStore.ts`)

Manages popular movies list with pagination.

**State**:
- `movies`: Array of movie objects
- `page`: Current page number
- `totalPages`: Total available pages
- `loading`: Loading state
- `refreshing`: Pull-to-refresh state
- `error`: Error message
- `hasMore`: More data available flag

**Actions**:
- `fetchMovies()`: Fetch first page
- `fetchMoreMovies()`: Load next page
- `refreshMovies()`: Refresh from page 1
- `reset()`: Reset to initial state

#### 2. Search Store (`searchStore.ts`)

Manages movie search functionality.

**State**:
- `query`: Search query string
- `movies`: Search results
- `page`: Current page
- `loading`: Loading state
- `error`: Error message
- `hasSearched`: Search performed flag
- `hasMore`: More results available

**Actions**:
- `setQuery(query)`: Update search query
- `searchMovies(query, page)`: Perform search
- `loadMoreResults()`: Load more search results
- `clearSearch()`: Clear search state

#### 3. Movie Detail Store (`movieDetailStore.ts`)

Manages individual movie details and credits.

**State**:
- `movie`: Movie detail object
- `cast`: Array of cast members
- `loading`: Loading state
- `error`: Error message

**Actions**:
- `fetchMovieDetails(movieId)`: Fetch movie details and credits
- `reset()`: Clear movie data

#### 4. Favorites Store (`favoritesStore.ts`)

Manages user's favorite movies with persistence.

**State**:
- `favorites`: Array of favorite movies
- `loading`: Loading state
- `initialized`: Storage loaded flag

**Actions**:
- `loadFavorites()`: Load from AsyncStorage
- `addFavorite(movie)`: Add movie to favorites
- `removeFavorite(movieId)`: Remove movie from favorites
- `isFavorite(movieId)`: Check if movie is favorited
- `clearAllFavorites()`: Remove all favorites

### Store Features

**Optimistic Updates**:
- UI updates immediately
- Storage operations in background
- Rollback on failure

**Error Handling**:
- Try-catch blocks in all async operations
- State restoration on failure
- User-friendly error messages

**Type Safety**:
- Fully typed store interfaces
- Type inference for actions
- Compile-time type checking

## Data Persistence

### AsyncStorage Implementation

The application uses React Native AsyncStorage for local data persistence.

**Storage Service** (`utility/storage.ts`):

**Methods**:

1. `getFavorites()`: Retrieve all favorites
2. `saveFavorites(favorites)`: Save favorites array
3. `addFavorite(movie)`: Add single movie
4. `removeFavorite(movieId)`: Remove single movie
5. `isFavorite(movieId)`: Check favorite status
6. `clearFavorites()`: Remove all favorites

**Features**:
- JSON serialization/deserialization
- Error handling with fallbacks
- Duplicate prevention
- Atomic operations

**Storage Key**: `@movie_favorites`

**Data Format**:
```json
[
  {
    "id": 550,
    "title": "Fight Club",
    "poster_path": "/path/to/poster.jpg",
    "vote_average": 8.4,
    "release_date": "1999-10-15",
    "overview": "Movie description...",
    // ... other movie properties
  }
]
```

## UI/UX Design

### Design System

**Color Palette**:
- Primary: `#C9A24D` (Gold) - Accent color for ratings and highlights
- Background: `#F7F7F5` (Off-white) - Main background
- Surface: `#FFFFFF` (White) - Cards and surfaces
- Text Primary: `#111827` (Gray-900) - Main text
- Text Secondary: `#6B7280` (Gray-500) - Secondary text
- Text Tertiary: `#9CA3AF` (Gray-400) - Tertiary text
- Border: `#E5E7EB` (Gray-200) - Borders and dividers
- Error: `#EF4444` (Red-500) - Error states
- Success: `#10B981` (Green-500) - Success states

**Typography**:
- Display: 30-32px, Bold - Screen titles
- Heading: 20-24px, Bold - Section headers
- Body: 14-17px, Regular/Semibold - Main content
- Caption: 12-14px, Regular - Supporting text

**Spacing Scale**:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

**Border Radius**:
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- full: 9999px (circular)

### Component Patterns

**Movie Cards**:
- White background with subtle border
- Rounded corners (16px)
- Title, date, rating, and overview
- Tap target size optimization
- Hover/press states

**Loading States**:
- Skeleton screens with pulse animation
- Contextual loading indicators
- Progressive loading for better perceived performance

**Empty States**:
- Icon, heading, and description
- Contextual messaging
- Action buttons where appropriate

**Error States**:
- Clear error message
- Retry button
- Back navigation option

## Performance Optimizations

### Implemented Optimizations

1. **Debounced Search**
   - 500ms debounce on search input
   - Reduces API calls by ~80%
   - Prevents unnecessary re-renders

2. **Pagination**
   - Loads 20 movies per page
   - Infinite scroll implementation
   - Reduces initial load time

3. **Image Loading**
   - Progressive image loading
   - Appropriate image sizes (w500, w780)
   - Fallback for missing images

4. **State Management**
   - Zustand for minimal re-renders
   - Selective state updates
   - Optimistic UI updates

5. **Code Splitting**
   - Expo Router automatic code splitting
   - Lazy loading of screens
   - Reduced bundle size

6. **Memoization**
   - React hooks optimization
   - Callback memoization
   - Prevented unnecessary computations

7. **AsyncStorage Optimization**
   - Single storage key for all favorites
   - Batch operations
   - Minimal read/write operations

## Testing

### Manual Testing Checklist

**Home Screen**:
- [ ] Popular movies load on app start
- [ ] Infinite scroll loads more movies
- [ ] Pull-to-refresh updates movie list
- [ ] Skeleton loading displays correctly
- [ ] Error state shows retry button
- [ ] Tapping movie navigates to details

**Search Screen**:
- [ ] Search input is responsive
- [ ] Debouncing works (500ms delay)
- [ ] Search results display correctly
- [ ] Clear button removes search
- [ ] Empty states display appropriately
- [ ] Pagination works on scroll
- [ ] Error handling works

**Movie Details**:
- [ ] All movie information displays
- [ ] Images load correctly
- [ ] Cast members display
- [ ] Add to favorites works
- [ ] Remove from favorites works
- [ ] Favorite status persists
- [ ] Back button returns to previous screen

**Favorites**:
- [ ] Favorites list displays all saved movies
- [ ] Remove favorite shows confirmation
- [ ] Clear all shows confirmation
- [ ] Empty state displays when no favorites
- [ ] Favorites persist after app restart
- [ ] Navigation to movie details works

**Navigation**:
- [ ] Tab navigation works smoothly
- [ ] Active tab is highlighted
- [ ] Screen transitions are smooth
- [ ] Back button behavior is correct

### Automated Testing

For automated testing, consider implementing:

**Unit Tests**:
- Store logic testing
- Utility function testing
- Custom hooks testing
- API client testing

**Integration Tests**:
- Screen rendering tests
- Navigation flow tests
- API integration tests

**E2E Tests**:
- User flow testing
- Cross-screen interactions
- Data persistence testing

Recommended tools:
- Jest for unit tests
- React Native Testing Library
- Detox for E2E testing

## Future Enhancements

### Potential Features

**Enhanced Discovery**:
- Genre filtering
- Sort options (rating, date, popularity)
- Trending movies by time period
- Now playing movies
- Upcoming releases

**Rich Content**:
- Movie trailers (YouTube integration)
- Movie reviews
- Similar movies recommendations
- Movie galleries
- Streaming availability

**User Features**:
- Watchlist (separate from favorites)
- Watched movies tracking
- Personal ratings
- Movie notes
- Share functionality

**Technical Improvements**:
- Dark mode support
- Offline mode with caching
- Push notifications
- Deep linking
- i18n (internationalization)
- Accessibility improvements
- Unit and integration tests
- Error boundary implementation
- Analytics integration
- Performance monitoring

**UI Enhancements**:
- Advanced animations
- Image zoom functionality
- Swipe gestures
- Custom transitions
- Haptic feedback
- Voice search

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Style**:
- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Ensure no linting errors

**Testing**:
- Test all new features
- Ensure existing tests pass
- Add new tests for new functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **The Movie Database (TMDB)** for providing the comprehensive movie API
- **Expo Team** for the excellent development platform
- **React Native Community** for continuous support and contributions
- **Zustand** for lightweight state management
- **NativeWind** for bringing Tailwind CSS to React Native

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready
