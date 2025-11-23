import { DeckComponent } from "../components/Deck.ts";
import { Entity, Scene } from "../engine.ts";

export class MainScene extends Scene {
  constructor() {
    super("MainScene")
  }

  override load(): void {
    const deck = new Entity("Deck")
    deck.transform.position = { x: 120, y: 400 }
    deck.addComponent(new DeckComponent(5))
    this.addEntity(deck)
  }

  override unload(): void {
    
  }

  override render(): void {
    
  }
}
