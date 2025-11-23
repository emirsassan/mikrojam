import { BLACK, Shapes, Text, YELLOW } from "@lino/raylib";
import { Component } from "../engine.ts";
import { ElementType, getColor } from "../interfaces.ts";

export class CardComponent extends Component {
  private width: number = 80;
  private height: number = 120;
  public type: ElementType;
  private text: string;
  public value: number;
  public isSelected: boolean = false;
  public isPlayed: boolean = false;
  public visible: boolean = true;

  constructor(type: ElementType, text: string, value: number) {
    super();
    this.type = type;
    this.text = text;
    this.value = value;
  }

  override update(_deltaTime: number): void {
    if (!this.entity || !this.visible) return;

    const pos = this.entity.transform.position;

    Shapes.drawRectangle(
      pos.x,
      pos.y,
      this.width,
      this.height,
      getColor(this.type),
    );

    Shapes.drawRectangleLines(
      pos.x,
      pos.y,
      this.width,
      this.height,
      BLACK,
    );

    Text.drawText(
      this.type,
      Math.floor(pos.x + 10),
      Math.floor(pos.y + 10),
      10,
      BLACK,
    );

    const valueText = this.value.toString();
    const fontSize = 30;
    const textWidth = Text.measureText(valueText, fontSize);
    const textX = Math.floor(pos.x + (this.width - textWidth) / 2);
    const textY = Math.floor(pos.y + (this.height - fontSize) / 2);

    Text.drawText(
      valueText,
      textX,
      textY,
      fontSize,
      BLACK,
    );

    if (this.isSelected) {
      Shapes.drawRectangleLines(
        pos.x - 3,
        pos.y - 3,
        this.width + 6,
        this.height + 6,
        YELLOW,
      );
    }
  }

  public isMouseOver(mouseX: number, mouseY: number): boolean {
    if (!this.entity) return false;
    const pos = this.entity.transform.position;
    return (
      mouseX >= pos.x &&
      mouseX <= pos.x + this.width &&
      mouseY >= pos.y &&
      mouseY <= pos.y + this.height
    );
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
