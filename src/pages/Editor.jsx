import { useState } from "react"
import CanvasEditor from "../components/CanvasEditor"
import Toolbar from "../components/Toolbar"
import Sidebar from "../components/Sidebar"

export default function Editor() {
  const [canvas, setCanvas] = useState(null)

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {canvas && <Toolbar canvas={canvas} />}

        <div className="flex justify-center items-center flex-1">
          <CanvasEditor onReady={setCanvas} />
        </div>
      </div>
    </div>
  )
}
