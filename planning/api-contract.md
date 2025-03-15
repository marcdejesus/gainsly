# API Contract Documentation

## Overview
This document defines the API contracts for Gainsly, establishing clear interfaces between frontend and backend systems, ensuring consistent communication, and facilitating parallel development.

## API Design Principles

### RESTful Design
- Resource-oriented endpoints
- Proper HTTP method usage (GET, POST, PUT, DELETE, PATCH)
- Consistent URL structure
- Stateless interactions
- HATEOAS implementation where appropriate

### GraphQL Implementation
- Schema-first design approach
- Query complexity limitations
- Resolver performance considerations
- Pagination standards
- Error handling conventions

### General Standards
- JSON as primary data format
- Consistent naming conventions
- Comprehensive error responses
- Proper HTTP status code usage
- Rate limiting implementation

## API Versioning Strategy

### URL-Based Versioning
- Format: `/api/v{version_number}/{resource}`
- Example: `/api/v1/workouts`

### Version Lifecycle
- **Alpha**: Internal testing only
- **Beta**: Limited external testing
- **Stable**: General availability
- **Deprecated**: Scheduled for removal
- **Sunset**: No longer available

### Backwards Compatibility
- Maintain compatibility within major versions
- Deprecation notices minimum 6 months before removal
- Version support minimum of 18 months

## Authentication & Authorization

### Authentication Methods
- JWT-based authentication
- Refresh token rotation
- OAuth 2.0 for third-party integrations
- API key authentication for partner services

### Authorization Model
- Role-based access control
- Resource-level permissions
- Scoped access tokens
- Rate limiting tiers

### Security Requirements
- HTTPS only
- Token expiration policies
- CORS configuration
- API key rotation policies

## Core API Resources

### User Management
```yaml
/api/v1/users:
  post:
    summary: Create new user
    request:
      body:
        email: string
        password: string
        name: string
    response:
      201:
        userId: string
        email: string
        name: string
        createdAt: timestamp

/api/v1/users/{userId}:
  get:
    summary: Get user profile
    response:
      200:
        userId: string
        email: string
        name: string
        profilePicture: string
        height: number
        weight: number
        fitnessGoals: array
        createdAt: timestamp
  put:
    summary: Update user profile
    request:
      body:
        name?: string
        profilePicture?: string
        height?: number
        weight?: number
        fitnessGoals?: array
    response:
      200:
        userId: string
        updatedFields: array
```

### Workout Management
```yaml
/api/v1/workouts:
  post:
    summary: Create new workout
    request:
      body:
        name: string
        exercises: array
        notes?: string
    response:
      201:
        workoutId: string
        name: string
        exercises: array
        createdAt: timestamp

/api/v1/workouts/{workoutId}/exercises:
  post:
    summary: Add exercise to workout
    request:
      body:
        exerciseId: string
        sets: array
        order: number
    response:
      201:
        exerciseId: string
        sets: array
        order: number
```

### Nutrition Tracking
```yaml
/api/v1/nutrition/entries:
  post:
    summary: Log food entry
    request:
      body:
        foodId: string
        mealType: string
        servingSize: number
        servingUnit: string
        date: date
    response:
      201:
        entryId: string
        foodId: string
        mealType: string
        nutrients: object
        timestamp: timestamp
```

## GraphQL Schema

### Core Types
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  profilePicture: String
  height: Float
  weight: Float
  fitnessGoals: [String!]
  workouts: [Workout!]
  nutritionEntries: [NutritionEntry!]
  achievements: [Achievement!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Workout {
  id: ID!
  name: String!
  exercises: [WorkoutExercise!]!
  duration: Int
  startTime: DateTime
  endTime: DateTime
  notes: String
  user: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Exercise {
  id: ID!
  name: String!
  muscleGroups: [String!]!
  equipment: [String!]
  instructions: String
  difficulty: String
  videoUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Main Queries
```graphql
type Query {
  me: User
  workout(id: ID!): Workout
  workouts(
    limit: Int = 10
    offset: Int = 0
    sortBy: String = "createdAt"
    order: SortOrder = DESC
  ): [Workout!]!
  exercise(id: ID!): Exercise
  exercises(
    muscleGroup: String
    equipment: String
    searchTerm: String
    limit: Int = 20
    offset: Int = 0
  ): [Exercise!]!
  nutritionEntries(
    startDate: DateTime!
    endDate: DateTime!
  ): [NutritionEntry!]!
}
```

### Main Mutations
```graphql
type Mutation {
  createUser(input: CreateUserInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  updateProfile(input: UpdateProfileInput!): User!
  
  createWorkout(input: CreateWorkoutInput!): Workout!
  updateWorkout(id: ID!, input: UpdateWorkoutInput!): Workout!
  deleteWorkout(id: ID!): Boolean!
  
  addExerciseToWorkout(workoutId: ID!, input: AddExerciseInput!): WorkoutExercise!
  updateSet(workoutExerciseId: ID!, setId: ID!, input: UpdateSetInput!): Set!
  
  logNutritionEntry(input: LogNutritionInput!): NutritionEntry!
}
```

## Webhooks

### Available Webhooks
- `workout.completed`: Triggered when a user completes a workout
- `achievement.unlocked`: Triggered when a user unlocks an achievement
- `goal.reached`: Triggered when a user reaches a fitness goal

### Webhook Format
```json
{
  "event": "workout.completed",
  "timestamp": "2023-06-15T14:30:00Z",
  "data": {
    "userId": "user_123",
    "workoutId": "workout_456",
    "duration": 3600,
    "exerciseCount": 5
  }
}
```

### Subscription Management
- Registration endpoint: `/api/v1/webhooks`
- Authentication requirements
- Retry policy
- Signature verification

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested workout could not be found",
    "details": {
      "workoutId": "workout_123"
    },
    "requestId": "req_abc123"
  }
}
```

### Standard Error Codes
- `AUTHENTICATION_REQUIRED`: Missing authentication
- `INVALID_CREDENTIALS`: Invalid authentication credentials
- `PERMISSION_DENIED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

### Limits by Tier
- **Free**: 60 requests per minute
- **Premium**: 120 requests per minute
- **Partner**: 300 requests per minute

### Rate Limit Headers
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time until reset

## Documentation

### OpenAPI Specification
- Complete OpenAPI 3.0 documentation
- Interactive documentation with Swagger UI
- Example requests and responses
- Authentication examples

### Developer Portal
- API reference
- Getting started guides
- Authentication tutorials
- Code examples in multiple languages
- SDKs and client libraries

## Testing & Validation

### API Testing Strategy
- Unit tests for each endpoint
- Integration tests for workflows
- Performance benchmarks
- Security testing

### Contract Testing
- Consumer-driven contract tests
- Schema validation
- Backward compatibility tests

## Implementation Guidelines

### For Frontend Developers
- Recommended client libraries
- Error handling best practices
- Caching strategies
- Offline operation patterns

### For Backend Developers
- Controller implementation patterns
- Authentication middleware
- Rate limiting implementation
- Logging requirements 