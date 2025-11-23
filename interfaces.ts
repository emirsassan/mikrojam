import { BLUE, ORANGE, WHITE } from "@lino/raylib";

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