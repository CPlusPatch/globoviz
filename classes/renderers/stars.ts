import {
    AdditiveBlending,
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
} from "three";
import ecef from "~/assets/data/ecef.json";
import sunGlow from "~/assets/textures/sun_glow.png";
import type { ECEF } from "../renderer";

export class StarsRenderer {
    private stars: Points;

    constructor() {
        const loader = new TextureLoader();

        const sprite = loader.load(sunGlow, (texture) => {
            texture.colorSpace = SRGBColorSpace;
        });

        const stars = (ecef as ECEF).stars as {
            xyz: [number, number, number][];
            size: number[];
        };

        const colorList = [
            [0.235, 0.875, 1.0],
            [1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0],
            [1.0, 0.573, 0.282],
        ];

        const vertices: Vector3[] = [];
        const colors: number[] = [];

        for (const star of stars.xyz) {
            const size = 1 / stars.size[stars.xyz.indexOf(star)];

            vertices.push(
                new Vector3(star[0], star[1], star[2]).multiplyScalar(
                    size * 200,
                ),
            );

            const chosenColor = colorList[Math.floor(Math.random() * 5)];
            colors.push(chosenColor[0], chosenColor[1], chosenColor[2]);
        }

        const geometry = new BufferGeometry().setFromPoints(vertices);
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

        const material = new PointsMaterial({
            size: 6,
            map: sprite,
            blending: AdditiveBlending,
            vertexColors: true,
            transparent: true,
        });

        this.stars = new Points(geometry, material);
    }

    public getStars(): Points {
        return this.stars;
    }
}
