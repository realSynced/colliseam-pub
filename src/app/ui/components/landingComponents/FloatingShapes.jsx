import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { easing } from "maath";

// Debug
import { folder, useControls } from "leva";
import { Perf } from "r3f-perf";
import { MeshStandardMaterial, Color } from "three";

// FloatingShapes Component
const FloatingShapes = () => {
  const { perfVisible } = useControls(
    "PerformanceOverlay",
    {
      perfVisible: false,
    },
    { collapsed: true },
  );

  const { lightIntensity, environmentPreset, lightColor } = useControls(
    "light",
    {
      lightColor: "#0000ff",
      lightIntensity: {
        value: 0.3,
        min: -1,
        max: 1,
        step: 0.1,
      },
      environmentPreset: {
        value: "sunset", // Default value
        options: ["sunset", "city", "dawn", "night", "forest", "apartment", "studio", "warehouse", "park", "lobby"],
      },
    },
    { collapsed: true },
  );

  // Black
  const { blueAccent, blackMetalness, blackRoughness } = useControls(
    "Black",
    {
      blueAccent: {
        value: 8.5,
        min: 0,
        max: 20,
        step: 0.5,
      },
      blackMetalness: {
        value: 0.6,
        min: 0,
        max: 3,
        step: 0.1,
      },
      blackRoughness: {
        value: 0.2,
        min: 0,
        max: 3,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  const darkMaterialColor = new Color(0.012269552797079086, 0.0071920594200491905, Math.min(0.008593108505010605 * blueAccent, 1));
  const darkMaterial = new MeshStandardMaterial(
    {
      color: darkMaterialColor,
      metalness: blackMetalness,
      roughness: blackRoughness,
    },
    { collapsed: true },
  );

  // Shiny
  const { red, green, blue, metalnessShiny, roughnessShiny } = useControls(
    "Shiny",
    {
      red: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      green: {
        value: 0.25,
        min: 0,
        max: 1,
        step: 0.05,
      },
      blue: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.05,
      },
      metalnessShiny: {
        value: 0.6,
        min: 0,
        max: 3,
        step: 0.1,
      },
      roughnessShiny: {
        value: 0.2,
        min: 0,
        max: 3,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  const shinyMaterialColor = new Color(red, green, blue);
  const shinyMaterial = new MeshStandardMaterial(
    {
      color: shinyMaterialColor,
      metalness: metalnessShiny,
      roughness: roughnessShiny,
    },
    { collapsed: true },
  );

  // Clay
  const { redClay, greenClay, blueClay, metalnessClay, roughnessClay } = useControls(
    "Clay",
    {
      redClay: {
        value: 0.75,
        min: 0,
        max: 1,
        step: 0.05,
      },
      greenClay: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.05,
      },
      blueClay: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.05,
      },
      metalnessClay: {
        value: 0.6,
        min: 0,
        max: 3,
        step: 0.1,
      },
      roughnessClay: {
        value: 0.2,
        min: 0,
        max: 5,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  const clayMaterialColor = new Color(redClay, greenClay, blueClay);
  const clayMaterial = new MeshStandardMaterial(
    {
      color: clayMaterialColor,
      metalness: metalnessClay,
      roughness: roughnessClay,
    },
    { collapsed: true },
  );

  const {
    springPosition,
    springScale,
    springRotation,
    momoPosition,
    momoScale,
    momoRotation,
    cylinderPosition,
    cylinderScale,
    cylinderRotation,
    ringPosition,
    ringScale,
    ringRotation,
    wavePosition,
    waveScale,
    waveRotation,
    plusPosition,
    plusScale,
    plusRotation,
    model7Position,
    model7Scale,
    model7Rotation,
    model8Position,
    model8Scale,
    model8Rotation,
  } = useControls("Layout", {
    springLayout: folder(
      {
        springPosition: [24.350000000000048, 0.46999999999999975, 0],
        springRotation: [0, 0, -1.443],
        springScale: 1.8,
      },
      { collapsed: true },
    ),
    momoLayout: folder(
      {
        momoPosition: [-22.180999999999983, -4.397999999999962, 0],
        momoRotation: [0.01, -0.26, 1.7],
        momoScale: 3.2,
      },
      { collapsed: true },
    ),
    cylinderLayout: folder(
      {
        cylinderPosition: [-17.223000000000006, 1.1349999999999987, 0],
        cylinderRotation: [-0.3, -0.03, 0],
        cylinderScale: 0.6,
      },
      { collapsed: true },
    ),
    ringLayout: folder(
      {
        ringPosition: [-24.95999999999993, 3.2469999999999923, 0],
        ringRotation: [1.33, 1.17, 0],
        ringScale: 1,
      },
      { collapsed: true },
    ),
    waveLayout: folder(
      {
        wavePosition: [19.5, 4, 0.3],
        waveRotation: [0.01, -0.26, 1.7],
        waveScale: 0.8,
      },
      { collapsed: true },
    ),
    plusLayout: folder(
      {
        plusPosition: [13.726000000000015, -1.0929999999999993, 0],
        plusRotation: [-0.2, -0.59, 100],
        plusScale: 0.6,
      },
      { collapsed: true },
    ),
    model7Layout: folder(
      {
        model7Position: [-13.679999999999989, -5.110000000000002, 0],
        model7Rotation: [-2.8, 3, 0.5],
        model7Scale: 0.6,
      },
      { collapsed: true },
    ),
    model8Layout: folder(
      {
        model8Position: [18.090000000000035, -4.920000000000002, 0],
        model8Rotation: [-0.455, -0.863, 0.1],
        model8Scale: 0.6,
      },
      { collapsed: true },
    ),
  });

  return (
    <>
      {perfVisible && <Perf position="top-left" showGraph={false} />}
      <ambientLight color={lightColor} intensity={lightIntensity} />
      <Environment preset={environmentPreset} />

      <CameraRig>
        {/* Black */}
        <SpringMesh material={darkMaterial} position={springPosition} rotation={springRotation} scale={springScale} />
        <MomoMesh material={darkMaterial} position={momoPosition} rotation={momoRotation} scale={momoScale} />

        {/* Shiny */}
        <CylinderMesh material={shinyMaterial} position={cylinderPosition} rotation={cylinderRotation} scale={cylinderScale} />
        <WaveMesh material={shinyMaterial} position={wavePosition} rotation={waveRotation} scale={waveScale} />
        <Model8 material={shinyMaterial} position={model8Position} rotation={model8Rotation} scale={model8Scale} />

        {/* White */}
        <RingMesh material={clayMaterial} position={ringPosition} rotation={ringRotation} scale={ringScale} />
        <ConnectorMesh material={clayMaterial} position={plusPosition} rotation={plusRotation} scale={plusScale} />
        <Model7 material={clayMaterial} position={model7Position} rotation={model7Rotation} scale={model7Scale} />
      </CameraRig>
    </>
  );
};

function CameraRig({ children }) {
  const group = useRef();

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 40], 0.25, delta);
    easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 10, 0], 0.25, delta);
  });
  return <group ref={group}>{children}</group>;
}

