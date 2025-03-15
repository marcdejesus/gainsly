# Database Schema Design

## Overview
This document outlines the database schema design for Gainsly, defining the data models, relationships, and access patterns to support the application's features while ensuring performance, scalability, and data integrity.

## Database Technology Selection

### Primary Database: MongoDB
- **Justification**: Flexible schema for evolving fitness data models, horizontal scaling capabilities, and document-oriented structure that maps well to JSON-based API responses.
- **Configuration**: Replica set with 3 nodes for high availability
- **Sharding Strategy**: Initially unsharded, with plans to shard by user ID as data grows

### Caching Layer: Redis
- **Justification**: In-memory data structure store for high-performance caching, real-time features, and session management.
- **Configuration**: Redis Cluster for horizontal scaling
- **Data Expiration**: Configurable TTL based on data type

## Core Data Models

### User Collection
```javascript
{
  _id: ObjectId,
  email: String,                // Indexed, unique
  passwordHash: String,
  salt: String,
  name: String,
  profilePicture: String,       // URL to S3 storage
  dateOfBirth: Date,
  gender: String,
  height: Number,               // in cm
  weight: Number,               // in kg
  fitnessGoals: [String],
  activityLevel: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  settings: {
    notifications: {
      workout: Boolean,
      nutrition: Boolean,
      achievements: Boolean,
      social: Boolean
    },
    privacy: {
      profileVisibility: String,
      activitySharing: String,
      dataCollection: String
    },
    theme: String,
    units: {
      weight: String,           // kg, lb
      height: String,           // cm, ft/in
      distance: String          // km, mi
    }
  },
  subscription: {
    tier: String,               // free, premium, etc.
    startDate: Date,
    endDate: Date,
    paymentMethod: String,
    autoRenew: Boolean
  },
  deviceTokens: [String],       // For push notifications
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    device: String
  }]
}
```

