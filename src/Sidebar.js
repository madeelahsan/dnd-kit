import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

function Draggable({ children, id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  });
  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export function SidebarItem({ page }) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {page.title}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{page.summary}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ pages }) {
  return (
    <>
      <div className="overflow-y-auto space-y-4 py-6 px-6 z-50">
        {pages.map((page) => (
          <React.Fragment key={page.id}>
            <Draggable id={page.id}>
              <SidebarItem page={page} />
            </Draggable>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
