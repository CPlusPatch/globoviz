import { Earth } from "./planets/earth";
import { Sun } from "./planets/sun";
import { Iss } from "./satellites/iss";
import { PariSat } from "./satellites/parisat";

const sun = new Sun();
const earth = new Earth();
const iss = new Iss(earth);
const pariSat = new PariSat(earth);

export const solarSystem = [sun, earth, iss, pariSat];
