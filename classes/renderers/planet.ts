import {
    Group,
    Mesh,
    ShaderMaterial,
    SphereGeometry,
    Texture,
    TextureLoader,
    Uniform,
} from "three";
import groundFragmentShader from "~/shaders/ground.frag?raw";
import groundVertexShader from "~/shaders/ground.vert?raw";
import type { CelestialBody } from "../bodies";

export class PlanetRenderer extends Group {
    private ground: Mesh;
    private uniforms: {
        tDiffuse: Uniform<Texture>;
        tDiffuseNight: Uniform<Texture>;
    };

    constructor(
        public body: CelestialBody,
        private textures: {
            day: string;
            night: string;
            maxAnisotropy?: number;
        },
    ) {
        super();

        const { name, radius, atmosphere } = this.body.parameters;

        if (!atmosphere) {
            throw new Error("Atmosphere is required for a planet");
        }

        this.uniforms = {
            tDiffuse: new Uniform(Texture.DEFAULT_IMAGE),
            tDiffuseNight: new Uniform(Texture.DEFAULT_IMAGE),
        };

        this.name = name;

        this.ground = new Mesh(
            new SphereGeometry(radius, 500, 500),
            new ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: groundVertexShader,
                fragmentShader: groundFragmentShader,
            }),
        );

        this.add(this.ground);
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
    }
}
