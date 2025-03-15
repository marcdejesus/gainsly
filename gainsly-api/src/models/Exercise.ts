import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  muscleGroup: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IExercise>('Exercise', ExerciseSchema); 