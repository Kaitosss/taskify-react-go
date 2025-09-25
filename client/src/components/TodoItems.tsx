import { Box, IconButton, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import toast from "react-hot-toast";

type TodoType = {
  id: number;
  body: string;
  completed: boolean;
};

function TodoItems() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TodoType[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + "/todos", {
          method: "GET",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data || [];
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updataTodo"],
    mutationFn: async (items: TodoType) => {
      if (items.completed) return toast.error("Todo is already completed");
      try {
        const res = await fetch(BASE_URL + `/todos/${items?.id}`, {
          method: "PUT",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (items: TodoType) => {
      try {
        const res = await fetch(BASE_URL + `/todos/${items?.id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        return items;
      } catch (error) {
        console.log(error);
      }
    },
    onMutate: async (deletedItem) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);

      queryClient.setQueryData<TodoType[]>(["todos"], (old) =>
        old ? old?.filter((t) => t.id !== deletedItem.id) : []
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <>
      {!isLoading && data?.length == 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          All tasks completed!
        </div>
      )}
      {isLoading ? (
        <div className="loader-con">
          <span className="loader"></span>
        </div>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          marginTop={4}
          marginLeft={4}
        >
          <Stack spacing={2}>
            {data?.map((items) => (
              <div className="container" key={items.id}>
                <div className="box">
                  <p
                    style={{
                      marginLeft: "7px",
                      fontWeight: 600,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "5px",
                        textDecoration: items.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {items.body}
                    </span>
                    <span
                      style={{
                        marginRight: "12px",
                        fontSize: "14px",
                      }}
                    >
                      {!items.completed && !isUpdating ? "In Progress" : "Done"}
                      {isLoading && <span className="loader-update"></span>}
                    </span>
                  </p>
                </div>
                <IconButton color="success" onClick={() => updateTodo(items)}>
                  <CheckIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deleteTodo(items)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
}

export default TodoItems;
