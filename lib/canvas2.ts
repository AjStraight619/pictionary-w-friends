// import { CanvasMouseDown, CanvasSelection } from "@/types/types2";
// import { createSpecificShape } from "./shapes";
// import {
//   CanvasMouseMove,
//   CanvasMouseUp,
//   CanvasPathCreated,
// } from "@/types/types";
// import { defaultNavElement } from "@/constants";
// import { nanoid } from "nanoid";

// export const handleCanvasMouseDown = ({
//   options,
//   canvas,
//   selectedShapeRef,
//   isDrawing,
//   shapeRef,
//   lastUsedColor,
// }: CanvasMouseDown) => {
//   // get pointer coordinates
//   const pointer = canvas.getPointer(options.e);

//   /**
//    * get target object i.e., the object that is clicked
//    * findtarget() returns the object that is clicked
//    *
//    * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
//    */
//   const target = canvas.findTarget(options.e, false);

//   // set canvas drawing mode to false
//   canvas.isDrawingMode = false;

//   // if selected shape is freeform, set drawing mode to true and return
//   if (selectedShapeRef.current === "freeform") {
//     isDrawing.current = true;
//     canvas.isDrawingMode = true;
//     canvas.freeDrawingBrush.width = 5;
//     return;
//   }

//   canvas.isDrawingMode = false;

//   // if target is the selected shape or active selection, set isDrawing to false
//   if (
//     target &&
//     (target.type === selectedShapeRef.current ||
//       target.type === "activeSelection")
//   ) {
//     isDrawing.current = false;

//     // set active object to target
//     canvas.setActiveObject(target);

//     /**
//      * setCoords() is used to update the controls of the object
//      * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
//      */
//     target.setCoords();
//   } else {
//     isDrawing.current = true;

//     // create custom fabric object/shape and set it to shapeRef
//     shapeRef.current = createSpecificShape(
//       lastUsedColor,
//       selectedShapeRef.current,
//       pointer as any
//     );

//     // if shapeRef is not null, add it to canvas
//     if (shapeRef.current) {
//       // add: http://fabricjs.com/docs/fabric.Canvas.html#add
//       canvas.add(shapeRef.current);
//     }
//   }
// };

// export const handleSelection = ({
//   canvas,
//   activeObjects,
//   syncShapeInStorage,
//   lastUsedColor,
// }: CanvasSelection) => {
//   activeObjects.forEach((obj) => {
//     obj.set("fill", lastUsedColor);
//   });
//   canvas.renderAll();
// };

// export const handleCanvasMouseUp = ({
//   canvas,
//   isDrawing,
//   shapeRef,
//   activeObjectRef,
//   selectedShapeRef,
//   syncShapeInStorage,
//   setActiveElement,
// }: CanvasMouseUp) => {
//   isDrawing.current = false;
//   if (selectedShapeRef.current === "freeform") return;

//   // sync shape in storage as drawing is stopped
//   syncShapeInStorage(shapeRef.current);

//   // set everything to null
//   shapeRef.current = null;
//   activeObjectRef.current = null;
//   selectedShapeRef.current = null;

//   // if canvas is not in drawing mode, set active element to default nav element after 700ms
//   if (!canvas.isDrawingMode) {
//     setTimeout(() => {
//       setActiveElement(defaultNavElement);
//     }, 700);
//   }
// };

// // handle mouse move event on canvas to draw shapes with different dimensions
// export const handleCanvaseMouseMove = ({
//   options,
//   canvas,
//   isDrawing,
//   selectedShapeRef,
//   shapeRef,
//   syncShapeInStorage,
// }: CanvasMouseMove) => {
//   // if selected shape is freeform, return
//   if (!isDrawing.current) return;
//   if (selectedShapeRef.current === "freeform") return;

//   canvas.isDrawingMode = false;

//   // get pointer coordinates
//   const pointer = canvas.getPointer(options.e);

//   // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
//   // calculate shape dimensions based on pointer coordinates
//   switch (selectedShapeRef?.current) {
//     case "rectangle":
//       shapeRef.current?.set({
//         width: pointer.x - (shapeRef.current?.left || 0),
//         height: pointer.y - (shapeRef.current?.top || 0),
//       });
//       break;

//     case "circle":
//       shapeRef.current.set({
//         radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
//       });
//       break;

//     case "triangle":
//       shapeRef.current?.set({
//         width: pointer.x - (shapeRef.current?.left || 0),
//         height: pointer.y - (shapeRef.current?.top || 0),
//       });
//       break;

//     default:
//       break;
//   }

//   // render objects on canvas
//   // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
//   canvas.renderAll();

//   // sync shape in storage
//   if (shapeRef.current?.objectId) {
//     syncShapeInStorage(shapeRef.current);
//   }
// };

// export const handlePathCreated = ({
//   options,
//   syncShapeInStorage,
// }: CanvasPathCreated) => {
//   // get path object
//   const path = options.path;
//   if (!path) return;

//   // set unique id to path object
//   path.set({
//     objectId: nanoid(),
//   });

//   // sync shape in storage
//   syncShapeInStorage(path);
// };

// export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
//   const canvasElement = document.getElementById("canvas");
//   if (!canvasElement) return;

//   if (!canvas) return;

//   canvas.setDimensions({
//     width: canvasElement.clientWidth,
//     height: canvasElement.clientHeight,
//   });
// };
