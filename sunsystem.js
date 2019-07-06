/* jshint esversion: 6 */
/* eslint "no-param-reassign": "off" */
const config = {
  earthSize: 12,
  earthRotation: 0.005,
  diam(ratio) {
    return config.earthSize * ratio;
  },
  orbitRadiusCalculate(sun, radiusOffset) {
    return config.diam(sun.diamRation) + radiusOffset;
  },
  calculateSelfSpeedRoration(selfSpeedRorationRatio) {
    return config.earthRotation * selfSpeedRorationRatio;
  },
};

const planets = {
  sun: {
    material: 'basic',
    name: 'sun',
    textureImg: './imgs/sunmap.jpg',
    light: {
      color: 0xffffff,
      intensity: 2,
      distance: 0,
      decay: 2,
      position: new THREE.Vector3(0, 0, 0),
    },
    diamRation: 5,
    selfSpeedRorationRatio: 0.000124,
    sunOrbitRotationSpeed: 0
  },
  mercury: {
    material: 'lambert',
    name: 'mercury',
    textureImg: './imgs/mercurymap.jpg',
    diamRation: 0.41,
    selfSpeedRorationRatio: 0.001,
    sunOrbitRotationSpeed: 0.011,
    radiusOffset: 50
  },
  venus: {
    material: 'lambert',
    name: 'venus',
    textureImg: './imgs/venusmap.jpg',
    diamRation: 0.95,
    selfSpeedRorationRatio: 0.002,
    sunOrbitRotationSpeed: 0.004,
    radiusOffset: 100
  },
  earth: {
    satellites: {
      moon: {
        material: 'lambert',
        name: 'moon',
        textureImg: './imgs/moonmap1k.jpg',
        selfSpeedRorationRatio: 1,
        position: new THREE.Vector3(19, 0, 0),
        animate(item, config) {
          item.rotation += config.calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
        }
      },
    },
    material: 'lambert',
    name: 'earth',
    textureImg: './imgs/earthmap1k.jpg',
    diamRation: 0.95,
    selfSpeedRorationRatio: 1,
    sunOrbitRotationSpeed: 0.0029,
    radiusOffset: 150,
    animate(mesh, config) {
      mesh.children.forEach((item) => {
        if (typeof (this.satellites[item.name]) !== 'undefined' && this.satellites[item.name].animate) {
          this.satellites[item.name].animate(item, config);
        }
      });
    },
  },
  mars: {
    material: 'lambert',
    name: 'mars',
    textureImg: './imgs/marsmap1k.jpg',
    diamRation: 0.95,
    selfSpeedRorationRatio: 0.97,
    sunOrbitRotationSpeed: 0.0024,
    radiusOffset: 200,
    orbit: 0,
  },
  jupiter: {
    material: 'lambert',
    name: 'jupiter',
    textureImg: './imgs/jupiter2_1k.jpg',
    diamRation: 3,
    selfSpeedRorationRatio: 2.4,
    sunOrbitRotationSpeed: 0.0013,
    radiusOffset: 300,
  },
  saturn: {
    material: 'lambert',
    name: 'saturn',
    textureImg: './imgs/saturnmap.jpg',
    diamRation: 2.4,
    selfSpeedRorationRatio: 2.4,
    sunOrbitRotationSpeed: 0.00096,
    radiusOffset: 400,
  },
  uranus: {
    material: 'lambert',
    name: 'uranus',
    textureImg: './imgs/uranusmap.jpg',
    diamRation: 1.85,
    selfSpeedRorationRatio: 1.4,
    sunOrbitRotationSpeed: 0.00068,
    radiusOffset: 500,
  },
  neptune: {
    material: 'lambert',
    name: 'neptune',
    textureImg: './imgs/neptunemap.jpg',
    diamRation: 1.4,
    selfSpeedRorationRatio: 1.7,
    sunOrbitRotationSpeed: 0.00054,
    radiusOffset: 600,
  },
};

class SolarSystemCreator {
  constructor(planets, config) {
    this.config = config;
    this.planets = planets;

    this.meshPlanets = [];
    this.meshOrbits = [];

    /**
     * Текущее положение планет на солнечной орбите
     */
    this.planetOrbitPosition = {};
    Object.values(this.planets).forEach((item) => {
      this.planetOrbitPosition[item.name] = 0;
    });

    this.planetOrbitPosition.venus = 3*Math.PI/2;

    this.enableSkybox = true;
    this.enableOrbit = true;
    this.enableSunOrbitAnimate = true;
    this.enableSelfOrbitAnimate = true;
  }

  /**
     * Create solar system with skybox, planets, orbit
     *
     * @param scene
     * @param int sceneSize
     */
  createSolarSystem(scene, sceneSize) {
    if (this.enableSkybox) {
      scene.add(this._createSkybox(sceneSize));
    }


    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    Object.keys(this.planets).forEach((k) => {
      const planet = planets[k];
      const mesh = this._createPlanetMesh(planet);
      solarSystem.add(mesh);
      if (planet.light) {
        const light = new THREE.PointLight(planet.light.color, planet.light.intensity, planet.light.distance, planet.light.decay);
        light.position.set(planet.light.position.x, planet.light.position.y, planet.light.position.z);
        mesh.add(light);
      }
      this.meshPlanets.push(mesh);
    });

    this.solarSystem = solarSystem;

    if (this.enableOrbit) {
      this._createOrbits(scene);
    }

    return this.solarSystem;
  }

