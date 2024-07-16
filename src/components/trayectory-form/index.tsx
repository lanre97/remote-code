'use client'

import { useState } from "react";

export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface TrayectoryFormProps {
  onChange?: (trayectory: Point[]) => void;
}

export function TrayectoryForm(props: TrayectoryFormProps) {
  const [trayectory, setTrayectory] = useState<Point[]>([]);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);

  const addPoint = () => {
    const newPoint = { x, y, z };
    setTrayectory([...trayectory, newPoint]);
    if (props.onChange) {
      props.onChange([...trayectory, newPoint]);
    }
    setX(0);
    setY(0);
    setZ(0);
  }

  const removePoint = (index: number) => {
    setTrayectory(trayectory.filter((_, i) => i !== index));
  }

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <input className="w-16 rounded bg-slate-600 text-center text-sm" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
        <input className="w-16 rounded bg-slate-600 text-center text-sm"  type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
        <input className="w-16 rounded bg-slate-600 text-center text-sm"  type="number" value={z} onChange={(e) => setZ(Number(e.target.value))} />
        <button className="bg-blue-600 px-4 rounded" onClick={addPoint}>Add</button>
      </div>
      <table className="w-[300px] mt-4 text-center">
        <thead className="bg-slate-700 text-white text-center">
          <tr>
            <th className="w-20">X</th>
            <th className="w-20">Y</th>
            <th className="w-20">Z</th>
            <th>{"-"}</th>
          </tr>
        </thead>
        <tbody>
          {trayectory.map((point, index) => (
            <tr key={index}>
              <td>{point.x}</td>
              <td>{point.y}</td>
              <td>{point.z}</td>
              <td>
                <button className="text-red-500" onClick={() => removePoint(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}