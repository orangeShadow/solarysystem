/* jshint esversion: 6 */
/* eslint "no-param-reassign": "off" */
import * as THREE from './node_modules/three/build/three.module.js';
import { Lensflare, LensflareElement } from './node_modules/three/examples/jsm/objects/Lensflare.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from './vendor/tween.js';
import XRringGeometry from './vendor/xRingGeomerty.js';
// import dat from './node_modules/dat.gui/build/dat.gui.module.js';

const TEXTURES = {
  sun: './textures/planets/2k_sun.jpg',
  mercury: './textures/planets/2k_mercury.jpg',
  venus: './textures/planets/2k_venus_surface.jpg',
  earth_daymap: './textures/planets/2k_earth_daymap.jpg',
  earth_specular_map: './textures/planets/2k_earth_specular_map.png',
  earth_bump_map: './textures/planets/4k_earth_bump.jpg',
  earth_clouds: './textures/planets/2k_earth_clouds.jpg',
  moon: './textures/planets/2k_moon.jpg',
  mars: './textures/planets/2k_mars.jpg',
  jupiter: './textures/planets/2k_jupiter.jpg',
  saturn: './textures/planets/2k_saturn.jpg',
  saturn_rings: './textures/planets/saturn-rings.png',
  uranus: './textures/planets/2k_uranus.jpg',
  neptune: './textures/planets/2k_neptune.jpg',

  milky_way: './textures/8k_stars_milky_way.jpg',
  lens_flare_0: './textures/lensflare/lensflare0.png',
  lens_flare_3: './textures/lensflare/lensflare3.png',
};

const MODELS = {
  shuttle: './models/shuttle/scene.gltf',
  satellite: './models/near_satellite/scene.gltf',
};

const LOADED_TEXTURES = {};
const LOADED_MODELS = {};

const config = {
  earthSize: 12,
  earthRotation: 0.005,
  radius(ratio) {
    return config.earthSize * ratio;
  },
  orbitRadiusCalculate(sun, radiusOffset) {
    return config.radius(sun.sizeRatio) + radiusOffset;
  },
  calculateSelfSpeedRotation(selfSpeedRotationRatio) {
    return config.earthRotation * selfSpeedRotationRatio;
  },
};

