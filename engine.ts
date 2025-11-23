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
            scale: { x: 1, y: 1 }
        }
    }

    addComponent<T extends Component>(component: T): T {
        const name = component.constructor.name;
        component.entity = this;
        this.components.set(name, component);
        return component
    }
}