  /**
     * Create planet mesh by params
     *
     * @param planet
     */
  _createPlanetMesh(planet) {
    let texture = null;
    let material = null;

    if (planet.textureVideo) {
      const video = document.getElementById(planet.textureVideo);
      texture = new THREE.VideoTexture(video);
    } else {
      texture = new THREE.TextureLoader().load(planet.textureImg);
    }

    const geometry = new THREE.SphereGeometry(this.config.diam(planet.diamRation), 64, 64);

    if (planet.material === 'basic') {
      material = new THREE.MeshBasicMaterial({
        map: texture,
      });
    } else if (planet.material === 'lambert') {
      material = new THREE.MeshLambertMaterial({
        map: texture,
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    if (planet.satellites) {
      Object.keys(planet.satellites).forEach((k) => {
        const sattelite = planet.satellites[k];
        const satteliteMesh = this._createPlanetMesh(sattelite);
        mesh.add(satteliteMesh);
      });
    }

    if (planet.position) {
      mesh.position.copy(planet.position);
      // mesh.position.set(planet.position.x, planet.position.y, planet.position.z);
    }

    if (planet.radius) {
      mesh.position.x = planet.radius;
      mesh.position.y = planet.radius;
    }

    mesh.rotation.x = Math.PI / 2;

    return mesh;
  }

  /**
     * Create box with star
     *
     * @param planet
     */
  _createSkybox(sceneSize) {
    const skyboxGeometry = new THREE.CubeGeometry(sceneSize, sceneSize, sceneSize);

    const skyboxMaterials = [
      new THREE.MeshBasicMaterial({
        map: (new THREE.TGALoader()).load('./imgs/ame_nebula/purplenebula_ft.tga'),
        side: THREE.DoubleSide,
        color: 0xffffff,
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TGALoader().load('./imgs/ame_nebula/purplenebula_bk.tga'),
        side: THREE.DoubleSide,
        color: 0xffffff,
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TGALoader().load('./imgs/ame_nebula/purplenebula_up.tga'),
        side: THREE.DoubleSide,
        color: 0xffffff,
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TGALoader().load('./imgs/ame_nebula/purplenebula_dn.tga'),
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TGALoader().load('./imgs/ame_nebula/purplenebula_rt.tga'),
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TGALoader().load('./imgs/ame_nebula/purplenebula_lf.tga'),
        side: THREE.DoubleSide,
      }),
    ];

    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);

    return skybox;
  }

  /**
     * Create orbits for planets
     * @param scene
     */
  _createOrbits(scene) {
    Object.keys(this.planets).forEach((k) => {
      if (k === 'sun') {
        return;
      }
      const planet = this.planets[k];
      const geometry = new THREE.CircleGeometry(this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset), 128);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.1 }));
      this.meshOrbits.push(line);
      scene.add(line);
    });
  }

  hideOrbits() {
    this.getMeshOrbits().forEach((item) => {
      item.visible = false;
    });
  }

  showOrbits() {
    this.getMeshOrbits().forEach((item) => {
      item.visible = true;
    });
  }

  /**
     * Show Axe for planet
     * X - red
     * Y - green
     * Z - blue
     */
  showAxios() {
    this.getMeshPlanets().forEach((item) => {
      const axes = new THREE.AxesHelper(30);
      axes.material.depthTest = false;
      axes.renderOrder = 1;
      axes.size = item.radius + 10;
      item.add(axes);
    });
  }

  getSolarSystem() {
    return this.solarSystem;
  }

  getMeshPlanets() {
    return this.meshPlanets;
  }

  getMeshOrbits() {
    return this.meshOrbits;
  }

  /**
   *
   * @param {*} stopPlanet
   */
  animate(stopPlanet = null) {
    this.getMeshPlanets().forEach((item) => {
      if (item.name === 'sun') {
        return false;
      }

      let planet = planets[item.name];

      if (this.enableSunOrbitAnimate && (!stopPlanet || (stopPlanet && item.name !== stopPlanet.name))) {
        this.runBySunOrbit(planet, item);
      }

      if (this.enableSelfOrbitAnimate) {
        this.runBySelfOrbit(planet, item);
      }

      if (planet.animate) {
        planet.animate(item, this.config);
      }
    });
  }

  /**
   * Движение планет вокруг солнца
   * @param planet
   * @param mesh
   */
  runBySunOrbit(planet, mesh) {
    mesh.position.x = this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset) * Math.cos(this.getPlanetPositionByName(planet.name));
    mesh.position.y = this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset) * Math.sin(this.getPlanetPositionByName(planet.name));
    this.planetOrbitPosition[planet.name] += planet.sunOrbitRotationSpeed;
  }

  /**
   * Движение планет вокруг своей оси
   */
  runBySelfOrbit(planet, mesh) {
    //console.log(mesh.name, mesh.rotation.y);
    mesh.rotation.y += this.config.calculateSelfSpeedRoration(planet.selfSpeedRorationRatio);
  }

  /**
   * Положение планеты на орбите солнца по имени планеты
   */
  getPlanetPositionByName(name) {
    return this.planetOrbitPosition[name];
  }
}

