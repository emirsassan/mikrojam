import { Drawing, RAYWHITE, Timing, Window } from "@lino/raylib";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;
}

export abstract class Component {
  public enabled: boolean = true;
  public entity: Entity | null = null;

  abstract update(deltaTime: number): void;

  onDestroy(): void {}
}

export class Entity {
  public name: string;
  public transform: Transform;
  public active: boolean = true;
  private components: Map<string, Component> = new Map();

  constructor(name: string = "Entity") {
    this.name = name;
    this.transform = {
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
    };
  }

  addComponent<T extends Component>(component: T): T {
    const name = component.constructor.name;
    component.entity = this;
    this.components.set(name, component);
    return component;
  }

  // deno-lint-ignore no-explicit-any
  getComponent<T extends Component>(
    componentType: new (...args: any[]) => T,
  ): T | null {
    return (this.components.get(componentType.name) as T) || null;
  }

  update(deltaTime: number): void {
    if (!this.active) return;

    for (const component of this.components.values()) {
      if (component.enabled) {
        component.update(deltaTime);
      }
    }
  }

  destroy(): void {
    for (const component of this.components.values()) {
      component.onDestroy();
    }
    this.components.clear();
  }
}

export class Time {
  private static deltaTime: number = 0;
  private static totalTime: number = 0;

  static update(dt: number): void {
    this.deltaTime = dt;
    this.totalTime += dt;
  }

  static getDeltaTime(): number {
    return this.deltaTime;
  }

  static getTotalTime(): number {
    return this.totalTime;
  }
}

export abstract class Scene {
  public name: string;
  protected entities: Entity[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addEntity(entity: Entity): Entity {
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      entity.destroy();
      this.entities.splice(index, 1);
    }
  }

  findEntityByName(name: string): Entity | null {
    return this.entities.find((e) => e.name === name) || null;
  }

  abstract load(): void;
  abstract unload(): void;

  update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  /**
   * Override edicen bunu renderlamak için
   */
  render(): void {
  }
}

export default class Engine {
  private raylib: any;
  private currentScene: Scene | null = null;
  private scenes: Map<string, Scene> = new Map();
  private running: boolean = false;

  constructor(
    width: number = 800,
    height: number = 600,
    title: string = "Game",
  ) {
    Window.init(width, height, title);
  }

  registerScene(scene: Scene): void {
    this.scenes.set(scene.name, scene);
  }

  loadScene(sceneName: string): void {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      console.error(`Scene "${sceneName}" not found`);
      return;
    }

    if (this.currentScene) {
      this.currentScene.unload();
    }

    this.currentScene = scene;
    this.currentScene.load();
  }

  start(): void {
    this.running = true;
    this.gameLoop();
  }

  private gameLoop(): void {
    while (this.running && !Window.shouldClose()) {
      const deltaTime = Timing.getFrameTime();
      Time.update(deltaTime);

      // Update
      if (this.currentScene) {
        this.currentScene.update(deltaTime);
      }

      // Render
      Drawing.beginDrawing()
      Drawing.clearBackground(RAYWHITE);

      if (this.currentScene) {
        this.currentScene.render();
      }

      Drawing.endDrawing();
    }

    this.shutdown();
  }

  stop(): void {
    this.running = false;
  }

  private shutdown(): void {
    if (this.currentScene) {
      this.currentScene.unload();
    }
    Window.close()
  }
}
