import { BLUE, ORANGE, WHITE } from "@lino/raylib";
import { Component, Entity } from "../engine.ts";
import { ElementType } from "../interfaces.ts";
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
      const card = this.generateDeck();
      const cardEntity = new Entity(`Card_${i}`);
      cardEntity.addComponent(new CardComponent(card.type, card.type.toString()));
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

  private generateDeck() {
    const rand = Math.random();
    let type = ElementType.FIRE;
    let color = ORANGE;

    if (rand > 0.66) {
      type = ElementType.SNOW;
      color = WHITE;
    } else if (rand > 0.33) {
      type = ElementType.WATER;
      color = BLUE;
    }

    return {
      type,
      color,
      value: Math.floor(Math.random() * 10) + 1
    };
  }
}
