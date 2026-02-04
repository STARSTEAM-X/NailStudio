import { useEffect, useRef } from "react"
import { Canvas, Rect } from "fabric"

export default function CanvasEditor({ onReady }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      width: 300,
      height: 500,
      backgroundColor: "#fdf2f8",
    })

    const nail = new Rect({
      width: 200,
      height: 380,
      rx: 80,
      ry: 80,
      fill: "#ffe4e6",
      left: 50,
      top: 60,
      selectable: false,
    })

    canvas.add(nail)
    canvas.sendObjectToBack(nail)

    onReady(canvas)
    return () => canvas.dispose()
  }, [])

  return <canvas ref={canvasRef} />
}
