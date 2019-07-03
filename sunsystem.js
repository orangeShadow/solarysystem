/*jshint esversion: 6 */

const config = { 
    earthSize:12,
    diam: function(ratio){
        return this.earthSize*ratio;
    }
};

const planets  = {
    "sun": {
        name: "Солнце",
        textureImg: './imgs/sunmap.jpg',
        indexNumber: 0,
        diamRation: 6,
        selfRotationSpeed:0.00000216,
        sunOrbitRotationSpeed: 0,
        
    },
    "mercury": {

    },
    "venus": {

    },
    "earth": {
        "satellite": {
            "moon": {

            }
        }
    },
    "mars": {

    },
    "upiter": {

    },
    "saturn":{

    },
    "uranus": {

    },
    "neptune": {

    }
}
var fov = 120;

var parameters = {    
    sun: null,
    earth: null,
    moon:null,
};
var gui = new dat.GUI();

class SunSystem {
    createPlanetMesh(size, texture, basic = 0) {
        var geometry	= new THREE.SphereGeometry(size, 64, 64);
        if(basic){
            var material	= new THREE.MeshBasicMaterial({
                map		: texture, //texture	 
            });            
        } else {
            var material	= new THREE.MeshLambertMaterial({
                map		: texture, //texture	 
            });     
        }
        
        
        let mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x= Math.PI/2;
        return mesh;
    }

    constructor(config) {                
        this.config = config;
    }
    
    getOrbit(numeric, offset = 0) {
        return  this.earthSize*6+50*numeric - offset;
    }

    createSun() {        
        let sun = planets.sun;
        if (planets.sun.textureVideo) {
            let video = document.getElementById( planets.sun.textureVideo );
            let texture = new THREE.VideoTexture( video );
        } else {
            let texture =  new THREE.TextureLoader().load('./imgs/sunmap.jpg');
        }
        
        let mesh = this.createPlanetMesh(this.config.diam(sun.diamRation), texture, 1);                
        mesh.name = "Sun";
        mesh.indexNumber=sun.indexNumber;
        mesh.animate = function(){
            return false;    
        }
        return mesh 
    }

    createMercury() {
        //Порядковый номер в системе                  
        let self = this;                
        let selfRotationSpeed = 0.001;
        let sunOrbinRotationSpeed =  0.0047;        
        let mesh = this.createPlanetMesh(this.earthSize/2.4, new THREE.TextureLoader().load('./imgs/mercurymap.jpg'));                

        mesh.name= "Mercury";
        mesh.orbit = 0;
        mesh.indexNumber=1;
        
        let radius = self.getOrbit(mesh.indexNumber);
        
        mesh.position.x =this.getOrbit(2);
        mesh.position.y= this.getOrbit(2);
        
        
        mesh.animate = function() {                                         
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }

        return mesh;           
    }

    createVenus() {
        //Порядковый номер в системе                   
        let self = this;                
        let selfRotationSpeed = 0.002;
        let sunOrbinRotationSpeed =  0.0035;
        

        let mesh = this.createPlanetMesh(this.earthSize*0.95, new THREE.TextureLoader().load('./imgs/venusmap.jpg'));                    

        mesh.name= "Venus";   
        mesh.orbit = 0;  

        mesh.indexNumber=2;   

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function() {                                         
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }


        return mesh;
    }

    createMoon() {
        let selfRotationSpeed = 0.018;
        let mesh = this.createPlanetMesh(this.earthSize/3.66, new THREE.TextureLoader().load('./imgs/moonmap1k.jpg'));                    

        mesh.name= "Moon";             
        mesh.position.x = 19;
        mesh.position.y= 0;           
        
        mesh.animate = function() {                                                     
            this.rotation.y += selfRotationSpeed;            
        }      

        return mesh;        
    }

    createEarth() {

        //Порядковый номер в системе             
        let self = this;                
        let selfRotationSpeed = 0.018;
        let sunOrbinRotationSpeed =  0.0029;
        
        let mesh = this.createPlanetMesh(this.earthSize, new THREE.TextureLoader().load('./imgs/earthmap1k.jpg'));                    
        let moon = this.createMoon();
        mesh.add(moon);
        mesh.name="Earth";
        mesh.orbit = 0;     
        mesh.indexNumber=3;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function() {                                         
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
            this.children().forEach((item) => {
                try { 
                    item.animate();
                } catch(e) {

                }
            });
        }

        return mesh;
    }

