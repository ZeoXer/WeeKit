import clsx from "clsx";
import { useDrop } from "react-dnd";
import { TodoCard } from "./todo-card";

type ScheduleDay = {
  date: string;
  dayOfWeek: string;
  todos: { id: string; text: string }[];
};

const ScheduleDay = ({
  day,
  index,
  onDrop,
}: {
  day: ScheduleDay;
  index: number;
  onDrop: (index: number, item: { id: string; text: string }) => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TODO_CARD",
    drop: (item: { id: string; text: string }) => onDrop(index, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={clsx(
        "border-3 rounded-lg transition-colors min-h-[110px]",
        "flex items-start gap-4",
        isOver ? "border-primary bg-primary/10" : "border-secondary"
      )}
    >
      <div className="flex flex-col justify-center items-center h-full p-4 bg-secondary">
        <span className="text-lg text-white font-bold">{day.date}</span>
        <span className="text-lg text-white">週{day.dayOfWeek}</span>
      </div>
      <div className="flex flex-wrap gap-4 py-4">
        {day.todos.map((todo) => (
          <TodoCard key={todo.id} id={todo.id}>
            {todo.text}
          </TodoCard>
        ))}
      </div>
    </div>
  );
};

export const ScheduleList = ({
  schedules,
  setSchedules,
  onTodoMove,
}: {
  schedules: ScheduleDay[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleDay[]>>;
  onTodoMove: (id: string) => void;
}) => {
  const handleDrop = (index: number, item: { id: string; text: string }) => {
    setSchedules((prev) => {
      const existingDayIndex = prev.findIndex((day) =>
        day.todos.some((todo) => todo.id === item.id)
      );

      const newSchedules = [...prev];

      if (existingDayIndex !== -1) {
        // 如果是在不同天之間移動
        if (existingDayIndex !== index) {
          newSchedules[existingDayIndex].todos = newSchedules[
            existingDayIndex
          ].todos.filter((todo) => todo.id !== item.id);
          newSchedules[index].todos.push(item);
        }
      } else {
        onTodoMove(item.id);
        newSchedules[index].todos.push(item);
      }

      return newSchedules;
    });
  };

  return (
    <section className="md:w-2/5 grid gap-2">
      {schedules.map((day, index) => (
        <ScheduleDay
          key={day.dayOfWeek}
          day={day}
          index={index}
          onDrop={handleDrop}
        />
      ))}
    </section>
  );
};
