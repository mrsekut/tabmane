type ClickHandlerConfig = {
  onSingleClick: () => Promise<void>;
  onDoubleClick: () => Promise<void>;
  doubleClickDelay?: number;
};

type ClickState = {
  count: number;
  timer: NodeJS.Timeout | null;
};

export class ClickHandler {
  private state: ClickState = {
    count: 0,
    timer: null,
  };

  private readonly config: Required<ClickHandlerConfig>;

  constructor(config: ClickHandlerConfig) {
    this.config = {
      doubleClickDelay: 300,
      ...config,
    };
  }

  handleClick(): void {
    this.clearTimer();

    if (this.shouldResetState()) {
      this.resetToFirstClick();
    } else {
      this.incrementClickCount();
    }

    if (this.isDoubleClick()) {
      this.handleDoubleClick();
    } else {
      this.scheduleSingleClick();
    }
  }

  private clearTimer(): void {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.state.timer = null;
    }
  }

  private shouldResetState(): boolean {
    return this.state.count === 0;
  }

  private resetToFirstClick(): void {
    this.state.count = 1;
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

  private scheduleSingleClick(): void {
    this.state.timer = setTimeout(() => {
      if (this.state.count === 1) {
        this.config.onSingleClick();
      }
      this.resetState();
    }, this.config.doubleClickDelay);
  }

  private resetState(): void {
    this.state.count = 0;
    this.state.timer = null;
  }
}
