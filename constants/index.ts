import React from "react";

import {
  PencilIcon,
  RectangleHorizontalIcon,
  CircleIcon,
  TriangleIcon,
  MousePointer2Icon,
} from "lucide-react";

export const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const toolbarElements = [
  {
    icon: React.createElement(PencilIcon, {
      size: 20,
    }),
    name: "Free Drawing",
    value: "freeform",
  },
  {
    icon: React.createElement(RectangleHorizontalIcon, {
      size: 20,
    }),
    name: "Rectangle",
    value: "rectangle",
  },
  {
    icon: React.createElement(CircleIcon, {
      size: 20,
    }),
    name: "Circle",
    value: "circle",
  },

  {
    icon: React.createElement(TriangleIcon, {
      size: 20,
    }),
    name: "Triangle",
    value: "triangle",
  },
];

export const defaultNavElement = {
  icon: React.createElement(MousePointer2Icon, {
    size: 20,
  }),
  name: "Selection Tool",
  value: "selection",
};

export const alignmentOptions = [
  { value: "left", label: "Align Left", icon: "/assets/align-left.svg" },
  {
    value: "horizontalCenter",
    label: "Align Horizontal Center",
    icon: "/assets/align-horizontal-center.svg",
  },
  { value: "right", label: "Align Right", icon: "/assets/align-right.svg" },
  { value: "top", label: "Align Top", icon: "/assets/align-top.svg" },
  {
    value: "verticalCenter",
    label: "Align Vertical Center",
    icon: "/assets/align-vertical-center.svg",
  },
  { value: "bottom", label: "Align Bottom", icon: "/assets/align-bottom.svg" },
];

export const shortcuts = [
  {
    key: "1",
    name: "Chat",
    shortcut: "/",
  },
  {
    key: "2",
    name: "Undo",
    shortcut: "⌘ + Z",
  },
  {
    key: "3",
    name: "Redo",
    shortcut: "⌘ + Y",
  },
  {
    key: "4",
    name: "Reactions",
    shortcut: "E",
  },
];
