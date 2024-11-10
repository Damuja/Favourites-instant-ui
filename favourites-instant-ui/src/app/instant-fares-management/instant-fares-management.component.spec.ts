import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantFaresManagementComponent } from './instant-fares-management.component';

describe('InstantFaresManagementComponent', () => {
  let component: InstantFaresManagementComponent;
  let fixture: ComponentFixture<InstantFaresManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstantFaresManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantFaresManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
