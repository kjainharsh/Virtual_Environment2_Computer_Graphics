import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Virtual3DRoom = () => {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cameraRef = useRef({ x: 0, y: 2, z: 8 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xffa500, 0.8, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x2d5016, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wallMat);
    backWall.position.set(0, 6, -15);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wallMat);
    leftWall.position.set(-15, 6, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wallMat);
    rightWall.position.set(15, 6, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    ceiling.position.y = 12;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Sofa
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.7 });
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 2), sofaMat);
    sofaBase.position.set(-7, 0.4, 5);
    sofaBase.castShadow = true;
    scene.add(sofaBase);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 0.4), sofaMat);
    sofaBack.position.set(-7, 1.35, 4.2);
    sofaBack.castShadow = true;
    scene.add(sofaBack);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 2), sofaMat);
    armL.position.set(-9, 0.9, 5);
    armL.castShadow = true;
    scene.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 2), sofaMat);
    armR.position.set(-5, 0.9, 5);
    armR.castShadow = true;
    scene.add(armR);

    // TV Stand
    const tvStand = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.6, 1),
      new THREE.MeshStandardMaterial({ color: 0x2c1810 })
    );
    tvStand.position.set(-7, 0.3, -13);
    tvStand.castShadow = true;
    scene.add(tvStand);

    // TV
    const tv = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.5, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 })
    );
    tv.position.set(-7, 1.7, -13.5);
    scene.add(tv);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x0066cc, emissive: 0x003366, emissiveIntensity: 0.7 })
    );
    screen.position.set(-7, 1.7, -13.45);
    scene.add(screen);

    // Rug
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      new THREE.MeshStandardMaterial({ color: 0x8b4726, roughness: 0.95 })
    );
    rug.position.set(0, 0.02, 0);
    rug.rotation.x = -Math.PI / 2;
    scene.add(rug);

    // Table
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2), tableMat);
    tableTop.position.set(0, 1.5, 0);
    tableTop.castShadow = true;
    scene.add(tableTop);

    const legPos = [[-1.8, 0.75, -0.8], [1.8, 0.75, -0.8], [-1.8, 0.75, 0.8], [1.8, 0.75, 0.8]];
    legPos.forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), tableMat);
      leg.position.set(...pos);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Vase with flowers
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.8, roughness: 0.2 });
    const vaseBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16), vaseMat);
    vaseBottom.position.set(-1.2, 1.9, 0);
    vaseBottom.castShadow = true;
    scene.add(vaseBottom);

    const vaseTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 16), vaseMat);
    vaseTop.position.set(-1.2, 2.4, 0);
    scene.add(vaseTop);

    const flowerColors = [0xff69b4, 0xff1493, 0xffd700, 0xff6347];
    for (let i = 0; i < 4; i++) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: flowerColors[i], emissive: flowerColors[i], emissiveIntensity: 0.3 })
      );
      const angle = (i / 4) * Math.PI * 2;
      flower.position.set(-1.2 + Math.cos(angle) * 0.15, 2.7, Math.sin(angle) * 0.15);
      scene.add(flower);
    }

    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff6347, roughness: 0.2, metalness: 0.8 })
    );
    sphere.position.set(0, 2, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    // Books on table
    const bookColors = [0x8b0000, 0x00008b, 0x006400];
    for (let i = 0; i < 3; i++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.1, 0.4),
        new THREE.MeshStandardMaterial({ color: bookColors[i], roughness: 0.8 })
      );
      book.position.set(1.3, 1.65 + i * 0.11, 0.3);
      book.castShadow = true;
      scene.add(book);
    }

    // Bookshelf
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.7 });
    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.2), shelfMat);
    shelfBack.position.set(-8, 2.5, -14.8);
    shelfBack.castShadow = true;
    scene.add(shelfBack);

    for (let i = 0; i < 5; i++) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1), shelfMat);
      board.position.set(-8, 0.5 + i * 1.2, -14.5);
      board.castShadow = true;
      scene.add(board);
    }

    const shelfBookColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff];
    for (let shelf = 0; shelf < 4; shelf++) {
      for (let book = 0; book < 6; book++) {
        const shelfBook = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.7, 0.5),
          new THREE.MeshStandardMaterial({ color: shelfBookColors[book % 6], roughness: 0.8 })
        );
        shelfBook.position.set(-9.2 + book * 0.45, 1 + shelf * 1.2, -14.2);
        shelfBook.castShadow = true;
        scene.add(shelfBook);
      }
    }

    // Clock
    const clockBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: 0x2c1810 })
    );
    clockBody.rotation.x = Math.PI / 2;
    clockBody.position.set(3, 8, -14.9);
    scene.add(clockBody);

    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    clockFace.position.set(3, 8, -14.85);
    scene.add(clockFace);

    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.25, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    hourHand.position.set(3, 8, -14.84);
    scene.add(hourHand);

    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.35, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    minuteHand.position.set(3, 8, -14.83);
    scene.add(minuteHand);

    // Window
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x4a3c2a })
    );
    windowFrame.position.set(8, 6, -14.9);
    scene.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.4, metalness: 0.9 })
    );
    windowGlass.position.set(8, 6, -14.85);
    scene.add(windowGlass);

    // Ceiling Fan
    const fanPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0x708090, metalness: 0.8 })
    );
    fanPole.position.set(0, 11, 0);
    scene.add(fanPole);

    const fanBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.3, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x708090, metalness: 0.8 })
    );
    fanBody.position.set(0, 10, 0);
    scene.add(fanBody);

    const fanBlades = [];
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.05, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x708090, metalness: 0.8 })
      );
      const angle = (i / 4) * Math.PI * 2;
      blade.position.set(Math.cos(angle) * 0.75, 9.9, Math.sin(angle) * 0.75);
      blade.rotation.y = angle;
      fanBlades.push(blade);
      scene.add(blade);
    }

    // Plants
    for (let i = 0; i < 3; i++) {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.3, 0.6, 16),
        new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.9 })
      );
      pot.position.set(-10 + i * 5, 0.3, 10);
      pot.castShadow = true;
      scene.add(pot);

      for (let j = 0; j < 6; j++) {
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.8 })
        );
        const angle = (j / 6) * Math.PI * 2;
        leaf.position.set(-10 + i * 5 + Math.cos(angle) * 0.4, 1, 10 + Math.sin(angle) * 0.4);
        leaf.scale.set(1, 0.6, 1);
        leaf.castShadow = true;
        scene.add(leaf);
      }
    }

    // Floating cubes
    const cubes = [];
    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 0.6),
        new THREE.MeshStandardMaterial({ 
          color: Math.random() * 0xffffff,
          roughness: 0.3,
          metalness: 0.7
        })
      );
      cube.position.set(-6 + i * 3, 4 + Math.sin(i) * 1, -5);
      cube.castShadow = true;
      cube.userData = { 
        initialY: cube.position.y,
        offset: i * Math.PI / 3,
        rotSpeed: 0.01 + Math.random() * 0.03
      };
      cubes.push(cube);
      scene.add(cube);
    }

    // Lamp
    const lampStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.1, 1.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x2c2c2c, metalness: 0.9 })
    );
    lampStand.position.set(1.5, 2.35, 0.5);
    lampStand.castShadow = true;
    scene.add(lampStand);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 0.7, 16, 1, true),
      new THREE.MeshStandardMaterial({ 
        color: 0xffffdd,
        emissive: 0xffffaa,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
      })
    );
    lampShade.position.set(1.5, 3.3, 0.5);
    scene.add(lampShade);

    // Picture frames
    const framePos = [
      { x: -14.9, y: 7, z: -5, ry: Math.PI / 2, c: 0xff6b6b },
      { x: -14.9, y: 7, z: 5, ry: Math.PI / 2, c: 0x4ecdc4 },
      { x: 14.9, y: 7, z: -5, ry: -Math.PI / 2, c: 0xffe66d }
    ];

    framePos.forEach(p => {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x2c1810 })
      );
      frame.position.set(p.x, p.y, p.z);
      frame.rotation.y = p.ry;
      scene.add(frame);

      const picture = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 1.7),
        new THREE.MeshStandardMaterial({ color: p.c })
      );
      picture.position.set(p.x + (p.ry > 0 ? -0.06 : 0.06), p.y, p.z);
      picture.rotation.y = p.ry;
      scene.add(picture);
    });

    // MAN CHARACTER - Standing near table
    const manGroup = new THREE.Group();
    
    // Man's body
    const manBodyGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 16);
    const manBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc, roughness: 0.7 });
    const manBody = new THREE.Mesh(manBodyGeometry, manBodyMaterial);
    manBody.position.y = 1.4;
    manBody.castShadow = true;
    manGroup.add(manBody);

    // Man's head
    const manHeadGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const manSkinMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 });
    const manHead = new THREE.Mesh(manHeadGeometry, manSkinMaterial);
    manHead.position.y = 2.25;
    manHead.castShadow = true;
    manGroup.add(manHead);

    // Man's hair
    const manHairGeometry = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const manHairMaterial = new THREE.MeshStandardMaterial({ color: 0x2c1810, roughness: 0.9 });
    const manHair = new THREE.Mesh(manHairGeometry, manHairMaterial);
    manHair.position.y = 2.35;
    manGroup.add(manHair);

    // Man's eyes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const manLeftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    manLeftEye.position.set(-0.08, 2.3, 0.22);
    manGroup.add(manLeftEye);
    const manRightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    manRightEye.position.set(0.08, 2.3, 0.22);
    manGroup.add(manRightEye);

    // Man's arms
    const manArmGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
    const manArmMaterial = new THREE.MeshStandardMaterial({ color: 0x0066cc, roughness: 0.7 });
    
    const manLeftArm = new THREE.Mesh(manArmGeometry, manArmMaterial);
    manLeftArm.position.set(-0.38, 1.5, 0);
    manLeftArm.rotation.z = 0.3;
    manLeftArm.castShadow = true;
    manGroup.add(manLeftArm);

    const manRightArm = new THREE.Mesh(manArmGeometry, manArmMaterial);
    manRightArm.position.set(0.38, 1.5, 0);
    manRightArm.rotation.z = -0.3;
    manRightArm.castShadow = true;
    manGroup.add(manRightArm);

    // Man's hands
    const manHandGeometry = new THREE.SphereGeometry(0.09, 8, 8);
    const manLeftHand = new THREE.Mesh(manHandGeometry, manSkinMaterial);
    manLeftHand.position.set(-0.5, 1.05, 0);
    manGroup.add(manLeftHand);
    const manRightHand = new THREE.Mesh(manHandGeometry, manSkinMaterial);
    manRightHand.position.set(0.5, 1.05, 0);
    manGroup.add(manRightHand);

    // Man's legs
    const manLegGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 8);
    const manPantsMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    
    const manLeftLeg = new THREE.Mesh(manLegGeometry, manPantsMaterial);
    manLeftLeg.position.set(-0.15, 0.4, 0);
    manLeftLeg.castShadow = true;
    manGroup.add(manLeftLeg);

    const manRightLeg = new THREE.Mesh(manLegGeometry, manPantsMaterial);
    manRightLeg.position.set(0.15, 0.4, 0);
    manRightLeg.castShadow = true;
    manGroup.add(manRightLeg);

    // Man's shoes
    const manShoeGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.25);
    const manShoeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const manLeftShoe = new THREE.Mesh(manShoeGeometry, manShoeMaterial);
    manLeftShoe.position.set(-0.15, 0.05, 0.05);
    manGroup.add(manLeftShoe);
    const manRightShoe = new THREE.Mesh(manShoeGeometry, manShoeMaterial);
    manRightShoe.position.set(0.15, 0.05, 0.05);
    manGroup.add(manRightShoe);

    manGroup.position.set(2.5, 0, 1);
    manGroup.rotation.y = -Math.PI / 4;
    scene.add(manGroup);

    // WOMAN CHARACTER - Standing near sofa
    const womanGroup = new THREE.Group();
    
    // Woman's body
    const womanBodyGeometry = new THREE.CylinderGeometry(0.25, 0.35, 1.1, 16);
    const womanBodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff1493, roughness: 0.6 });
    const womanBody = new THREE.Mesh(womanBodyGeometry, womanBodyMaterial);
    womanBody.position.y = 1.35;
    womanBody.castShadow = true;
    womanGroup.add(womanBody);

    // Woman's head
    const womanHeadGeometry = new THREE.SphereGeometry(0.23, 16, 16);
    const womanSkinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd7ba, roughness: 0.7 });
    const womanHead = new THREE.Mesh(womanHeadGeometry, womanSkinMaterial);
    womanHead.position.y = 2.15;
    womanHead.castShadow = true;
    womanGroup.add(womanHead);

    // Woman's hair (longer)
    const womanHairGeometry = new THREE.SphereGeometry(0.28, 16, 16);
    const womanHairMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });
    const womanHair = new THREE.Mesh(womanHairGeometry, womanHairMaterial);
    womanHair.position.y = 2.25;
    womanHair.scale.set(1, 1.2, 1);
    womanGroup.add(womanHair);

    // Woman's eyes
    const womanLeftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    womanLeftEye.position.set(-0.08, 2.2, 0.2);
    womanGroup.add(womanLeftEye);
    const womanRightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    womanRightEye.position.set(0.08, 2.2, 0.2);
    womanGroup.add(womanRightEye);

    // Woman's smile
    const smileGeometry = new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI);
    const smileMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
    const womanSmile = new THREE.Mesh(smileGeometry, smileMaterial);
    womanSmile.position.set(0, 2.08, 0.21);
    womanSmile.rotation.x = -0.3;
    womanGroup.add(womanSmile);

    // Woman's arms
    const womanArmGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.85, 8);
    const womanArmMaterial = new THREE.MeshStandardMaterial({ color: 0xff1493, roughness: 0.6 });
    
    const womanLeftArm = new THREE.Mesh(womanArmGeometry, womanArmMaterial);
    womanLeftArm.position.set(-0.32, 1.4, 0);
    womanLeftArm.rotation.z = 0.4;
    womanLeftArm.castShadow = true;
    womanGroup.add(womanLeftArm);

    const womanRightArm = new THREE.Mesh(womanArmGeometry, womanArmMaterial);
    womanRightArm.position.set(0.32, 1.4, 0);
    womanRightArm.rotation.z = -0.4;
    womanRightArm.castShadow = true;
    womanGroup.add(womanRightArm);

    // Woman's hands
    const womanHandGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const womanLeftHand = new THREE.Mesh(womanHandGeometry, womanSkinMaterial);
    womanLeftHand.position.set(-0.45, 0.98, 0);
    womanGroup.add(womanLeftHand);
    const womanRightHand = new THREE.Mesh(womanHandGeometry, womanSkinMaterial);
    womanRightHand.position.set(0.45, 0.98, 0);
    womanGroup.add(womanRightHand);

    // Woman's skirt
    const womanSkirtGeometry = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 16);
    const womanSkirtMaterial = new THREE.MeshStandardMaterial({ color: 0xff1493, roughness: 0.7 });
    const womanSkirt = new THREE.Mesh(womanSkirtGeometry, womanSkirtMaterial);
    womanSkirt.position.y = 0.6;
    womanSkirt.castShadow = true;
    womanGroup.add(womanSkirt);

    // Woman's legs
    const womanLegGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const womanLegMaterial = new THREE.MeshStandardMaterial({ color: 0xffd7ba, roughness: 0.8 });
    
    const womanLeftLeg = new THREE.Mesh(womanLegGeometry, womanLegMaterial);
    womanLeftLeg.position.set(-0.12, 0.15, 0);
    womanLeftLeg.castShadow = true;
    womanGroup.add(womanLeftLeg);

    const womanRightLeg = new THREE.Mesh(womanLegGeometry, womanLegMaterial);
    womanRightLeg.position.set(0.12, 0.15, 0);
    womanRightLeg.castShadow = true;
    womanGroup.add(womanRightLeg);

    // Woman's shoes
    const womanShoeGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.15, 8);
    const womanShoeMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0066, metalness: 0.4 });
    const womanLeftShoe = new THREE.Mesh(womanShoeGeometry, womanShoeMaterial);
    womanLeftShoe.position.set(-0.12, 0.05, 0);
    womanGroup.add(womanLeftShoe);
    const womanRightShoe = new THREE.Mesh(womanShoeGeometry, womanShoeMaterial);
    womanRightShoe.position.set(0.12, 0.05, 0);
    womanGroup.add(womanRightShoe);

    womanGroup.position.set(-5, 0, 4);
    womanGroup.rotation.y = Math.PI / 6;
    scene.add(womanGroup);

    // Controls
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const keys = {};
    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const targetX = mouseRef.current.x * 5;
      const targetY = 2 + mouseRef.current.y * 2;
      
      cameraRef.current.x += (targetX - cameraRef.current.x) * 0.05;
      cameraRef.current.y += (targetY - cameraRef.current.y) * 0.05;
      
      camera.position.x = cameraRef.current.x;
      camera.position.y = cameraRef.current.y;
      
      const moveSpeed = 5 * delta;
      if (keys['w'] || keys['arrowup']) camera.position.z -= moveSpeed;
      if (keys['s'] || keys['arrowdown']) camera.position.z += moveSpeed;
      if (keys['a'] || keys['arrowleft']) camera.position.x -= moveSpeed;
      if (keys['d'] || keys['arrowright']) camera.position.x += moveSpeed;
      if (keys['q']) camera.position.y += moveSpeed;
      if (keys['e']) camera.position.y -= moveSpeed;

      camera.lookAt(0, 2, 0);

      cubes.forEach(c => {
        c.position.y = c.userData.initialY + Math.sin(time * 2 + c.userData.offset) * 0.8;
        c.rotation.x += c.userData.rotSpeed;
        c.rotation.y += c.userData.rotSpeed;
      });

      sphere.rotation.y += 0.02;
      sphere.position.y = 2 + Math.sin(time * 3) * 0.1;

      // Animate man - slight breathing and arm movement
      manBody.scale.y = 1 + Math.sin(time * 2) * 0.02;
      manLeftArm.rotation.z = 0.3 + Math.sin(time * 1.5) * 0.2;
      manRightArm.rotation.z = -0.3 - Math.sin(time * 1.5) * 0.2;
      manHead.rotation.y = Math.sin(time * 0.8) * 0.3;
      
      // Man walking in place
      manLeftLeg.rotation.x = Math.sin(time * 3) * 0.3;
      manRightLeg.rotation.x = -Math.sin(time * 3) * 0.3;
      manGroup.position.y = Math.abs(Math.sin(time * 3)) * 0.05;

      // Animate woman - slight breathing and gentle sway
      womanBody.scale.y = 1 + Math.sin(time * 2.2) * 0.02;
      womanGroup.rotation.y = Math.PI / 6 + Math.sin(time * 0.8) * 0.15;
      womanLeftArm.rotation.z = 0.4 + Math.sin(time * 1.8) * 0.25;
      womanRightArm.rotation.z = -0.4 - Math.sin(time * 1.8) * 0.25;
      womanHead.rotation.y = Math.sin(time * 1.2) * 0.25;
      womanHead.rotation.x = Math.sin(time * 2) * 0.08;
      
      // Woman swaying body
      womanGroup.position.x = -5 + Math.sin(time * 0.6) * 0.15;
      womanGroup.position.y = Math.abs(Math.sin(time * 2)) * 0.03;

      hourHand.rotation.z = time * 0.1;
      minuteHand.rotation.z = time * 0.5;

      fanBlades.forEach(b => b.rotation.y += 0.05);

      pointLight.intensity = 0.6 + Math.sin(time * 2) * 0.2;
      screen.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default Virtual3DRoom;