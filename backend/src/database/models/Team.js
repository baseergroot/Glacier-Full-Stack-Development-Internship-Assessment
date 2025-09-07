import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, trim: true },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

const Team = mongoose.model('Team', teamSchema)

export default Team
