let timeoutId = 0;
document.addEventListener(`mousedown`, (event: Event): void => {
  timeoutId = setTimeout(() => {
    event.target?.dispatchEvent(new CustomEvent(`longclick`, { bubbles: true, detail: event }));
    clearTimeout(timeoutId);
  }, 500) as unknown as number;
});
document.addEventListener(`mousemove`, (): void => clearTimeout(timeoutId));
document.addEventListener(`mouseup`, (): void => clearTimeout(timeoutId));
document.addEventListener(`touchstart`, (event: Event): void => {
  timeoutId = setTimeout(() => {
    event.target?.dispatchEvent(new CustomEvent(`longtouch`, { bubbles: true, detail: event }));
    clearTimeout(timeoutId);
  }, 500) as unknown as number;
});
document.addEventListener(`touchmove`, (): void => clearTimeout(timeoutId));
document.addEventListener(`touchend`, (): void => clearTimeout(timeoutId));
