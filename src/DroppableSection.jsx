import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";

const SectionPagePanel = React.forwardRef(({ id, ...rest }, ref) => {
  return (
    <div className="shadow-md bg-gray-100 sm:rounded-lg" ref={ref} {...rest}>
      <div className="sm:p-6 px-4 py-5 text-gray-100">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{id}</h3>
      </div>
    </div>
  );
});

function SortableSectionPagePanel({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <SectionPagePanel
      id={id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    ></SectionPagePanel>
  );
}

export function SectionPanel({ section }) {
  const [activeId, setActiveId] = useState(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    setPages(section.pages);
  }, [section.pages]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6 space-y-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {section.title}
        </h3>
        <Droppable id={section.id}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={pages.map((page) => page.id)}
              strategy={verticalListSortingStrategy}
            >
              {pages.map((page) => (
                <SortableSectionPagePanel key={page.id} id={page.id} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? <SectionPagePanel id={activeId} /> : null}
            </DragOverlay>
          </DndContext>
        </Droppable>
      </div>
    </div>
  );

  function handleDragStart(event) {
    const { active } = event;

    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPages((pages) => {
        const oldIndex = pages.findIndex((page) => page.id === active.id);
        const newIndex = pages.findIndex((page) => page.id === over.id);

        return arrayMove(pages, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }
}

export function Droppable({ children, id }) {
  const { isOver, setNodeRef } = useDroppable({
    id
  });
  const style = {
    backgroundColor: isOver ? "green" : undefined
  };

  return (
    <div ref={setNodeRef} style={style} className="droppable-area">
      {children}
    </div>
  );
}
