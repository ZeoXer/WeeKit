import { useState, useRef, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";
import clsx from "clsx";

import { TodoCard } from "./todo-card";

type Todo = {
  id: string;
  text: string;
};

const CARD_HEIGHT = 48;
const GAP = 16;

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "First Task" },
    { id: "2", text: "Second Task" },
    { id: "3", text: "Third Task" },
  ]);
  const [draggedItem, setDraggedItem] = useState<Todo | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleDragEnd = useCallback(() => {
    if (dragOverIndex === null || dragIndexRef.current === null) {
      setDraggedItem(null);
      setDragOverIndex(null);
      dragIndexRef.current = null;

      return;
    }

    const draggedIndex = dragIndexRef.current;

    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const [draggedItem] = newTodos.splice(draggedIndex, 1);

      newTodos.splice(dragOverIndex, 0, draggedItem);

      return newTodos;
    });

    // 重置狀態
    setDraggedItem(null);
    setDragOverIndex(null);
    dragIndexRef.current = null;
  }, [dragOverIndex]);

  useEffect(() => {
    document.addEventListener("dragend", handleDragEnd);

    return () => document.removeEventListener("dragend", handleDragEnd);
  }, [handleDragEnd]);

  const [{ isOver }, drop] = useDrop({
    accept: "TODO_CARD",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item: Todo, monitor) => {
      const draggedId = item.id;
      const draggedTodo = todos.find((todo) => todo.id === draggedId);

      if (!draggedTodo) return;

      const draggedIndex = todos.findIndex((todo) => todo.id === draggedId);

      dragIndexRef.current = draggedIndex;
      setDraggedItem(draggedTodo);

      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const mouseY = clientOffset.y - containerRect.top;
      const containerHeight = containerRect.height - GAP * 2;
      const maxIndex = todos.length;

      if (mouseY < 0 || mouseY > containerHeight) {
        return;
      }

      let newIndex = Math.floor(mouseY / (CARD_HEIGHT + GAP));

      newIndex = Math.min(Math.max(0, newIndex), maxIndex);

      setDragOverIndex(newIndex);
    },
  });

  const getItemStyle = (index: number) => {
    if (
      !draggedItem ||
      dragOverIndex === null ||
      dragIndexRef.current === null
    ) {
      return {};
    }

    const draggedIndex = dragIndexRef.current;

    if (index === draggedIndex) {
      return { visibility: "hidden" };
    }

    if (
      draggedIndex < dragOverIndex &&
      index <= dragOverIndex &&
      index > draggedIndex
    ) {
      return {
        transform: `translateY(-${CARD_HEIGHT + GAP}px)`,
        transition: "transform 200ms ease",
      };
    }

    if (
      draggedIndex > dragOverIndex &&
      index >= dragOverIndex &&
      index < draggedIndex
    ) {
      return {
        transform: `translateY(${CARD_HEIGHT + GAP}px)`,
        transition: "transform 200ms ease",
      };
    }

    return { transition: "transform 200ms ease" };
  };

  return (
    <div
      ref={(node) => {
        drop(node);
        if (node) containerRef.current = node;
      }}
      className={clsx(
        "flex flex-col gap-4 p-4 min-h-[200px] border-2 border-dashed rounded-lg transition-colors relative overflow-hidden",
        isOver ? "border-primary" : "border-gray-300"
      )}
    >
      {todos.map((todo, index) => (
        <div key={todo.id} style={getItemStyle(index)}>
          <TodoCard id={todo.id}>{todo.text}</TodoCard>
        </div>
      ))}
      {draggedItem && dragOverIndex !== null && (
        <div
          className="absolute pointer-events-none opacity-50"
          style={{
            top: `${dragOverIndex * (CARD_HEIGHT + GAP) + GAP}px`,
            left: `${GAP}px`,
            right: `${GAP}px`,
            transition: "top 200ms ease",
          }}
        >
          <TodoCard id={draggedItem.id}>{draggedItem.text}</TodoCard>
        </div>
      )}
    </div>
  );
};
