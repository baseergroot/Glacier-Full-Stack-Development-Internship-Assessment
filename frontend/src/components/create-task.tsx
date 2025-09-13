import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_KEY;
export default function AddTaskModal({ open, onClose, teamId, assignedTo }: any) {
  // console.log(apiUrl)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !assignedTo) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/task/create`,
        { title, description, teamId, assignedTo },
        { withCredentials: true }
      )
      console.log("Task assigned successfully", response.data);
    } catch (err) {
      console.error("Error assigning task:", err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task to {assignedTo}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Task Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Assigning..." : "Assign Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
