'use client'

import { CodeEditor } from "@/components/code-editor";
import RobotArmSimulation from "@/components/robot-simulation";
import { Point, TrayectoryForm } from "@/components/trayectory-form";
import { NotificationsContext } from "@/contexts/notifications";
import { useDebounce } from "@/hooks/useDebounce";
import { useMqtt } from "@/hooks/useMqtt";
import { useContext, useEffect, useRef, useState } from "react";

enum RobotControlMethods {
  manual = 'manual',
  code = 'code',
  trayectory = 'trayectory'
}

export default function Home() {
  const robotRef = useRef<HTMLIFrameElement>();
  const [robotControlMethod, setRobotControlMethod] = useState<RobotControlMethods>(RobotControlMethods.manual);
  const codeRef = useRef<string>();
  const { addNotification } = useContext(NotificationsContext);
  const {
    subscribe,
    publish
  } = useMqtt();
  const [extended, setExtended] = useDebounce(1, 500);
  const [vertical, setVertical] = useDebounce(1, 500);
  const [rotated, setRotated] = useDebounce(0, 500);
  const [trayectory, setTrayectory] = useState<Point[]>([]);

  useEffect(() => {
    mapRobotToCoordinates(vertical, extended, rotated);
  }, [vertical, extended, rotated]);

  useEffect(() => {
    const unsubscribeToTestCoord = subscribe('test/mapCoordinatesToRobot', (message) => {
      console.log('Message received:', message);
      const { x, y, z } = JSON.parse(message);
      mapCoordinatesToRobot(x, y, z);
    });
    const unsubscribeToTestRawMovement = subscribe('test/mapRobotToCoordinates', (message) => {
      console.log('Message received:', message);
      const { vertical, horizontal, angle } = JSON.parse(message);
      mapRobotToCoordinates(vertical, horizontal, angle);
    });
    const unsubscribeToTestLogs = subscribe('test/logs', (message) => {
      console.info('Message received:', message);
      console.info(message);
    });
    const unsubscribeToRobotCoord = subscribe('robot/mapCoordinatesToRobot', (message) => {
      console.log('Message received:', message);
      const { x, y, z } = JSON.parse(message);
      mapCoordinatesToRobot(x, y, z);
    });
    const unsubscribeToRobotRawMovement = subscribe('robot/mapRobotToCoordinates', (message) => {
      console.log('Message received:', message);
      const { vertical, horizontal, angle } = JSON.parse(message);
      mapRobotToCoordinates(vertical, horizontal, angle);
    });
    const unsubscribeToRobotLogs = subscribe('robot/logs', (message) => {
      console.info('Message received:', message);
      console.info(message);
    });

    return () => {
      if (unsubscribeToTestCoord) {
        unsubscribeToTestCoord();
      }
      if (unsubscribeToTestRawMovement) {
        unsubscribeToTestRawMovement();
      }
      if (unsubscribeToTestLogs) {
        unsubscribeToTestLogs();
      }
      if (unsubscribeToRobotCoord) {
        unsubscribeToRobotCoord();
      }
      if (unsubscribeToRobotRawMovement) {
        unsubscribeToRobotRawMovement();
      }
      if (unsubscribeToRobotLogs) {
        unsubscribeToRobotLogs();
      }
    }
  }, [subscribe]);

  const mapCoordinatesToRobot = (x: number, y: number, z: number) => {
    robotRef.current?.contentWindow?.postMessage({
      method: 'mapCoordinatesToRobot',
      x,
      y,
      z
    }, '*');
  }

  const mapRobotToCoordinates = (verticalHeight: number, extendLength: number, rotationAngle: number) => {
    robotRef.current?.contentWindow?.postMessage({
      method: 'mapRobotToCoordinates',
      targetValues: {
        verticalHeight,
        extendLength,
        rotationAngle
      }
    }, '*');
  }

  const testCode = async () => {
    addNotification({
      type: 'info',
      message: 'Testing code'
    })
    try {
      const res = await fetch('http://localhost:8000/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: codeRef.current
        })
      });
  
      if (res.ok) {
        addNotification({
          type: 'success',
          message: 'Code is working fine'
        });
      } else {
        const data = await res.json();
        addNotification({
          type: 'error',
          message: 'Code is not working: ' + JSON.stringify(data.detail)
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Code is not working: ' + error
      });
    }
  }

  const runCode = async () => {
    addNotification({
      type: 'info',
      message: 'Testing code'
    })
    try {
      const res = await fetch('http://localhost:8000/robot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: codeRef.current
        })
      });
  
      if (res.ok) {
        addNotification({
          type: 'success',
          message: 'Code is working fine'
        });
      } else {
        const data = await res.json();
        addNotification({
          type: 'error',
          message: 'Code is not working: ' + JSON.stringify(data.detail)
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Code is not working: ' + error
      });
    }
  }

  const onSubmitTrayectory = async (trayectory: Point[]) => {
    addNotification({
      type: 'info',
      message: 'Moving robot'
    });
    for(let i = 0; i < trayectory.length; i++) {
      const { x, y, z } = trayectory[i];
      publish('robot/mapCoordinatesToRobot', JSON.stringify({ x, y, z }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    addNotification({
      type: 'success',
      message: 'Robot moved successfully'
    });
  }

  const onSubmitTrayectoryTest = async (trayectory: Point[]) => {
    addNotification({
      type: 'info',
      message: 'Testing robot'
    });
    for(let i = 0; i < trayectory.length; i++) {
      const { x, y, z } = trayectory[i];
      publish('test/mapCoordinatesToRobot', JSON.stringify({ x, y, z }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    addNotification({
      type: 'success',
      message: 'Robot tested successfully'
    });
  }

  return (
    <main className="min-h-full grid md:grid-cols-2 gap-4 grid-cols-1 p-4">
      <div>
        <div className="flex justify-between items-end">
          <nav className="pt-2">
            <button className={
                robotControlMethod === RobotControlMethods.manual?
                "px-2 py-2 border-x border-t rounded-t bg-slate-800 text-sm transition-colors":
                "px-2 py-2 border-x border-t rounded-t text-sm transition-colors"
              }
              onClick={() => setRobotControlMethod(RobotControlMethods.manual)}
            >Manual</button>
            <button className={
                robotControlMethod === RobotControlMethods.trayectory?
                "px-2 py-2 border-x border-t rounded-t bg-slate-800 text-sm transition-colors":
                "px-2 py-2 border-x border-t rounded-t text-sm"
              }
              onClick={() => setRobotControlMethod(RobotControlMethods.trayectory)}
            >Trayectory</button>
            <button className={
                robotControlMethod === RobotControlMethods.code?
                "px-2 py-2 border-x border-t rounded-t bg-slate-800 text-sm transition-colors":
                "px-2 py-2 border-x border-t rounded-t text-sm"
              }
              onClick={() => setRobotControlMethod(RobotControlMethods.code)}
            >Code</button>
          </nav>
          {
            (robotControlMethod === RobotControlMethods.code) || (robotControlMethod === RobotControlMethods.trayectory) ?
            <div className="py-2 flex gap-2">
              <button className="px-4 py-1 border text-sm rounded"onClick={() => {
                if (robotControlMethod === RobotControlMethods.code) {
                  testCode();
                } else {
                  onSubmitTrayectoryTest(trayectory);
                }
              
              }}>Test</button>
              <button className="px-4 py-1 border text-sm rounded border-green-500 bg-green-500"onClick={() => {
                if (robotControlMethod === RobotControlMethods.code) {
                  runCode();
                } else {
                  onSubmitTrayectory(trayectory);
                }
              }}>Run</button>
            </div>:
            null
          }
        </div>
        <div className="w-full border border-slate-500 min-h-[300px]">
          {
            (robotControlMethod === RobotControlMethods.manual)&& (
              <div className="!h-[300px]  md:!h-[700px]">
                <form className="flex flex-col gap-4 p-4 text-sm"
                  onSubmit={
                    (e) => {
                      e.preventDefault();
                      publish('robot/mapRobotToCoordinates', JSON.stringify({
                        vertical: vertical,
                        horizontal: extended,
                        angle: rotated
                      }));
                    }
                  }
                >
                  <label className="flex flex-col gap-1">
                    <span>Vertical Height: {vertical}</span>
                    <input 
                      type="range" 
                      className="border border-slate-500 p-2 rounded" 
                      min={1} 
                      max={2} 
                      step={0.01} 
                      value={vertical}
                      onChange={(e) => {
                        setVertical(Number(e.target.value));
                      }}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span>Extend Length: {extended}</span>
                    <input 
                      type="range" 
                      className="border border-slate-500 p-2 rounded" 
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={extended}
                      onChange={(e) => {
                        setExtended(Number(e.target.value));
                      }}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span>Rotation Angle: {rotated}</span>
                    <input 
                      type="range" 
                      className="border border-slate-500 p-2 rounded" 
                      min={0} 
                      max={360} 
                      step={1} 
                      value={rotated}
                      onChange={(e) => {
                        setRotated(Number(e.target.value));
                      }}
                    />
                  </label>
                  <button className="px-4 py-1 border text-sm rounded border-green-500 bg-green-500"
                    onClick={() => {
                      publish('robot/mapRobotToCoordinates', JSON.stringify({
                        vertical: vertical,
                        horizontal: extended,
                        angle: rotated
                      }));
                      addNotification({
                        type: 'info',
                        message: 'Moving robot'
                      });
                    }}
                  >Move</button>
                </form>
              </div>
            )
 
          }
          {
            robotControlMethod === RobotControlMethods.trayectory && (
              <div className="w-full border border-slate-500 min-h-[300px] h-[300px] aspect-square overflow-y-auto">
              <TrayectoryForm 
                onChange={setTrayectory}
              />
            </div>
            )
          }
          {
            robotControlMethod === RobotControlMethods.code && (
              <CodeEditor onCodeChange={(code)=>{
                if (code) codeRef.current = code;
              }}/>
            )
          }
        </div>
      </div>
      <div className="w-full border border-slate-500 min-h-[400px] aspect-square">
        <RobotArmSimulation config={(robot)=>{
          robotRef.current = robot;
        }}/>
      </div>
    </main>
  );
}
