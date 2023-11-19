import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmpSearchComponent } from './kmp-search.component';

describe('KmpSearchComponent', () => {
  let component: KmpSearchComponent;
  let fixture: ComponentFixture<KmpSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KmpSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KmpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
