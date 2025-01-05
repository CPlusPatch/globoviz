import { DirectionalLight, TextureLoader, type Vector3 } from "three";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";
import flare3 from "~/assets/textures/lens_flare_circle_64x64.jpg";
import flare2 from "~/assets/textures/lens_flare_hexagon_256x256.jpg";
import flare1 from "~/assets/textures/lens_flare_sun_512x512.jpg";

export class SunRenderer extends Lensflare {
    private light: DirectionalLight;
    private dark: DirectionalLight;

    constructor() {
        super();

        this.light = new DirectionalLight(0xffffff, 1);
        this.dark = new DirectionalLight(0x404040, 0.5);

        this.add(this.light);
        this.add(this.dark);
    }

    private loadFlare(path: string, size: number, distance: number): void {
        const loader = new TextureLoader();

        const texture = loader.load(path);

        this.addElement(new LensflareElement(texture, size, distance));
    }

    public load(): void {
        this.loadFlare(flare1, 500, 0);
        this.loadFlare(flare2, 60, 1.0);
        this.loadFlare(flare3, 10, 0.96);
        this.loadFlare(flare3, 30, 0.95);
        this.loadFlare(flare2, 70, 0.85);
    }

    public updatePositionFromECEF(position: Vector3): void {
        const scaledVector = position.multiplyScalar(300);

        this.position.copy(scaledVector);
        this.light.position.copy(scaledVector);
        this.dark.position.copy(scaledVector);
    }
}
