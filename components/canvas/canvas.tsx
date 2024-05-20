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
// import {
//   handleCanvasMouseDown,
//   handlePathCreated,
//   handleResize,
//   handleCanvasMouseUp,
//   handleCanvaseMouseMove,
//   handleSelection,
// } from "@/lib/canvas2";
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
import { handleKeyDown } from "@/lib/key-events";

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

  const [strokeWidth, setStrokeWidth] = useState(5);

  const [lastUsedColor, setLastUsedColor] = useState("#000000");

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: <div />,
  });

  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    isDrawing: other.presence.isDrawing,
  }));

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

  const updateSelectedObjectsColor = (color: string) => {
    if (fabricRef.current) {
      const selectedObjects = fabricRef.current.getActiveObjects();
      selectedObjects.forEach((obj) => {
        if (obj instanceof fabric.Path) {
          obj.set("stroke", color);
        } else {
          obj.set("fill", color);
          obj.set("stroke", color);
        }
      });
      fabricRef.current.renderAll();
    }
  };

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

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        canvas,
        options,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        // lastUsedColor,
        // strokeWidth,
      });
    });

    canvas.on("mouse:up", (options) => {
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
      const newObjects = options.selected as fabric.Object[];
      setSelectedObjects((prevObjects) => [...prevObjects, ...newObjects]);
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keydown", (e) => {
      handleKeyDown({
        e,
        canvas,
        syncShapeInStorage,
        deleteShapeFromStorage,
        redo,
        undo,
      });
    });

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
      window.removeEventListener("keydown", (e) => {
        handleKeyDown({
          e,
          canvas,
          syncShapeInStorage,
          deleteShapeFromStorage,
          redo,
          undo,
        });
      });
    };
  }, [canvasRef, syncShapeInStorage]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.color = lastUsedColor;
      updateSelectedObjectsColor(lastUsedColor);
    }
  }, [lastUsedColor]);

  // const deleteSelectedObjects = () => {
  //   if (fabricRef.current) {
  //     fabricRef.current.getActiveObjects().forEach((obj) => {
  //       fabricRef?.current?.remove(obj);
  //     });
  //     fabricRef.current.discardActiveObject().renderAll();
  //     setSelectedObjects([]);
  //   }
  // };

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  const onPointerMove = useMutation(({ setMyPresence, self }) => {}, []);

  return (
    <div
      className="relative flex flex-col h-[calc(50%)] w-full flex-1 items-center justify-center bg-gray-100 overflow-hidden rounded-md"
      id="canvas"
      onPointerMove={onPointerMove}
    >
      <canvas ref={canvasRef} className="rounded-md" />
      <Toolbar
        // strokeWidth={strokeWidth}
        // setStrokeWidth={setStrokeWidth}
        lastUsedColor={lastUsedColor}
        setLastUsedColor={setLastUsedColor}
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
      />
    </div>
  );
}