window.onload = function onload() {
  const fov = 100;
  const zPosition = 600;
  const sceneSize = 5000;
  const gui = new dat.GUI();
  const width = window.innerWidth * window.devicePixelRatio;
  const height = window.innerHeight * window.devicePixelRatio;

  const canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setClearColor(0x000000);

  const scene = new THREE.Scene();

  // Создаем камеру
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, sceneSize);
  camera.position.set(0, 0, zPosition);
  // TODO: remove
  window.camera = camera;

  //const controls = new THREE.OrbitControls(camera, renderer.domElement);
  //window.controls = controls;

  const solarSystemCreator = new SolarSystemCreator(planets, config);

  solarSystemCreator.enableSkybox = true;
  solarSystemCreator.createSolarSystem(scene, sceneSize);
  //solarSystemCreator.showAxios();

  window.solarSystemCreator = solarSystemCreator;


  let targetObject = null;

  const controlsData = {
    switchToSolarSystem() {
      targetObject = null;
      solarSystemCreator.showOrbits();
      camera.position.set(0, 0, zPosition);
      camera.lookAt(0, 0, 0);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      //controls.enabled = true;
    },
  };

  gui.add(controlsData, 'switchToSolarSystem');

  gui.open();

  function runToPlanet() {
    const intersects = raycaster.intersectObjects(solarSystemCreator.getMeshPlanets());
      if (intersects.length > 0) {
        intersects.forEach((obj) => {
          if (obj.object.name === 'sun') {
            return;
          }
          targetObject = obj.object;
          solarSystemCreator.hideOrbits();

          const planet = planets[targetObject.name];
          let orbitPosition = solarSystemCreator.getPlanetPositionByName(planet.name);
          let newPositionX = config.orbitRadiusCalculate(planets.sun, planet.radiusOffset - config.diam(planet.diamRation) * 3) * Math.cos(orbitPosition + planet.sunOrbitRotationSpeed);
          let newPositionY = config.orbitRadiusCalculate(planets.sun, planet.radiusOffset - config.diam(planet.diamRation) * 3) * Math.sin(orbitPosition + planet.sunOrbitRotationSpeed);
          let newPositionZ = 0;

          const cosX = Math.cos(orbitPosition);

          let rotationAngel = 0;

          orbitPosition = orbitPosition%(2*Math.PI);

          if(orbitPosition < Math.PI/4 && orbitPosition> 0) {
            rotationAngel = -orbitPosition-Math.PI/2;
          } else if(orbitPosition > Math.PI/4 && orbitPosition < Math.PI/2) {
            rotationAngel = -orbitPosition;
          } else if(orbitPosition > Math.PI/2  ) {
            rotationAngel = orbitPosition - Math.PI/2;
          }

          let currentTarget = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
            rX: camera.rotation.x,
            rY: camera.rotation.y,
            rZ: camera.rotation.z,
          }
          let newPositon = {
            x: newPositionX,
            y: newPositionY,
            z: 0,
            rX: Math.PI/2,
            rY:  orbitPosition - Math.PI/2,
            rZ: 0
          };
          new TWEEN.Tween(currentTarget)
            .to(newPositon, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
              camera.position.x = currentTarget.x;
              camera.position.y = currentTarget.y;
              camera.position.z = currentTarget.z;
              camera.rotation.x = currentTarget.rX;
              camera.rotation.y = currentTarget.rY;
              camera.rotation.z = currentTarget.rZ;
            })
            .onComplete(function () {
            })
            .start();
        });
      }
  }

  function onDocumentMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    requestAnimationFrame(() => {
      runToPlanet();
    });
  }

  function onDocumentTouchEnd(event) {
    mouse.x = +(event.targetTouches[0].pageX / window.innerWidth) * 2 +-1;
    mouse.y = -(event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;
    requestAnimationFrame(() => {
      runToPlanet();
    });
  }


  function loop(time) {
    requestAnimationFrame(loop);
    raycaster.setFromCamera(mouse, camera);
    TWEEN.update(time);
    if (targetObject && typeof planets[targetObject.name] !== 'undefined') {
      const planet = planets[targetObject.name];
      let orbitPosition = solarSystemCreator.getPlanetPositionByName(planet.name);
      //controls.enabled = false;
    } else {
      //controls.update();
    }

    solarSystemCreator.animate(targetObject);
    renderer.render(scene, camera);
  }

  loop();

  canvas.addEventListener('mousedown', onDocumentMouseDown, false);
  canvas.addEventListener('touchend', onDocumentTouchEnd, false);
};
