import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import { REFRESH_BRAND } from '../../enum/refresh-brand.enum';
import { BrandHandler } from '../../handlers/brand.handler';

@Component({
	selector: 'brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.scss'],
	animations: [
		// the fade-in/fade-out animation.
		 trigger('simpleFadeAnimation', [

			// the 'in' style determines the 'resting' state of the element when it is visible.
			state('in', style({ opacity: 1 })),

			// fade in when created. this could also be written as transition('void => *')
			transition(':enter', [
				style({ opacity: 0 }),
				animate(400)
			]),

			// fade out when destroyed. this could also be written as transition('void => *')
			/*transition(':leave',
				animate(400, style({ opacity: 0 })))*/
		])
	]
})
export class BrandComponent implements OnInit,OnDestroy {
	@Output() TimerExpired: EventEmitter<any> = new EventEmitter<any>();
	@Input() searchDate: moment.Moment = moment();
	@Input() elapsTime: number = 0.5;

	public slides = [
		{ image: '/assets/img/content/brand/first.jpg' },
		{ image: '/assets/img/content/brand/second.jpg' },
		{ image: '/assets/img/content/brand/tematico.jpg' },
		{ image: '/assets/img/content/brand/tematico2.jpg' },
		{ image: '/assets/img/content/brand/products.jpg' },
	];
	public titles_brand = [
		{ title: 'Tenemos diferentes entregas para regalo🎁' },
		{ title: 'Diferentes opciones en contenido 🤔' },
		{ title: 'Bandejas para los más pequeños 🤗' },
		{ title: 'Hasta dinosaurios Graaaaarg 🙉' },
		{ title: 'Algunos de nuestros productos 😋'}

	];
	public texts = [
		{
			text: 'Podemos entregar nuestras bandejas para tus seres queridos en sus días 🍰🎂🥳' + '.' +
				'Con un contenido y adorno dependiento la ocasión que lo requiera 😎'
		},
		{ text: 'No solamente ofrecemos bandejas, sino diferentes opciones y productos diferentes. Por ejemplo, plantas, dulces, conservas, y varios productos, para ti o los que quieras 🤯' },
		{ text: 'Si quieres un desayuno para tu sobrino o hijo pequeño tenemos diferentes selecciones o adornos que te permitirán darle una sopresa maravillosa y deliciosa 👦👧🧒😋 ' },
		{ text: 'Nos hemos encontrados con fanáticos de algunas tematicas, nos importa que puedas dar un regalo dedicado y único. Aquí tenemos uno para un amiguito que le encantan los dinosaurios ! 🦕🦖' },
		{ text: 'Tenemos dulces de leche, mermeladas, conservas, quesos entre varias cosas.'}
	];

	private subscription: Subscription;
	public searchEndDate: moment.Moment;
	public everySecond: Observable<number>;
	public brandHandler: BrandHandler ;
	
	public slide: string;
	public title_brand: string;
	public text: string;
	
	public remainingTime: number;
	public minutes: number;
	public seconds: number;

	public index: number;
	public firstIndex : number;
	public lastIndex : number;

	public readonly REFRESH_BRAND = REFRESH_BRAND;

	constructor(public ref: ChangeDetectorRef) {
		this.searchEndDate = this.searchDate.add(this.elapsTime, 'minutes');
	}

	ngOnInit() {
		/*this.brandHandler = new BrandHandler(this);
		this.brandHandler.run();*/
		let everyInMinutes = this.elapsTime * 1000;
		this.index = 0;
		this.firstIndex = 0;
		this.lastIndex = this.slides.length;
		this.title_brand = this.titles_brand[this.index].title;
		this.text = this.texts[this.index].text;
		this.slide = this.slides[this.index].image;
		this.everySecond = timer(0, everyInMinutes); //    
		this.subscription = this.everySecond.subscribe((seconds) => {

			var currentTime: moment.Moment = moment();
			this.remainingTime = this.searchEndDate.diff(currentTime)
			this.remainingTime = this.remainingTime / 1000;

			this.changeBrand(REFRESH_BRAND.BYTIME);
		});
		
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public async changeBrand(refresh: REFRESH_BRAND) {
		if (refresh == REFRESH_BRAND.NEXT || 
			refresh == REFRESH_BRAND.BYTIME && this.remainingTime <= 0) {
			this.index++;
		} 
		
		if (refresh == REFRESH_BRAND.BACK) {
			this.index--;
		}

		this.index = (this.index < 0 ? this.lastIndex : (this.index == this.lastIndex ? this.firstIndex : this.index));

		if (refresh == REFRESH_BRAND.BYTIME && this.remainingTime <= 0 || 
			refresh == REFRESH_BRAND.NEXT || 
			refresh == REFRESH_BRAND.BACK) {

			await this.clearBrand(false);
			this.title_brand = this.titles_brand[this.index].title;
			this.text = this.texts[this.index].text;
			this.slide = this.slides[this.index].image;

			this.searchDate = moment();
			this.searchEndDate = this.searchDate.add(this.elapsTime, 'minutes');
			this.TimerExpired.emit();
		} 
		
		// update minuts and seconds
		this.minutes = Math.floor(this.remainingTime / 60);
		this.seconds = Math.floor(this.remainingTime - this.minutes * 60);

		// allow show the new change on view
		this.ref.markForCheck();
	}

	public async clearBrand(byTime: boolean = true) {
		if (byTime && this.remainingTime == 2) {
			this.slide = null;
		}
		if (!byTime) {
			this.slide = null;
			await this.delay(400);
		}
	}

	public delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}