### Workout Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Indexed
  name: String,
  notes: String,
  startTime: Date,              // Indexed
  endTime: Date,
  duration: Number,             // in seconds
  caloriesBurned: Number,
  templateId: ObjectId,         // If created from template
  exercises: [{
    exerciseId: ObjectId,
    name: String,
    order: Number,
    sets: [{
      weight: Number,
      reps: Number,
      duration: Number,         // For timed exercises
      restTime: Number,         // Rest after set in seconds
      completed: Boolean,
      oneRepMax: Number,        // Calculated 1RM
      rpe: Number,              // Rate of Perceived Exertion
      notes: String,
      timestamp: Date
    }],
    totalVolume: Number,        // Calculated: weight * reps across sets
    personalBest: Boolean
  }],
  location: {
    type: String,               // gym, home, etc.
    coordinates: [Number, Number], // [longitude, latitude]
    name: String
  },
  tags: [String],
  metrics: {
    totalVolume: Number,
    totalReps: Number,
    averageRPE: Number,
    muscleGroups: [{
      name: String,
      volume: Number
    }]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Exercise Library Collection
```javascript
{
  _id: ObjectId,
  name: String,                 // Indexed
  aliases: [String],            // Alternative names
  description: String,
  instructions: String,
  muscleGroups: [{
    name: String,
    involvement: String         // primary, secondary
  }],
  equipment: [String],
  category: String,             // strength, cardio, etc.
  difficulty: String,
  mediaUrls: {
    images: [String],
    videos: [String]
  },
  tips: [String],
  variations: [ObjectId],       // References to related exercises
  metrics: {
    popularity: Number,
    averageRating: Number
  },
  createdAt: Date,
  updatedAt: Date,
  isCustom: Boolean,
  createdBy: ObjectId           // If user-created
}
```

### Workout Template Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  userId: ObjectId,             // Creator
  isPublic: Boolean,
  category: String,
  difficulty: String,
  estimatedDuration: Number,    // in minutes
  exercises: [{
    exerciseId: ObjectId,
    name: String,
    order: Number,
    targetSets: Number,
    targetReps: Number,
    restTime: Number,
    notes: String
  }],
  muscleGroups: [String],
  equipment: [String],
  tags: [String],
  likes: Number,
  usageCount: Number,
  ratings: [{
    userId: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Nutrition Entry Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Indexed
  date: Date,                   // Indexed
  mealType: String,             // breakfast, lunch, dinner, snack
  foods: [{
    foodId: ObjectId,
    name: String,
    servingSize: Number,
    servingUnit: String,
    calories: Number,
    macros: {
      protein: Number,          // in grams
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number
    },
    micros: {
      sodium: Number,
      potassium: Number,
      calcium: Number,
      iron: Number,
      // Other micronutrients
    }
  }],
  totalNutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    // Aggregated micronutrients
  },
  notes: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Food Database Collection
```javascript
{
  _id: ObjectId,
  name: String,                 // Indexed
  brand: String,
  barcode: String,              // Indexed
  servingSize: Number,
  servingUnit: String,
  calories: Number,
  macros: {
    protein: Number,            // in grams
    carbs: Number,
    fat: Number,
    saturatedFat: Number,
    transFat: Number,
    polyunsaturatedFat: Number,
    monounsaturatedFat: Number,
    cholesterol: Number,
    fiber: Number,
    sugar: Number,
    addedSugar: Number
  },
  micros: {
    sodium: Number,
    potassium: Number,
    calcium: Number,
    iron: Number,
    vitaminA: Number,
    vitaminC: Number,
    vitaminD: Number,
    // Other micronutrients
  },
  ingredients: String,
  allergens: [String],
  dietaryFlags: [String],       // vegan, gluten-free, etc.
  source: String,               // USDA, user-created, etc.
  verified: Boolean,
  createdBy: ObjectId,          // If user-created
  createdAt: Date,
  updatedAt: Date
}
```

### Recipe Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Creator
  name: String,
  description: String,
  ingredients: [{
    foodId: ObjectId,
    name: String,
    amount: Number,
    unit: String
  }],
  instructions: [String],
  prepTime: Number,             // in minutes
  cookTime: Number,             // in minutes
  servings: Number,
  totalNutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    // Other nutrients
  },
  nutritionPerServing: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    // Other nutrients
  },
  tags: [String],
  category: String,
  difficulty: String,
  mediaUrls: [String],
  isPublic: Boolean,
  likes: Number,
  ratings: [{
    userId: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Achievement Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,             // workout, nutrition, social, etc.
  type: String,                 // one-time, progressive
  icon: String,
  rarity: String,               // common, uncommon, rare, epic, legendary
  criteria: {
    type: String,               // workout_count, weight_lifted, etc.
    value: Number,              // Target value to achieve
    timeframe: String           // all-time, weekly, monthly, etc.
  },
  rewards: {
    points: Number,
    unlocks: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### User Achievement Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Indexed
  achievementId: ObjectId,
  progress: Number,             // Current progress toward achievement
  completed: Boolean,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Indexed
  type: String,                 // workout_completed, achievement_earned, etc.
  data: {
    // Varies based on activity type
    workoutId: ObjectId,
    achievementId: ObjectId,
    // Other relevant data
  },
  visibility: String,           // public, friends, private
  likes: [{
    userId: ObjectId,
    createdAt: Date
  }],
  comments: [{
    userId: ObjectId,
    text: String,
    createdAt: Date,
    updatedAt: Date
  }],
  createdAt: Date               // Indexed
}
```

### Friend Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,             // Indexed
  friendId: ObjectId,           // Indexed
  status: String,               // pending, accepted, blocked
  initiator: ObjectId,          // Who sent the request
  createdAt: Date,
  updatedAt: Date
}
```

## Indexing Strategy

### User Collection
- `email`: Unique index
- `refreshTokens.token`: Index for quick token lookup
- `deviceTokens`: Index for push notification targeting

### Workout Collection
- `userId`: Index for user's workouts
- `userId, startTime`: Compound index for date-based queries
- `templateId`: Index for template usage tracking

### Exercise Library Collection
- `name`: Text index for search
- `muscleGroups.name`: Index for muscle group filtering
- `equipment`: Index for equipment filtering

### Nutrition Entry Collection
- `userId, date`: Compound index for daily nutrition queries
- `userId, date, mealType`: Compound index for meal-specific queries

### Food Database Collection
- `name`: Text index for search
- `barcode`: Unique index for barcode scanning

### Activity Collection
- `userId`: Index for user's activity feed
- `createdAt`: Index for chronological sorting
- `userId, createdAt`: Compound index for paginated feeds

### Friend Collection
- `userId, status`: Compound index for friend list queries
- `friendId, status`: Compound index for incoming request queries

## Data Access Patterns

### Common Queries
1. User profile retrieval
2. User's recent workouts
3. Daily nutrition summary
4. Exercise search by muscle group
5. Friend activity feed
6. Achievement progress tracking

### Optimization Strategies
- Denormalization of frequently accessed data
- Compound indexes for common query patterns
- Caching of reference data (exercises, food database)
- Aggregation pipeline optimization

## Data Migration Strategy

### Initial Data Import
- Exercise library from public datasets
- Food database from USDA and other sources
- Initial achievement set

### Schema Evolution
- Versioned schema changes
- Backward compatibility period
- Gradual migration of existing data

## Backup and Recovery

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery capability

### Disaster Recovery
- Cross-region replication
- Recovery time objective (RTO): 1 hour
- Recovery point objective (RPO): 15 minutes

## Performance Considerations

### Sharding Strategy
- Initial deployment: Unsharded
- Future sharding key: `userId`
- Shard by user data distribution

### Query Optimization
- Covered queries where possible
- Projection to limit returned fields
- Pagination for large result sets

### Caching Strategy
- Redis for frequently accessed data
- Cache invalidation patterns
- TTL-based expiration

## Security Measures

### Data Encryption
- Encryption at rest
- Field-level encryption for sensitive data
- Secure connection strings

### Access Control
- Role-based database access
- Principle of least privilege
- Audit logging for sensitive operations 