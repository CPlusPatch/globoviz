import music1 from "~/assets/audio/music/Portal2-3x17-Robot_Waiting_Room.ogg";
import music2 from "~/assets/audio/music/Portal2-3x18-Robot_Waiting_Room.ogg";
import music3 from "~/assets/audio/music/Portal2-3x19-Robot_Waiting_Room.ogg";
import music4 from "~/assets/audio/music/Portal2-3x20-Robot_Waiting_Room.ogg";
import music5 from "~/assets/audio/music/Portal2-3x21-Robot_Waiting_Room.ogg";
import music6 from "~/assets/audio/music/Portal2-3x22-Robot_Waiting_Room.ogg";
import tick001 from "~/assets/audio/tick_001.ogg";
import tick002 from "~/assets/audio/tick_002.ogg";

const assets = {
    tick: [tick001, tick002],
    music: [music1, music2, music3, music4, music5, music6],
};

type AssetName = keyof typeof assets;

export class SFXPlayer {
    private lastPlayed = 0;
    private static instances: Record<AssetName, HTMLAudioElement[]> = {
        tick: [],
        music: [],
    };

    public playSound(name: AssetName) {
        const audio = new Audio(
            assets[name][Math.floor(Math.random() * assets[name].length)],
        );

        audio.volume = 0.1;
        SFXPlayer.instances[name].push(audio);

        audio.play();
    }

    public static stopAllSounds(name: AssetName) {
        for (const audio of SFXPlayer.instances[name]) {
            audio.pause();
        }

        SFXPlayer.instances[name] = [];
    }

    /**
     * Only play sound once every debounceDelay milliseconds
     *
     * @param name
     * @param debounceDelay
     */
    public playSoundWithDebounce = (name: AssetName, debounceDelay: number) => {
        if (Date.now() - this.lastPlayed > debounceDelay) {
            this.playSound(name);
            this.lastPlayed = Date.now();
        }
    };

    static playSound(name: AssetName, debounceDelay?: number) {
        const player = new SFXPlayer();

        if (debounceDelay) {
            player.playSoundWithDebounce(name, debounceDelay);
        } else {
            player.playSound(name);
        }
    }
}
