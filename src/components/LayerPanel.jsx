import { useEffect, useState } from "react"

export default function LayerPanel({ canvas }) {
  const [layers, setLayers] = useState([])

  const isNailBase = (o) => {
    return (
      o.type === "rect" &&
      o.selectable === false &&
      o.evented === false
    )
  }

  const refresh = () => {
    if (!canvas) return

    const objs = canvas.getObjects()

    // ⭐ ตัด nail base ออกตัวเดียว
    const userObjs = objs.filter(o => !isNailBase(o))

    userObjs.forEach((o, i) => {
      if (!o.data) o.data = {}
      if (!o.data.name) o.data.name = `${o.type} ${i + 1}`
    })

    setLayers([...userObjs].reverse())
  }

  useEffect(() => {
    if (!canvas) return

    refresh()

    // fabric v6 — ใช้ 3 event นี้พอ
    canvas.on("object:added", refresh)
    canvas.on("object:removed", refresh)
    canvas.on("object:modified", refresh)

    // fallback sync (กัน async image load)
    const t = setTimeout(refresh, 300)

    return () => {
      canvas.off("object:added", refresh)
      canvas.off("object:removed", refresh)
      canvas.off("object:modified", refresh)
      clearTimeout(t)
    }
  }, [canvas])

  const select = (o) => {
    canvas.setActiveObject(o)
    canvas.renderAll()
  }

  const toggleVisible = (o) => {
    o.visible = !o.visible
    canvas.renderAll()
    refresh()
  }

  const toggleLock = (o) => {
    o.selectable = !o.selectable
    o.evented = !o.evented
    canvas.renderAll()
    refresh()
  }

  const up = (o) => {
    canvas.bringObjectForward(o)
    canvas.renderAll()
    refresh()
  }

  const down = (o) => {
    canvas.sendObjectBackwards(o)
    canvas.renderAll()
    refresh()
  }

  return (
    <div className="w-56 border-l p-2 bg-white overflow-y-auto">
      <h3 className="font-bold mb-2">Layers</h3>

      {layers.length === 0 && (
        <div className="text-gray-400 text-sm">
          No layers yet
        </div>
      )}

      {layers.map((o, i) => (
        <div key={i} className="border p-2 mb-2 rounded text-xs bg-gray-50">

          <div className="font-medium">{o.data?.name}</div>

          <div className="flex gap-1 flex-wrap mt-1">
            <button
              onClick={() => select(o)}
              className="bg-blue-500 text-white px-1 rounded"
            >
              Sel
            </button>

            <button onClick={() => toggleVisible(o)}>👁</button>
            <button onClick={() => toggleLock(o)}>🔒</button>
            <button onClick={() => up(o)}>↑</button>
            <button onClick={() => down(o)}>↓</button>
          </div>
        </div>
      ))}
    </div>
  )
}
