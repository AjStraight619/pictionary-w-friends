// "use client";

// import {
//   handleCanvasMouseDown,
//   handleCanvasMouseUp,
//   handleCanvasObjectModified,
//   handleCanvasObjectMoving,
//   handleCanvasObjectScaling,
//   handleCanvasSelectionCreated,
//   handleCanvasZoom,
//   handleCanvaseMouseMove,
//   handlePathCreated,
//   handleResize,
//   initializeFabric,
//   renderCanvas,
// } from "@/lib/canvas";
// import { useMutation, useStorage } from "@/liveblocks.config";
// import { fabric } from "fabric";
// import { useEffect, useRef, useState } from "react";
// import { defaultNavElement } from "@/constants";

// import { ActiveElement, Attributes } from "@/types/types";

// export default function Canvas() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const isDrawing = useRef(false);

//   const shapeRef = useRef<fabric.Object | null>(null);

//   const selectedShapeRef = useRef<string | null>("freeform");

//   const activeObjectRef = useRef<fabric.Object | null>(null);
//   const isEditingRef = useRef(false);

//   const canvasObjects = useStorage((root) => root.canvasObjects);

//   /**
//    * imageInputRef is a reference to the input element that we use to upload
//    * an image to the canvas.
//    *
//    * We want image upload to happen when clicked on the image item from the
//    * dropdown menu. So we're using this ref to trigger the click event on the
//    * input element when the user clicks on the image item from the dropdown.
//    */
//   const imageInputRef = useRef<HTMLInputElement>(null);

//   /**
//    * activeElement is an object that contains the name, value and icon of the
//    * active element in the navbar.
//    */
//   const [activeElement, setActiveElement] = useState<ActiveElement>({
//     name: "",
//     value: "",
//     icon: "",
//   });

//   /**
//    * elementAttributes is an object that contains the attributes of the selected
//    * element in the canvas.
//    *
//    * We use this to update the attributes of the selected element when the user
//    * is editing the width, height, color etc properties/attributes of the
//    * object.
//    */
//   const [elementAttributes, setElementAttributes] = useState<Attributes>({
//     width: "",
//     height: "",
//     fontSize: "",
//     fontFamily: "",
//     fontWeight: "",
//     fill: "#aabbcc",
//     stroke: "#aabbcc",
//   });

//   const syncShapeInStorage = useMutation(({ storage }, object) => {
//     // if the passed object is null, return
//     if (!object) return;
//     const { objectId } = object;

//     /**
//      * Turn Fabric object (kclass) into JSON format so that we can store it in the
//      * key-value store.
//      */
//     const shapeData = object.toJSON();
//     shapeData.objectId = objectId;

//     const canvasObjects = storage.get("canvasObjects");
//     /**
//      * set is a method provided by Liveblocks that allows you to set a value
//      *
//      * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
//      */
//     canvasObjects.set(objectId, shapeData);
//   }, []);

//   /**
//    * deleteShapeFromStorage is a mutation that deletes a shape from the
//    * key-value store of liveblocks.
//    * useMutation is a hook provided by Liveblocks that allows you to perform
//    * mutations on liveblocks data.
//    *
//    * useMutation: https://liveblocks.io/docs/api-reference/liveblocks-react#useMutation
//    * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
//    * get: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.get
//    *
//    * We're using this mutation to delete a shape from the key-value store when
//    * the user deletes a shape from the canvas.
//    */
//   const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
//     /**
//      * canvasObjects is a Map that contains all the shapes in the key-value.
//      * Like a store. We can create multiple stores in liveblocks.
//      *
//      * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
//      */
//     const canvasObjects = storage.get("canvasObjects");
//     canvasObjects.delete(shapeId);
//   }, []);

//   /**
//    * deleteAllShapes is a mutation that deletes all the shapes from the
//    * key-value store of liveblocks.
//    *
//    * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
//    * get: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.get
//    *
//    * We're using this mutation to delete all the shapes from the key-value store when the user clicks on the reset button.
//    */
//   //   const deleteAllShapes = useMutation(({ storage }) => {
//   //     // get the canvasObjects store
//   //     const canvasObjects = storage.get("canvasObjects");

