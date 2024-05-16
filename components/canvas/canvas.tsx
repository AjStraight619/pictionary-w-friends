"use client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useMutation, useOthersMapped, useStorage } from "@/liveblocks.config";
import {
  handleCanvasMouseDown,
  handlePathCreated,
  handleResize,
} from "@/lib/canvas2";
import Toolbar from "../toolbar";
import { handleCanvasMouseUp, handleCanvaseMouseMove } from "@/lib/canvas";
import { ActiveElement } from "@/types/types";
import { defaultNavElement } from "@/constants";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);

  const shapeRef = useRef<fabric.Object | null>(null);

  const selectedShapeRef = useRef<string | null>(null);

  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [lastUsedColor, setLastUsedColor] = useState("");

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

  const syncShapeInStorage = useMutation(() => {}, []);

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

  const initializeFabric = ({
    fabricRef,
    canvasRef,
  }: {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  }) => {
    // get canvas element
    const canvasElement = document.getElementById("canvas");

    // create fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasElement?.clientWidth,
      height: canvasElement?.clientHeight,
    });

    // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
    fabricRef.current = canvas;

    return canvas;
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
      setSelectedObjects(canvas.getActiveObjects());
      console.log("selection created", canvas.getActiveObjects());
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        deleteSelectedObjects();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef, syncShapeInStorage]);

  const deleteSelectedObjects = () => {
    if (fabricRef.current) {
      fabricRef.current.getActiveObjects().forEach((obj) => {
        fabricRef?.current?.remove(obj);
      });
      fabricRef.current.discardActiveObject().renderAll();
      setSelectedObjects([]);
    }
  };

  const onPointerMove = useMutation(({ setMyPresence, self }) => {}, []);

  return (
    <div
      className="relative flex flex-col h-[calc(50%)] w-full flex-1 items-center justify-center bg-gray-100 overflow-hidden rounded-md"
      id="canvas"
      onPointerMove={onPointerMove}
    >
      <canvas ref={canvasRef} className="rounded-md" />
      <Toolbar
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
      />
    </div>
  );
}
