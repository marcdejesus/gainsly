import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWorkout extends Document {
  userId: Types.ObjectId;
  name: string;
  description: string;
  exercises: Types.ObjectId[];
  sets: Types.ObjectId[];
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a workout name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
    sets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WorkoutSet',
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure sets and exercises are valid ObjectIds
WorkoutSchema.pre('save', async function(next) {
  try {
    // Ensure exercises are valid ObjectIds
    if (this.exercises && this.exercises.length > 0) {
      this.exercises = this.exercises.map(id => {
        if (typeof id === 'string') {
          return new Types.ObjectId(id);
        }
        return id;
      });
    }
    
    // Ensure sets are valid ObjectIds
    if (this.sets && this.sets.length > 0) {
      this.sets = this.sets.map(id => {
        if (typeof id === 'string') {
          return new Types.ObjectId(id);
        }
        return id;
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model<IWorkout>('Workout', WorkoutSchema); 