"use client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  useMutation,
  useOthersMapped,
  useRedo,
  useStorage,
  useUndo,
} from "@/liveblocks.config";

import Toolbar from "../toolbar";
import { ActiveElement, Attributes } from "@/types/types";
import { defaultNavElement } from "@/constants";
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasSelectionCreated,
  handleCanvaseMouseMove,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleKeyUp, handleKeyUp2 } from "@/lib/key-events";
import { updateSelectedObjectsColor } from "@/lib/shapes";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);

  const shapeRef = useRef<fabric.Object | null>(null);

  const selectedShapeRef = useRef<string | null>(null);

  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  const undo = useUndo();
  const redo = useRedo();

  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] =
    useState(false);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: <div />,
  });

  const lastUsedColorRef = useRef("#000000");
  const strokeWidthRef = useRef(5);

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    // if the passed object is null, return
    if (!object) return;
    const { objectId } = object;

    /**
     * Turn Fabric object (kclass) into JSON format so that we can store it in the
     * key-value store.
     */
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");

    canvasObjects.set(objectId, shapeData);
  }, []);

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    if (fabricRef.current) {
      if (elem === defaultNavElement) {
        fabricRef.current.isDrawingMode = false;
      }
    }

    switch (elem?.value) {
      case "reset":
        // clear the storage
        // deleteAllShapes();
        // clear the canvas
        fabricRef.current?.clear();
        // set "select" as the active element
        setActiveElement(defaultNavElement);
        break;

      // delete the selected shape from the canvas
      case "delete":
        // delete it from the canvas
        // handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        // set "select" as the active element
        setActiveElement(defaultNavElement);
        break;

      // // upload an image to the canvas
      // case "image":
      //   // trigger the click event on the input element which opens the file dialog
      //   imageInputRef.current?.click();
      //   /**
      //    * set drawing mode to false
      //    * If the user is drawing on the canvas, we want to stop the
      //    * drawing mode when clicked on the image item from the dropdown.
      //    */
      //   isDrawing.current = false;

      //   if (fabricRef.current) {
      //     // disable the drawing mode of canvas
      //     fabricRef.current.isDrawingMode = false;
      //   }
      //   break;

      // for comments, do nothing
      case "comments":
        break;

      default:
        // set the selected shape to the selected element
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({
      fabricRef,
      canvasRef,
    });

    setActiveElement(defaultNavElement);

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        canvas,
        options,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        lastUsedColorRef,
        strokeWidthRef,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        activeObjectRef,
        canvas,
        isDrawing,
        selectedShapeRef,
        setActiveElement,
        syncShapeInStorage,
        shapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    // ! TODO: Extend this to adjust the attributes with floating toolbar
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    canvas.on("selection:cleared", () => {
      setSelectedObjects([]);
      console.log("selection cleared");
    });

    canvas.on("selection:updated", (options) => {
      console.log("selection updated");
      const newObjects = options.selected as fabric.Object[];
      setSelectedObjects((prevObjects) => [...prevObjects, ...newObjects]);
      console.log("Selection updated: ", selectedObjects.length);
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keyup", (e) => {
      handleKeyUp({
        e,
        canvas,
        syncShapeInStorage,
        deleteShapeFromStorage,
        redo,
        undo,
        // lastUsedColor: lastUsedColorRef.current,
      });
    });

    return () => {
      console.log("cleanup function called");
      canvas.dispose();
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
      window.removeEventListener("keyup", (e) => {
        handleKeyUp({
          e,
          canvas,
          syncShapeInStorage,
          deleteShapeFromStorage,
          redo,
          undo,
          // lastUsedColor: lastUsedColorRef.current,
        });
      });
    };
  }, [canvasRef]);

  // useEffect(() => {
  //   if (fabricRef.current) {
  //     updateSelectedObjectsColor({
  //       canvas: fabricRef.current,
  //       lastUsedColor: lastUsedColorRef.current,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <div
      className="relative flex flex-col h-[calc(50%)] w-full flex-1 items-center justify-center bg-gray-100 overflow-hidden rounded-md"
      id="canvas"
    >
      {" "}
      <canvas ref={canvasRef} className="rounded-md" />
      <Toolbar
        // strokeWidth={strokeWidth}
        // setStrokeWidth={setStrokeWidth}
        canvas={fabricRef.current}
        lastUsedColorRef={lastUsedColorRef}
        strokeWidthRef={strokeWidthRef}
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
      />
    </div>
  );
}
