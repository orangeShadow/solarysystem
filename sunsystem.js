/*jshint esversion: 6 */

const fov = 90;
const zPosition = 3500;
const sceneSize = 10000;
const gui = new dat.GUI();


const config = { 
    earthSize:12,
    earthRotation:0.018,
    diam: function(ratio){
        return config.earthSize*ratio;
    },
    orbitRadiusCalculate(sun, radiusOffset) {
        return config.diam(sun.diamRation) + radiusOffset;
    },
    calculateSelfSpeedRoration(selfSpeedRorationRatio) {     
        return config.earthRotation * selfSpeedRorationRatio;
    }
};

const planets  = {
    "sun": {
        material: "basic",
        name: "sun",
        textureImg: './imgs/sunmap.jpg',
        light: {
            color: 0xffffff,
            intensity:2,
            distance:0,
            decay:2,
            position: new THREE.Vector3(0,0,0)
        },
        diamRation: 100,
        selfSpeedRorationRatio:0.000124,
        sunOrbitRotationSpeed: 0, //does not use for sun
        orbit:0 //does not use for sun,

    },
    "mercury": {
        material: "lambert",
        name: "mercury",
        textureImg: './imgs/mercurymap.jpg', 
        diamRation: 0.41,
        selfSpeedRorationRatio:0.001,
        sunOrbitRotationSpeed: 0.011,
        radiusOffset: 50,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },
    "venus": {
        material: "lambert",
        name: "venus",
        textureImg: './imgs/venusmap.jpg', 
        diamRation: 0.95,
        selfSpeedRorationRatio:0.002,
        sunOrbitRotationSpeed: 0.004,
        radiusOffset: 100,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },
    "earth": {
        "satellites": {
            "moon": {
                material: "lambert",
                name: "moon",
                textureImg: './imgs/moonmap1k.jpg',
                selfSpeedRorationRatio: 0.018,
                position: new THREE.Vector3(19, 0, 0),
            }
        },
        material: "lambert",
        name: "earth",
        textureImg: './imgs/earthmap1k.jpg',        
        diamRation: 0.95,
        selfSpeedRorationRatio:1,
        sunOrbitRotationSpeed: 0.0029,
        radiusOffset: 150,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);            
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit += this.sunOrbitRotationSpeed;
            mesh.children.forEach((item) => {                 
                if(typeof(this.satellites[item.name]) !== "undefined" && his.satellites[item.name].animate) {
                    this.satellites[item.name].animate(item, orbitRadiusCalculate, calculateSelfSpeedRoration);
                }                                
            });
        }
    },
    "mars": {
        material: "lambert",
        name: "mars",
        textureImg: './imgs/marsmap1k.jpg', 
        diamRation: 0.95,
        selfSpeedRorationRatio: 0.97,
        sunOrbitRotationSpeed: 0.0024,
        radiusOffset: 200,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },
    "upiter": {
        material: "lambert",
        name: "upiter",
        textureImg: './imgs/jupiter2_1k.jpg', 
        diamRation: 10,
        selfSpeedRorationRatio: 2.4,
        sunOrbitRotationSpeed: 0.0013,
        radiusOffset: 700,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },
    "saturn": {
        material: "lambert",
        name: "saturn",
        textureImg: './imgs/saturnmap.jpg', 
        diamRation: 8.9,
        selfSpeedRorationRatio: 2.4,
        sunOrbitRotationSpeed: 0.00096,
        radiusOffset: 1400,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },

    "uranus": {
        material: "lambert",
        name: "uranus",
        textureImg: './imgs/uranusmap.jpg', 
        diamRation: 3.85,
        selfSpeedRorationRatio:1.4,
        sunOrbitRotationSpeed: 0.00068,
        radiusOffset: 2800,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    },
    "neptune": {
        material: "lambert",
        name: "neptune",
        textureImg: './imgs/neptunemap.jpg', 
        diamRation: 2.4,
        selfSpeedRorationRatio:1.7,
        sunOrbitRotationSpeed: 0.00054,
        radiusOffset: 4490,
        orbit:0,
        animate(mesh, orbitRadiusCalculate, calculateSelfSpeedRoration) {                                         
            mesh.position.x = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.cos(this.orbit);
            mesh.position.y = orbitRadiusCalculate(planets.sun, this.radiusOffset)*Math.sin(this.orbit);
            mesh.rotation.y += calculateSelfSpeedRoration(this.selfSpeedRorationRatio);
            this.orbit +=this.sunOrbitRotationSpeed;
        }
    }
}

