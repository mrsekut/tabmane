type ClickHandlerConfig = {
  onSingleClick: () => Promise<void>;
  onDoubleClick: () => Promise<void>;
  doubleClickDelay?: number;
  clickResetDelay?: number;
};

type ClickState = {
  count: number;
  firstClickTime: number;
  timer: NodeJS.Timeout | null;
};

export class ClickHandler {
  private state: ClickState = {
    count: 0,
    firstClickTime: 0,
    timer: null,
  };

  private readonly config: Required<ClickHandlerConfig>;

  constructor(config: ClickHandlerConfig) {
    this.config = {
      doubleClickDelay: 500,
      clickResetDelay: 600,
      ...config,
    };
  }

  handleClick(): void {
    const now = Date.now();

    this.clearTimer();

    if (this.shouldResetState(now)) {
      this.resetToFirstClick(now);
    } else {
      this.incrementClickCount();
    }

    if (this.isDoubleClick()) {
      this.handleDoubleClick();
    } else {
      this.scheduleeSingleClick();
    }
  }

  private clearTimer(): void {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.state.timer = null;
    }
  }

  private shouldResetState(now: number): boolean {
    return (
      this.state.count === 0 ||
      now - this.state.firstClickTime > this.config.clickResetDelay
    );
  }

  private resetToFirstClick(now: number): void {
    this.state.count = 1;
    this.state.firstClickTime = now;
  }

  private incrementClickCount(): void {
    this.state.count++;
  }

  private isDoubleClick(): boolean {
    return this.state.count >= 2;
  }

  private handleDoubleClick(): void {
    this.resetState();
    this.config.onDoubleClick();
  }

  private scheduleeSingleClick(): void {
    this.state.timer = setTimeout(() => {
      if (this.state.count === 1) {
        this.config.onSingleClick();
      }
      this.resetState();
    }, this.config.doubleClickDelay);
  }

  private resetState(): void {
    this.state.count = 0;
    this.state.firstClickTime = 0;
    this.state.timer = null;
  }
}