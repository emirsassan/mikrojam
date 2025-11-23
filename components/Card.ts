import { BLACK, BLUE, Shapes, Text } from "@lino/raylib";
import { Component } from "../engine.ts";
import { ElementType, getColor } from "../interfaces.ts";

export class CardComponent extends Component {
  private width: number = 80;
  private height: number = 120;
  private type: ElementType;
  private text: string;

  constructor(type: ElementType, text: string) {
    super();
    this.type = type;
    this.text = text;
  }

  override update(deltaTime: number): void {
    Shapes.drawRectangle(
      this.entity?.transform.position.x as number,
      this.entity?.transform.position.y as number,
      this.width,
      this.height,
      getColor(this.type),
    );

    Shapes.drawRectangleLines(
      this.entity?.transform.position.x as number,
      this.entity?.transform.position.y as number,
      this.width,
      this.height,
      BLACK,
    );

    const text = this.text;
    const fontSize = 20;
    const textWidth = Text.measureText(text, fontSize);
    const textX = (this.entity?.transform.position.x as number) + (this.width - textWidth) / 2;
    const textY = (this.entity?.transform.position.y as number) + (this.height - fontSize) / 2;

    Text.drawText(
      text,
      textX,
      textY,
      fontSize,
      BLACK,
    );
  }
}
