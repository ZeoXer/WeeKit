import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";

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

const STORAGE_KEY = "todo-schedule-state";

const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(diff + index);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dayOfWeek: ["一", "二", "三", "四", "五", "六", "日"][index],
      todos: [],
    };
  });

  return weekDates;
};

const loadState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading state:", error);
  }
  return null;
};

const saveState = (todos: Todo[], schedules: ScheduleDay[]) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        todos,
        schedules,
        lastUpdated: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

export default function IndexPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);

  // 初始化時載入狀態
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setTodos(savedState.todos || []);
      const lastUpdated = new Date(savedState.lastUpdated);
      const currentWeek = new Date().getWeek();
      const savedWeek = lastUpdated.getWeek();

      if (currentWeek === savedWeek && savedState.schedules) {
        setSchedules(savedState.schedules);
      } else {
        setSchedules(getWeekDates());
      }
    } else {
      setSchedules(getWeekDates());
    }
  }, []);

  // 當狀態改變時保存
  useEffect(() => {
    if (schedules.length > 0) {
      saveState(todos, schedules);
    }
  }, [todos, schedules]);

  const handleTodoMove = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  return (
    <DefaultLayout>
      <DndProvider backend={HTML5Backend}>
        <section className="flex justify-center gap-4 pt-4">
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

// 擴展 Date 原型來計算週數
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function (): number {
  const d = new Date(+this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((+d - +new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};