// Black
function SpringMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model1.glb");

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Plane054.geometry} material={material} />
    </group>
  );
}

export function MomoMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model4.glb");
  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Sphere026.geometry} material={material} />
    </group>
  );
}

// Shiny
export function WaveMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model5.glb");
  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Cube017.geometry} material={material} />
    </group>
  );
}

function CylinderMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model2.glb");

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Circle001.geometry} material={material} />
    </group>
  );
}

export function Model8({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model8.glb");
  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Retopo_Cylinder039.geometry} material={material} />
    </group>
  );
}

// White
export function RingMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model3.glb");

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.BezierCircle.geometry} material={material} />
    </group>
  );
}

export function ConnectorMesh({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model6.glb");
  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Retopo_Cylinder014.geometry} material={material} />
    </group>
  );
}

export function Model7({ position, scale, rotation, material }) {
  const { nodes } = useGLTF("/3D/model7.glb");
  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <mesh geometry={nodes.Cube014.geometry} material={material} />
    </group>
  );
}

useGLTF.preload("/3D/model1.glb");
useGLTF.preload("/3D/model2.glb");
useGLTF.preload("/3D/model3.glb");
useGLTF.preload("/3D/model4.glb");
useGLTF.preload("/3D/model5.glb");
useGLTF.preload("/3D/model6.glb");
useGLTF.preload("/3D/model7.glb");
useGLTF.preload("/3D/model8.glb");

export default FloatingShapes;
