import Box from "@mui/material/Box";
import { Input } from "./ui/input";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import toast from "react-hot-toast";

function Todoform() {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (newTodo == "") return toast.error("Todo cannot be empty");
      try {
        const res = await fetch(BASE_URL + "/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newTodo }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setNewTodo("");

        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  return (
    <form onSubmit={createTodo}>
      <p className="txt">Today's tasks</p>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={4}
        sx={{ width: 460, maxWidth: "100%" }}
      >
        <Stack direction="row" spacing={2}>
          <Input onChange={(e) => setNewTodo(e.target.value)} value={newTodo} />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            loading={isCreating}
          >
            <AddIcon />
          </Button>
        </Stack>
      </Box>
    </form>
  );
}

export default Todoform;
