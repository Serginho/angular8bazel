import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import {Breakpoint, ScreenSize} from './model';
import {WindowResizeService} from './window-resize.service';
import {Platform} from './platform';

/**
 * This service providers listeners to detect how the application is resized
 * and platform breakpoint changes.
 */
@Injectable({providedIn: 'root'})
export class ResponsiveService implements OnDestroy {
  /**
   * Listener triggered when screen resize.
   */
  resize: Observable<ScreenSize>;

  /**
   * Listener triggered when platform breakpoint changes.
   */
  breakpointChange: Observable<string>;

  /**
   * Caches platform breakpoint calculation
   */
  private isDesktopCache: boolean;

  private subcription: Subscription;

  constructor(
    @Inject('window') private window: Window,
    private windowResizeService: WindowResizeService) {
    this.resize = this.windowResizeService.resize.pipe(
      debounceTime(100), filter(() => !this.windowResizeService.isFullScreen()),
      map(() => this.getCurrentScreen()));
    this.breakpointChange =
      this.resize.pipe(map(screen => screen.breakpoint), distinctUntilChanged());
    this.updateIsDesktopCache();
  }

  isDesktop() {
    return this.isDesktopCache;
  }

  isMobile() {
    return !this.isDesktopCache;
  }

  getPlatform() {
    return this.isDesktopCache ? Platform.DESKTOP : Platform.MOBILE;
  }

  /**
   * Gives information about the current screen
   * @return Information about screen.
   */
  getCurrentScreen(): ScreenSize {
    const url = new URL(this.window.location.href);
    const size = this.getCurrentScreenSize();

    return {
      x: this.window.innerWidth,
      y: this.window.innerHeight,
      size: url.searchParams.has('force') ? 1000 : size,  // TODO remove this
                                                          // shit
      breakpoint: url.searchParams.has('force') ? 'LARGE' : Breakpoint[size],
    };
  }

  /**
   * Gives information about what breakpoint is active.
   * @return Minimum width of breakpoint.
   */
  getCurrentScreenSize(): number {
    const width = this.window.innerWidth;
    if (width < Breakpoint.SMALL) {
      return Breakpoint.EXTRA_SMALL;
    } else if (width < Breakpoint.MEDIUM) {
      return Breakpoint.SMALL;
    } else if (width < Breakpoint.LARGE) {
      return Breakpoint.MEDIUM;
    } else if (width < Breakpoint.EXTRA_LARGE) {
      return Breakpoint.LARGE;
    } else {
      return Breakpoint.EXTRA_LARGE;
    }
  }

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  /**
   * Caches the plataform breakpoint
   */
  private updateIsDesktopCache() {
    this.isDesktopCache = this.checkIsDesktop();
    this.breakpointChange.pipe(map(() => this.checkIsDesktop()))
      .subscribe(isDesktop => this.isDesktopCache = isDesktop);
  }

  /**
   * Check platform Desktop or Mobile
   * @return true if is desktop
   */
  private checkIsDesktop() {
    const url = new URL(this.window.location.href);
    if (url.searchParams.has('force')) {
      return true;
    }
    return this.getCurrentScreenSize() >= Breakpoint.LARGE;
  }
}
