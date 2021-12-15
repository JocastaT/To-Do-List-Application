import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewemailPage } from './newemail.page';

describe('NewemailPage', () => {
  let component: NewemailPage;
  let fixture: ComponentFixture<NewemailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewemailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewemailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
