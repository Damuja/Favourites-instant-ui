import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantFaresGridComponent } from './instant-fares-grid.component';

describe('InstantFaresGridComponent', () => {
  let component: InstantFaresGridComponent;
  let fixture: ComponentFixture<InstantFaresGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstantFaresGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantFaresGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
