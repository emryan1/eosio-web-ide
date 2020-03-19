import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellTicketsComponent } from './sell-tickets.component';

describe('SellTicketsComponent', () => {
  let component: SellTicketsComponent;
  let fixture: ComponentFixture<SellTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