//   //     // if the store doesn't exist or is empty, return
//   //     if (!canvasObjects || canvasObjects.size === 0) return true;

//   //     // delete all the shapes from the store
//   //     for (const [key, value] of canvasObjects.entries()) {
//   //       canvasObjects.delete(key);
//   //     }

//   //     // return true if the store is empty
//   //     return canvasObjects.size === 0;
//   //   }, []);

//   /**
//    * syncShapeInStorage is a mutation that syncs the shape in the key-value
//    * store of liveblocks.
//    *
//    * We're using this mutation to sync the shape in the key-value store
//    * whenever user performs any action on the canvas such as drawing, moving
//    * editing, deleting etc.
//    */
//   //   const syncShapeInStorage = useMutation(({ storage }, object) => {
//   //     // if the passed object is null, return
//   //     if (!object) return;
//   //     const { objectId } = object;

//   //     /**
//   //      * Turn Fabric object (kclass) into JSON format so that we can store it in the
//   //      * key-value store.
//   //      */
//   //     const shapeData = object.toJSON();
//   //     shapeData.objectId = objectId;

//   //     const canvasObjects = storage.get("canvasObjects");
//   //     /**
//   //      * set is a method provided by Liveblocks that allows you to set a value
//   //      *
//   //      * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
//   //      */
//   //     canvasObjects.set(objectId, shapeData);
//   //   }, []);

//   /**
//    * Set the active element in the navbar and perform the action based
//    * on the selected element.
//    *
//    * @param elem
//    */
//   const handleActiveElement = (elem: ActiveElement) => {
//     setActiveElement(elem);

//     switch (elem?.value) {
//       // delete all the shapes from the canvas
//       case "reset":
//         // clear the storage
//         // deleteAllShapes();
//         // clear the canvas
//         fabricRef.current?.clear();
//         // set "select" as the active element
//         setActiveElement(defaultNavElement);
//         break;

//       // delete the selected shape from the canvas
//       case "delete":
//         // delete it from the canvas
//         // handleDelete(fabricRef.current as any, deleteShapeFromStorage);
//         // set "select" as the active element
//         setActiveElement(defaultNavElement);
//         break;

//       // upload an image to the canvas
//       case "image":
//         // trigger the click event on the input element which opens the file dialog
//         imageInputRef.current?.click();
//         /**
//          * set drawing mode to false
//          * If the user is drawing on the canvas, we want to stop the
//          * drawing mode when clicked on the image item from the dropdown.
//          */
//         isDrawing.current = false;

//         if (fabricRef.current) {
//           // disable the drawing mode of canvas
//           fabricRef.current.isDrawingMode = false;
//         }
//         break;

//       // for comments, do nothing
//       case "comments":
//         break;

//       default:
//         // set the selected shape to the selected element
//         selectedShapeRef.current = elem?.value as string;
//         break;
//     }
//   };

//   useEffect(() => {
//     // initialize the fabric canvas
//     const canvas = initializeFabric({
//       canvasRef,
//       fabricRef,
//     });

