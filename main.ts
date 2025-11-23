import Engine from "./engine.ts";
import { MainScene } from "./scenes/MainScene.ts";

const engine = new Engine(800, 600, "Mikrojamliyom");
engine.registerScene(new MainScene());
engine.loadScene("MainScene");
engine.start();