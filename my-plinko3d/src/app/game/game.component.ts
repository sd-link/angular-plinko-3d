import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as THREE from 'three-full';
import {
  CameraComponentParams,
  App } from 'whs';

import * as WHS from 'whs/build/whs';
import * as PHYSICS from 'physics-module-ammonext' 
 
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private _container: App;
	@ViewChild('rendererContainer') rendererContainer: ElementRef;
  @Input() public camera: CameraComponentParams = {
    position: {
      y: 10,
      z: 50
    },
  };

  @Input() public rendering = {
    bgColor: 0x162129,
    renderer: {
      antialias: true,
      shadowmap: {
        type: THREE.PCFSoftShadowMap,
      },
    }
	};

	world = {
		stats: 'fps', // fps, ms, mb or false if not need.
		autoresize: 'window',
	
		gravity: [0, -100, 0],
	
		camera: {
			position: [0, 10, 50]
		},
	
		rendering: {
			background: {
				color: 0x162129
			},
	
			pixelRatio: false,
	
			renderer: {
				antialias: true
			}
		},
	
		shadowmap: {
			type: THREE.PCFSoftShadowMap
		}
	};
	appDefaults = {
		camera: {
			position: new THREE.Vector3(0, 10, 50),
			far: 200
		},
	
		rendering: {
			bgColor: 0x162129,
	
			pixelRatio: window.devicePixelRatio,
	
			renderer: {
				antialias: true,
	
				shadowMap: {
					type: THREE.PCFSoftShadowMap
				}
			}
		},
	
		physics: {
			ammo: 'https://rawgit.com/WhitestormJS/physics-module-ammonext/master/vendor/ammo.js'
		}
	};
 
	colors = {
		bg: 0x162129,
		plane: 0x447F8B,
		mesh: 0xF2F2F2,
		softbody: 0x434B7F
	};







	constructor() { }
	private createContainer() {
    this._container = new App([ 
				new WHS.ElementModule(),
				new WHS.SceneModule(),
				new WHS.DefineModule('camera', new WHS.PerspectiveCamera(Object.assign(this.appDefaults.camera, {fov: 75}))),
				new WHS.RenderingModule(this.appDefaults.rendering, {shadow: true}),
				new PHYSICS.WorldModule(this.appDefaults.physics),
				new WHS.OrbitControlsModule(),
				// new StatsModule(),
				new WHS.ResizeModule()
		]);
  }

  public build() {
    // Sphere
    const sphere = new WHS.Cylinder({ // Create sphere comonent.
			geometry: {
				radiusTop: 2,
				radiusBottom: 1,
				height: 2,
				radiusSegments: 32,
				heightSegments: 32,
			},
		
			modules: [
				new PHYSICS.CylinderModule({
					mass: 2,
					restitution: 1
				})
			],
		
			material: new THREE.MeshPhongMaterial({
				color: this.colors.mesh
			}),
		
			position: new THREE.Vector3(0, 20, 0)
		});


		

    sphere.addTo(this._container);
    // Plane
    const plane = new WHS.Plane({
			geometry: {
				width: 500,
				height: 500
			},
	
			modules: [
				new PHYSICS.PlaneModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshPhongMaterial({color: 0x447F8B}),
	
			rotation: {
				x: -Math.PI / 2
			}
		});
		plane.addTo(this._container);

		
    // Lights
    new WHS.PointLight({
      light: {
        intensity: 0.5,
        distance: 100
      },

      shadow: {
        fov: 90
      },

      position: new THREE.Vector3(0, 10, 10)
    }).addTo(this._container);

    new WHS.AmbientLight({
      light: {
        intensity: 0.4
      }
    }).addTo(this._container);

    // Start the app
		this._container.start();
		// new WHS.Loop(() => {
		// 	box.rotation.y += 0.02;
		// }).start(this._container);
  }

  ngOnInit() {
    console.log(this.rendererContainer.nativeElement.querySelector('.world'));
    this.createContainer();
    this.build();
  }

 
}
