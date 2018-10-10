import { Component, OnInit, ElementRef, ViewChild, Input} from '@angular/core';
import * as THREE from 'three-full';
import {BasicParam} from './config';

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
	private dice: any;
	fitstRoll = true;
	

	@ViewChild('rendererContainer') rendererContainer: ElementRef;

	basePath = window.location.href;
 
	appDefaults = {
		camera: {
			position: new THREE.Vector3(0, 0, 100),
			far: 300
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
			ammo: `${this.basePath}/assets/ammo.js`
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
				new WHS.DefineModule('camera', new WHS.OrthographicCamera({	camera: {far: 1000},position: {z:500}})),
				new WHS.RenderingModule(this.appDefaults.rendering, {shadow: false}),
				new PHYSICS.WorldModule(this.appDefaults.physics),
				// new WHS.OrbitControlsModule(),
				// new StatsModule(),
				// new WHS.ResizeModule()
		]);
  }

	
  public build() {



		// dice
		const loader = new THREE.TextureLoader();
		const diceMaterials = [
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice1.png'),
					transparent: true 
			}),
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice2.png'),
					transparent: true 
			}),
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice3.png'),
					transparent: true 
			}),
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice4.png'),
					transparent: true 
			}),
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice5.png'),
					transparent: true 
			}),
			new THREE.MeshLambertMaterial({
					map: loader.load( 'assets/model/dice6.png'),
					transparent: true 
			})
	 	];

    this.dice = new WHS.Box({ 
			geometry: {
				width: BasicParam.diceSize,
				height: BasicParam.diceSize,
				depth: BasicParam.diceSize
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: BasicParam.diceMass,
					restitution: BasicParam.diceRestitution,
					friction: BasicParam.diceFriction,
				})
			],
	
			material: diceMaterials,//new THREE.MeshPhongMaterial({color: 0x447F8B}),
			position: new THREE.Vector3(- BasicParam.gridWidth / 2 + (5 * Math.random() * (Math.random()>.5?1:-1)), BasicParam.gridWidth * (BasicParam.grids + 1) * Math.sin(Math.PI / 3) + BasicParam.offsetY, 0)
		});

		this.dice.on('collision', (otherObject, v, r, contactNormal) => {
			if (otherObject.component.modules[0].data.type === 'cylinder') {
				otherObject.material.color.setHex(0xffffff)
				setTimeout(()=>{
					otherObject.material.color.setHex(0x447F8B)
				}, 3000);
			}
		});

	
		for (let i = BasicParam.grids; i > 0; i--) {
			for (let j = 0; j < i; j++ ) {
				new WHS.Cylinder({
					geometry: {
						radiusTop: BasicParam.barWidth,
						radiusBottom: BasicParam.barWidth,
						height: BasicParam.gridWidth
					},
				
					material: new THREE.MeshBasicMaterial({
						color: 0x447F8B
					}),
				
					modules: [
						new PHYSICS.CylinderModule({
							mass: 0,
						})
					],

					rotation: {
						x: Math.PI/2
					},
					
					position: {
						x: j * BasicParam.gridWidth - BasicParam.gridWidth * i / 2,
						y: BasicParam.gridWidth * Math.sin(Math.PI/3) * (BasicParam.grids - i + 1) + BasicParam.offsetY
					}
				}).addTo(this._container);
			}

 			new WHS.Box({ 
				geometry: {
					width: BasicParam.barWidth / 2,
					height: BasicParam.gridWidth * Math.sin(Math.PI / 3),
					depth: BasicParam.gridWidth
				},
		
				modules: [
					new PHYSICS.BoxModule({
						mass: 0
					})
				],
		
				material: new THREE.MeshBasicMaterial({
					color: 0x447F8B,
					transparent: true,
					opacity: 0
				}),

				position: {
					y: BasicParam.offsetY + BasicParam.gridWidth * Math.sin(Math.PI/3) / 2,
					x: (i - BasicParam.grids / 2 - 1) * BasicParam.gridWidth
				}
			}).addTo(this._container);
		}

		
		// back
		new WHS.Box({ 
			geometry: {
				width: BasicParam.backWidth,
				height: BasicParam.backHeight,
				depth: BasicParam.barWidth 
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x000055
			}),

			position: {
				z: - BasicParam.gridWidth / 2,
				y: 0
			}
		}).addTo(this._container);

		// front
		new WHS.Box({ 
			geometry: {
				width: BasicParam.backWidth,
				height: BasicParam.backHeight,
				depth: 0
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B,
				transparent: true,
				opacity: 0
			}),

			position: {
				z: BasicParam.gridWidth / 2 + .1,
				y: 0
			}
		}).addTo(this._container);

		// bottom
    new WHS.Box({ 
			geometry: {
				width: BasicParam.gridWidth * (BasicParam.grids + 2),
				height: BasicParam.barWidth / 2,
				depth: BasicParam.gridWidth
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B
			}),

			position: {
				y: BasicParam.offsetY,
				x: - BasicParam.gridWidth / 2
			}
		}).addTo(this._container);

		// left
    new WHS.Box({ 
			geometry: {
				width: BasicParam.gridWidth * (BasicParam.grids + 2),
				height: BasicParam.barWidth / 2,
				depth: BasicParam.gridWidth
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B
			}),

			position: {
				x: -BasicParam.gridWidth * Math.sin(Math.PI/3) * (BasicParam.grids / 3 + 0.5) ,
				y: BasicParam.offsetY + BasicParam.gridWidth * (BasicParam.grids + 2) / 2 * Math.sin(Math.PI/3)
			},

			rotation: {
				z: Math.PI / 3
			}
		}).addTo(this._container);

		// right
    new WHS.Box({ 
			geometry: {
				width: BasicParam.gridWidth * (BasicParam.grids + 2),
				height: BasicParam.barWidth / 2,
				depth: BasicParam.gridWidth
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B
			}),

			position: {
				x: BasicParam.gridWidth * Math.sin(Math.PI / 3) * (BasicParam.grids / 3 - 0.5) - BasicParam.barWidth ,
				y: BasicParam.offsetY + BasicParam.gridWidth * (BasicParam.grids + 2) / 2 * Math.sin(Math.PI/3)
			},

			rotation: {
				z: Math.PI * 2 / 3
			}
		}).addTo(this._container);

		
    // Lights
    new WHS.PointLight({
      light: {
        intensity: 0.2,
        distance: 100
      },

      shadow: {
        fov: 90
      },

      position: new THREE.Vector3(0, 10, 10)
    }).addTo(this._container);

    new WHS.AmbientLight({
      light: {
        intensity: 1
      }
    }).addTo(this._container);

    // Start the app
		this._container.start();
 
  }

  ngOnInit() {
    this.createContainer();
    this.build();
	}
	
	dropDice() {
 		if (this.fitstRoll) {
			this.dice.addTo(this._container);
			this.fitstRoll = false;
		} 
		this.dice.position = new THREE.Vector3(- BasicParam.gridWidth / 2 + (5 * Math.random() * (Math.random()>.5?1:-1)), BasicParam.gridWidth * (BasicParam.grids + 1) * Math.sin(Math.PI / 3) + BasicParam.offsetY, 0)
 	}
}

 
 
 