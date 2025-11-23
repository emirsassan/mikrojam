import { Component, Entity } from "../engine.ts";
import { CardComponent } from "./Card.ts";

export class DeckComponent extends Component {
    private cardEntities: Entity[] = [];
    private spacing: number = 100;

    constructor(cardCount: number = 5) {
        super();
        this.initializeCards(cardCount);
    }

    private initializeCards(count: number): void {
        for (let i = 0; i < count; i++) {
            const cardEntity = new Entity(`Card_${i}`);
            cardEntity.addComponent(new CardComponent());
            this.cardEntities.push(cardEntity);
        }
    }

    override update(deltaTime: number): void {
        if (!this.entity) return;

        const baseX = this.entity.transform.position.x;
        const baseY = this.entity.transform.position.y;

        for (let i = 0; i < this.cardEntities.length; i++) {
            const cardEntity = this.cardEntities[i];
            cardEntity.transform.position.x = baseX + (i * this.spacing);
            cardEntity.transform.position.y = baseY;
            cardEntity.update(deltaTime);
        }
    }

    public getCards(): Entity[] {
        return this.cardEntities;
    }

    public setSpacing(spacing: number): void {
        this.spacing = spacing;
    }
}