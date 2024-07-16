'use client'

import { FC, useEffect, useRef } from "react";

interface Props {
  config: (iframe: HTMLIFrameElement) => void;
}
const RobotArmSimulation: FC<Props> = (props) => {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (ref.current) {
      props.config(ref.current);
    }
  }, [props.config, props]);
  return (
    <iframe src="/robot.html" className="w-full h-full" title="Robot Arm Simulation" ref={ref}></iframe>
  );
};

export default RobotArmSimulation;