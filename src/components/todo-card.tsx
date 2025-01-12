import { Card, CardBody } from "@nextui-org/react";
import clsx from "clsx";
import { useDrag } from "react-dnd";

type TodoCardProps = {
  children: string;
  id: string;
};

export const TodoCard: React.FC<TodoCardProps> = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO_CARD",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag}>
      <Card
        className={clsx(
          isDragging && "opacity-50",
          "transition-transform hover:scale-110 active:scale-100"
        )}
      >
        <CardBody className="bg-secondary w-32 text-center">
          <p className="text-white">{children}</p>
        </CardBody>
      </Card>
    </div>
  );
};
