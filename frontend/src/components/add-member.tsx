import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

const apiUrl = import.meta.env.VITE_API_KEY;
export default function AddMemberForm({ teamId }: any) {
  const [open, setOpen] = useState(false); // Controls form visibility
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users when debouncedUsername changes
  React.useEffect(() => {
    if (!debouncedUsername) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_KEY}/user`, {
  params: { username: debouncedUsername },
});
        setResults(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedUsername]);

  const handleAddMember = async (userId) => {
    try {
      await axios.post(
        `${apiUrl}/teams/${teamId}/add-member`,
        { userId },
        { withCredentials: true }
      );
      alert("Member added successfully!");
      setOpen(false);
      setUsername("");
      setResults([]);
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member.");
    }
  };


  return (
    <div className="">
      {!open ? (
        <Button onClick={() => setOpen(true)}>+ 
        Add Member
        </Button>
      ) : (
        <Card className="p-4 shadow-lg max-w-md">
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {loading && <p className="text-sm text-gray-500">Searching...</p>}

            <div className="space-y-2">
              {results.length > 0 ? (
                results.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center border p-2 rounded-md"
                  >
                    <span>@{user.username}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddMember(user._id)}
                    >
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                debouncedUsername && !loading && (
                  <p className="text-sm text-gray-400">No users found</p>
                )
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setUsername("");
                setResults([]);
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
