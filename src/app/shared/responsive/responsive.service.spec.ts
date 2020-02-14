import {async, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {ResponsiveService} from './responsive.service';

describe('Responsive service', () => {
  beforeEach(async(() => {
    TestBed
      .configureTestingModule(
        {declarations: [], providers: [{provide: 'window', useClass: WindowMock}]})
      .compileComponents();
  }));

  it(
    'Should execute resize event',
    inject(
      [ResponsiveService, 'window'],
      fakeAsync((service: ResponsiveService, w: WindowMock) => {
        service.resize.subscribe((size) => {
          expect(size.x).toBe(2560);
          expect(size.y).toBe(1600);
          expect(size.size).toBe(1200);
          expect(size.breakpoint).toBe('EXTRA_LARGE');
        });
        w.triggerListener();
        tick(110);
      })));

  it(
    'Should execute breakpoint change event properly',
    inject(
      [ResponsiveService, 'window'],
      fakeAsync((service: ResponsiveService, w: WindowMock) => {
        let arrayCompare = [];
        service.breakpointChange.subscribe(
          (breakpoint) => arrayCompare.push(breakpoint));
        w.triggerListener();
        tick(110);
        w.innerWidth = 1500;
        w.triggerListener();
        tick(110);
        w.innerWidth = 1000;
        w.triggerListener();
        tick(110);
        expect(arrayCompare.length).toBe(2);
        expect(arrayCompare).toEqual(['EXTRA_LARGE', 'LARGE']);
      })));

  it(
    'Should change cached isDesktop breakpoint if window change',
    fakeAsync(inject(
      [ResponsiveService, 'window'],
      (service: ResponsiveService, window: WindowMock) => {
        let breakpoints = [];
        service.breakpointChange.subscribe(
          (breakpoint) => breakpoints.push(breakpoint));
        window.triggerListener();
        tick(101);
        window.changeResolutionToMobile();
        tick(101);
        expect(breakpoints.length).toBe(2);
        expect(breakpoints).toEqual(['EXTRA_LARGE', 'EXTRA_SMALL']);
      })));
});


class WindowMock {
  location = {href: 'http://localhost/'};

  innerWidth = 2560;

  // noinspection JSUnusedGlobalSymbols
  innerHeight = 1600;

  callback: Function;

  document = {};

  // noinspection JSUnusedGlobalSymbols
  addEventListener(a, callback) {
    this.callback = callback;
  }

  // noinspection JSUnusedGlobalSymbols
  removeEventListener() {}

  triggerListener() {
    this.callback();
  }

  changeResolutionToMobile() {
    this.innerHeight = 400;
    this.innerWidth = 300;
    this.triggerListener();
  }
}