    createMars() {
        //Порядковый номер в системе
                
        let self = this;                
        let selfRotationSpeed = 0.06;
        let sunOrbinRotationSpeed =  0.0024;
    
        let mesh = this.createPlanetMesh(this.earthSize/1.8, new THREE.TextureLoader().load('./imgs/marsmap1k.jpg'));                    

        mesh.name="Mars";
        mesh.orbit = 0;
        mesh.indexNumber=4;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function(){
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }    

        return mesh;               
    }

    createUpiter() {
        //Порядковый номер в системе
                
        let self = this;                
        let selfRotationSpeed = 0.06;
        let sunOrbinRotationSpeed =  0.0013;
    
        let mesh = this.createPlanetMesh(this.earthSize*2.8, new THREE.TextureLoader().load('./imgs/jupiter2_1k.jpg'));                    

        mesh.name="Jupiter";
        mesh.orbit = 0;
        mesh.indexNumber=7;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function(){
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }    

        return mesh;               
    }

    createSaturn() {
        //Порядковый номер в системе
                
        let self = this;                
        let selfRotationSpeed = 0.06;
        let sunOrbinRotationSpeed =  0.00096;
    
        let mesh = this.createPlanetMesh(this.earthSize*2.4, new THREE.TextureLoader().load('./imgs/saturnmap.jpg'));                    

        mesh.name="Saturn";
        mesh.orbit = 0;
        mesh.indexNumber=9;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function(){
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }    

        return mesh;               
    }

    createUranus() {
        //Порядковый номер в системе
                
        let self = this;                
        let selfRotationSpeed = 0.06;
        let sunOrbinRotationSpeed =  0.00068;
    
        let mesh = this.createPlanetMesh(this.earthSize*2.4, new THREE.TextureLoader().load('./imgs/uranusmap.jpg'));                    

        mesh.name="Uran";
        mesh.orbit = 0;
        mesh.indexNumber=11;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function(){
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }    

        return mesh;               
    }

    createNeptune() {
        //Порядковый номер в системе
                
        let self = this;                
        let selfRotationSpeed = 0.06;
        let sunOrbinRotationSpeed =  0.00068;
    
        let mesh = this.createPlanetMesh(this.earthSize*2.4, new THREE.TextureLoader().load('./imgs/neptunemap.jpg'));                    

        mesh.name="Uran";
        mesh.orbit = 0;
        mesh.indexNumber=13;

        let radius = self.getOrbit(mesh.indexNumber);

        mesh.position.x = radius;
        mesh.position.y = radius;
        
        mesh.animate = function(){
            this.position.x = radius*Math.cos(this.orbit);
            this.position.y = radius*Math.sin(this.orbit);
            this.rotation.y += selfRotationSpeed;
            this.orbit +=sunOrbinRotationSpeed;
        }    

        return mesh;               
    }

    getSkybox() {
        const skyboxGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

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
}

class SunSystemCreator {
    constructor(config) {

        this._SunSystem = new SunSystem( config);

        let objects = [];
        let orbits = [];
        //add skyBox
        scene.add(this._SunSystem.getSkybox());
        
        let sunSystem =  new THREE.Object3D();    
        objects.push(sunSystem);
        scene.add(sunSystem);
        
        let sun = this._SunSystem.createSun();
        objects.push(sun);
        sunSystem.add(sun);
        
        //Создаем свет
        let light = new THREE.PointLight( 0xffffff, 2, 0, 2);
        light.position.set( 0, 0, 0 );
        sun.add(light);

        let planets = this._getPlanets();
        
        planets.forEach( (planet) => {    
            sunSystem.add(planet);
            objects.push(planet);
            orbits.push(this._drawOrbit(scene, planet.indexNumber-1));                    
        });
        
        this.sunSystem = sunSystem;
        this.planets = planets;
        this.objects = objects;
        this.orbits  = orbits;
    }

    getSunSystem() {
        return this.sunSystem; 
    }

    getObjects() {
        return this.objects;
    }

