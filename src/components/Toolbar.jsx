import { Image as FabricImage } from "fabric"

export default function Toolbar({ canvas }) {

  // 🗑 ปุ่มลบ
  const handleDelete = () => {
    const active = canvas.getActiveObjects()
    if (!active || active.length === 0) return

    active.forEach(obj => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  // 🖼 import รูป
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์ใหญ่เกิน 5MB")
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      const img = await FabricImage.fromURL(reader.result)

      const maxW = canvas.getWidth() * 0.7
      const maxH = canvas.getHeight() * 0.7

      const scale = Math.min(
        maxW / img.width,
        maxH / img.height
      )

      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale
      })

      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.centerObject(img)
      canvas.bringObjectToFront(img)
      canvas.renderAll()
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="flex gap-2 p-2 border-b bg-white">

      <label className="bg-pink-500 text-white px-3 py-1 rounded cursor-pointer">
        Import Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImport}
        />
      </label>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>

    </div>
  )
}
