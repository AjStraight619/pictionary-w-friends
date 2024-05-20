// export type CanvasState =
//   | {
//       mode: CanvasMode.None;
//     }
//   | {
//       mode: CanvasMode.SelectionNet;
//       origin: Point;
//       current?: Point;
//     }
//   | {
//       mode: CanvasMode.Translating;
//       current: Point;
//     }
//   | {
//       mode: CanvasMode.Inserting;
//       layerType: LayerType.Ellipse | LayerType.Rectangle;
//     }
//   | {
//       mode: CanvasMode.Pencil;
//     }
//   | {
//       mode: CanvasMode.Pressing;
//       origin: Point;
//     }
//   | {
//       mode: CanvasMode.Resizing;
//       initialBounds: XYWH;
//       corner: Side;
//     };

export enum CanvasMode {
  /**
   * Default canvas mode. Nothing is happening.
   */
  None,
  /**
   * When the user's pointer is pressed
   */
  Pressing,
  /**
   * When the user is selecting multiple layers at once
   */
  SelectionNet,
  /**
   * When the user is moving layers
   */
  Translating,
  /**
   * When the user is going to insert a Rectangle or an Ellipse
   */
  Inserting,
  /**
   * When the user is resizing a layer
   */
  Resizing,
  /**
   * When the pencil is activated
   */
  Pencil,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.Pencil;
    };

export type CanvasMouseDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasSelection = {
  canvas: fabric.Canvas;
  activeObjects: fabric.Object[];
  syncShapeInStorage: (shape: fabric.Object) => void;
  lastUsedColor: string;
};
