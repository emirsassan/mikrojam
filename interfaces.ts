import { BLUE, ORANGE, WHITE } from "@lino/raylib";
import { CardComponent } from "./components/Card.ts";

export enum ElementType {
    FIRE = "FIRE",
    WATER = "WATER",
    SNOW = "SNOW"
}

export function getColor(type: ElementType) {
    switch (type) {
        case ElementType.FIRE:
            return ORANGE

        case ElementType.WATER:
            return BLUE

        case ElementType.SNOW:
            return WHITE
    }
}

export enum GameState {
    PLAYER_TURN,
    RESOLVING,
    GEYM_OVIR
}

export function determineWinner(cA: CardComponent, cB: CardComponent): number {
    if (cA.type === cB.type) {
        if (cA.value > cB.value) return 1;
        if (cB.value > cA.value) return -1;
        return 0;
    }

    if (cA.type === ElementType.FIRE && cB.type === ElementType.SNOW) return 1;
    if (cA.type === ElementType.SNOW && cB.type === ElementType.WATER) return 1;
    if (cA.type === ElementType.WATER && cB.type === ElementType.FIRE) return 1;

    return -1; // If not same element and not win, it's a loss
}