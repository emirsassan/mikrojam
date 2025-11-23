import { Text } from "@lino/raylib";
import Engine, { Component, Entity, Scene } from "./engine.ts";

class TestComponent extends Component {
  constructor() {
    super()
  }

  override update(deltaTime: number): void {
    Text.drawFPS(10, 10)
  }
}

class MainScene extends Scene {
  constructor() {
    super("MainScene")
  }

  override load(): void {
    const fpsText = new Entity("FPSText")
    fpsText.addComponent(new TestComponent())
    this.addEntity(fpsText)
  }

  override unload(): void {
    
  }

  override render(): void {
    
  }
}

const engine = new Engine(800, 600, "Mikrojamliyom");
engine.registerScene(new MainScene());
engine.loadScene("MainScene");
engine.start();