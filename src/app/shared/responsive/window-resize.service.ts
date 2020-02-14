import {Inject, Injectable} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';

/**
 * Service to track window resizes.
 */
@Injectable({providedIn: 'root'})
export class WindowResizeService {
  /**
   * Emits every time the window is resized.
   */
  resize: Observable<any>;

  constructor(@Inject('window') private window: Window) {
    this.resize = fromEvent(this.window, 'resize');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns true when there's a fullscreen element in the current document.
   */
  isFullScreen() {
    return this.window.document['webkitFullscreenElement'] ||
      this.window.document['fullscreenElement'] ||
      this.window.document['mozFullScreenElement'] ||
      this.window.document['msFullscreenElement'];
  }

  getWindowHeight() {
    return this.window.innerHeight;
  }

  getWindowWidth() {
    return this.window.innerWidth;
  }
}
