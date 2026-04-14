import { Canvas, useThree } from "@react-three/fiber";
import { PresentationControls, useGLTF, useTexture } from "@react-three/drei";

type Card3DProps = {
  front?: string;
};

const Card3DView = ({ front }: Card3DProps) => {
  const { nodes } = useGLTF("/models/tcg_card/tcg_card.gltf");
  const { viewport } = useThree();

  console.log(viewport.width, viewport.height);
  const frontMaterial = useTexture(
    front || "/images/landing/ronaldinho.jpg",
    (texture) => {
      texture.flipY = false;
    },
  );
  const backMaterial = useTexture("/images/packs/neves.png", (texture) => {
    texture.flipY = false;
  });
  return (
    <>
      <PresentationControls
        snap
        global
        zoom={0.6}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group scale={[5, 1, 5]} rotation={[Math.PI / 2, 0, 0]}>
          {Object.entries(nodes).map(([key, value]) => {
            return (
              <mesh
                key={key}
                geometry={(value as any).geometry}
                // material={value.material}
              >
                {key === "Plane" && <meshBasicMaterial map={frontMaterial} />}
                {key === "Plane_1" && <meshBasicMaterial map={backMaterial} />}
              </mesh>
            );
          })}
        </group>
      </PresentationControls>
    </>
  );
};

useGLTF.preload("/models/tcg_card/tcg_card.gltf");

export const Card3D = (props: Card3DProps) => (
  <div className="w-full h-full rounded-3xl">
    <Canvas className="w-full h-full">
      {/* <color attach="background" args={["#e0b7ff"]} /> */}
      <ambientLight />
      <Card3DView {...props} />
    </Canvas>
  </div>
);
