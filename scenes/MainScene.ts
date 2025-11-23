import { BLACK, Mouse, RED, Shapes, Text } from "@lino/raylib";
import { CardComponent } from "../components/Card.ts";
import { DeckComponent } from "../components/Deck.ts";
import { Entity, Scene } from "../engine.ts";
import { determineWinner, GameState } from "../interfaces.ts";

export class MainScene extends Scene {
  private playerDeck: Entity | null = null;
  private aiDeck: Entity | null = null;
  private selectedCard: CardComponent | null = null;
  private aiSelectedCard: CardComponent | null = null;
  private gameState: GameState = GameState.PLAYER_TURN;
  private playerScore: number = 0;
  private aiScore: number = 0;
  private resultMessage: string = "";
  private resultTimer: number = 0;

  constructor() {
    super("MainScene");
  }

  override load(): void {
    this.playerDeck = new Entity("PlayerDeck");
    this.playerDeck.transform.position = { x: 120, y: 450 };
    this.playerDeck.addComponent(new DeckComponent(5));
    this.addEntity(this.playerDeck);

    this.aiDeck = new Entity("AIDeck");
    this.aiDeck.transform.position = { x: 120, y: 50 };
    this.aiDeck.addComponent(new DeckComponent(5, false));
    this.addEntity(this.aiDeck);
  }

  override unload(): void {
    this.playerDeck = null;
    this.aiDeck = null;
    this.selectedCard = null;
    this.aiSelectedCard = null;
  }

  override update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.gameState === GameState.PLAYER_TURN) {
      this.handlePlayerInput();
    } else if (this.gameState === GameState.RESOLVING) {
      this.resultTimer -= deltaTime;
      if (this.resultTimer <= 0) {
        this.resetRound();
      }
    } else if (this.gameState === GameState.GEYM_OVIR) {
      // bitti işte
    }
  }

  override render(): void {
    Text.drawText(
      `AI Score: ${this.aiScore}`,
      20,
      20,
      20,
      BLACK
    );

    Text.drawText(
      `Player Score: ${this.playerScore}`,
      20,
      550,
      20,
      BLACK
    );

    if (this.resultMessage) {
      Text.drawText(
        this.resultMessage,
        300,
        280,
        30,
        RED
      );
    }

    if (this.gameState === GameState.PLAYER_TURN) {
      Text.drawText(
        "Select a card!",
        320,
        300,
        20,
        BLACK
      );
    }

    if (this.gameState === GameState.GEYM_OVIR) {
      const winner = this.playerScore > this.aiScore ? "You Win!" : "AI Wins!";
      Text.drawText(
        winner,
        300,
        250,
        40,
        RED
      );
      Text.drawText(
        "Game Over",
        320,
        320,
        30,
        BLACK
      );
    }

    if (this.selectedCard && this.selectedCard.isPlayed) {
      Shapes.drawRectangleLines(
        250,
        350,
        100,
        140,
        BLACK
      );
      Text.drawText("Player", 260, 360, 15, BLACK);
    }

    if (this.aiSelectedCard && this.aiSelectedCard.isPlayed) {
      Shapes.drawRectangleLines(
        450,
        350,
        100,
        140,
        BLACK
      );
      Text.drawText("AI", 480, 360, 15, BLACK);
    }
  }

  private handlePlayerInput(): void {
    if (!this.playerDeck) return;

    const deckComponent = this.playerDeck.getComponent(DeckComponent);
    if (!deckComponent) return;

    const cards = deckComponent.getCards();
    const mouseX = Mouse.getX();
    const mouseY = Mouse.getY();

    for (const cardEntity of cards) {
      const cardComponent = cardEntity.getComponent(CardComponent);
      if (!cardComponent || cardComponent.isPlayed) continue;

      if (cardComponent.isMouseOver(mouseX, mouseY)) {
        cardComponent.isSelected = true;

        if (Mouse.isButtonPressed(0)) {
          this.playCard(cardComponent);
        }
      } else {
        cardComponent.isSelected = false;
      }
    }
  }

  private playCard(card: CardComponent): void {
    this.selectedCard = card;
    this.selectedCard.isPlayed = true;
    this.selectedCard.isSelected = false;

    this.aiSelectCard();

    this.gameState = GameState.RESOLVING;
    this.resolveRound();
  }

  private aiSelectCard(): void {
    if (!this.aiDeck) return;

    const deckComponent = this.aiDeck.getComponent(DeckComponent);
    if (!deckComponent) return;

    const cards = deckComponent.getCards();
    const availableCards = cards.filter((c) => {
      const comp = c.getComponent(CardComponent);
      return comp && !comp.isPlayed;
    });

    if (availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      this.aiSelectedCard = availableCards[randomIndex].getComponent(
        CardComponent
      );
      if (this.aiSelectedCard) {
        this.aiSelectedCard.isPlayed = true;
      }
    }
  }

  private resolveRound(): void {
    if (!this.selectedCard || !this.aiSelectedCard) return;

    const result = determineWinner(this.selectedCard, this.aiSelectedCard);

    if (result === 1) {
      this.playerScore++;
      this.resultMessage = "You Win!";
    } else if (result === -1) {
      this.aiScore++;
      this.resultMessage = "AI Wins!";
    } else {
      this.resultMessage = "Draw!";
    }

    this.resultTimer = 2.0;

    if (this.playerScore >= 3 || this.aiScore >= 3) {
      this.gameState = GameState.GEYM_OVIR;
    }
  }

  private resetRound(): void {
    this.resultMessage = "";
    this.selectedCard = null;
    this.aiSelectedCard = null;

    const playerDeckComp = this.playerDeck?.getComponent(DeckComponent);
    const allCardsPlayed = playerDeckComp
      ?.getCards()
      .every((c) => c.getComponent(CardComponent)?.isPlayed);

    if (allCardsPlayed) {
      this.gameState = GameState.GEYM_OVIR;
    } else {
      this.gameState = GameState.PLAYER_TURN;
    }
  }
}
