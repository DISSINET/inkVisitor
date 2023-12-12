import Viewport from "./Viewport";
import Cursor from "./Cursor";
import Text from "./Text";
import Scroller from "./Scroller";

export interface DrawingOptions {
  charWidth: number;
  lineHeight: number;
  charsAtLine: number;
}

export class Canvas {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  font: string = "12px Monospace";
  charWidth: number = 0;
  lineHeight: number = 15;
  width: number = 0;
  height: number = 0;

  viewport: Viewport;
  cursor: Cursor;
  text: Text;
  scroller?: Scroller;

  lastHighlightedText = "";

  // callbacks
  highlightChangeCb?: (text: string) => void;

  constructor(element: HTMLCanvasElement, inputText: string) {
    this.element = element;
    const ctx = this.element.getContext("2d");
    if (!ctx) {
      throw new Error("Cannot get 2d context");
    }
    this.ctx = ctx;
    this.width = this.element.width;
    this.height = this.element.height;
    this.setCharWidth("abcdefghijklmnopqrstuvwxyz0123456789");

    const charsAtLine = Math.floor(this.width / this.charWidth);

    const noLinesViewport = Math.floor(this.height / this.lineHeight) - 1;
    this.viewport = new Viewport(0, noLinesViewport);
    this.cursor = new Cursor();

    this.text = new Text(inputText, charsAtLine);

    this.element.onwheel = this.onWheel.bind(this);
    this.element.onmousedown = this.onMouseDown.bind(this);
    this.element.onmouseup = this.onMouseUp.bind(this);
    this.element.onmousemove = this.onMouseMove.bind(this);
    this.element.onkeydown = this.onKeyDown.bind(this);
  }

  initialize() {
    console.log("Custom logic executed!");
    this.draw();
  }

  onHighlightChange(cb: (text: string) => void) {
    this.lastHighlightedText = "";
    this.highlightChangeCb = (text: string) => {
      if (text === this.lastHighlightedText) {
        return;
      }
      this.lastHighlightedText = text;
      cb(this.lastHighlightedText);
    };
  }

  onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (e.ctrlKey) {
      console.log("ctr active");
    }
    switch (e.key) {
      case "ArrowUp":
        this.cursor.move(0, -1);
        if (this.cursor.yLine < 0) {
          this.viewport.scrollTo(
            this.viewport.lineStart + this.cursor.yLine,
            this.text.noLines
          );
          this.cursor.yLine = 0;
        }
        break;

      case "ArrowDown":
        this.cursor.move(0, 1);
        if (
          this.cursor.yLine >
          this.viewport.lineEnd - this.viewport.lineStart
        ) {
          this.viewport.scrollTo(
            this.viewport.lineStart + 1,
            this.text.noLines
          );
          this.cursor.yLine = this.viewport.lineEnd - this.viewport.lineStart;
        }
        break;

      case "ArrowLeft":
        this.cursor.move(-1, 0);
        if (this.cursor.xLine < 0) {
          this.cursor.xLine = 0;
        }
        break;

      case "ArrowRight":
        this.cursor.move(1, 0);
        if (this.cursor.xLine > Math.floor(this.width / this.charWidth)) {
          this.cursor.xLine--;
        }
        break;

      case "Backspace":
        this.text.deleteText(this.viewport, this.cursor, 1);
        this.cursor.move(-1, 0);
        break;

      default:
        if (e.ctrlKey) {
          if (e.key === "c") {
            window.navigator.clipboard.writeText(this.lastHighlightedText);
          }
          if (e.key === "v") {
            window.navigator.clipboard.readText().then((clipText: string) => {
              this.text.insertText(this.viewport, this.cursor, clipText);
              this.draw();
            });
          }
          break;
        }

        // writing to text
        const key = e.key;
        const nonCharKeys = [
          "CapsLock",
          "Shift",
          "Control",
          "Alt",
          "Tab",
          "Escape",
          "Enter",
        ];

        if (!nonCharKeys.includes(key)) {
          this.text.insertText(this.viewport, this.cursor, key);
          this.cursor.move(+1, 0);
        }
    }

    this.draw();
  }

  onMouseDown(e: MouseEvent) {
    this.cursor.setPosition(
      e.offsetX,
      e.offsetY,
      this.lineHeight,
      this.charWidth
    );
    this.cursor.highlight(this.viewport.lineStart);
    this.draw();
  }

  onMouseUp(e: MouseEvent) {
    this.cursor.setPosition(
      e.offsetX,
      e.offsetY,
      this.lineHeight,
      this.charWidth
    );
    this.cursor.endHighlight();
    this.draw();
  }

  onMouseMove(e: MouseEvent) {
    if (this.cursor.isHighlighting()) {
      this.cursor.setPosition(
        e.offsetX,
        e.offsetY,
        this.lineHeight,
        this.charWidth
      );
      this.cursor.highlight(this.viewport.lineStart);
      this.draw();
    }
  }

  onWheel(e: any) {
    const up = e.deltaY < 0 ? false : true;
    if (up) {
      this.viewport.scrollDown(1, this.text.noLines);
    } else if (!up) {
      this.viewport.scrollUp(1);
    }

    e.preventDefault();
    this.draw();
  }

  addScroller(scrollerDiv: HTMLDivElement) {
    this.scroller = new Scroller(scrollerDiv);
    this.scroller.onChange((percentage: number) => {
      const toLine = Math.floor(
        ((this.text.noLines -
          (this.viewport.lineEnd - this.viewport.lineStart)) /
          100) *
          percentage
      );
      this.viewport.scrollTo(toLine, this.text.noLines);
      this.draw();
    });
  }

  setCharWidth(txt: string) {
    this.ctx.font = this.font;
    const textW = this.ctx.measureText(txt).width;
    this.charWidth = textW / txt.length;
  }

  draw() {
    this.ctx.reset();
    this.ctx.font = this.font;

    const textToRender = this.text.getViewportText(this.viewport);
    for (
      let renderLine = 0;
      renderLine <= this.viewport.lineEnd - this.viewport.lineStart;
      renderLine++
    ) {
      const textLine = textToRender[renderLine];
      if (textLine) {
        this.ctx.fillText(textLine, 0, (renderLine + 1) * this.lineHeight);
      }
    }

    this.cursor.draw(this.ctx, this.viewport, {
      lineHeight: this.lineHeight,
      charWidth: this.charWidth,
      charsAtLine: this.text.charsAtLine,
    });

    if (this.highlightChangeCb && this.cursor.isHighlighted()) {
      const [start, end] = this.cursor.getHighlighted();
      if (start && end) {
        this.highlightChangeCb(this.text.getRangeText(start, end));
      }
    }
    if (this.scroller) {
      this.scroller.update(
        this.viewport.lineStart,
        this.viewport.lineEnd,
        this.text.noLines
      );
    }
  }
}
