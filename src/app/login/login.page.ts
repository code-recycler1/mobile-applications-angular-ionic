import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {AuthService} from '../data/services/auth.service';
import {ModalController, IonicSwiper} from '@ionic/angular';
import SwiperCore, {SwiperOptions} from 'swiper';
import {SwiperComponent} from 'swiper/angular';

SwiperCore.use([IonicSwiper]);

enum Segment {
  login = 'Log in',
  signup = 'Sign up',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isNative = Capacitor.isNativePlatform();

  config: SwiperOptions = {
    initialSlide: 0
  };
  segments: Segment[] = Object.values(Segment);
  selectedSegment: Segment = Segment.login;

  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  constructor(public authService: AuthService, private modalController: ModalController, private ngZone: NgZone) {
  }

  ngOnInit(): void {
  }

  /**
   * Handles the segment changed event.
   * Updates the active index of the swiper based on the selected segment.
   */
  segmentChanged(): void {
    const i = this.segments.indexOf(this.selectedSegment);
    this.swiper?.swiperRef.slideTo(i, 500);
  }

  /**
   * Handles the change event when the active index of the swiper changes.
   * Updates the selected segment based on the active index.
   */
  onActiveIndexChange(): void {
    const activeIndex = this.swiper?.swiperRef.activeIndex;
    if (activeIndex !== undefined) {
      this.ngZone.run(() => this.selectedSegment = this.segments[activeIndex]);
    }
  }
}