const planets = {
  sun: {
    material: 'basic',
    name: 'sun',
    textureImg: 'sun',
    light: {
      color: 0xffffff,
      intensity: 1.2,
      distance: 3000,
      decay: 2,
      position: new THREE.Vector3(0, 0, 0),
    },
    sizeRatio: 5,
    selfSpeedRotationRatio: 0.000124,
    sunOrbitRotationSpeed: 0,
  },
  mercury: {
    material: 'lambert',
    name: 'mercury',
    textureImg: 'mercury',
    sizeRatio: 0.41,
    selfSpeedRotationRatio: 0.001,
    sunOrbitRotationSpeed: 0.011,
    radiusOffset: 50,
  },
  venus: {
    material: 'lambert',
    name: 'venus',
    textureImg: 'venus',
    sizeRatio: 0.95,
    selfSpeedRotationRatio: 0.002,
    sunOrbitRotationSpeed: 0.004,
    radiusOffset: 100,
  },
  earth: {
    satellites: {
      moon: {
        material: 'lambert',
        name: 'moon',
        textureImg: 'moon',
        selfSpeedRotationRatio: 1,
        position: new THREE.Vector3(19, 0, 0),
        animate(item, config) {
          item.rotation.y += config.calculateSelfSpeedRotation(this.selfSpeedRotationRatio);
        },
      },
      nasa: {
        create(planet, config, mesh) {
          const nasa = LOADED_MODELS.satellite.scene;
          const radius = config.radius(planet.sizeRatio) + 2;
          const angle = Math.PI / 6 * 2;
          nasa.position.x = -radius * Math.sin(angle);
          nasa.position.y = radius * Math.cos(angle);
          nasa.rotation.z = angle;
          nasa.scale.set(0.4, 0.4, 0.4);
          nasa.name = 'nasa';
          mesh.add(nasa);
          return false;
        },
        animate(item) {
          item.children[0].rotation.z += 0.01;
        },
      },
      shuttle: {
        create(planet, config, mesh) {
          const shuttle = LOADED_MODELS.shuttle.scene;
          const radius = config.radius(planet.sizeRatio) + 1;
          const angle = -Math.PI / 2;
          shuttle.children[0].position.x = -radius * Math.sin(angle);
          shuttle.children[0].position.y = radius * Math.cos(angle);
          shuttle.children[0].rotation.z = angle;
          shuttle.children[0].rotation.x = 0;
          shuttle.children[0].scale.set(0.0015, 0.0015, 0.0015);
          shuttle.name = 'shuttle';
          shuttle.children[0].children[0].rotation.x = Math.PI / 2;
          shuttle.children[0].children[0].rotation.y = Math.PI;
          mesh.add(shuttle);
          return false;
        },
        animate(item) {
          item.rotation.y -= 0.02;
        },
      },
    },
    material: 'lambert',
    name: 'earth',
    textureImg: 'earth_daymap',
    specularMap: 'earth_specular_map',
    bumpMap: 'earth_bump_map',
    bumpScale: 0.2,
    cloudsMap: 'earth_clouds',
    sizeRatio: 0.95,
    selfSpeedRotationRatio: 1,
    sunOrbitRotationSpeed: 0.0029,
    radiusOffset: 150,
    animate(mesh, config) {
      mesh.children.forEach((item) => {
        if (typeof (this.satellites[item.name]) !== 'undefined' && this.satellites[item.name].animate) {
          this.satellites[item.name].animate(item, config);
        }
        /*
        if (item.name === 'clouds') {
          item.rotation.y += 0.0005;
        }
        */
      });
    },
  },
  mars: {
    material: 'lambert',
    name: 'mars',
    textureImg: 'mars',
    sizeRatio: 0.95,
    selfSpeedRotationRatio: 0.97,
    sunOrbitRotationSpeed: 0.0024,
    radiusOffset: 200,
    orbit: 0,
  },
  jupiter: {
    material: 'lambert',
    name: 'jupiter',
    textureImg: 'jupiter',
    sizeRatio: 3,
    selfSpeedRotationRatio: 2.4,
    sunOrbitRotationSpeed: 0.0013,
    radiusOffset: 500,
  },
  saturn: {
    satellites: {
      ring: {
        name: 'ring',
        selfSpeedRotationRatio: 0,
        create(planet, config) {
          const geometry = new XRringGeometry(1.2 * config.radius(planet.sizeRatio), 2 * config.radius(planet.sizeRatio), 2 * 32, 5, 0, Math.PI * 2);
          const material = new THREE.MeshBasicMaterial({
            map: LOADED_TEXTURES.saturn_rings,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = Math.PI / 25;
          return mesh;
        },
      },
    },
    material: 'lambert',
    name: 'saturn',
    textureImg: 'saturn',
    sizeRatio: 2.4,
    selfSpeedRotationRatio: 2.4,
    sunOrbitRotationSpeed: 0.00096,
    radiusOffset: 800,
  },
  uranus: {
    material: 'lambert',
    name: 'uranus',
    textureImg: 'uranus',
    sizeRatio: 1.85,
    selfSpeedRotationRatio: 1.4,
    sunOrbitRotationSpeed: 0.00068,
    radiusOffset: 1000,
  },
  neptune: {
    material: 'lambert',
    name: 'neptune',
    textureImg: 'neptune',
    sizeRatio: 1.4,
    selfSpeedRotationRatio: 1.7,
    sunOrbitRotationSpeed: 0.00054,
    radiusOffset: 1200,
  },
};

class SolarSystem {
  constructor({ canvas, dpr, onLoad } = {}) {
    this.dpr = dpr || Math.min(window.devicePixelRatio, 2);
    this.config = config;
    this.planets = planets;

    this.fov = 50;
    this.cameraInitPosition = [0, 270, 800];
    this.sceneSize = 5000;

    this.enableSkybox = true;
    this.enableSkybox = true;
    this.enableOrbit = true;
    this.enableAxios = false;
    this.enableSunOrbitAnimate = true;
    this.enableSelfOrbitAnimate = true;

    this.meshPlanets = [];
    this.meshOrbits = [];

    /**
     * Объект на котором наведена камера в данный момент
     */
    this.targetObject = null;

    this.canvas = canvas;
    this.width = canvas.offsetWidth * this.dpr;
    this.height = canvas.offsetHeight * this.dpr;
    canvas.width = this.width;
    canvas.height = this.height;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000);

    this.scene = new THREE.Scene();

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.ambientLight.intensity = 0.18;
    this.ambientLight.visible = true;
    this.scene.add(this.ambientLight);

    // Создаем камеру
    this.camera = new THREE.PerspectiveCamera(this.fov, this.width / this.height, 0.1, this.sceneSize);
    this.camera.position.set(...this.cameraInitPosition);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = this.config.radius(this.planets.sun.sizeRatio) * 4;
    this.controls.maxDistance = this.sceneSize / 3;

    this.overviewState = null;
    requestAnimationFrame(() => {
      this.saveOverviewState();
    });

    this.loop = this.loop.bind(this);

    this._setDefaultOrbitPosition();

    // const onDocumentTouchEnd = (event) => {
    //   this.mouse.x = +(event.changedTouches[0].pageX / window.innerWidth) * 2 + -1;
    //   this.mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;

    //   requestAnimationFrame(() => {
    //     const intersects = this.raycaster.intersectObjects(this.getMeshPlanets());
    //     if (intersects.length > 0) {
    //       let intersectsCurrent;
    //       intersects.forEach((obj) => {
    //         if (intersectsCurrent) return;
    //         if (obj.object === this.targetObject) {
    //           intersectsCurrent = true;
    //           return;
    //         }
    //         this.runToPlanet(obj.object.name);
    //       });
    //     }
    //   });
    // };

    const onDocumentClick = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      requestAnimationFrame(() => {
        const intersects = this.raycaster.intersectObjects(this.getMeshPlanets());
        if (intersects.length > 0) {
          let intersectsCurrent;
          intersects.forEach((obj) => {
            if (intersectsCurrent) return;
            if (obj.object === this.targetObject) {
              intersectsCurrent = true;
              return;
            }
            this.runToPlanet(obj.object.name);
          });
        }
      });
    };

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.width = canvas.offsetWidth * this.dpr;
        this.height = canvas.offsetHeight * this.dpr;
        canvas.width = this.width;
        canvas.height = this.height;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height, false);
      });
    };

    this.attachEvents = () => {
      this.canvas.addEventListener('click', onDocumentClick, false);
      // this.canvas.addEventListener('touchend', onDocumentTouchEnd, false);
      window.addEventListener('resize', onResize, false);
    };

    this.detachEvents = () => {
      this.canvas.removeEventListener('click', onDocumentClick, false);
      // this.canvas.removeEventListener('touchend', onDocumentTouchEnd, false);
      window.removeEventListener('resize', onResize, false);
    };

    this.attachEvents();

    this.preloadAssets(() => {
      this.createSolarSystem();
      this.createLensflare();
      this.loop();
      // this.createGui();
      if (onLoad && !this.destroyed) {
        onLoad();
      }
    });
  }

  destroy() {
    this.detachEvents();
    this.destroyed = true;
  }

  preloadAssets(cb) {
    const promises = [];
    const textureLoader = new THREE.TextureLoader();
    const modelLoader = new GLTFLoader();
    Object.keys(TEXTURES).forEach((key) => {
      promises.push(new Promise((resolve) => {
        textureLoader.load(TEXTURES[key], (res) => {
          LOADED_TEXTURES[key] = res;
          resolve();
        });
      }));
    });
    Object.keys(MODELS).forEach((key) => {
      promises.push(new Promise((resolve) => {
        modelLoader.load(MODELS[key], (res) => {
          LOADED_MODELS[key] = res;
          resolve();
        });
      }));
    });
    Promise.all(promises).then(() => {
      if (cb) cb();
    }).catch(() => {
      if (cb) cb();
    });
  }

  loop(time) {
    if (this.destroyed) return;
    requestAnimationFrame(this.loop);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    TWEEN.update(time);
    this.controls.update();
    this.updateLensflarePosition();
    this.animate();
    this.renderer.render(this.scene, this.camera);
  }

  createLensflare() {
    const textureFlare0 = LOADED_TEXTURES.lens_flare_0;
    const textureFlare3 = LOADED_TEXTURES.lens_flare_3;

    const lensflare = new Lensflare();

    lensflare.addElement(new LensflareElement(textureFlare0, 600, 0, new THREE.Color(0xffffff)));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));

    this.lensflare = lensflare;
    this.lensflare.position.set(0, 200, 0);
    this.scene.add(lensflare);
  }

  updateLensflarePosition() {
    const center = new THREE.Vector3(0, 0, 0);
    const target = new THREE.Vector3(0, 0, 0);
    const sunRadius = this.config.radius(this.planets.sun.sizeRatio);
    const line = new THREE.Line3(center, this.camera.position);
    const distanceToCenter = center.distanceTo(this.camera.position);
    line.at(sunRadius / distanceToCenter, target);
    Object.assign(this.lensflare.position, target);
  }

  createGui() {
    const self = this;
    self.gui = new dat.GUI();

    const controlsData = {
      switchToSolarSystem() {
        self.runToOverview();
      },
    };

    self.gui.add(controlsData, 'switchToSolarSystem');
    self.gui.open();
  }

  /**
     * Create solar system with skybox, planets, orbit
     *
     * @param scene
     * @param int sceneSize
     */
  createSolarSystem() {
    const { scene, enableSkybox } = this;
    if (enableSkybox) {
      scene.add(this._createSkybox());
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
      this._createOrbits();
    }

    if (this.enableAxios) {
      this.showAxios();
    }

    return this.solarSystem;
  }

  /**
   * Установка начальных позиций для планет
   *
   */
  _setDefaultOrbitPosition() {
    this.planetOrbitPosition = {};
    Object.values(this.planets).forEach((item) => {
      this.planetOrbitPosition[item.name] = (item.sunOrbitRotationSpeed * 365 * 24 * 60) % (Math.PI * 2);
    });
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
      texture = LOADED_TEXTURES[planet.textureImg];
    }

    const geometry = new THREE.SphereGeometry(this.config.radius(planet.sizeRatio), 64, 64);

    if (planet.material === 'basic') {
      material = new THREE.MeshBasicMaterial({
        map: texture,
      });
    } else if (planet.material === 'lambert') {
      const textureConfig = {
        map: texture,
        shininess: 5,
      };
      if (planet.specularMap) {
        textureConfig.specularMap = LOADED_TEXTURES[planet.specularMap];
      }
      if (planet.bumpMap) {
        textureConfig.bumpMap = LOADED_TEXTURES[planet.bumpMap];
        textureConfig.bumpScale = planet.bumpScale || 1;
      }

      material = new THREE.MeshPhongMaterial(textureConfig);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    if (planet.satellites) {
      Object.keys(planet.satellites).forEach((k) => {
        const sattelite = planet.satellites[k];
        let satteliteMesh = null;
        if (!sattelite.create) {
          satteliteMesh = this._createPlanetMesh(sattelite);
        } else {
          satteliteMesh = sattelite.create(planet, this.config, mesh);
        }
        if (!satteliteMesh) return;
        mesh.add(satteliteMesh);
      });
    }

    if (planet.cloudsMap) {
      const cloudsTexture = LOADED_TEXTURES[planet.cloudsMap];
      const cloudsGeometry = new THREE.SphereGeometry(this.config.radius(planet.sizeRatio) + 0.005, 128, 128);
      const cloudsMaterial = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.75,
        alphaMap: cloudsTexture,
        bumpMap: cloudsTexture,
        bumpScale: 0.15,
        specular: new THREE.Color(0x000000),
      });
      const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      cloudsMesh.name = 'clouds';
      mesh.add(cloudsMesh);
    }

    if (planet.position) {
      mesh.position.copy(planet.position);
      // mesh.position.set(planet.position.x, planet.position.y, planet.position.z);
    }

    if (planet.radius) {
      mesh.position.x = planet.radius;
      mesh.position.z = planet.radius;
    }

    mesh.rotation.y = Math.PI / 2;

    return mesh;
  }

  /**
     * Create box with star
     *
     * @param planet
     */
  _createSkybox() {
    const { sceneSize } = this;

    const skyboxGeometry = new THREE.SphereGeometry(sceneSize / 2, 32, 32);

    const skyboxMaterials = new THREE.MeshBasicMaterial();
    skyboxMaterials.map = LOADED_TEXTURES.milky_way;
    skyboxMaterials.side = THREE.BackSide;

    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);

    return skybox;

    /*
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
    */
  }

  /**
     * Create orbits for planets
     * @param scene
     */
  _createOrbits() {
    const { scene } = this;
    Object.keys(this.planets).forEach((k) => {
      if (k === 'sun') {
        return;
      }
      const planet = this.planets[k];
      const geometry = new THREE.CircleGeometry(this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset), 128 * 2);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
      line.rotation.x = Math.PI / 2;
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
  animate() {
    this.getMeshPlanets().forEach((item) => {
      if (item.name === 'sun') {
        return;
      }

      const planet = planets[item.name];

      if (this.enableSunOrbitAnimate && !this.targetObject) {
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
    mesh.position.z = this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset) * Math.sin(this.getPlanetPositionByName(planet.name));
    this.planetOrbitPosition[planet.name] += planet.sunOrbitRotationSpeed;
  }

  /**
   * Движение планет вокруг своей оси
   */
  runBySelfOrbit(planet, mesh) {
    mesh.rotation.y += this.config.calculateSelfSpeedRotation(planet.selfSpeedRotationRatio);
  }

  /**
   * Положение планеты на орбите солнца по имени планеты
   */
  getPlanetPositionByName(name) {
    return this.planetOrbitPosition[name];
  }

  /**
   *
   * @param Mesh target
   */
  setTargetObject(target) {
    this.targetObject = target;
  }

  /**
   * @return Mesh
   */
  getTargetObject() {
    return this.targetObject;
  }

  saveOverviewState() {
    this.overviewState = {
      cameraPosition: { ...this.camera.position },
      controlsTarget: { ...this.controls.target },
    };
  }

  runToOverview({ duration = 2000, onComplete } = {}) {
    if (!this.overviewState) return;
    const { controls, camera } = this;
    this.setTargetObject(null);
    this.showOrbits();

    const currentCameraPosition = { ...camera.position };
    const newCameraPosition = { ...this.overviewState.cameraPosition };

    const currentControlsTarget = { ...controls.target };
    const newControlsTarget = { ...this.overviewState.controlsTarget };

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableKeys = false;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;

    new TWEEN.Tween(currentControlsTarget)
      .to(newControlsTarget, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const { x, y, z } = currentControlsTarget;
        Object.assign(controls.target, { x, y, z });
      })
      .onComplete(() => {
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableKeys = true;
        controls.minDistance = this.config.radius(this.planets.sun.sizeRatio) * 4;
        controls.maxDistance = this.sceneSize / 3;
        if (onComplete) onComplete();
      })
      .start();

    new TWEEN.Tween(currentCameraPosition)
      .to(newCameraPosition, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const { x, y, z } = currentCameraPosition;
        Object.assign(camera.position, { x, y, z });
      })
      .start();
  }

  /**
   * Движение в сторону планеты
   */
  runToPlanet(objectName, { duration = 2000, onComplete } = {}) {
    const { camera, controls } = this;
    const targetObject = this.getMeshPlanets().filter(obj => obj.name === objectName)[0];
    if (!targetObject || targetObject === this.targetObject) return;
    if (!this.targetObject) {
      // Save overview state
      this.saveOverviewState();
    }

    this.setTargetObject(targetObject);
    this.hideOrbits();

    const planet = this.planets[targetObject.name];

    const orbitPosition = this.getPlanetPositionByName(planet.name);
    const newPositionX = config.orbitRadiusCalculate(this.planets.sun, (planet.radiusOffset || 0) - this.config.radius(planet.sizeRatio) * 3) * Math.cos(orbitPosition + planet.sunOrbitRotationSpeed);
    const newPositionY = 0;
    const newPositionZ = config.orbitRadiusCalculate(this.planets.sun, (planet.radiusOffset || 0) - this.config.radius(planet.sizeRatio) * 3) * Math.sin(orbitPosition + planet.sunOrbitRotationSpeed);

    const currentTarget = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const newPositon = {
      x: newPositionX,
      y: newPositionY,
      z: newPositionZ,
    };

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableKeys = false;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;

    const currentControlsTarget = { ...controls.target };
    const newControlsTarget = { ...targetObject.position };

    new TWEEN.Tween(currentControlsTarget)
      .to(newControlsTarget, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const { x, y, z } = currentControlsTarget;
        Object.assign(controls.target, { x, y, z });
      })
      .onComplete(() => {
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableKeys = true;
        controls.minDistance = this.config.radius(planet.sizeRatio) * 2;
        controls.maxDistance = this.config.radius(planet.sizeRatio) * 5;
        if (onComplete) onComplete();
      })
      .start();

    new TWEEN.Tween(currentTarget)
      .to(newPositon, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.position.x = currentTarget.x;
        camera.position.y = currentTarget.y;
        camera.position.z = currentTarget.z;
      })
      .start();
  }
}

export default SolarSystem;
