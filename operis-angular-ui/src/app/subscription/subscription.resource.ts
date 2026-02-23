import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface SubscriptionPlanResponse {
  plan: 'FREE' | 'PREMIUM';
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionsResource {
   private readonly baseUrl =  environment.apiUrl + '/api/v1/subscriptions';

  constructor(private http: HttpClient) {}
  
  private premiumSignal = signal<boolean>(false);
  private loadedSignal = signal<boolean>(false);

  /**
   * Load current user subscription from backend
   * Call this once after login / app init
   */
  async loadMySubscription(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<SubscriptionPlanResponse>(`${this.baseUrl}/me`)
      );

      this.premiumSignal.set(res.plan === 'PREMIUM');
      this.loadedSignal.set(true);
    } catch (error) {
      console.error('Failed to load subscription', error);
      this.premiumSignal.set(false);
      this.loadedSignal.set(true);
    }
  }

  /**
   * Used by Navbar / AI button gating
   */
  isPremium(): boolean {
    return this.premiumSignal();
  }

  /**
   * Optional: for UI guards/spinners
   */
  isLoaded(): boolean {
    return this.loadedSignal();
  }

  /**
   * Calls backend to create Stripe Checkout session
   * Backend returns { checkoutUrl }
   */
  async createCheckoutSession(): Promise<CheckoutResponse> {
    return firstValueFrom(
      this.http.post<CheckoutResponse>(
        `${this.baseUrl}/checkout`,
        {}
      )
    );
  }

  /**
   * Optional helper after successful payment
   * (refresh subscription status)
   */
  async refresh(): Promise<void> {
    await this.loadMySubscription();
  }

}

