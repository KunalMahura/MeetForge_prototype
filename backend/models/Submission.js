import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java'],
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['Attempted', 'Solved'],
      default: 'Attempted',
    },
    output: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index for fast user + problem lookups
submissionSchema.index({ userId: 1, problemId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
