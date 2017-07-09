/* React Imports */
import React, { Component } from 'react';
import React3               from 'react-three-renderer';
import *      as THREE      from 'three';

/* CSS */
import '../css/App.css';

/* Assets */
// import logo from "../img/logo.svg";
// import pano from "../img/cornell_pano.jpg";

class App extends Component {
    componentDidMount () {
        this._renderTrigger();
        window.addEventListener('mousedown',      this.handleMouseDown,    false);
        window.addEventListener('mousemove',      this.handleMouseMove,    false);
        window.addEventListener('mouseup',        this.handleMouseUp,      false);
        window.addEventListener('mousewheel',     this.handleMouseWheel,   false);
        window.addEventListener('DOMMouseScroll', this.handleMouseWheel,   false);
        window.addEventListener('resize',         this.handleWindowResize, false);
    }
    constructor(props, context) {
        super(props, context);

        this._onManualRenderTriggerCreated = (renderTrigger) => {
            // assign to variable to be able to reuse the trigger
            this._renderTrigger = renderTrigger;
        };

        this.handleWindowResize = () => {
            this.setState({
                cameraAspect: window.innerWidth / window.innerHeight
            });
        };

        this.handleMouseDown = (event) => {
            event.preventDefault();
            this.setState({
                onPointerDownPointerX: event.clientX,
                onPointerDownPointerY: event.clientY,
                onPointerDownLon:      this.state.lon,
                onPointerDownLat:      this.state.lat
            });
        };

        this.handleMouseMove = (event) => {
            if (this.state.isUserInteracting === true) {
                this.setState({
                    lat: (event.clientY - this.state.onPointerDownPointerY) * 0.1 + this.state.onPointerDownLat,
                    lon: (this.state.onPointerDownPointerX - event.clientX) * 0.1 + this.state.onPointerDownLon
                });
            }
        };

        this.handleMouseUp = (event) => {
            this.setState({
                isUserInteracting: false
            });
        };

        this.handleMouseWheel = (event) => {
            if (event.wheelDeltaY) {
                // WebKit
                this.setState({
                   cameraFOV: this.state.cameraFOV - event.wheelDeltaY * 0.05
                });
            }
            else if (event.wheelDelta) {
                // Opera / Explorer 9
                this.setState({
                    cameraFOV: this.state.cameraFOV - event.wheelDelta * 0.05
                });
            }
            else if (event.detail) {
                // Firefox
                this.setState({
                    cameraFOV: this.state.cameraFOV + event.detail * 1.0
                });
            }
        };

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.);
        this.state = {
            cameraAspect: window.innerWidth / window.innerHeight,
            cameraFOV: 75,
            cameraPosition: new THREE.Vector3(0, 0, 5),
            cubeRotation: new THREE.Euler(),
            isUserInteracting: false,
            onPointerDownPointerX: 0,
            onPointerDownPointerY: 0,
            onPointerDownLon: 0,
            onPointerDownLat: 0,
            texture: null
        };

        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.
            this.setState({
                cubeRotation: new THREE.Euler(
                    this.state.cubeRotation.x + 0.1,
                    this.state.cubeRotation.y + 0.1,
                    0
                ),
            });
        };
        this.customRenderer = function (renderer) {
            let newRenderer = new THREE.WebGLRenderer({antialias: true});
            newRenderer.setPixelRatio(window.devicePixelRatio);
            newRenderer.setSize(window.innerWidth, window.innerHeight);
            return newRenderer;
        };

        this.imageLoader = new THREE.TextureLoader();
        this.imageLoader.setCrossOrigin("");
        this.imageLoader.load("http://i.imgur.com/lSJsI4p.jpg", (texture) => {
            this.setState({
                texture: texture
            });
        });
    }

    render () {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height
        return (
            <React3
                mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                width={width}
                height={height}
                customRenderer={this.customRenderer}
                onManualRenderTriggerCreated={this._onManualRenderTriggerCreated}
            >
                <scene>
                    <perspectiveCamera
                        aspect={this.state.cameraAspect}
                        far={1000}
                        fov={this.state.cameraFOV}
                        lookAt={this.state.cameraPosition}
                        name="camera"
                        near={0.1}
                    />
                    <mesh>
                        <sphereGeometry
                            radius={500}
                            widthSegments={60}
                            heightSegments={40}
                        />
                        <meshBasicMaterial
                            map={this.texture}
                        />
                    </mesh>
                </scene>
            </React3>
        );
    }
}

export default App;
