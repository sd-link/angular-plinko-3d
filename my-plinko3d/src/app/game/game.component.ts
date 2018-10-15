import { Component, OnInit, ElementRef, ViewChild, Input} from '@angular/core';
import * as THREE from 'three-full';
import {BasicParam} from './config';
import { PlinkoService } from '../../service/plinko.service';


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
	private diceMaterials: any;

	subscription = null;

	holeObject: any[];
	diceObject: any[];
	diceIsEnable: boolean[];
	diceIsReached: boolean[];
	
	planOne: number[];
	planAll: any[];
	routerObject = [];
	routerSkewObject = [];


	startable: boolean = true;

	@ViewChild('rendererContainer') rendererContainer: ElementRef;

	basePath = window.location.href;
 
	appDefaults = {
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
			gravity: new THREE.Vector3(0, -400, 0),
			ammo: `${this.basePath}/assets/ammo.js`
		}
	};
 

	constructor( public plinkoService: PlinkoService) { 
    this.subscription = this.plinkoService.eventOccured.subscribe(event => {
			this.fallDice();
    });
	}
	ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
		}
	}

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



		// dice mertarial
		const loader = new THREE.TextureLoader();
		this.diceMaterials = [
			[
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice1.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice2.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice3.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice4.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice5.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/red/dice6.png'),
						transparent: true 
				})
			],
			[
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice1.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice2.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice3.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice4.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice5.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/green/dice6.png'),
						transparent: true 
				})
			],
			[
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice1.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice2.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice3.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice4.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice5.png'),
						transparent: true 
				}),
				new THREE.MeshLambertMaterial({
						map: loader.load( 'assets/model/blue/dice6.png'),
						transparent: true 
				})
			]
		];


 
		this.holeObject = [];
		this.routerObject = [];
		this.routerSkewObject = [];
 

		for (let i = BasicParam.grids; i > -1; i --) {
			
			// bottom
			this.holeObject.push(new WHS.Box({ 
				geometry: {
					width: BasicParam.gridWidth - 3 ,
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
					x: BasicParam.gridWidth * i - (BasicParam.grids / 2) * BasicParam.gridWidth - BasicParam.gridWidth * .5
				}
			}));

			const k = BasicParam.grids - i;
			this.holeObject[k].on('collision', (otherObject, v, r, contactNormal) => {
				this.holeObject[k].material.color.setHex(0xffffff);
				setTimeout(()=>{
					this.holeObject[k].material.color.setHex(0x447F8B)
				}, 300);
			});
			this.holeObject[k].addTo(this._container);

			if (i === 0) break;

			// router
			this.routerObject[i - 1] = [];
			this.routerSkewObject[i - 1] = [];
			const routY = BasicParam.gridWidth * Math.sin(Math.PI/3) * (BasicParam.grids - i + 1.5) + BasicParam.offsetY;
			// bars
			for (let j = 0; j < i; j++ ) {
				

				const bar = new WHS.Cylinder({
					geometry: {
						radiusTop: BasicParam.barWidth,
						radiusBottom: BasicParam.barWidth,
						height: BasicParam.gridWidth * 0.7
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
				});
				
				bar.on('collision', (otherObject, v, r, contactNormal) => {
					bar.material.color.setHex(0xffffff);
					setTimeout(()=>{
						bar.material.color.setHex(0x447F8B)
					}, 500);
				});				
				
				bar.addTo(this._container);

				// router
				this.routerObject[i - 1][j] = [];
				this.routerSkewObject[i - 1][j] = [];

				for (let k = 0; k < 2; k ++) {
					

					this.routerObject[i - 1][j][k] = new WHS.Box({
						geometry: {
							width: 2,
							height: BasicParam.diceSize * 2,
							depth: BasicParam.gridWidth,
							segments: 5,
						},
					
						material: new THREE.MeshBasicMaterial({
							color: 0x447F8B,
							transparent: true,
							opacity: 0.00,
						}),
					
						modules: [
							new PHYSICS.BoxModule({
								mass: 0,
							})
						],
	
						// rotation: {
						// 	z: k ? - Math.PI / 40 : Math.PI / 40
						// },
						
						position: {
							x: j * BasicParam.gridWidth - BasicParam.gridWidth * i / 2 + BasicParam.gridWidth * (k ? .25 : -.25),
							y: routY + BasicParam.diceSize * 2 / 3
						}
					});

					this.routerSkewObject[i - 1][j][k] = new WHS.Box({
						geometry: {
							width: 2,
							height: BasicParam.diceSize,
							depth: BasicParam.gridWidth,
							segments: 5,
						},
					
						material: new THREE.MeshBasicMaterial({
							color: 0x447F8B,
							transparent: true,
							opacity: 0.00,
						}),
					
						modules: [
							new PHYSICS.BoxModule({
								mass: 0,
							})
						],
	
						rotation: {
							z: k ? - Math.PI / 6 : Math.PI / 6
						},
						
						position: {
							x: j * BasicParam.gridWidth - BasicParam.gridWidth * i / 2 + BasicParam.gridWidth * (k ? .3 : -.3),
							y: routY - BasicParam.diceSize / 2 + 5
						}
					});

					const pan2 = new WHS.Box({
						geometry: {
							width: 2,
							height: BasicParam.diceSize,
							depth: BasicParam.gridWidth,
							segments: 5,
						},
					
						material: new THREE.MeshBasicMaterial({
							color: 0x447F8B,
							transparent: true,
							opacity: 1.00,
						}),
					
						modules: [
							new PHYSICS.BoxModule({
								mass: 0,
							})
						],
	
						rotation: {
							z: k ? - Math.PI / 6 : Math.PI / 6
						},
						
						position: {
							x: j * BasicParam.gridWidth - BasicParam.gridWidth * i / 2 + BasicParam.gridWidth * (k ? .24 : -.24),
							y: BasicParam.gridWidth * Math.sin(Math.PI/3) * (BasicParam.grids - i + 1.5) + BasicParam.offsetY
						}
					});

					this.routerObject[i - 1][j][k].addTo(this._container);
					this.routerSkewObject[i - 1][j][k].addTo(this._container);


				}
			}
			

			// vertical lines
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
					opacity: 0.5
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
				depth: BasicParam.barWidth + BasicParam.barWidth
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

		// left
    new WHS.Box({ 
			geometry: {
				width: BasicParam.gridWidth * (BasicParam.grids + 2),
				height: BasicParam.barWidth / 2,
				depth: BasicParam.gridWidth
			},
	
			modules: [
				new PHYSICS.BoxModule({
					mass: 0,
					restitution: 1,
					friction: 2,
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B
			}),

			position: {
				x: -BasicParam.gridWidth * Math.sin(Math.PI / 3) * (BasicParam.grids / 3 + 0.5) ,
				y: BasicParam.offsetY + BasicParam.gridWidth * (BasicParam.grids + 2) / 2 * Math.sin(Math.PI / 3)
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
					mass: 0,
					restitution: 1,
					friction: 2,
				})
			],
	
			material: new THREE.MeshBasicMaterial({
				color: 0x447F8B
			}),

			position: {
				x: BasicParam.gridWidth * Math.sin(Math.PI / 3) * (BasicParam.grids / 3 - 0.5) - BasicParam.barWidth ,
				y: BasicParam.offsetY + BasicParam.gridWidth * (BasicParam.grids + 2) / 2 * Math.sin(Math.PI / 3)
			},

			rotation: {
				z: Math.PI * 2 / 3
			}
		}).addTo(this._container);

		
		const tableY = - 1000;//- (BasicParam.grids / 2 + 2) * BasicParam.gridWidth * Math.sin(Math.PI / 3);
		new WHS.Box({ 
			geometry: {
				width: BasicParam.gridWidth * BasicParam.dicesPerScreen * 2,
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
				x: 0,
				y: tableY
			}
		}).addTo(this._container);



		// dices
		this.diceObject = [];
		this.diceIsEnable = [];
		this.diceIsReached = [];
		for (let i = 0; i < BasicParam.dicesPerScreen; i ++) {
			const dice = new WHS.Box({ 
				geometry: {
					width: BasicParam.diceSize,
					height: BasicParam.diceSize,
					depth: BasicParam.diceSize,
					segments: 5,
				},
		
				modules: [
					new PHYSICS.BoxModule({
						mass: BasicParam.diceMass,
						restitution: BasicParam.diceRestitution,
						friction: BasicParam.diceFriction,
						pressure: 500
					})
				],
		
				material: new THREE.MeshPhongMaterial({color: 0x447F8B}),
				position: {
					x: BasicParam.diceSize * (i - BasicParam.dicesPerScreen / 2),
					y: tableY + BasicParam.diceSize / 2
				} 
			});
			this.diceObject.push(dice);
			this.diceIsEnable.push(true);
			this.diceIsReached.push(false);
			this.diceObject[i].addTo(this._container);

			this.diceObject[i].on('collision', (otherObject, v, r, contactNormal) => {
				
				if (!this.diceIsReached[i] && otherObject.position.y === BasicParam.offsetY) {
					console.log(this.diceObject[i])
					setTimeout(() => {
						this.diceObject[i]['position'] = new THREE.Vector3(BasicParam.diceSize * (i - BasicParam.dicesPerScreen / 2), tableY + BasicParam.diceSize / 2, 0);
						this.diceIsEnable[i] = true;
						this.startable = true;
					}, BasicParam.delayPeriod);
					this.diceIsReached[i] = true;
				}
			});
		};

		
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
		new WHS.Loop(() => {
		}).start(this._container);
  }

  ngOnInit() {
    this.createContainer();
    this.build();
	}
	
	start() {
		this.plinkoService.fallDice();
	}
	
	fallDice() {
		this.startable = false;
		

		this.planAll = [];
		this.planOne = [];
		this.getAllPlan(0);
		const plans = this.planAll.length;
		const selectedPlan = Math.floor(Math.random() * plans);
		
		console.log(this.plinkoService.dice, this.plinkoService.hole);
		console.log(this.planAll[selectedPlan]);
		
		this.makeRoute(this.planAll[selectedPlan]);
		this.holeObject[BasicParam.grids - this.plinkoService.hole].material.color.setHex(0xff00ff);
 

		for (let i = 0; i < BasicParam.dicesPerScreen; i ++) {
			if (this.diceIsEnable[i]) {
				this.diceObject[i]['material'] = this.diceMaterials[this.plinkoService.dice];
				this.diceObject[i]['position'] = new THREE.Vector3(- BasicParam.gridWidth / 2, BasicParam.gridWidth * (BasicParam.grids + 1) * Math.sin(Math.PI / 3) + BasicParam.offsetY, 0);
				this.diceObject[i]['visible'] = true;
				this.diceIsEnable[i] = false;
				this.diceIsReached[i]= false;
				break;
			}
		}
	 }
	 
	 getAllPlan(k) {
		if (k >= BasicParam.grids + 1) {
			if (this.planOne[k - 1] === this.plinkoService.hole) {
				this.planAll.push(JSON.stringify(this.planOne));
			}
			return;
		} else {
			for (let i = 0; i <= k; i ++) {
				if (k === 0 || this.planOne[k - 1] === i || i - this.planOne[k - 1] === 1) {
					this.planOne[k] = i;
					this.getAllPlan(k + 1);
				}
			}
		}
	}

	makeRoute(strPath) {
		const path = JSON.parse(strPath);
		let fk = null;
		for (let i = 0; i < BasicParam.grids; i ++) {
			for (let j = 0; j < i + 1; j ++) {
				for (let k = 0; k < 2; k ++) {
					this.routerObject[i][j][k]['position']['z'] = 0;
					this.routerSkewObject[i][j][k]['position']['z'] = -100;
					if (path[i] === j) {
						let sk = path[i+1] - path[i];
						
						if (sk === k) {
							this.routerObject[i][j][k]['position']['z'] = -100;
							this.routerSkewObject[i][j][k]['position']['z'] = -100;
						} else {
							if (fk === sk) {
								this.routerObject[i][j][k]['position']['z'] = -100;
								this.routerSkewObject[i][j][k]['position']['z'] = 0;
								 			
							} else {
								this.routerObject[i][j][k]['position']['z'] = 0;
								this.routerSkewObject[i][j][k]['position']['z'] = -100;
							}
							fk = sk;
						}
						
					} else {
						this.routerObject[i][j][k]['position']['z'] = -100;
					}
					

				}
			}
		}
	}
}

 
 
 