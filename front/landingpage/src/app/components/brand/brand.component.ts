import { Component, OnInit,Output,  EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription, Observable, timer } from 'rxjs';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
	])
	
  ]
})
export class BrandComponent implements OnInit {

  
  public slides = [{'image': '/assets/img/content/brand/first.jpg'}, {'image': '/assets/img/content/brand/second.jpg'},{'image': '/assets/img/content/brand/tematico.jpg'}, {'image': '/assets/img/content/brand/tematico2.jpg'},];

  private subscription: Subscription;
	@Output() TimerExpired: EventEmitter<any> = new EventEmitter<any>();
	@Input() SearchDate: moment.Moment = moment();
	@Input() ElapsTime: number = 0.10;

	public searchEndDate: moment.Moment;
	public remainingTime: number;
	public minutes: number;
	public seconds: number;
	public slide : string;
	public index : number;
	

	public everySecond: Observable<number> ;

	constructor(private ref: ChangeDetectorRef) {
		this.searchEndDate = this.SearchDate.add(this.ElapsTime, "minutes");
	}

	ngOnInit() {
    let everyInMinutes = this.ElapsTime * 1000 ;
    this.index = 0;
	this.slide = this.slides[this.index++].image;	
    this.everySecond = timer(0, everyInMinutes);
		this.subscription = this.everySecond.subscribe((seconds) => {
			
			var currentTime: moment.Moment = moment();
			this.remainingTime = this.searchEndDate.diff(currentTime)
			this.remainingTime = this.remainingTime / 1000;
			
			if (this.remainingTime == 2){
				this.slide = null;
			}
			if (this.remainingTime <= 0) {
				this.slide = this.slides[this.index++].image;	
			}
			if (this.remainingTime <= 0) {
				this.SearchDate = moment();
				this.searchEndDate = this.SearchDate.add(this.ElapsTime, "minutes");
				this.TimerExpired.emit();
			}
			else {
				this.minutes = Math.floor(this.remainingTime / 60);
				this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
			}
			this.ref.markForCheck();
			if (this.index == (this.slides.length) )
			{
				this.index = 0;
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
