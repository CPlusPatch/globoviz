import {
    AmbientLight,
    AxesHelper,
    Clock,
    Fog,
    Group,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ecef from "~/assets/data/ecef.json";
import type { SimulationConfig } from "~/components/controls/sidebar.vue";
import { Earth } from "./bodies/earth";
import { EarthRenderer } from "./renderers/earth";
import { StarsRenderer } from "./renderers/stars";
import { SunRenderer } from "./renderers/sun";

export interface ECEF {
    sats: {
        norad: string;
        eci: [number, number, number][];
        ecefvel: string[];
    }[];
    sun: [number, number, number][];
    stars: {
        xyz: [number, number, number][];
        size: number[];
    };
}

/**
 * Configuration options for the Globe visualization
 */
interface GlobeConfig {
    /** DOM element to attach the renderer to */
    container: HTMLElement;
    /** Initial width of the visualization */
    width: number;
    /** Initial height of the visualization */
    height: number;
    /** Minimum camera distance */
    minDistance?: number;
    /** Maximum camera distance */
    maxDistance?: number;
    /** Auto-rotation speed (0 for no rotation) */
    autoRotateSpeed?: number;
}

/**
 * Flight data structure for arc visualization
 */
export interface FlightData {
    /** Starting point coordinates */
    start: [number, number];
    /** Ending point coordinates */
    end: [number, number];
    /** Arc altitude */
    arcAlt: number;
    /** Flight status */
    status: boolean;
    /** Order for animation */
    order: number;
}

/**
 * Airport data structure for labels and points
 */
export interface AirportData {
    /** Airport city name */
    city: string;
    /** Airport coordinates */
    coordinates: [number, number];
    /** Label size */
    size: number;
}

/**
 * Orbits data structure for orbit visualization
 */
export interface OrbitData {
    apoapsis: number;
    periapsis: number;
    inclination: number;
}

/**
 * Manages a 3D globe visualization with flight paths and airport markers
 */
export class GlobeVisualization {
    private renderer!: WebGLRenderer;
    private scene!: Scene;
    private group: Group = new Group();
    private camera!: PerspectiveCamera;
    private controls!: OrbitControls;
    private clock: Clock = new Clock();
    private windowHalfX: number;
    private windowHalfY: number;
    private earth!: EarthRenderer;
    public currentDate = new Date();

    /**
     * Creates a new globe visualization
     * @param config - Configuration options for the globe
     */
    constructor(
        private config: GlobeConfig,
        private simulationConfig: SimulationConfig,
    ) {
        this.windowHalfX = config.width / 2;
        this.windowHalfY = config.height / 2;
    }

    public async init(): Promise<void> {
        this.initScene();
        this.populateSolarSystem();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Initializes the Three.js scene, camera, and renderer
     */
    private initScene(): void {
        const canvas = document.createElement("canvas");
        const context = WebGL.isWebGL2Available()
            ? canvas.getContext("webgl2", { antialias: false })
            : canvas.getContext("webgl", { antialias: false });

        if (!context) {
            throw new Error("WebGL context is not available");
        }

        // Initialize renderer
        this.renderer = new WebGLRenderer({ canvas, context });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.config.width, this.config.height);
        this.renderer.setClearColor(0x000000, 0);
        this.config.container.appendChild(this.renderer.domElement);

        // Initialize scene
        this.scene = new Scene();

        // Initialize camera
        this.camera = new PerspectiveCamera();
        this.camera.aspect = this.config.width / this.config.height;
        this.camera.updateProjectionMatrix();
        this.camera.position.set(2.88675135, 2.88675135, 2.88675135);

        this.scene.add(this.group);

        const axesHelper = new AxesHelper(5);
        this.group.add(axesHelper);

        // Initialize controls
        this.controls = this.createControls();
    }

    /**
     * Creates and configures the OrbitControls
     * @returns Configured OrbitControls instance
     */
    private createControls(): OrbitControls {
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        controls.enableDamping = true;
        // controls.dynamicDampingFactor = 0.01;
        controls.enablePan = false;
        controls.minDistance = this.config.minDistance ?? 0;
        controls.maxDistance = this.config.maxDistance ?? 15;
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 1;
        controls.autoRotate = Boolean(this.config.autoRotateSpeed);
        controls.autoRotateSpeed = this.config.autoRotateSpeed ?? 0;
        controls.minPolarAngle = Math.PI / 3.5;
        controls.maxPolarAngle = Math.PI - Math.PI / 3;

        return controls;
    }

    private async populateSolarSystem(): Promise<void> {
        const earthBody = new Earth();
        this.earth = new EarthRenderer(earthBody);
        this.group.add(this.earth);

        await this.earth.load();
        this.earth.setWorldInverseQuaternionFromGroup(this.group);
        this.earth.updateECFShaderGroupRotation(this.camera, this.group);

        const sun = new SunRenderer();
        await sun.load();

        this.group.add(sun);

        sun.updatePositionFromECEF(new Vector3(...(ecef as ECEF).sun[0]));
        this.earth.updateSunPositionTexture(
            new Vector3(...(ecef as ECEF).sun[0]),
        );

        const stars = new StarsRenderer();

        this.group.add(stars.getStars());
    }

    /**
     * Handles window resize events
     */
    private onWindowResize = (): void => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.windowHalfX = window.innerWidth / 1.5;
        this.windowHalfY = window.innerHeight / 1.5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    /**
     * Sets up event listeners for window resize and mouse movement
     */
    private setupEventListeners(): void {
        window.addEventListener("resize", this.onWindowResize);
    }

    /**
     * Animation loop
     */
    private animate = (): void => {
        this.tickTime();

        this.earth.updateECFShaderGroupRotation(this.camera, this.group);

        this.updateBodies();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    };

    /**
     * Updates the positions and rotations of all celestial bodies
     */
    private updateBodies(): void {
        const { position, rotation } =
            this.earth.body.getPositionAndRotationForDate(this.currentDate);

        this.earth.position.copy(position);
        this.earth.rotation.copy(rotation);
    }

    /**
     * Updates the current date based on the elapsed time
     */
    private tickTime = (): void => {
        const deltaMs = this.clock.getDelta() * 1000;
        this.currentDate = new Date(
            this.currentDate.getTime() +
                deltaMs * this.simulationConfig.time.scale,
        );
    };

    public updateConfig(config: SimulationConfig): void {
        this.simulationConfig = config;
    }

    /**
     * Cleans up event listeners and Three.js resources
     */
    public dispose(): void {
        window.removeEventListener("resize", this.onWindowResize);
        this.renderer.dispose();
        this.controls.dispose();
    }
}