//     /**
//      * listen to the mouse down event on the canvas which is fired when the
//      * user clicks on the canvas
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("mouse:down", (options) => {
//       handleCanvasMouseDown({
//         options,
//         canvas,
//         selectedShapeRef,
//         isDrawing,
//         shapeRef,
//       });
//     });

//     /**
//      * listen to the mouse move event on the canvas which is fired when the
//      * user moves the mouse on the canvas
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("mouse:move", (options) => {
//       handleCanvaseMouseMove({
//         options,
//         canvas,
//         isDrawing,
//         selectedShapeRef,
//         shapeRef,
//         syncShapeInStorage,
//       });
//     });

//     /**
//      * listen to the mouse up event on the canvas which is fired when the
//      * user releases the mouse on the canvas
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("mouse:up", () => {
//       handleCanvasMouseUp({
//         canvas,
//         isDrawing,
//         shapeRef,
//         activeObjectRef,
//         selectedShapeRef,
//         syncShapeInStorage,
//         setActiveElement,
//       });
//     });

//     /**
//      * listen to the path created event on the canvas which is fired when
//      * the user creates a path on the canvas using the freeform drawing
//      * mode
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("path:created", (options) => {
//       handlePathCreated({
//         options,
//         syncShapeInStorage,
//       });
//     });

//     /**
//      * listen to the object modified event on the canvas which is fired
//      * when the user modifies an object on the canvas. Basically, when the
//      * user changes the width, height, color etc properties/attributes of
//      * the object or moves the object on the canvas.
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("object:modified", (options) => {
//       handleCanvasObjectModified({
//         options,
//         syncShapeInStorage,
//       });
//     });

//     /**
//      * listen to the object moving event on the canvas which is fired
//      * when the user moves an object on the canvas.
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas?.on("object:moving", (options) => {
//       handleCanvasObjectMoving({
//         options,
//       });
//     });

//     /**
//      * listen to the selection created event on the canvas which is fired
//      * when the user selects an object on the canvas.
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("selection:created", (options) => {
//       handleCanvasSelectionCreated({
//         options,
//         isEditingRef,
//         setElementAttributes,
//       });
//     });

//     /**
//      * listen to the scaling event on the canvas which is fired when the
//      * user scales an object on the canvas.
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("object:scaling", (options) => {
//       handleCanvasObjectScaling({
//         options,
//         setElementAttributes,
//       });
//     });

//     /**
//      * listen to the mouse wheel event on the canvas which is fired when
//      * the user scrolls the mouse wheel on the canvas.
//      *
//      * Event inspector: http://fabricjs.com/events
//      * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
//      */
//     canvas.on("mouse:wheel", (options) => {
//       handleCanvasZoom({
//         options,
//         canvas,
//       });
//     });

//     /**
//      * listen to the resize event on the window which is fired when the
//      * user resizes the window.
//      *
//      * We're using this to resize the canvas when the user resizes the
//      * window.
//      */
//     window.addEventListener("resize", () => {
//       handleResize({
//         canvas: fabricRef.current,
//       });
//     });

//     /**
//      * listen to the key down event on the window which is fired when the
//      * user presses a key on the keyboard.
//      *
//      * We're using this to perform some actions like delete, copy, paste, etc when the user presses the respective keys on the keyboard.
//      */
//     // window.addEventListener("keydown", (e) =>
//     //   handleKeyDown({
//     //     e,
//     //     canvas: fabricRef.current,
//     //     undo,
//     //     redo,
//     //     syncShapeInStorage,
//     //     deleteShapeFromStorage,
//     //   })
//     // );

//     // dispose the canvas and remove the event listeners when the component unmounts
//     return () => {
//       /**
//        * dispose is a method provided by Fabric that allows you to dispose
//        * the canvas. It clears the canvas and removes all the event
//        * listeners
//        *
//        * dispose: http://fabricjs.com/docs/fabric.Canvas.html#dispose
//        */
//       canvas.dispose();

//       // remove the event listeners
//       window.removeEventListener("resize", () => {
//         handleResize({
//           canvas: null,
//         });
//       });

//       //   window.removeEventListener("keydown", (e) =>
//       //     handleKeyDown({
//       //       e,
//       //       canvas: fabricRef.current,
//       //       undo,
//       //       redo,
//       //       syncShapeInStorage,
//       //       deleteShapeFromStorage,
//       //     })
//       //   );
//     };
//   }, [canvasRef, syncShapeInStorage, deleteShapeFromStorage]); // run this effect only once when the component mounts and the canvasRef changes

//   // render the canvas when the canvasObjects from live storage changes
//   useEffect(() => {
//     renderCanvas({
//       fabricRef,
//       canvasObjects,
//       activeObjectRef,
//     });
//   }, [canvasObjects]);

//   return (
//     <div
//       className="relative flex h-full w-full flex-1 items-center justify-center"
//       id="canvas"
//     >
//       <canvas ref={canvasRef} className="bg-gray-100 rounded-md" />
//     </div>
//   );
// }
