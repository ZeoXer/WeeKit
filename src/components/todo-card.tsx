import { Card, CardBody } from "@nextui-org/react";
import { useDrag } from "react-dnd";
import clsx from "clsx";

export const TodoCard = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO_CARD",
    item: { id, text: children as string },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className="animate-appear">
      <Card
        className={clsx(
          isDragging && "opacity-50",
          "transition-transform hover:scale-110 active:scale-100"
        )}
      >
        <CardBody className="bg-primary w-32 h-[72px] text-center flex items-center justify-center">
          <p className="text-white">{children}</p>
        </CardBody>
      </Card>
    </div>
  );
};
