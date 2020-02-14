import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class WindowResizeServiceMock {
  resize: Observable<any>;

  resizeSubject = new Subject();

  constructor() {
    this.resize = this.resizeSubject.asObservable();
  }

  isFullScreen() {
    return false;
  }

  getWindowHeight() {
    return 600;
  }

  getWindowWidth() {
    return 1000;
  }

  emitResize() {
    this.resizeSubject.next({});
  }
}
