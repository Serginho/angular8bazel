import {Observable, Subject} from 'rxjs';

export class ResponsiveServiceMock {
  resizeSubject = new Subject();

  resize: Observable<any>;
  // noinspection JSUnusedGlobalSymbols
  breakpointChange = new Subject().asObservable();

  constructor() {
    this.resize = this.resizeSubject.asObservable();
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  getCurrentScreen() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  isDesktop(): boolean {
    return undefined;
  }

  isMobile(): boolean {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  getCurrentScreenSize() {
    return undefined;
  }

  emitResize() {
    this.resizeSubject.next({});
  }

  getPlatform() {
    return undefined;
  }
}
