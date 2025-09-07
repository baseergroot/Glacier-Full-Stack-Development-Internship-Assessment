import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
        dueDate: { type: Date },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
)

const Task = mongoose.model('Task', taskSchema)

export default Task
