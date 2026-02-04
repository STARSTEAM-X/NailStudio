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

    // ===== undo history =====
    let history = []
    let index = -1

    const save = () => {
      const json = canvas.toJSON(["data"])
      history = history.slice(0, index + 1)
      history.push(json)
      index++
    }

    const undo = () => {
      if (index <= 0) return
      index--
      canvas.loadFromJSON(history[index], () => canvas.renderAll())
    }

    const redo = () => {
      if (index >= history.length - 1) return
      index++
      canvas.loadFromJSON(history[index], () => canvas.renderAll())
    }

    canvas.undo = undo
    canvas.redo = redo

    // nail base
    const nail = new Rect({
      width: 200,
      height: 380,
      rx: 80,
      ry: 80,
      fill: "#ffe4e6",
      left: 50,
      top: 60,
      selectable: false,
      // evented: false,
      originX: "center",
      originY: "center",
    })

    canvas.add(nail)
    canvas.centerObject(nail)
    canvas.sendObjectToBack(nail)

    save()

    canvas.on("object:added", save)
    canvas.on("object:removed", save)
    canvas.on("object:modified", save)

    // keyboard delete
    const key = (e) => {
      if (e.key !== "Delete") return
      const objs = canvas.getActiveObjects()
      objs.forEach(o => canvas.remove(o))
      canvas.discardActiveObject()
      canvas.renderAll()
    }

    window.addEventListener("keydown", key)

    onReady(canvas)

    return () => {
      window.removeEventListener("keydown", key)
      canvas.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} />
}
