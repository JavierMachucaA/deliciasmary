import { BrandComponent } from '../components/brand/brand.component';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';
import { REFRESH_BRAND } from '../enum/refresh-brand.enum';
import { EventEmitter } from '@angular/core';

export class BrandHandler extends EventTarget{
    public slides = [
		{ image: '/assets/img/content/brand/first.jpg' },
		{ image: '/assets/img/content/brand/second.jpg' },
		{ image: '/assets/img/content/brand/tematico.jpg' },
		{ image: '/assets/img/content/brand/tematico2.jpg' }];
	public titles_brand = [
		{ title: 'Tenemos diferentes entregas para regalo🎁' },
		{ title: 'Diferentes opciones en contenido 🤔' },
		{ title: 'Bandejas para los más pequeños 🤗' },
		{ title: 'Hasta dinosaurios Graaaaarg 🙉' }];
	public texts = [
		{
			text: 'Podemos entregar nuestras bandejas para tus seres queridos en sus días 🍰🎂🥳' + '.' +
				'Con un contenido y adorno dependiento la ocasión que lo requiera 😎'
		},
		{ text: 'No solamente ofrecemos bandejas, sino diferentes opciones y productos diferentes. Por ejemplo, plantas, dulces, conservas, y varios productos, para ti o los que quieras 🤯' },
		{ text: 'Si quieres un desayuno para tu sobrino o hijo pequeño tenemos diferentes selecciones o adornos que te permitirán darle una sopresa maravillosa y deliciosa 👦👧🧒😋 ' },
		{ text: 'Nos hemos encontrados con fanáticos de algunas tematicas, nos importa que puedas dar un regalo dedicado y único. Aquí tenemos uno para un amiguito que le encantan los dinosaurios ! 🦕🦖' }
    ];
    
    private subscription: Subscription;
	public searchEndDate: moment.Moment;
	public everySecond: Observable<number>;
	
    public slide: string;
	public title_brand: string;
	public text: string;
	
	public remainingTime: number;
	// public minutes: number;
	public seconds: number;

	public index: number;
	public firstIndex : number;
    public lenght : number;

    public everyInMinutes : number ;
    
    constructor(private brandView: BrandComponent, 
                private searchDate: moment.Moment = moment(), 
                private elapsTime: number = 0.5, 
                private TimerExpired: EventEmitter<any> = new EventEmitter<any>()) {
        super();
    }

    public setup(): void{
        this.everyInMinutes = this.elapsTime * 1000;
		this.index = 0;
		this.firstIndex = 0;
		this.lenght = this.slides.length ;
		this.brandView.title_brand = this.titles_brand[this.index].title;
		this.brandView.text = this.texts[this.index].text;
        this.brandView.slide = this.slides[this.index].image;
        this.everySecond = timer(0, this.everyInMinutes); 
    }

    public cicle (): void{
        this.subscription = this.everySecond.subscribe(async (seconds) => {

			var currentTime: moment.Moment = moment();
			this.remainingTime = this.brandView.searchEndDate.diff(currentTime)
			this.remainingTime = this.remainingTime / 1000;

			await this.changeBrand(REFRESH_BRAND.BYTIME);
		});
    }

    public async changeBrand(refresh: REFRESH_BRAND) {
		if (refresh == REFRESH_BRAND.NEXT || 
			refresh == REFRESH_BRAND.BYTIME && this.remainingTime <= 0) {
			this.index++;
		} 
		
		if (refresh == REFRESH_BRAND.BACK) {
			this.index--;
		}

		this.index = (this.index < 0 ? this.lenght : (this.index == this.lenght ? this.firstIndex : this.index));

		if (refresh == REFRESH_BRAND.BYTIME && this.remainingTime <= 0 || 
			refresh == REFRESH_BRAND.NEXT || 
			refresh == REFRESH_BRAND.BACK) {

			await this.clearBrand(refresh == REFRESH_BRAND.BYTIME);
			this.brandView.title_brand = this.titles_brand[this.index].title;
			this.brandView.text = this.texts[this.index].text;
			this.brandView.slide = this.slides[this.index].image;

			this.searchDate = moment();
			this.brandView.searchEndDate = this.searchDate.add(this.elapsTime, 'minutes');
			this.TimerExpired.emit();
		} 
		
		// update minuts and seconds
		this.brandView.minutes = Math.floor(this.remainingTime / 60);
		this.brandView.seconds = Math.floor(this.remainingTime - this.brandView.minutes * 60);

		// allow show the new change on view
		this.brandView.ref.markForCheck();
	}

	public async clearBrand(byTime: boolean = true): Promise<any> {
		if (byTime && this.remainingTime == 2) {
            this.slide = null;
            this.brandView.ref.markForCheck();
		}
		if (!byTime) {
            this.slide = null;
            this.brandView.ref.markForCheck();
			await this.delay(200);
		}
	}

	public delay(ms: number): Promise<any> {
		return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    public run() : void{
        this.setup();
        this.cicle();
    }
}