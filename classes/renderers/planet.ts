import {
    BackSide,
    type Camera,
    Group,
    Mesh,
    Quaternion,
    ShaderMaterial,
    SphereGeometry,
    Texture,
    TextureLoader,
    Uniform,
    Vector3,
} from "three";
import groundFragmentShader from "~/shaders/ground.frag?raw";
import groundVertexShader from "~/shaders/ground.vert?raw";
import skyFragmentShader from "~/shaders/sky.frag?raw";
import skyVertexShader from "~/shaders/sky.vert?raw";
import type { CelestialBody } from "../bodies";

export class PlanetRenderer extends Group {
    private ground: Mesh;
    private sky: Mesh;
    private uniforms: {
        v3LightPosition: Uniform<Vector3>;
        cPs: Uniform<Vector3>;
        v3InvWavelength: Uniform<Vector3>;
        fCameraHeight: Uniform<number>;
        fCameraHeight2: Uniform<number>;
        fInnerRadius: Uniform<number>;
        fInnerRadius2: Uniform<number>;
        fOuterRadius: Uniform<number>;
        fOuterRadius2: Uniform<number>;
        fKrESun: Uniform<number>;
        fKmESun: Uniform<number>;
        fKr4PI: Uniform<number>;
        fKm4PI: Uniform<number>;
        fScale: Uniform<number>;
        fScaleDepth: Uniform<number>;
        fScaleOverScaleDepth: Uniform<number>;
        g: Uniform<number>;
        g2: Uniform<number>;
        nSamples: Uniform<number>;
        fSamples: Uniform<number>;
        tDisplacement: Uniform<number>;
        tSkyboxDiffuse: Uniform<number>;
        fNightScale: Uniform<number>;
        tDiffuse: Uniform<Texture>;
        tDiffuseNight: Uniform<Texture>;
    };
    private inverseWorldQuaternion: Quaternion = new Quaternion();

    constructor(
        public body: CelestialBody,
        private textures: {
            day: string;
            night: string;
            maxAnisotropy?: number;
        },
    ) {
        super();

        const { name, radius, atmosphere, g } = this.body.getParameters();

        if (!atmosphere) {
            throw new Error("Atmosphere is required for a planet");
        }

        const {
            fullHeight,
            wavelength,
            raighleighCoefficient,
            mieCoefficient,
        } = atmosphere;

        const sunIntensity = 15.0;

        this.uniforms = {
            v3LightPosition: new Uniform(new Vector3(1, 0, 0).normalize()),
            cPs: new Uniform(new Vector3(1, 0, 0)),
            v3InvWavelength: new Uniform(
                new Vector3(
                    1 / wavelength[0] ** 4,
                    1 / wavelength[1] ** 4,
                    1 / wavelength[2] ** 4,
                ),
            ),
            fCameraHeight: new Uniform(0),
            fCameraHeight2: new Uniform(0),
            fInnerRadius: new Uniform(radius),
            fInnerRadius2: new Uniform(radius ** 2),
            fOuterRadius: new Uniform(radius + fullHeight),
            fOuterRadius2: new Uniform((radius + fullHeight) ** 2),
            fKrESun: new Uniform(raighleighCoefficient * sunIntensity),
            fKmESun: new Uniform(mieCoefficient * sunIntensity),
            fKr4PI: new Uniform(raighleighCoefficient * 4.0 * Math.PI),
            fKm4PI: new Uniform(mieCoefficient * 4.0 * Math.PI),
            fScale: new Uniform(1 / fullHeight),
            fScaleDepth: new Uniform(0.25),
            fScaleOverScaleDepth: new Uniform(1 / fullHeight / 0.25),
            g: new Uniform(g),
            g2: new Uniform(g ** 2),
            nSamples: new Uniform(3),
            fSamples: new Uniform(3.0),
            tDisplacement: new Uniform(0),
            tSkyboxDiffuse: new Uniform(0),
            fNightScale: new Uniform(1),
            tDiffuse: new Uniform(Texture.DEFAULT_IMAGE),
            tDiffuseNight: new Uniform(Texture.DEFAULT_IMAGE),
        };

        this.name = name;
        this.sky = new Mesh(
            new SphereGeometry(radius + fullHeight, 500, 500),
            new ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: skyVertexShader,
                fragmentShader: skyFragmentShader,
                side: BackSide,
                transparent: true,
            }),
        );

        this.ground = new Mesh(
            new SphereGeometry(radius, 500, 500),
            new ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: groundVertexShader,
                fragmentShader: groundFragmentShader,
            }),
        );

        this.add(this.ground);
        this.add(this.sky);
    }

    public async load(): Promise<void> {
        await this.loadTextures();
    }

    private async loadTextures(): Promise<void> {
        const loader = new TextureLoader();

        const day = loader.load(this.textures.day);
        const night = loader.load(this.textures.night);

        day.anisotropy = this.textures.maxAnisotropy ?? 16;
        night.anisotropy = this.textures.maxAnisotropy ?? 16;

        this.uniforms.tDiffuse = new Uniform(day);
        this.uniforms.tDiffuseNight = new Uniform(night);

        this.refreshUniforms();
    }

    private refreshUniforms(): void {
        // @ts-expect-error Uniforms are not typed correctly
        this.ground.material.uniforms = this.uniforms;
        // @ts-expect-error Uniforms are not typed correctly
        this.sky.material.uniforms = this.uniforms;
    }

    /**
     * Sun position is hardcoded into the shader, so we need to update it manually
     *
     * @param position
     */
    public updateSunPositionTexture(position: Vector3): void {
        this.uniforms.v3LightPosition.value = position;

        this.refreshUniforms();
    }

    /**
     * Sets the inverse world quaternion from a group
     *
     * Used for calculating the light position
     * @param group
     */
    public setWorldInverseQuaternionFromGroup(group: Group): void {
        group.getWorldQuaternion(this.inverseWorldQuaternion);

        this.inverseWorldQuaternion.invert();
    }

    public updateECFShaderGroupRotation(camera: Camera, group: Group) {
        const newVector = new Vector3(
            camera.position.x - group.position.x,
            camera.position.y - group.position.y,
            camera.position.z - group.position.z,
        );

        newVector.applyQuaternion(this.inverseWorldQuaternion);

        this.uniforms.cPs.value = newVector;

        this.refreshUniforms();
    }
}
