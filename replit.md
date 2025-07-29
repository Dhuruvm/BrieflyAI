# AI Note-taking App

## Overview

This is a full-stack AI-powered note-taking application with an advanced NoteGen Agent Engine featuring a sophisticated 4-agent pipeline that processes various content types (text, PDFs, audio, video URLs) and generates both structured notes and beautiful handwritten-style study notes as PDFs. The app features a modern dark-themed UI with ChatGPT-style professional interface, real-time processing animations, comprehensive note organization, and self-learning capabilities powered by Google's Gemini AI models.

## Recent Changes (January 29, 2025)

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