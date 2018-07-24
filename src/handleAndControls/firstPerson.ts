// import * as THREE from "three";
// import {Camera3D} from "../view3d/base/Camera3D";
// import {EttCamera} from "../entity/EttCamera";
// import {Constants3D} from "../view3d/Constants3D";
//
// export class FirstPersonControls {
//     public camera3d:THREE.Camera;
//
//     private ettCamera: EttCamera;
//
//     // 默认看向z轴负方向
//     public target:THREE.Vector3 = new THREE.Vector3(0, 0, -100);
//
//     public domElement:any;
//
//     public enabled:boolean = true;
//
//     public movementSpeed:number = 1.0;
//     public lookSpeed:number = 0.1;
//
//     private moveDirection: any;
//
//     private mouseDragOn:boolean= false;
//
//     private rotateStart:THREE.Vector2;
//     private rotateEnd:THREE.Vector2;
//     private rotateDelta:THREE.Vector2;
//
//     public constructor(cameraObject: Camera3D, domElement: any) {
//         this.moveDirection = {
//             forward: false,
//             backward: false,
//             left: false,
//             right: false,
//             up: false,
//             down: false
//         };
//
//         this.camera3d = cameraObject.object;
//         this.ettCamera = cameraObject.canvas.blueprint.firstPersonCamera;
//
//         this.domElement = (domElement !== undefined) ? domElement : document;
//         this.rotateStart = new THREE.Vector2();
//         this.rotateEnd = new THREE.Vector2();
//         this.rotateDelta = new THREE.Vector2();
//         this.addListener();
//     }
//
//     private onMouseDown(e:any) {
//         if (this.enabled === false) return;
//
//         e.preventDefault();
//         e.stopPropagation();
//
//         this.mouseDragOn = true;
//
//         this.rotateStart.set(e.clientX, e.clientY);
//     }
//     private onMouseMove(e:any) {
//         if (this.enabled === false) return;
//
//         e.preventDefault();
//         e.stopPropagation();
//
//         if (this.mouseDragOn) {
//
//             this.rotateEnd.set(e.clientX, e.clientY);
//             this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
//
//             this.rotateStart.copy(this.rotateEnd);
//
//             this.ettCamera.cameraRotation += THREE.Math.degToRad(this.rotateDelta.x * this.lookSpeed);
//             this.ettCamera.verticalAngle += THREE.Math.degToRad(this.rotateDelta.y * this.lookSpeed);
//
//             this.ettCamera.moveCamera2d = false;
//             this.ettCamera.rotateCamera3d = true;
//             this.ettCamera.rotateCamera2d = false;
//
//             this.ettCamera.dirty();
//
//         }
//     }
//     private onMouseUp(e:any) {
//         if (this.enabled === false) return;
//
//         e.preventDefault();
//         e.stopPropagation();
//
//         this.mouseDragOn = false;
//         this.ettCamera.rotateCamera3d = false;
//     }
//     private onKeyDown(e:any) {
//         if (this.enabled === false) return;
//
//         e.preventDefault();
//
//         switch (e.keyCode) {
//             case 38: /*up*/
//             case 87: /*W*/
//                 this.moveDirection.forward = true;
//                 break;
//             case 37: /*left*/
//             case 65: /*A*/
//                 this.moveDirection.left = true;
//                 break;
//             case 40: /*down*/
//             case 83: /*S*/
//                 this.moveDirection.backward = true;
//                 break;
//             case 39: /*right*/
//             case 68: /*D*/
//                 this.moveDirection.right = true;
//                 break;
//             case 81: /*Q*/
//                 this.moveDirection.up = true;
//                 break;
//             case 69: /*E*/
//                 this.moveDirection.down = true;
//                 break;
//         }
//     }
//     private onKeyUp(e:any) {
//         if (this.enabled === false) return;
//
//         e.preventDefault();
//
//         switch (e.keyCode) {
//             case 38: /*up*/
//             case 87: /*W*/
//                 this.moveDirection.forward = false;
//                 break;
//             case 37: /*left*/
//             case 65: /*A*/
//                 this.moveDirection.left = false;
//                 break;
//             case 40: /*down*/
//             case 83: /*S*/
//                 this.moveDirection.backward = false;
//                 break;
//             case 39: /*right*/
//             case 68: /*D*/
//                 this.moveDirection.right = false;
//                 break;
//             case 81: /*Q*/
//                 this.moveDirection.up = false;
//                 break;
//             case 69: /*E*/
//                 this.moveDirection.down = false;
//                 break;
//         }
//     }
//     public update(delta:any) {
//         if (this.enabled === false) return;
//
//         var result = false;
//         this.ettCamera.moveCamera3d = false;
//
//         for(var i in this.moveDirection) {
//             if(this.moveDirection[i]) {
//                 this.ettCamera.moveCamera3d = true;
//                 this.ettCamera.moveCamera2d = false;
//                 this.ettCamera.rotateCamera2d = false;
//
//                 this.moveCamera(delta, i);
//                 result = true;
//             }
//         }
//
//         if(result) {
//             this.ettCamera.dirty();
//         }
//
//         return result;
//
//     }
//     private moveCamera(delta:any, diretion: string) {
//         var cameraDirection = this.camera3d.getWorldDirection(this.ettCamera.targetPosition);
//         var actualMoveSpeed = this.movementSpeed * delta;
//         var speed;
//         var vy = new THREE.Vector3(0, 1, 0);
//         var projectV;
//
//         switch(diretion) {
//             case "forward":
//                 projectV = cameraDirection.projectOnPlane(vy).normalize();
//                 speed = actualMoveSpeed;
//                 break;
//             case "backward":
//                 projectV = cameraDirection.projectOnPlane(vy).normalize();
//                 speed = -actualMoveSpeed;
//                 break;
//             case "left":
//                 projectV = cameraDirection.projectOnPlane(vy).normalize();
//                 var temp = projectV.x;
//                 projectV.x = projectV.z;
//                 projectV.z = -temp;
//                 speed = actualMoveSpeed;
//                 break;
//             case "right":
//                 projectV = cameraDirection.projectOnPlane(vy).normalize();
//                 var temp = projectV.x;
//                 projectV.x = projectV.z;
//                 projectV.z = -temp;
//                 speed = -actualMoveSpeed;
//                 break;
//             case "up":
//                 if(cameraDirection.dot(vy) === 0) {
//                     projectV  = vy.negate();
//                 } else {
//                     projectV = cameraDirection.projectOnVector(vy).normalize();
//                 }
//                 speed = -actualMoveSpeed;
//                 break;
//             case "down":
//                 if(cameraDirection.dot(vy) === 0) {
//                     projectV  = vy.negate();
//                 } else {
//                     projectV = cameraDirection.projectOnVector(vy).normalize();
//                 }
//                 speed = actualMoveSpeed;
//                 break;
//         }
//
//         this.ettCamera.moveDirection = projectV;
//         this.ettCamera.speed = speed;
//
//         this.ettCamera.position.x += projectV.x * speed / Constants3D.CAMERA_MOVEMENT_RATIO;
//         this.ettCamera.position.y += projectV.z * speed / Constants3D.CAMERA_MOVEMENT_RATIO;
//         this.ettCamera.position.z += projectV.y * speed / Constants3D.CAMERA_MOVEMENT_RATIO;
//
//     }
//
//     public addListener() {
//         var onMouseDown = this.bind(this, this.onMouseDown);
//         var onMouseMove = this.bind(this, this.onMouseMove);
//         var onMouseUp = this.bind(this, this.onMouseUp);
//         var onKeyDown = this.bind(this, this.onKeyDown);
//         var onKeyUp = this.bind(this, this.onKeyUp);
//
//         this.domElement.addEventListener('mousemove', onMouseMove, false);
//         this.domElement.addEventListener('mousedown', onMouseDown, false);
//         this.domElement.addEventListener('mouseup', onMouseUp, false);
//
//         document.addEventListener('keydown', onKeyDown, false);
//         document.addEventListener('keyup', onKeyUp, false);
//     }
//     public removeListener() {
//         var onMouseDown = this.bind(this, this.onMouseDown);
//         var onMouseMove = this.bind(this, this.onMouseMove);
//         var onMouseUp = this.bind(this, this.onMouseUp);
//         var onKeyDown = this.bind(this, this.onKeyDown);
//         var onKeyUp = this.bind(this, this.onKeyUp);
//
//         this.domElement.removeEventListener('mousemove', onMouseMove, false);
//         this.domElement.removeEventListener('mousedown', onMouseDown, false);
//         this.domElement.removeEventListener('mouseup', onMouseUp, false);
//
//         document.removeEventListener('keydown', onKeyDown, false);
//         document.removeEventListener('keyup', onKeyUp, false);
//     }
//     public dispose() {
//         this.removeListener();
//     }
//     private bind(scope:any, fn:Function) {
//
//         return function () {
//
//             fn.apply(scope, arguments);
//
//         };
//
//     }
// }
//
// // public draw() {
// //     console.log("camera3d draw");
// //
// //     if(this.entity.moveCamera3d) {
// //         console.log("3d相机移动");
// //         this.camera.position.addScaledVector(this.entity.moveDirection, this.entity.speed);
// //     }
// //
// //     if(this.entity.rotateCamera3d) {
// //         console.log("3d相机旋转");
// //         this.updateCameraLookat();
// //     }
// //
// //     if(this.entity.moveCamera2d) {
// //         console.log("2d相机移动");
// //         this.updateCameraPosition();
// //     }
// //
// //     if(this.entity.rotateCamera2d) {
// //         console.log("2d相机旋转");
// //         this.updateCameraLookat();
// //     }
// //
// // }
// //
// // private updateCameraPosition() {
// //     this.object.position.x = Constants3D.CAMERA_MOVEMENT_RATIO * this.entity.position.x;
// //     this.object.position.z = Constants3D.CAMERA_MOVEMENT_RATIO * this.entity.position.y;
// // }
// //
// // private updateCameraLookat() {
// //
// //     var targetPosition = this.entity.targetPosition,
// //         position = this.camera.position;
// //     var deltaAngle = Math.PI / 2;
// //
// //     targetPosition.x = position.x + 100 * Math.cos(this.entity.cameraRotation - deltaAngle) * Math.sin(this.entity.verticalAngle);
// //     targetPosition.y = position.y + 100 * Math.cos(this.entity.verticalAngle);
// //     targetPosition.z = position.z + 100 * Math.sin(this.entity.cameraRotation - deltaAngle) * Math.sin(this.entity.verticalAngle);
// //
// //     this.camera.lookAt(targetPosition);
// // }
//
//
