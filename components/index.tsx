import Lobby from "@/components/lobby/index";
import Chat from "./chat";
import Canvas from "./canvas/canvas";

export const Live = () => {
  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex items-center gap-x-2 p-2 h-full">
        <Lobby />
        <Canvas />
        <Chat />
      </div>
    </div>
  );
};
