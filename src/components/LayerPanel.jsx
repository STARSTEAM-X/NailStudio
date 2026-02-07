import { useEffect, useState } from "react"

export default function LayerPanel({ canvas }) {
  const [layers, setLayers] = useState([])
  const [editingObj, setEditingObj] = useState(null)
  const [tempName, setTempName] = useState("")

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

    canvas.on("object:added", refresh)
    canvas.on("object:removed", refresh)
    canvas.on("object:modified", refresh)

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

  // ✏️ rename
  const startRename = (o) => {
    setEditingObj(o)
    setTempName(o.data?.name || "")
  }

  const commitRename = (o) => {
    if (!o.data) o.data = {}
    o.data.name = tempName || "Layer"
    setEditingObj(null)
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

          {/* 📝 rename UI */}
          {editingObj === o ? (
            <input
              autoFocus
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={() => commitRename(o)}
              onKeyDown={e => {
                if (e.key === "Enter") commitRename(o)
              }}
              className="border px-1 w-full mb-1"
            />
          ) : (
            <div
              onDoubleClick={() => startRename(o)}
              className="font-medium cursor-text"
            >
              {o.data?.name}
            </div>
          )}

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