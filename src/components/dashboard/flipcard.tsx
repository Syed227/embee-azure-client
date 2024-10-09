import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import PieComponent from './pieChartComponent';
import { QueryData } from '../consolidated/consolidatedCSP';

type Props = {
  EAdata: QueryData[];
  CSPdata: QueryData[];
};

const CardContent = ({ flipped, EAdata, CSPdata }: { flipped: boolean; EAdata: QueryData[]; CSPdata: QueryData[] }) => {
  return (
    <mesh rotation={[0, flipped ? Math.PI : 0, 0]}>
      <boxGeometry args={[3, 3, 0.1]} />
      <meshBasicMaterial color="white" />
      <Html position={[0, 0, 0.06]} style={{ transform: 'translateX(-50%) translateY(-50%)' }}>
        {flipped ? (
          <div style={{ width: '100%', height: '100%' }}>
            <PieComponent data={CSPdata} dataname='CSP Data' />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <PieComponent data={EAdata} dataname='EA Data' />
          </div>
        )}
      </Html>
    </mesh>
  );
};

const FlipCard = ({ EAdata, CSPdata }: Props) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="bg-white w-1/3 shadow-lg h-96 p-1 m-2 relative cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <Canvas>
        <ambientLight />
        <CardContent flipped={flipped} EAdata={EAdata} CSPdata={CSPdata} />
      </Canvas>
    </div>
  );
};

export default FlipCard;