    getOrbits() {
        return this.orbits;
    }

    _getPlanets() {
        return [
            this._SunSystem.createMercury(),
            this._SunSystem.createVenus(),
            this._SunSystem.createEarth(),
            this._SunSystem.createMars(),            
            this._SunSystem.createUpiter(),
            this._SunSystem.createSaturn(),
            this._SunSystem.createUranus(),
            this._SunSystem.createNeptune(),            
        ];                
    }  

    _drawOrbit(scene, i) {
        let geometry = new THREE.CircleGeometry( this._SunSystem.getOrbit(i+1)-2, 128 );
        let edges = new THREE.EdgesGeometry( geometry );
        let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, opacity:0.1 } ) );        
        scene.add( line );
        return line;
    }

    addOrbits(scene){
        this.getOrbits().forEach(item => {
            scene.add(item);
        });
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
    const camera = new THREE.PerspectiveCamera(fov, width/height, 0.1, 5000);
    camera.position.set(0,0,1000);

    // const controls = new THREE.OrbitControls( camera, renderer.domElement );
    // let controlsTarget = {x:0, y:0, z:0};
            
    sunSystemCreator = new SunSystemCreator(scene, null, config);

    // sunSystemCreator.objects.forEach((item)=>{
    //     const axes = new THREE.AxesHelper(30);
    //     axes.material.depthTest = false;
    //     axes.renderOrder = 1;
    //     axes.size = item.radius+10;
    //     item.add(axes);
    // });
    

    var currentPlanet = null;;

    function onDocumentMouseDown( event ) 
    {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        requestAnimationFrame(() => {            
            var intersects = raycaster.intersectObjects( sunSystemCreator.objects);
            if(intersects.length > 0 ) {
                for ( var i = 0; i < intersects.length; i++ ) {                                   
                    targetObject = intersects[i].object;
                    //const currentTarget = { ...controls.target };
                    const newTarget = { ...targetObject.position};                         
                    
                    if (targetObject.indexNumber != 0) {
                        sunSystemCreator.getOrbits().forEach(item=>{
                            scene.remove(item);                     
                        });                 
                    }                    
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
                sunSystemCreator.getSunSystem().add(camera);
            }        
        });        
    }

    function onDocumentMouseScroll (event) {
        console.log("Scroll",event);
    }

    function onDocumentMouseWheel (event) {
        event.preventDefault();        
        console.log("Wheel",event);
    }

    var targetObject = null;

    var controlsData = new function() { 
        this.switchToSunSystem = function() { 
            targetObject = null;  
            sunSystemCreator.addOrbits(scene);
        };        
    }

    gui.add(controlsData, 'switchToSunSystem');
    
    gui.open();

    function loop(time){     
        raycaster.setFromCamera( mouse, camera );
        //TWEEN.update(time);        
        if(targetObject && targetObject.indexNumber !==0 ) {                    
            let position = new THREE.Vector3();
            targetObject.getWorldPosition(position);
            newX = (new SunSystem().getOrbit(targetObject.indexNumber)-40)*Math.cos(targetObject.orbit);
            newY = (new SunSystem().getOrbit(targetObject.indexNumber)-40)*Math.sin(targetObject.orbit);
            
            camera.lookAt(position);

            if(newX<0) {
                camera.rotation.z +=  Math.PI/2;  
            } else {
                camera.rotation.z -=  Math.PI/2;  
            }            
            
            camera.position.set(newX, newY, 0); 
            
            if(targetObject.name !== 'Jupiter') {
                camera.fov = 60;                    
                camera.updateProjectionMatrix();                   
            } else {
                camera.fov = 120;
                camera.updateProjectionMatrix();    
            } 
            
        } else {
            camera.position.set(0, 0, 400);
            camera.lookAt(0,0,0);
            camera.rotation.z = 0;    
            camera.fov = 120;
            camera.updateProjectionMatrix();                   
        }
    

        sunSystemCreator.getObjects().forEach((item) => { 
            try {
                item.animate();
            } catch(e) {
                //console.log(item.name);
            }            
        });                 
        renderer.render( scene, camera );

        requestAnimationFrame( loop );
    }

    loop();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'scroll', onDocumentMouseScroll, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );
}

