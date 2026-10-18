import { Schema } from 'mongoose';
import { model } from 'mongoose';

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Оновлюємо індекс полем userId
// Тому що будемо використовувати його при пошуку
studentSchema.index({ userId: 1, gender: 1, avgMark: 1 });

export const Student = model('Student', studentSchema);
