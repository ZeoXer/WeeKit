import clsx from "clsx";
import { useState } from "react";
import { useDrop } from "react-dnd";
import { Button, Divider, Input } from "@nextui-org/react";

import { TodoCard } from "./todo-card";
import { DeleteIcon, EditIcon, PlusIcon } from "./icons";

type Todo = {
  id: string;
  text: string;
};

type ScheduleDay = {
  date: string;
  dayOfWeek: string;
  todos: Todo[];
};

export const TodoList = ({
  todos,
  setTodos,
  setSchedules,
}: {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleDay[]>>;
}) => {
  const [isOverEdit, setIsOverEdit] = useState(false);
  const [isOverDelete, setIsOverDelete] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo }]);
      setNewTodo("");
    }
  };

  // 主要區域的 drop target
  const [{ isOver }, drop] = useDrop({
    accept: "TODO_CARD",
    drop: (item: { id: string; text: string }, monitor) => {
      // 如果項目已經被其他 drop target 處理，則不執行任何操作
      if (monitor.didDrop()) {
        return;
      }

      // 檢查是否已經存在於 todos 中
      const exists = todos.some((todo) => todo.id === item.id);
      if (!exists) {
        setTodos((prev) => [...prev, { id: item.id, text: item.text }]);
        // 從所有行程表中移除該項目
        setSchedules((prev) =>
          prev.map((day) => ({
            ...day,
            todos: day.todos.filter((todo) => todo.id !== item.id),
          }))
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // 編輯按鈕的 drop target
  const [, dropEdit] = useDrop({
    accept: "TODO_CARD",
    hover: (_, monitor) => {
      const isHovering = monitor.isOver();
      setIsOverEdit(isHovering);
    },
    drop: (item: { id: string; text: string }) => {
      setIsOverEdit(false);
      // TODO: 在這裡觸發編輯功能
      console.log("編輯項目:", item);

      // 從行程表中移除
      setSchedules((prev) =>
        prev.map((day) => ({
          ...day,
          todos: day.todos.filter((todo) => todo.id !== item.id),
        }))
      );

      // 確保項目在左側列表中
      const exists = todos.some((todo) => todo.id === item.id);
      if (!exists) {
        setTodos((prev) => [...prev, { id: item.id, text: item.text }]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // 刪除按鈕的 drop target
  const [, dropDelete] = useDrop({
    accept: "TODO_CARD",
    hover: (_, monitor) => {
      const isHovering = monitor.isOver();
      setIsOverDelete(isHovering);
    },
    drop: (item: { id: string }) => {
      setIsOverDelete(false);

      // 直接從兩個地方移除項目
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== item.id));
      setSchedules((prev) =>
        prev.map((day) => ({
          ...day,
          todos: day.todos.filter((todo) => todo.id !== item.id),
        }))
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <section
      ref={drop}
      className={clsx(
        "p-5 border-3 rounded-lg transition-colors relative",
        "md:w-2/5 bg-transparent min-h-[200px]",
        isOver ? "border-primary" : "border-secondary"
      )}
    >
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        <Input
          classNames={{
            base: "col-span-2 md:col-span-4",
            input: "bg-transparent text-lg",
            innerWrapper: "bg-transparent",
            inputWrapper: "bg-transparent border-2 border-primary",
          }}
          color="primary"
          placeholder="請輸入事項..."
          size="lg"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        />
        <Button
          className="col-span-1 bg-primary"
          size="lg"
          onPress={handleAddTodo}
        >
          <PlusIcon className="fill-white" />
        </Button>
      </div>
      <Divider className="bg-secondary h-[2px] my-4 rounded-lg" />
      <div className="flex flex-wrap gap-4">
        {todos.map((todo) => (
          <div key={todo.id}>
            <TodoCard id={todo.id}>{todo.text}</TodoCard>
          </div>
        ))}
      </div>
      <ul className="flex gap-4 justify-around w-full absolute bottom-5">
        <li
          ref={dropEdit}
          className={clsx(
            "rounded-full w-12 h-12 bg-primary flex items-center justify-center transition-all duration-300",
            isOverEdit ? "scale-125" : "scale-100"
          )}
          onMouseLeave={() => setIsOverEdit(false)}
        >
          <EditIcon className="text-white" />
        </li>
        <li
          ref={dropDelete}
          className={clsx(
            "rounded-full w-12 h-12 bg-primary flex items-center justify-center transition-all duration-300",
            isOverDelete ? "scale-125" : "scale-100"
          )}
          onMouseLeave={() => setIsOverDelete(false)}
        >
          <DeleteIcon className="fill-white" />
        </li>
      </ul>
    </section>
  );
};
