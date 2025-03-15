# Design System & UI/UX Prototyping

## Overview
This document outlines the design system for Gainsly, establishing consistent visual language, interaction patterns, and user experience guidelines across the application.

## Brand Identity

### Logo & App Icon
- Primary logo: Full color for marketing materials
- App icon: Simplified version for home screens
- Minimum clear space: 1x height of logo on all sides
- Minimum size: 44px for digital applications

### Color Palette

#### Primary Colors
- **Primary**: `#4A90E2` - Main brand color, used for primary actions and key UI elements
- **Secondary**: `#50E3C2` - Used for secondary actions and accents
- **Tertiary**: `#F5A623` - Used for highlights and special elements

#### Neutral Colors
- **Background**: `#F8F9FA` - Main background color
- **Surface**: `#FFFFFF` - Card and surface backgrounds
- **On Background**: `#212529` - Primary text on background
- **On Surface**: `#343A40` - Primary text on surface
- **Subtle**: `#6C757D` - Secondary text, icons, and dividers

#### Semantic Colors
- **Success**: `#28A745` - Positive actions, achievements
- **Warning**: `#FFC107` - Cautionary elements
- **Error**: `#DC3545` - Errors, destructive actions
- **Info**: `#17A2B8` - Informational elements

#### Dark Mode Variants
- **Dark Background**: `#121212`
- **Dark Surface**: `#1E1E1E`
- **Dark On Background**: `#E9ECEF`
- **Dark On Surface**: `#DEE2E6`

### Typography

#### Font Family
- **Primary**: SF Pro Text (iOS), Roboto (Android)
- **Fallback**: System default sans-serif

#### Type Scale
- **Display Large**: 34px / 41px line height / Medium
- **Display Medium**: 28px / 34px line height / Medium
- **Display Small**: 24px / 29px line height / Medium
- **Headline Large**: 20px / 24px line height / Medium
- **Headline Medium**: 18px / 22px line height / Medium
- **Headline Small**: 16px / 20px line height / Medium
- **Body Large**: 16px / 24px line height / Regular
- **Body Medium**: 14px / 20px line height / Regular
- **Body Small**: 12px / 16px line height / Regular
- **Label**: 12px / 16px line height / Medium
- **Button**: 14px / 16px line height / Medium

## Component Library

### Core Components

#### Buttons
- **Primary Button**: Main call-to-action
- **Secondary Button**: Alternative actions
- **Text Button**: Low-emphasis actions
- **Icon Button**: Icon-only interaction
- **FAB (Floating Action Button)**: Primary action for screens

#### Input Controls
- **Text Field**: Single and multi-line text input
- **Selection Controls**: Checkboxes, radio buttons, switches
- **Sliders**: Range selection
- **Date/Time Pickers**: Date and time selection

#### Navigation
- **Bottom Navigation Bar**: Main app navigation
- **Top App Bar**: Screen title and actions
- **Navigation Drawer**: Secondary navigation
- **Tabs**: Content organization within screens

#### Content Containers
- **Cards**: Contained content and actions
- **Lists**: Scrollable content
- **Grids**: Image and card layouts
- **Sheets**: Bottom and side sheets for additional content

#### Feedback
- **Snackbars**: Brief messages
- **Dialogs**: Focused user decisions
- **Progress Indicators**: Loading states
- **Empty States**: No content messaging

### Fitness-Specific Components

#### Workout Components
- **Exercise Card**: Exercise details and sets
- **Timer**: Workout and rest timers
- **Progress Chart**: Performance visualization
- **Achievement Badge**: Gamification element

#### Nutrition Components
- **Food Entry Card**: Food logging interface
- **Macro Progress**: Nutrient goal visualization
- **Water Tracker**: Hydration tracking
- **Meal Plan Card**: Planned meals display

## Interaction Patterns

### Navigation Flows
- **App Entry**: Onboarding and authentication
- **Main Navigation**: Tab-based core feature access
- **Workout Flow**: Start → Exercise Selection → Tracking → Completion
- **Nutrition Flow**: Meal Selection → Food Search → Logging → Summary

### Gestures
- **Swipe**: List item actions, page navigation
- **Long Press**: Additional options, reordering
- **Pull to Refresh**: Content update
- **Double Tap**: Quick actions (like, favorite)

### Animations
- **Transitions**: Screen and element transitions
- **Feedback**: Button presses, success states
- **Progress**: Loading and achievement animations
- **Micro-interactions**: Subtle UI feedback

## Accessibility Guidelines

### Visual Accessibility
- Minimum contrast ratio of 4.5:1 for all text
- Support for dynamic text sizes
- Color-blind friendly palette (avoid red/green distinctions)
- Focus indicators for keyboard navigation

### Interaction Accessibility
- Touch targets minimum size of 44×44 points
- Voice-over/TalkBack support for all elements
- Alternative text for all images
- Keyboard navigation support

## Prototyping Guidelines

### Tools
- Figma for UI design and prototyping
- ProtoPie for advanced interactions
- UserTesting for remote usability testing

### Deliverables
- Component library in Figma
- Interactive prototypes for key user flows
- Usability testing reports
- Design specifications for development

### Testing Protocol
- 5-7 users per testing round
- Task-based scenarios covering core features
- Think-aloud protocol
- Post-test questionnaire (SUS, custom questions)

## Implementation Guidelines

### Design-to-Development Handoff
- Component specifications with measurements
- Asset export guidelines
- Interaction documentation
- Accessibility requirements

### Quality Assurance
- Design review checklist
- Visual regression testing
- Cross-device testing matrix
- Accessibility audit 