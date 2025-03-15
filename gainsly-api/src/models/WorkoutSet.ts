import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWorkoutSet extends Document {
  exerciseId: Types.ObjectId;
  reps: number;
  weight: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSetSchema = new Schema(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'Exercise ID is required'],
    },
    reps: {
      type: Number,
      required: [true, 'Number of reps is required'],
      min: [1, 'Reps must be at least 1'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure exerciseId is a valid ObjectId
WorkoutSetSchema.pre('save', async function(next) {
  try {
    // Ensure exerciseId is a valid ObjectId
    if (this.exerciseId && typeof this.exerciseId === 'string') {
      this.exerciseId = new Types.ObjectId(this.exerciseId);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model<IWorkoutSet>('WorkoutSet', WorkoutSetSchema); 