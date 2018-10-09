import { Component, OnInit, ElementRef, ViewChild, Input} from '@angular/core';
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
      y: 20,
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
	basePath = window.location.href;

	world = {
		stats: 'fps', // fps, ms, mb or false if not need.
		autoresize: 'window',
	
		gravity: [0, -1, 0],
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
				new WHS.DefineModule('camera', new WHS.OrthographicCamera({	camera: {far: 1000	},position: {	z:500}})),
				new WHS.RenderingModule(this.appDefaults.rendering, {shadow: false}),
				new PHYSICS.WorldModule(this.appDefaults.physics),
				new WHS.OrbitControlsModule(),
				// new StatsModule(),
				// new WHS.ResizeModule()
		]);
  }

  public build() {

		const offsetY = -200;
		const grids = 14;
		const diceSize = 20;
		const gridWidth = 40;
		const barWidth = 4;
		const backWidth = 1500;
		const backHeight = 1000;


		// bar material

		

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

    const dice = new WHS.Box({ 
			geometry: {
				width: diceSize,
				height: diceSize,
				depth: diceSize
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 500,
					restitution: 1.5,
					friction: 1,
				})
			],
	
			material: diceMaterials,//new THREE.MeshPhongMaterial({color: 0x447F8B}),
			position: new THREE.Vector3(- gridWidth / 2 + (5 * Math.random() * (Math.random()>.5?1:-1)), gridWidth * (grids + 1) * Math.sin(Math.PI / 3) + offsetY, 0)
		});

		dice.addTo(this._container);

		dice.on('collision', (otherObject, v, r, contactNormal) => {
			if (otherObject.component.modules[0].data.type === 'cylinder') {
				otherObject.material.color.setHex(0xff0000)
				// otherObject.material.color = 0xff0000;
			}
		});

	
		for (let i = grids; i > 0; i--) {
			for (let j = 0; j < i; j++ ) {
				new WHS.Cylinder({
					geometry: {
						radiusTop: barWidth,
						radiusBottom: barWidth,
						height: gridWidth
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
						x: j * gridWidth - gridWidth * i / 2,
						y: gridWidth * Math.sin(Math.PI/3) * (grids - i + 1) + offsetY
					}
				}).addTo(this._container);
			}

 			new WHS.Box({ 
				geometry: {
					width: barWidth / 2,
					height: gridWidth * Math.sin(Math.PI / 3),
					depth: gridWidth
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
					y: offsetY + gridWidth * Math.sin(Math.PI/3) / 2,
					x: (i - grids / 2 - 1) * gridWidth
				}
			}).addTo(this._container);
		}

		
		// back
		new WHS.Box({ 
			geometry: {
				width: backWidth,
				height: backHeight,
				depth: barWidth 
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
				z: - gridWidth / 2,
				y: 0
			}
		}).addTo(this._container);

		// front
		new WHS.Box({ 
			geometry: {
				width: backWidth,
				height: backHeight,
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
				z: gridWidth / 2 + .1,
				y: 0
			}
		}).addTo(this._container);

		// bottom
    new WHS.Box({ 
			geometry: {
				width: gridWidth * (grids + 2),
				height: barWidth / 2,
				depth: gridWidth
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
				y: offsetY,
				x: - gridWidth / 2
			}
		}).addTo(this._container);

		// left
    new WHS.Box({ 
			geometry: {
				width: gridWidth * (grids + 2),
				height: barWidth / 2,
				depth: gridWidth
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
				x: -gridWidth * Math.sin(Math.PI/3) * (grids / 3 + 0.5) ,
				y: offsetY + gridWidth * (grids + 2) / 2 * Math.sin(Math.PI/3)
			},

			rotation: {
				z: Math.PI / 3
			}
		}).addTo(this._container);

		// right
    new WHS.Box({ 
			geometry: {
				width: gridWidth * (grids + 2),
				height: barWidth / 2,
				depth: gridWidth
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
				x: gridWidth * Math.sin(Math.PI / 3) * (grids / 3 - 0.5) - barWidth ,
				y: offsetY + gridWidth * (grids + 2) / 2 * Math.sin(Math.PI/3)
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
		// new WHS.Loop(() => {
		// 	box.rotation.y += 0.02;
		// }).start(this._container);
  }

  ngOnInit() {
    this.createContainer();
    this.build();
  }

 
}

 		// const teapot = new WHS.Importer({
		// 	url: `assets/model/utah-teapot-light.json`,
		
		// 	modules: [
		// 		new PHYSICS.ConcaveModule({
		// 			friction: 0.5,
		// 			mass: 1,
		// 			restitution: 0.5,
		// 			path: `assets/model/utah-teapot-light.json`,
		// 			scale: new THREE.Vector3(1, 2, 1)
		// 		}),
		// 		new WHS.TextureModule({
		// 			url: `assets/dice.png`,
		// 			repeat: new THREE.Vector2(1, 1)
		// 		})
		// 	],
		
		// 	useCustomMaterial: true,
		
		// 	material: new THREE.MeshPhongMaterial({
		// 		shading: THREE.SmoothShading,
		// 		side: THREE.DoubleSide
		// 	}),
		
		// 	position: {
		// 		y: 200
		// 	},
		
		// 	scale: [1,1,1]
		// });

		// teapot.addTo(this._container);