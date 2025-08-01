# AI Note-taking App

## Overview

This is a full-stack AI-powered note-taking application with an advanced NoteGen Agent Engine featuring a sophisticated 4-agent pipeline that processes various content types (text, PDFs, audio, video URLs) and generates both structured notes and beautiful handwritten-style study notes as PDFs. The app features a modern dark-themed UI with ChatGPT-style professional interface, real-time processing animations, comprehensive note organization, and self-learning capabilities powered by Google's Gemini AI models.

## Recent Changes (February 1, 2025)

### Bug Fixes and Theme Integration (February 1, 2025)
- Fixed critical CSS compilation errors with Tailwind opacity syntax (`bg-muted/50` to `bg-muted opacity-50`)
- Resolved PostCSS build failures preventing app startup
- Integrated ThemeProvider properly with dark mode as default theme
- Updated color scheme to use consistent CSS variables across all components
- Fixed duplicate routing and improved navigation structure
- Applied modern professional green theme with proper contrast ratios
- Updated all hardcoded color classes to use theme-aware CSS variables

### Modern Professional UI Implementation (February 1, 2025)
- Completely redesigned color palette with modern ChatGPT/Gemini-inspired themes
- Enhanced CSS custom classes with advanced blur effects, shadows, and rounded corners
- Updated workspace chat interface with larger chat bubbles and improved message layout
- Redesigned clustering workbench with modern cards, enhanced inputs, and better spacing
- Added framer-motion animations throughout for smooth transitions and micro-interactions
- Implemented professional status pills, modern buttons, and enhanced form components
- Created cohesive design system using rounded-2xl/3xl surfaces and backdrop blur effects

### Modern Professional UI Redesign - ChatGPT/Gemini/Delv Inspired (February 1, 2025)
- Completely redesigned with modern professional color scheme (greens, grays, whites)
- Implemented ChatGPT/Gemini-style chat interface with rounded-xl components and soft shadows
- Added theme provider with light/dark mode support using CSS variables
- Created pill-style status badges and embedded message blocks
- Enhanced loading page with smooth animations and progressive disclosure
- Updated landing page with modern card layouts and improved visual hierarchy
- Implemented professional gradients and backdrop blur effects
- Added framer-motion animations throughout for smooth transitions
- Used consistent rounded-2xl surfaces and modern spacing system

### Migration to Replit Environment (February 1, 2025)
- Successfully migrated from Replit Agent to Replit environment
- Enhanced security best practices with proper client-server separation
- Optimized project structure for Replit compatibility
- Implemented professional design system following ChatGPT/Gemini patterns

## Previous Changes (January 29, 2025)

### Enhanced NoteGen Architecture
- Redesigned with 4 specialized AI agents for superior note generation
- Added self-learning system with user feedback integration
- Implemented advanced styling options and visual density controls
- Enhanced PDF generation with multiple design templates

### Advanced Agent Pipeline
- **Agent 1**: Layout Designer - Converts raw text into structured layouts
- **Agent 2**: Styling Designer - Applies intelligent highlighting and visual enhancements  
- **Agent 3**: Diagram Generator - Creates flowcharts, cycles, and visual aids using Mermaid.js
- **Agent 4**: PDF Designer - Renders final handwritten-style PDFs with custom fonts

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom AI-themed color palette
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for note management and content processing
- **File Handling**: Multer for multipart form data and file uploads
- **Development**: Hot reload with Vite integration in development mode

### Database & ORM
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Centralized in `shared/schema.ts` for type safety across frontend and backend
- **Validation**: Zod schemas for runtime type checking and API validation

## Key Components

### Advanced Content Processing Pipeline
1. **Input Handlers**: Support for text input, file uploads (PDF, audio), and video URL processing
2. **Legacy AI Processing**: Google Gemini integration for basic content analysis and note generation
3. **Structured Output**: Generates title, summary, key points, action items, and visual cards
4. **Advanced NoteGen Engine**: 4-agent pipeline with self-learning capabilities:
   - **Agent 1**: Layout Designer - Intelligent structure extraction using BART-equivalent logic
   - **Agent 2**: Styling Designer - NER-based highlighting with rule-based color mapping
   - **Agent 3**: Diagram Generator - Mermaid.js integration for visual aids and flowcharts
   - **Agent 4**: PDF Designer - Handwritten-style rendering with Google Fonts integration
5. **Self-Learning System**: Performance tracking, user feedback integration, and template optimization
6. **Real-time Feedback**: Progress indicators, agent pipeline status, and processing metrics

### UI Components
- **Upload Zone**: Drag-and-drop file upload with visual feedback
- **Note Cards**: Animated display of generated notes with visual cards
- **Mobile-Responsive**: Optimized for both desktop and mobile experiences
- **Dark Theme**: Custom AI-themed color palette with CSS variables

### Data Models
- **Note Schema**: Comprehensive note structure with metadata
- **Content Types**: Support for text, PDF, audio, and video URL content
- **Processing Status**: Tracking of content processing states
- **Visual Cards**: Structured data for metrics and key concepts display

## Data Flow

1. **Content Input**: User uploads file or enters text/URL
2. **Validation**: Zod schemas validate input data
3. **Processing**: Content sent to Google Gemini API for analysis
4. **Storage**: Generated notes stored in PostgreSQL database
5. **Real-time Updates**: Frontend receives updates via TanStack Query
6. **Display**: Animated presentation of structured notes

## External Dependencies

### Core Dependencies
- **Google Gemini API**: Content processing and analysis (Gemini 2.5 Flash/Pro models)
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library for smooth transitions

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Drizzle Kit**: Database schema management and migrations
- **Replit Integration**: Development environment optimization

### Content Processing
- **File Types**: PDF text extraction, audio transcription, video content analysis
- **AI Integration**: Structured output generation with JSON schema validation
- **Error Handling**: Comprehensive error handling for file processing and API failures

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast refresh
- **Express Middleware**: Vite integration for seamless development experience
- **Environment Variables**: Database URL and Gemini API key configuration
- **TypeScript Compilation**: Real-time type checking and error reporting

### Production Build
- **Frontend**: Vite build with optimized bundle splitting
- **Backend**: ESBuild compilation to single distributable file
- **Static Assets**: Served from Express in production mode
- **Database**: Drizzle migrations for schema deployment

### Configuration Management
- **Environment-based**: Different configurations for development and production
- **Database**: Automatic connection handling with connection pooling
- **API Keys**: Secure environment variable management
- **CORS**: Configured for cross-origin requests in development

### Performance Optimizations
- **Bundle Splitting**: Automatic code splitting for optimal loading
- **Asset Optimization**: Compressed assets and efficient caching
- **Database**: Optimized queries with proper indexing
- **Error Boundaries**: Graceful error handling and recovery