import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { Button, SidebarLayout } from "coderplex-ui";
import React, { useState } from "react";
import { Droppable, SectionPanel } from "./DroppableSection";
import { Sidebar, SidebarItem } from "./Sidebar";

const initialPages = [
  { id: "page-1", title: "Page 1", summary: "Page 1 Summary" },
  { id: "page-2", title: "Page 2", summary: "Page 2 Summary" },
  { id: "page-3", title: "Page 3", summary: "Page 3 Summary" },
  { id: "page-4", title: "Page 4", summary: "Page 4 Summary" },
  { id: "page-5", title: "Page 5", summary: "Page 5 Summary" },
  { id: "page-6", title: "Page 6", summary: "Page 6 Summary" },
  { id: "page-7", title: "Page 7", summary: "Page 7 Summary" },
  { id: "page-8", title: "Page 8", summary: "Page 8 Summary" },
  { id: "page-9", title: "Page 9", summary: "Page 9 Summary" }
];

export default function NewResource() {
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [pages, setPages] = useState(initialPages);

  function handleDragStart(event) {
    const { active } = event;
    console.log({ start: event });
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    setSections((sections) =>
      sections.map((section) => {
        if (section.id === over.id) {
          section.pages.push(pages.find((page) => page.id === active.id));
        }
        return section;
      })
    );
    setPages(pages.filter((page) => page.id !== active.id));
    console.log({ end: event });
  }

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SidebarLayout
          sidebar={
            <>
              <Sidebar pages={pages} />
            </>
          }
        >
          <div className="p-20 space-y-4">
            <Button
              onClick={() =>
                setSections([
                  ...sections,
                  {
                    id: `section-${sections.length + 1}`,
                    title: `Section - ${sections.length + 1}`,
                    pages: []
                  }
                ])
              }
            >
              Add Section
            </Button>
            <SortableContext
              //read more on the SortableContext here https://docs.dndkit.com/presets/sortable/sortable-context
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SectionPanel section={section} key={section.id} />
              ))}
            </SortableContext>
          </div>
        </SidebarLayout>
        <DragOverlay>
          {activeId ? (
            <SidebarItem page={pages.find((page) => page.id === activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
