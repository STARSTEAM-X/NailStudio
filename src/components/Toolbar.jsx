import { Textbox } from "fabric"

export default function Toolbar({ canvas }) {
  const addText = () => {
    const text = new Textbox("Nail Style", {
      left: 80,
      top: 200,
      fontSize: 28,
      fill: "#be185d",
    })
    canvas.add(text)
  }
    const removeObject = () => {
    const obj = canvas.getActiveObject()
    if (obj) {
        canvas.remove(obj)
    }
    }
  return (
    <div>
        <input
        type="color"
        onChange={(e) => {
            const obj = canvas.getActiveObject()
            if (obj) {
            obj.set("fill", e.target.value)
            canvas.renderAll()
            }
        }}
        className="h-8 w-8 cursor-pointer"
        />
        <button
        onClick={addText}
        className="px-3 py-1 rounded-md bg-pink-500 text-white text-sm hover:bg-pink-600">
        Add Text
        </button>
            <button onClick={removeObject} className="btn px-3 py-1 rounded-md bg-pink-500 text-white text-sm hover:bg-pink-600"> Delete </button>
    </div>
  )
}
