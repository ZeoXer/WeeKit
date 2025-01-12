import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DefaultLayout from "@/layouts/default";
import { TodoList } from "@/components/todo-list";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <DndProvider backend={HTML5Backend}>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <TodoList />
        </section>
      </DndProvider>
    </DefaultLayout>
  );
}
