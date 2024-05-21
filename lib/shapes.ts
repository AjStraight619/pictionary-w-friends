import { fabric } from "fabric";
import { nanoid } from "nanoid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
  UpdateShapeColor,
} from "@/types/types";

export const createRectangle = (
  pointer: PointerEvent,
  lastUsedColor: string
) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: lastUsedColor,
    objectId: nanoid(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (
  pointer: PointerEvent,
  lastUsedColor: string
) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: lastUsedColor,
    objectId: nanoid(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent, lastUsedColor: string) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: lastUsedColor,
    objectId: nanoid(),
  } as any);
};

// export const createLine = (pointer: PointerEvent) => {
//   return new fabric.Line(
//     [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
//     {
//       stroke: "#aabbcc",
//       strokeWidth: 2,
//       objectId: nanoid(),
//     } as CustomFabricObject<fabric.Line>
//   );
// };

// export const createText = (pointer: PointerEvent, text: string) => {
//   return new fabric.IText(text, {
//     left: pointer.x,
//     top: pointer.y,
//     fill: "#aabbcc",
//     fontFamily: "Helvetica",
//     fontSize: 36,
//     fontWeight: "400",
//     objectId: nanoid(),
//   } as fabric.ITextOptions);
// };

export const createSpecificShape = (
  lastUsedColor: string,
  shapeType: string,
  pointer: PointerEvent
) => {
  console.log("shape type: ", shapeType);
  console.log("last used color: ", lastUsedColor);
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer, lastUsedColor);

    case "triangle":
      return createTriangle(pointer, lastUsedColor);

    case "circle":
      return createCircle(pointer, lastUsedColor);

    default:
      return null;
  }
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string,
  lastUsedColor: string
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(lastUsedColor, shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

// export const bringElement = ({
//   canvas,
//   direction,
//   syncShapeInStorage,
// }: ElementDirection) => {
//   if (!canvas) return;

//   // get the selected element. If there is no selected element or there are more than one selected element, return
//   const selectedElement = canvas.getActiveObject();

//   if (!selectedElement || selectedElement?.type === "activeSelection") return;

//   // bring the selected element to the front
//   if (direction === "front") {
//     canvas.bringToFront(selectedElement);
//   } else if (direction === "back") {
//     canvas.sendToBack(selectedElement);
//   }

//   // canvas.renderAll();
//   syncShapeInStorage(selectedElement);

//   // re-render all objects on the canvas
// };

export const updateSelectedObjectsColor = ({
  lastUsedColor,
  canvas,
}: UpdateShapeColor) => {
  if (canvas) {
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) return;
    selectedObjects.forEach((obj) => {
      if (obj instanceof fabric.Path) {
        obj.set("stroke", lastUsedColor);
      } else {
        obj.set("fill", lastUsedColor);
        obj.set("stroke", lastUsedColor);
      }
    });
    canvas.renderAll();
  }
};
