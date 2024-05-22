import { fabric } from "fabric";
import { nanoid } from "nanoid";

import { CustomFabricObject } from "@/types/types";

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    // Serialize the selected objects
    console.log("active objects: ", activeObjects);
    console.log("active objects length: ", activeObjects.length);
    const serializedObjects = activeObjects.map((obj) => obj.toObject());
    // Store the serialized objects in the clipboard
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  }
};

export const handlePaste = (
  canvas: fabric.Canvas,
  syncShapeInStorage: (shape: fabric.Object) => void
  // lastUsedColor: string
) => {
  console.log("handlePaste called");

  if (!canvas || !(canvas instanceof fabric.Canvas)) {
    console.error("Invalid canvas object. Aborting paste operation.");
    return;
  }

  // Retrieve serialized objects from the clipboard
  const clipboardData = localStorage.getItem("clipboard");

  console.log("clipboard data: ", clipboardData);

  if (clipboardData) {
    try {
      const parsedObjects = JSON.parse(clipboardData);
      console.log("parsed objects: ", parsedObjects);

      fabric.util.enlivenObjects(
        parsedObjects,
        (enlivenedObjects: fabric.Object[]) => {
          console.log("enlivened objects: ", enlivenedObjects);

          enlivenedObjects.forEach((enlivenedObj) => {
            enlivenedObj.set({
              left: (enlivenedObj.left ?? 0) + 20,
              top: (enlivenedObj.top ?? 0) + 20,
              objectId: nanoid(),
              fill: "#000000",
            } as CustomFabricObject<any>);

            console.log("adding object to canvas: ", enlivenedObj);

            canvas.add(enlivenedObj);
            syncShapeInStorage(enlivenedObj);
          });
          canvas.renderAll();
        },
        "fabric"
      );
    } catch (error) {
      console.error("Error parsing clipboard data:", error);
    }
  }
};

export const handleDelete = (
  canvas: fabric.Canvas,
  deleteShapeFromStorage: (id: string) => void
) => {
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects || activeObjects.length === 0) return;

  if (activeObjects.length > 0) {
    activeObjects.forEach((obj: CustomFabricObject<any>) => {
      if (!obj.objectId) return;
      canvas.remove(obj);
      deleteShapeFromStorage(obj.objectId);
      localStorage.removeItem("clipboard");
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyUp = ({
  e,
  canvas,
  undo,
  redo,
  syncShapeInStorage,
  deleteShapeFromStorage,
}: // lastUsedColor,
{
  e: KeyboardEvent;
  canvas: fabric.Canvas | any;
  undo: () => void;
  redo: () => void;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeFromStorage: (id: string) => void;
  // lastUsedColor: string;
}) => {
  console.log("handleKeyUp called with key: ", e.key);
  // Check if the key pressed is ctrl/cmd + c (copy)
  if ((e?.ctrlKey || e?.metaKey) && e.key === "c") {
    console.log("copied shape in handleKeyDown: ");
    handleCopy(canvas);
  }

  // Check if the key pressed is ctrl/cmd + v (paste)
  if ((e?.ctrlKey || e?.metaKey) && e.key === "v") {
    handlePaste(canvas, syncShapeInStorage);
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // check if the key pressed is ctrl/cmd + x (cut)
  if ((e?.ctrlKey || e?.metaKey) && e.key === "x") {
    handleCopy(canvas);
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // check if the key pressed is ctrl/cmd + z (undo)
  if ((e?.ctrlKey || e?.metaKey) && e.key === "z") {
    undo();
  }

  // check if the key pressed is ctrl/cmd + y (redo)
  if ((e?.ctrlKey || e?.metaKey) && e.key === "y") {
    redo();
  }
  if (e.key === "/" && !e.shiftKey) {
    e.preventDefault();
  }
};

export const handleKeyUp2 = (e: React.KeyboardEvent) => {
  console.log("key up event on: ", e.key);
};
