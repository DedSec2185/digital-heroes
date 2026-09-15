// ==============================================================================
// DIGITAL HEROES (Level 1) - Charity Contribution Engine (§ 08)
// ==============================================================================

import { Charity, CharityCategory, SubscriptionPlan } from '../types';

export class CharityEngine {
  static MINIMUM_PERCENTAGE = 10.0;
  static DEFAULT_PERCENTAGE = 10.0;

  /**
   * Enforces minimum 10% contribution constraint (§ 08.1)
   */
  static validatePercentage(percentage: number): { valid: boolean; corrected: number } {
    if (isNaN(percentage) || percentage < this.MINIMUM_PERCENTAGE) {
      return { valid: false, corrected: this.MINIMUM_PERCENTAGE };
    }
    if (percentage > 100) {
      return { valid: false, corrected: 100 };
    }
    return { valid: true, corrected: Math.round(percentage * 10) / 10 };
  }

  /**
   * Computes charitable dollar amount directed from subscription payment
   */
  static calculateSubscriptionDonation(
    plan: SubscriptionPlan,
    customPercentage: number = 10
  ): {
    subscriptionAmount: number;
    charityPercentage: number;
    charityAmount: number;
    prizePoolAllocation: number;
    platformAllocation: number;
  } {
    const subscriptionAmount = plan === 'monthly' ? 19.99 : 180.00;
    const validated = this.validatePercentage(customPercentage).corrected;

    const charityAmount = Math.round((subscriptionAmount * (validated / 100)) * 100) / 100;
    // 50% fixed to prize pool
    const prizePoolAllocation = Math.round((subscriptionAmount * 0.50) * 100) / 100;
    const platformAllocation = Math.max(0, Math.round((subscriptionAmount - charityAmount - prizePoolAllocation) * 100) / 100);

    return {
      subscriptionAmount,
      charityPercentage: validated,
      charityAmount,
      prizePoolAllocation,
      platformAllocation,
    };
  }

  /**
   * Filter and search charities by text query and category (§ 08.2)
   */
  static filterCharities(
    charities: Charity[],
    searchQuery: string = '',
    selectedCategory: string = 'All'
  ): Charity[] {
    const query = searchQuery.trim().toLowerCase();

    return charities.filter(c => {
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesQuery = 
        !query || 
        c.name.toLowerCase().includes(query) || 
        c.tagline.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }
}
