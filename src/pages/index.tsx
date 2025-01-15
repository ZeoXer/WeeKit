import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { TodoList } from "@/components/todo-list";
import { ScheduleList } from "@/components/schedule-list";

type Todo = {
  id: string;
  text: string;
};

type ScheduleDay = {
  date: string;
  dayOfWeek: string;
  todos: Todo[];
};

const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.setDate(diff + index));
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dayOfWeek: ["一", "二", "三", "四", "五", "六", "日"][index],
      todos: [],
    };
  });
};

export default function IndexPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "完成研究計畫書" },
    { id: "2", text: "改完計算機網路作業" },
    { id: "3", text: "完成計算機網路作業" },
  ]);

  const [schedules, setSchedules] = useState<ScheduleDay[]>(getWeekDates());

  const handleTodoMove = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  return (
    <DefaultLayout>
      <DndProvider backend={HTML5Backend}>
        <section className="flex justify-center gap-4 py-8 md:py-10">
          <TodoList
            setSchedules={setSchedules}
            setTodos={setTodos}
            todos={todos}
          />
          <ScheduleList
            schedules={schedules}
            setSchedules={setSchedules}
            onTodoMove={handleTodoMove}
          />
        </section>
      </DndProvider>
    </DefaultLayout>
  );
}