class SolarSystemCreator {
    constructor(planets, config) {
        this.config = config;
        this.planets = planets;
        this.meshPlanets = [];
        this.meshOrbits = [];     
        this.enableSkybox = true;  
        this.enableOrbit = true; 
    }

    /**
     * Create solar system with skybox, planets, orbit
     * 
     * @param scene 
     * @param int sceneSize
     */
    createSolarSystem(scene, sceneSize) {
        if(this.enableSkybox) {
            scene.add(this._createSkybox(sceneSize));
        }
        
        
        let solarSystem =  new THREE.Object3D();     
        scene.add(solarSystem);
        for(let k in this.planets) {    
            let planet = planets[k];            
            let mesh = this._createPlanetMesh(planet); 
            solarSystem.add(mesh);                        
            if(planet.light) {                
                let light = new THREE.PointLight( planet.light.color, planet.light.intensity, planet.light.distance, planet.light.decay);
                light.position.set(planet.light.position.x, planet.light.position.y, planet.light.position.z);              
                mesh.add(light);
            }
            this.meshPlanets.push(mesh);
        }
        
        this.solarSystem = solarSystem; 

        if(this.enableOrbit) {
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
            let video = document.getElementById(planet.textureVideo );
            texture = new THREE.VideoTexture( video );
        } else {
            texture =  new THREE.TextureLoader().load(planet.textureImg);
        }
 
        let geometry	= new THREE.SphereGeometry(this.config.diam(planet.diamRation), 64, 64);
        
        if(planet.material === 'basic') {
            material	= new THREE.MeshBasicMaterial({
                map		: texture,
            });            
        } else if(planet.material === "lambert") {
            material	= new THREE.MeshLambertMaterial({
                map		: texture,
            });     
        }
        
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = planet.name;
        
        if(planet.satellites) {
            for(let k in planet.satellites){
                let sattelite = planet.satellites[k];
                let satteliteMesh = this._createPlanetMesh(sattelite);
                mesh.add(satteliteMesh);                
            }
        }

        if(planet.position) {
            mesh.position.copy(planet.position);
            //mesh.position.set(planet.position.x, planet.position.y, planet.position.z);
        }

        if(planet.radius) {
            mesh.position.x = planet.radius;
            mesh.position.y = planet.radius;
        }

        mesh.rotation.x= Math.PI/2;
    
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
                map		: (new THREE.TGALoader()).load('./imgs/ame_nebula/purplenebula_ft.tga'),				
                side: THREE.DoubleSide,
                color: 0xffffff,
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TGALoader().load("./imgs/ame_nebula/purplenebula_bk.tga"), 
                side: THREE.DoubleSide,
                color: 0xffffff,
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TGALoader().load("./imgs/ame_nebula/purplenebula_up.tga"), 
                side: THREE.DoubleSide,
                color: 0xffffff,
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TGALoader().load("./imgs/ame_nebula/purplenebula_dn.tga"), 
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TGALoader().load("./imgs/ame_nebula/purplenebula_rt.tga"), 
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TGALoader().load("./imgs/ame_nebula/purplenebula_lf.tga"), 
                side: THREE.DoubleSide
            })
        ];

        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials); 

        return skybox;
    }

    /**
     * Create orbits for planets
     * @param scene 
     */
    _createOrbits(scene) {
        for(let k in this.planets) { 
            if (k === "sun") {
                continue;
            }
            let planet = this.planets[k];
            let geometry = new THREE.CircleGeometry( this.config.orbitRadiusCalculate(this.planets.sun, planet.radiusOffset), 128 );
            let edges = new THREE.EdgesGeometry( geometry );
            let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, opacity:0.1 } ) );        
            this.meshOrbits.push(line);
            scene.add( line );            
        }
    }

    hideOrbits() {
        this.getMeshOrbits().forEach(item=>{
            item.visible = false;
        });   
    }

    showOrbits() {
        this.getMeshOrbits().forEach(item=>{
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
        this.getMeshPlanets().forEach((item)=>{
            const axes = new THREE.AxesHelper(30);
            axes.material.depthTest = false;
            axes.renderOrder = 1;
            axes.size = item.radius+10;
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
}

window.onload = function(){
    
    width = window.innerWidth;
    height = window.innerHeight;
     
    const canvas = document.getElementById('canvas');
    const raycaster = new THREE.Raycaster();    
    const mouse = new THREE.Vector2();
    
    const renderer = new THREE.WebGLRenderer({
        canvas:canvas,
        antialias: true
    }); 
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    
    const scene = new THREE.Scene();
    
    //Создаем камеру
    const camera = new THREE.PerspectiveCamera(fov, width/height, 0.1, sceneSize);
    camera.position.set(0,0,zPosition);

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
            
    solarSystemCreator = new SolarSystemCreator(planets, config);

    solarSystemCreator.enableSkybox = false;
    //solarSystemCreator.enableSkybox = false;

    solarSystemCreator.createSolarSystem(scene, sceneSize);

    //solarSystemCreator.showAxios();

    function onDocumentMouseDown( event ) 
    {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        requestAnimationFrame(() => {            
            var intersects = raycaster.intersectObjects( solarSystemCreator.getMeshPlanets());
            if(intersects.length > 0 ) {
                for ( var i = 0; i < intersects.length; i++ ) {                      
                    if (intersects[i].object.name === 'sun') {
                        continue;
                    }                    
                    targetObject = intersects[i].object;                
                    solarSystemCreator.hideOrbits(); 
                    break;                    
                    //const currentTarget = { ...controls.target };
                    //const newTarget = { ...targetObject.position};                                             
                    //camera.position.set(new THREE.Vector3(object.position.x-20, object.position.y-20, 100));
                    // const tween = new TWEEN.Tween(currentTarget)
                    //   .to(newTarget, 2000)
                    //   .easing(TWEEN.Easing.Quadratic.Out)
                    //   .onUpdate(() => { // Called after tween.js updates 'coords'.                  
                    //     controls.target.set(currentTarget.x, currentTarget.y, currentTarget.z);                                   
                    //     if(newTarget.x !== 0 && newTarget.y !== 0  && camera.position.z >= 100) {
                    //       camera.position.z-=10;    
      
                    //     } else if(newTarget.x == 0 && newTarget.y == 0  && camera.position.z <= 400) {
                    //       camera.position.z+=10;
                    //     }                        
                    //   })                
                    //   .start(); // Start the tween immediately.                
                  }      
            } else {
                solarSystemCreator.getSolarSystem().add(camera);
            }        
        });        
    }

    var targetObject = null;

    var controlsData = { 
        switchToSolarSystem () { 
            targetObject = null;  
            solarSystemCreator.showOrbits();
            camera.position.set(0, 0, zPosition);
            camera.lookAt(0,0,0);
            camera.rotation.z = 0;    
            camera.fov = fov;
            camera.updateProjectionMatrix();
            controls.enabled = true;   
        }
    }

    gui.add(controlsData, 'switchToSolarSystem');
    
    gui.open();

    function loop(time){     
        requestAnimationFrame( loop );        
        
        raycaster.setFromCamera( mouse, camera );
        //TWEEN.update(time);        
        if(targetObject && typeof planets[targetObject.name] !== 'undefined' ) {                    
            let planet = planets[targetObject.name];
            let position = new THREE.Vector3();
            targetObject.getWorldPosition(position);
            newX = (config.orbitRadiusCalculate(planets.sun,planet.radiusOffset-config.diam(planet.diamRation)*3))*Math.cos(planet.orbit);
            newY = (config.orbitRadiusCalculate(planets.sun,planet.radiusOffset-config.diam(planet.diamRation)*3))*Math.sin(planet.orbit);
            
            camera.lookAt(position);

            if(newX<0) {
                camera.rotation.z +=  Math.PI/2;  
            } else {
                camera.rotation.z -=  Math.PI/2;  
            }            
            
            camera.position.set(newX, newY, 0); 
                        
            camera.fov = 90;
            camera.updateProjectionMatrix();    
            
            controls.enabled = false;

        } else {
            controls.update();                        
        }
        
        solarSystemCreator.getMeshPlanets().forEach((item) => { 
            try {
                if(typeof planets[item.name] !== 'undefined' && planets[item.name].animate) {
                    planets[item.name].animate(item, config.orbitRadiusCalculate, config.calculateSelfSpeedRoration);                
                }                
            } catch(e) {
                //console.log(e.message);
            }            
        });         
        renderer.render( scene, camera);                
    }

    loop();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

